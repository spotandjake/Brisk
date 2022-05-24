import { UnresolvedBytes } from '../Types/Nodes';
import { WasmFunction } from '../Types/Nodes';
// Function Creator
export const createFunction = (
  name: string,
  functionType: number[],
  paramNames: string[],
  locals: [number[], string][],
  body: UnresolvedBytes[]
): WasmFunction => {
  // Return Wasm
  return {
    name: name,
    functionType: functionType,
    paramNames: paramNames,
    locals: locals,
    body: body,
  };
};
// Function Mutators
export const addLocal = (func: WasmFunction, local: [number[], string]): WasmFunction => {
  // Add local
  func.locals.push(local);
  // Return Wasm
  return func;
};
export const setBody = (func: WasmFunction, body: UnresolvedBytes[]): WasmFunction => {
  // Set Body
  func.body = body;
  // Return Wasm
  return func;
};
