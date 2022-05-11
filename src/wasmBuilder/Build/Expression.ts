import * as wasmTypes from '../Types/Nodes';
import { WasmExpression, WasmExpressions, WasmType } from '../Types/Nodes';
// Generate Wasm Expression
// TODO: Implement Wasm Expressions
// General
export const unreachableExpression = (): wasmTypes.UnreachableExpression => {
  return {
    nodeType: WasmExpressions.unreachableExpr,
  };
};
export const nopExpression = (): wasmTypes.NopExpression => {
  return {
    nodeType: WasmExpressions.nopExpr,
  };
};
export const blockExpression = (body: WasmExpression[]): wasmTypes.BlockExpression => {
  return {
    nodeType: WasmExpressions.blockExpr,
    body: body,
  };
};
export const ifExpression = (
  condition: WasmExpression,
  body: WasmExpression,
  alternative?: WasmExpression
): wasmTypes.IfExpression => {
  return {
    nodeType: WasmExpressions.ifExpr,
    condition: condition,
    body: body,
    alternative: alternative,
  };
};
export const returnExpression = (body: WasmExpression): wasmTypes.ReturnExpression => {
  return {
    nodeType: WasmExpressions.returnExpr,
    body: body,
  };
};
export const callExpression = (
  funcName: string,
  body: WasmExpression[]
): wasmTypes.CallExpression => {
  return {
    nodeType: WasmExpressions.callExpr,
    funcName: funcName,
    body: body,
  };
};
export const callIndirectExpression = (
  funcIndex: number,
  body: WasmExpression[]
): wasmTypes.CallIndirectExpression => {
  return {
    nodeType: WasmExpressions.callIndirectExpr,
    funcIndex: funcIndex,
    body: body,
  };
};
export const dropExpression = (body: WasmExpression): wasmTypes.DropExpression => {
  return {
    nodeType: WasmExpressions.dropExpr,
    body: body,
  };
};
export const local_GetExpression = (
  localIndex: number,
  wasmType: WasmType
): wasmTypes.Local_GetExpression => {
  return {
    nodeType: WasmExpressions.local_getExpr,
    localIndex: localIndex,
    wasmType: wasmType,
  };
};
export const local_SetExpression = (
  localIndex: number,
  body: WasmExpression
): wasmTypes.Local_SetExpression => {
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
): wasmTypes.Local_TeeExpression => {
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
): wasmTypes.Global_GetExpression => {
  return {
    nodeType: WasmExpressions.global_getExpr,
    globalName: globalName,
    wasmType: wasmType,
  };
};
export const global_SetExpression = (
  globalName: string,
  body: WasmExpression
): wasmTypes.Global_SetExpression => {
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
): wasmTypes.I32_LoadExpression => {
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
): wasmTypes.I64_LoadExpression => {
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
): wasmTypes.F32_LoadExpression => {
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
): wasmTypes.F64_LoadExpression => {
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
): wasmTypes.I32_Load8_SExpression => {
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
): wasmTypes.I32_Load8_UExpression => {
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
): wasmTypes.I32_Load16_SExpression => {
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
): wasmTypes.I32_Load16_UExpression => {
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
): wasmTypes.I64_Load8_SExpression => {
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
): wasmTypes.I64_Load8_UExpression => {
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
): wasmTypes.I64_Load16_SExpression => {
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
): wasmTypes.I64_Load16_UExpression => {
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
): wasmTypes.I64_Load32_SExpression => {
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
): wasmTypes.I64_Load32_UExpression => {
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
): wasmTypes.I32_StoreExpression => {
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
): wasmTypes.I64_StoreExpression => {
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
): wasmTypes.F32_StoreExpression => {
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
): wasmTypes.F64_StoreExpression => {
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
): wasmTypes.I32_Store8Expression => {
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
): wasmTypes.I32_Store16Expression => {
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
): wasmTypes.I64_Store8Expression => {
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
): wasmTypes.I64_Store16Expression => {
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
): wasmTypes.I64_Store32Expression => {
  return {
    nodeType: WasmExpressions.i64_store32Expr,
    offset: offset,
    align: align,
    ptr: ptr,
    value: value,
  };
};
export const memory_SizeExpression = (): wasmTypes.Memory_SizeExpression => {
  return {
    nodeType: WasmExpressions.memory_sizeExpr,
  };
};
// TODO: Ensure value isn't defined at runtime and doesn't take a wasmExpression
export const memory_GrowExpression = (value: WasmExpression): wasmTypes.Memory_GrowExpression => {
  return {
    nodeType: WasmExpressions.memory_growExpr,
    value: value,
  };
};
export const i32_ConstExpression = (value: number): wasmTypes.I32_ConstExpression => {
  return {
    nodeType: WasmExpressions.i32_constExpr,
    value: value,
  };
};
export const i64_ConstExpression = (value: BigInt): wasmTypes.I64_ConstExpression => {
  return {
    nodeType: WasmExpressions.i64_constExpr,
    value: value,
  };
};
export const f32_ConstExpression = (value: number): wasmTypes.F32_ConstExpression => {
  return {
    nodeType: WasmExpressions.f32_constExpr,
    value: value,
  };
};
export const f64_ConstExpression = (value: number): wasmTypes.F64_ConstExpression => {
  return {
    nodeType: WasmExpressions.f64_constExpr,
    value: value,
  };
};
export const i32_AddExpression = (
  valueLeft: WasmExpression,
  valueRight: WasmExpression
): wasmTypes.I32_AddExpression => {
  return {
    nodeType: WasmExpressions.i32_addExpr,
    valueLeft: valueLeft,
    valueRight: valueRight,
  };
};
