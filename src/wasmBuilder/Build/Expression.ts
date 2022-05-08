import {
  BlockExpression,
  CallExpression,
  CallIndirectExpression,
  IfExpression,
  NopExpression,
  ReturnExpression,
  UnreachableExpression,
  WasmExpression,
  WasmExpressions,
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
export const callExpression = (funcName: string, args: WasmExpression[]): CallExpression => {
  return {
    nodeType: WasmExpressions.callExpr,
    funcName: funcName,
    args: args,
  };
};
export const callIndirectExpression = (
  funcIndex: number,
  args: WasmExpression[]
): CallIndirectExpression => {
  return {
    nodeType: WasmExpressions.callIndirectExpr,
    funcIndex: funcIndex,
    args: args,
  };
};
// i32
// i64
// f32
// f64
