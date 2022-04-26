import { WasmExpression, WasmFunctionType, WasmType } from '../Types/Nodes';
// TODO: Implement Wasm Function

export const wasmFunction = (
  name: string,
  params: WasmType,
  results: WasmType,
  vars: WasmType[],
  body: WasmExpression[]
): WasmFunctionType => {
  // Internal Ir State
  return {
    name: name,
    params: params,
    results: results,
    vars: vars,
    body: body,
  };
};
