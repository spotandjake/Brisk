// dependency's
import binaryen from 'binaryen';
import path from 'path';
import { Stack } from '../Helpers/Helpers';
import { BriskError } from '../Helpers/Errors';
// type's
import {
  ParseTreeNode,
  Program,
  FunctionTypeNode,
  TypeNode
} from '../Grammar/Types';
// Constants
const paramType = binaryen.createType([ binaryen.i32, binaryen.i32 ]);
// Runtime Functions
const runtime = (module: binaryen.Module) => {
  module.addFunctionImport('_malloc', 'BRISK$MODULE$../../src/runtime/memory.wat', '_malloc', binaryen.i32, binaryen.i32);
};
// Compiler
// Allocate Space
const _Allocate = (
  module: binaryen.Module,
  vars: Map<(string | number), number>,
  size: number
) => {
  // Get the local Variable Index
  const ptrIndex = vars.size; //size|refs|type|value
  vars.set(ptrIndex, 0); // add a var to the stack for the pointer
  // Put the data into an Array Buffer
  return {
    code: [ module.local.set(ptrIndex, module.call('_malloc', [ module.i32.const((size+3)*4) ], binaryen.i32)) ],
    ptr: ptrIndex
  };
};
// Store A Value
const _Store = (module: binaryen.Module, vars: Map<(string | number), number>, typeName: string, data: number[], pointer?: number) => {
  // Calculate Size
  let size = 0;
  data.forEach((value) => {
    const ValueType = binaryen.getExpressionType(value);
    size += (ValueType == 3 || ValueType == 5) ? 2 : 1;
  });
  // Allocate some space
  const { code, ptr } = pointer != undefined ? { code: [], ptr: pointer } : _Allocate(module, vars, size);
  // Get type id
  const rtId = ['Function', 'Closure', 'Boolean', 'String', 'Number', 'Array', 'Parameters'].indexOf(typeName)+1;
  // Store Data
  code.push(module.i32.store(4, 0, module.local.get(ptr, binaryen.i32), module.i32.const(0))); // gc refs
  code.push(module.i32.store(8, 0, module.local.get(ptr, binaryen.i32), module.i32.const(rtId))); // value type
  let index = 3;
  data.forEach((value, i) => {
    const ValueType = binaryen.getExpressionType(value);
    const pointer = module.local.get(ptr, binaryen.i32);
    const NumericType = [ module.i32, module.i64, module.f32, module.f64 ][ValueType-2];
    code.push(NumericType.store(index*4, 0, pointer, value));
    index += (ValueType == 3 || ValueType == 5) ? 2 : 1;
  });
  return { code: code, ptr: module.local.get(ptr, binaryen.i32) };
};
const encoder = new TextEncoder();
class Compiler {
  private module: binaryen.Module = new binaryen.Module();
  private functions: string[] = [];
  private globals: Map<string, number> = new Map();
  private nativeImports: Map<(string | number), TypeNode> = new Map();
  compile(Node: Program): binaryen.Module {
    const { module, globals } = this;
    // Build Runtime
    runtime(module);
    // Enable Features
    module.setFeatures(binaryen.Features.MutableGlobals);
    // Initiate our memory
    module.setMemory(1,-1,'memory',[]);
    // Add our module id global
    module.addGlobal('_FunctionTableOffset', binaryen.i32, true, module.i32.const(0));
    module.addGlobal('_MemoryPointer', binaryen.i32, true, module.i32.const(0));
    // Deal with imports
    Node.imports.forEach(({ path:modulePath, identifiers }) => {
      // TODO: add import all, add type checking for imports
      if (Array.isArray(identifiers)) {
        const _modulePath = path.parse(modulePath);
        const directory = path.normalize(_modulePath.dir);
        const importPath = `${(directory == '.' ? _modulePath.name : `${directory}/${_modulePath.name}`)}${(_modulePath.ext == '.br') ? '.wasm' : _modulePath.ext}`;
        identifiers.forEach((name: string) => {
          module.addGlobalImport(`${globals.size}`, `BRISK$MODULE$${importPath}`, `BRISK$EXPORT$${name}`, binaryen.i32),
          globals.set(name, globals.size);
        });
      } else console.log('Import all: Codegen not implemented yet');
    });
    // Compile
    this.compileToken(Node, [], new Stack(), new Map());
    // Make our Function Table
    module.addTable('functions', this.functions.length, -1);
    module.addActiveElementSegment('functions', 'functions', this.functions, module.i32.const(0));
    module.autoDrop();
    // Debug info
    binaryen.setDebugInfo(true); //TODO: add a command line arg to enable this, add debug info to binary
    if (!module.validate()) module.validate();
    return module;
  }
  compileToken(
    Node: ParseTreeNode,
    functionBody: binaryen.ExpressionRef[],
    stack: Stack,
    vars: Map<(string | number), number>,
    expectResult = false,
    functionDeclaration: (boolean | string) = false
  ): (binaryen.ExpressionRef | undefined) {
    const { module, functions, nativeImports, globals } = this;
    switch(Node.type) {
      case 'Program': {
        const { body, variables } = <Program>Node;
        const functionBody: binaryen.ExpressionRef[] = [];
        const stack = variables;
        const vars = new Map();
        body.map((tkn: ParseTreeNode) => this.compileToken(tkn, functionBody, stack, vars));
        module.addFunction('_start', binaryen.none, binaryen.none, new Array(vars.size).fill(binaryen.i32), 
          module.block(null, functionBody)
        );
        module.addFunctionExport('_start', '_start');
        break;
      }
      case 'functionNode': {
        const { dataType, variables, parameters, body } = Node;
        // Allocate Space for our data
        const { code:AllocationCode, ptr:AllocationPtr } = _Allocate(module, vars, 4);
        functionBody.push(...AllocationCode);
        // Make the closure
        const closurePointers = Object.keys(variables.closure).map((name: string) => {
          if (!vars.has(name)) {
            if (functionDeclaration == name) return module.local.get(AllocationPtr, binaryen.i32);
            else {
              BriskError('Closure is capturing an unknown value', Node.position);
              return 0;
            }
          } else return module.local.get(<number>vars.get(name), binaryen.i32);
        });
        const { code:closureCode, ptr:closurePtr } = 
          Object.keys(variables.closure).length == 0 ? { code: [], ptr: module.i32.const(0) } : _Store(module, vars, 'Closure', closurePointers);
        if (closureCode) functionBody.push(...closureCode);
        // reset the function
        const funcBody: binaryen.ExpressionRef[] = [];
        const funcStack = variables;
        const funcVars: Map<(string|number), number> = new Map([
          // Set the closure parameter as a secret var
          [ 0, 0 ], // add a empty value for closure, we use numbers because all user var names are going to be strings
          [ 1, 0 ] // add a empty value for parameters
        ]);
        // Add closure assignments to the function and variable list
        let closureI = 3;
        for (const varName in variables.closure) {
          funcBody.push(
            module.local.set(
              funcVars.size,
              module.i32.load(closureI*4, 0, module.local.get(0, binaryen.i32))
            )
          );
          funcVars.set(varName, funcVars.size);
          closureI++;
        }
        // Deal with parameters
        let parametersI = 3;
        for (const param of parameters) {
          funcBody.push(
            module.local.set(
              funcVars.size,
              module.i32.load(parametersI*4, 0, module.local.get(1, binaryen.i32))
            )
          );
          funcVars.set(param.identifier, funcVars.size);
          parametersI++;
        }
        // Make the body
        body.map((tkn: ParseTreeNode) => this.compileToken(tkn, funcBody, funcStack, funcVars));
        if (dataType == 'Void') funcBody.push(module.return(module.i32.const(-1)));
        const name = `${functions.length}`;
        module.addFunction(
          name,
          paramType, binaryen.i32,
          new Array(funcVars.size).fill(binaryen.i32), 
          module.block(null, funcBody)
        );
        // Store the function
        const { code, ptr } = _Store(module, vars, 'Function', [ module.i32.const(functions.length), module.global.get('_FunctionTableOffset', binaryen.i32), closurePtr ], AllocationPtr);
        functions.push(name);
        functionBody.push(...code);
        return ptr;
      }
      case 'callStatement': {
        // Add calls for returns
        const functionArgs = Node.arguments.map(arg => <binaryen.ExpressionRef>this.compileToken(arg, functionBody, stack, vars, true));
        let wasm: (binaryen.ExpressionRef | undefined);
        if (Node.identifier == 'return') wasm = module.return(functionArgs[0]);
        else if (Node.identifier == 'memStore') wasm = module.i32.store(0, 0, module.i32.add(functionArgs[0], functionArgs[1]), functionArgs[2]);
        else if (Node.identifier == 'memLoad') wasm = module.i32.load(0, 0, module.i32.add(functionArgs[0], functionArgs[1]));
        else if (Node.identifier == 'i32Add') wasm = module.i32.add(functionArgs[0], functionArgs[1]);
        else if (nativeImports.has(Node.identifier)) {
          wasm = module.call(
            Node.identifier,
            functionArgs,
            (<FunctionTypeNode>nativeImports.get(Node.identifier)).result == 'Void' ? binaryen.none : binaryen.i32
          );
        } else if (vars.has(Node.identifier) || globals.has(Node.identifier)) {
          // Assemble the Parameter structure
          const { code:paramCode, ptr:paramPtr } = 
            Node.arguments.length == 0 ? { code: [], ptr: module.i32.const(0) } : _Store(module, vars, 'Parameters', functionArgs);
          functionBody.push(...paramCode);
          // Assemble the Function Call
          const funcPtr = vars.has(Node.identifier) ? module.local.get(<number>vars.get(Node.identifier), binaryen.i32) : module.global.get(`${globals.get(Node.identifier)}`, binaryen.i32);
          wasm = module.call_indirect(
            'functions',
            module.i32.add(
              module.i32.load(12, 0, module.copyExpression(funcPtr)),
              module.i32.load(16, 0, module.copyExpression(funcPtr))
            ),
            [ module.i32.load(20, 0, module.copyExpression(funcPtr)), paramPtr ],
            paramType, binaryen.i32
          );
        } else BriskError(`Unknown Function: ${Node.identifier}`, Node.position);
        if (expectResult) return <binaryen.ExpressionRef>wasm;
        else functionBody.push(<binaryen.ExpressionRef>wasm);
        break;
      }
      case 'declarationStatement': {
        const { identifier, value } = Node;
        const wasm = this.compileToken(value, functionBody, stack, vars, true, Node.dataType=='Function' ? Node.identifier : false);
        functionBody.push(module.local.set(vars.size, <binaryen.ExpressionRef>wasm));
        vars.set(identifier, vars.size);
        break;
      }
      case 'literal': {
        switch(Node.dataType) {
          case 'String': {
            const { code, ptr } = _Store(module, vars, 'String', [...encoder.encode(<string>Node.value)].map(i => module.i32.const(i)));
            functionBody.push(...code);
            return ptr;
          }
          case 'Number': {
            // TODO: Add support for rationals and arbitrary precision numbers
            // TODO: Consider representing all integers as i64
            const isInt: boolean = Number.isInteger(<number>Node.value);
            const data: number[] = [];
            if (isInt || typeof Node.value === 'bigint') { //integer
              if (<number>Node.value < 2147483647 && <number>Node.value > -2147483647) { //i32
                data.push(module.i32.const(1), module.i32.const(<number>Node.value));
              } else { // i64
                data.push(
                  module.i32.const(2), module.i64.const(Number(<bigint>Node.value & BigInt(0xffffffff)), Number(<bigint>Node.value >> 32n))
                ); 
              }
            } else { //float
              data.push(module.i32.const(4), module.f64.const(<number>Node.value));
            }
            const { code, ptr } = _Store(module, vars, 'Number', data);
            functionBody.push(...code);
            return ptr;
          }
          case 'Boolean': {
            const { code, ptr } = _Store(module, vars, 'Boolean', [ module.i32.const(<boolean>Node.value == true ? 1 : 0) ]);
            functionBody.push(...code);
            return ptr;
          }
          case 'i32':
            return module.i32.const(<number>Node.value);
          case 'i64':
            return module.i64.const(Number(<bigint>Node.value & BigInt(0xffffffff)), Number(<bigint>Node.value >> 32n));
          case 'f32':
            return module.f32.const(<number>Node.value);
          case 'f64':
            return module.f64.const(<number>Node.value);
          default: {
            console.log('Unknown Var Type');
            return module.i32.const(0);
          }
        }
      }
      case 'variable': {
        if (vars.has(Node.identifier)) return module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
        else if (globals.has(Node.identifier)) return module.global.get(`${globals.get(Node.identifier)}`, binaryen.i32);
        else BriskError(`Unknown Var: ${Node.identifier}`, Node.position);
        break;
      }
      case 'importWasmStatement': {
        // TODO: finish implementing global imports
        if (!(<FunctionTypeNode>Node.dataType)?.params) {
          if (![ 'i32', 'i64', 'f32', 'f64' ].includes(<string>Node.dataType))
            BriskError('Wasm Import Type Must be a Function, i32, i64, f32, f64', Node.position);
          module.addGlobalImport(
            Node.identifier, Node.path, Node.identifier,
            //@ts-ignore
            { i32: binaryen.i32, i64: binaryen.i64, f32: binaryen.f32, f64: binaryen.i64 }[<string>Node.dataType]
          );
        } else {
          module.addFunctionImport(
            Node.identifier, Node.path, Node.identifier,
            binaryen.createType(
              (<FunctionTypeNode>Node.dataType).params.map(param => (<FunctionTypeNode>param).result == 'Void' ? binaryen.none : binaryen.i32)
            ),
            (<FunctionTypeNode>Node.dataType).result == 'Void' ? binaryen.none : binaryen.i32
          );
        }
        nativeImports.set(Node.identifier, Node.dataType);
        break;
      }
      case 'exportStatement': {
        if (!globals.has(Node.identifier)) {
          module.addGlobal(`${globals.size}`, binaryen.i32, true, module.i32.const(0));
          functionBody.push(module.global.set(`${globals.size}`,  module.local.get(<number>vars.get(Node.identifier), binaryen.i32)));
          globals.set(Node.identifier, globals.size);
        }
        module.addGlobalExport(`${globals.get(Node.identifier)}`, `BRISK$EXPORT$${Node.identifier}`);
        break;
      }
      // Ignore
      case 'commentStatement':
      case 'importStatement':
        break;
      default: 
        console.log('Unknown Node Type');
        console.log(Node.type);
        break;
    }
  }
}
// CodeGen
const CodeGen = (program: Program): binaryen.Module => new Compiler().compile(program);
export default CodeGen;