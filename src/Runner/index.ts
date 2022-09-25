import WASI from 'wasi';
// Perform Linking
export default async (wasm: Uint8Array): void => {
  // Run The Linker
  const wasi = new WASI({
    args: process.argv
  });
  const module = new WebAssembly.Module(wasm);
  const inst = new WebAssembly.Instance(module, {
    wasi_unstable: wasi.exports,
    wasi_snapshot_preview1: wasi.exports
  });
  wasi.setMemory(inst.exports.memory);
  await inst.exports._start();
};