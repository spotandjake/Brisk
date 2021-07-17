// Import Node Types
import { ParseTreeNode, FunctionParameterNode, ExpressionNode } from '../Grammar/Types';
// Recurse the ParseTree
export const RecurseTree = (
  Node: ParseTreeNode,
  callback: (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]) => (ParseTreeNode | null),
  depth = 0
): any => {
  const RecurseNodes = (
    Parent: ParseTreeNode,
    Node: ParseTreeNode,
    index: number,
    stack: Stack,
    trace: ParseTreeNode[],
    depth: number,
    callback: (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]) => (ParseTreeNode | null)
  ): any => {
    trace = [...trace, Parent];
    if (depth == 0 || trace.length < depth) {
      // Determine Node Type
      switch (Node.type) {
        case 'Program':
        case 'functionDeclaration':
        case 'blockStatement':
        case 'functionNode': {
          stack = new Stack(stack);
          if (Node.type == 'functionDeclaration') {
            Node.parameters = Node.parameters.map(
              (Param: FunctionParameterNode, i: number) => RecurseNodes(Node, Param, i, stack, trace, depth, callback)
            ).filter((n: (FunctionParameterNode | null)) => n);
          }
          Node.body = Node.body.map(
            (Statement: ParseTreeNode, i: number) => RecurseNodes(Node, Statement, i, stack, trace, depth, callback)
          ).filter((n: (ParseTreeNode | null)) => n);
          break;
        }
        case 'callStatement':
          Node.arguments = Node.arguments.map(
            (Expression: ExpressionNode, i: number) => RecurseNodes(Node, Expression, i, stack, trace, depth, callback)
          ).filter((n: (ExpressionNode | null)) => n);
          break;
        case 'declarationStatement':
          Node.value = RecurseNodes(Node, Node.value, 0, stack, trace, depth, callback);
          break;
      }
    }
    return callback(Parent, Node, index, stack, trace);
  };
  return RecurseNodes(<ParseTreeNode>{}, Node, 0, new Stack(), [], depth, callback);
};
// A Stack Data Type
export class Stack {
  public local: any = {};
  public closure: any = {};
  public ParentStack: Stack | undefined;
  constructor(ParentStack?: Stack) {
    this.ParentStack = ParentStack;
  }
  readHas(name: string) {
    if (this.hasLocal(name)) return true;
    else if (this.hasClosure(name)) return true;
    else if (this.ParentStack && this.ParentStack.has(name)) return true;
    else return false;
  }
  has(name: string): boolean {
    if (this.hasLocal(name)) return true;
    else if (this.hasClosure(name)) return true;
    else if (this.ParentStack && this.ParentStack.has(name)) {
      this.setClosure(name, this.ParentStack.get(name));
      return true;
    } else return false;
  }
  hasLocal(name: string): boolean {
    return this.local.hasOwnProperty(name);
  }
  hasClosure(name: string): boolean {
    return this.closure.hasOwnProperty(name);
  }
  hasParent(name: string): boolean {
    return this.ParentStack ? this.ParentStack.hasLocal(name) : false;
  }
  setLocal(name: string, value: any): void {
    this.local[name] = value;
  }
  setClosure(name: string, value: any): void {
    this.closure[name] = value;
  }
  readGet(name: string): any {
    if (this.hasLocal(name)) return this.local[name];
    else if (this.hasClosure(name)) return this.closure[name];
    else {
      if (this.ParentStack && this.ParentStack.has(name)) {
        return this.ParentStack.get(name);
      }
    }
  }
  get(name: string): any {
    if (this.hasLocal(name)) return this.local[name];
    else if (this.hasClosure(name)) return this.closure[name];
    else {
      if (this.ParentStack && this.ParentStack.has(name)) {
        this.setClosure(name, this.ParentStack.get(name));
        return this.ParentStack.get(name);
      }
    }
  }
  getLocal(name: string): any {
    return this.local[name];
  }
  getClosure(name: string): any {
    return this.closure[name];
  }
  get length() {
    return Object.keys(this.local).length + Object.keys(this.closure).length;
  }
}