const runtime = async (wasm) => {
  const memory = new WebAssembly.Memory({ initial: 1 });
  const table = new WebAssembly.Table({ initial: 1, element:"anyfunc" });
  const result = await WebAssembly.instantiate(wasm, {
    env: {
      print: console.log
    }
  });
  return () => {
    result.instance.exports.run();
  };
};
fetch('./code.wasm').then(response =>
  response.arrayBuffer()
).then(bytes => runtime(bytes) ).then(results => {
  // Do something with the results!
  console.log('results');
  console.log(results);
});