import * as path from 'path';
// Helper Imports
import { RecurseTree, Stack } from '../Helpers/Helpers';
import { BriskTypeError } from '../Helpers/Errors';
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
            // console.log('/////////');
            // console.log(Node.value);
            //@ts-ignore
            // console.log(Parent.variables.readGet(Node.value.identifier));
            // TODO: add checks to make sure this type is proper
            if (Parent.variables.readGet(Node.value.identifier) == 'Function') got = wanted;
            break;
          case 'variable':
            //@ts-ignore
            got = Parent.variables.readGet(Node.value.identifier);
            break;
          default:
            console.log(Node.value);
            break;
        }
        if (wanted == 'Void' || got == 'Void') BriskTypeError('you may not use Void as a type for a var or value', (Node.position.file as path.ParsedPath), Node.position);
        if (got != wanted) BriskTypeError(`expecting type ${wanted} got ${got}.`, (Node.position.file as path.ParsedPath), Node.position);
        if (wanted == 'Void' || got == 'Void' || got != wanted) process.exit(1);
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