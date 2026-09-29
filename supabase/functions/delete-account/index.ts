// Deletes the calling user's Supabase Auth account entirely — the
// in-app account deletion Apple requires the moment an app offers
// account creation (App Store Review Guideline 5.1.1(v)).
//
// Every user-owned row is removed or anonymized automatically once the
// auth.users row is gone, via foreign keys already in place:
//   - saved_lore.user_id            on delete cascade  (0001_init.sql)
//   - activity_completions.user_id  on delete cascade  (0002_activity_completions.sql)
//   - completed_lore.user_id        on delete cascade  (0001_init.sql)
//   - reports.reporter_user_id      on delete set null (0001_init.sql)
//   - activities.created_by         on delete set null (0007_user_submitted_activities.sql)
// This function only has to delete the auth.users row — Postgres does
// the rest. Published activities keep their denormalized
// created_by_username (same tradeoff already accepted for renames) so
// they don't vanish for other users who saved/completed them.
//
// Deployed with default JWT verification ON, so only a request carrying
// the caller's own valid session reaches this code — the target user id
// is derived from that verified JWT, never taken from the request body,
// so nobody can delete an account that isn't their own. The service-role
// key needed for the actual admin.deleteUser call is the
// SUPABASE_SERVICE_ROLE_KEY env var, which the Supabase platform injects
// into every Edge Function automatically — it is never shipped to the
// client and there is nothing to configure.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' };

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  const jwt = authHeader?.replace(/^Bearer /i, '');
  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header.' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Could not verify the calling user.' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: jsonHeaders,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { headers: jsonHeaders });
});
