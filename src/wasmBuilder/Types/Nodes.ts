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
  i32_loadExpr,
  i64_loadExpr,
  f32_loadExpr,
  f64_loadExpr,
  i32_load8_sExpr,
  i32_load8_uExpr,
  i32_load16_sExpr,
  i32_load16_uExpr,
  i64_load8_sExpr,
  i64_load8_uExpr,
  i64_load16_sExpr,
  i64_load16_uExpr,
  i64_load32_sExpr,
  i64_load32_uExpr,
  i32_storeExpr,
  i64_storeExpr,
  f32_storeExpr,
  f64_storeExpr,
  i32_store8Expr,
  i32_store16Expr,
  i64_store8Expr,
  i64_store16Expr,
  i64_store32Expr,
  memory_sizeExpr,
  memory_growExpr,
  i32_constExpr,
  i64_constExpr,
  f32_constExpr,
  f64_constExpr,
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
export interface I32_LoadExpression {
  nodeType: WasmExpressions.i32_loadExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_LoadExpression {
  nodeType: WasmExpressions.i64_loadExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface F32_LoadExpression {
  nodeType: WasmExpressions.f32_loadExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface F64_LoadExpression {
  nodeType: WasmExpressions.f64_loadExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I32_Load8_SExpression {
  nodeType: WasmExpressions.i32_load8_sExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I32_Load8_UExpression {
  nodeType: WasmExpressions.i32_load8_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I32_Load16_SExpression {
  nodeType: WasmExpressions.i32_load16_sExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I32_Load16_UExpression {
  nodeType: WasmExpressions.i32_load16_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load8_SExpression {
  nodeType: WasmExpressions.i64_load8_sExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load8_UExpression {
  nodeType: WasmExpressions.i64_load8_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load16_SExpression {
  nodeType: WasmExpressions.i64_load16_sExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load16_UExpression {
  nodeType: WasmExpressions.i64_load16_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load32_SExpression {
  nodeType: WasmExpressions.i64_load32_sExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}
export interface I64_Load32_UExpression {
  nodeType: WasmExpressions.i64_load32_uExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
}

export interface I32_StoreExpression {
  nodeType: WasmExpressions.i32_storeExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I64_StoreExpression {
  nodeType: WasmExpressions.i64_storeExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface F32_StoreExpression {
  nodeType: WasmExpressions.f32_storeExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface F64_StoreExpression {
  nodeType: WasmExpressions.f64_storeExpr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I32_Store8Expression {
  nodeType: WasmExpressions.i32_store8Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I32_Store16Expression {
  nodeType: WasmExpressions.i32_store16Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I64_Store8Expression {
  nodeType: WasmExpressions.i64_store8Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I64_Store16Expression {
  nodeType: WasmExpressions.i64_store16Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface I64_Store32Expression {
  nodeType: WasmExpressions.i64_store32Expr;
  offset: number;
  align: number;
  ptr: WasmExpression;
  value: WasmExpression;
}
export interface Memory_SizeExpression {
  nodeType: WasmExpressions.memory_sizeExpr;
}
export interface Memory_GrowExpression {
  nodeType: WasmExpressions.memory_growExpr;
  value: number;
}
export interface I32_ConstExpression {
  nodeType: WasmExpressions.i32_constExpr;
  value: number;
}
// TODO: Switch This to BigInt
export interface I64_ConstExpression {
  nodeType: WasmExpressions.i64_constExpr;
  value: number;
}
export interface F32_ConstExpression {
  nodeType: WasmExpressions.f32_constExpr;
  value: number;
}
export interface F64_ConstExpression {
  nodeType: WasmExpressions.f64_constExpr;
  value: number;
}
// Wasm Expression Types
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
  | Global_SetExpression
  | I32_LoadExpression
  | I64_LoadExpression
  | F32_LoadExpression
  | F64_LoadExpression
  | I32_Load8_SExpression
  | I32_Load8_UExpression
  | I32_Load16_SExpression
  | I32_Load16_UExpression
  | I64_Load8_SExpression
  | I64_Load8_UExpression
  | I64_Load16_SExpression
  | I64_Load16_UExpression
  | I64_Load32_SExpression
  | I64_Load32_UExpression
  | I32_StoreExpression
  | I64_StoreExpression
  | F32_StoreExpression
  | F64_StoreExpression
  | I32_Store8Expression
  | I32_Store16Expression
  | I64_Store8Expression
  | I64_Store16Expression
  | I64_Store32Expression
  | Memory_SizeExpression
  | Memory_GrowExpression
  | I32_ConstExpression
  | I64_ConstExpression
  | F32_ConstExpression
  | F64_ConstExpression;
