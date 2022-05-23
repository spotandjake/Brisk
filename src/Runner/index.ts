// Runner
const Runner = async (wasm: Uint8Array) => {
  await WebAssembly.instantiate(wasm, {
    env: {
      print: (value: number) => {
        console.log(value);
      },
    },
  });
};
export default Runner;
