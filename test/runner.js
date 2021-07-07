const fs = require('fs');

const decoder = new TextDecoder('utf8');

let memoryView = (memory) => {
  let memArray = new Uint32Array(memory.buffer);
  // Generate A Pretty table
  let tableBody = [];
  let row = {};
  let rowIndex = 0;
  let dataSize = 0;
  let data = [];
  memArray.forEach((dat, i) => {
    if (i == 0) {
      row = { state: 'raw', ptr:0, size: 1, type: 'pointer', value0: dat };
    } else {
      // Todo: Find Largest Row
      if (dat == 0 && dataSize == 0 && i != memArray.length) return;
      if (dataSize == 0) {
        // Push the old row to the table and make the new row
        tableBody.push(row);
        row = {};
        // This is the start of the row
        dataSize = dat - 1;
        rowIndex = 0;
        row = { state: 'raw', ptr: i*4, size: dat }
      } else {
        dataSize--;
        rowIndex++;
        if (rowIndex == 1) { // The data type
          switch(dat) {
            case 0:
              row.type = 'None';
              break;
            case 1:
              row.type = 'Function';
              break;
            case 2:
              row.type = 'Closure';
              break;
            case 3:
              row.type = 'Boolean';
              break;
            case 4:
              row.type = 'String';
              break;
            case 5:
              row.type = 'Number';
              break;
            case 6:
              row.type = 'Array';
              break;
          }
        } else {
          row[`value${rowIndex-2}`] = dat;
        }
      }
    }
  });
  tableBody.push(row);
  row = {};
  // Generate Actuals
  let table = [];
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
    }
    dat.state = 'actual';
    if (dat.type == 'None') dat.state = 'None';
    table.push(dat);
  })
  // console.table(tableBody, [ ...tableHeader, new Array(maxValueLength).fill('value') ]);
  console.table(table);
}
const runtime = async (wasm) => {
  const memory = new WebAssembly.Memory({ initial: 10, maximum:100 });
  const result = await WebAssembly.instantiate(wasm, {
    env: {
      memory: memory,
      briskmemory: () => memoryView(memory),
      print: (pointer) => {
        let memArray = [...new Uint32Array(memory.buffer)];
        let ptr = pointer/4;
        let size = memArray[ptr];
        let data = memArray.slice(ptr, ptr+size);
        console.log(pointer);
        console.log(data);
        switch(data[1]) {
            case 0:
              // None
              console.log('none');
              break;
            case 1:
              row.type = 'Function';
              // Function
              console.log('Function');
              break;
            case 2:
              // Closure
              console.log('Closure');
              break;
            case 3:
              // Boolean
              console.log(!!data[3]);
              break;
            case 4:
              // String
              console.log(
                decoder.decode(new Uint8Array(data.slice(2)))
              );
              break;
            case 5:
              // Number
              console.log(data[3]);
              break;
            case 6:
              // Array
              console.log('Array');
              break;
            default:
              console.log('Unknown Type');
              console.log(data[1]);
              break;
          }
      },
      printraw: console.log
    }
  });
  if (result.instance.exports.memory) {
    console.log('==============');
    memoryView(result.instance.exports.memory);
  }
  return () => {
    result.instance.exports.run();
  };
};
// (memory (import "env" "memory") 1)
runtime(fs.readFileSync('./code.wasm'));