import { WasmFunction } from '../Types/Nodes';
// Function Creator
export const createFunction = (
  name: string,
  functionType: number[],
  locals: number[][],
  body: number[][]
): WasmFunction => {
  return {
    name: name,
    functionType: functionType,
    locals: locals,
    body: body,
  };
};
// Function Mutators
