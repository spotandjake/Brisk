// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';

const Optimizer = (Program: any) => {
  // Remove Comments
  // Remove Flags
  // Constant Propagation
  // Determine Functions that are not passed out of local scope
  // Dead code elimination
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    switch (Node.type) {
      case 'commentStatement':
        Node = null;
        break;
    }
    return Node;
  });
  return Program;
};

export default Optimizer;