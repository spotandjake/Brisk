// Import Errors
import { BriskError} from '../Helpers/Errors';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
// Imports libs
import * as fs from 'fs';
// Type import's
import {
  ParseTreeNode,
  Program
} from '../Grammar/Types';

const Verifier = (Program: Program): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case 'importStatement': {
        // Make sure all imports are in the main scope
        if (Parent.type != 'Program')
          BriskError('imports are not allowed outside the main scope', Node.position);
        // Make sure imports come before any code
        if (index != 0) {
          for (let i = 0; i < index; i++) {
            if (
              (Parent as Program).body[i].type != 'importStatement' && 
              (Parent as Program).body[i].type != 'importWasmStatement' && 
              (Parent as Program).body[i].type != 'commentStatement' &&
              (Parent as Program).body[i].type != 'flagStatement'
            ) BriskError('imports must be at top of file', Node.position);
          }
        }
        // Verify import paths
        const exists: boolean = fs.existsSync(Node.path);
        if (!exists)
          BriskError(`cannot find module ${Node.path}`, Node.position);
        break;
      }
      case 'exportStatement': {
        // Make sure all imports are in the main scope
        if (Parent.type != 'Program')
          BriskError('exports are not allowed outside the main scope', Node.position);
      }
    }
    return Node;
  });
};

export default Verifier;