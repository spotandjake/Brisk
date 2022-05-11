// Imports
import { WasmType, ExportType } from './Types/Nodes';
import {
  local_SetExpression,
  local_GetExpression,
  returnExpression,
  i32_ConstExpression,
  i32_AddExpression,
} from './Build/Expression';
import { wasmFunction } from './Build/Function';
import { wasmModule, addFunction, addExport } from './Build/Module';
import { compileWasm } from './Output/wasm';
import fs from 'fs';
// Test
export default async () => {
  // Create Module
  let module = wasmModule(
    // Function Sections
    [],
    // Export Section
    new Map(),
    // Function Exports
    new Map()
  );
  // Create Function
  // const func = wasmFunction(
  //   'add',
  //   [WasmType.WasmI32, WasmType.WasmI32],
  //   [WasmType.WasmI32],
  //   [WasmType.WasmI32],
  //   [
  //     // Addition
  //     local_SetExpression(0, i32_AddExpression(i32_ConstExpression(1), i32_ConstExpression(1))),
  //     // Return
  //     returnExpression(local_GetExpression(0, WasmType.WasmI32)),
  //   ]
  // );
  const func = wasmFunction(
    'add',
    [WasmType.WasmI32, WasmType.WasmI32],
    [WasmType.WasmI32],
    [WasmType.WasmI32],
    [
      local_SetExpression(2, i32_AddExpression(i32_ConstExpression(1), i32_ConstExpression(1))),
      local_GetExpression(2, WasmType.WasmI32),
    ]
  );
  // Add Function
  module = addFunction(module, func);
  // Export Function
  module = addExport(module, 'add', ExportType.function, 'add');
  // Compile
  const compiled = compileWasm(module);
  console.log(compiled);
  // Write To File
  await fs.promises.writeFile('./wasm.wasm', compiled);
  // Try To Run
  console.log('Loading Wasm');
  const wasmInstance = await WebAssembly.instantiate(compiled);
  console.log('Wasm Loaded');
  console.log(wasmInstance);
  console.log(wasmInstance.instance.exports.add(1, 1));
};
