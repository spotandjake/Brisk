export interface Token {
  type: string;
  value: string | number | boolean | bigint;
  text: string;
  offset: number;
  line: number;
  col: number;
}
export interface Rule {
  type: string;
  id: string;
  value?: (text: string) => string | number | boolean | bigint;
  match: RegExp;
  lineBreaks?: boolean;
}