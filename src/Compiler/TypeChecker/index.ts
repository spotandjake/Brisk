import { Position } from '../Types/Types';
import Node, { NodeType } from '../Types/ParseNodes';
import { BriskError, BriskParseError, BriskTypeError } from '../Errors/Compiler';
import AnalyzerNode, { AnalyzeNode, AnalyzedProgramNode } from '../Types/AnalyzerNodes';
import { BriskErrorType } from '../Errors/Errors';
// Helpers
// TypeCheck Node
const typeCheckNode = (
  // Code
  code: string,
  // Stacks
  properties: AnalyzeNode,
  // Nodes
  parentNode: Node | undefined,
  node: Node
): AnalyzerNode => {
  const {
    // Our Global Variable And Type Pools
    _imports,
    _exports,
    _variables,
    _types,
    // ParentStacks
    _varStacks,
    _typeStacks,
    // Stacks
    _closure,
    _varStack,
    _typeStack,
  } = properties;
  const _typeCheckNode = (
    childNode: Node,
    props: Partial<AnalyzeNode> = properties,
    parentNode: Node = node
  ): AnalyzerNode => {
    return typeCheckNode(code, { ...properties, ...props }, parentNode, childNode);
  };
  // Match The Node For Analysis
  switch (node.nodeType) {
    // General
    case NodeType.Program:
      // Resolve All Types In The Type Pool
      // Resolve All Types In The Var Pool
      // Analyze Program Node
      console.log(node);
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Statements
    case NodeType.IfStatement:
    case NodeType.FlagStatement:
    case NodeType.BlockStatement:
    case NodeType.ImportStatement:
    case NodeType.WasmImportStatement:
    case NodeType.ExportStatement:
    case NodeType.DeclarationStatement:
    case NodeType.AssignmentStatement:
    case NodeType.PostFixStatement:
    case NodeType.ReturnStatement:
    case NodeType.EnumDefinitionStatement:
    case NodeType.EnumVariant:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
    case NodeType.TypeCastExpression:
    case NodeType.UnaryExpression:
    case NodeType.ParenthesisExpression:
    case NodeType.CallExpression:
    case NodeType.WasmCallExpression:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Literals
    case NodeType.StringLiteral:
    case NodeType.I32Literal:
    case NodeType.I64Literal:
    case NodeType.U32Literal:
    case NodeType.U64Literal:
    case NodeType.F32Literal:
    case NodeType.F64Literal:
    case NodeType.NumberLiteral:
    case NodeType.ConstantLiteral:
    case NodeType.FunctionLiteral:
    case NodeType.ObjectLiteral:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Types
    case NodeType.InterfaceDefinition:
    case NodeType.TypeAliasDefinition:
    case NodeType.TypePrimLiteral:
    case NodeType.TypeUnionLiteral:
    case NodeType.ArrayTypeLiteral:
    case NodeType.ParenthesisTypeLiteral:
    case NodeType.FunctionSignatureLiteral:
    case NodeType.InterfaceLiteral:
    case NodeType.TypeUsage:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
    // Variables
    case NodeType.VariableUsage:
    case NodeType.MemberAccess:
    case NodeType.PropertyUsage:
    case NodeType.Parameter:
      BriskError(code, BriskErrorType.FeatureNotYetImplemented, [], node.position);
      process.exit(1);
  }
};
// Analyze Program
const typeCheckProgram = (code: string, program: AnalyzedProgramNode): AnalyzedProgramNode => {
  return <AnalyzedProgramNode>typeCheckNode(
    code,
    {
      _imports: new Map(),
      _exports: new Map(),
      _variables: new Map(),
      _types: new Map(),
      _varStacks: [],
      _typeStacks: [],
      _closure: new Set(),
      _varStack: new Map(),
      _typeStack: new Map(),
    },
    undefined,
    program
  );
};

export default typeCheckProgram;
