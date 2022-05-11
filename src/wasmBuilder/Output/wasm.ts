import { WasmModuleType } from '../Types/Nodes';
import { varuint32 } from './Utils';
// Helpers
const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];
// Implement Wasm Builder
export const compileWasm = (wasmModule: WasmModuleType): Uint8Array => {
  // Define Sections
  const customSection: number[] = [];
  const typeSection: number[] = [];
  const importSection: number[] = [];
  const functionSection: number[] = [];
  const tableSection: number[] = [];
  const memorySection: number[] = [];
  const globalSection: number[] = [];
  const exportSection: number[] = [];
  const startSection: number[] = [];
  const elementSection: number[] = [];
  const codeSection: number[] = [];
  const dataSection: number[] = [];
  const dataCountSection: number[] = [];
  // TODO: Build Module
  for (const func of wasmModule.functions) {
    // Add Function To Function Section
    // TODO: Determine Function Body
  }
  // Assemble Module
  const module: number[] = [];
  module.push(...magicModuleHeader); // Add Magic Header
  module.push(...moduleVersion); // Add Module Version
  if (customSection.length > 0)
    module.push(0, ...varuint32(customSection.length), ...customSection);
  if (typeSection.length > 0) module.push(1, ...varuint32(typeSection.length), ...typeSection);
  if (importSection.length > 0)
    module.push(2, ...varuint32(importSection.length), ...importSection);
  if (functionSection.length > 0)
    module.push(3, ...varuint32(functionSection.length), ...functionSection);
  if (tableSection.length > 0) module.push(4, ...varuint32(tableSection.length), ...tableSection);
  if (memorySection.length > 0)
    module.push(5, ...varuint32(memorySection.length), ...memorySection);
  if (globalSection.length > 0)
    module.push(6, ...varuint32(globalSection.length), ...globalSection);
  if (exportSection.length > 0)
    module.push(7, ...varuint32(exportSection.length), ...exportSection);
  if (startSection.length > 0) module.push(8, ...varuint32(startSection.length), ...startSection);
  if (elementSection.length > 0)
    module.push(9, ...varuint32(elementSection.length), ...elementSection);
  if (codeSection.length > 0) module.push(10, ...varuint32(codeSection.length), ...codeSection);
  if (dataSection.length > 0) module.push(11, ...varuint32(dataSection.length), ...dataSection);
  if (dataCountSection.length > 0)
    module.push(12, ...varuint32(dataCountSection.length), ...dataCountSection);
  // Return Module
  return Uint8Array.from(module);
};
