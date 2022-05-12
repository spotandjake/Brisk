// Imports
import { WasmExternalType, WasmType } from './Types/Nodes';
import {
  i32_AddExpression,
  i32_ConstExpression,
  local_GetExpression,
  local_SetExpression,
} from './Build/Expression';
import { wasmFunction } from './Build/Function';
import { addExport, addFunction, setStart, wasmModule } from './Build/Module';
import { compileWasm } from './Output/wasm';
import { promises as fs } from 'fs';
// Test
export default async () => {
  // Create Module
  let module = wasmModule(
    // Memory Section
    [{ minPages: 2 }],
    // Global Section
    [],
    // Function Sections
    [],
    // Export Section
    new Map()
  );
  // Create Function
  const func = wasmFunction(
    'add',
    [WasmType.WasmI32, WasmType.WasmI32],
    [WasmType.WasmI32],
    [WasmType.WasmI32],
    [
      local_SetExpression(
        2,
        i32_AddExpression(
          local_GetExpression(0, WasmType.WasmI32),
          local_GetExpression(1, WasmType.WasmI32)
        )
      ),
      local_GetExpression(2, WasmType.WasmI32),
    ]
  );
  const mainFunc = wasmFunction(
    'main',
    [],
    [],
    [WasmType.WasmI32],
    [local_SetExpression(0, i32_AddExpression(i32_ConstExpression(1), i32_ConstExpression(1)))]
  );
  // Add Function
  module = addFunction(module, func);
  module = addFunction(module, mainFunc);
  // Export Function
  module = addExport(module, 'add', WasmExternalType.function, 'add');
  // Set Start Function
  module = setStart(module, 'main');
  // Compile
  const compiled = compileWasm(module);
  console.log(compiled);
  // Try To Run
  console.log('Loading Wasm');
  const wasmInstance = await WebAssembly.instantiate(compiled);
  console.log('Wasm Loaded');
  console.log(wasmInstance);
  console.log(wasmInstance.instance.exports.add(1, 2));
  await fs.writeFile('test.wasm', compiled);
};
