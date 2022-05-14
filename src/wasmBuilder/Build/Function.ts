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
