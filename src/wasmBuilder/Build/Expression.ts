import {
  BlockExpression,
  CallExpression,
  CallIndirectExpression,
  DropExpression,
  F32_ConstExpression,
  F32_LoadExpression,
  F32_StoreExpression,
  F64_ConstExpression,
  F64_LoadExpression,
  F64_StoreExpression,
  Global_GetExpression,
  Global_SetExpression,
  I32_ConstExpression,
  I32_Load16_SExpression,
  I32_Load16_UExpression,
  I32_Load8_SExpression,
  I32_Load8_UExpression,
  I32_LoadExpression,
  I32_Store16Expression,
  I32_Store8Expression,
  I32_StoreExpression,
  I64_ConstExpression,
  I64_Load16_SExpression,
  I64_Load16_UExpression,
  I64_Load32_SExpression,
  I64_Load32_UExpression,
  I64_Load8_SExpression,
  I64_Load8_UExpression,
  I64_LoadExpression,
  I64_Store16Expression,
  I64_Store32Expression,
  I64_Store8Expression,
  I64_StoreExpression,
  IfExpression,
  Local_GetExpression,
  Local_SetExpression,
  Local_TeeExpression,
  Memory_GrowExpression,
  Memory_SizeExpression,
  NopExpression,
  ReturnExpression,
  UnreachableExpression,
  WasmExpression,
  WasmExpressions,
  WasmType,
} from '../Types/Nodes';
// Generate Wasm Expression
// TODO: Implement Wasm Expressions
// General
export const unreachableExpression = (): UnreachableExpression => {
  return {
    nodeType: WasmExpressions.unreachableExpr,
  };
};
export const nopExpression = (): NopExpression => {
  return {
    nodeType: WasmExpressions.nopExpr,
  };
};
export const blockExpression = (body: WasmExpression[]): BlockExpression => {
  return {
    nodeType: WasmExpressions.blockExpr,
    body: body,
  };
};
export const ifExpression = (
  condition: WasmExpression,
  body: WasmExpression,
  alternative?: WasmExpression
): IfExpression => {
  return {
    nodeType: WasmExpressions.ifExpr,
    condition: condition,
    body: body,
    alternative: alternative,
  };
};
export const returnExpression = (body: WasmExpression): ReturnExpression => {
  return {
    nodeType: WasmExpressions.returnExpr,
    body: body,
  };
};
export const callExpression = (funcName: string, body: WasmExpression[]): CallExpression => {
  return {
    nodeType: WasmExpressions.callExpr,
    funcName: funcName,
    body: body,
  };
};
export const callIndirectExpression = (
  funcIndex: number,
  body: WasmExpression[]
): CallIndirectExpression => {
  return {
    nodeType: WasmExpressions.callIndirectExpr,
    funcIndex: funcIndex,
    body: body,
  };
};
export const dropExpression = (body: WasmExpression): DropExpression => {
  return {
    nodeType: WasmExpressions.dropExpr,
    body: body,
  };
};
export const local_GetExpression = (
  localIndex: number,
  wasmType: WasmType
): Local_GetExpression => {
  return {
    nodeType: WasmExpressions.local_getExpr,
    localIndex: localIndex,
    wasmType: wasmType,
  };
};
export const local_SetExpression = (
  localIndex: number,
  body: WasmExpression
): Local_SetExpression => {
  return {
    nodeType: WasmExpressions.local_setExpr,
    localIndex: localIndex,
    body: body,
  };
};
export const local_TeeExpression = (
  localIndex: number,
  body: WasmExpression,
  wasmType: WasmType
): Local_TeeExpression => {
  return {
    nodeType: WasmExpressions.local_teeExpr,
    localIndex: localIndex,
    body: body,
    wasmType: wasmType,
  };
};
export const global_GetExpression = (
  globalName: string,
  wasmType: WasmType
): Global_GetExpression => {
  return {
    nodeType: WasmExpressions.global_getExpr,
    globalName: globalName,
    wasmType: wasmType,
  };
};
export const global_SetExpression = (
  globalName: string,
  body: WasmExpression
): Global_SetExpression => {
  return {
    nodeType: WasmExpressions.global_setExpr,
    globalName: globalName,
    body: body,
  };
};
export const i32_LoadExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I32_LoadExpression => {
  return {
    nodeType: WasmExpressions.i32_loadExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_LoadExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_LoadExpression => {
  return {
    nodeType: WasmExpressions.i64_loadExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const f32_LoadExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): F32_LoadExpression => {
  return {
    nodeType: WasmExpressions.f32_loadExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const f64_LoadExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): F64_LoadExpression => {
  return {
    nodeType: WasmExpressions.f64_loadExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i32_Load8_SExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I32_Load8_SExpression => {
  return {
    nodeType: WasmExpressions.i32_load8_sExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i32_Load8_UExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I32_Load8_UExpression => {
  return {
    nodeType: WasmExpressions.i32_load8_uExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i32_Load16_SExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I32_Load16_SExpression => {
  return {
    nodeType: WasmExpressions.i32_load16_sExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i32_Load16_UExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I32_Load16_UExpression => {
  return {
    nodeType: WasmExpressions.i32_load16_uExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load8_SExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load8_SExpression => {
  return {
    nodeType: WasmExpressions.i64_load8_sExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load8_UExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load8_UExpression => {
  return {
    nodeType: WasmExpressions.i64_load8_uExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load16_SExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load16_SExpression => {
  return {
    nodeType: WasmExpressions.i64_load16_sExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load16_UExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load16_UExpression => {
  return {
    nodeType: WasmExpressions.i64_load16_uExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load32_SExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load32_SExpression => {
  return {
    nodeType: WasmExpressions.i64_load32_sExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i64_Load32_UExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression
): I64_Load32_UExpression => {
  return {
    nodeType: WasmExpressions.i64_load32_uExpr,
    offset: offset,
    align: align,
    ptr: ptr,
  };
};
export const i32_StoreExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I32_StoreExpression => {
  return {
    nodeType: WasmExpressions.i32_storeExpr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i64_StoreExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I64_StoreExpression => {
  return {
    nodeType: WasmExpressions.i64_storeExpr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const f32_StoreExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): F32_StoreExpression => {
  return {
    nodeType: WasmExpressions.f32_storeExpr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const f64_StoreExpression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): F64_StoreExpression => {
  return {
    nodeType: WasmExpressions.f64_storeExpr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i32_Store8Expression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I32_Store8Expression => {
  return {
    nodeType: WasmExpressions.i32_store8Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i32_Store16Expression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I32_Store16Expression => {
  return {
    nodeType: WasmExpressions.i32_store16Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i64_Store8Expression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I64_Store8Expression => {
  return {
    nodeType: WasmExpressions.i64_store8Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i64_Store16Expression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I64_Store16Expression => {
  return {
    nodeType: WasmExpressions.i64_store16Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const i64_Store32Expression = (
  offset: number,
  align: number,
  ptr: WasmExpression,
  value: WasmExpression
): I64_Store32Expression => {
  return {
    nodeType: WasmExpressions.i64_store32Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const memory_SizeExpression = (): Memory_SizeExpression => {
  return {
    nodeType: WasmExpressions.memory_sizeExpr,
  };
};
// TODO: Ensure value isn't defined at runtime and doesn't take a wasmExpression
export const memory_GrowExpression = (value: number): Memory_GrowExpression => {
  return {
    nodeType: WasmExpressions.memory_growExpr,
    value: value,
  };
};
export const i32_ConstExpression = (value: number): I32_ConstExpression => {
  return {
    nodeType: WasmExpressions.i32_constExpr,
    value: value,
  };
};
// TODO: Switch This to BigInt
export const i64_ConstExpression = (value: number): I64_ConstExpression => {
  return {
    nodeType: WasmExpressions.i64_constExpr,
    value: value,
  };
};
export const f32_ConstExpression = (value: number): F32_ConstExpression => {
  return {
    nodeType: WasmExpressions.f32_constExpr,
    value: value,
  };
};
export const f64_ConstExpression = (value: number): F64_ConstExpression => {
  return {
    nodeType: WasmExpressions.f64_constExpr,
    value: value,
  };
};
