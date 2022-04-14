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