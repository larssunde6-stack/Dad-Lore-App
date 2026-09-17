# Dad Lore — Privacy Policy

**Last updated:** Draft, pending legal review before store submission.

> This is a good-faith draft reflecting exactly what the app does today.
> It has not been reviewed by a lawyer. Have it reviewed before you rely
> on it for a real App Store / Play Store submission — see §9.

## 1. Who we are

Dad Lore ("we," "the app") helps people find nearby activities worth
turning into a story, and keep a private log of the ones they've done.

## 2. What we collect

- **An anonymous device identity.** When you open the app, it creates an
  anonymous account for your device — no email, no password, no name, no
  phone number. This identity is a random ID used only to know which
  saved activities, diary entries, and reports belong to you.
- **Saved activities.** Which lore listings you've bookmarked.
- **Your completed-lore diary.** Entries you log — titles, dates, notes,
  and points earned. This is private: nothing here is ever shown to
  another user, and our database enforces that at the data level (Row
  Level Security), not just by the app choosing not to display it.
- **Reports you submit.** If you report a lore listing, we store the
  activity, your reason, and your anonymous identity so we can review it.
- **Approximate location — only if you open the Map tab, only while you're
  using it.** We use it to sort nearby lore by distance and to open your
  phone's own Maps app for directions. **We do not send your location to
  our servers or store it anywhere** — the calculation happens entirely
  on your device.

## 3. What we don't do

- We don't run ads.
- We don't use analytics or tracking SDKs.
- We don't sell or share your data with third parties.
- We don't ask for your name, email, or any contact information.

## 4. Where data lives

App data (saved activities, diary entries, reports) is stored with
Supabase, our backend provider, and protected by database-level access
rules so only your own anonymous identity can read your saves and diary.

## 5. Data retention & deletion

Right now, there isn't yet an in-app "delete my data" button — that's a
known gap we intend to close before a public launch. Until then, if you
want your data deleted, contact us (see §8) and we'll do it manually.
Uninstalling the app stops it from being used but does not, by itself,
delete data already stored.

## 6. Children's privacy

Dad Lore doesn't knowingly collect personal information from anyone,
including children under 13 — the anonymous device identity is not
personally identifying, and we never ask for a name, email, birthdate, or
similar. If you believe a child has provided us with personal information
some other way, contact us and we'll remove it.

## 7. Security

Access to your saved activities, diary, and reports is enforced by
database-level rules (Row Level Security) scoped to your anonymous
identity, not just app-side checks. No system is perfectly secure; we'll
disclose any incident that affects your data.

## 8. Contact

Questions about this policy or a deletion request:
**[add a real contact email before publishing]**

## 9. Changes to this policy

We'll update the "Last updated" date above when this changes. Material
changes will be reflected in the app's Privacy & Terms screen.

---

*This document should be reviewed by a lawyer before Dad Lore is
submitted to the App Store or Play Store, especially regarding
region-specific requirements (GDPR, CCPA, COPPA) once the app has real
user accounts, analytics, or advertising.*
