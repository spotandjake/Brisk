// Imports
import { WasmPrimitiveType } from './Types/Nodes';
import {
  local_SetExpression,
  local_GetExpression,
  returnExpression,
  i32_ConstExpression,
  i32_AddExpression,
} from './Build/Expression';
import { wasmFunction } from './Build/Function';
import { wasmModule, addFunction } from './Build/Module';
import { compileWasm } from './Output/wasm';
// Create Module
let module = wasmModule([]);
// Create Function
const func = wasmFunction(
  'add',
  [WasmPrimitiveType.WasmI32, WasmPrimitiveType.WasmI32],
  WasmPrimitiveType.WasmI32,
  [WasmPrimitiveType.WasmI32],
  [
    // Addition
    local_SetExpression(0, i32_AddExpression(i32_ConstExpression(1), i32_ConstExpression(1))),
    // Return
    returnExpression(local_GetExpression(0, WasmPrimitiveType.WasmI32)),
  ]
);
// Add Function
module = addFunction(module, func);
// Compile
const compiled = compileWasm(module);
console.log(compiled);
// Try To Run
console.log('Loading Wasm');
const wasmInstance = WebAssembly.compile(compiled);
console.log('Wasm Loaded');
console.log(wasmInstance);
