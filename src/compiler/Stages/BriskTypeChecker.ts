// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Type Imports
import {
  ParseTreeNode,
  Program,
  LiteralNode
} from '../Grammar/Types';

const TypeChecker = (Program: Program) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      // Ignore these
      case 'Program':
      case 'literal':
      case 'variable':
      case 'callStatement':
      case 'importWasmStatement':
      case 'functionNode':
      case 'commentStatement':
        break;
      // Type Check These
      case 'declarationStatement': {
        const wanted = Node.dataType;
        let got = '';
        switch(Node.value.type) {
          case 'literal':
            got = <string>(Node.value as LiteralNode).dataType;
            break;
          case 'functionNode':
            got = 'Function';
            break;
          case 'callStatement':
            console.log('/////////');
            console.log(stack);
            console.log(Node.value);
            break;
          case 'variable':
            console.log('///');
            console.log(stack);
            console.log(Node.value);
            break;
          default:
            console.log(Node.value);
            break;
        }
        if (got != wanted) console.log('unexpected Type');
        break;
      }
      // Log These
      default:
        console.log(Node);
        break;
    }
    return Node;
  });
  return Program;
};

export default TypeChecker;