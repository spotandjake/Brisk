// dependency's
import binaryen from 'binaryen';
import * as path from 'path';
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
  // Raw Memory Instructions: These should move to stack only types in the future, for now pointers must be standard i32
  // Briskload(Pointer: Number, offset: Number) -> Number
  module.addFunction('_Briskload', binaryen.createType([binaryen.i32,binaryen.i32]), binaryen.i32, [ ],
    module.block(null, [
      module.return(module.i32.load(module.local.get(1, binaryen.i32), 0, module.local.get(0, binaryen.i32)))
    ])
  );
  // Briskstore(Pointer: i32, offset: i32, data: i32) -> Void
  // Brisksize() -> i32
  module.addFunction('_Brisksize', binaryen.none, binaryen.i32, [],
    module.block(null, [
      module.return(module.memory.size()) // return pointer to this new value
    ])
  );
  // Briskgrow(pages: i32) -> i32
  module.addFunction('_Briskgrow', binaryen.i32, binaryen.i32, [ ],
    module.block(null, [
      module.return(module.memory.grow(module.local.get(0, binaryen.i32))) // return pointer to this new value
    ])
  );
};
// Compiler
// Build data for in our heap
const DataBuilder = (
  module: binaryen.Module,
  vars: Map<(string | number), number>,
  typeName: string,
  data: number[],
  raw=false,
  types: ('i32' | 'i64' | 'f32' | 'f64')[] =[]
) => {
  // Get the id
  const rtId = ['Function', 'Closure', 'Boolean', 'String', 'Number', 'Array', 'Parameters'].indexOf(typeName)+1;
  // Calculate Size
  let rtSize = 3 + data.length; // sizeValue|refs|id|Data
  types.forEach((Type: string) => {
    if (Type == 'i64' || Type =='f64') rtSize += 1; //little hack for 64 bit numerics as they take 8 bytes instead of 4
  });
  // Get Pointer
  const ptr = vars.size;
  vars.set(ptr, 0); // add a var to the stack for the pointer
  // Put the data into an Array Buffer
  const block = [
    // Call Malloc
    module.local.set(ptr, module.call('_malloc', [ module.i32.const(rtSize*4) ], binaryen.i32)),
    // Store Data
    module.i32.store(0, 0, module.local.get(ptr, binaryen.i32), module.i32.const(rtSize)),
    module.i32.store(4, 0, module.local.get(ptr, binaryen.i32), module.i32.const(0)),
    module.i32.store(8, 0, module.local.get(ptr, binaryen.i32), module.i32.const(rtId))
  ];
  let index = 0;
  data.forEach((byte) => {
    if (!types[index])
      return block.push(module.i32.store(12+index*4, 0, module.local.get(ptr, binaryen.i32), raw ? byte : module.i32.const(byte)));
    switch(types[index]) {
      case 'i32':
        block.push(module.i32.store(12+index*4, 0, module.local.get(ptr, binaryen.i32), raw ? byte : module.i32.const(byte)));
        break;
      case 'f32':
        block.push(module.f32.store(12+index*4, 0, module.local.get(ptr, binaryen.i32), raw ? byte : module.f32.const(byte)));
        break;
      case 'i64':
        block.push(module.i64.store(12+index*4, 0, module.local.get(ptr, binaryen.i32), raw ? byte : module.i64.const(byte, 0)));
        index += 1;
        break;
    }
    index += 1;
  });
  return { code: block, ptr: module.local.get(ptr, binaryen.i32) };
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
    return wat ? module.emitText() : module.emitBinary();
  }
  compileToken(
    Node: ParseTreeNode,
    functionBody: any[],
    stack: Stack,
    vars: Map<(string | number), number>,
    expectResult = false,
    functionDeclaration: (boolean | { name: string, ptr: number }) = false
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
        module.optimizeFunction(start);
        module.setStart(start);
        break;
      }
      case 'functionNode': {
        // TODO: allow closure to capture function it is for
        const { dataType, variables, parameters, body } = Node;
        // Make the closure
        const closurePointers = Object.keys(variables.closure).map((name: string) => module.local.get(<number>vars.get(name), binaryen.i32));
        const { code:closureCode, ptr:closurePtr } = 
          Object.keys(variables.closure).length == 0 ? { code: [], ptr: module.i32.const(0) } : DataBuilder(module, vars, 'Closure', closurePointers, true);
        functionBody.push(...closureCode);
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
        const { code, ptr } = DataBuilder(module, vars, 'Function', [ module.i32.const(functions.length), closurePtr ], true);
        functions.push(name);
        functionBody.push(...code);
        return ptr;
      }
      case 'callStatement': {
        // Add calls for return
        const functionArgs = Node.arguments.map(arg => this.compileToken(arg, functionBody, stack, vars, true));
        let wasm: any;
        if (Node.identifier == 'return') {
          wasm = module.return(functionArgs[0]);
        } else if (globals.has(Node.identifier)) {
          wasm = module.call(
            Node.identifier,
            functionArgs,
            (globals.get(Node.identifier) as FunctionTypeNode).result == 'Void' ? binaryen.none : binaryen.i32
          );
        } else if (vars.has(Node.identifier)) {
          // Assemble the Parameter structure
          const { code:paramCode, ptr:paramPtr } = 
            Node.arguments.length == 0 ? { code: [], ptr: module.i32.const(0) } : DataBuilder(module, vars, 'Parameters', functionArgs, true);
          functionBody.push(...paramCode);
          // Assemble the Function Call
          const funcPtr = module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
          wasm = module.call_indirect(
            'functions',
            module.i32.load(12, 0, funcPtr),
            [ module.i32.load(16, 0, funcPtr), paramPtr ],
            paramType, binaryen.i32
          );
        } else {
          BriskError(`Unknown Function: ${Node.identifier}`, <path.ParsedPath>Node.position.file, Node.position);
        }
        if (expectResult) return wasm;
        else functionBody.push(wasm);
        break;
      }
      case 'declarationStatement': {
        const { identifier, value } = Node;
        const name = vars.size;
        vars.set(identifier, name);
        functionBody.push(
          module.local.set(
            name,
            this.compileToken(
              value, functionBody, stack, vars, true, Node.dataType=='Function' ? { name: Node.identifier, ptr: name } : false
            )
          )
        );
        break;
      }
      case 'literal': {
        switch(Node.dataType) {
          case 'string': {
            const { code, ptr } = DataBuilder(module, vars, 'String', [...encoder.encode(<string>Node.value)]);
            functionBody.push(...code);
            return ptr;
          }
          case 'number': {
            // TODO: i64, f64, throw an error if you use a number bigger than i64 or f64 supported range
            // TODO: determine what the high and low values are
            // TODO: add floats 64
            const isInt: boolean = Number.isInteger(<number>Node.value);
            const data: number[] = [];
            const types: ('i32' | 'i64' | 'f32' | 'f64')[] = [];
            if (isInt) { //integer
              if (<number>Node.value < 2147483647 && <number>Node.value > -2147483647) { //i32
                data.push(module.i32.const(1), module.i32.const(<number>Node.value));
                types.push('i32', 'i32'); 
              } else { // i64
                console.log(binaryen.emitText(module.i64.const(3, 3)));
                data.push(module.i32.const(2), module.i64.const(0, <number>Node.value));
                types.push('i32', 'i64'); 
              }
            } else { //float
              data.push(module.i32.const(3), module.f32.const(<number>Node.value));
              types.push('i32', 'f32');
            }
            const { code, ptr } = DataBuilder(module, vars, 'Number', data, true, types);
            functionBody.push(...code);
            return ptr;
          }
          case 'boolean': {
            const { code, ptr } = DataBuilder(module, vars, 'Boolean', [ <boolean>Node.value == true ? 1 : 0 ]);
            functionBody.push(...code);
            return ptr;
          }
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
          BriskError('Wasm Import Type Must be a Function', <path.ParsedPath>Node.position.file, Node.position);
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

