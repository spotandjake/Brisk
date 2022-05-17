import { WasmExportKind, WasmFunction, WasmImport, WasmModule, WasmSection } from '../Types/Nodes';
import { encodeString, encodeVector, unsignedLEB128 } from './Utils';
// Helpers
export const _createSection = (sectionType: WasmSection, sectionData: number[]): number[] => [
  sectionType,
  ...encodeVector(sectionData),
];
export const createSection = (sectionType: WasmSection, section: number[][]): number[] => {
  if (section.length === 0) return [];
  else
    return _createSection(sectionType, [
      ...unsignedLEB128(section.length),
      ...section.filter((n) => n.length != 0).flat(),
    ]);
};
// Wasm Import Builder
export const createImport = (
  importKind: WasmExportKind,
  importModule: string,
  importField: string,
  importType: number[]
): WasmImport => {
  // TODO: Handle Importing, table, global
  // Return Value
  return {
    kind: importKind,
    name: importField,
    importData: [
      ...encodeString(importModule),
      ...encodeString(importField),
      importKind,
      ...importType,
    ],
  };
};
// Main Wasm Module Creator
export const createModule = (imports?: WasmImport[]): WasmModule => {
  // Module State
  const moduleState: WasmModule = {
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map(),
    // Sections
    customSection: [],
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
  };
  // Handle Imports
  if (imports != undefined) {
    for (const wasmImport of imports) {
      // Add a Empty Section Element So The Index's are correct
      if (wasmImport.kind == WasmExportKind.function) moduleState.functionSection.push([]);
      else if (wasmImport.kind == WasmExportKind.table) moduleState.tableSection.push([]);
      else if (wasmImport.kind == WasmExportKind.memory) moduleState.memorySection.push([]);
      else if (wasmImport.kind == WasmExportKind.global) moduleState.globalSection.push([]);
      // Set Import Label
      if (wasmImport.kind == WasmExportKind.function)
        moduleState.functionMap.set(wasmImport.name, moduleState.functionSection.length - 1);
      else if (wasmImport.kind == WasmExportKind.global)
        moduleState.globalMap.set(wasmImport.name, moduleState.globalSection.length - 1);
      // Add Import To Import Section
      moduleState.importSection.push(wasmImport.importData);
    }
  }
  // Return Module Contents
  return moduleState;
};
// Wasm Module Function Mutations
export const addFunction = (module: WasmModule, func: WasmFunction): WasmModule => {
  // Get A List Of Local Names And Index's
  const localNames: Map<string, number> = new Map();
  for (const param of func.paramNames) {
    localNames.set(param, localNames.size);
  }
  for (const local of func.locals) {
    localNames.set(local[1], localNames.size);
  }
  // Resolve Function Body Labels
  const wasmBody: number[] = [];
  for (const byte of func.body.flat()) {
    if (typeof byte == 'string') {
      const lastByte = wasmBody.at(-1);
      if (lastByte == 0x20 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Get
      } else if (lastByte == 0x21 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Set
      } else if (lastByte == 0x22 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Tee
      } else if (lastByte == 0x23 && module.globalMap.has(byte)) {
        wasmBody.push(...unsignedLEB128(module.globalMap.get(byte)!)); // Wasm Global Get
      } else if (lastByte == 0x24 && module.globalMap.has(byte)) {
        wasmBody.push(...unsignedLEB128(module.globalMap.get(byte)!)); // Wasm Global Set
      } else if (lastByte == 0x10 && module.functionMap.has(byte)) {
        wasmBody.push(...unsignedLEB128(module.functionMap.get(byte)!)); // Wasm Func Call
      } else throw new Error(`Unknown Label Value ${byte}`);
    } else wasmBody.push(byte);
  }
  // Add Function To TypeSection
  module.typeSection.push(func.functionType);
  // Add Function To FunctionSection
  module.functionSection.push([module.typeSection.length - 1]);
  // Add Function To CodeSection
  const code: number[] = [
    ...unsignedLEB128(func.locals.length),
    // TODO: Optimize The local Format So That They Are Grouped
    ...func.locals
      .map(([local]) => {
        // Change The 1 to the local length
        return [1, ...local];
      })
      .flat(),
    ...wasmBody, // Add Function Body
    0x0b, // Wasm End Instruction
  ];
  module.codeSection.push([...unsignedLEB128(code.length), ...code]);
  // Set Function Reference
  module.functionMap.set(func.name, module.codeSection.length - 1);
  // Return Module
  return module;
};
// Wasm Module Element Mutations
// TODO: Test This
export const addElement = (module: WasmModule, values: number[]): WasmModule => {
  // If Table does not exist generate it
  if (module.tableSection.length == 0) {
    module.tableSection.push([
      0x70, // Table Type
      0x00,
      ...unsignedLEB128(0),
    ]);
  }
  module.elementSection.push([
    0x00, // TODO: Segment Flags, figure out what they mean
    0x041, // Wasm i32.const Instruction
    0x00, // Currently there can only be one table
    0x0b,
    ...unsignedLEB128(values.length),
    // TODO: Determine HowTo Resolve Function Labels from here
    ...values.flat(),
  ]);
  return module;
};
// Wasm Module Memory Mutations
// TODO: Consider Having this be passed in, in createModule
export const addMemory = (module: WasmModule, memType: number[]): WasmModule => {
  module.memorySection.push(memType);
  return module;
};
// Wasm Module Global Mutations
export const addGlobal = (
  module: WasmModule,
  globalName: string,
  mutable: boolean,
  globalType: number[],
  value: number[]
): WasmModule => {
  // Set Global Label
  module.globalMap.set(globalName, module.globalSection.length);
  // Add The Module
  module.globalSection.push([
    ...globalType, // Global Type
    mutable ? 0x01 : 0x00, // Mutable Code
    ...value, // Global Value
    0x0b, // Wasm End Instruction
  ]);
  // Return The Module
  return module;
};
// Wasm Module Export Mutations
export const addExport = (
  module: WasmModule,
  exportName: string,
  exportKind: WasmExportKind,
  exportIdentifier: number | string
): WasmModule => {
  // Resolve Export Value
  if (typeof exportIdentifier == 'string') {
    if (exportKind == WasmExportKind.function && module.functionMap.has(exportIdentifier))
      exportIdentifier = module.functionMap.get(exportIdentifier)!;
    else throw new Error(`Could Not Find Label: ${exportIdentifier}`);
  }
  // Add The Export
  module.exportSection.push([
    ...encodeString(exportName), // Encode Export Name
    exportKind, // Export Kind
    ...unsignedLEB128(exportIdentifier), // Export Index
  ]);
  // Return The Module
  return module;
};
// Wasm Module Start Mutations
export const setStart = (module: WasmModule, startIdentifier: number | string): WasmModule => {
  // Resolve Export Value
  if (typeof startIdentifier == 'string') {
    if (module.functionMap.has(startIdentifier))
      startIdentifier = module.functionMap.get(startIdentifier)!;
    else throw new Error(`Could Not Find Label: ${startIdentifier}`);
  }
  // Set The Start Value
  module.startSection[0] = [
    ...unsignedLEB128(startIdentifier), // Start Index
  ];
  // Return The Module
  return module;
};
// Wasm Module Data Mutations
export const addData = (module: WasmModule, memoryOffset: number, data: number[]): WasmModule => {
  // TODO: Look into how this supports multiple Memories with memoryIndex param
  module.dataSection.push([
    0x00, // Segment Flags
    0x41, // Wasm i32.const Instruction
    ...unsignedLEB128(memoryOffset), // Memory Offset
    0x0b, // Wasm End Instruction
    ...unsignedLEB128(data.length), // Data Length
    ...data, // Data
  ]);
  return module;
};
// Compile Module
export const compileModule = (module: WasmModule, includeDataCount = true): Uint8Array => {
  return Uint8Array.from([
    ...[0x00, 0x61, 0x73, 0x6d], // Magic Module Header
    ...[0x01, 0x00, 0x00, 0x00], // Wasm Module Version
    // Sections
    ...createSection(WasmSection.Custom, module.customSection),
    ...createSection(WasmSection.Type, module.typeSection),
    ...createSection(WasmSection.Import, module.importSection),
    ...createSection(WasmSection.Func, module.functionSection),
    ...createSection(WasmSection.Table, module.tableSection),
    ...createSection(WasmSection.Memory, module.memorySection),
    ...createSection(WasmSection.Global, module.globalSection),
    ...createSection(WasmSection.Export, module.exportSection),
    ..._createSection(WasmSection.Start, module.startSection.flat()),
    ...createSection(WasmSection.Element, module.elementSection),
    ...(module.dataSection.length != 0 && includeDataCount
      ? _createSection(WasmSection.DataCount, unsignedLEB128(module.dataSection.length))
      : []),
    ...createSection(WasmSection.Code, module.codeSection),
    ...createSection(WasmSection.Data, module.dataSection),
  ]);
};
