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
// Compiler
const DataBuilder = (module: binaryen.Module, typeName: string, data: number[]) => {
  // Get the id
  let rtId = 0;
  switch (typeName) {
    case 'Function':
      rtId = 1;
      break;
    case 'Closure':
      rtId = 2;
      break;
    case 'Boolean':
      rtId = 3;
      break;
    case 'String':
      rtId = 4;
      break;
    case 'Number':
      rtId = 5;
      break;
    case 'Array':
      rtId = 6;
      break;
    case 'Parameters':
      rtId = 7;
      break;
  }
  // Calculate Size
  const rtSize = 2 + data.length; // Data Size + id + sizeValue
  // Get Pointer
  const ptr = module.i32.load(0, 0, module.i32.const(0));
  // Put the data into an Array Buffer
  const block = [
    // Call Malloc
    // Store Data
    module.i32.store(0, 0, ptr, module.i32.const(rtSize)),
    module.i32.store(4, 0, ptr, module.i32.const(rtId))
  ];
  data.forEach(
    (byte, index) =>
      block.push(module.i32.store(8+index*4, 0, ptr, module.i32.const(byte)))
  );
  block.push(module.i32.store(0, 0, module.i32.const(0), module.i32.add(ptr, module.i32.const(rtSize*4))));
  return { code: block, ptr: module.i32.sub(ptr, module.i32.const(rtSize*4)) };
};
const encoder = new TextEncoder();
class Compiler {
  private module: binaryen.Module = new binaryen.Module();
  private functions: string[] = [];
  private globals: Map<string, TypeNode> = new Map();
  compile(Node: Program, wat: boolean): (string | Uint8Array) {
    const { module } = this;
    // Initiate our memory
    module.setMemory(1,-1,'memory',[]);
    // Add Runtime Linking
    // Compile
    this.compileToken(Node, [], new Stack(), new Map());
    // Make our Function Table
    module.addTable('functions', this.functions.length, -1);
    module.addActiveElementSegment('functions', 'functions', this.functions, module.i32.const(0));
    module.autoDrop();
    return wat ? module.emitText() : module.emitBinary();
  }
  compileToken(Node: ParseTreeNode, functionBody: any[], stack: Stack, vars: Map<string, number>, expectResult=false): any {
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
        // TODO: add closures, make functions polymorphic
        const { dataType, variables, parameters, body } = Node;
        // Make the closure
        // reset the function
        const funcBody: any[] = [];
        const funcStack = variables;
        const funcVars = new Map();
        // Deal with parameters and closure
        for (const param of parameters) {
          funcVars.set(param.identifier, vars.size);
        }
        // Make the body
        body.map((tkn: ParseTreeNode) => this.compileToken(tkn, funcBody, funcStack, funcVars));
        const name = `${functions.length}`;
        module.addFunction(
          name,
          dataType == 'Void' ? binaryen.none : binaryen.i32,
          binaryen.createType(new Array(parameters.length).fill(binaryen.i32)),
          new Array(variables.length).fill(binaryen.i32), 
          module.block(null, [
            module.i32.store(0, 0, module.i32.const(0), module.i32.const(4)),
            ...funcBody
          ])
        );
        // Store the function
        functions.push(name);
        const { code, ptr } = DataBuilder(module, 'Function', [functions.length-1]);
        functionBody.push(...code);
        return ptr;
      }
      case 'callStatement': {
        // TODO: add closures and add in support for polymorphic function types, along with builtin functions such as return and a basic print and malloc, add support to call functions as arguments and variable values
        // Add calls for return
        const functionType = stack.get(Node.identifier);
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
          wasm = module.call_indirect(
            'functions',
            <number>vars.get(Node.identifier),
            functionArgs,
            functionType.params.map((param: any) => param.result == 'Void' ? binaryen.none : binaryen.i32),
            functionType.result == 'Void' ? binaryen.none : binaryen.i32
          );
        } else {
          console.log(vars);
          BriskError(`Unknown Function: ${Node.identifier}`, <path.ParsedPath>Node.position.file, Node.position);
        }
        if (expectResult) return wasm;
        else functionBody.push(wasm);
        break;
      }
      case 'declarationStatement': {
        const { identifier, value } = Node;
        functionBody.push(
          module.local.set(
            vars.size,
            module.i32.const(this.compileToken(value, functionBody, stack, vars, true))
          )
        );
        vars.set(identifier, vars.size);
        break;
      }
      case 'literal': {
        // TODO: add support for vars as literals
        switch(Node.dataType) {
          case 'string': {
            const { code, ptr } = DataBuilder(module, 'String', [...encoder.encode(<string>Node.value)]);
            functionBody.push(...code);
            return ptr;
          }
          case 'number': {
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
        return module.local.get(<number>vars.get(Node.identifier));
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

