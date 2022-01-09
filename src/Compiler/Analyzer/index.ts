import { NodeType, ProgramNode, NodeTemplate, Type, DeclarationTypes } from '../Types/ParseNodes';
import Node, { AnalyzedVariableDefinitionNode } from '../Types/AnalyzerNodes';
import { BriskParseError } from '../Errors/Compiler';
// eslint-disable-next-line @typescript-eslint/ban-types
const hasOwnProperty = <X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> => {
  return obj.hasOwnProperty(prop);
};
// TODO: Fix the typing
const analyzeNode = <T extends NodeTemplate>(
  _variables: Map<number, { name: string, global: boolean, constant: boolean, type: Type | undefined }>,
  stacks: Map<string, number>[],
  closure: Set<number>,
  stack: Map<string, number>,
  parent: Node | undefined,
  node: T
): T => {
  // TODO: add the stack and closure and _variables to the nodes
  // Properties
  let stackMap = stack;
  let closureMap = closure;
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program:
      stacks.push(stack);
      stackMap = new Map();
      // TODO: add maps to node
      closureMap = new Set();
      break;
    // Statements
    case NodeType.BlockStatement:
      stacks.push(stack);
      stackMap = new Map();
      // TODO: add maps to node
      closureMap = new Set();
      break;
    case NodeType.IfStatement:
      node.condition = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.condition);
      break;
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      node.variable = analyzeNode(_variables, stacks, closureMap, stackMap, node, <AnalyzedVariableDefinitionNode>{
        ...node.variable,
        global: parent != undefined && parent.nodeType == NodeType.Program,
        constant: true,
        type: (node.nodeType == NodeType.WasmImportStatement) ? node.typeSignature : undefined, // TODO: determine how to type regular import
      });
      break;
    case NodeType.ExportStatement:
      if (parent != undefined && parent.nodeType != NodeType.Program)
        BriskParseError('Export statements must be at the top level.', node.position);
      node.variable = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.variable);
      break;
    case NodeType.DeclarationStatement:
      // TODO: recursive values are gonna be a problem, i.e let test = test.test.test;
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, <AnalyzedVariableDefinitionNode>{
        ...node.name,
        global: parent != undefined && parent.nodeType == NodeType.Program,
        constant: node.declarationType == DeclarationTypes.Constant,
        type: node.varType,
      });
      node.value = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.value);
      break;
    case NodeType.AssignmentStatement:
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.name);
      node.value = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.value);
      break;
    // Expressions
    case NodeType.ComparisonExpression:
      // TODO: consider adding optimizations here for simple literals
      node.lhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.lhs);
      node.rhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.rhs);
      break;
    case NodeType.ArithmeticExpression:
      // TODO: consider adding optimizations here for simple literals
      node.lhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.lhs);
      node.rhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.rhs);
      break;
    case NodeType.LogicExpression:
      // TODO: consider adding optimizations here for simple literals
      node.value = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.value);
      break;
    case NodeType.ParenthesisExpression:
      node.value = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.value);
      break;
    case NodeType.WasmCallExpression:
    case NodeType.CallExpression:
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.name);
      node.args = node.args.map(arg => analyzeNode(_variables, stacks, closureMap, stackMap, node, arg));
      break;
    // Literals
    // TODO: parse the literal types in here
    case NodeType.FunctionLiteral:
      stacks.push(stack);
      stackMap = new Map();
      // TODO: add maps to node
      closureMap = new Set();
      node.params = node.params.map(param => analyzeNode(_variables, stacks, closureMap, stackMap, node, param));
      break;
    // Variables
    case NodeType.VariableDefinition:
      _variables.set(_variables.size, {
        name: node.name,
        global: node.global,
        constant: node.constant,
        type: node.type
      });
      stack.set(node.name, _variables.size - 1);
      node.name = _variables.size - 1;
      break;
    case NodeType.VariableUsage:
      if (stack.has(node.name)) node.name = stack.get(node.name);
      else {
        // Search The Above Stacks
        let found = false;
        for (const parentStack of stacks.reverse()) {
          if (parentStack.has(node.name)) {
            node.name = <number>parentStack.get(node.name);
            closure.add(node.name);
            found = true;
            break;
          }
        }
        if (!found) BriskParseError(`Variable ${node.name} is not defined.`, node.position);
      }
      break;
    case NodeType.MemberAccess:
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.name);
      if (hasOwnProperty(node, 'child')) node.child = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.child);
      break;
    case NodeType.Parameter:
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, <AnalyzedVariableDefinitionNode>{
        ...node.name,
        global: false,
        constant: true,
        type: node.paramType,
      });
      break;
    // Ignore
    case NodeType.FlagStatement:
    case NodeType.StringLiteral:
    case NodeType.NumberLiteral:
    case NodeType.ConstantLiteral:
      break;
    // Other
    default:
      BriskParseError('Analyzer: Unknown Node Type', node.position);
      break;
  }
  // Logic for traversing the Parse Tree
  if (hasOwnProperty(node, 'body')) {
    if (Array.isArray(node.body)) node.body = node.body.map(child => analyzeNode(_variables, stacks, closureMap, stackMap, node, child));
    else node.body = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.body);
  }
  if (parent == undefined) console.log(_variables);
  return node;
};
const analyze = (program: ProgramNode) => {
  return analyzeNode(new Map(), [], new Set(), new Map(), undefined, program);
};

export default analyze;