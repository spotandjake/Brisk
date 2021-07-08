export interface Token {
  type: string;
  value: string | number | boolean;
  text: string;
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