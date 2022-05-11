import { WasmFunctionType, WasmModuleType } from '../Types/Nodes';
// Main Wasm Module Creator
export const wasmModule = (
  // TODO: Custom Section
  // TODO: Type Section
  // TODO: Import Section
  // TODO: Function Section
  functions: WasmFunctionType[]
  // TODO: Table Section
  // TODO: Memory Section
  // TODO: Global Section
  // TODO: Export Section
  // TODO: Start Section
  // TODO: Element Section
  // TODO: Code Section
  // TODO: Data Section
  // TODO: Data Count Section
): WasmModuleType => {
  // TODO: Validate Module Generation
  // Return Wasm Module IR
  return {
    // TODO: Custom Section
    // TODO: Type Section
    // TODO: Import Section
    // TODO: Function Section
    functions: functions,
    // TODO: Table Section
    // TODO: Memory Section
    // TODO: Global Section
    // TODO: Export Section
    // TODO: Start Section
    // TODO: Element Section
    // TODO: Code Section
    // TODO: Data Section
    // TODO: Data Count Section
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
