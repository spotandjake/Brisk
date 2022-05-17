// Test Utils
import { expect, test } from '@jest/globals';
// Test Components
import { WasmTypes } from '../../../src/wasmBuilder/Types/Nodes';
import { addLocal, createFunction } from '../../../src/wasmBuilder/Build/Function';
import { createFunctionType, createNumericType } from '../../../src/wasmBuilder/Build/WasmTypes';
// WasmBuilder WasmFunction Tests
test('WasmBuilder-WasmFunction: createFunction', () => {
  expect(
    createFunction(
      'main',
      createFunctionType([], []),
      [],
      [[createNumericType(WasmTypes.WasmI32), 'x']],
      []
    )
  ).toEqual({
    name: 'main',
    functionType: createFunctionType([], []),
    paramNames: [],
    locals: [[createNumericType(WasmTypes.WasmI32), 'x']],
    body: [],
  });
});
test('WasmBuilder-WasmFunction: addLocal', () => {
  const mainFunc = createFunction(
    'main',
    createFunctionType([], []),
    [],
    [[createNumericType(WasmTypes.WasmI32), 'x']],
    []
  );
  expect(addLocal(mainFunc, [createNumericType(WasmTypes.WasmI32), 'y'])).toEqual({
    name: 'main',
    functionType: createFunctionType([], []),
    paramNames: [],
    locals: [
      [createNumericType(WasmTypes.WasmI32), 'x'],
      [createNumericType(WasmTypes.WasmI32), 'y'],
    ],
    body: [],
  });
});
