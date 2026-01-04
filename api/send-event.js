// api/send-event.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { session_token, event_type, data } = req.body || {};
    
    if (!session_token) {
      return res.status(400).json({ error: "Missing session_token" });
    }
    if (!event_type) {
      return res.status(400).json({ error: "Missing event_type" });
    }

    const payload = {
      type: event_type,
      ...(data && { data })
    };

    const r = await fetch("https://api.liveavatar.com/v1/sessions/event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "accept": "application/json",
        "authorization": `Bearer ${session_token}`
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    if (!r.ok) {
      return res.status(r.status).send(text);
    }

    return res.status(200).send(text);
  } catch (e) {
    return res.status(500).json({ 
      error: "Send event handler failed", 
      details: String(e?.message || e) 
    });
  }
}
