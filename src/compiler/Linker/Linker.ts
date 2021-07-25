// Imports
import binaryen from 'binaryen';
import { decode, Module, ModuleImport, ModuleExport } from '@webassemblyjs/wasm-parser';
import * as path from 'path';
import * as fs from 'fs';
import { BriskError } from '../Helpers/Errors';
// Type Imports
interface dependency {
  entry: boolean;
  importance: number;
  found: boolean;
  file: string;
  imported: Set<string>;
  exports: Map<string, number>;
  imports: Map<string, number>;
  ast_body?: Module;
  binaryen_module?: binaryen.Module;
}
// Helpers
const analyzeFile = (location: path.ParsedPath, subModule: binaryen.Module, dependencyGraph: Map<string, dependency>, entry: boolean) => {
  // Parse file
  const modulePath = path.resolve(path.join(location.dir, `${location.name}.wasm`));
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
          entry: false,
          found: false,
          file: absolutePath,
          imported: new Set(),
          exports: new Map(),
          imports: new Map(),
          importance: 1
        });
      }
      // Add the imports to the graph
      const dep = <dependency>dependencyGraph.get(absolutePath);
      dep.imported.add(exportName); //TODO: add the an array of pointers to the globals in each file for resolution, or globalize names
      // Deal with sorting
      const self = <dependency>dependencyGraph.get(modulePath);
      if (!entry && self.importance > dep.importance-1) dep.importance = self.importance+1;
      dependencyGraph.set(absolutePath, dep);
    }
  });
  // Mark this file as found
  if (!entry) {
    const dep = <dependency>dependencyGraph.get(modulePath);
    dep.found = true;
    dep.ast_body = <Module>ast.body[0];
    dep.binaryen_module = subModule;
    // Map Exports to there global values
    const exports = (<Module>ast.body[0]).fields.filter(n => n.type == 'ModuleExport');
    exports.forEach((exportNode) => {
      const { name:exportName, descr } = <ModuleExport>exportNode;
      if (!exportName.startsWith('BRISK$EXPORT$')) return;
      dep.exports.set(exportName, descr.id.value);
    });
    imports.forEach((moduleNode) => {
      // TODO: add the global name
      const { name:importName, module:moduleName } = <ModuleImport>moduleNode;
      if (!moduleName.startsWith('GRAIN$MODULE$')) return;
      dep.imports.set(importName, 0);
    });
    // TODO: set the files this depends on
    dependencyGraph.set(modulePath, dep);
  } else {
    const moduleImports: Map<string, number> = new Map();
    imports.forEach((moduleNode) => {
      // TODO: add the global name
      const { name:importName, module:moduleName } = <ModuleImport>moduleNode;
      if (!moduleName.startsWith('GRAIN$MODULE$')) return;
      moduleImports.set(importName, 0);
    });
    dependencyGraph.set(modulePath, {
      entry: true,
      found: true,
      file: modulePath,
      imported: new Set(),
      exports: new Map(),
      imports: moduleImports,
      importance: 0,
      ast_body: <Module>ast.body[0],
      binaryen_module: subModule
    });
  }
  // Go through the current map and call the ones that are not yet found
  while ([...dependencyGraph.values()].some((dep) => !dep.found)) {
    [...dependencyGraph.values()].forEach((depImport) => {
      if (depImport.found) return;
      if (!fs.existsSync(depImport.file))
        BriskError(`File: ${depImport.file}, not found when linking`);
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
  // TODO: add codegen, allow exporting functions, globalize names, add typechecking
  // Initialize the new binaryen module
  const module = new binaryen.Module();
  // Enable Features
  module.setFeatures(binaryen.Features.MutableGlobals);
  // Initiate our memory
  module.setMemory(1,-1,'memory',[]);
  // Optimization settings
  binaryen.setShrinkLevel(3);
  binaryen.setFlexibleInlineMaxSize(3);
  binaryen.setOneCallerInlineMaxSize(3);
  // Analyze Files
  const dependencyGraph = analyzeFile(<path.ParsedPath>location, mainModule, new Map(), true);
  // Sort the dependencyGraph
  const sortedGraph = new Map([...dependencyGraph.entries()].sort((a, b) => b[1].importance - a[1].importance));
  console.log(sortedGraph);
  // TODO: Loop through all dependency's start making a list of globals, and functions, map imports and exports across files, merge the main functions
  let moduleIndex = 0;
  const moduleEntryList: string[] = [];
  for (const [ key, value ] of sortedGraph) {
    // Get This Module
    const dependencyModule = <binaryen.Module>value.binaryen_module;
    // TODO: Readd Functions
    // TODO: Remap (Function Indexes, function table, call_indirect)
    // TODO: Perform Linking
    // TODO: Renumber Globals
    // Add Module Entry Function
    const _start = binaryen.getFunctionInfo(dependencyModule.getFunction('_start'));
    const name = `${moduleIndex}_entry`;
    moduleEntryList.push(name);
    module.addFunction(name, _start.params, _start.results, _start.vars, _start.body);
    // Increment Module Count
    moduleIndex++;
  }
  // Add Main Start Function
  module.addFunction(
    '_start', binaryen.none, binaryen.none, [], module.block(null, moduleEntryList.map((name) => module.call(name, [], binaryen.none)))
  );
  // TODO: Type Check
  // TODO: Optimize
  module.autoDrop();
  return module;
};
export default Linker;