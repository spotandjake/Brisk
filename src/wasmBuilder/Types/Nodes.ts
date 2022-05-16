// Wasm Info
export type UnresolvedBytes = (number | string)[];
export const enum WasmExportKind {
  function = 0x00,
  table = 0x01,
  memory = 0x02,
  global = 0x03,
}
export const enum WasmSection {
  Custom = 0x00,
  Type = 0x01,
  Import = 0x02,
  Func = 0x03,
  Table = 0x04,
  Memory = 0x05,
  Global = 0x06,
  Export = 0x07,
  Start = 0x08,
  Element = 0x09,
  Code = 0x0a,
  Data = 0x0b,
  DataCount = 0x0c,
}
// Wasm Module State
export interface WasmImport {
  kind: WasmExportKind;
  name: string;
  importData: number[];
}
export interface WasmModule {
  // Label Maps
  functionMap: Map<string, number>;
  globalMap: Map<string, number>;
  // Sections
  customSection: number[][];
  typeSection: number[][];
  importSection: number[][];
  functionSection: number[][];
  tableSection: number[][];
  memorySection: number[][];
  globalSection: number[][];
  exportSection: number[][];
  startSection: number[][];
  elementSection: number[][];
  codeSection: number[][];
  dataSection: number[][];
}
export interface WasmFunction {
  name: string; // TODO: Not All Functions Need Names
  functionType: number[];
  paramNames: string[];
  locals: [number[], string][];
  body: UnresolvedBytes[];
}
export const enum WasmTypes {
  // Number Type
  WasmI32 = 0x7f,
  WasmI64 = 0x7e,
  WasmF32 = 0x7d,
  WasmF64 = 0x7c,
  // Reference Type
  funcref = 0x70,
}
