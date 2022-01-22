const enum WasmPrimitiveType {
  none,
  i32,
  i64,
  f32,
  f64,
}
export type WasmType = WasmPrimitiveType | WasmPrimitiveType[]; // TODO: I Dont Really Like How This Works, Consider A Map With Type References For Multi Types
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
