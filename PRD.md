# Dad Lore App — Product Requirements Document

**Status:** Draft v1 · **Stage:** Pre-backend prototype · **Owner:** Lars Sunde

---

## 1. Overview & Vision

Dad Lore helps young people — teens and twenty-somethings, well before
they're anyone's dad — find dumb, memorable stuff to do near them *now*
that turns into the stories they'll tell their kids someday. The pitch
isn't "activities for dads"; it's "go build the lore you'll be retelling
as a dad, starting tonight." Instead of a generic "things to do" app, it
frames every activity around one question: *will this be a good story
someday?* Activities are rated, tagged, and organized around that idea
(lore points, difficulty, tags like "Trailhead" or "Group Chat Material").

The current build is a fully-designed frontend prototype: browse, search
(UI only), save, and view activity detail, all running on placeholder data
with an orange-and-black "adventurous" design system. Nothing is wired to a
backend yet.

## 2. Problem Statement

Teens and young adults with a free night often default to whatever's
easiest — scrolling, staying in, the same three hangout spots — not
because nothing's around, but because nothing surfaces the *stuff worth
doing on purpose while you still can*. Generic local discovery apps (Yelp,
Google Maps) are built for restaurants and services, not for "give me
something dumb enough to be a great story in twenty years." Dad Lore fills
that specific gap: curated, personality-driven activity discovery aimed at
people who aren't dads yet, but are quietly stockpiling material for when
they are.

## 3. Target Users

- **Primary**: Teens and young adults (roughly high school through mid-20s)
  looking for something worth doing near them, solo or with friends —
  before the "responsible adult" phase of life sets in.
- **Secondary**: Anyone who enjoys the "collect stories, not stuff" framing
  regardless of age — actual dads included, just not the primary audience
  the v1 tone and marketing are built around.

## 4. Goals & Success Metrics

Pre-launch, "success" is about validating the concept cheaply. Once live:

- **Activation**: % of new users who view at least 3 activities in their
  first session.
- **Engagement**: activities saved per active user per week.
- **Retention**: % of users who return within 7 days.
- **Growth (later)**: installs via App Store / Play Store search and
  word-of-mouth share rate, once sharing exists.

These are directional, not committed targets — there's no live data yet to
calibrate against.

## 5. Scope

### In scope for v1

**MVP re-scope (current):** see §5a below — the diary and Map are paused,
not removed, in favor of a leaner core loop.

- Browse and **search** nearby "lore to do" (currently: static/curated
  list, client-side search; see §8 for the real-data decision).
- ~~A **Map** view of nearby lore, sorted by distance, handing off to
  Google/Apple Maps for actual directions rather than building
  navigation.~~ **Paused for MVP** — see §5a.
- Save/bookmark lore to do for later.
- **Mark an activity as done to earn XP**, landing it in the "Your Lore"
  tab — see §5a. Replaces the private diary as the v1 core loop.
- ~~A **private, personal "completed lore" diary** — explicitly never
  shown to other users — separate from the public browsable lore feed.
  Includes a "summarize my lore" action (currently mocked; see §6 and
  §11 Phase 2/3).~~ **Paused for MVP** — see §5a.
- View full activity detail (description, tags, "what you'll need," stats).
- A **Report** action on published lore, plus a moderation word-filter
  utility (not yet wired to any submission input — see Out of scope).
- Basic profile: lore points, activity history, badges — **live**, driven
  by real `activity_completions` rows (see §5a, §6).
- Everything required to legally and technically submit to the App Store
  and Play Store (see §10, §11).

### Out of scope for v1
- Social features (friends, sharing completed lore with other users —
  completed lore is private by design, see above).
- Ratings/reviews from other users.
- Multi-user groups or family accounts.
- **User-submitted lore** — there's a Report action and a moderation word
  filter, but no way to actually publish new lore yet. All public lore is
  curated/admin-managed in v1 (see the open decision in §8). Building a
  submission form is deliberately deferred until there's a backend to
  publish to and enforce moderation server-side.
- Push notifications / re-engagement campaigns.
- Monetization of any kind (see open decision in §8).
- ~~Real AI-generated lore summaries~~ — **done, pending your deploy
  step**: the Edge Function is written (`supabase/functions/
  summarize-lore`); see §11 Phase 2/3 for the one-time activation steps.

## 5a. MVP Re-scope: Complete → Earn XP → Your Lore

After Map and the private diary (notes + AI summary) were built out, the
core loop got re-scoped to something narrower and sharper: **browse
activities → mark one done → earn XP → see it in the "Your Lore" tab.**
No personal notes, no AI summary, no public/private debate on the
diary — that's deferred until there's real usage to justify it. Map is
paused too — true geo-discovery ("find hills near me") isn't solved by
the current fixed-coordinate approach (a curated list with hand-placed
lat/lng, not a live map), and shipping it as-is would over-promise.

**Nothing is deleted.** The diary (`CompletedLoreCard.tsx`,
`completedLore.ts`, the `completed_lore` table, the `summarize-lore`
Edge Function) and `MapScreen.tsx` stay fully intact in the repo, just
unwired from navigation — re-adding them later is a few import/
registration lines, not a rebuild. Report and moderation are untouched;
they were always tied to the public "lore to do" listings, never the
diary.

**What replaced them:**
- A new `activity_completions` table (`supabase/migrations/
  0002_activity_completions.sql`) logs each "Mark as Done" tap:
  `user_id`, `activity_id`, `xp_earned`, `completed_at`. Per-user
  SELECT/INSERT via RLS, same pattern as `saved_lore`. No UPDATE/DELETE
  yet — no "undo" in this pass.
- **XP formula**: `xp = activity.loreRating * 20` (range 20–100).
- **Activities are repeatable** — completing the same one again logs
  another entry and more XP, matching "collect lore" rather than a
  one-time checklist.
- **Honor system, deliberately** — "Mark as Done" just inserts a row;
  nothing verifies the activity actually happened. There's no
  leaderboard or social comparison in this app, so nobody's incentivized
  to lie to a tracker only they see (same trust model as Duolingo
  streaks or most habit trackers). Real verification (photo evidence,
  location-check) is a bigger ask than this MVP needs — both reopen
  complexity just deferred with the diary (UGC/moderation/storage) or
  are trivially spoofable. Revisit only if the app adds competitive/
  social features or actual abuse shows up.
- Profile's lore points, activities-done count, and badges are now
  **live**, computed from real `activity_completions` rows instead of
  hardcoded values.

## 5b. Explore Redesign: Filters replace categories, no more places

Following the MVP re-scope, Explore itself was overhauled: the app
dropped location entirely (no more `location`/`distance`/lat-lng on any
activity — this is now a flat list of things to go do, not nearby spots),
replaced the 7-category system with **three filter dimensions** — danger
level (green/yellow/red), Skill vs. Fun, and Type 1 Fun vs. Type 2 Fun
("in the moment" vs. "sucked then, great story now") — and reseeded the
catalog with 22 new activity ideas (placeholder lorem ipsum descriptions,
to be replaced with real copy later).

- `supabase/migrations/0003_activity_reseed.sql` drops `category`,
  `location`, `distance`, `latitude`, `longitude`, and `difficulty` from
  `activities`; adds `risk_level`, `kind`, `fun_type`; deletes the old 11
  rows and reseeds the new 22. This cascade-deletes any saves/completions
  tied to the old rows — a one-time reset, documented in the migration
  file itself.
- Each activity's card and detail hero now show a translucent background
  tinted by `risk_level` (green `#2D9B2B` / yellow `#FFD700` / red
  `#D40000` at 10% opacity) instead of a text difficulty label.
- The filter icon already built into `PillHeader` (previously unwired) now
  opens `FilterModal.tsx`, letting users filter Explore by any combination
  of the three dimensions, combined with the existing text search.
- The top bar across Explore/Your Lore/Profile now shows a computed
  `Lvl. XX` chip (`src/utils/level.ts`) instead of a raw lore-points
  count, and gained a profile-shortcut icon.
- **Map is now doubly paused** — beyond being unwired from navigation
  (§5a), `MapScreen.tsx` and `src/utils/openInMaps.ts` no longer even
  compile against the current `Activity` type (no more `coords`), so
  they're excluded from the TypeScript project in `tsconfig.json`. Both
  files are untouched on disk; re-enabling Map later means rebuilding its
  data model, not just re-registering the tab.

## 6. Core Features / User Stories

Mapped to what's already built in `src/screens/`:

| Screen | User story | Status |
|---|---|---|
| Explore | As a young person, I want to browse nearby lore grouped by relevance, so I can quickly find something worth doing. | **Live**: `ExploreScreen.tsx` reads from Supabase's `activities` table via `useActivities.ts`, not a hardcoded import. Content is still curated (same 11 rows, now in Postgres instead of `src/data/activities.ts`) — the data-source decision in §8 is about where content comes from long-term, not whether it's live. |
| Explore | As a young person, I want to search for lore ideas (activities, sidequests), so I can find something specific. | **Functional** client-side search (`TopBar.tsx` + `ExploreScreen.tsx`) — filters the now-live dataset by title/blurb/tags, combinable with the danger/Skill-Fun/Fun-Type filters from §5b. |
| Explore / Detail | As a young person, I want to bookmark lore, so I can come back to it later. | **Live**: `SavedContext.tsx` reads/writes Supabase's `saved_lore` table, scoped to an anonymous identity via Row Level Security. Survives app restarts; does not yet survive a reinstall or a new device (that needs real accounts, not just anonymous ones). |
| Map | As a young person, I want to see the closest lore to me on a map, and get directions without the app building its own navigation. | **Paused for MVP** (see §5a) — code intact in `MapScreen.tsx`, unregistered from the tab navigator. Real device geolocation (`expo-location`) sorts the live `activities` list by distance; "Directions" hands off to Google/Apple Maps via `Linking`. Map visual is a decorative banner, not an interactive map (see §7). |
| Lore (To Do) | As a young person, I want my saved lore in one place. | Frontend built (`LoreScreen.tsx`, "To Do" segment) — same Supabase-backed data as the Explore/Detail bookmark row above. |
| Lore (Completed) | As a young person, I want to mark lore I've done and earn XP for it, and see it in one place. | **Live** (re-scoped, see §5a): `LoreScreen.tsx`'s "Completed" segment reads Supabase's `activity_completions` table, joined client-side to the `activities` list, rendered via `ActivityCard` with a completed badge instead of the bookmark button. The private diary (`completed_lore` table, `CompletedLoreCard.tsx`, "Summarize My Lore") is **paused, not removed** — see §5a. |
| Activity Detail | As a young person, I want full details on a lore listing (what it takes, how long, difficulty) before committing. | Frontend built (`ActivityDetailScreen.tsx`), static placeholder copy; the activity data itself is live (see Explore row). |
| Activity Detail | As a young person, I want to mark an activity as done and earn XP for it. | **Live** (new, see §5a): the CTA button inserts a row into `activity_completions` (`xp_earned = loreRating * 20`) and shows a brief "+XP · Added to Your Lore" confirmation. Honor system — no completion verification. |
| Activity Detail | As a young person, I want to report lore that's inappropriate or unsafe. | **Live**: `ReportModal.tsx` inserts into Supabase's `reports` table (activity id, reason, reporter's anonymous user id). Nobody, including the reporter, can read reports back through the app — only a future moderator tool using the `service_role` key can, matching the UGC note in §10. |
| Profile | As a young person, I want to see my lore points, badges, and history, so progress feels earned. | **Live** (re-scoped, see §5a): `ProfileScreen.tsx` computes lore points and activities-done from real `activity_completions` rows, and badges from the categories of completed activities — no more hardcoded values. |

**New for publishing (not yet built):**
- ~~Persisted user identity~~ — **done**: anonymous Supabase auth
  (`AuthContext.tsx`) gives every device a stable identity that saves,
  completed lore, and reports are scoped to via Row Level Security. Real
  accounts (email/password, cross-device sync) are still future work —
  see the Security & Auth checklist under §11 Phase 2.
- ~~Lore points/badges on Profile are still hardcoded~~ — **done**: now
  derived from real `activity_completions` rows (see §5a).
- A real *editorial* dataset behind search/browse/map — the data now
  lives in Postgres instead of a TS file, but it's still the same 11
  curated placeholder rows (see §8's data-source decision, which is
  unchanged by this pass).
- An admin-side way to add/edit/remove lore (even a simple internal tool)
  since v1 assumes curated content, not user-submitted. Right now content
  changes happen by editing `supabase/migrations/0001_init.sql` and
  re-running it, or directly in the Supabase Table Editor.
- **Server-side enforcement for Report**: **done** — the `reports` table's
  Row Level Security policy only allows `INSERT`, from nobody but the
  authenticated (including anonymous) user, with no `SELECT`. The
  moderation word filter (`src/utils/moderation.ts`, wrapping `bad-words`)
  is still client-side only and still unattached to any input — there's
  still no lore-submission form for it to guard.
- ~~A real "summarize my lore" endpoint~~ — **done, pending your deploy
  step**: see §11 Phase 2/3.

## 7. Platform & Technical Approach

- **Framework**: Expo (SDK 57) + React Native — already in place, supports
  iOS and Android from one codebase.
- **Backend**: **Supabase — confirmed and live** (`src/lib/supabase.ts`).
  Auth is **anonymous-only for now** (`supabase.auth.signInAnonymously()`
  via `AuthContext.tsx`) — every device gets a stable identity with no
  email/password, matching the "no login requirement, minimal data
  collection" recommendation in §10. Real accounts (email/password, 2FA,
  cross-device sync) remain future work under the Security & Auth
  checklist in §11 Phase 2. Data access is authorized entirely through
  Postgres **Row Level Security** policies (`supabase/migrations/
  0001_init.sql`) — the actual server-side enforcement the checklist
  calls for, not a placeholder for it.
- **Session storage caveat**: Supabase's React Native integration stores
  the session in `AsyncStorage`. On native this is app-sandboxed; on this
  app's **web** build target, `AsyncStorage` is backed by `localStorage`
  — exactly what the checklist warns about for token storage. Accepted
  for now because these are low-stakes anonymous sessions with no
  password; revisit with the httpOnly-cookie approach the checklist
  already specs the moment real accounts exist.
- **Distribution**: EAS Build + EAS Submit (Expo's managed build/submit
  pipeline) is the standard path from this codebase to both stores without
  needing a Mac for iOS builds.
- **State**: `SavedContext.tsx` now reads/writes Supabase directly rather
  than holding local-only state, while keeping the same `savedIds`/
  `toggleSaved` interface every screen already used — no screen changes
  needed beyond the ones that fetch activities/completed lore.

## 8. Open Decisions

These are flagged, not resolved, here — each should be settled before the
Phase 2 (backend) plan is written, since they materially change the backend
design.

**Data source for activities:**
| Option | Tradeoff |
|---|---|
| Curated list (recommended for v1) | Simple backend (a table you manage), consistent quality, no external API cost or rate limits. Requires manual effort to keep content fresh and geographically broad. |
| Live location API (e.g. Google Places) | Scales automatically to any location, no manual curation. Adds API costs, usage limits, key management, and loses the hand-picked "worth telling a story about" quality that differentiates Dad Lore from generic discovery apps. |

**Monetization:**
| Option | Tradeoff |
|---|---|
| Free, no monetization | Simplest to build and ship; no revenue. |
| Ad-supported | Free to use; adds an ads SDK, App Tracking Transparency (iOS) prompts, and review scrutiny. |
| Subscription / premium | Revenue potential; adds App Store/Play Store billing integration and entitlement logic — meaningful scope on top of the backend work. |

Recommendation: ship v1 free with no monetization to validate the concept,
revisit once there's usage data.

## 9. Non-Functional Requirements

- **Design consistency**: all new screens/features follow the established
  dark orange-and-black theme (`src/theme/theme.ts`) — colors, shadows,
  pill/notched-corner button style already defined there.
- **Performance**: activity lists should stay smooth on low-to-mid-range
  Android devices, not just flagship iPhones.
- **Accessibility**: text contrast against the dark theme, tap targets
  ≥ 44x44pt, screen-reader labels on icon-only buttons (bookmark, filter,
  bell) — not yet audited. An accessibility statement is now shown at the
  bottom of Profile (`AccessibilityStatement.tsx`), honestly describing
  this current state rather than claiming a finished audit.
- **Offline behavior**: undefined today (everything is local placeholder
  data, so it "works offline" by accident). Needs an explicit decision once
  a backend exists — e.g. cache last-seen activities for offline viewing.

## 10. Compliance & Legal

Required regardless of which open decisions above get picked:

- **Privacy Policy**: mandatory for both App Store and Play Store
  submission. Must disclose location use if/when a live location API is
  adopted, and any analytics/crash reporting SDKs added.
- **Minors / COPPA**: the target audience (teens through mid-20s) includes
  users under 18, and possibly under 13. This changes the compliance bar
  significantly — COPPA (US) restricts data collection from under-13s,
  and both stores require an accurate age rating plus extra scrutiny on
  data collection, ads, and account creation for apps likely to be used
  by minors. This should be explicitly designed for in Phase 2 (e.g.
  no login requirement for core use, minimal data collection by default)
  rather than discovered during store review.
- **Terms of Service**: not strictly required by the stores but standard
  practice, especially before adding accounts or payments.
- **Apple Developer Program account** ($99/year) — required for App Store
  submission.
- **Google Play Console account** ($25 one-time) — required for Play Store
  submission.
- **App Store review guidelines / Play Store policy**: review both before
  submission — e.g. location use, ads, and any account-deletion
  requirements (Apple requires in-app account deletion if accounts exist).
- **User-generated content (UGC)**: once lore can be published (not yet —
  see §5 Out of scope) plus reporting exists, this app is squarely a UGC
  product under App Store review guideline 1.2. Combined with a
  minors-inclusive audience (above), Phase 2 needs, at minimum: real
  server-side moderation enforcement (the client-side word filter landing
  now is a first-pass convenience, not a security boundary — trivially
  bypassed by anyone calling the API directly once one exists), a way to
  block/mute abusive accounts, a published content policy, and a way for
  Apple's reviewers to see the report mechanism actually working
  end-to-end. Don't discover this requirement during review — design for
  it from the start of Phase 2.

## 11. Release Roadmap (Phased)

This is the direct answer to "what's everything I need" — detail for each
phase belongs in that phase's own plan when it's time, not here.

- **Phase 0 — Done**: Frontend prototype (Explore, Saved, Profile, Activity
  Detail), placeholder data, design system.
- **Phase 1 — This document**: PRD, scope, and open decisions.
- **Phase 2 — Backend & auth**:
  - **Landed**: Supabase confirmed as the backend. Anonymous auth
    (`AuthContext.tsx`) gives every device a stable identity. Schema +
    Row Level Security live in `supabase/migrations/0001_init.sql`:
    `activities` (public read-only), `saved_lore` and `completed_lore`
    (per-user via RLS — this is the real "nobody else can see this"
    enforcement for the diary, not just app UI), and `reports`
    (insert-only, unreadable by anyone through the client). `SavedContext`,
    `useActivities`, the Completed diary, and `ReportModal` all read/write
    Supabase now instead of local/hardcoded data.
  - **MVP re-scope landed** (see §5a): `supabase/migrations/
    0002_activity_completions.sql` adds the `activity_completions` table
    (per-user via RLS) backing "Mark as Done," the Completed segment of
    Lore, and Profile's stats — all now driven by real rows. Diary
    (`completed_lore`) and Map are paused, not removed.
  - **Still open**: the data-source decision in §8 (this pass moved the
    same curated rows into Postgres — it didn't resolve curated-vs-API),
    and there's still no admin tool (content changes go through the SQL
    migration files or the Supabase dashboard directly).
  - **Security & Auth Requirements checklist** — status per item now that
    anonymous auth is live:
  1. **No session/auth tokens in `localStorage` in plaintext.** **Partially
     accepted, not resolved**: Supabase's session sits in `AsyncStorage`,
     which is `localStorage`-backed on this app's web target. Tracked as a
     documented tradeoff in §7 (low-stakes anonymous session, no
     password) — revisit with httpOnly cookies the moment real accounts
     exist.
  2. **Authorization enforced server-side, always.** **Done** for
     everything this pass touches — Postgres RLS policies are the
     enforcement, not a client-side check. Still applies to any future
     admin/moderator tooling (§6), which doesn't exist yet.
  3. **2FA/OTP** — not applicable yet; there are no password-based accounts
     to protect. Required the moment admin/moderator accounts are added.
  4. **Rate limiting on every endpoint** — not yet addressed; Supabase
     provides some platform-level protection, but login/password-reset
     rate limiting specifically doesn't apply until real accounts exist.
  5. **Password rules** — not applicable yet (no passwords).
  6. **Password breach check** — not applicable yet (no passwords).
- **Phase 2/3 — Real AI lore summaries**: **code landed, not yet
  deployed.** `supabase/functions/summarize-lore/index.ts` is a Supabase
  Edge Function that proxies to the Claude API, holding the key
  server-side rather than shipping it in the app bundle (a client-side
  call would mean the key is extractable from the compiled app — exactly
  what the security checklist above exists to prevent). It's deployed
  with default JWT verification on, so only requests carrying a valid
  Supabase session (anonymous sessions included) can call it.
  `CompletedLoreCard.tsx` calls it via `supabase.functions.invoke`, and
  falls back to the original pre-written per-entry summary if the call
  fails (function not deployed yet, or a network hiccup) so the
  interaction never dead-ends.
  **To activate it:**
  1. Get an API key from [console.anthropic.com](https://console.anthropic.com).
  2. Install the Supabase CLI (`npm install -g supabase`), then
     `supabase login` and `supabase link --project-ref <your-project-ref>`.
  3. `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
  4. `supabase functions deploy summarize-lore`
  After that, "Summarize My Lore" calls Claude for real.
- **Phase 3 — Real data & search**: replace placeholder activities with
  real (curated or API-sourced) data; the search/filter logic already
  built in Phase 0 just needs a real dataset behind it.
- **Phase 4 — Store readiness**: production app icon/splash, screenshots,
  store listing copy, EAS Build/Submit configuration, privacy policy and
  terms pages, developer accounts.
- **Phase 5 — Submission & launch**: submit builds, respond to review
  feedback, release.
- **Phase 6 — Post-launch**: crash reporting and analytics (e.g. Sentry,
  a product analytics tool), monitor the goals in §4, iterate.

## 12. Risks & Open Questions

- Data source and monetization (§8) block a confident Phase 2 backend
  design until decided.
- Content curation effort (if the curated-list path is chosen) is
  ongoing work, not a one-time task — needs an owner.
- No analytics or crash reporting exists yet; Phase 2/6 should decide this
  before real users are on the app, not after.
- Account deletion flow will be required by Apple the moment any account
  system exists — worth designing into Phase 2, not bolting on later.
- A source referenced during planning (an Instagram Reel with app-launch
  advice) could not be accessed — this environment's network policy blocks
  Instagram. Nothing from it is reflected in this document; if it has
  concrete advice worth incorporating, it needs to be shared directly
  (a transcript, a screenshot, a summary) rather than linked.
- This build environment's network policy also blocks `supabase.co`, so
  the Phase 2 backend work (schema, RLS, anonymous auth, live reads/
  writes) was written and typechecked here but **could not be verified
  against the live project from this session** — that verification needs
  to happen on a machine that can actually reach Supabase (see §11 Phase
  2 and the SQL migration file's own instructions).

---

## Appendix: Glossary for New Vibecoders

Plain-language definitions for terms that come up when publishing an app
built this way:

- **PRD (Product Requirements Document)** — this document. Defines *what*
  you're building and *why* before deciding *how*, so building sessions
  have a clear target instead of drifting.
- **Backend** — the server + database your app talks to over the internet
  for anything that needs to persist or be shared (accounts, saved data,
  content). As of Phase 2, this app has one (Supabase) — saves, the
  completed-lore diary, and reports now persist across app restarts on
  the same device.
- **Row Level Security (RLS)** — Postgres rules that decide which rows a
  given request is allowed to read or write, enforced by the database
  itself. This is what actually makes "you can only see your own saved
  lore" or "you can't read other people's diary" true — not the app
  choosing not to show a screen, which a modified or fake client could
  ignore. Every table this app added in Phase 2 has RLS policies.
- **Anonymous auth** — an account with no email or password: Supabase
  hands the device a stable identity (a UUID under the hood) it can use
  to own rows via RLS, without collecting any personal information. This
  app uses anonymous auth for everyone right now; real accounts (email/
  password, sign-in on a second device) are separate, later work.
- **Supabase** — a hosted backend service (Postgres database + auth + file
  storage + auto-generated APIs) that lets you stand up a real backend
  without writing and hosting a server yourself. One of several options;
  named here because it fits well with Expo/React Native apps.
- **EAS Build / EAS Submit** — Expo's cloud build and store-submission
  tools. EAS Build compiles your app into an installable iOS/Android
  binary (including iOS builds without owning a Mac); EAS Submit uploads
  those builds to the App Store / Play Store for review.
- **App Store / Play Store review** — before your app goes live, Apple and
  Google each manually/automatically review it against their guidelines
  (privacy, content, functionality). Rejections are common and normal;
  budget time for at least one round of fixes.
- **Privacy Policy vs. Terms of Service** — a Privacy Policy explains what
  user data you collect and how it's used (legally required by both
  stores). Terms of Service are the rules users agree to by using the app
  (not strictly required, but standard).
- **Environment variables / secrets** — configuration values (like a
  backend API key) that shouldn't be hardcoded into your app's source code,
  especially anything that grants write access or costs money per use.
  Managed differently in Expo than in a typical web app — worth setting up
  correctly in Phase 2, not after a key leaks.
- **Analytics vs. Crash Reporting** — analytics (e.g. usage dashboards)
  tell you *what users do*; crash reporting (e.g. Sentry) tells you *what
  broke*. Different tools, both useful, neither in place yet.
- **UGC (User-Generated Content)** — content published by users rather
  than the app's own team (posts, submissions, comments). Apps with UGC
  face extra App Store / Play Store scrutiny: a working report mechanism,
  a way to block abusive users, and a published content policy are all
  expected. This app isn't there yet (no submission flow exists), but
  Report + a moderation filter have landed ahead of it.
- **k-anonymity (password breach checking)** — a way to check if a
  password has leaked without ever sending the actual password anywhere.
  The password is hashed locally, only the first few characters of that
  hash are sent to a breach-checking service, and the match happens
  locally against the results — the service never sees the real password
  or even the full hash.
