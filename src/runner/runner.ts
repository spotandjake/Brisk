import fs from 'fs';
const decoder = new TextDecoder('utf8');

interface TableRow {
  state?: string;
  ptr?: number;
  refs?: number;
  size?: number;
  type?: string;
  [ key: string ]: any;
}
const memoryView = (memory: any) => {
  const memArray = new Uint32Array(memory.buffer);
  // Generate A Pretty table
  const tableBody = [];
  let row: TableRow = {};
  let rowIndex = 0;
  let dataSize = 0;
  memArray.forEach((dat, i) => {
    if (i == 0) {
      row = { state: 'raw', ptr:0, refs: 1, size: 1, type: 'pointer', value0: dat };
    } else {
      if (dat == 0 && dataSize == 0 && i != memArray.length) return;
      if (dataSize == 0) {
        // Push the old row to the table and make the new row
        tableBody.push(row);
        row = {};
        // This is the start of the row
        dataSize = dat - 1;
        rowIndex = 0;
        row = { state: 'raw', ptr: i*4, size: dat };
      } else {
        dataSize--;
        rowIndex++;
        if (rowIndex == 1) row.refs = dat;
        else if (rowIndex == 2) { // The data type
          row.type = ['None', 'Function', 'Closure', 'Boolean', 'String', 'Number', 'Array', 'Parameters'][dat];
        } else row[`value${rowIndex-3}`] = dat;
      }
    }
  });
  tableBody.push(row);
  row = {};
  // Generate actual values
  const table: any = [];
  tableBody.forEach((dat) => {
    if (dat.type == 'None') dat.state = 'None';
    table.push({ ...dat });
    // Generate actual
    switch(dat.type) {
      case 'String':
        Object.keys(dat).forEach((field) => {
          if (field.startsWith('value')) {
            dat[field] = decoder.decode(new Uint8Array([ dat[field] ]));
          }
        });
        break;
      case 'Boolean':
        Object.keys(dat).forEach((field) => {
          if (field.startsWith('value')) {
            dat[field] = dat[field] == 1;
          }
        });
        break;
      case 'Number': {
        let intType = 'i32';
        Object.keys(dat).forEach((field, index: number) => {
          if (field.startsWith('value')) {
            if (field == 'value0') {
              intType = dat[field] = [ 'i32', 'i64', 'f32', 'f64' ][dat[field]-1];
            } else {
              switch(intType) {
                case 'i32':
                  // Deal with negative value
                  if (dat[field] > 2147483647) {
                    dat[field] = dat[field]-4294967296;
                  }
                  break;
                case 'i64': {
                  if ((index - 6) % 2 == 0) {
                    const ptr = <number>dat['ptr']/4+index-2;
                    dat[field] = new BigInt64Array(memArray.slice(ptr, ptr+2).buffer)[0];
                  } else delete dat[field];
                  break;
                }
                case 'f64':
                  if ((index - 6) % 2 == 0) {
                    const ptr = <number>dat['ptr']/4+index-2;
                    dat[field] = new Float64Array(memArray.slice(ptr, ptr+2).buffer)[0];
                  } else delete dat[field];
                  break;
              }
            }
          }
        });
        break;
      }
    }
    dat.state = 'actual';
    if (dat.type == 'None') dat.state = 'None';
    table.push(dat);
  });
  console.table(table);
};
const runtime = async (wasmFile: string) => {
  const wasm = fs.readFileSync(wasmFile);
  const result = await WebAssembly.instantiate(wasm, {
    env: {
      print: (pointer: number) => console.log(pointer)
    }
  });
  if (result.instance.exports.memory) {
    console.log('==============');
    memoryView(result.instance.exports.memory);
  }
  return () => {
    // @ts-ignore
    result.instance.exports.run();
  };
};
// (memory (import "env" "memory") 1)

export default runtime;