// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Type import's
import {
  ParseTreeNode,
  Program
} from '../Grammar/Types';

const Optimizer = (Program: Program) => {
  // Remove Comments
  // Remove Flags
  // Constant Propagation
  // Determine Functions that are not passed out of local scope
  // Dead code elimination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case 'commentStatement':
        return null;
      case 'flagStatement':
        return null;
    }
    return Node;
  });
  return Program;
};

export default Optimizer;