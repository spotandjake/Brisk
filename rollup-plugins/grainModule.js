export default (options = {}) => {
  // Handle The Module
  return {
    name: 'grainModule',
    resolveId(id) {
      if (id.endsWith('.gr')) return id;
      return null;
    },
    load(id) {
      if (!id.endsWith('.gr')) return null;
      // Locate the grain compiler
      // Compile The Grain File
      console.log(id);
    },
    transform(code, filename) {
      // console.log(filename);
    }
  };
}