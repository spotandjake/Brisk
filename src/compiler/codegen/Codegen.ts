// dependency's
import binaryen from 'binaryen';
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
// TODO: Move runtime into brisk, after adding a few stack only values that do not depend on malloc
const runtime = (module: binaryen.Module) => {
  // _Malloc(Size: i32) -> i32
  // TODO: allow malloc to be able to deal with fragmentation and reuse blocks
  module.addFunction('_malloc', binaryen.i32, binaryen.i32, [ binaryen.i32 ],
    module.block(null, [
      // Get Current Pointer
      module.local.set(1, module.i32.load(0, 0, module.i32.const(0))),
      // Add Size To Current Pointer
      module.i32.store(
        0, 0, module.i32.const(0),
        module.i32.add(
          module.local.get(1, binaryen.i32),
          module.local.get(0, binaryen.i32)
        )
      ),
      // grow the memory if necessary
      module.if(
        module.i32.ge_u(
          module.i32.load(0, 0, module.i32.const(0)),
          module.memory.size()
        ),
        module.memory.grow(
          module.i32.const(1)
        ), // TODO: add support for when we have values bigger then 64kb calculate how many pages to grow
      ),
      // Return Current Pointer
      module.return(module.local.get(1, binaryen.i32))
    ])
  );
};
// Compiler
// Allocate Space
const _Allocate = (
  module: binaryen.Module,
  vars: Map<(string | number), number>,
  size: number
) => {
  size += 3;
  // Get the local Variable Index
  const ptrIndex = vars.size; //size|refs|type|value
  vars.set(ptrIndex, 0); // add a var to the stack for the pointer
  // Put the data into an Array Buffer
  const block = [
    // Call Malloc
    module.local.set(ptrIndex, module.call('_malloc', [ module.i32.const(size*4) ], binaryen.i32)),
    // Store Data
    module.i32.store(0, 0, module.local.get(ptrIndex, binaryen.i32), module.i32.const(size))
  ];
  return { code: block, ptr: ptrIndex };
};
// Store A Value
const _Store = (module: binaryen.Module, vars: Map<(string | number), number>, typeName: string, data: number[], pointer?: number) => {
  // Calculate Size
  let size = 0;
  data.forEach((value: number) => { //1=none,2=i32,3=i64,4=f32,5=f64
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
  data.forEach((value: number) => { //1=none,2=i32,3=i64,4=f32,5=f64
    const ValueType = binaryen.getExpressionType(value);
    switch(ValueType) {
      case 2: //i32
        code.push(module.i32.store(index*4, 0, module.local.get(ptr, binaryen.i32), value));
        break;
      case 3: //i64
        code.push(module.i64.store(index*4, 0, module.local.get(ptr, binaryen.i32), value));
        break;
      case 4: //f32
        code.push(module.f32.store(index*4, 0, module.local.get(ptr, binaryen.i32), value));
        break;
      case 5: //f64
        code.push(module.f64.store(index*4, 0, module.local.get(ptr, binaryen.i32), value));
        break;
    }
    index += (ValueType == 3 || ValueType == 5) ? 2 : 1;
  });
  return { code: code, ptr: module.local.get(ptr, binaryen.i32) };
};
const encoder = new TextEncoder();
class Compiler {
  private module: binaryen.Module = new binaryen.Module();
  private functions: string[] = [];
  private globals: Map<(string | number), TypeNode> = new Map();
  compile(Node: Program, wat: boolean): (string | Uint8Array) {
    const { module } = this;
    // Build Runtime
    runtime(module);
    // Initiate our memory
    module.setMemory(1,-1,'memory',[]);
    // Optimization settings
    binaryen.setShrinkLevel(3);
    binaryen.setFlexibleInlineMaxSize(3);
    binaryen.setOneCallerInlineMaxSize(3);
    // Compile
    this.compileToken(Node, [], new Stack(), new Map());
    // Make our Function Table
    module.addTable('functions', this.functions.length, -1);
    module.addActiveElementSegment('functions', 'functions', this.functions, module.i32.const(0));
    module.autoDrop();
    // Debug info
    binaryen.setDebugInfo(true); //TODO: add a command line arg to enable this, add debug info to binary
    if (!module.validate()) module.validate();
    console.log(module.getFeatures());
    return wat ? module.emitText() : module.emitBinary();
  }
  compileToken(
    Node: ParseTreeNode,
    functionBody: any[],
    stack: Stack,
    vars: Map<(string | number), number>,
    expectResult = false,
    functionDeclaration: (boolean | string) = false
  ): any {
    // Add malloc function
    const { module, functions, globals } = this;
    switch(Node.type) {
      case 'Program': {
        const { body, variables } = <Program>Node;
        const functionBody: any[] = [];
        const stack = variables;
        const vars = new Map();
        body.map((tkn: ParseTreeNode) => this.compileToken(tkn, functionBody, stack, vars));
        const start = module.addFunction('_start', binaryen.none, binaryen.none, new Array(vars.size).fill(binaryen.i32), 
          module.block(null, [
            module.i32.store(0, 0, module.i32.const(0), module.i32.const(4)),
            ...functionBody
          ])
        );
        // module.optimizeFunction(start);
        module.setStart(start);
        module.addFunctionExport('_start', '_start');
        break;
      }
      case 'functionNode': {
        const { dataType, variables, parameters, body } = Node;
        // Allocate Space for our data
        const { code:AllocationCode, ptr:AllocationPtr } = _Allocate(module, vars, 3);
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
        const funcBody: any[] = [];
        const funcStack = variables;
        const funcVars = new Map();
        // Set the closure parameter as a secret var
        funcVars.set(funcVars.size, 0); // add a empty value for closure, we use numbers because all user var names are going to be strings
        funcVars.set(funcVars.size, 0); // add a empty value for parameters
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
        const func = module.addFunction(
          name,
          paramType, binaryen.i32,
          new Array(funcVars.size).fill(binaryen.i32), 
          module.block(null, funcBody)
        );
        if (
          Object.keys(variables.closure).length != 0 &&
          parameters.length != 0
        ) module.optimizeFunction(func);
        // Store the function
        const { code, ptr } = _Store(module, vars, 'Function', [ module.i32.const(functions.length), closurePtr ], AllocationPtr);
        functions.push(name);
        functionBody.push(...code);
        return ptr;
      }
      case 'callStatement': {
        // Add calls for returns
        const functionArgs = Node.arguments.map(arg => this.compileToken(arg, functionBody, stack, vars, true));
        let wasm: any;
        if (Node.identifier == 'return') {
          wasm = module.return(functionArgs[0]);
        } else if (Node.identifier == 'memStore') {
          wasm = module.i32.store(0, 0, module.i32.add(functionArgs[0], functionArgs[1]), functionArgs[2]);
        } else if (Node.identifier == 'memLoad') {
          wasm = module.i32.load(0, 0, module.i32.add(functionArgs[0], functionArgs[1]));
        } else if (Node.identifier == 'i32Add') {
          wasm = module.i32.add(functionArgs[0], functionArgs[1]);
        } else if (globals.has(Node.identifier)) {
          wasm = module.call(
            Node.identifier,
            functionArgs,
            (globals.get(Node.identifier) as FunctionTypeNode).result == 'Void' ? binaryen.none : binaryen.i32
          );
        } else if (vars.has(Node.identifier)) {
          // Assemble the Parameter structure
          const { code:paramCode, ptr:paramPtr } = 
            Node.arguments.length == 0 ? { code: [], ptr: module.i32.const(0) } : _Store(module, vars, 'Parameters', functionArgs);
          functionBody.push(...paramCode);
          // Assemble the Function Call
          const funcPtr = module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
          wasm = module.call_indirect(
            'functions',
            module.i32.load(12, 0, module.copyExpression(funcPtr)),
            [ module.i32.load(16, 0, module.copyExpression(funcPtr)), paramPtr ],
            paramType, binaryen.i32
          );
        } else {
          BriskError(`Unknown Function: ${Node.identifier}`, Node.position);
        }
        if (expectResult) return wasm;
        else functionBody.push(wasm);
        break;
      }
      case 'declarationStatement': {
        const { identifier, value } = Node;
        const wasm = this.compileToken(value, functionBody, stack, vars, true, Node.dataType=='Function' ? Node.identifier : false);
        functionBody.push(module.local.set(vars.size, wasm));
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
            // TODO: Add support for rationals and arbitrary precise numbers
            // TODO: Consider representing all integers as i64
            // TODO: i64, f64, throw an error if you use a number bigger than i64 or f64 supported range
            const isInt: boolean = Number.isInteger(<number>Node.value);
            const data: number[] = [];
            if (isInt || typeof Node.value === 'bigint') { //integer
              if (<number>Node.value < 2147483647 && <number>Node.value > -2147483647) { //i32
                data.push(module.i32.const(1), module.i32.const(<number>Node.value));
              } else { // i64
                const lower = <bigint>Node.value & BigInt(0xffffffff), upper = <bigint>Node.value >> 32n;
                //@ts-ignore
                data.push(module.i32.const(2), module.i64.const(Number(lower), Number(upper))); 
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
          case 'i64': {
            const lower = <bigint>Node.value & BigInt(0xffffffff), upper = <bigint>Node.value >> 32n;
            //@ts-ignore
            return module.i64.const(Number(lower), Number(upper));
          }
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
        return module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
      }
      // case 'ImportDeclaration': {
      //   break;
      // }
      case 'importWasmStatement': {
        //@ts-ignore
        if (!Node.dataType?.params)
          BriskError('Wasm Import Type Must be a Function', Node.position);
        module.addFunctionImport(
          Node.identifier,
          Node.path,
          Node.identifier,
          binaryen.createType(
            (Node.dataType as FunctionTypeNode).params.map((param: any) => param.result == 'Void' ? binaryen.none : binaryen.i32)
          ),
          (Node.dataType as FunctionTypeNode).result == 'Void' ? binaryen.none : binaryen.i32
        );
        globals.set(Node.identifier, Node.dataType);
        break;
      }
      default: 
        console.log('Unknown Node Type');
        console.log(Node.type);
        break;
    }
  }
}
// codeGen
const CodeGen = (program: Program, wat: boolean): (string | Uint8Array) => {
  const compiler = new Compiler();
  const compiled = compiler.compile(program, wat);
  // Code gen
  return compiled;
};
export default CodeGen;

