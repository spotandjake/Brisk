import Node, { NodeType, NodeCategory, ProgramNode, DeclarationTypes } from '../Types/ParseNodes';
import AnalyzerNode, { VariableData, VariableMap, VariableStack, VariableClosure, AnalyzedProgramNode, AnalyzedBlockStatementNode, AnalyzedFunctionLiteralNode, AnalyzedVariableDefinitionNode } from '../Types/AnalyzerNodes';
import { BriskParseError } from '../Errors/Compiler';

type AllNodes = AnalyzerNode | Node;
const analyzeNode = <T extends AllNodes>(
  _variables: VariableMap,
  stacks: VariableStack[],
  closure: VariableClosure,
  stack: VariableStack,
  parent: AllNodes | undefined,
  node: T
): T => {
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
      closureMap = new Set();
      node.body = node.body.map(child => analyzeNode(_variables, stacks, closureMap, stackMap, node, child));
      // TODO: Remove ts-ignore Here
      // @ts-ignore
      node = <AnalyzedProgramNode>{
        ...node,
        variables: _variables,
        stack: stackMap,
      };
      break;
    // Statements
    case NodeType.BlockStatement:
      stacks.push(stack);
      stackMap = new Map();
      closureMap = new Set();
      node.body = node.body.map(child => analyzeNode(_variables, stacks, closureMap, stackMap, node, child));
      // TODO: remove this ts-ignore
      //@ts-ignore
      node = <AnalyzedBlockStatementNode>{
        ...node,
        stack: stackMap,
      };
      break;
    case NodeType.IfStatement:
      node.condition = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.condition);
      node.body = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.body);
      break;
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      if (parent != undefined && parent.nodeType != NodeType.Program)
        BriskParseError('Import statements must be at the top level.', node.position);
      node.variable = analyzeNode(_variables, stacks, closureMap, stackMap, node, <AnalyzedVariableDefinitionNode>{
        ...node.variable,
        global: parent != undefined && parent.nodeType == NodeType.Program,
        constant: true,
        type: (node.nodeType == NodeType.WasmImportStatement) ? node.typeSignature : {
          nodeType: NodeType.Type,
          category: NodeCategory.Type,
          name: 'Unknown',
          position: node.position,
        }, // TODO: determine how to type regular import
      });
      break;
    case NodeType.ExportStatement:
      // TODO: Allow exporting expressions
      if (parent != undefined && parent.nodeType != NodeType.Program)
        BriskParseError('Export statements must be at the top level.', node.position);
      node.variable = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.variable);
      if (node.variable.nodeType == NodeType.VariableUsage) {
        const name = <number>node.variable.name;
        _variables.set(name, {
          ...(<VariableData>_variables.get(name)),
          exported: true,
        });
      }
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
    case NodeType.ArithmeticExpression:
      node.lhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.lhs);
      node.rhs = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.rhs);
      break;
    case NodeType.LogicExpression:
    case NodeType.ParenthesisExpression:
      node.value = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.value);
      break;
    case NodeType.CallExpression:
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.name);
      node.args = node.args.map(arg => analyzeNode(_variables, stacks, closureMap, stackMap, node, arg));
      break;
    case NodeType.WasmCallExpression:
      // TODO: I think we need to analyze the name here
      node.args = node.args.map(arg => analyzeNode(_variables, stacks, closureMap, stackMap, node, arg));
      break;
    // Literals
    // TODO: parse the literal types in here
    case NodeType.FunctionLiteral:
      stacks.push(stack);
      stackMap = new Map();
      closureMap = new Set();
      node.params = node.params.map(param => analyzeNode(_variables, stacks, closureMap, stackMap, node, param));
      node.body = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.body);
      //@ts-ignore
      node = <AnalyzedFunctionLiteralNode>{
        ...node,
        closure: closureMap,
        stack: stackMap,
      };
      break;
    // Variables
    case NodeType.VariableDefinition:
      if (stack.has(<string>node.name)) BriskParseError(`Variable ${node.name} is already defined.`, node.position);
      _variables.set(_variables.size, {
        name: <string>node.name,
        global: node.global,
        constant: node.constant,
        exported: false,
        used: false,
        type: node.type
      });
      stack.set(<string>node.name, _variables.size - 1);
      node.name = _variables.size - 1;
      break;
    case NodeType.VariableUsage:
      if (stack.has(<string>node.name)) {
        const name = <number>stack.get(<string>node.name);
        node.name = name;
        _variables.set(name, {
          ...(<VariableData>_variables.get(name)),
          used: true
        });
      } else {
        // Search The Above Stacks
        let name: number | undefined;
        for (const parentStack of stacks.reverse()) {
          if (parentStack.has(<string>node.name)) {
            const varName = <number>parentStack.get(<string>node.name);
            node.name = varName;
            closure.add(varName);
            name = varName;
            break;
          }
        }
        if (name != undefined) {
          _variables.set(name, {
            ...(<VariableData>_variables.get(name)),
            used: true
          });
        } else BriskParseError(`Variable ${node.name} is not defined.`, node.position);
      }
      break;
    case NodeType.MemberAccess:
      // TODO: we need to deal with better
      node.name = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.name);
      if (node.child) node.child = analyzeNode(_variables, stacks, closureMap, stackMap, node, node.child);
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
    case NodeType.I32Literal:
    case NodeType.I64Literal:
    case NodeType.U32Literal:
    case NodeType.U64Literal:
    case NodeType.F32Literal:
    case NodeType.F64Literal:
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
  <AnalyzedProgramNode>analyzeNode(new Map(), [], new Set(), new Map(), undefined, program);

export default analyze;