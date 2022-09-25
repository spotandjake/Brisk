// Import Linker
import fs from 'fs';
import path from 'path';
import { init, WASI } from '@wasmer/wasi';
// import nodeBindings from '@wasmer/wasi/lib/bindings/node';
import linker from '../../BriskLinker/index.gr.wasm';
// Perform Linking
export default async (source: Uint8Array, outPath: string): Uint8Array => {
  // TODO: Make this not depend on the fileSystem
  console.log(outPath)
  // Initialize Wasi
  await init();
  // Write The File To A Temporary Directory
  await fs.promises.writeFile(outPath, source);
  // Run The Linker
  let wasi = new WASI({
    preopenDirectories: {
      '/': process.cwd(),
    },
    env: {},
    args: [
      'index.gr.wasm', outPath, outPath
    ],
    bindings: {
      path: path,
      fs: fs
    }
  });
  // Instantiate the WASI module
  await wasi.instantiate(await linker(), {});
  try {
    // Run the start function
    wasi.start();
  } catch (err) {
    console.log(wasi.getStdoutString());
    console.log(wasi.getStderrString());
    process.exit();
  }
  // Read The File
  const outSource = await fs.promises.readFile(outPath);
  // Return the source
  return source;
};
