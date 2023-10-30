export declare type AppSectionType = 'MAIN' | 'JAVASCRIPT' | 'TYPESCRIPT' | 'PROFILE';
export const SectionTypes = ['JAVASCRIPT', 'TYPESCRIPT'] as const;
export declare type SectionType = typeof SectionTypes[number];
export const BookEvents = ['copy', 'paste', 'selectstart', 'dblclick', 'contextmenu'] as const;
export enum BOOK_SECTION_ROUTES {
  MAIN = '',
  JAVASCRIPT = 'js-book',
  TYPESCRIPT = 'ts-book',
  PROFILE = 'profile'
}
