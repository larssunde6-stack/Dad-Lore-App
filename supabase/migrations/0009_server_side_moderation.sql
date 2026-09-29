-- Dad Lore App — server-side content filter for user-submitted
-- activities (App Store Review Guideline 1.2: UGC apps need a real
-- content filter, not just client-side UX). Until now the only check
-- was containsBlockedContent() in src/utils/moderation.ts, which runs
-- in the app before the insert — anyone calling the Supabase REST API
-- directly (or a modified client) bypassed it entirely, since the RLS
-- insert policy on `activities` only checks `auth.uid() = created_by`,
-- nothing about the content itself. This adds a real backstop: a
-- BEFORE INSERT/UPDATE trigger that rejects a row outright if its
-- title, blurb, or any tag contains a blocked term. The client-side
-- check stays as-is for instant feedback; this is the enforcement that
-- can't be skipped.
--
-- `blocked_terms` is a plain table, not a hardcoded list, so you can
-- extend it later (insert into public.blocked_terms (term) values
-- ('whatever')) without a new migration or a redeploy. The seed below
-- is a starter set — common profanity plus the three sexual-content
-- terms already in moderation.ts's client-side list (nudes, sexting,
-- onlyfans) — not an exhaustive slur/profanity database. Review and
-- extend it to match your actual moderation policy before relying on
-- it as your only line of defense; it's meant to close the "trivially
-- bypassed" gap, not to replace human moderation of filed reports.

create table if not exists public.blocked_terms (
  term text primary key
);

-- RLS on: nobody (anon or authenticated) can read or write this table
-- through the client. It's only ever touched via the Supabase SQL
-- Editor / a future admin tool using the service_role key — the same
-- posture already used for `reports`.
alter table public.blocked_terms enable row level security;

insert into public.blocked_terms (term) values
  ('fuck'), ('shit'), ('bitch'), ('asshole'), ('bastard'), ('cunt'),
  ('nigger'), ('faggot'), ('retard'),
  ('nudes'), ('sexting'), ('onlyfans')
on conflict (term) do nothing;

create or replace function public.check_activity_content()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  haystack text;
  hit text;
begin
  haystack := lower(coalesce(new.title, '') || ' ' || coalesce(new.blurb, '') || ' ' || array_to_string(coalesce(new.tags, '{}'), ' '));

  select term into hit
  from public.blocked_terms
  where haystack like '%' || lower(term) || '%'
  limit 1;

  if hit is not null then
    raise exception 'Content not allowed: contains a blocked term.'
      using errcode = '23514'; -- check_violation, so the client's Postgrest
                                -- error surfaces as a 400 it can show inline
  end if;

  return new;
end;
$$;

drop trigger if exists check_activity_content_trigger on public.activities;
create trigger check_activity_content_trigger
  before insert or update on public.activities
  for each row
  execute function public.check_activity_content();
