import { WasmExpression, WasmFunctionType, WasmType } from '../Types/Nodes';
export const wasmFunction = (
  name: string,
  params: WasmType[],
  results: WasmType[],
  locals: WasmType[],
  body: WasmExpression[]
): WasmFunctionType => {
  // TODO: Validate Function Generation Works
  // Internal Ir
  return {
    name: name,
    params: params,
    results: results,
    locals: locals,
    body: body,
  };
};
