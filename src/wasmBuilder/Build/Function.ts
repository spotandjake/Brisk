import { WasmExpression, WasmFunctionType, WasmType } from '../Types/Nodes';
export const wasmFunction = (
  name: string,
  params: WasmType,
  results: WasmType,
  vars: WasmType[],
  body: WasmExpression[]
): WasmFunctionType => {
  // TODO: Validate Function Generation Works
  // Internal Ir
  return {
    name: name,
    params: params,
    results: results,
    vars: vars,
    body: body,
  };
};
