// Import Errors
import { BriskSyntaxError, BriskReferenceError, BriskError } from '../../Errors/Compiler';
// Helper Imports
import { WalkTree, Stack } from '../Helpers';
// Type Imports
import { ParseTreeNode, Program, DeclarationStatementNode, FunctionTypeNode, ParseTreeNodeType, Import } from '../Types';

const Analyzer = (program: Program) => {
  // Old Analyzers
  const program_globals: Map<string, { type: string; params: string[], result: string; }> = new Map([
    ['return', { type: 'Function', params: ['any'], result: 'Void' }],
    ['memStore', { type: 'Function', params: ['i32', 'i32', 'i32'], result: 'Void' }],
    ['memLoad', { type: 'Function', params: ['i32', 'i32'], result: 'i32' }],
    ['i32Add', { type: 'Function', params: ['i32', 'i32'], result: 'Number' }]
  ]);
  const exports: string[] = [], imports: { path: string; identifiers: Import; }[] = [];
  program = WalkTree(program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case ParseTreeNodeType.importStatement:
        if (!stack.hasLocal(Node.identifier)) stack.setLocal(Node.identifier, 'import');
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, Node.position);
        // Resolve Module Paths
        imports.push({ path: Node.path, identifiers: [Node.identifier] });
        break;
      case ParseTreeNodeType.importWasmStatement:
        //@ts-ignore
        program_globals.set(Node.identifier, <FunctionTypeNode>Node.dataType);
        break;
      case ParseTreeNodeType.exportStatement:
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        // Add export to list of exports
        if (exports.includes(Node.identifier))
          BriskError(`Export by name ${Node.identifier} already exported, you may only export a value once`, Node.position);
        exports.push(Node.identifier);
        break;
      case ParseTreeNodeType.declarationStatement: {
        let dataType;
        if (Node.value.type == ParseTreeNodeType.functionNode) {
          const returnType = Node.value.dataType;
          const paramType = Node.value.parameters.map(param => param.dataType);
          dataType = { type: Node.dataType, params: paramType, result: returnType };
        } else if (['i32', 'i64', 'f32', 'f64'].includes(<string>Node.dataType)) {
          // Hack: Add wasm stack Types
          if (Node.value.type == ParseTreeNodeType.literal && Node.value.dataType == 'Number') Node.value.dataType = Node.dataType;
        } else dataType = Node.dataType;
        if (!stack.hasLocal(Node.identifier)) stack.setLocal(Node.identifier, dataType);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, Node.position);
        break;
      }
      case ParseTreeNodeType.callStatement:
        if (!stack.has(Node.identifier)) {
          // Hax to allow recursive functions
          if (Parent.type == ParseTreeNodeType.functionNode) {
            const { type, identifier, dataType } = <DeclarationStatementNode>trace[trace.length - 2];
            if (type == ParseTreeNodeType.declarationStatement && identifier == Node.identifier) {
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
              params: [(<DeclarationStatementNode>Parent).dataType],
              result: 'Void'
            };
          }
          Node.arguments = Node.arguments.map((argument, index) => {
            if (argument.type == ParseTreeNodeType.literal && argument.dataType == 'Number' && ['i32', 'i64', 'f32', 'f64'].includes(<string>func.params[index]))
              argument.dataType = func.params[index];
            return argument;
          });
        }
        break;
      case ParseTreeNodeType.variable:
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, Node.position);
        break;
      case ParseTreeNodeType.Program:
      case ParseTreeNodeType.functionNode:
      case ParseTreeNodeType.blockStatement:
        Node.variables = stack;
        break;
      case ParseTreeNodeType.functionParameter:
        stack.setLocal(Node.identifier, Node.dataType);
        break;
      case ParseTreeNodeType.commentStatement:
        return null;
    }
    return Node;
  });
  program.exports = exports;
  program.imports = imports;
  return program;
};

export default Analyzer;