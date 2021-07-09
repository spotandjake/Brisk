// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';

const TypeChecker = (Program: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    console.log(Node);
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