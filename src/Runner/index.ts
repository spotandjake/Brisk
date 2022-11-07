import WASI from 'wasi';
// Memory Viewer
const printMemory = (memReference: WebAssembly.Memory) => {
  // Print The Buffer Raw
  console.log(memReference.buffer);
  // Parse Memory
  const memory = new Uint32Array(memReference.buffer);
  console.log(memory);
  console.log(memory.length);
  const memoryData = [];
  let currentPtr = 2;
  try {
    while (currentPtr < memory.length) {
      // Get Tag Info
      const nextptr = memory[currentPtr-2];
      const blockFree = memory[currentPtr-1];
      const blockSize = memory[currentPtr];
      // Get Contents
      const blockContents: number[] = [];
      for (let i = 1; i <= blockSize; i++) {
        blockContents.push(memory[currentPtr+i]);
      }
      memoryData.push({
        page: Math.ceil((currentPtr * 4) / 65536),
        currentPtr: currentPtr*4,
        nextPtr: nextptr,
        blockFree: blockFree == 0,
        size: blockSize,
        contents: blockContents,
        parsedContents: [ 0, 0, 0, 0 ],
      });
      if (nextptr == 0) break;
      else currentPtr = nextptr/4;
    }
  } catch (err) { console.log(err) }
  // Print The Buffer Parsed
  console.table(memoryData);
};
// Perform Linking
export default async (wasm: Uint8Array): Promise<void> => {
  try {
    //@ts-ignore
    const wasi = new WASI({
      args: process.argv
    });
    const module = new WebAssembly.Module(wasm);
    const inst = new WebAssembly.Instance(module, {
      wasi_unstable: wasi.exports,
      wasi_snapshot_preview1: wasi.exports,
      briskDebugEnv: {
        printI32: (i32: number) => {
          console.log(`[Debug]: ${i32}n`);
        },
        printI64: (i64: number) => {
          console.log(`[Debug]: ${i64}N`);
        },
        printF32: (f32: number) => {
          console.log(`[Debug]: ${f32}f`);
        },
        printF64: (f64: number) => {
          console.log(`[Debug]: ${f64}F`);
        },
        printBool: (bool: number) => {
          if (bool == 1) console.log('[Debug]: true');
          else console.log('[Debug]: false');
        },
        printPtr: (ptr: number) => {
          console.log(`[Debug]: ${ptr}ptr`);
        },
        printSpace: () => {
          console.log('[Debug]: ===================');
        }
      }
    });
    wasi.setMemory(inst.exports.memory);
    //@ts-ignore
    await inst.exports._start();
    // Log The Memory
    printMemory(<WebAssembly.Memory>inst.exports.memory);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};