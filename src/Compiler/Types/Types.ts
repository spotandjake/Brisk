export interface Position {
  offset: number;
  length: number;
  line: number;
  col: number;
  file: string;
}
export interface ExportItem {
  name: string;
  path: string;
}
export type ExportList = Map<string, ExportItem>;

export const enum NumberType {
  I32,
  I64,
  U32,
  U64,
  F32,
  F64,
  Number,
}
export const enum NumberStyle {
  Decimal = 10,
  Binary = 2,
  Octal = 8,
  Hexadecimal = 16,
}
