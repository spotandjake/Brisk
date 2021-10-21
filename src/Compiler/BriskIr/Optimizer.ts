// Imports
import binaryen from 'binaryen';
// Main
const Optimizer = (module: binaryen.Module): binaryen.Module => {
  // Perform Basic Binaryen Optimization
  // add optimizer
  binaryen.setShrinkLevel(2);
  binaryen.setOptimizeLevel(2);
  binaryen.setFlexibleInlineMaxSize(3);
  binaryen.setOneCallerInlineMaxSize(100);
  // Verify Module
  if (!module.validate()) module.validate();
  module.optimize(); // Further Binaryen Optimization
  // Return Source
  return module;
};
// Exports
export default Optimizer;