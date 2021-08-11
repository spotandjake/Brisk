// Imports
import binaryen from 'binaryen';
import path from 'path';
import fs from 'fs';
import { BriskLinkerError } from '../Helpers/Errors';
// Types
import { Pool, Dependency, ModuleType, CountPool, MergePool, FunctionImport } from './LinkerTypes';
// Constants
const BriskIdentifier = 'BRISK$MODULE$';
// Helpers
const namespace = (
  module: binaryen.Module,
  expression: binaryen.ExpressionRef,
  dependency: Dependency,
  modulePool: Pool
): binaryen.ExpressionRef  => {
  // Make a simpler function for use inside this function
  const _namespace = (exp: binaryen.ExpressionRef) => namespace(module, exp, dependency, modulePool);
  // Get ExpressionInfo
  const expressionInfo = binaryen.getExpressionInfo(expression);
  // NameSpace Expression
  // TODO: would be preferable to find a way i do not need to code functionality for every piece and only need to code for things that require mapping, and then all sub expressions map
  // TODO: change the types so i can use type guards over type casts
  switch (expressionInfo.id) {
    case binaryen.ExpressionIds.Invalid:
      BriskLinkerError('Invalid wasm expression');
      return expression; // Code never gets here
    case binaryen.ExpressionIds.Block:
      return module.block(null, (<binaryen.BlockInfo>expressionInfo).children.map(_namespace));
    case binaryen.ExpressionIds.If:
      return module.if(
        _namespace((<binaryen.IfInfo>expressionInfo).condition),
        _namespace((<binaryen.IfInfo>expressionInfo).ifTrue),
        (<binaryen.IfInfo>expressionInfo).ifFalse == 0 ? undefined : _namespace((<binaryen.IfInfo>expressionInfo).ifFalse)
      );
    case binaryen.ExpressionIds.Loop:
      return module.loop(
        (<binaryen.LoopInfo>expressionInfo).name, //TODO: map name
        _namespace((<binaryen.LoopInfo>expressionInfo).body)
      );
    case binaryen.ExpressionIds.Break:
      return module.br(
        (<binaryen.BreakInfo>expressionInfo).name, //TODO: map name
        _namespace((<binaryen.BreakInfo>expressionInfo).condition),
        _namespace((<binaryen.BreakInfo>expressionInfo).value)
      );
    case binaryen.ExpressionIds.Switch:
      return module.switch(
        (<binaryen.SwitchInfo>expressionInfo).names, //TODO: map name
        <string>(<binaryen.SwitchInfo>expressionInfo).defaultName,
        _namespace((<binaryen.SwitchInfo>expressionInfo).condition),
        _namespace((<binaryen.SwitchInfo>expressionInfo).value)
      );
    case binaryen.ExpressionIds.Call:
      return module.call(
        <string>modulePool.functions.get((<binaryen.CallInfo>expressionInfo).target),
        (<binaryen.CallInfo>expressionInfo).operands.map(_namespace),
        expressionInfo.type
      );
    case binaryen.ExpressionIds.CallIndirect: {
      const callInfo = <binaryen.CallIndirectInfo>expressionInfo;
      return module.call_indirect(
        'functions',
        _namespace(callInfo.target),
        callInfo.operands.map(_namespace),
        binaryen.createType(callInfo.operands.map(binaryen.getExpressionType)),
        callInfo.type
      );
    }
    case binaryen.ExpressionIds.LocalSet: {
      const { isTee, index:i, value:v, type } = <binaryen.LocalSetInfo>expressionInfo;
      return isTee ? module.local.tee(i, _namespace(v), type) : module.local.set(i, _namespace(v));
    }
    case binaryen.ExpressionIds.GlobalGet:
      if (!modulePool.globals.has((<binaryen.GlobalGetInfo>expressionInfo).name))
        BriskLinkerError(`Unknown Global: ${(<binaryen.GlobalGetInfo>expressionInfo).name}`);
      return module.global.get(
        <string>modulePool.globals.get((<binaryen.GlobalGetInfo>expressionInfo).name),
        (<binaryen.GlobalGetInfo>expressionInfo).type
      );
    case binaryen.ExpressionIds.GlobalSet:
      if (!modulePool.globals.has((<binaryen.GlobalSetInfo>expressionInfo).name))
        BriskLinkerError(`Unknown Global: ${(<binaryen.GlobalSetInfo>expressionInfo).name}`);
      return module.global.set(
        <string>modulePool.globals.get((<binaryen.GlobalSetInfo>expressionInfo).name),
        _namespace((<binaryen.GlobalSetInfo>expressionInfo).value)
      );
    case binaryen.ExpressionIds.Load: {
      // TODO: handle float stores, and other types of store, determine how to map function index
      const loadInfo = <binaryen.LoadInfo>expressionInfo;
      if (loadInfo.bytes == 4 && !loadInfo.isAtomic) {
        return module.i32.load(
          loadInfo.offset,
          loadInfo.align,
          _namespace(loadInfo.ptr)
        );
      } else if (loadInfo.bytes == 8 && !loadInfo.isAtomic) {
        return module.i64.load(
          loadInfo.offset,
          loadInfo.align,
          _namespace(loadInfo.ptr)
        );
      } else {
        BriskLinkerError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
        return expression; // Program Never Gets Here
      }
    }
    case binaryen.ExpressionIds.Store: {
      // TODO: handle float stores, and other types of store, determine how to map function index
      const storeInfo = <binaryen.StoreInfo>expressionInfo;
      if (storeInfo.bytes == 4 && !storeInfo.isAtomic) {
        return module.i32.store(
          storeInfo.offset,
          storeInfo.align,
          _namespace(storeInfo.ptr),
          _namespace(storeInfo.value)
        );
      } else if (storeInfo.bytes == 8 && !storeInfo.isAtomic) {
        return module.i64.store(
          storeInfo.offset,
          storeInfo.align,
          _namespace(storeInfo.ptr),
          _namespace(storeInfo.value)
        );
      } else {
        BriskLinkerError(`Unknown Store Type with Bytes Count: ${(<binaryen.StoreInfo>expressionInfo).bytes}`);
        return expression; // Program Never Gets Here
      }
    }
    case binaryen.ExpressionIds.Binary: {
      const binaryInfo = (<binaryen.BinaryInfo>expressionInfo);
      switch(<binaryen.Operations>(binaryInfo.op+60)) {
        case binaryen.Operations.AddInt32:
          return module.i32.add(_namespace(binaryInfo.left), _namespace(binaryInfo.right));
        case binaryen.Operations.LeUInt32:
          return module.i32.le_u(_namespace(binaryInfo.left), _namespace(binaryInfo.right));
        case binaryen.Operations.GeUInt32:
          return module.i32.ge_u(_namespace(binaryInfo.left), _namespace(binaryInfo.right));
        default:
          BriskLinkerError(`Unknown Binary Operation: ${binaryInfo.op+60}`);
          return expression; // The Program Never Reaches This Line
      }
    }
    case binaryen.ExpressionIds.MemoryCopy:
      return module.memory.copy(
        _namespace((<binaryen.MemoryCopyInfo>expressionInfo).dest),
        _namespace((<binaryen.MemoryCopyInfo>expressionInfo).source),
        _namespace((<binaryen.MemoryCopyInfo>expressionInfo).size)
      );
    case binaryen.ExpressionIds.MemoryFill:
      return module.memory.fill(
        _namespace((<binaryen.MemoryFillInfo>expressionInfo).dest),
        _namespace((<binaryen.MemoryFillInfo>expressionInfo).value),
        _namespace((<binaryen.MemoryFillInfo>expressionInfo).size)
      );
    case binaryen.ExpressionIds.Select:
      return module.select(
        _namespace((<binaryen.SelectInfo>expressionInfo).condition),
        _namespace((<binaryen.SelectInfo>expressionInfo).ifTrue),
        _namespace((<binaryen.SelectInfo>expressionInfo).ifFalse)
      );
    case binaryen.ExpressionIds.Drop:
      return module.drop(_namespace((<binaryen.DropInfo>expressionInfo).value));
    case binaryen.ExpressionIds.Return:
      return module.return(_namespace((<binaryen.ReturnInfo>expressionInfo).value));
    case binaryen.ExpressionIds.MemoryGrow:
      return module.memory.grow(_namespace((<binaryen.MemoryGrowInfo>expressionInfo).delta));
    // Ignore these
    case binaryen.ExpressionIds.Nop:
    case binaryen.ExpressionIds.MemorySize:
    case binaryen.ExpressionIds.Unreachable:
    case binaryen.ExpressionIds.Const:
    case binaryen.ExpressionIds.LocalGet:
      return expression;
    default:
      BriskLinkerError(`Linking For ExpressionType: ${expressionInfo.id}, not yet implemented`);
      return expression; // The Program Never Gets Here
  }
};
// TODO: i think i parse the locations many times i should just parse them once
const analyzeFile = (
  location: path.ParsedPath,
  module: binaryen.Module,
  dependencyGraph: Map<string, Dependency>,
  entry=true
): Map<string, Dependency> => {
  // Determine File Information
  const modulePath = path.resolve(path.join(location.dir, `${location.name}${location.ext}`));
  const self = <Dependency>dependencyGraph.get(modulePath);
  // Function To Determine Import Type and Modify Importance
  const _analyzeExpression = (base: string) => {
    if (base.startsWith(BriskIdentifier)) {
      // Modify Importance
      const absolutePath = resolveModuleLocation(location.dir, base);
      // If we do not include this already then add it to our graph
      if (!dependencyGraph.has(absolutePath)) {
        dependencyGraph.set(absolutePath, {
          entry: false,
          importance: 1,
          found: false,
          location: absolutePath
        });
      }
      // Deal with sorting
      const dep = <Dependency>dependencyGraph.get(absolutePath);
      if (!entry && self.importance > dep.importance-1) dep.importance = self.importance+1;
      dependencyGraph.set(absolutePath, dep);
    }
  };
  // Determine File Data
  for (let i = 0; i < module.getNumGlobals(); i++) {
    _analyzeExpression(<string>binaryen.getGlobalInfo(module.getGlobalByIndex(i)).module);
  }
  for (let i = 0; i < module.getNumFunctions(); i++) {
    _analyzeExpression(<string>binaryen.getFunctionInfo(module.getFunctionByIndex(i)).module);
  }
  // Mark this file as found
  if (!entry) dependencyGraph.set(modulePath, { ...<Dependency>dependencyGraph.get(modulePath), found: true, binaryen_module: module });
  else dependencyGraph.set(modulePath, { entry: true, found: true, location: modulePath, importance: 0, binaryen_module: module});
  // Go through the current map and call the ones that are not yet found
  while ([...dependencyGraph.values()].some((dep) => !dep.found)) {
    [...dependencyGraph.values()].forEach((depImport) => {
      if (depImport.found) return;
      if (!fs.existsSync(depImport.location))
        BriskLinkerError(`could not resolve ${depImport.location}`);
      // Analyze the file
      const _parsedPath = path.parse(depImport.location);
      const _fileInformation = fs.readFileSync(depImport.location);
      analyzeFile(_parsedPath, _parsedPath.ext == '.wat' ? binaryen.parseText(_fileInformation.toString('utf-8')) : binaryen.readBinary(_fileInformation), dependencyGraph, false);
    });
  }
  // Return the current graph
  return dependencyGraph;
};
const serializeExportName = (file: string, name: string) => `${file}||${name}`;
const resolveModuleLocation = (dir: string, base: string) => path.resolve(path.join(dir, `${base.slice(BriskIdentifier.length)}`));
const resolveModuleType = (base: string): ModuleType => {
  if (base.startsWith(BriskIdentifier)) return ModuleType.BriskModule;
  else if (base == '') return ModuleType.LocalModule;
  else return ModuleType.WasmModule;
};
// Main
const Linker = (location: path.ParsedPath, mainModule: binaryen.Module): binaryen.Module => {
  // Initialize variables
  const LinkPool: Pool = {
    globals: new Map(),
    functions: new Map(),
    imports: new Map(),
    exports: new Map()
  };
  const mergePool: MergePool = {
    globals: [],
    functions: [],
    functionTable: [],
    imports: [],
    exports: []
  };
  const countPool: CountPool = {
    globals: 0,
    functions: 0
  };
  const entryFunctions: string[] = [];
  // Initialize Binaryen Module
  const module = new binaryen.Module();
  // Make Dependency Graph
  const dependencyGraph = analyzeFile(location, mainModule, new Map());
  // Merge Files
  const sortedGraph = [...dependencyGraph.values()].sort((a, b) => b.importance - a.importance);
  for (const dependency of sortedGraph) {
    // Interpret the dependency
    const depModule = <binaryen.Module>dependency.binaryen_module;
    // Make variables
    const modulePool: Pool = {
      globals: new Map(),
      functions: new Map(),
      imports: new Map(),
      exports: new Map()
    };
    const moduleFunctionOffset = mergePool.functions.length;
    const tableOffset = mergePool.functionTable.length;
    // Go Over Globals
    for (let i = 0; i < depModule.getNumGlobals(); i++) {
      const globalInfo = binaryen.getGlobalInfo(depModule.getGlobalByIndex(i));
      switch (resolveModuleType(<string>globalInfo.module)) {
        case ModuleType.BriskModule:
          modulePool.globals.set(
            globalInfo.name,
            <string>LinkPool.globals.get(
              serializeExportName(
                resolveModuleLocation(
                  path.parse(dependency.location).dir,
                  <string>globalInfo.module
                ),
                <string>globalInfo.base
              )
            )
          );
          break;
        case ModuleType.WasmModule: {
          const previousImport = mergePool.imports.find(
            (imp) =>
              imp.type == 'GlobalImport' &&
              imp.value.externalModuleName == <string>globalInfo.module &&
              imp.value.externalBaseName == <string>globalInfo.base &&
              imp.value.globalType == globalInfo.type
          );
          if (!previousImport)  {
            mergePool.imports.push({
              type: 'GlobalImport',
              value: {
                internalName: `${countPool.globals}`,
                externalModuleName: <string>globalInfo.module,
                externalBaseName: <string>globalInfo.base,
                globalType: globalInfo.type
              }
            });
          }
          modulePool.globals.set(globalInfo.name, previousImport ? previousImport.value.internalName : `${countPool.globals}`);
          break;
        }
        case ModuleType.LocalModule:
          if (globalInfo.name == '_MemoryPointer') {
            modulePool.globals.set('_MemoryPointer', '_MemoryPointer');
            break;
          }
          mergePool.globals.push({
            name: `${countPool.globals}`,
            type: globalInfo.type,
            mutable: globalInfo.mutable,
            init: globalInfo.name == '_FunctionTableOffset' ? module.i32.const(tableOffset) : globalInfo.init
          });
          modulePool.globals.set(globalInfo.name, `${countPool.globals}`);
          countPool.globals++;
          break;
      }
    }
    // Go Over Functions
    for (let i = 0; i < depModule.getNumFunctions(); i++) {
      const funcInfo = binaryen.getFunctionInfo(depModule.getFunctionByIndex(i));
      switch (resolveModuleType(<string>funcInfo.module)) {
        case ModuleType.BriskModule:
          modulePool.functions.set(
            funcInfo.name,
            <string>LinkPool.functions.get(
              serializeExportName(
                resolveModuleLocation(
                  path.parse(dependency.location).dir,
                  <string>funcInfo.module
                ),
                <string>funcInfo.base
              )
            )
          );
          break;
        case ModuleType.WasmModule: {
          const previousImport = mergePool.imports.find(
            (imp) =>
              imp.type == 'FunctionImport' &&
              imp.value.externalModuleName == <string>funcInfo.module &&
              imp.value.externalBaseName == <string>funcInfo.base &&
              imp.value.params == funcInfo.params &&
              imp.value.results == funcInfo.results
          );
          modulePool.functions.set(funcInfo.name, previousImport ? previousImport.value.internalName : `${countPool.functions}`);
          if (!previousImport)  {
            mergePool.imports.push({
              type: 'FunctionImport',
              value: {
                internalName: `${countPool.functions}`,
                externalModuleName: <string>funcInfo.module,
                externalBaseName: <string>funcInfo.base,
                params: funcInfo.params,
                results: funcInfo.results
              }
            });
            countPool.functions++;
          }
          break;
        }
        case ModuleType.LocalModule:
          mergePool.functions.push({
            name: `${countPool.functions}`,
            params: funcInfo.params,
            results: funcInfo.results,
            vars: funcInfo.vars,
            body: funcInfo.body
          });
          modulePool.functions.set(funcInfo.name, `${countPool.functions}`);
          if (funcInfo.name == '_start') entryFunctions.push(`${countPool.functions}`);
          else {
            mergePool.functionTable.push(`${countPool.functions}`);
          }
          countPool.functions++;
          break;
      }
    }
    // Go Over Exports
    for (let i = 0; i < depModule.getNumExports(); i++) {
      const exportInfo = binaryen.getExportInfo(depModule.getExportByIndex(i));
      switch (exportInfo.kind) {
        case binaryen.ExternalKinds.Function:
          LinkPool.functions.set(
            serializeExportName(dependency.location, exportInfo.name),
            <string>modulePool.functions.get(exportInfo.value)
          );
          break;
        case binaryen.ExternalKinds.Memory: // ignore this
          break;
        case binaryen.ExternalKinds.Global:
          LinkPool.globals.set(
            serializeExportName(dependency.location, exportInfo.name),
            <string>modulePool.globals.get(exportInfo.value)
          );
          break;
        case binaryen.ExternalKinds.Table:
        case binaryen.ExternalKinds.Event:
        default:
          BriskLinkerError(`have not yet implemented linking for exports of type ${exportInfo.kind}`, undefined, false);
          break;
      }
    }
    // Namespace Function Bodies
    for (let i = moduleFunctionOffset; i < mergePool.functions.length; i++) {
      mergePool.functions[i].body = namespace(module, mergePool.functions[i].body, dependency, modulePool);
    }
  }
  // Generate Source
  for (const { name, type, mutable, init } of mergePool.globals) {
    module.addGlobal(name, type, mutable, init);
  }
  for (const { name, params, results, vars, body } of mergePool.functions) {
    module.addFunction(name, params, results, vars, body);
  }
  // add wasm imports
  for (const value of mergePool.imports) {
    // TODO: add support for importing other types then just functions
    if (value.type == 'FunctionImport') {
      const { internalName, externalModuleName, externalBaseName, params, results } = (<FunctionImport>value).value;
      module.addFunctionImport(internalName, externalModuleName, externalBaseName, params, results);
    } else BriskLinkerError(`Unknown Wasm Import Type ${value.type}`);
  }
  // Add Known Globals
  module.addGlobal('_MemoryPointer', binaryen.i32, true, module.i32.const(0));
  // Add Start Function
  module.addFunction('_start', binaryen.none, binaryen.none, [],
    module.block(null, entryFunctions.map((name) => module.call(name, [], binaryen.none)))
  );
  module.addFunctionExport('_start', '_start');
  // TODO: Export all exports from the entry along with all non brisk exports
  // Add Function Table
  module.addTable('functions', mergePool.functionTable.length, -1);
  module.addActiveElementSegment('functions', 'functions', mergePool.functionTable.map((func) => func), module.i32.const(0));
  // Setup our wasm Module
  module.setFeatures(binaryen.Features.MutableGlobals);
  // Initiate our memory
  module.setMemory(1,-1,'memory',[]);
  // add verifier
  if (!module.validate()) module.validate();
  // Return Source
  return module;
};
// Exports
export default Linker;