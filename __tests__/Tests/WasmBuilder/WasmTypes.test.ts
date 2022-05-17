// Test Utils
import { expect, test } from '@jest/globals';
// Test Components
import { WasmTypes } from '../../../src/wasmBuilder/Types/Nodes';
import * as WasmTypeBuilder from '../../../src/wasmBuilder/Build/WasmTypes';
import { unsignedLEB128 } from '../../../src/wasmBuilder/Build/Utils';
// WasmBuilder WasmTypes Tests
test('WasmBuilder-WasmTypes: createNumericType-i32', () => {
  expect(WasmTypeBuilder.createNumericType(WasmTypes.WasmI32)).toEqual([0x7f]);
});
test('WasmBuilder-WasmTypes: createNumericType-i64', () => {
  expect(WasmTypeBuilder.createNumericType(WasmTypes.WasmI64)).toEqual([0x7e]);
});
test('WasmBuilder-WasmTypes: createNumericType-f32', () => {
  expect(WasmTypeBuilder.createNumericType(WasmTypes.WasmF32)).toEqual([0x7d]);
});
test('WasmBuilder-WasmTypes: createNumericType-f64', () => {
  expect(WasmTypeBuilder.createNumericType(WasmTypes.WasmF64)).toEqual([0x7c]);
});
test('WasmBuilder-WasmTypes: createFunctionType', () => {
  expect(
    WasmTypeBuilder.createFunctionType(
      [
        WasmTypeBuilder.createNumericType(WasmTypes.WasmI32),
        WasmTypeBuilder.createNumericType(WasmTypes.WasmI32),
      ],
      [WasmTypeBuilder.createNumericType(WasmTypes.WasmI32)]
    )
  ).toEqual([
    0x60,
    ...unsignedLEB128(2),
    ...WasmTypeBuilder.createNumericType(WasmTypes.WasmI32),
    ...WasmTypeBuilder.createNumericType(WasmTypes.WasmI32),
    ...unsignedLEB128(1),
    ...WasmTypeBuilder.createNumericType(WasmTypes.WasmI32),
  ]);
});
test('WasmBuilder-WasmTypes: createMemoryType', () => {
  expect(WasmTypeBuilder.createMemoryType(2)).toEqual([0x00, ...unsignedLEB128(2)]);
});
test('WasmBuilder-WasmTypes: createMemoryType-maxLimit', () => {
  expect(WasmTypeBuilder.createMemoryType(2, 2)).toEqual([
    0x01,
    ...unsignedLEB128(2),
    ...unsignedLEB128(2),
  ]);
});
