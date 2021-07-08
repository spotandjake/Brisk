// Import Errors
import { BriskError} from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Imports libs
import * as fs from 'fs';

const Verifier = (Program: any): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    switch (Node.type) {
      case 'importStatement': {
        // Make sure all imports are in the main scope
        if (Parent.type != 'Program')
          BriskError('imports are not allowed outside the main scope', Node.position.file, Node.position);
        // Verify import paths
        const exists: boolean = fs.existsSync(Node.path);
        if (!exists)
          BriskError(`cannot find module ${Node.path}`, Node.position.file, Node.position);
        break;
      }
    }
    return Node;
  });
};

export default Verifier;