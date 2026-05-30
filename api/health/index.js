module.exports = async function(context, req) {
  context.res = {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "ok", time: new Date().toISOString() })
  };
};
