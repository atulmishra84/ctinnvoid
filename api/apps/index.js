export default async function(context, req) {
  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials"
    });
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      { method: "POST", body: params }
    );
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      context.res = { status: 500, body: JSON.stringify({ error: "Token failed", detail: tokenData }) };
      return;
    }
    const token = tokenData.access_token;

    async function graphGetAll(url) {
      let all = [], nextUrl = url;
      while (nextUrl) {
        const res = await fetch(nextUrl, { headers: { Authorization: "Bearer " + token } });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        all = all.concat(data.value || []);
        nextUrl = data["@odata.nextLink"] || null;
      }
      return all;
    }

    // Get ALL enterprise apps — both App Registrations and Enterprise Apps
    const [appRegs, enterpriseApps] = await Promise.all([
      graphGetAll("https://graph.microsoft.com/v1.0/applications?$select=id,displayName,createdDateTime,signInAudience,web,requiredResourceAccess"),
      graphGetAll("https://graph.microsoft.com/v1.0/servicePrincipals?$select=id,displayName,servicePrincipalType,accountEnabled,tags,appId,homepage,replyUrls")
    ]);

    // Categorise enterprise apps
    const SYSTEM_PREFIXES = ["Microsoft","Office","Azure","Windows","Bing","OneDrive","SharePoint","Teams","Skype","Yammer","Dynamics","Power ","AAD","MSFT","MSOnline","Graph"];
    const isSystem = name => SYSTEM_PREFIXES.some(p => name?.startsWith(p));

    // App registrations = things YOUR org built or registered
    const ownApps = appRegs.map(a => ({
      id: a.id, name: a.displayName, cat: "App Registration",
      ok: true, method: "Registered App", risk: "medium", owner: "IT",
      type: "registration", created: a.createdDateTime
    }));

    // Enterprise apps = 3rd party SaaS integrated via SSO
    const saasApps = enterpriseApps
      .filter(sp => !isSystem(sp.displayName) && sp.displayName && sp.displayName.length > 1)
      .filter(sp => sp.tags?.includes("WindowsAzureActiveDirectoryIntegratedApp") || sp.servicePrincipalType === "Application")
      .map(sp => ({
        id: sp.id, name: sp.displayName, cat: "Enterprise App",
        ok: true, method: "Entra SSO", risk: "low", owner: "IT",
        type: "enterprise", enabled: sp.accountEnabled
      }));

    // Deduplicate by name
    const seen = new Set();
    const allApps = [...ownApps, ...saasApps].filter(a => {
      if (seen.has(a.name)) return false;
      seen.add(a.name); return true;
    });

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integrated: allApps.length, apps: allApps })
    };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
