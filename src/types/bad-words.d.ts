// The published @types/bad-words package targets an older major version
// of `bad-words` that exported the Filter class as the module's default
// export. The installed v4 package instead exports a named `Filter`
// (verified against the installed package at node_modules/bad-words),
// so this local declaration replaces the mismatched @types package.
declare module 'bad-words' {
  interface FilterOptions {
    emptyList?: boolean;
    exclude?: string[];
    list?: string[];
    placeHolder?: string;
    regex?: RegExp;
    replaceRegex?: RegExp;
    splitRegex?: RegExp;
  }

  export class Filter {
    constructor(options?: FilterOptions);
    isProfane(text: string): boolean;
    clean(text: string): string;
    addWords(...words: string[]): void;
    removeWords(...words: string[]): void;
  }
}
