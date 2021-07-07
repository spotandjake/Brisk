export interface Token {
  type: string;
  id: string;
  text: string;
  value: string | number | boolean;
  offset: number;
  line: number;
  col: number;
}
export interface Rule {
  type: string;
  id: string;
  value?: (text: string) => string | number | boolean;
  match: RegExp;
  lineBreaks?: boolean;
}
export interface MooRule {
  match?: RegExp | string | string[];
  lineBreaks?: boolean;
  value?: (x: string) => string | number | boolean;
}
export type MooRules = { [key: string]: MooRule };
export interface Position {
  offset: number;
  line: number;
  col: number;
}