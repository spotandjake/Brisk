import { ExportType, WasmModuleType } from '../Types/Nodes';
import { string, varuint32 } from './Utils';
// Helpers
const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];
// Implement Wasm Builder
export const compileWasm = (wasmModule: WasmModuleType): Uint8Array => {
  // Maps
  const functionMap: Map<string, number> = new Map();
  // Define Sections
  const customSection: number[] = [];
  const typeSection: number[] = [];
  let typeCount = 0;
  const importSection: number[] = [];
  const functionSection: number[] = [];
  let funcCount = 0;
  const tableSection: number[] = [];
  const memorySection: number[] = [];
  const globalSection: number[] = [];
  const exportSection: number[] = [];
  let exportCount = 0;
  const startSection: number[] = [];
  const elementSection: number[] = [];
  const codeSection: number[] = [];
  let codeCount = 0;
  const dataSection: number[] = [];
  const dataCountSection: number[] = [];
  // TODO: Build Module
  for (let i = 0; i < wasmModule.functions.length; i++) {
    const func = wasmModule.functions[i];
    // Add To Function Map
    functionMap.set(func.name, funcCount);
    // Build Function Type
    console.log(varuint32(func.params.length));
    typeSection.push(
      0x60, // Function Type Identifier
      ...varuint32(func.params.length), // Number Of Params
      ...func.params, // Add Encoded Types
      ...varuint32(func.results.length), // Number Of Results
      ...func.results // Add Encoded Types
    );
    // Add Function Data To Function Location
    functionSection.push(typeCount);
    // Increment Type Count
    typeCount++;
    // Build Function Local Data
    const localData: number[] = [];
    localData.push(...varuint32(func.locals.length)); // Local Count
    // TODO: Combine Same Count, Local Count Should Not Be Of The Total Locals But Of The Number Of Local Types
    for (const local of func.locals) {
      // TODO: Combine same Types
      localData.push(...varuint32(1)); // TODO: Change this to be the number of locals of this type
      localData.push(local); // Push Local Type
    }
    // TODO: Build Function Body
    const bodyData: number[] = [];
    bodyData.push(0x0b); // Push Wasm End Instruction
    // Append Data To Code Section
    codeSection.push(...varuint32(localData.length + bodyData.length), ...localData, ...bodyData);
    // Increment Function Count
    funcCount++;
    codeCount++;
  }
  // Handle Exports
  for (const [key, data] of wasmModule.exports.entries()) {
    let index: number;
    // Resolve Export
    if (typeof data.internalName == 'string') {
      // Try To Resolve
      if (data.type == ExportType.function) {
        if (!functionMap.has(data.internalName))
          throw new Error(`Export Function By Name ${data.internalName} Could Not Be Resolved`);
        index = <number>functionMap.get(data.internalName);
      } else {
        throw new Error(`Export Type ${data.type} By String Not Supported`);
      }
    } else index = data.internalName;
    // Add Export To Export Section
    const exportData: number[] = [];
    exportData.push(...string(key)); // Export Name
    exportData.push(data.type); // Export Kind
    exportData.push(...varuint32(index)); // Export Index
  }
  // Assemble Module
  const module: number[] = [];
  module.push(...magicModuleHeader); // Add Magic Header
  module.push(...moduleVersion); // Add Module Version
  // if (customSection.length > 0)
  //   module.push(0x0, ...varuint32(customSection.length), ...customSection);
  if (typeSection.length > 0)
    module.push(0x1, ...varuint32(typeSection.length), ...varuint32(typeCount), ...typeSection);
  // if (importSection.length > 0)
  //   module.push(0x2, ...varuint32(importSection.length), ...importSection);
  // if (functionSection.length > 0)
  //   module.push(
  //     0x3,
  //     ...varuint32(functionSection.length),
  //     ...varuint32(funcCount),
  //     ...functionSection
  //   );
  // if (tableSection.length > 0) module.push(0x4, ...varuint32(tableSection.length), ...tableSection);
  // if (memorySection.length > 0)
  //   module.push(0x5, ...varuint32(memorySection.length), ...memorySection);
  // if (globalSection.length > 0)
  //   module.push(0x6, ...varuint32(globalSection.length), ...globalSection);
  // if (exportSection.length > 0)
  //   module.push(
  //     0x7,
  //     ...varuint32(exportSection.length),
  //     ...varuint32(exportCount),
  //     ...exportSection
  //   );
  // if (startSection.length > 0) module.push(0x8, ...varuint32(startSection.length), ...startSection);
  // if (elementSection.length > 0)
  //   module.push(0x9, ...varuint32(elementSection.length), ...elementSection);
  // if (codeSection.length > 0)
  //   module.push(0x10, ...varuint32(codeSection.length), ...varuint32(codeCount), ...codeSection);
  // if (dataSection.length > 0) module.push(0x11, ...varuint32(dataSection.length), ...dataSection);
  // if (dataCountSection.length > 0)
  //   module.push(0x12, ...varuint32(dataCountSection.length), ...dataCountSection);
  // Return Module
  return Uint8Array.from(module);
};
