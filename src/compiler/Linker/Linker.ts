// Imports
import binaryen from 'binaryen';
import path from 'path';
import fs from 'fs';
import { BriskLinkerError } from '../Helpers/Errors';
// Type Imports
interface Dependency {
  entry: boolean;
  importance: number;
  found: boolean;
  file: string;
  location: path.ParsedPath;
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
  // TODO: rewrite this so it is a lot simpler
  // Parse file
  const modulePath = path.resolve(path.join(location.dir, `${location.name}.wasm`));
  const self = <Dependency>dependencyGraph.get(modulePath);
  const findImports = (base: string) => {
    if (base.startsWith('BRISK$MODULE$')) {
      const absolutePath = path.resolve(path.join(location.dir, `${base.slice('BRISK$MODULE$'.length)}.wasm`));
      // If we do not include this already then add it to our graph
      if (!dependencyGraph.has(absolutePath)) {
        dependencyGraph.set(absolutePath, {
          entry: false,
          found: false,
          file: absolutePath,
          location: location,
          importance: 1
        });
      }
      // Add the imports to the graph
      // Deal with sorting
      const dep = <Dependency>dependencyGraph.get(absolutePath);
      if (!entry && self.importance > dep.importance-1) dep.importance = self.importance+1;
      dependencyGraph.set(absolutePath, dep);
    }
  };
  // Loop over all globals
  for (let i = 0; i < subModule.getNumGlobals(); i++) {
    const globalInfo = binaryen.getGlobalInfo(subModule.getGlobalByIndex(i));
    findImports(<string>globalInfo.module);
  }
  // Loop through the modules functions
  for (let i = 0; i < subModule.getNumFunctions(); i++) {
    const funcInfo = binaryen.getFunctionInfo(subModule.getFunctionByIndex(i));
    findImports(<string>funcInfo.module);
  }
  // Mark this file as found
  if (!entry) {
    const dep = <Dependency>dependencyGraph.get(modulePath);
    dep.found = true;
    dep.binaryen_module = subModule;
    dependencyGraph.set(modulePath, dep);
  } else {
    dependencyGraph.set(modulePath, {
      entry: true,
      found: true,
      file: modulePath,
      location: location,
      importance: 0,
      binaryen_module: subModule
    });
  }
  // Go through the current map and call the ones that are not yet found
  while ([...dependencyGraph.values()].some((dep) => !dep.found)) {
    [...dependencyGraph.values()].forEach((depImport) => {
      if (depImport.found) return;
      if (!fs.existsSync(depImport.file))
        BriskLinkerError(`could not resolve ${depImport.file}`);
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
  expression: binaryen.ExpressionRef,
  exports: localMap
): binaryen.ExpressionRef => {
  const depModule = <binaryen.Module>dependency.binaryen_module;
  const namespace = (expression: binaryen.ExpressionRef): binaryen.ExpressionRef => {
    const expressionInfo = binaryen.getExpressionInfo(expression);
    const expressionIdName = Object.keys(binaryen.ExpressionIds)[expressionInfo.id];
    switch(expressionIdName) {
      case 'Invalid':
        BriskLinkerError('Invalid wasm expression');
        break;
      case 'Block':
        return module.block(null, (<binaryen.BlockInfo>expressionInfo).children.map(namespace));
      case 'If':
        return module.if(
          namespace((<binaryen.IfInfo>expressionInfo).condition),
          namespace((<binaryen.IfInfo>expressionInfo).ifTrue),
          namespace((<binaryen.IfInfo>expressionInfo).ifFalse),
        );
      case 'Loop':
        return module.loop(
          (<binaryen.LoopInfo>expressionInfo).name, //TODO: map name
          namespace((<binaryen.LoopInfo>expressionInfo).body)
        );
      case 'Break':
        return module.br(
          (<binaryen.BreakInfo>expressionInfo).name, //TODO: map name
          namespace((<binaryen.BreakInfo>expressionInfo).condition),
          namespace((<binaryen.BreakInfo>expressionInfo).value)
        );
      case 'Switch':
        return module.switch(
          (<binaryen.SwitchInfo>expressionInfo).names, //TODO: map name
          <string>(<binaryen.SwitchInfo>expressionInfo).defaultName,
          namespace((<binaryen.SwitchInfo>expressionInfo).condition),
          namespace((<binaryen.SwitchInfo>expressionInfo).value)
        );
      case 'Call': {
        const callInfo = <binaryen.CallInfo>expressionInfo;
        return module.call(
          locals.functions.has(callInfo.target) ? <string>locals.functions.get(callInfo.target) : callInfo.target,
          callInfo.operands.map(namespace),
          callInfo.type
        );
      }
      case 'CallIndirect': {
        const callInfo = <binaryen.CallIndirectInfo>expressionInfo;
        return module.call_indirect(
          'functions',
          namespace(callInfo.target),
          callInfo.operands.map((exp) => namespace(exp)),
          binaryen.createType(callInfo.operands.map((exp) => binaryen.getExpressionType(exp))),
          callInfo.type
        );
      }
      case 'LocalSet':
        if ((<binaryen.LocalSetInfo>expressionInfo).isTee) {
          return module.local.tee((<binaryen.LocalSetInfo>expressionInfo).index, namespace((<binaryen.LocalSetInfo>expressionInfo).value), (<binaryen.LocalSetInfo>expressionInfo).type);
        } else {
          return module.local.set((<binaryen.LocalSetInfo>expressionInfo).index, namespace((<binaryen.LocalSetInfo>expressionInfo).value));
        }
      case 'GlobalGet': {
        const globalInfo = <binaryen.GlobalGetInfo>expressionInfo;
        const _globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(globalInfo.name));
        if (_globalInfo.module == '') {
          // add local mapping
          if (locals.globals.has(globalInfo.name)) {
            return module.global.get(<string>locals.globals.get(globalInfo.name), globalInfo.type);
          } else BriskLinkerError(`Unknown Local Global: ${globalInfo.name}`);
        } else {
          // add linking
          const absolutePath = path.resolve(
            path.join(dependency.location.dir, `${(<string>_globalInfo.module).slice('BRISK$MODULE$'.length)}.wasm`)
          );
          if (linked.hasOwnProperty(absolutePath) && linked[absolutePath].globals.has(<string>_globalInfo.base)) {
            return module.global.get(<string>linked[absolutePath].globals.get(<string>_globalInfo.base), globalInfo.type);
          } else BriskLinkerError(`could not resolve global ${_globalInfo.base} in ${absolutePath}`);
        }
        break;
      }
      case 'GlobalSet': {
        const globalInfo = <binaryen.GlobalSetInfo>expressionInfo;
        const _globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(globalInfo.name));
        if (exports.globals.has(_globalInfo.name)) {
          return module.global.set(<string>exports.globals.get(_globalInfo.name), namespace(globalInfo.value));
        } if (_globalInfo.module == '') {
          // add local mapping
          if (locals.globals.has(globalInfo.name)) {
            return module.global.set(<string>locals.globals.get(globalInfo.name), namespace(globalInfo.value));
          } else BriskLinkerError(`Unknown Local Global: ${globalInfo.name}`);
        } else {
          // add linking
          const absolutePath = path.resolve(
            path.join(dependency.location.dir, `${(<string>_globalInfo.module).slice('BRISK$MODULE$'.length)}.wasm`)
          );
          if (linked.hasOwnProperty(absolutePath) && linked[absolutePath].globals.has(<string>_globalInfo.base)) {
            return module.global.set(<string>linked[absolutePath].globals.get(<string>_globalInfo.base), namespace(globalInfo.value));
          } else BriskLinkerError(`could not resolve module ${absolutePath}`);
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
            namespace(loadInfo.ptr)
          );
        } else if (loadInfo.bytes == 8 && !loadInfo.isAtomic) {
          return module.i64.load(
            loadInfo.offset,
            loadInfo.align,
            namespace(loadInfo.ptr)
          );
        } else {
          BriskLinkerError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
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
            namespace(storeInfo.ptr),
            namespace(storeInfo.value)
          );
        } else if (storeInfo.bytes == 8 && !storeInfo.isAtomic) {
          return module.i64.store(
            storeInfo.offset,
            storeInfo.align,
            namespace(storeInfo.ptr),
            namespace(storeInfo.value)
          );
        } else {
          BriskLinkerError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
        }
        break;
      }
      case 'Binary': {
        const binaryInfo = (<binaryen.BinaryInfo>expressionInfo);
        //@ts-ignore
        const operationType = Object.keys(binaryen.Operations)[binaryInfo.op+60];
        switch(operationType) {
          case 'AddInt32':
            return module.i32.add(namespace(binaryInfo.left), namespace(binaryInfo.right));
          default:
            BriskLinkerError(`Unknown Binary Operation: ${operationType}`);
            break;
        }
        break;
      }
      case 'MemoryCopy':
        return module.memory.copy(
          namespace((<binaryen.MemoryCopyInfo>expressionInfo).dest),
          namespace((<binaryen.MemoryCopyInfo>expressionInfo).source),
          namespace((<binaryen.MemoryCopyInfo>expressionInfo).size)
        );
      case 'MemoryFill':
        return module.memory.fill(
          namespace((<binaryen.MemoryFillInfo>expressionInfo).dest),
          namespace((<binaryen.MemoryFillInfo>expressionInfo).value),
          namespace((<binaryen.MemoryFillInfo>expressionInfo).size)
        );
      case 'Select':
        return module.select(
          namespace((<binaryen.SelectInfo>expressionInfo).condition),
          namespace((<binaryen.SelectInfo>expressionInfo).ifTrue),
          namespace((<binaryen.SelectInfo>expressionInfo).ifFalse)
        );
      case 'Drop':
        return module.drop(namespace((<binaryen.DropInfo>expressionInfo).value));
      case 'Return':
        return module.return(namespace((<binaryen.ReturnInfo>expressionInfo).value));
      case 'MemoryGrow':
        return module.memory.grow(namespace((<binaryen.MemoryGrowInfo>expressionInfo).delta));
      // Ignore these
      case 'Nop':
      case 'MemorySize':
      case 'Unreachable':
      case 'Const':
      case 'LocalGet':
        return expression;
      // Fail if we find anything we do not recognize
      default:
        BriskLinkerError(`Linking is not yet implemented for wasm instruction: ${expressionIdName}`);
        break;
    }
    BriskLinkerError(`Linking for wasm instruction ${expressionIdName} not yet implemented`, undefined, false);
    // Return the expression
    return expression;
  };
  return namespace(expression);
};
// Linker
const Linker = (location: (path.ParsedPath|undefined), mainModule: binaryen.Module): binaryen.Module => {
  // TODO: Merge wasmImports of the same type
  // TODO: Rewrite this over again so it is simpler
  // Initialize the new binaryen module
  const module = new binaryen.Module();
  // Enable Features
  module.setFeatures(binaryen.Features.MutableGlobals);
  // Initiate our memory
  module.setMemory(1,-1,'memory',[]);
  // Optimization settings
  binaryen.setShrinkLevel(3);
  binaryen.setFlexibleInlineMaxSize(3);
  binaryen.setOneCallerInlineMaxSize(100);
  // Analyze Files
  const dependencyGraph = analyzeFile(<path.ParsedPath>location, mainModule, new Map(), true);
  // Sort the dependencyGraph
  const sortedGraph = new Map([...dependencyGraph.entries()].sort((a, b) => b[1].importance - a[1].importance));
  const functions: wasmFunction[] = [];
  const modules: wasmFunction[] = [];
  const globals: wasmGlobal[] = [];
  const wasmImports: wasmImport[] = [];
  const linked: { [key: string]: localMap } = {};
  let functionTableOffset = 0;
  for (const [ , dependency ] of sortedGraph) {
    linked[dependency.file] = { globals: new Map(), functions: new Map() };
    // Vars
    const locals: localMap = { globals: new Map(), functions: new Map() };
    const exports: localMap = { globals: new Map(), functions: new Map() };
    // Analyze Files
    const depModule = <binaryen.Module>dependency.binaryen_module;
    // Loop over exports
    for (let i = 0; i < depModule.getNumExports(); i++) {
      const exportInfo = binaryen.getExportInfo(depModule.getExportByIndex(i));
      switch(exportInfo.kind) {
        case 3: { //Global
          // Get Global Info
          const globalInfo = binaryen.getGlobalInfo(depModule.getGlobal(exportInfo.value));
          // Add Linking
          linked[dependency.file].globals.set(exportInfo.name, `${globals.length}`);
          exports.globals.set(globalInfo.name, `${globals.length}`);
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
          init: globalInfo.name == 'FunctionTableOffset' ? module.i32.const(functionTableOffset) : globalInfo.init
        });
      } else if (!(<string>globalInfo.module).startsWith('BRISK$MODULE$')){
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
        // Extend Start Function
        entry = {
          name: `entry_${modules.length}`,
          params: funcInfo.params,
          results: funcInfo.results,
          vars: funcInfo.vars,
          body: funcInfo.body
        };
      } else if (funcInfo.name == '_malloc') {
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
      functions[index].body = namespaceBody(module, dependency, linked, locals, functions[index].body, exports);
    }
    // Map the entry function
    if (entry) {
      entry.body = namespaceBody(module, dependency, linked, locals, entry.body, exports);
      modules.push(entry);
    }
    functionTableOffset += functions.length;
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
      default:
        BriskLinkerError(`Unknown Import Type ${(<wasmImport>Import).type}`);
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
    module.addFunction(name, params, results, vars, body);
  }
  // Add the start function
  module.addFunction('_start', binaryen.none, binaryen.none, [], 
    module.block(null, modules.map(({ name }) => module.call(name, [], binaryen.none)))
  );
  module.addFunctionExport('_start', '_start');
  if (!module.validate()) module.validate();
  module.optimize();
  return module;
};
export default Linker;