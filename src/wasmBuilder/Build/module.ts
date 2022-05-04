import { WasmFunctionType, WasmModuleType } from '../Types/Nodes';
// Main Wasm Module Creator
export const wasmModule = (
  // Section Data
  // Variable Data
  // Function Data
  functions: WasmFunctionType[],
  functionTable: Map<number, WasmFunctionType>,
  // Import Data
  // Export Data
  functionExports: Map<string, number>
): WasmModuleType => {
  // TODO: Validate Module Generation
  // Return Wasm Module IR
  return {
    // Section Data
    // Variable Data
    // Function Data
    functions: functions,
    functionTable: functionTable,
    // Import Data
    // Export Data
    functionExports,
  };
};
// Wasm Module Additions
export const addFunction = (
  wasmModule: WasmModuleType,
  functionType: WasmFunctionType
): WasmModuleType => {
  return {
    ...wasmModule,
    functions: [...wasmModule.functions, functionType],
  };
};
