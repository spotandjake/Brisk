import {
  BlockExpression,
  CallExpression,
  CallIndirectExpression,
  DropExpression,
  Global_GetExpression,
  Global_SetExpression,
  IfExpression,
  Local_GetExpression,
  Local_SetExpression,
  Local_TeeExpression,
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
