export default async function(context, req) {
  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  try {
    // Get token
    const params = new URLSearchParams({
      client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials"
    });
    const tokenRes = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, { method: "POST", body: params });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      context.res = { status: 500, body: JSON.stringify({ error: "Token failed", detail: tokenData }) };
      return;
    }
    const token = tokenData.access_token;

    // Fetch ALL users — follow pagination
    async function graphGetAll(url) {
      let all = [];
      while (url) {
        const res = await fetch(url, { headers: { Authorization: "Bearer " + token } });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        all = all.concat(data.value || []);
        url = data["@odata.nextLink"] || null;
      }
      return all;
    }

    const [users, roles] = await Promise.all([
      graphGetAll("https://graph.microsoft.com/v1.0/users?$select=id,displayName,userPrincipalName,accountEnabled,jobTitle,department,createdDateTime"),
      graphGetAll("https://graph.microsoft.com/v1.0/directoryRoles")
    ]);

    // Get privileged role members
    const adminIds = new Set();
    const privRoles = roles.filter(r => /admin|privileged/i.test(r.displayName));
    await Promise.all(privRoles.slice(0, 6).map(async r => {
      try {
        const members = await graphGetAll(`https://graph.microsoft.com/v1.0/directoryRoles/${r.id}/members?$select=id`);
        members.forEach(m => adminIds.add(m.id));
      } catch {}
    }));

    // Classify
    function classify(user) {
      const upn = (user.userPrincipalName || "").toLowerCase();
      const name = (user.displayName || "").toLowerCase();
      const created = user.createdDateTime ? Math.floor((Date.now() - new Date(user.createdDateTime)) / 86400000) : null;
      let type = "human";
      if (/svc-|svc\.|_svc|service|bot|pipeline|agent|monitor/.test(name) || /^svc/.test(upn)) type = "service";
      else if (/vm-|machine|device|computer/.test(name)) type = "machine";
      else if (/#EXT#/.test(upn) || /ext-|vendor|partner|contractor|external/.test(name)) type = "vendor";
      else if (/local.admin|localadmin/.test(name)) type = "local";
      const isPriv = adminIds.has(user.id);
      const status = !user.accountEnabled ? "disabled" : "active";
      let risk = "low";
      if (type === "local" || (isPriv && type === "human")) risk = "critical";
      else if (isPriv || type === "service") risk = "high";
      else if (type === "vendor") risk = "medium";
      return {
        id: user.id, name: user.displayName, upn: user.userPrincipalName,
        type, role: isPriv ? "Privileged" : (user.jobTitle || "User"),
        dept: user.department || "—",
        lastLogin: created !== null ? `${created}d ago` : "Unknown",
        status, risk, accountEnabled: user.accountEnabled
      };
    }

    const identities = users.map(classify);
    const summary = {
      total: identities.length,
      human: identities.filter(x => x.type === "human").length,
      service: identities.filter(x => x.type === "service").length,
      machine: identities.filter(x => x.type === "machine").length,
      vendor: identities.filter(x => x.type === "vendor").length,
      local: identities.filter(x => x.type === "local").length,
      critical: identities.filter(x => x.risk === "critical").length,
      disabled: identities.filter(x => x.status === "disabled").length,
    };

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, identities })
    };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
