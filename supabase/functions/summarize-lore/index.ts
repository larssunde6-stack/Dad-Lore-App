// Turns a user's private diary note into a short, punchy "lore summary"
// without inventing new events. This is the real implementation behind
// the "Summarize My Lore" button (src/components/CompletedLoreCard.tsx),
// which otherwise falls back to a pre-written mock summary if this
// function isn't deployed or fails.
//
// Requires ANTHROPIC_API_KEY to be set as a function secret:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Deployed with default JWT verification ON (do not pass
// --no-verify-jwt), so only requests carrying a valid Supabase session
// (including anonymous sessions) reach this code - nobody can call it
// without going through the app's own anonymous sign-in first. The
// Anthropic key stays server-side; it is never sent to the client.

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const MODEL = 'claude-haiku-4-5-20251001';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on this function.' }),
      { status: 500, headers: jsonHeaders }
    );
  }

  let note: unknown;
  try {
    ({ note } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Request body must be JSON: { note: string }' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  if (typeof note !== 'string' || note.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'A non-empty "note" string is required.' }), {
      status: 400,
      headers: jsonHeaders,
    });
  }

  // Guard against absurdly long input inflating cost/latency.
  const trimmedNote = note.slice(0, 4000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        system:
          'You turn a personal diary entry into a short, punchy "lore summary" in an ' +
          'exaggerated storyteller voice - one or two sentences, under 220 characters. ' +
          'Never invent people, places, or events that are not in the original text. ' +
          'Only intensify tone, never facts. Reply with only the summary, no preamble.',
        messages: [{ role: 'user', content: trimmedNote }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `Anthropic API error: ${errText}` }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    const data = await response.json();
    const summary = data?.content?.[0]?.text?.trim() ?? '';

    if (!summary) {
      return new Response(JSON.stringify({ error: 'Empty summary returned.' }), {
        status: 502,
        headers: jsonHeaders,
      });
    }

    return new Response(JSON.stringify({ summary }), { headers: jsonHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
