// Import Errors
import { BriskSyntaxError, BriskReferenceError, BriskError } from '../../Brisk/Errors/Compiler';
// Helper Imports
import { RecurseTree, Stack } from '../../Brisk/Compiler/Helpers';
import path from 'path';
// Type Imports
import {
  ParseTreeNode,
  Program,
  ProgramNode, 
  DeclarationStatementNode,
  LiteralNode,
  FunctionTypeNode
} from '../../Brisk/Compiler/Types';

const Analyzer = (filePath: path.ParsedPath, program: ProgramNode): Program => {
  const program_globals: Map<string, { type: string; params: string[], result: string; }> = new Map([
    [ 'return', { type: 'Function', params: [ 'any' ], result: 'Void' } ],
    [ 'memStore', { type: 'Function', params: [ 'i32', 'i32', 'i32' ], result: 'Void' } ],
    [ 'memLoad', { type: 'Function', params: [ 'i32', 'i32' ], result: 'i32' } ],
    [ 'i32Add', { type: 'Function', params: [ 'i32', 'i32' ], result: 'i32' } ]
  ]);
  program = RecurseTree(program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case 'Program': {
        // Generate More Detailed Node
        Node = {
          type: 'Program',
          flags: Node.flags,
          variables: stack,
          body: Node.body,
          exports: Node.exports || [],
          imports: Node.imports || [],
          position: Node.position
        };
        break;
      }
      case 'importStatement':
        if (!stack.hasLocal(Node.identifier))
          stack.setLocal(Node.identifier, 'import');
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, Node.position);
        // Set File Extension
        if (path.parse(Node.path).ext == '') Node.path = `${Node.path}.br`;
        // Add import to list of imports
        if (!(<Program>trace[1]).imports) (<Program>trace[1]).imports = [];
        // Resolve Module Paths
        (<Program>trace[1]).imports.push({
          path: Node.path,
          identifiers: [ Node.identifier ]
        });
        Node.path = path.join(filePath.dir, Node.path);
        break;
      case 'importWasmStatement':
        //@ts-ignore
        program_globals.set(Node.identifier, <FunctionTypeNode>Node.dataType);
        break;
      case 'exportStatement':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        // Add export to list of exports
        if (!(<Program>trace[1]).exports) (<Program>trace[1]).exports = [];
        if ((<Program>trace[1]).exports.includes(Node.identifier))
          BriskError(`Export by name ${Node.identifier} already exported, you may only export a value once`, Node.position);
        (<Program>trace[1]).exports.push(Node.identifier);
        break;
      case 'declarationStatement': {
        let dataType;
        if (Node.value.type == 'functionNode') {
          const returnType = Node.value.dataType;
          const paramType = Node.value.parameters.map(param => param.dataType);
          dataType = { type: Node.dataType, params: paramType, result: returnType };
        } else if ([ 'i32', 'i64', 'f32', 'f64' ].includes(<string>Node.dataType)) {
          // Hack: Add wasm stack Types
          // @ts-ignore
          if (Node.value.dataType == 'Number') Node.value.dataType = Node.dataType;
        } else dataType = Node.dataType;
        if (!stack.hasLocal(Node.identifier)) stack.setLocal(Node.identifier, dataType);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, Node.position);
        break;
      }
      case 'callStatement':
        if (!stack.has(Node.identifier)) {
          // Hax to allow recursive functions
          if (Parent.type == 'functionDeclaration') {
            const { type, identifier, dataType } = <DeclarationStatementNode>trace[trace.length-2];
            if (type == 'declarationStatement' && identifier == Node.identifier) {
              stack.setClosure(Node.identifier, dataType);
              break;
            }
          }
          if (!program_globals.has(Node.identifier))
            BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        }
        // hax for wasm stack value
        if (stack.readHas(Node.identifier) || program_globals.has(Node.identifier)) {
          let func = stack.readGet(Node.identifier) || program_globals.get(Node.identifier);
          if (Node.identifier == 'return') {
            func = {
              type: 'Function',
              params: [ (<DeclarationStatementNode>Parent).dataType ],
              result: 'Void'
            };
          }
          Node.arguments = Node.arguments.map((argument, index) => { 
            if (argument.type == 'literal' && argument.dataType == 'Number' && [ 'i32', 'i64', 'f32', 'f64' ].includes(<string>func.params[index]))
              (<LiteralNode>argument).dataType = func.params[index];
            return argument;
          });
        }
        break;
      case 'variable':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        break;
      case 'functionDeclaration': {
        // Generate more detailed Node
        Node = {
          type: 'functionNode',
          dataType: Node.dataType,
          flags: Node.flags,
          variables: stack,
          parameters: Node.parameters,
          body: Node.body,
          position: Node.position
        };
        break;
      }
      case 'blockStatement': {
        // Generate more detailed Node
        Node = {
          type: 'blockStatement',
          variables: stack,
          body: Node.body,
          position: Node.position
        };
        break;
      }
      case 'functionParameter':
        stack.setLocal(Node.identifier, Node.dataType);
        break;
    }
    return Node;
  });
  return <Program>program;
};

export default Analyzer;