// Import Errors
import { BriskError} from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Imports libs
import * as fs from 'fs';
import * as path from 'path';

const Verifier = (filename: path.ParsedPath, Program: any): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: any, Node: any, index: number, stack: Stack, trace: any[]): any => {
    switch (Node.type) {
      case 'importStatement': {
        // Verify import paths
        const exists: boolean = fs.existsSync(Node.path);
        if (!exists)
          BriskError(`cannot find module ${Node.path}`, filename, Node.position);
        break;
      }
    }
    return Node;
  });
};

export default Verifier;