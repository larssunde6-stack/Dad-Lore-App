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
- Browse and **search** nearby "lore to do" (currently: static/curated
  list, client-side search; see §8 for the real-data decision).
- A **Map** view of nearby lore, sorted by distance, handing off to
  Google/Apple Maps for actual directions rather than building navigation.
- Save/bookmark lore to do for later.
- A **private, personal "completed lore" diary** — explicitly never shown
  to other users — separate from the public browsable lore feed. Includes
  a "summarize my lore" action (currently mocked; see §6 and §11 Phase 2/3).
- View full activity detail (description, tags, "what you'll need," stats).
- A **Report** action on published lore, plus a moderation word-filter
  utility (not yet wired to any submission input — see Out of scope).
- Basic profile: lore points, activity history, badges (currently mocked;
  needs to be driven by real usage once a backend exists).
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
- Real AI-generated lore summaries (the "summarize my lore" action is
  mocked with pre-written text — see §11 Phase 2/3 for why).

## 6. Core Features / User Stories

Mapped to what's already built in `src/screens/`:

| Screen | User story | Status |
|---|---|---|
| Explore | As a young person, I want to browse nearby lore grouped by relevance, so I can quickly find something worth doing. | Frontend built (`ExploreScreen.tsx`), data is hardcoded (`src/data/activities.ts`). |
| Explore | As a young person, I want to search for lore ideas (activities, sidequests), so I can find something specific. | **Functional** client-side search (`TopBar.tsx` + `ExploreScreen.tsx`) — filters the local dataset by title/blurb/tags/category. Real once there's a real dataset. |
| Explore / Detail | As a young person, I want to bookmark lore, so I can come back to it later. | Functional in-memory (`SavedContext.tsx`) — resets on app restart, needs persistence. |
| Map | As a young person, I want to see the closest lore to me on a map, and get directions without the app building its own navigation. | Frontend built (`MapScreen.tsx`) — real device geolocation (`expo-location`) sorts a list by distance; "Directions" hands off to Google/Apple Maps via `Linking`. Map visual is a decorative banner, not an interactive map (see §7). |
| Lore (To Do) | As a young person, I want my saved lore in one place. | Frontend built (`LoreScreen.tsx`, "To Do" segment) — same data as the old Saved screen. |
| Lore (Completed) | As a young person, I want a private log of lore I've actually done, that nobody else can see. | Frontend built (`LoreScreen.tsx`, "Completed" segment) with seeded entries (`src/data/completedLore.ts`) — explicitly not a social feed. Includes a "Summarize My Lore" action; **the summary is pre-written per seed entry, not a live AI call** (see §11 Phase 2/3 for why). |
| Activity Detail | As a young person, I want full details on a lore listing (what it takes, how long, difficulty) before committing. | Frontend built (`ActivityDetailScreen.tsx`), static placeholder copy. |
| Activity Detail | As a young person, I want to report lore that's inappropriate or unsafe. | Frontend built (`ReportModal.tsx`) — shows a confirmation on submit but **doesn't persist anywhere**; there's no backend yet to send it to. |
| Profile | As a young person, I want to see my lore points, badges, and history, so progress feels earned. | Frontend built (`ProfileScreen.tsx`), all values hardcoded — needs a backend to be real. |

**New for publishing (not yet built):**
- Persisted user identity (even if anonymous/device-based) so saves,
  completed lore, and lore points survive app restarts and reinstalls.
- A real dataset behind search/browse/map (currently the same 11-item
  placeholder list everywhere — see §8's data-source decision).
- An admin-side way to add/edit/remove lore (even a simple internal tool)
  since v1 assumes curated content, not user-submitted.
- **Server-side enforcement for Report and the moderation word filter**
  (`src/utils/moderation.ts`, wrapping the `bad-words` package) — both
  exist client-side only right now; see §10 and §11 Phase 2 for why that's
  not sufficient on its own once real users can publish content.
- **A real "summarize my lore" endpoint** — see §11 Phase 2/3.

## 7. Platform & Technical Approach

- **Framework**: Expo (SDK 57) + React Native — already in place, supports
  iOS and Android from one codebase.
- **Backend**: none yet. **Supabase is the leading candidate** — it pairs
  well with Expo/React Native, includes Postgres, auth, and storage out of
  the box, and has a generous free tier for a pre-revenue app. This should
  be confirmed (not assumed) in the Phase 2 plan, evaluated against
  alternatives (Firebase, a custom Node/Express API) before committing.
- **Distribution**: EAS Build + EAS Submit (Expo's managed build/submit
  pipeline) is the standard path from this codebase to both stores without
  needing a Mac for iOS builds.
- **State**: currently local React state/context only (`SavedContext.tsx`).
  Will need to move to backend-synced state once accounts exist.

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
- **Phase 2 — Backend & auth**: pick and stand up a backend (Supabase or
  alternative), persist saves/profile/completed lore, resolve the
  data-source decision, and move Report + the moderation filter from
  client-side-only to actually enforced server-side (see §10 UGC note).
  **Security & Auth Requirements checklist** (none of this is built yet —
  there's no backend or auth today — this is the spec for when there is):
  1. **No session/auth tokens in `localStorage` or `AsyncStorage` in
     plaintext.** `localStorage` (web) is readable by any script on the
     page, so an XSS bug becomes a full account-takeover bug. Use
     `expo-secure-store` for native, and for the web target prefer
     httpOnly + Secure + SameSite cookies issued by the backend (JS can't
     read those at all — that's the actual mitigation, not just a
     different storage API).
  2. **Authorization must be enforced server-side, always.** A client-side
     `role === 'admin'` check (hiding a button, gating a screen) is a UX
     convenience, never a security boundary — trivially bypassed by
     editing the client or calling the API directly. Every
     admin/moderator-only mutation (the activity-management tool from §6,
     resolving a report) must re-check permission on the backend on every
     request.
  3. **2FA/OTP** available at minimum, required for any admin/moderator
     accounts once they exist.
  4. **Rate limiting on every endpoint**, with login and password-reset
     specifically prioritized — the standard targets for credential
     stuffing and account enumeration, and need tighter limits than
     average endpoints.
  5. **Password rules**: prioritize minimum length (current NIST guidance:
     length beats forced-complexity rules that mostly just frustrate
     users) over mandatory symbol/number composition requirements.
  6. **Password breach check**: check new/changed passwords against known
     breach data before accepting them — the standard, privacy-preserving
     approach is the Have I Been Pwned "Pwned Passwords" API via
     k-anonymity (hash the password, send only the first 5 hex characters
     of the hash, check the returned suffix list locally — the real
     password/full hash never leaves the client).
- **Phase 2/3 — Real AI lore summaries**: the "Summarize My Lore" action in
  the Completed diary is currently mocked (pre-written text per seed
  entry) rather than a live call to an LLM. Calling an LLM directly from
  the client would mean shipping its API key inside the app bundle, which
  is extractable from the compiled app — a real credential leak, and
  exactly what the security checklist above exists to prevent. Real
  summarization needs a backend endpoint that holds the key server-side
  and proxies the request.
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

---

## Appendix: Glossary for New Vibecoders

Plain-language definitions for terms that come up when publishing an app
built this way:

- **PRD (Product Requirements Document)** — this document. Defines *what*
  you're building and *why* before deciding *how*, so building sessions
  have a clear target instead of drifting.
- **Backend** — the server + database your app talks to over the internet
  for anything that needs to persist or be shared (accounts, saved data,
  content). Without one, everything lives only on one device and resets
  when the app is reinstalled — which is where this app is today.
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
