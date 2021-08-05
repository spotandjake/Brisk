// Import Errors
import { BriskSyntaxError, BriskReferenceError, BriskError } from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
import path from 'path';
// Type Imports
import {
  ParseTreeNode,
  Program,
  ProgramNode,
  FlagStatementNode, 
  DeclarationStatementNode,
  LiteralNode,
  FunctionTypeNode
} from '../Grammar/Types';

const Analyzer = (filePath: path.ParsedPath, program: ProgramNode): Program => {
  const program_globals: Map<string, { type: string; params: string[], result: string; }> = new Map([
    [ 'return', { type: 'Function', params: [ 'any' ], result: 'Void' } ],
    [ 'memStore', { type: 'Function', params: [ 'i32', 'i32', 'i32' ], result: 'Void' } ],
    [ 'memLoad', { type: 'Function', params: [ 'i32', 'i32' ], result: 'i32' } ],
    [ 'i32Add', { type: 'Function', params: [ 'i32', 'i32' ], result: 'i32' } ]
  ]);
  program = RecurseTree(program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    // Append data to node
    if ('position' in Node) Node.position.file = filePath;
    switch (Node.type) {
      case 'Program': {
        // Determine flags
        const programFlags: FlagStatementNode[] = [];
        for (const node of Node.body) {
          if (node.type != 'flagStatement') break;
          programFlags.push(node);
        }
        // Generate More Detailed Node
        Node = {
          type: 'Program',
          flags: programFlags,
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
        // Add import to list of imports
        if (!(trace[1] as Program).imports) (trace[1] as Program).imports = [];
        // Resolve Module Paths
        (trace[1] as Program).imports.push({
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
        if (!(trace[1] as Program).exports) (trace[1] as Program).exports = [];
        if ((trace[1] as Program).exports.includes(Node.identifier))
          BriskError(`Export by name ${Node.identifier} already exported, you may only export a value once`, Node.position);
        (trace[1] as Program).exports.push(Node.identifier);
        break;
      case 'declarationStatement': {
        let dataType;
        if (Node.value.type == 'functionNode') {
          const returnType = Node.value.dataType;
          const paramType = Node.value.parameters.map(param => param.dataType);
          dataType = { type: Node.dataType, params: paramType, result: returnType };
        } else if ([ 'i32', 'i64', 'f32', 'f64' ].includes(<string>Node.dataType)) {
          // Hack: Add wasm stack Types
          //@ts-ignore
          if (Node.value.dataType == 'Number') {
            //@ts-ignore
            Node.value.dataType = Node.dataType;
          }
        } else dataType = Node.dataType;
        if (!stack.hasLocal(Node.identifier))
          stack.setLocal(Node.identifier, dataType);
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
              params: [ (Parent as DeclarationStatementNode).dataType ],
              result: 'Void'
            };
          }
          Node.arguments = Node.arguments.map((argument, index) => { 
            if (argument.type == 'literal' && argument.dataType == 'Number' && [ 'i32', 'i64', 'f32', 'f64' ].includes(<string>func.params[index]))
              (argument as LiteralNode).dataType = func.params[index];
            return argument;
          });
        }
        break;
      case 'variable':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        break;
      case 'functionDeclaration': {
        const FunctionFlags: FlagStatementNode[] = [];
        for (const node of Node.body) {
          if (node.type != 'flagStatement') break;
          FunctionFlags.push(node);
        }
        // Generate more detailed Node
        Node = {
          type: 'functionNode',
          dataType: Node.dataType,
          flags: FunctionFlags,
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
    // Append data to node
    if ('position' in Node) Node.position.file = filePath;
    return Node;
  });
  return <Program>program;
};

export default Analyzer;