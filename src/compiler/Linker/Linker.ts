// Imports
import binaryen from 'binaryen';
import { decode, Module, ModuleImport } from '@webassemblyjs/wasm-parser';
import * as path from 'path';
import * as fs from 'fs';
// Type Imports
interface dependency {
  found: boolean;
  file: string;
  imports: Map<string, number>;
  exports?: Map<string, number>;
  body?: binaryen.Module;
}
// Helpers
const analyzeFile = (location: path.ParsedPath, subModule: binaryen.Module, dependencyGraph: Map<string, dependency>, entry: boolean) => {
  // Parse file
  const raw = subModule.emitBinary();
  const decoderOpts = {};
  const ast = decode(raw, decoderOpts);
  const imports = (<Module>ast.body[0]).fields.filter(n => n.type == 'ModuleImport');
  imports.forEach((moduleNode) => {
    if ((<ModuleImport>moduleNode).module.startsWith('GRAIN$MODULE$')) {
      const { module:moduleFile, name:exportName } = <ModuleImport>moduleNode;
      const absolutePath = path.resolve(path.join(location.dir, `${moduleFile.slice('GRAIN$MODULE$'.length)}.wasm`));
      // If we do not include this already then add it to  our graph
      if (!dependencyGraph.has(absolutePath)) {
        dependencyGraph.set(absolutePath, {
          found: false,
          file: absolutePath,
          imports: new Map()
        });
      }
      // Add the imports to the graph
      const dep = <dependency>dependencyGraph.get(absolutePath);
      dep.imports.set(exportName, 0); //TODO: add the an array of pointers to the globals in each file for resolution, or globalize names
      dependencyGraph.set(absolutePath, dep);
      // TODO: If this file hasn't been found yet and it is below this one on the map move it above this one in the map
    }
  });
  // Mark this file as found
  const modulePath = path.resolve(path.join(location.dir, `${location.name}.wasm`));
  if (!entry) {
    const dep = <dependency>dependencyGraph.get(modulePath);
    dep.found = true;
    dep.body = subModule;
    // TODO: set the exports
    dependencyGraph.set(modulePath, dep);
  }
  // TODO: Go through the current map and call the ones that are not yet found
  while ([...dependencyGraph.values()].some((dep) => !dep.found)) {
    [...dependencyGraph.values()].forEach((depImport) => {
      // Load the file
      const wasm = fs.readFileSync(depImport.file);
      // Analyze the file
      analyzeFile(path.parse(depImport.file), binaryen.readBinary(wasm), dependencyGraph, false);
    });
  }
  // Return the current graph
  return dependencyGraph;
};
// Linker
const Linker = (location: (path.ParsedPath|undefined), mainModule: binaryen.Module): binaryen.Module => {
  // Initialize the new binaryen module
  const module = new binaryen.Module();
  // Analyze Files
  const dependencyGraph = analyzeFile(<path.ParsedPath>location, mainModule, new Map(), true);
  console.log(dependencyGraph);
  // Load files
  // Trace Imports
  // Sort Imports
  // Merge Code
  // Type Check
  // Optimize
  return module;
};
export default Linker;