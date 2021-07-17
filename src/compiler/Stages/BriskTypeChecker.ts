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
          case 'callStatement': {
            const value = (Parent as Program).variables.readGet(Node.value.identifier);
            if (value.type && value.type == 'Function') {
              if (value.result != wanted) BriskTypeError(`expected ${wanted} got ${value.result}`, Node.position);
              Node.value.arguments.forEach((arg, index: number) => {
                //@ts-ignore
                if (arg.dataType != value.params[index]) BriskTypeError(`expected ${value.params[index]} got ${arg.dataType}`, Node.position);
              });
              if (Node.value.arguments.length != value.params.length)
                BriskTypeError(`Function ${Node.value.identifier} expected ${value.params.length} params but got ${Node.value.arguments.length}`, Node.position);
              got = value.result;
            } else BriskTypeError(`${Node.value.identifier} is not a Function`, Node.position);
            break;
          }
          case 'variable':
            //@ts-ignore
            got = Parent.variables.readGet(Node.value.identifier);
            break;
          default:
            console.log(Node.value);
            break;
        }
        if (wanted == 'Void' || got == 'Void') BriskTypeError('you may not use Void as a type for a var or value', Node.position);
        if (got != wanted) BriskTypeError(`expecting type ${wanted} got ${got}.`, Node.position);
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