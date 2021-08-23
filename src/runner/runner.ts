import fs from 'fs';
import { HeapTypeID } from '../Compiler/Compiler/Types';
const decoder = new TextDecoder('utf8');
interface TableRow {
  state?: string;
  ptr?: number;
  refs?: number;
  size?: number;
  type?: (string|HeapTypeID);
  [ key: string ]: any;
}
const memoryView = (memory: (undefined|WebAssembly.Memory)) => {
  console.log('='.repeat(process.stdout.columns));
  if (memory) {
    const memArray = new Uint32Array(memory.buffer);
    // Generate A Pretty table
    const table: TableRow[] = [];
    let row: TableRow = {};
    let rowIndex = 0;
    let dataSize = 0;
    // Helper
    const getActual = (row: TableRow) => {
      table.push({ ...row });
      // Generate actual
      switch(<HeapTypeID>row.type) {
        case HeapTypeID.String:
          Object.keys(row).forEach((field) => {
            if (field.startsWith('value')) {
              row[field] = decoder.decode(new Uint8Array([ row[field] ]));
            }
          });
          break;
        case HeapTypeID.Boolean:
          Object.keys(row).forEach((field) => {
            if (field.startsWith('value')) row[field] = row[field] == 1;
          });
          break;
        case HeapTypeID.Number: {
          let intType = 'i32';
          Object.keys(row).forEach((field, index: number) => {
            if (field.startsWith('value')) {
              if (field == 'value0') {
                intType = row[field] = [ 'i32', 'i64', 'f32', 'f64' ][row[field]-1];
              } else {
                switch(intType) {
                  case 'i32':
                    // Deal with negative value
                    if (row[field] > 2147483647) row[field] = row[field]-4294967296;
                    break;
                  case 'i64': {
                    if ((index - 6) % 2 == 0) {
                      const ptr = <number>row['ptr']/4+index-2;
                      row[field] = new BigInt64Array(memArray.slice(ptr, ptr+2).buffer)[0];
                    } else delete row[field];
                    break;
                  }
                  case 'f64':
                    if ((index - 6) % 2 == 0) {
                      const ptr = <number>row['ptr']/4+index-2;
                      row[field] = new Float64Array(memArray.slice(ptr, ptr+2).buffer)[0];
                    } else delete row[field];
                    break;
                }
              }
            }
          });
          break;
        }
      }
      row.state = row.type == HeapTypeID.None ? 'None' : 'actual';
      row.type = ['None', 'Function', 'Closure', 'Boolean', 'String', 'Number', 'Array', 'Parameters'][<number>row.type];
      table.push(row);
    };
    memArray.forEach((dat, i) => {
      if (dat == 0 && dataSize == 0 && i != memArray.length) return;
      if (dataSize == 0 ) {
        if (i != 0) getActual(row);
        // This is the start of the row
        dataSize = dat/4 - 1;
        rowIndex = 0;
        row = { state: 'raw', ptr: i*4, size: dat };
      } else {
        dataSize--;
        rowIndex++;
        if (rowIndex == 1) row.refs = dat;
        else if (rowIndex == 2) row.type = dat;
        else row[`value${rowIndex-3}`] = dat;
      }
    });
    getActual(row);
    console.table(table);
  } else console.log('No Memory Found');
};
const runtime = async (wasmFile: string) => {
  let mem: WebAssembly.Memory|null = null;
  const wasm = await fs.promises.readFile(wasmFile);
  const result = await WebAssembly.instantiate(wasm, {
    env: {
      print: (pointer: number) => console.log(pointer)
    },
    wasi_unstable: {
      fd_write: (fd: number, iovs: number, iovs_len: number, nwritten: number): number => {
        // TODO: make this polyfill work
        if (mem) {
          decoder.decode(new Uint8Array(mem.buffer.slice(iovs, iovs+iovs_len)));
        }
        return 0;
      }
    }
  });
  mem = <WebAssembly.Memory>result.instance.exports.memory;
  (<() => void>result.instance.exports._start)();
  memoryView(<WebAssembly.Memory>result.instance.exports.memory);
};
export default runtime;