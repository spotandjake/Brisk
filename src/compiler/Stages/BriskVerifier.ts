// Import Errors
import { BriskError} from '../../Brisk/Errors/Compiler';
// Helper Imports
import { RecurseTree, Stack } from '../../Brisk/Compiler/Helpers';
// Type import's
import { ParseTreeNode, Program, ParseTreeNodeType } from '../../Brisk/Compiler/Types';

const Verifier = (Program: Program): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      case ParseTreeNodeType.importStatement: {
        // Make sure all imports are in the main scope
        if (Parent.type != ParseTreeNodeType.Program)
          BriskError('imports are not allowed outside the main scope', Node.position);
        // Make sure imports come before any code
        if (index != 0) {
          for (let i = 0; i < index; i++) {
            if (
              (<Program>Parent).body[i].type != ParseTreeNodeType.importStatement && 
              (<Program>Parent).body[i].type != ParseTreeNodeType.importWasmStatement && 
              (<Program>Parent).body[i].type != ParseTreeNodeType.commentStatement &&
              (<Program>Parent).body[i].type != ParseTreeNodeType.flagStatement
            ) BriskError('imports must be at top of file', Node.position);
          }
        }
        break;
      }
      case ParseTreeNodeType.exportStatement: {
        // Make sure all imports are in the main scope
        if (Parent.type != ParseTreeNodeType.Program)
          BriskError('exports are not allowed outside the main scope', Node.position);
      }
    }
    return Node;
  });
};

export default Verifier;