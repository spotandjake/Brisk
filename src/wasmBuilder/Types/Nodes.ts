const enum WasmPrimitiveType {
  none,
  i32,
  i64,
  f32,
  f64,
}
export type WasmType = WasmPrimitiveType | WasmPrimitiveType[]; // TODO: I Dont Really Like How This Works, Consider A Map With Type References For Multi Types
// Wasm Module State
export interface WasmModuleType {
  // Section Data
  // Variable Data
  // Function Data
  functions: WasmFunctionType[];
  functionTable: Map<number, WasmFunctionType>;
  // Import Data
  // Export Data
  functionExports: Map<string, number>;
  // tableExports
  // memExports
  // globalExports
}
// Wasm Function State
export interface WasmFunctionType {
  name: string;
  params: WasmType;
  results: WasmType;
  vars: WasmType[];
  body: WasmExpression[]; // TODO: Add Type For Wasm Expression
}
// Wasm Expression
export type WasmExpression = undefined; // TODO: Add Expression Types
