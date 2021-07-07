// Import Errors
import { BriskSyntaxError, BriskReferenceError } from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
import * as path from 'path';
// Type Imports
import { ParseTreeNode, ProgramNode, FlagStatementNode } from '../Grammar/Types';

const Analyzer = (filename: path.ParsedPath, Program: ProgramNode) => {
  Program = RecurseTree(Program, (Parent: any, Node: ParseTreeNode, index: number, stack: Stack, trace: any[]): (null | ParseTreeNode) => {
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
          body: Node.body
        };
        break;
      }
      case 'importStatement':
        if (!stack.hasLocal(Node.identifier))
          stack.setLocal(Node.identifier, true);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, filename, Node.position);
        // Resolve Module Paths
        Node.path = path.join(filename.dir, Node.path);
        break;
      case 'exportStatement':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
        break;
      case 'declarationStatement':
        if (!stack.hasLocal(Node.identifier))
          stack.setLocal(Node.identifier, true);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, filename, Node.position);
        break;
      case 'callStatement':
        if (!stack.has(Node.identifier)) {
          // Hax to allow recursive functions
          if (Parent.type == 'functionDeclaration') {
            const { type, identifier } = trace[trace.length-2];
            if (type == 'declarationStatement' && identifier == Node.identifier)
              stack.setClosure(Node.identifier, true);
          } else BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
        }
        break;
      case 'variable':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
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
      case 'functionParameter':
        stack.setLocal(Node.identifier, true);
        break;
    }
    return Node;
  });
  return Program;
};

export default Analyzer;