# Before We Publish

A single scannable checklist of everything standing between this app and
a real App Store / Play Store submission. Each item links back to the
fuller explanation in `PRD.md` (or `PRIVACY.md`/`TERMS.md`) — this file
is the "what's left," not the "why." Check items off as they're closed;
don't delete them, so there's a record of what got fixed when.

## 🔴 Blockers — will get the app rejected or is a legal/compliance gap

- [ ] **UGC moderation is client-side only.** "Create Your Own Activity"
  ships public, auto-published, with real-time XP — but the only content
  filter is `src/utils/moderation.ts`, a word-list check trivially
  bypassed by calling the Supabase API directly. No server-side
  enforcement exists. This is squarely App Store review guideline 1.2
  territory. See `PRD.md` §5c and §10.
- [ ] **No way to block or mute an abusive account.** If someone spams
  low-quality or offensive activities, the only recourse today is
  manually deleting rows in the Supabase Table Editor. No in-app
  moderation tool, no account suspension.
- [ ] **No account deletion flow.** Apple requires in-app account
  deletion the moment any account system exists — real accounts landed
  this session, so this is now a hard requirement, not a someday item.
  See `PRD.md` §6/§11.
- [ ] **Published-content-policy coverage is disclosure-only.** `PRIVACY.md`/
  `TERMS.md` say what's public and that it must follow community
  guidelines, but there's no enforcement mechanism behind that promise
  yet (same gap as the two items above).
- [ ] **Legal doc placeholders still unfilled**:
  - `PRIVACY.md` §8 and `TERMS.md` §9 — real contact email
  - `TERMS.md` §8 — your actual governing-law jurisdiction
  - Both docs are still explicitly marked "Draft, pending legal review" —
    have an actual lawyer look at them before submission, especially
    given the minors-inclusive audience (COPPA) and the UGC gaps above.

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
