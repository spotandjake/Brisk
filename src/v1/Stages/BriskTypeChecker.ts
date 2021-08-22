// Helper Imports
import { RecurseTree, Stack } from '../../Compiler/Compiler/Helpers';
import { BriskTypeError } from '../../Compiler/Errors/Compiler';
// Type Imports
import {
  ParseTreeNode,
  Program,
  LiteralNode,
  ParseTreeNodeType
} from '../../Compiler/Compiler/Types';

const TypeChecker = (Program: Program) => {
  // TODO: type check with imports, TypeCheck Function Calls, rewrite type checker to be faster, use an enum for the types
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Program = RecurseTree(Program, (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]): (null | ParseTreeNode) => {
    switch (Node.type) {
      // Type Check These
      case ParseTreeNodeType.declarationStatement: {
        const wanted = Node.dataType;
        let got = '';
        switch(Node.value.type) {
          case ParseTreeNodeType.literal:
            got = <string>(<LiteralNode>Node.value).dataType;
            break;
          case ParseTreeNodeType.functionNode:
            got = 'Function';
            break;
          case ParseTreeNodeType.callStatement: {
            //@ts-ignore
            const value = Parent.variables.readGet(Node.value.identifier);
            if (value && value.type && value.type == 'Function') {
              if (value.result != wanted) BriskTypeError(`expected ${wanted} got ${value.result}`, Node.position);
              Node.value.arguments.forEach((arg, index: number) => {
                if (
                  //@ts-ignore
                  arg.dataType != value.params[index] &&
                  //@ts-ignore
                  (arg.type == ParseTreeNodeType.callStatement && value.params[index] != Parent.variables.readGet(Node.value.identifier).result)
                  //@ts-ignore
                ) BriskTypeError(`expected ${value.params[index]} got ${arg.dataType||Parent.variables.readGet(Node.value.identifier).result}`, Node.position);
              });
              if (Node.value.arguments.length != value.params.length)
                BriskTypeError(`Function ${Node.value.identifier} expected ${value.params.length} params but got ${Node.value.arguments.length}`, Node.position);
              got = value.result;
            } else BriskTypeError(`${Node.value.identifier} is not a Function`, Node.position);
            break;
          }
          case ParseTreeNodeType.variable:
            //@ts-ignore
            got = Parent.variables.readGet(Node.value.identifier);
            break;
          default:
            console.log(Node.value);
            break;
        }
        if (wanted == 'Void' || got == 'Void') BriskTypeError('Void may not be used as a type for a variable of value', Node.position);
        else if (got != wanted) BriskTypeError(`expecting type ${wanted} got ${got}.`, Node.position);
        if (wanted == 'Void' || got == 'Void' || got != wanted) process.exit(1);
        break;
      }
      // Log These
      default:
        if (
          ParseTreeNodeType.Program             ||
          ParseTreeNodeType.literal             ||
          ParseTreeNodeType.variable            ||
          ParseTreeNodeType.callStatement       ||
          ParseTreeNodeType.importWasmStatement ||
          ParseTreeNodeType.importStatement     ||
          ParseTreeNodeType.functionNode        ||
          ParseTreeNodeType.commentStatement    ||
          ParseTreeNodeType.exportStatement
        ) break; // Ignore these
        console.log('Unknown Node TypeChecker');
        break;
    }
    return Node;
  });
  return Program;
};

export default TypeChecker;