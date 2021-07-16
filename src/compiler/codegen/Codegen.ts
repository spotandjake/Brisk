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
// Compiler
// Build data for in our heap
const DataBuilder = (module: binaryen.Module, typeName: string, data: number[], raw=false) => {
  // Get the id
  const rtId = ['Function', 'Closure', 'Boolean', 'String', 'Number', 'Array', 'Parameters'].indexOf(typeName)+1;
  // Calculate Size
  const rtSize = 3 + data.length; // sizeValue|refs|id|Data
  // Get Pointer
  const ptr = module.i32.load(0, 0, module.i32.const(0));
  // Put the data into an Array Buffer
  const block = [
    // Call Malloc
    // Store Data
    module.i32.store(0, 0, ptr, module.i32.const(rtSize)),
    module.i32.store(4, 0, ptr, module.i32.const(0)),
    module.i32.store(8, 0, ptr, module.i32.const(rtId))
  ];
  data.forEach(
    (byte, index) =>
      block.push(module.i32.store(12+index*4, 0, ptr, raw ? byte : module.i32.const(byte)))
  );
  block.push(module.i32.store(0, 0, module.i32.const(0), module.i32.add(ptr, module.i32.const(rtSize*4))));
  return { code: block, ptr: module.i32.sub(ptr, module.i32.const(rtSize*4)) };
};
const encoder = new TextEncoder();
class Compiler {
  private module: binaryen.Module = new binaryen.Module();
  private functions: string[] = [];
  private globals: Map<(string | number), TypeNode> = new Map();
  private file: (number | null) = null;
  private funcRef: (binaryen.FunctionRef | null) = null;
  compile(Node: Program, wat: boolean): (string | Uint8Array) {
    const { module } = this;
<<<<<<< Updated upstream
=======
    // Debug info
    binaryen.setDebugInfo(true); //TODO: add a command line arg to enable this, add debug info to binary
    // Build Runtime
    runtime(module);
    // Fake Function Ref for debugging
    this.funcRef = module.addFunction('_debug', binaryen.none, binaryen.none, [], module.block(null, []));
    this.file = module.addDebugInfoFileName(
      path.join((Node.position.file as path.ParsedPath).dir, (Node.position.file as path.ParsedPath).base)
    );
>>>>>>> Stashed changes
    // Initiate our memory
    module.setMemory(1,-1,'memory',[]);
    // Add Runtime Linking
    // Compile
    this.compileToken(Node, [], new Stack(), new Map());
    // Make our Function Table
    module.addTable('functions', this.functions.length, -1);
    module.addActiveElementSegment('functions', 'functions', this.functions, module.i32.const(0));
    module.autoDrop();
<<<<<<< Updated upstream
    // Debug info
    binaryen.setDebugInfo(true); //TODO: add a command line arg to enable this
    // Optimization settings
    binaryen.setFlexibleInlineMaxSize(1);
    binaryen.setOneCallerInlineMaxSize(1);
=======
    if (!module.validate()) module.validate();
>>>>>>> Stashed changes
    return wat ? module.emitText() : module.emitBinary();
  }
  compileToken(
    Node: ParseTreeNode,
    functionBody: any[],
    stack: Stack,
    vars: Map<string, number>,
    expectResult = false,
<<<<<<< Updated upstream
    functionDeclaration:(boolean | string) = false
=======
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    functionDeclaration: (boolean | { name: string, ptr: number }) = false
>>>>>>> Stashed changes
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
        const start = module.addFunction('main', binaryen.none, binaryen.none, new Array(variables.length).fill(binaryen.i32), 
          module.block(null, [
            module.i32.store(0, 0, module.i32.const(0), module.i32.const(4)),
            ...functionBody
          ])
        );
        module.setStart(start);
        break;
      }
      case 'functionNode': {
        // TODO: allow closure to capture function it is for
        const { dataType, variables, parameters, body } = Node;
        // Make the closure
        const closurePointers = Object.keys(variables.closure).map((name: string) => module.local.get(<number>vars.get(name)));
        const { code:closureCode, ptr:closurePtr } = 
          Object.keys(variables.closure).length == 0 ? { code: [], ptr: module.i32.const(0) } : DataBuilder(module, 'Closure', closurePointers, true);
        functionBody.push(...closureCode);
        // reset the function
        const funcBody: any[] = [];
        const funcStack = variables;
        const funcVars = new Map();
        // Set the closure parameter as a secret var
        funcVars.set(0, 0); // add a empty value for closure
        funcVars.set(1, 0); // add a empty value for parameters
        // Add closure assignments to the function and variable list
        let closureI = 3;
        for (const varName in variables.closure) {
          funcBody.push(
            module.local.set(
              funcVars.size,
              module.i32.load(closureI*4, 0, module.local.get(0))
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
              module.i32.load(parametersI*4, 0, module.local.get(1))
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
          new Array(variables.length+1).fill(binaryen.i32), 
          module.block(null, funcBody)
        );
        // Store the function
        const { code, ptr } = DataBuilder(module, 'Function', [ module.i32.const(functions.length), closurePtr ], true);
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
            Node.arguments.length == 0 ? { code: [], ptr: module.i32.const(0) } : DataBuilder(module, 'Parameters', functionArgs, true);
          functionBody.push(...paramCode);
          // Assemble the Function Call
          const funcPtr = module.local.get(<number>vars.get(Node.identifier));
          wasm = module.call_indirect(
            'functions',
            module.i32.load(12, 0, funcPtr),
            [ module.i32.load(16, 0, funcPtr), paramPtr ],
            paramType, binaryen.i32
          );
        } else {
          BriskError(`Unknown Function: ${Node.identifier}`, <path.ParsedPath>Node.position.file, Node.position);
        }
        module.setDebugLocation(<binaryen.FunctionRef>this.funcRef, wasm, <number>this.file, Node.position.line, Node.position.col);
        if (expectResult) return wasm;
        else functionBody.push(wasm);
        break;
      }
      case 'declarationStatement': {
        const { identifier, value } = Node;
        functionBody.push(
          module.local.set(
            vars.size,
            this.compileToken(value, functionBody, stack, vars, true, Node.dataType=='Function'?Node.identifier:false)
          )
        );
        vars.set(identifier, vars.size);
        break;
      }
      case 'literal': {
        switch(Node.dataType) {
          case 'string': {
            const { code, ptr } = DataBuilder(module, 'String', [...encoder.encode(<string>Node.value)]);
            functionBody.push(...code);
            return ptr;
          }
          case 'number': {
            // Deal with converting between i64 and i32 and what not
            if (<number>Node.value > 2147483647) {
              BriskError('Numbers cant be bigger then 2147483647 currently', <path.ParsedPath>Node.position.file, Node.position);
            }
            const { code, ptr } = DataBuilder(module, 'Number', [<number>Node.value]);
            functionBody.push(...code);
            return ptr;
          }
          case 'boolean': {
            const { code, ptr } = DataBuilder(module, 'Boolean', [ <boolean>Node.value == true ? 1 : 0 ]);
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
<<<<<<< Updated upstream
        return module.local.get(<number>vars.get(Node.identifier));
=======
        const wasm = module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
        module.setDebugLocation(<binaryen.FunctionRef>this.funcRef, wasm, <number>this.file, Node.position.line, Node.position.col);
        return module.local.get(<number>vars.get(Node.identifier), binaryen.i32);
>>>>>>> Stashed changes
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

