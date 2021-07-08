// Import Errors
import { BriskSyntaxError, BriskReferenceError } from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
import * as path from 'path';
// Type Imports
import { ParseTreeNode, Program, ProgramNode, FlagStatementNode } from '../Grammar/Types';

const Analyzer = (filePath: path.ParsedPath, program: ProgramNode): Program => {
  program = RecurseTree(program, (Parent: any, Node: ParseTreeNode, index: number, stack: Stack, trace: any[]): (null | ParseTreeNode) => {
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
          stack.setLocal(Node.identifier, true);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, filePath, Node.position);
        // Resolve Module Paths
        Node.path = path.join(filePath.dir, Node.path);
        // Add import to list of imports
        if (!trace[1].imports) trace[1].imports = [];
        trace[1].imports.push(Node.path);
        break;
      case 'exportStatement':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, filePath, Node.position);
        // Add export to list of exports
        if (!trace[1].exports) trace[1].exports = [];
        trace[1].exports.push(Node.identifier);
        break;
      case 'declarationStatement':
        if (!stack.hasLocal(Node.identifier))
          stack.setLocal(Node.identifier, true);
        else BriskSyntaxError(`redeclaration of ${Node.identifier}`, filePath, Node.position);
        break;
      case 'callStatement':
        if (!stack.has(Node.identifier)) {
          // Hax to allow recursive functions
          if (Parent.type == 'functionDeclaration') {
            const { type, identifier } = trace[trace.length-2];
            if (type == 'declarationStatement' && identifier == Node.identifier)
              stack.setClosure(Node.identifier, true);
          } else BriskReferenceError(`${Node.identifier} is not defined`, filePath, Node.position);
        }
        break;
      case 'variable':
        if (!stack.has(Node.identifier))
          BriskReferenceError(`${Node.identifier} is not defined`, filePath, Node.position);
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
    // Append data to node
    if ('position' in Node) Node.position.file = filePath;
    return Node;
  });
  return <Program>program;
};

export default Analyzer;