export default async function(context, req) {
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "ok",
      node: process.version,
      env: {
        hasTenant: !!process.env.TENANT_ID,
        hasClient: !!process.env.CLIENT_ID,
        hasSecret: !!process.env.CLIENT_SECRET
      }
    })
  };
}
