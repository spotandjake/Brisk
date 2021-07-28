// Imports
import binaryen from 'binaryen';
import { decode, Module, ModuleImport, ModuleExport } from '@webassemblyjs/wasm-parser';
import * as path from 'path';
import * as fs from 'fs';
import { BriskError } from '../Helpers/Errors';
// Type Imports
interface Dependency {
  entry: boolean;
  importance: number;
  found: boolean;
  file: string;
  location: path.ParsedPath;
  imported: Set<string>;
  exports: Map<string, number>;
  imports: Map<string, string>;
  ast_body?: Module;
  binaryen_module?: binaryen.Module;
}
interface localMap {
  globals: Map<string, string>;
  functions: Map<string, string>;
}
interface wasmFunction {
  name: string;
  params: binaryen.Type;
  results: binaryen.Type;
  vars: binaryen.Type[];
  body: binaryen.ExpressionRef;
}
interface wasmGlobal {
  name: string;
  type: binaryen.Type;
  mutable: boolean;
  init: binaryen.ExpressionRef;
}
// WasmImport Type
type wasmImport = wasmFunctionImport | wasmGlobalImport;
interface wasmFunctionImport {
  type: 'FunctionImport';
  internalName: string;
  externalModuleName: string;
  externalBaseName: string;
  params: binaryen.Type;
  results: binaryen.Type;
}
interface wasmGlobalImport {
  type: 'GlobalImport';
  internalName: string;
  externalModuleName: string;
  externalBaseName: string;
  globalType: binaryen.Type;
}
// Helpers
const analyzeFile = (location: path.ParsedPath, subModule: binaryen.Module, dependencyGraph: Map<string, Dependency>, entry: boolean) => {
  // TODO: rewrite this so it is a lot simpler and does not depend on an external parser
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
      // If we do not include this already then add it to our graph
      if (!dependencyGraph.has(absolutePath)) {
        dependencyGraph.set(absolutePath, {
          entry: false,
          found: false,
          file: absolutePath,
          location: location,
          imported: new Set(),
          exports: new Map(),
          imports: new Map(),
          importance: 1
        });
      }
      // Add the imports to the graph
      const dep = <Dependency>dependencyGraph.get(absolutePath);
      dep.imported.add(exportName); //TODO: add the an array of pointers to the globals in each file for resolution, or globalize names
      // Deal with sorting
      const self = <Dependency>dependencyGraph.get(modulePath);
      if (!entry && self.importance > dep.importance-1) dep.importance = self.importance+1;
      dependencyGraph.set(absolutePath, dep);
    }
  });
  // Mark this file as found
  if (!entry) {
    const dep = <Dependency>dependencyGraph.get(modulePath);
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
      const { name:importName, module:moduleName } = <ModuleImport>moduleNode;
      if (!moduleName.startsWith('GRAIN$MODULE$')) return;
      const absolutePath = path.resolve(path.join(location.dir, `${moduleName.slice('GRAIN$MODULE$'.length)}.wasm`));
      dep.imports.set(importName, absolutePath);
    });
    // TODO: set the files this depends on
    dependencyGraph.set(modulePath, dep);
  } else {
    const moduleImports: Map<string, string> = new Map();
    imports.forEach((moduleNode) => {
      const { name:importName, module:moduleName } = <ModuleImport>moduleNode;
      if (!moduleName.startsWith('GRAIN$MODULE$')) return;
      const absolutePath = path.resolve(path.join(location.dir, `${moduleName.slice('GRAIN$MODULE$'.length)}.wasm`));
      moduleImports.set(importName, absolutePath);
    });
    dependencyGraph.set(modulePath, {
      entry: true,
      found: true,
      file: modulePath,
      location: location,
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
// Namespace the expressions in the codegen
const namespaceBody = (
  module: binaryen.Module,
  dependency: Dependency,
  linked: { [key: string]: localMap },
  locals: localMap,
  expression: binaryen.ExpressionRef
): binaryen.ExpressionRef => {
  const depModule = <binaryen.Module>dependency.binaryen_module;
  const namespace = (module: binaryen.Module, linked: { [key: string]: localMap }, locals: localMap, expression: binaryen.ExpressionRef): binaryen.ExpressionRef => {
    const expressionInfo = binaryen.getExpressionInfo(expression);
    // @ts-ignore
    const expressionIdName = Object.keys(binaryen.ExpressionIds)[expressionInfo.id];
    switch(expressionIdName) {
      case 'Invalid':
        BriskError('Invalid expression');
        break;
      case 'Block':
        return module.block(null, (<binaryen.BlockInfo>expressionInfo).children.map((exp) => namespace(module, linked, locals, exp)));
      case 'If':
        break;
      case 'Loop':
        break;
      case 'Break':
        break;
      case 'Switch':
        break;
      case 'Call': {
        // TODO: Map the call name
        const callInfo = <binaryen.CallInfo>expressionInfo;
        return module.call(
          callInfo.target,
          callInfo.operands.map((exp) => namespace(module, linked, locals, exp)),
          callInfo.type
        );
      }
      case 'CallIndirect': {
        // TODO: Map the index
        const callInfo = <binaryen.CallIndirectInfo>expressionInfo;
        return module.call_indirect(
          'functions', //TODO: make this dynamic
          namespace(module, linked, locals, callInfo.target), //TODO: map the target
          callInfo.operands.map((exp) => namespace(module, linked, locals, exp)),
          binaryen.createType(callInfo.operands.map((exp) => binaryen.getExpressionType(exp))), //TODO: find a more direct way to determine this
          callInfo.type
        );
      }
      case 'LocalSet':
        // Add support for tee sets
        return module.local.set((<binaryen.LocalSetInfo>expressionInfo).index, namespace(module, linked, locals, (<binaryen.LocalSetInfo>expressionInfo).value));
      case 'GlobalGet': {
        // TODO: Debug this
        const globalInfo = <binaryen.GlobalGetInfo>expressionInfo;
        const _globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(globalInfo.name));
        if (_globalInfo.module == '') {
          // TODO: test local mapping
          // add local mapping
          if (locals.globals.has(globalInfo.name)) {
            return module.global.get(<string>locals.globals.get(globalInfo.name), globalInfo.type);
          } else BriskError(`Unknown Local Global: ${globalInfo.name}, Linker`);
        } else {
          // add linking
          const absolutePath = path.resolve(
            path.join(dependency.location.dir, `${(<string>_globalInfo.module).slice('GRAIN$MODULE$'.length)}.wasm`)
          );
          if (linked.hasOwnProperty(absolutePath) && linked[absolutePath].globals.has(<string>_globalInfo.base)) {
            return module.global.get(<string>linked[absolutePath].globals.get(<string>_globalInfo.base), globalInfo.type);
          } else BriskError(`module: ${absolutePath} could not be resolved, Linker`);
        }
        break;
      }
      case 'GlobalSet': {
        // TODO: Add Mapping, testing, make sure this part works
        const globalInfo = <binaryen.GlobalSetInfo>expressionInfo;
        const _globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(globalInfo.name));
        if (_globalInfo.module == '') {
          // TODO: test local mapping
          // add local mapping
          if (locals.globals.has(globalInfo.name)) {
            return module.global.set(<string>locals.globals.get(globalInfo.name), namespace(module, linked, locals, globalInfo.value));
          } else BriskError(`Unknown Local Global: ${globalInfo.name}, Linker`);
        } else {
          // add linking
          const absolutePath = path.resolve(
            path.join(dependency.location.dir, `${(<string>_globalInfo.module).slice('GRAIN$MODULE$'.length)}.wasm`)
          );
          if (linked.hasOwnProperty(absolutePath) && linked[absolutePath].globals.has(<string>_globalInfo.base)) {
            return module.global.set(<string>linked[absolutePath].globals.get(<string>_globalInfo.base), namespace(module, linked, locals, globalInfo.value));
          } else BriskError(`module: ${absolutePath} could not be resolved, Linker`);
        }
        break;
      }
      case 'Load': {
        // TODO: handle float stores, and other types of store, determine how to map function index
        const loadInfo = <binaryen.LoadInfo>expressionInfo;
        if (loadInfo.bytes == 4 && !loadInfo.isAtomic) {
          return module.i32.load(
            loadInfo.offset,
            loadInfo.align,
            namespace(module, linked, locals, loadInfo.ptr)
          );
        } else if (loadInfo.bytes == 8 && !loadInfo.isAtomic) {
          return module.i64.load(
            loadInfo.offset,
            loadInfo.align,
            namespace(module, linked, locals, loadInfo.ptr)
          );
        } else {
          BriskError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
        }
        break;
      }
      case 'Store': {
        // TODO: handle float stores, and other types of store, determine how to map function index
        const storeInfo = <binaryen.StoreInfo>expressionInfo;
        if (storeInfo.bytes == 4 && !storeInfo.isAtomic) {
          return module.i32.store(
            storeInfo.offset,
            storeInfo.align,
            namespace(module, linked, locals, storeInfo.ptr),
            namespace(module, linked, locals, storeInfo.value)
          );
        } else if (storeInfo.bytes == 8 && !storeInfo.isAtomic) {
          return module.i64.store(
            storeInfo.offset,
            storeInfo.align,
            namespace(module, linked, locals, storeInfo.ptr),
            namespace(module, linked, locals, storeInfo.value)
          );
        } else {
          BriskError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
        }
        break;
      }
      // TODO:
      case 'MemoryCopy':
        break;
      case 'MemoryFill':
        break;
      case 'Unary':
        break;
      case 'Binary':
        break;
      case 'Select':
        break;
      case 'Drop':
        return module.drop(namespace(module, linked, locals, (<binaryen.DropInfo>expressionInfo).value));
      case 'Return':
        return module.return(namespace(module, linked, locals, (<binaryen.ReturnInfo>expressionInfo).value));
      case 'MemoryGrow':
        break;
      case 'TupleMake':
        break;
      case 'TupleExtract':
        break;
      // Ignore these
      case 'Nop':
      case 'MemorySize':
      case 'Unreachable':
      case 'Const':
      case 'LocalGet':
        return expression;
      // Fail if we find these
      // case 'AtomicRMW':
      // case 'AtomicCmpxchg':
      // case 'AtomicWait':
      // case 'AtomicNotify':
      // case 'AtomicFence':
      // case 'SIMDExtract':
      // case 'SIMDReplace':
      // case 'SIMDShuffle':
      // case 'SIMDTernary':
      // case 'SIMDShift':
      // case 'SIMDLoad':
      // case 'MemoryInit':
      // case 'DataDrop':
      // case 'Pop':
      // case 'RefNull':
      // case 'RefIsNull':
      // case 'RefFunc':
      // case 'RefEq':
      // case 'Try':
      // case 'Throw':
      // case 'Rethrow':
      // case 'I31New':
      // case 'I31Get':
      // case 'CallRef':
      // case 'RefTest':
      // case 'RefCast':
      // case 'BrOnCast':
      // case 'BrOnExn':
      // case 'RttCanon':
      // case 'RttSub':
      // case 'StructNew':
      // case 'StructGet':
      // case 'StructSet':
      // case 'ArrayNew':
      // case 'ArrayGet':
      // case 'ArraySet':
      // case 'ArrayLen':
      default:
        BriskError(`Linking is not yet implemented for wasm instruction: ${expressionIdName}`);
        break;
    }
    console.log(expressionIdName);
    // Return the expression
    return expression;
  };
  return namespace(module, linked, locals, expression);
};
// Linker
const Linker = (location: (path.ParsedPath|undefined), mainModule: binaryen.Module): binaryen.Module => {
  // TODO: ----------------------------------------------------------------
  // TODO: Perform Linking Step
  // TODO: Perform Mapping of function indexes
  // TODO: Merge wasmImports of the same type
  // TODO: inline all entry functions into one start function
  // TODO: Rewrite this over again so it is simpler
  // TODO: Rewrite analyzer so it doesn't require an external parser
  // TODO: Analyze the file and generate a map then apply the map on the code while generating new code for merging
  // TODO: Add Type Checking
  // TODO: ----------------------------------------------------------------
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
  // TODO: Analyze files so we can create a map of everything, and then generate code
  // TODO: Loop through all dependency's start making a list of globals, map imports and exports across files
  const functions: wasmFunction[] = [];
  const modules: wasmFunction[] = [];
  const globals: wasmGlobal[] = [];
  const wasmImports: wasmImport[] = [];
  const linked: { [key: string]: localMap } = {};
  for (const [ file, dependency ] of sortedGraph) {
    linked[dependency.file] = { globals: new Map(), functions: new Map() };
    // Vars
    const locals: localMap = { globals: new Map(), functions: new Map() };
    // Analyze Files
    console.log('=============================================================');
    console.log(file);
    console.log('v===========================================================v');
    const depModule = <binaryen.Module>dependency.binaryen_module;
    // Loop over exports
    for (let i = 0; i < depModule.getNumExports(); i++) {
      const exportInfo = binaryen.getExportInfo(depModule.getExportByIndex(i));
      switch(exportInfo.kind) {
        case 3: {//Global
          // Get Global Info
          const globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(exportInfo.value));
          // Add Linking
          linked[dependency.file].globals.set(exportInfo.name, `${globals.length}`);
          // Add Global
          globals.push({
            name: `${globals.length}`,
            type: globalInfo.type,
            mutable: globalInfo.mutable,
            init: globalInfo.init
          });
          break;
        }
        case 0: //Function
        case 1: //Table
        case 2: //Memory
        case 4: //Event
        default:
          // TODO: deal with the other types
          // console.log(`Unkown Export Kind: ${exportInfo.kind}, Linker`);
          break;
      }
    }
    // Loop over all globals
    for (let i = 0; i < depModule.getNumGlobals(); i++) {
      const globalInfo = binaryen.getGlobalInfo(depModule.getGlobalByIndex(i));
      if (globalInfo.base == '') {
        // Map the old global index to the new global index
        locals.globals.set(globalInfo.name, `${globals.length}`);
        // Renumber global
        globals.push({
          name: `${globals.length}`,
          type: globalInfo.type,
          mutable: globalInfo.mutable,
          init: globalInfo.init
        });
      } else if (!(<string>globalInfo.module).startsWith('GRAIN$MODULE$')){
        wasmImports.push({
          type: 'GlobalImport',
          internalName: globalInfo.name, // TODO: remap the internal name
          externalModuleName: <string>globalInfo.module,
          externalBaseName: <string>globalInfo.base,
          globalType: globalInfo.type
        });
      }
    }
    // Loop through the modules functions
    const OffsetStart = functions.length;
    let entry: (wasmFunction|undefined);
    for (let i = 0; i < depModule.getNumFunctions(); i++) {
      const funcInfo = binaryen.getFunctionInfo(depModule.getFunctionByIndex(i));
      // Determine what todo with the function
      if (funcInfo.name == '_start') {
        // Map Function Locals
        // Extend Start Function
        entry = {
          name: `entry_${modules.length}`,
          params: funcInfo.params,
          results: funcInfo.results,
          vars: funcInfo.vars,
          body: funcInfo.body
        };
      } else if (funcInfo.name == '_malloc') {
        // TODO: Make malloc a brisk module called normally like other functions
        if (module.getFunction('_malloc') == 0)
          module.addFunction('_malloc', funcInfo.params, funcInfo.results, funcInfo.vars, funcInfo.body);
      } else if (funcInfo.base == '') {
        // Map the old index to the new one
        locals.functions.set(funcInfo.name, `${functions.length}`);
        // User Defined Module
        functions.push({
          name: `${functions.length}`,
          params: funcInfo.params,
          results: funcInfo.results,
          vars: funcInfo.vars,
          body: funcInfo.body
        });
      } else if ((<string>funcInfo.module).startsWith('GRAIN$MODULE$')) {
        // TODO: Add to linking table
      } else {
        const importDefinition: wasmImport = {
          type: 'FunctionImport',
          internalName: funcInfo.name, // TODO: remap the name 
          externalModuleName: <string>funcInfo.module,
          externalBaseName: <string>funcInfo.base,
          params: funcInfo.params,
          results: funcInfo.results
        };
        if (!wasmImports.some((oldImportDefinition) => 
          (
            importDefinition.type == oldImportDefinition.type &&
            importDefinition.internalName == oldImportDefinition.internalName &&
            importDefinition.externalModuleName == oldImportDefinition.externalModuleName &&
            importDefinition.externalBaseName == oldImportDefinition.externalBaseName &&
            importDefinition.params == oldImportDefinition.params &&
            importDefinition.results == oldImportDefinition.results
          )
        )) wasmImports.push(importDefinition);
      }
    }
    // Map all the function body contents
    for (let index = OffsetStart; index < functions.length-OffsetStart; index++) {
      // Set The function Body
      functions[index].body = namespaceBody(module, dependency, linked, locals, functions[index].body);
    }
    // Map the entry function
    if (entry) {
      entry.body = namespaceBody(module, dependency, linked, locals, entry.body);
      modules.push(entry);
    }
  }
  // Add Imports
  for (const Import of wasmImports) {
    switch (Import.type) {
      case 'FunctionImport':
        module.addFunctionImport(Import.internalName, Import.externalModuleName, Import.externalBaseName, Import.params, Import.results);
        break;
      case 'GlobalImport':
        module.addGlobalImport(Import.internalName, Import.externalModuleName, Import.externalBaseName, Import.globalType);
        break;
      // Add support for other kinds of imports and merging imports
      default:
        console.log('unknown import type');
        break;
    }
  }
  // Add Globals
  for (const { name, type, mutable, init } of globals) {
    module.addGlobal(name, type, mutable, init);
  }
  // Add User Defined Functions
  for (const { name, params, results, vars, body } of functions) {
    module.addFunction(name, params, results, vars, body);
  }
  // Create function table
  module.addTable('functions', functions.length, -1);
  module.addActiveElementSegment('functions', 'functions', functions.map((func) => func.name), module.i32.const(0));
  // Add entry functions
  for (const { name, params, results, vars, body } of modules) {
    // TODO: convert this into codegen for one module note that locals will need to be remapped completely
    module.addFunction(name, params, results, vars, body);
  }
  // Add the start function
  const start = module.addFunction('_start', binaryen.none, binaryen.none, [], 
    module.block(null, modules.map(({ name }) => module.call(name, [], binaryen.none)))
  );
  module.addFunctionExport('_start', '_start');
  module.setStart(start);
  // TODO: Optimize, and verify
  if (!module.validate()) module.validate();
  module.optimize();
  // TODO: Type Check
  // TODO: Optimize
  module.autoDrop();
  return module;
};
export default Linker;