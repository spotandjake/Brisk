// Test Utils
import { expect, test } from '@jest/globals';
// Test Components
import { WasmSection, WasmTypes } from '../../../src/wasmBuilder/Types/Nodes';
import { createMemoryType, createNumericType } from '../../../src/wasmBuilder/Build/WasmTypes';
import * as WasmModule from '../../../src/wasmBuilder/Build/WasmModule';
import * as WasmExpressions from '../../../src/wasmBuilder/Build/Expression';
import { unsignedLEB128 } from '../../../src/wasmBuilder/Build/Utils';
// WasmBuilder WasmModule Tests
// Section Tests
test('WasmBuilder-WasmTypes: _createSection', () => {
  expect(WasmModule._createSection(WasmSection.Custom, [0x00, 0x00, 0x00, 0x00])).toEqual([
    WasmSection.Custom,
    ...unsignedLEB128(4),
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
});
test('WasmBuilder-WasmTypes: createSection', () => {
  expect(WasmModule.createSection(WasmSection.Custom, [[0x00, 0x00, 0x00, 0x00]])).toEqual([
    WasmSection.Custom,
    ...unsignedLEB128(5),
    ...unsignedLEB128(1),
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
});
test('WasmBuilder-WasmTypes: createSection-empty', () => {
  expect(WasmModule.createSection(WasmSection.Custom, [])).toEqual([]);
});
// Import Tests
// Modules
test('WasmBuilder-WasmTypes: createEmptyModule', () => {
  expect(WasmModule.createModule()).toEqual({
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map(),
    localData: new Map(),
    // Sections
    customSections: [],
    typeSection: [],
    importSection: [],
    functionSection: [],
    tableSection: [],
    memorySection: [],
    globalSection: [],
    exportSection: [],
    startSection: [],
    elementSection: [],
    codeSection: [],
    dataSection: [],
  });
});
// TODO: addFunction
// TODO: addElement
// addMemory
test('WasmBuilder-WasmTypes: addMemory', () => {
  const wasmModule = WasmModule.createModule();
  expect(WasmModule.addMemory(wasmModule, createMemoryType(1))).toEqual({
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map(),
    localData: new Map(),
    // Sections
    customSections: [],
    typeSection: [],
    importSection: [],
    functionSection: [],
    tableSection: [],
    memorySection: [createMemoryType(1)],
    globalSection: [],
    exportSection: [],
    startSection: [],
    elementSection: [],
    codeSection: [],
    dataSection: [],
  });
});
// addGlobal
test('WasmBuilder-WasmTypes: addGlobal', () => {
  const wasmModule = WasmModule.createModule();
  expect(
    WasmModule.addGlobal(
      wasmModule,
      'test',
      true,
      createNumericType(WasmTypes.WasmI32),
      WasmExpressions.i32_ConstExpression(1)
    )
  ).toEqual({
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map([['test', 0]]),
    localData: new Map(),
    // Sections
    customSections: [],
    typeSection: [],
    importSection: [],
    functionSection: [],
    tableSection: [],
    memorySection: [],
    globalSection: [
      [
        ...createNumericType(WasmTypes.WasmI32), // Global Type
        0x01, // Mutable Code
        ...WasmExpressions.i32_ConstExpression(1), // Global Value
        0x0b, // Wasm End Instruction
      ],
    ],
    exportSection: [],
    startSection: [],
    elementSection: [],
    codeSection: [],
    dataSection: [],
  });
});
// TODO: addExport
// TODO: setStart
// addData
test('WasmBuilder-WasmTypes: addData', () => {
  const wasmModule = WasmModule.createModule();
  expect(WasmModule.addData(wasmModule, 10, [0x00, 0x00, 0x00, 0x00])).toEqual({
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map(),
    localData: new Map(),
    // Sections
    customSections: [],
    typeSection: [],
    importSection: [],
    functionSection: [],
    tableSection: [],
    memorySection: [],
    globalSection: [],
    exportSection: [],
    startSection: [],
    elementSection: [],
    codeSection: [],
    dataSection: [
      [
        0x00, // Segment Flags
        0x41, // Wasm i32.const Instruction
        ...unsignedLEB128(10), // Memory Offset
        0x0b, // Wasm End Instruction
        ...unsignedLEB128(4), // Data Length
        ...[0x00, 0x00, 0x00, 0x00], // Data
      ],
    ],
  });
});
// TODO: compileModule

// TODO: Resolve Labels Tests
