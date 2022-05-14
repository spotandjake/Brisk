import { WasmNumberType } from '../Types/Nodes';
import { unsignedLEB128 } from './Utils';
// Type Builders
export const createNumericType = (value: WasmNumberType): number[] => [value]; // Push the value the enum holds the Type Codes
export const createFunctionType = (params: number[][], results: number[][]): number[] => [
  0x60, // Wasm FunctionType Code
  ...unsignedLEB128(params.length), // Number Of Params
  ...params.flat(), // TODO: Make This Cleaner
  ...unsignedLEB128(results.length), // Number Of Results
  ...results.flat(), // TODO: Make This Cleaner
];
