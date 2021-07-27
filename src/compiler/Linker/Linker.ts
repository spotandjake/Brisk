// Imports
import binaryen, { ExpressionRef } from 'binaryen';
import { decode, Module, ModuleImport, ModuleExport } from '@webassemblyjs/wasm-parser';
import * as path from 'path';
import * as fs from 'fs';
import { BriskError } from '../Helpers/Errors';
// Type Imports
interface foreignImport {
  internalName: string;
  externalModuleName: string;
  externalBaseName: string;
  params: binaryen.Type;
  results: binaryen.Type;
}
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
  // TODO: rewrite this so it is a lot simpler in how it works
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
  // TODO: Loop through all dependency's start making a list of globals, map imports and exports across files
  // console.log(sortedGraph);
  const functions: string[] = [];
  const start: { vars: binaryen.Type[]; body: binaryen.ExpressionRef[] } = { vars: [], body: [] };
  for (const [ file, dependency ] of sortedGraph) {
    // TODO: Linking
    // TODO: Map globals
    // TODO: Map Locals
    // TODO: Map Functions
    // TODO: Map Module Imports and merge them
    console.log('=============================================================');
    console.log(file);
    console.log('v===========================================================v');
    const dependencyModule = <binaryen.Module>dependency.binaryen_module;
    // Make A Map of all globals, functions, foreign Imports and so on
    // Make A Start Function
    for (let i = 0; i < dependencyModule.getNumFunctions(); i++) {
      const func = dependencyModule.getFunctionByIndex(i);
      const funcInfo = binaryen.getFunctionInfo(func);
      switch(funcInfo.name) {
        // Add Module Entry Function
        case '_start': {
          // Extend Start Function
          start.vars.push(...funcInfo.vars);
          start.body.push(funcInfo.body);
          break;
        }
        // TODO: Make malloc a brisk module called normally like other functions
        case '_malloc': {
          if (module.getFunction('_malloc') == 0)
            module.addFunction('_malloc', funcInfo.params, funcInfo.results, funcInfo.vars, funcInfo.body);
          break;
        }
        // Add other functions
        default: {
          break;
        }
      }
    }
  }
  // Add Malloc
  // Add Start Function
  module.addFunction('_start', binaryen.none, binaryen.none, start.vars, module.block(null, start.body));

  // OLD: old code that is being replaced
  // let moduleIndex = 0;
  // const moduleEntryList: string[] = [];
  // const foreignImports: foreignImport[] = [];
  // const functions: string[] = [];
  // const globals: string[] = [];
  // for (const [ key, value ] of sortedGraph) {
  //   const valueMap: { funcs: Map<string, string>; globals: Map<string, string>; } = { funcs: new Map(), globals: new Map() };
  //   // Get This Module
  //   const dependencyModule = <binaryen.Module>value.binaryen_module;
  //   // Namespace Variables
  //   const namespace = (variableMap: Map<string, string>,  expression: binaryen.ExpressionRef): binaryen.ExpressionRef => {
  //     const namespaceChild = (expression: binaryen.ExpressionRef) => namespace(variableMap, expression);
  //     // Parse Expression
  //     const expressionId = binaryen.getExpressionId(expression);
  //     // @ts-ignore
  //     const expressionIdName = Object.keys(binaryen.ExpressionIds)[expressionId];
  //     const expressionInfo = binaryen.getExpressionInfo(expression);
  //     switch(expressionIdName) {
  //       // TODO: map which values need to be namespaced
  //       // Actually Namespace
  //       case 'Call':
  //         return module.call(
  //           (<binaryen.CallInfo>expressionInfo).target, // namespace the name
  //           (<binaryen.CallInfo>expressionInfo).operands.map((exp) => namespaceChild(exp)),
  //           (<binaryen.CallInfo>expressionInfo).type
  //         );
  //       case 'GlobalGet': // TODO: namespace Global
  //         console.log(expressionInfo);
  //         // TODO: determine if the global is external or internal, and namespace it accordingly
  //         return expression;
  //       // Map Children
  //       case 'Block':
  //         return module.block(null, (<binaryen.BlockInfo>expressionInfo).children.map((exp) => namespaceChild(exp)));
  //       case 'Drop':
  //         return module.drop(namespaceChild((<binaryen.DropInfo>expressionInfo).value));
  //       // Return Old Value
  //       case 'GlobalSet':
  //       case 'LocalSet':
  //       case 'Store': // TODO: Figure a way to transform the function index
  //       case 'CallIndirect': // TODO: unknown but i think i need to map something on it
  //         return expression;
  //       default:
  //         BriskError(`Unknown Statement Type ${expressionIdName}`);
  //         return expression;
  //     }
  //   };
  //   // Read Functions
  //   console.log('--------------');
  //   for (let i = 0; i < dependencyModule.getNumFunctions(); i++) {
  //     const func = dependencyModule.getFunctionByIndex(i);
  //     const funcInfo = binaryen.getFunctionInfo(func);
  //     switch(funcInfo.name) {
  //       // Add Module Entry Function
  //       case '_start': {
  //         const name = `${moduleIndex}_entry`;
  //         moduleEntryList.push(name);
  //         module.addFunction(name, funcInfo.params, funcInfo.results, funcInfo.vars, namespace(new Map(), funcInfo.body));
  //         break;
  //       }
  //       // TODO: Make malloc a brisk module called normally like other functions
  //       case '_malloc': {
  //         if (module.getFunction('_malloc') == 0) {
  //           module.addFunction('_malloc', funcInfo.params, funcInfo.results, funcInfo.vars, funcInfo.body);
  //         }
  //         break;
  //       }
  //       // Add other functions
  //       default: {
  //         if (funcInfo.module != '') { // external import
  //           if (
  //             foreignImports.some(
  //               ({ internalName, externalModuleName, externalBaseName, params, results }) => (
  //                 internalName == funcInfo.name &&
  //                 externalModuleName == funcInfo.module &&
  //                 externalBaseName == funcInfo.base &&
  //                 params == funcInfo.params &&
  //                 results == funcInfo.results
  //               )
  //             )
  //           ) break;
  //           // TODO: Namespace foreign import name and call.
  //           foreignImports.push({
  //             internalName: funcInfo.name,
  //             externalModuleName: <string>funcInfo.module,
  //             externalBaseName: <string>funcInfo.base,
  //             params: funcInfo.params,
  //             results: funcInfo.results
  //           });
  //         } else { // user defined function
  //           // Add the value to the map
  //           valueMap.funcs.set(funcInfo.name, `${functions.length}`);
  //           // Add the function
  //           module.addFunction(`${functions.length}`, funcInfo.params, funcInfo.results, funcInfo.vars, funcInfo.body);
  //           functions.push(`${functions.length}`);
  //         }
  //         break;
  //       }
  //     }
  //   }
  //   // TODO: remap (function table, function variables)
  //   // TODO: Perform Linking
  //   // TODO: Renumber Globals
  //   // Increment Module Count
  //   moduleIndex++;
  // }
  // // Merge And Add Foreign Imports
  // foreignImports.forEach(({ internalName, externalModuleName, externalBaseName, params, results }) => 
  //   module.addFunctionImport(internalName, externalModuleName, externalBaseName, params, results)
  // );
  // // Add Main Start Function
  // module.addFunction(
  //   '_start', binaryen.none, binaryen.none, [], module.block(null, moduleEntryList.map((name) => module.call(name, [], binaryen.none)))
  // );
  // TODO: Type Check
  // TODO: Optimize
  module.autoDrop();
  return module;
};
export default Linker;