import { WasmTypes } from '../Types/Nodes';
import { unsignedLEB128 } from './Utils';
// Type Builders
export const createNumericType = (value: WasmTypes): number[] => [value]; // Push the value the enum holds the Type Codes
export const createFunctionType = (params: number[][], results: number[][]): number[] => [
  0x60, // Wasm FunctionType Code
  ...unsignedLEB128(params.length), // Number Of Params
  ...params.flat(), // TODO: Make This Cleaner
  ...unsignedLEB128(results.length), // Number Of Results
  ...results.flat(), // TODO: Make This Cleaner
];
export const createMemoryType = (minPages: number, maxPages?: number): number[] => {
  return [
    maxPages === undefined ? 0x00 : 0x01,
    ...unsignedLEB128(minPages),
    ...(maxPages === undefined ? [] : [...unsignedLEB128(maxPages)]),
  ];
};
