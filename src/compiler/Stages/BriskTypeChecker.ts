// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Type Imports
import {
  ParseTreeNode,
  Program
} from '../Grammar/Types';

const TypeChecker = (Program: Program) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    // console.log(Node);
    // switch (Node.type) {
    //   case 'commentStatement':
    //     Node = null;
    //     break;
    // }
    return Node;
  });
  return Program;
};

export default TypeChecker;