// Import Linker
import fs from 'fs';
import WASI from 'wasi';
//@ts-ignore
import linker from '../../BriskLinker/dist/index.wasm';
// Perform Linking
export default async (source: Uint8Array, outPath: string): Promise<Uint8Array> => {
  // Write The File Temporarly
  await fs.promises.writeFile(outPath, source);
  // Run The Linker
  //@ts-ignore
  const wasi = new WASI({
    args: [
      'index.gr', outPath, outPath
    ]
  });
  const inst = new WebAssembly.Instance(await linker(), {
    wasi_unstable: wasi.exports,
    wasi_snapshot_preview1: wasi.exports
  });
  wasi.setMemory(inst.exports.memory);
  //@ts-ignore
  await inst.exports._start();
  // Read The Temporary File
  const outSource = await fs.promises.readFile(outPath);
  // Return the out source
  return outSource;
};