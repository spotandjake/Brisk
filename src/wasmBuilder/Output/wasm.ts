import { WasmModuleType } from '../Types/Nodes';
// Helpers
const magicModuleHeader = [0x00, 0x61, 0x73, 0x6d];
const moduleVersion = [0x01, 0x00, 0x00, 0x00];
// TODO: Consider Using https://github.com/ColinEberhardt/chasm/blob/master/src/emitter.ts#L296 And Expanding It
// Implement Wasm Builder
export const compileWasm = (wasmModule: WasmModuleType): Uint8Array => {
  // TODO: Build Module Contents
  // Return Module
  return Uint8Array.from([...magicModuleHeader, ...moduleVersion]);
};
