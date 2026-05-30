export default async function(context, req) {
  const TENANT_ID = process.env.TENANT_ID;
  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;

  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    context.res = { status: 500, body: JSON.stringify({ error: "Missing env vars", hasTenant: !!TENANT_ID, hasClient: !!CLIENT_ID, hasSecret: !!CLIENT_SECRET }) };
    return;
  }

  try {
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
    const usersRes = await fetch(
      "https://graph.microsoft.com/v1.0/users?$select=id,displayName,userPrincipalName,accountEnabled,jobTitle,department,createdDateTime",
      { headers: { Authorization: "Bearer " + tokenData.access_token } }
    );
    const usersData = await usersRes.json();
    if (usersData.error) {
      context.res = { status: 500, body: JSON.stringify({ error: usersData.error.message }) };
      return;
    }
    const identities = usersData.value.map(u => ({
      id: u.id, name: u.displayName, upn: u.userPrincipalName,
      type: "human", role: u.jobTitle || "User", dept: u.department || "—",
      lastLogin: "active", status: u.accountEnabled ? "active" : "disabled", risk: "low"
    }));
    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ summary: { total: identities.length }, identities }) };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
