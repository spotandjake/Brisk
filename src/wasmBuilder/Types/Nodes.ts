export const enum WasmPrimitiveType {
  WasmI32,
  WasmI64,
  WasmF32,
  WasmF64,
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
export const enum WasmExpressions {
  // General
  unreachableExpr,
  nopExpr,
  blockExpr,
  ifExpr,
  // TODO: br
  // TODO: br_if
  // TODO: br_table
  returnExpr,
  callExpr,
  callIndirectExpr,
  dropExpr,
  // TODO: Select
  local_getExpr,
  local_setExpr,
  local_teeExpr,
  global_getExpr,
  global_setExpr,
  // TODO: table_get
  // TODO: table_set
}
export interface UnreachableExpression {
  nodeType: WasmExpressions.unreachableExpr;
}
export interface NopExpression {
  nodeType: WasmExpressions.nopExpr;
}
export interface BlockExpression {
  nodeType: WasmExpressions.blockExpr;
  body: WasmExpression[];
}
export interface IfExpression {
  nodeType: WasmExpressions.ifExpr;
  condition: WasmExpression;
  body: WasmExpression;
  alternative?: WasmExpression;
}
// TODO: br
// TODO: br_if
// TODO: br_table
export interface ReturnExpression {
  nodeType: WasmExpressions.returnExpr;
  body: WasmExpression;
}
export interface CallExpression {
  nodeType: WasmExpressions.callExpr;
  funcName: string;
  body: WasmExpression[];
}
export interface CallIndirectExpression {
  nodeType: WasmExpressions.callIndirectExpr;
  funcIndex: number;
  body: WasmExpression[];
}
export interface DropExpression {
  nodeType: WasmExpressions.dropExpr;
  body: WasmExpression;
}
// TODO: select
export interface Local_GetExpression {
  nodeType: WasmExpressions.local_getExpr;
  localIndex: number;
  wasmType: WasmType;
}
export interface Local_SetExpression {
  nodeType: WasmExpressions.local_setExpr;
  localIndex: number;
  body: WasmExpression;
}
export interface Local_TeeExpression {
  nodeType: WasmExpressions.local_teeExpr;
  localIndex: number;
  body: WasmExpression;
  wasmType: WasmType;
}
export interface Global_GetExpression {
  nodeType: WasmExpressions.global_getExpr;
  globalName: string;
  wasmType: WasmType;
}
export interface Global_SetExpression {
  nodeType: WasmExpressions.global_setExpr;
  globalName: string;
  body: WasmExpression;
}
// TODO: table_get
// TODO: table_set
export type WasmExpression =
  | UnreachableExpression
  | NopExpression
  | BlockExpression
  | IfExpression
  | ReturnExpression
  | CallExpression
  | CallIndirectExpression
  | DropExpression
  | Local_GetExpression
  | Local_SetExpression
  | Local_TeeExpression
  | Global_GetExpression
  | Global_SetExpression;
