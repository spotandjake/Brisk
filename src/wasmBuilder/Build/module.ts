import {
  WasmExternalType,
  WasmFunctionType,
  WasmGlobal,
  WasmImport,
  WasmMemory,
  WasmModuleType,
} from '../Types/Nodes';
// Main Wasm Module Creator
export const wasmModule = (
  // Import Section
  imports: WasmImport[],
  // Memory Section
  memory: WasmMemory[],
  // Global Section
  globals: WasmGlobal[],
  // Function Section
  functions: WasmFunctionType[],
  // Export Section
  exports: Map<string, { type: WasmExternalType; internalName: number | string }>,
  // Start Function
  startFunction?: string | number
): WasmModuleType => {
  // Return Wasm Module IR
  return {
    // Imports Section
    imports: imports,
    // Memory Section
    memory: memory,
    // Global Section
    globals: globals,
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
  exportType: WasmExternalType,
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
