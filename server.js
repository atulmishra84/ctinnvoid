const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

const TENANT_ID = "71ee5ddd-1b7c-436d-acb1-0b260b2b2061";
const CLIENT_ID = "86496054-32bd-4f59-8c41-4a69f73a6905";
const CLIENT_SECRET = process.env.GRAPH_SECRET || "";

let _token = null, _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const params = new URLSearchParams({
    client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
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
    id: user.id,
    name: user.displayName,
    upn: user.userPrincipalName,
    type,
    role: isPriv ? "Privileged" : (user.jobTitle || "User"),
    dept: user.department || "—",
    lastLogin: created !== null ? `${created}d ago` : "Unknown",
    status,
    risk,
    accountEnabled: user.accountEnabled
  };
}

app.get("/api/identities", async (req, res) => {
  try {
    const [users, roles] = await Promise.all([
      graphGetAll("/users", "$select=id,displayName,userPrincipalName,accountEnabled,jobTitle,department,createdDateTime"),
      graphGetAll("/directoryRoles")
    ]);
    const adminIds = new Set();
    const privRoles = roles.filter(r => /admin|privileged/i.test(r.displayName));
    await Promise.all(privRoles.slice(0, 6).map(async r => {
      try {
        const members = await graphGetAll(`/directoryRoles/${r.id}/members`, "$select=id");
        members.forEach(m => adminIds.add(m.id));
      } catch {}
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
    res.json({ summary, identities });
  } catch (err) {
    console.error("❌ /api/identities error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/apps", async (req, res) => {
  try {
    const sps = await graphGetAll("/servicePrincipals", "$select=id,displayName,servicePrincipalType,accountEnabled,tags");
    const apps = sps
      .filter(sp => sp.tags?.includes("WindowsAzureActiveDirectoryIntegratedApp") || sp.servicePrincipalType === "Application")
      .map(sp => ({ id: sp.id, name: sp.displayName, cat: "SaaS", ok: true, method: "Entra SSO", risk: "low", owner: "IT" }));
    res.json({ integrated: apps.length, apps });
  } catch (err) {
    console.error("❌ /api/apps error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok", tenant: "IdenAccess.onmicrosoft.com", time: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`\n✅ CTInnvoID backend live → http://localhost:${PORT}\n`));
