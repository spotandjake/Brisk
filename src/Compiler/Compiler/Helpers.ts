// Import Node Types
import { ParseTreeNode, FunctionParameterNode, ExpressionNode, ParseTreeNodeType, Statement, Program } from './Types';
// Recurse the ParseTree
export const WalkTree = (
  Node: ParseTreeNode,
  callback: (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]) => (null|ParseTreeNode)
): Program => {
  const WalkNode = (Parent: ParseTreeNode, Node: ParseTreeNode, index: number, stack: Stack, trace: ParseTreeNode[]) => {
    trace = [...trace, Parent];
    // Determine Node Type
    switch (Node.type) {
      case ParseTreeNodeType.Program:
      case ParseTreeNodeType.blockStatement:
      case ParseTreeNodeType.functionNode: {
        stack = new Stack(stack);
        if (Node.type == ParseTreeNodeType.functionNode)
          Node.parameters = <FunctionParameterNode[]>Node.parameters.map((Param, i) => WalkNode(Node, Param, i, stack, trace)).filter(n => n);
        Node.body = <Statement[]>Node.body.map((Statement, i) => WalkNode(Node, Statement, i, stack, trace)).filter(n => n);
        break;
      }
      case ParseTreeNodeType.callStatement:
        Node.arguments = <ExpressionNode[]>Node.arguments.map((Expression, i) => WalkNode(Node, Expression, i, stack, trace)).filter(n => n);
        break;
      case ParseTreeNodeType.declarationStatement:
        Node.value = <ExpressionNode>WalkNode(Node, Node.value, 0, stack, trace);
        break;
    }
    return callback(Parent, Node, index, stack, trace);
  };
  return <Program>WalkNode(Node, Node, 0, new Stack(), []);
};
// A Stack Data Type
export class Stack {
  private local: Map<string, any> = new Map();
  public closure: Map<string, any> = new Map();
  private ParentStack: Stack | undefined;
  constructor(ParentStack?: Stack) {
    this.ParentStack = ParentStack;
  }
  readHas(name: string) {
    return this.hasLocal(name) || this.hasClosure(name) || (this.ParentStack && this.ParentStack.has(name));
  }
  has(name: string): boolean {
    if (this.hasLocal(name) || this.hasClosure(name)) return true;
    else if (this.ParentStack && this.ParentStack.has(name)) {
      this.setClosure(name, this.ParentStack.get(name));
      return true;
    } else return false;
  }
  hasLocal(name: string): boolean {
    return this.local.has(name);
  }
  hasClosure(name: string): boolean {
    return this.closure.has(name);
  }
  setLocal(name: string, value: any): void {
    this.local.set(name, value);
  }
  setClosure(name: string, value: any): void {
    this.closure.set(name, value);
  }
  readGet(name: string): any {
    if (this.hasLocal(name)) return this.local.get(name);
    else if (this.hasClosure(name)) return this.closure.get(name);
    else if (this.ParentStack && this.ParentStack.has(name)) return this.ParentStack.get(name);
  }
  get(name: string): any {
    if (this.hasLocal(name)) return this.local.get(name);
    else if (this.hasClosure(name)) return this.closure.get(name);
    else if (this.ParentStack && this.ParentStack.has(name)) {
      this.setClosure(name, this.ParentStack.get(name));
      return this.ParentStack.get(name);
    }
  }
}
export interface varStack {
  closure: Map<string, any>;
  local: Map<string, any>;
}