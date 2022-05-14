import { promises as fs } from 'fs';
import { addExport, addFunction, compileModule, createModule, setStart } from './Build/Module';
import { createFunction } from './Build/Function';
import { createFunctionType, createNumericType } from './Build/WasmTypes';
import {
  i32_AddExpression,
  i32_ConstExpression,
  local_GetExpression,
  local_SetExpression,
} from './Build/Expression';
import { WasmExportKind, WasmNumberType } from './Types/Nodes';
// Test
export default async () => {
  // Create Module
  let module = createModule();
  // create A Test Function
  const testAddFunction = createFunction(
    'add',
    createFunctionType(
      [createNumericType(WasmNumberType.WasmI32), createNumericType(WasmNumberType.WasmI32)],
      [createNumericType(WasmNumberType.WasmI32)]
    ),
    ['valueX', 'valueY'],
    [],
    [i32_AddExpression(local_GetExpression('valueX'), local_GetExpression(1))]
  );
  const mainFunc = createFunction(
    'main',
    createFunctionType([], []),
    [],
    [[createNumericType(WasmNumberType.WasmI32), 'x']],
    [local_SetExpression(0, i32_AddExpression(i32_ConstExpression(1), i32_ConstExpression(1)))]
  );
  // Add Function To Module
  module = addFunction(module, testAddFunction);
  module = addFunction(module, mainFunc);
  // Set Start Function`
  module = addExport(module, 'add', WasmExportKind.function, 'add');
  // Set Start Function
  module = setStart(module, 'main');
  // Compile Module
  const compiled = compileModule(module);
  console.log(compiled);
  // Write Module To File
  await fs.writeFile('test.wasm', compiled);
  // Try to run module
  const wasmInstance = await WebAssembly.instantiate(compiled);
  console.log('Wasm Loaded');
  console.log(wasmInstance);
  //@ts-ignore
  console.log(wasmInstance.instance.exports.add(1, 2));
};
