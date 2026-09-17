# Dad Lore App — Product Requirements Document

**Status:** Draft v1 · **Stage:** Pre-backend prototype · **Owner:** Lars Sunde

---

## 1. Overview & Vision

Dad Lore helps dads find nearby activities worth turning into a good story —
the kind of thing that becomes "remember when we..." for years afterward.
Instead of a generic "things to do" app, it frames every activity around a
simple question: *will this make good Dad Lore?* Activities are rated,
tagged, and organized around that idea (lore points, difficulty, tags like
"Trailhead" or "Dad Voice Required").

The current build is a fully-designed frontend prototype: browse, search
(UI only), save, and view activity detail, all running on placeholder data
with an orange-and-black "adventurous" design system. Nothing is wired to a
backend yet.

## 2. Problem Statement

Dads looking for something to do with their time often default to whatever's
easiest — scrolling, errands, the couch — not because nothing's around, but
because nothing surfaces the *stuff worth doing on purpose*. Generic local
discovery apps (Yelp, Google Maps) are built for restaurants and services,
not for "give me something bold enough to talk about later." Dad Lore fills
that specific gap: curated, personality-driven activity discovery.

## 3. Target Users

- **Primary**: Dads (broadly — new dads, veteran dads, weekend-adventure
  dads) looking for activities near them, solo or with their kids.
- **Secondary**: Anyone who enjoys the "collect stories, not stuff" framing
  — could extend beyond dads post-launch, but v1 messaging and tone target
  dads specifically.

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
- Browse nearby activities (currently: static/curated list; see §8).
- Search UI and category/filter affordances (search itself is currently a
  placeholder — needs a real implementation, see §6).
- Save/bookmark activities for later.
- View full activity detail (description, tags, "what you'll need," stats).
- Basic profile: lore points, activity history, badges (currently mocked;
  needs to be driven by real usage once a backend exists).
- Everything required to legally and technically submit to the App Store
  and Play Store (see §10, §11).

### Out of scope for v1
- Social features (friends, sharing activity completions, comments).
- Ratings/reviews from other users.
- Multi-user groups or family accounts.
- User-submitted activities (all activities are curated/admin-managed in v1
  — see the open decision in §8).
- Push notifications / re-engagement campaigns.
- Monetization of any kind (see open decision in §8).

## 6. Core Features / User Stories

Mapped to what's already built in `src/screens/`:

| Screen | User story | Status |
|---|---|---|
| Explore | As a dad, I want to browse nearby activities grouped by relevance, so I can quickly find something worth doing. | Frontend built (`ExploreScreen.tsx`), data is hardcoded (`src/data/activities.ts`). |
| Explore | As a dad, I want to search for activities, so I can find something specific. | UI built (`TopBar.tsx` search bar); **not functional yet** — no real search/filtering logic. |
| Explore / Detail | As a dad, I want to bookmark an activity, so I can come back to it later. | Functional in-memory (`SavedContext.tsx`) — resets on app restart, needs persistence. |
| Saved | As a dad, I want to see everything I've saved in one place. | Frontend built (`SavedScreen.tsx`). |
| Activity Detail | As a dad, I want full details on an activity (what it takes, how long, difficulty) before committing. | Frontend built (`ActivityDetailScreen.tsx`), static placeholder copy. |
| Profile | As a dad, I want to see my lore points, badges, and history, so progress feels earned. | Frontend built (`ProfileScreen.tsx`), all values hardcoded — needs a backend to be real. |

**New for publishing (not yet built):**
- Persisted user identity (even if anonymous/device-based) so saves and
  lore points survive app restarts and reinstalls.
- Real search/filter logic against the activity dataset.
- An admin-side way to add/edit/remove activities (even a simple internal
  tool) since v1 assumes curated content, not user-submitted.

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
  bell) — not yet audited.
- **Offline behavior**: undefined today (everything is local placeholder
  data, so it "works offline" by accident). Needs an explicit decision once
  a backend exists — e.g. cache last-seen activities for offline viewing.

## 10. Compliance & Legal

Required regardless of which open decisions above get picked:

- **Privacy Policy**: mandatory for both App Store and Play Store
  submission. Must disclose location use if/when a live location API is
  adopted, and any analytics/crash reporting SDKs added.
- **Terms of Service**: not strictly required by the stores but standard
  practice, especially before adding accounts or payments.
- **Apple Developer Program account** ($99/year) — required for App Store
  submission.
- **Google Play Console account** ($25 one-time) — required for Play Store
  submission.
- **App Store review guidelines / Play Store policy**: review both before
  submission — e.g. location use, ads, and any account-deletion
  requirements (Apple requires in-app account deletion if accounts exist).

## 11. Release Roadmap (Phased)

This is the direct answer to "what's everything I need" — detail for each
phase belongs in that phase's own plan when it's time, not here.

- **Phase 0 — Done**: Frontend prototype (Explore, Saved, Profile, Activity
  Detail), placeholder data, design system.
- **Phase 1 — This document**: PRD, scope, and open decisions.
- **Phase 2 — Backend & auth**: pick and stand up a backend (Supabase or
  alternative), persist saves/profile, resolve the data-source decision.
- **Phase 3 — Real data & search**: replace placeholder activities with
  real (curated or API-sourced) data; implement functional search/filter.
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
