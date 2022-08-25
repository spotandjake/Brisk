import {
  ResolvedBytes,
  WasmExternalKind,
  WasmFunction,
  WasmImport,
  WasmModule,
  WasmSection,
  funcRefIdentifier,
  globalRefIdentifier,
  typeRefIdentifier,
} from '../Types/Nodes';
import { encodeString, encodeVector, unsignedLEB128 } from './Utils';
// Helpers
export const _createSection = (sectionType: WasmSection, sectionData: number[]): number[] => [
  sectionType,
  ...encodeVector(sectionData),
];
export const createCustomSection = (wasmModule: WasmModule, sectionData: number[]): WasmModule => {
  wasmModule.customSections.push(sectionData);
  return wasmModule;
};
export const createSection = (sectionType: WasmSection, section: number[][]): number[] => {
  if (section.length === 0) return [];
  else
    return _createSection(sectionType, [
      ...unsignedLEB128(section.filter((n) => n.length != 0).length),
      ...section.filter((n) => n.length != 0).flat(),
    ]);
};
// Wasm Import Builder
export const createFunctionImport = (
  importModule: string,
  importField: string,
  funcSignatureReference: number
): WasmImport => {
  return {
    kind: WasmExternalKind.function,
    name: importField,
    valueName: importField,
    importData: [
      ...encodeString(importModule),
      ...encodeString(importField),
      WasmExternalKind.function,
      funcSignatureReference,
    ],
  };
};
export const createGlobalImport = (
  importModule: string,
  importField: string,
  variableName: string,
  importType: ResolvedBytes,
  mutable: boolean
): WasmImport => {
  return {
    kind: WasmExternalKind.global,
    name: importField,
    valueName: variableName,
    importData: [
      ...encodeString(importModule),
      ...encodeString(importField),
      WasmExternalKind.global,
      ...importType,
      mutable ? 0x01 : 0x00,
    ],
  };
};
// TODO: createTableImport
// TODO: createMemoryImport
// Main Wasm Module Creator
export const createModule = (imports?: WasmImport[]): WasmModule => {
  // Module State
  const moduleState: WasmModule = {
    // Label Maps
    functionMap: new Map(),
    globalMap: new Map(),
    localData: new Map(),
    // LinkingInfo
    codeReferences: [],
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
    // Maps
    importGlobals: 0,
    importFunctions: 0,
  };
  // Handle Imports
  if (imports != undefined) {
    for (const wasmImport of imports) {
      // Add a Empty Section Element So The Index's are correct
      if (wasmImport.kind == WasmExternalKind.function) moduleState.functionSection.push([]);
      else if (wasmImport.kind == WasmExternalKind.table) moduleState.tableSection.push([]);
      else if (wasmImport.kind == WasmExternalKind.memory) moduleState.memorySection.push([]);
      else if (wasmImport.kind == WasmExternalKind.global) moduleState.globalSection.push([]);
      // Set Import Label
      if (wasmImport.kind == WasmExternalKind.function)
        moduleState.functionMap.set(wasmImport.name, moduleState.functionSection.length - 1);
      else if (wasmImport.kind == WasmExternalKind.global)
        moduleState.globalMap.set(wasmImport.name, moduleState.importGlobals++);
      // Add Import To Import Section
      moduleState.importSection.push(wasmImport.importData);
    }
  }
  // Return Module Contents
  return moduleState;
};
// Wasm Module Import Mutations
export const addImport = (wasmModule: WasmModule, wasmImport: WasmImport): number => {
  // Set Import Label
  if (wasmImport.kind == WasmExternalKind.function)
    wasmModule.functionMap.set(wasmImport.valueName, wasmModule.functionSection.length);
  else if (wasmImport.kind == WasmExternalKind.global)
    wasmModule.globalMap.set(wasmImport.valueName, wasmModule.importGlobals++);
  // Add Import To Import Section
  wasmModule.importSection.push(wasmImport.importData);
  // Add a Empty Section Element So The Index's are correct
  if (wasmImport.kind == WasmExternalKind.function) return wasmModule.functionSection.push([]) - 1;
  if (wasmImport.kind == WasmExternalKind.table) return wasmModule.tableSection.push([]) - 1;
  if (wasmImport.kind == WasmExternalKind.memory) return wasmModule.memorySection.push([]) - 1;
  if (wasmImport.kind == WasmExternalKind.global) return wasmModule.globalSection.push([]) - 1;
  // For Some Reason TypeScript Doesn't Realize This Code Is Dead
  return 0;
};
// Wasm Module Function Mutations
export const addFunction = (wasmModule: WasmModule, func: WasmFunction): WasmModule => {
  // TODO: Handle Positions For Linking Section
  // Get A List Of Local Names And Index's
  const localNames: Map<string, number> = new Map();
  for (const param of func.paramNames) {
    localNames.set(param, localNames.size);
  }
  for (const local of func.locals) {
    localNames.set(local[1], localNames.size);
  }
  // Resolve Function Body Labels
  const wasmBody: number[] = [
    ...unsignedLEB128(func.locals.length),
    // TODO: Optimize The local Format So That They Are Grouped
    ...func.locals
      .map(([local]) => {
        // Change The 1 to the local length
        return [1, ...local];
      })
      .flat(),
  ];
  const functionReferences: number[] = [];
  const typeReferences: number[] = [];
  const globalReferences: number[] = [];
  for (const byte of func.body.flat()) {
    if (typeof byte == 'string') {
      const lastByte = wasmBody.at(-1);
      if (lastByte == 0x20 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Get
      } else if (lastByte == 0x21 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Set
      } else if (lastByte == 0x22 && localNames.has(byte)) {
        wasmBody.push(...unsignedLEB128(localNames.get(byte)!)); // Wasm Local Tee
      } else if (lastByte == 0x23 && wasmModule.globalMap.has(byte)) {
        console.log(byte);
        console.log(wasmModule.globalMap);
        wasmBody.push(...unsignedLEB128(wasmModule.globalMap.get(byte)!)); // Wasm Global Get
      } else if (lastByte == 0x24 && wasmModule.globalMap.has(byte)) {
        wasmBody.push(...unsignedLEB128(wasmModule.globalMap.get(byte)!)); // Wasm Global Set
      } else if (lastByte == 0x10 && wasmModule.functionMap.has(byte)) {
        wasmBody.push(...unsignedLEB128(wasmModule.functionMap.get(byte)!)); // Wasm Func Call
      } else throw new Error(`Unknown Label Value: ${lastByte} ${byte}`);
    } else if (typeof byte == 'symbol') {
      if (byte == funcRefIdentifier) {
        // Add The Position To The Linking Info
        functionReferences.push(wasmBody.length);
      } else if (byte == typeRefIdentifier) {
        // Add The Position To The Linking Info
        typeReferences.push(wasmBody.length);
      } else if (byte == globalRefIdentifier) {
        // Add The Position To The Linking Info
        globalReferences.push(wasmBody.length);
      }
    } else wasmBody.push(byte);
  }
  // Add Function To TypeSection
  const typeReference = addType(wasmModule, func.functionType);
  // Add Function To FunctionSection
  wasmModule.functionSection.push([typeReference]);
  // Add Function To CodeSection
  const code: number[] = [];
  // Push References To Linking Info
  wasmModule.codeReferences.push([functionReferences, typeReferences, globalReferences]);
  // Finish Code Section
  code.push(...wasmBody); // Add Function Body
  code.push(0x0b); // Wasm End Instruction
  wasmModule.codeSection.push([...unsignedLEB128(code.length), ...code]);
  // Set Function Reference
  wasmModule.functionMap.set(func.name, wasmModule.functionSection.length - 1);
  // Add The Local Map
  wasmModule.localData.set(wasmModule.functionSection.length - 1, localNames);
  // Return Module
  return wasmModule;
};
// Wasm Type Element Mutations
export const addType = (wasmModule: WasmModule, type: number[]): number => {
  // Check If The Type Exists Already
  const typeIndex = wasmModule.typeSection.findIndex((t) => {
    return t.every((b, i) => b == type[i]);
  });
  if (typeIndex != -1) return typeIndex;
  // Otherwise Add The Type
  return wasmModule.typeSection.push(type) - 1; // Add Type
};
// Wasm Module Element Mutations
// TODO: Test This
export const addElement = (wasmModule: WasmModule, values: number[]): WasmModule => {
  // Add Element
  wasmModule.elementSection.push([
    0x00, // TODO: Segment Flags, figure out what they mean
    0x041, // Wasm i32.const Instruction
    // TODO: Determine a better way to get this offset
    ...unsignedLEB128(wasmModule.elementSection.length),
    0x0b,
    ...unsignedLEB128(values.length),
    // TODO: Determine HowTo Resolve Function Labels from here
    ...values.flat(),
  ]);
  // Return Module
  return wasmModule;
};
// Wasm Module Memory Mutations
// TODO: Consider Having this be passed in, in createModule
export const addMemory = (wasmModule: WasmModule, memType: number[]): WasmModule => {
  wasmModule.memorySection.push(memType);
  return wasmModule;
};
// Wasm Module Global Mutations
export const addGlobal = (
  wasmModule: WasmModule,
  globalName: string,
  mutable: boolean,
  globalType: number[],
  value: number[]
): number => {
  // Set Global Label
  wasmModule.globalMap.set(globalName, wasmModule.importGlobals + wasmModule.globalSection.length);
  // Add The Module
  wasmModule.globalSection.push([
    ...globalType, // Global Type
    mutable ? 0x01 : 0x00, // Mutable Code
    ...value, // Global Value
    0x0b, // Wasm End Instruction
  ]);
  // Return The Module
  return wasmModule.globalSection.length - 1;
};
// Wasm Module Export Mutations
export const addExport = (
  wasmModule: WasmModule,
  exportName: string,
  exportKind: WasmExternalKind,
  exportIdentifier: number | string
): WasmModule => {
  // Resolve Export Value
  if (typeof exportIdentifier == 'string') {
    if (exportKind == WasmExternalKind.function && wasmModule.functionMap.has(exportIdentifier))
      exportIdentifier = wasmModule.functionMap.get(exportIdentifier)!;
    else if (exportKind == WasmExternalKind.global && wasmModule.globalMap.has(exportIdentifier))
      exportIdentifier = wasmModule.globalMap.get(exportIdentifier)!;
    else throw new Error(`Could Not Find Label: ${exportIdentifier}`);
  }
  // Add The Export
  wasmModule.exportSection.push([
    ...encodeString(exportName), // Encode Export Name
    exportKind, // Export Kind
    ...unsignedLEB128(exportIdentifier), // Export Index
  ]);
  // Return The Module
  return wasmModule;
};
// Wasm Module Start Mutations
export const setStart = (wasmModule: WasmModule, startIdentifier: number | string): WasmModule => {
  // Resolve Export Value
  if (typeof startIdentifier == 'string') {
    if (wasmModule.functionMap.has(startIdentifier))
      startIdentifier = wasmModule.functionMap.get(startIdentifier)!;
    else throw new Error(`Could Not Find Label: ${startIdentifier}`);
  }
  // Set The Start Value
  wasmModule.startSection[0] = [
    ...unsignedLEB128(startIdentifier), // Start Index
  ];
  // Return The Module
  return wasmModule;
};
// Wasm Module Data Mutations
export const addData = (
  wasmModule: WasmModule,
  memoryOffset: number,
  data: number[]
): WasmModule => {
  // TODO: Look into how this supports multiple Memories with memoryIndex param
  wasmModule.dataSection.push([
    0x00, // Segment Flags
    0x41, // Wasm i32.const Instruction
    ...unsignedLEB128(memoryOffset), // Memory Offset
    0x0b, // Wasm End Instruction
    ...unsignedLEB128(data.length), // Data Length
    ...data, // Data
  ]);
  return wasmModule;
};
// Compile Module
export const compileModule = (
  wasmModule: WasmModule,
  programName: string,
  includeDataCount = true
): Uint8Array => {
  // Add A Table
  wasmModule.tableSection.push([
    0x70, // Table Type
    0x00, // Limit Flag That We Only Want A Min Value
    ...unsignedLEB128(wasmModule.elementSection.length), // Min Value
  ]);
  // Compile Name Section
  const funcNameSection: number[] = [wasmModule.functionMap.size];
  for (const [name, index] of wasmModule.functionMap.entries()) {
    funcNameSection.push(...unsignedLEB128(index));
    funcNameSection.push(...encodeString(name));
  }
  const localNameSection: number[] = [wasmModule.localData.size];
  for (const [func, locals] of wasmModule.localData.entries()) {
    localNameSection.push(...unsignedLEB128(func));
    localNameSection.push(...unsignedLEB128(locals.size));
    for (const [name, index] of locals.entries()) {
      localNameSection.push(...unsignedLEB128(index));
      localNameSection.push(...encodeString(name));
    }
  }
  wasmModule.customSections.push([
    ...encodeString('name'),
    0x00, // The SubSection Id
    ...encodeVector(encodeString(programName)), // The Module Name
    0x01, // The SubSection Id
    ...unsignedLEB128(funcNameSection.length),
    ...funcNameSection,
    0x02, // The SubSection Id
    ...unsignedLEB128(localNameSection.length),
    ...localNameSection,
  ]);
  // Return Compiled Module
  return Uint8Array.from([
    ...[0x00, 0x61, 0x73, 0x6d], // Magic Module Header
    ...[0x01, 0x00, 0x00, 0x00], // Wasm Module Version
    // Sections
    ...createSection(WasmSection.Type, wasmModule.typeSection),
    ...createSection(WasmSection.Import, wasmModule.importSection),
    ...createSection(WasmSection.Func, wasmModule.functionSection),
    ...createSection(WasmSection.Table, wasmModule.tableSection),
    ...createSection(WasmSection.Memory, wasmModule.memorySection),
    ...createSection(WasmSection.Global, wasmModule.globalSection),
    ...createSection(WasmSection.Export, wasmModule.exportSection),
    ..._createSection(WasmSection.Start, wasmModule.startSection.flat()),
    ...createSection(WasmSection.Element, wasmModule.elementSection),
    ...(wasmModule.dataSection.length != 0 && includeDataCount
      ? _createSection(WasmSection.DataCount, unsignedLEB128(wasmModule.dataSection.length))
      : []),
    ...createSection(WasmSection.Code, wasmModule.codeSection),
    ...createSection(WasmSection.Data, wasmModule.dataSection),
    ...wasmModule.customSections
      .map((section) => _createSection(WasmSection.Custom, section))
      .flat(),
  ]);
};
