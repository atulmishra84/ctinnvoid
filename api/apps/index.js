export default async function(context, req) {
  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  try {
    const params = new URLSearchParams({
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials"
    });
    const tokenRes = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, { method: "POST", body: params });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) { context.res = { status: 500, body: JSON.stringify({ error: "Token failed" }) }; return; }
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

    const sps = await graphGetAll(
      "https://graph.microsoft.com/v1.0/servicePrincipals?$select=id,displayName,servicePrincipalType,accountEnabled,tags,appId,homepage"
    );

    const apps = sps
      .filter(sp =>
        sp.tags?.includes("WindowsAzureActiveDirectoryIntegratedApp") ||
        (sp.servicePrincipalType === "Application" && sp.displayName)
      )
      .filter(sp => sp.displayName && sp.displayName.length > 1)
      .map(sp => ({
        id: sp.id,
        name: sp.displayName,
        cat: "SaaS",
        ok: true,
        method: "Entra SSO",
        risk: "low",
        owner: "IT",
        appId: sp.appId,
        enabled: sp.accountEnabled
      }));

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integrated: apps.length, apps })
    };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
