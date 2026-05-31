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

    // Fetch groups + directory roles in parallel
    const [groups, roles, users] = await Promise.all([
      graphGetAll("https://graph.microsoft.com/v1.0/groups?$select=id,displayName,groupTypes,securityEnabled,mailEnabled,createdDateTime,description,membershipRule"),
      graphGetAll("https://graph.microsoft.com/v1.0/directoryRoles"),
      graphGetAll("https://graph.microsoft.com/v1.0/users?$select=id,displayName,userPrincipalName,accountEnabled,jobTitle,department,createdDateTime")
    ]);

    // Get member counts for top groups
    const groupsWithCounts = await Promise.all(
      groups.slice(0, 50).map(async g => {
        try {
          const res = await fetch(
            `https://graph.microsoft.com/v1.0/groups/${g.id}/members/$count`,
            { headers: { Authorization: "Bearer " + token, ConsistencyLevel: "eventual" } }
          );
          const count = await res.text();
          return { ...g, memberCount: parseInt(count) || 0 };
        } catch { return { ...g, memberCount: 0 }; }
      })
    );

    // Classify groups by risk
    function groupRisk(g) {
      const name = (g.displayName || "").toLowerCase();
      if (/global.admin|privileged|security.admin|emergency|break.glass/.test(name)) return "critical";
      if (/admin|owner|root|superuser/.test(name)) return "high";
      if (/all.users|everyone|all.employees/.test(name)) return "medium";
      return "low";
    }

    // Build department summary from users
    const deptMap = {};
    users.forEach(u => {
      const dept = u.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { count: 0, enabled: 0, disabled: 0 };
      deptMap[dept].count++;
      if (u.accountEnabled) deptMap[dept].enabled++;
      else deptMap[dept].disabled++;
    });

    const enrichedGroups = groupsWithCounts.map(g => ({
      id: g.id,
      name: g.displayName,
      type: g.groupTypes?.includes("Unified") ? "Microsoft 365" : g.securityEnabled ? "Security" : "Distribution",
      memberCount: g.memberCount,
      risk: groupRisk(g),
      created: g.createdDateTime ? Math.floor((Date.now() - new Date(g.createdDateTime)) / 86400000) + "d ago" : "Unknown",
      dynamic: !!g.membershipRule,
      description: g.description || "—"
    }));

    const summary = {
      totalGroups: groups.length,
      securityGroups: groups.filter(g => g.securityEnabled).length,
      m365Groups: groups.filter(g => g.groupTypes?.includes("Unified")).length,
      criticalGroups: enrichedGroups.filter(g => g.risk === "critical").length,
      highGroups: enrichedGroups.filter(g => g.risk === "high").length,
      dynamicGroups: groups.filter(g => g.membershipRule).length,
      totalRoles: roles.length,
      departments: Object.entries(deptMap).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.count - a.count),
    };

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary, groups: enrichedGroups, roles: roles.map(r => ({ id: r.id, name: r.displayName, description: r.description })) })
    };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
