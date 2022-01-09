import { NodeType, NodeCategory, Type } from '../Types/ParseNodes';
import Node, { AnalyzedExpression, VariableData, VariableMap, VariableStack, AnalyzedProgramNode } from '../Types/AnalyzerNodes';
import { BriskTypeError } from '../Errors/Compiler';

const typeNodeString = (typeNode: Type) =>
  typeNode.nodeType == NodeType.Type ? typeNode.name : `(${typeNode.params.map(param => param.name).join(', ')}) -> ${typeNode.returnType.name}`;

const typeCheckNode = (_variables: VariableMap, stack: VariableStack, node: Node): Type => {
  // Properties
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program:
      node.body.map(child => typeCheckNode(node.variables, node.stack, <Node>child));
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    // Statements
    case NodeType.BlockStatement:
      node.body.map(child => typeCheckNode(_variables, node.stack, <Node>child));
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    case NodeType.IfStatement: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.condition);
      if (typeNode.nodeType != NodeType.Type || typeNode.name != 'Boolean')
        BriskTypeError(`Expected Type \`Boolean\`, got \`${typeNodeString(typeNode)}\``, node.condition.position);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    }
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
    case NodeType.ExportStatement:
      // TODO: this is gonna need to be used to get types from other files / cross file type checking
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    case NodeType.DeclarationStatement: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      if (node.varType.name != typeNode.name)
        BriskTypeError(`Expected Type \`${typeNodeString(node.varType)}\`, got \`${typeNodeString(typeNode)}\``, node.value.position);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    }
    case NodeType.AssignmentStatement: {
      // TODO: we need to verify this works
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      const expectedType = typeCheckNode(_variables, stack, node.name);
      if (expectedType.name != typeNode.name)
        BriskTypeError(`Expected Type \`${typeNodeString(expectedType)}\`, got \`${typeNodeString(typeNode)}\``, node.value.position);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    }
    // Expressions
    case NodeType.ComparisonExpression:
      typeCheckNode(_variables, stack, <AnalyzedExpression>node.lhs);
      typeCheckNode(_variables, stack, <AnalyzedExpression>node.rhs);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Boolean',
        position: node.position,
      };
    case NodeType.ArithmeticExpression:
      typeCheckNode(_variables, stack, <AnalyzedExpression>node.lhs);
      typeCheckNode(_variables, stack, <AnalyzedExpression>node.rhs);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Number',
        position: node.position,
      };
    case NodeType.LogicExpression: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      if ('Boolean' != typeNode.name)
        BriskTypeError(`Expected Type \`Boolean\`, got \`${typeNodeString(typeNode)}\``, node.value.position);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Boolean',
        position: node.position,
      };
    }
    case NodeType.ParenthesisExpression:
      return typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
    case NodeType.CallExpression:
      // TODO: Type Check This
      break;
    case NodeType.WasmCallExpression:
      // TODO: Type Check This
      break;
    // Literals
    case NodeType.FunctionLiteral:
      typeCheckNode(_variables, stack, <Node>node.body);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Function',
        position: node.position,
      };
    case NodeType.StringLiteral:
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'String',
        position: node.position,
      };
    case NodeType.NumberLiteral:
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Number',
        position: node.position,
      };
    case NodeType.ConstantLiteral:
      if (node.value == 'true' || node.value == 'false') {
        return {
          nodeType: NodeType.Type,
          category: NodeCategory.Type,
          name: 'Boolean',
          position: node.position,
        };
      }
      // Then it is void
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    // Variables
    case NodeType.VariableUsage:
      return (<VariableData><unknown>_variables.get(<number>node.name)).type;
    case NodeType.MemberAccess:
      // TODO: we need to find a way to return a type from this
      BriskTypeError('Add Support for member access types', node.position);
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    case NodeType.Parameter:
      break;
    // Ignore
    case NodeType.FlagStatement:
      return {
        nodeType: NodeType.Type,
        category: NodeCategory.Type,
        name: 'Void',
        position: node.position,
      };
    // Other
    // Uncomment this when adding new nodes
    // default:
    //   BriskParseError('Analyzer: Unknown Node Type', node.position);
    //   break;
  }
};
const typeCheck = (program: AnalyzedProgramNode) => {
  typeCheckNode(program.variables, program.stack, program);
};
export default typeCheck;