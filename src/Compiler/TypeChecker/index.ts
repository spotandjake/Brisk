import { NodeType, ProgramNode } from '../Types/ParseNodes';
import Node, { VariableMap, VariableStack, VariableClosure } from '../Types/AnalyzerNodes';

const analyzeNode = <T extends Node>(
  _variables: VariableMap,
  stacks: VariableStack[],
  closure: VariableClosure,
  stack: VariableStack,
  parent: Node | undefined,
  node: T
): T => {
  // Properties
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program:
      break;
    // Statements
    case NodeType.BlockStatement:
      break;
    case NodeType.IfStatement:
      break;
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      break;
    case NodeType.ExportStatement:
      break;
    case NodeType.DeclarationStatement:
      break;
    case NodeType.AssignmentStatement:
      break;
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      break;
    case NodeType.LogicExpression:
    case NodeType.ParenthesisExpression:
      break;
    case NodeType.CallExpression:
      break;
    case NodeType.WasmCallExpression:
      break;
    // Literals
    case NodeType.FunctionLiteral:
      break;
    // Variables
    case NodeType.VariableDefinition:
      break;
    case NodeType.VariableUsage:
      break;
    case NodeType.MemberAccess:
      break;
    case NodeType.Parameter:
      break;
    // Ignore
    case NodeType.FlagStatement:
    case NodeType.StringLiteral:
    case NodeType.NumberLiteral:
    case NodeType.ConstantLiteral:
      break;
    // Other
    // Uncomment this when adding new nodes
    // default:
    //   BriskParseError('Analyzer: Unknown Node Type', node.position);
    //   break;
  }
  return node;
};
const analyze = (program: ProgramNode) =>
  analyzeNode(new Map(), [], new Set(), new Map(), undefined, program);

export default analyze;