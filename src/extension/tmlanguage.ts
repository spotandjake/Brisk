export const tmSchema =
  'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json';
export interface TmCaptures {
  [k: string]: { name: string };
}
export interface TmIncludePattern {
  include: string;
}
export interface TmMatchPattern {
  name?: string;
  match: string;
  captures?: TmCaptures;
}
export interface TmBlockPattern {
  name?: string;
  begin: string;
  beginCaptures?: TmCaptures;
  end: string;
  endCaptures?: TmCaptures;
  patterns: TmPattern[];
}
export type TmPattern = TmIncludePattern | TmMatchPattern | TmBlockPattern;
export interface TmRepository {
  [key: string]: { patterns: TmPattern[] };
}
export interface TmLanguage {
  $schema: string;
  name: string;
  scopeName: string;
  patterns: TmPattern[];
  repository: TmRepository;
}
