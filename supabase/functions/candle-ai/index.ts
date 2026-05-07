// Ember & Oak — Scent Concierge edge function (streaming)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CATALOG = `
Ember & Oak catalog (prices in USD):
- Vanilla Noir ($48, Warm) — bourbon vanilla, tonka bean, cocoa, sandalwood, amber. 55h burn.
- Lavender Calm ($42, Calm) — French lavender, chamomile, linen, white musk. 50h. Great for sleep / bedrooms.
- Oud Royale ($68, Bold) — saffron, oud, rose, leather, amber. 60h. Statement scent for living rooms.
- Rose Élysée ($52, Warm) — pink pepper, damask rose, peony, patchouli. 55h.
- Ocean Drift ($44, Fresh) — sea salt, bergamot, driftwood, vetiver. 52h. Bright, airy, mornings.
- Café Maison ($46, Warm) — espresso, cocoa, hazelnut, vanilla, cedar. 54h. Kitchens, mornings, gifting.
`;

const SYSTEM = `You are the Scent Concierge for Ember & Oak, a luxury handcrafted candle brand.
Voice: warm, calm, lightly poetic but concise. Never pushy. You may use short markdown lists.
Always ground recommendations in the real catalog below — never invent products or prices.
When suggesting candles, name them and briefly say WHY they fit the user's mood, room, or moment.
If asked about shipping/orders/returns: free shipping over $80, hand-wrapped, 30-day returns on unburned candles.
${CATALOG}`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });

    if (res.status === 429)
      return new Response(JSON.stringify({ error: "Rate limited, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (res.status === 402)
      return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!res.ok) {
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      return new Response(JSON.stringify({ error: "Concierge unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(res.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
