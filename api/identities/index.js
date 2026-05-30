// Azure Function: GET /api/identities
// Deploy alongside Static Web App — no CORS needed, same origin

const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let _token = null, _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const params = new URLSearchParams({
    client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default", grant_type: "client_credentials"
  });
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, { method: "POST", body: params });
  const data = await res.json();
  if (!data.access_token) throw new Error(JSON.stringify(data));
  _token = data.access_token;
  _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return _token;
}

async function graphGetAll(path, qs = "") {
  const token = await getToken();
  let url = `https://graph.microsoft.com/v1.0${path}${qs ? "?" + qs : ""}`;
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

function classify(user, adminIds) {
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

module.exports = async function (context, req) {
  try {
    const [users, roles] = await Promise.all([
      graphGetAll("/users", "$select=id,displayName,userPrincipalName,accountEnabled,jobTitle,department,createdDateTime"),
      graphGetAll("/directoryRoles")
    ]);
    const adminIds = new Set();
    const privRoles = roles.filter(r => /admin|privileged/i.test(r.displayName));
    await Promise.all(privRoles.slice(0, 6).map(async r => {
      try { (await graphGetAll(`/directoryRoles/${r.id}/members`, "$select=id")).forEach(m => adminIds.add(m.id)); } catch {}
    }));
    const identities = users.map(u => classify(u, adminIds));
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
    context.res = { status: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ summary, identities }) };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
};
