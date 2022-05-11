import { ExportType, WasmFunctionType, WasmModuleType } from '../Types/Nodes';
// Main Wasm Module Creator
export const wasmModule = (
  // Function Section
  functions: WasmFunctionType[],
  // Export Section
  exports: Map<string, { type: ExportType; internalName: number | string }>,
  // Start Function
  startFunction?: string | number
): WasmModuleType => {
  // TODO: Validate Module Generation
  // Return Wasm Module IR
  return {
    // Function Section
    functions: functions,
    // Export Section
    exports: exports,
    // Start Function
    startFunction: startFunction,
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
export const addExport = (
  wasmModule: WasmModuleType,
  exportName: string,
  exportType: ExportType,
  internalName: number | string
): WasmModuleType => {
  wasmModule.exports.set(exportName, {
    type: exportType,
    internalName: internalName,
  });
  return wasmModule;
};
export const setStart = (
  wasmModule: WasmModuleType,
  startFunction: string | number
): WasmModuleType => {
  return {
    ...wasmModule,
    startFunction: startFunction,
  };
};
