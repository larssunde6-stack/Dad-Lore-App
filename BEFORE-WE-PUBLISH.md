# Before We Publish

A single scannable checklist of everything standing between this app and
a real App Store / Play Store submission. Each item links back to the
fuller explanation in `PRD.md` (or `PRIVACY.md`/`TERMS.md`) — this file
is the "what's left," not the "why." Check items off as they're closed;
don't delete them, so there's a record of what got fixed when.

## 🔴 Blockers — will get the app rejected or is a legal/compliance gap

- [x] **UGC moderation is client-side only.** Closed: `0009_server_side_moderation.sql`
  adds a `blocked_terms` table + a `BEFORE INSERT/UPDATE` trigger on
  `activities` that rejects the row outright if its title/blurb/tags match
  a blocked term — can no longer be bypassed by calling the Supabase API
  directly. `src/utils/moderation.ts`'s client-side check stays for instant
  UX feedback; the trigger is the real enforcement. The seeded term list is
  a starter set, not exhaustive — extend `blocked_terms` to match your
  actual moderation policy before relying on it as your only defense.
- [ ] **No way to block or mute an abusive account.** If someone spams
  low-quality or offensive activities, the only recourse today is
  manually deleting rows in the Supabase Table Editor. No in-app
  moderation tool, no account suspension.
- [x] **No account deletion flow.** Closed: `supabase/functions/delete-account`
  (deploy with `supabase functions deploy delete-account`) deletes the
  caller's own `auth.users` row via the service-role key, verified from
  their own JWT. Every user-owned row cascades/anonymizes automatically via
  existing foreign keys (`saved_lore`, `activity_completions` cascade;
  `activities.created_by`, `reports.reporter_user_id` set null) — no manual
  cleanup needed. Wired to a "Delete Account" link on `ProfileScreen.tsx`
  (confirm dialog via `Alert.alert`, next to Log Out).
- [ ] **Published-content-policy coverage is disclosure-only.** `PRIVACY.md`/
  `TERMS.md` say what's public and that it must follow community
  guidelines — now backed by the server-side filter above, but there's
  still no way to suspend a repeat offender's account (see the item above).
- [x] **A genuinely dangerous activity was in the curated list.** Closed:
  `0008_replace_risky_activities.sql` replaces "Drift Behind a Car with a
  Rope" (real-world tow-surfing — a documented cause of serious injury and
  death) with "Learn to Wakeboard", and "Go Spark Drifting" (fire hazard,
  dubious legality) with "Ride an ATV Trail at Night" — both keep the same
  `id` (so existing saves/completions aren't affected) and the same
  risk/skill tier, just without content that reads as actively encouraging
  a specific lethal stunt. `src/data/activities.ts` updated to match.
- [x] **Privacy Policy wasn't linked at account creation.** Closed:
  `AuthScreen.tsx`'s Sign Up form now links Privacy Policy & Terms directly
  below the Create Account button, not just buried in Profile settings.
- [ ] **Legal doc placeholders still unfilled**:
  - `PRIVACY.md` §8 and `TERMS.md` §9 — real contact email
  - `TERMS.md` §8 — your actual governing-law jurisdiction
  - Both docs are still explicitly marked "Draft, pending legal review" —
    have an actual lawyer look at them before submission, especially
    given the minors-inclusive audience (COPPA) and the UGC gaps above.
  - **Can't be closed by an AI session** — these need real values only you
    can supply.

## 🟡 Should fix before a public/wide launch (not necessarily a hard blocker)

- [ ] **Session tokens sit in `localStorage` on the web build target**
  (via `AsyncStorage`). Accepted while every session was anonymous;
  real, password-protected accounts now exist, which raises the stakes.
  Revisit with an httpOnly-cookie approach if the web build gets real
  traffic. `PRD.md` §7/§11.
- [ ] **No 2FA, no password breach check.** Not required until
  admin/moderator accounts exist, but worth deciding on purpose rather
  than by default. `PRD.md` §11.
- [ ] **No rate limiting beyond Supabase's platform defaults** on auth
  endpoints (signup, login, password reset).
- [ ] **Email confirmation is off** and the anonymous→real-account upgrade
  path isn't hardened server-side against anonymous sessions (the "must
  have a real account to publish" gate on Create Activity is
  client-side only — see `PRD.md` §5c for the exact one-line RLS
  addition to close this once you can verify it against your live
  Supabase project).
- [ ] **`created_by_username` goes stale on rename.** If someone renames
  themselves after publishing an activity, old activities keep showing
  their previous username (no live lookup — denormalized by design,
  see `PRD.md` §5c). Cosmetic, but worth knowing before someone reports
  it as a bug.

## 🟢 Product decisions still genuinely open

- [ ] **Data source for activities**: curated list vs. a live location
  API. Recommendation in `PRD.md` §8 is to stay curated for v1.
- [ ] **Monetization**: free/ads/subscription — recommendation is free,
  no monetization, for v1. `PRD.md` §8.
- [ ] **No admin tool.** Content and moderation changes go through the
  Supabase SQL Editor / Table Editor directly. Fine for a small user
  base, won't scale.
- [ ] **Content curation is ongoing work**, not a one-time task, if you
  stay with the curated-list approach — needs an owner. `PRD.md` §12.

## ⚪ Required store logistics (not code — just needs doing)

- [ ] Apple Developer Program account ($99/year)
- [ ] Google Play Console account ($25 one-time)
- [ ] Read both stores' current review guidelines/policy in full, with
  the UGC/minors gaps above specifically in mind — don't rely on this
  checklist as a substitute for actually reading them
- [ ] Production app icon/splash, store screenshots, listing copy
  (`PRD.md` §11 Phase 4)
- [ ] Accessibility pass — `AccessibilityStatement.tsx` honestly
  describes the current unaudited state; an actual pass hasn't happened
  yet (`PRD.md` §9)

## Not required for v1, but worth deciding on purpose

- [ ] Crash reporting / analytics (e.g. Sentry) — nothing in place yet,
  fine for v1, flag before this becomes a "wish we knew what broke"
  problem post-launch. `PRD.md` §11 Phase 6.
- [ ] Offline behavior is undefined — works by accident today since
  everything routes through Supabase. `PRD.md` §9.

---

*Living document — update it as items close or new gaps get found,
don't let it drift out of sync with `PRD.md`.*
