// Import Errors
import { BriskError} from '../../../Errors/Compiler';
// Helper Imports
import { WalkTree } from '../../Helpers';
// Type import's
import { ParseTreeNode, Program, ParseTreeNodeType } from '../../Types';

const Verifier = (Program: Program): void => {
  Program = WalkTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number): ParseTreeNode => {
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