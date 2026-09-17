import { Filter } from 'bad-words';

// Base list comes from the maintained `bad-words` package rather than a
// hand-authored word list. A few app-specific additions on top, tuned for
// this app's audience: block anything sexual-content-adjacent that the
// general profanity list doesn't already cover. Not wired to any input
// yet — there's no lore-submission form in this build — but ready for
// when there is one.
const filter = new Filter();
filter.addWords('nudes', 'sexting', 'onlyfans');

export function containsBlockedContent(text: string): boolean {
  return filter.isProfane(text);
}

export function redactBlockedContent(text: string): string {
  return filter.clean(text);
}
