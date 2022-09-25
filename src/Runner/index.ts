import WASI from 'wasi';
// Perform Linking
export default async (wasm: Uint8Array): Promise<void> => {
  // Run The Linker
  //@ts-ignore
  const wasi = new WASI({
    args: process.argv
  });
  const module = new WebAssembly.Module(wasm);
  const inst = new WebAssembly.Instance(module, {
    wasi_unstable: wasi.exports,
    wasi_snapshot_preview1: wasi.exports
  });
  wasi.setMemory(inst.exports.memory);
  //@ts-ignore
  await inst.exports._start();
};