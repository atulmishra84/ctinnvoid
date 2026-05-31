// Azure Function: POST /api/chat
// Proxies Anthropic API server-side — API key never exposed to browser

export default async function(context, req) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    context.res = { status: 500, body: JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }) };
    return;
  }

  try {
    const { messages, system, max_tokens = 1000 } = req.body || {};

    if (!messages || !Array.isArray(messages)) {
      context.res = { status: 400, body: JSON.stringify({ error: "messages array required" }) };
      return;
    }

    const payload = {
      model: "claude-sonnet-4-20250514",
      max_tokens,
      messages,
    };
    if (system) payload.system = system;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": ANTHROPIC_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    context.res = {
      status: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    context.res = { status: 500, body: JSON.stringify({ error: err.message }) };
  }
}
