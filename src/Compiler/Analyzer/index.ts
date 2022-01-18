import Node, {
  NodeType,
  NodeCategory,
  ProgramNode,
  DeclarationTypes,
  PrimTypes,
  primTypes,
  TypePrimLiteralNode,
} from '../Types/ParseNodes';
import AnalyzerNode, {
  TypeMap,
  TypeStack,
  VariableData,
  VariableMap,
  VariableStack,
  VariableClosure,
  AnalyzedProgramNode,
  AnalyzedBlockStatementNode,
  AnalyzedFunctionLiteralNode,
  AnalyzedVariableDefinitionNode,
} from '../Types/AnalyzerNodes';
import { BriskParseError } from '../Errors/Compiler';
// TODO: we can rewrite this to be a lot cleaner and allow recursive types
type AllNodes = AnalyzerNode | Node;
const analyzeNode = <T extends AllNodes>(
  _types: TypeMap,
  typeStacks: TypeStack[],
  typeStack: TypeStack,
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
  let typeStackMap = typeStack;
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program: {
      typeStacks.push(typeStack);
      typeStackMap = new Map();
      stacks.push(stack);
      stackMap = new Map();
      closureMap = new Set();
      node.body = node.body.map((child) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          child
        )
      );
      // We want to make sure exports at the bottom and imports at the top
      let prevNode,
        hitExportNode = false;
      for (const statementNode of node.body) {
        if (
          (statementNode.nodeType == NodeType.ImportStatement ||
            statementNode.nodeType == NodeType.WasmImportStatement) &&
          prevNode != undefined &&
          prevNode.nodeType != NodeType.ImportStatement &&
          prevNode.nodeType != NodeType.WasmImportStatement
        )
          BriskParseError('Import Statement must be at top of file', statementNode.position);
        if (statementNode.nodeType == NodeType.ExportStatement) hitExportNode = true;
        if (statementNode.nodeType != NodeType.ExportStatement && hitExportNode)
          BriskParseError('Export Statement Must Be At The End Of File', statementNode.position);
        prevNode = statementNode;
      }
      // TODO: Remove ts-ignore Here
      // @ts-ignore
      node = <AnalyzedProgramNode>{
        ...node,
        types: _types,
        typeStack: typeStackMap,
        variables: _variables,
        stack: stackMap,
      };
      break;
    }
    // Statements
    case NodeType.BlockStatement:
      typeStacks.push(typeStack);
      typeStackMap = new Map();
      stacks.push(stack);
      stackMap = new Map();
      closureMap = new Set();
      node.body = node.body.map((child) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          child
        )
      );
      // TODO: remove this ts-ignore
      //@ts-ignore
      node = <AnalyzedBlockStatementNode>{
        ...node,
        typeStack: typeStackMap,
        stack: stackMap,
      };
      break;
    case NodeType.IfStatement:
      node.condition = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.condition
      );
      node.body = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.body
      );
      if (node.alternative)
        node.alternative = analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          node.alternative
        );
      break;
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      if (parent != undefined && parent.nodeType != NodeType.Program)
        BriskParseError('Import statements must be at the top level.', node.position);
      node.variable = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        <AnalyzedVariableDefinitionNode>{
          ...node.variable,
          global: parent != undefined && parent.nodeType == NodeType.Program,
          constant: true,
          type:
            node.nodeType == NodeType.WasmImportStatement
              ? node.typeSignature
              : analyzeNode(
                _types,
                typeStacks,
                typeStackMap,
                _variables,
                stacks,
                closureMap,
                stackMap,
                node,
                {
                  nodeType: NodeType.TypePrimLiteral,
                  category: NodeCategory.Type,
                  name: 'Any', // TODO: determine how to type regular import
                  position: node.position,
                }
              ),
        }
      );
      break;
    case NodeType.ExportStatement:
      // TODO: Allow exporting expressions
      if (parent != undefined && parent.nodeType != NodeType.Program)
        BriskParseError('Export statements must be at the top level.', node.position);
      node.variable = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.variable
      );
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
      node.varType = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.varType
      );
      node.name = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        <AnalyzedVariableDefinitionNode>{
          ...node.name,
          global: parent != undefined && parent.nodeType == NodeType.Program,
          constant: node.declarationType == DeclarationTypes.Constant,
          type: node.varType,
        }
      );
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.value
      );
      break;
    case NodeType.AssignmentStatement: {
      node.name = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.name
      );
      const varData = <VariableData>_variables.get(<number>node.name.name);
      if (varData.constant) {
        BriskParseError(`Cannot modify immutable variable \`${varData.name}\``, node.position);
      }
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.value
      );
      break;
    }
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      node.lhs = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.lhs
      );
      node.rhs = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.rhs
      );
      break;
    case NodeType.LogicExpression:
    case NodeType.ParenthesisExpression:
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.value
      );
      break;
    case NodeType.CallExpression:
      node.name = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.name
      );
      node.args = node.args.map((arg) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          arg
        )
      );
      break;
    case NodeType.WasmCallExpression:
      node.args = node.args.map((arg) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          arg
        )
      );
      break;
    // Literals
    // TODO: parse the literal types in here
    case NodeType.FunctionLiteral:
      typeStacks.push(typeStack);
      typeStackMap = new Map();
      stacks.push(stack);
      stackMap = new Map();
      closureMap = new Set();
      node.params = node.params.map((param) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          param
        )
      );
      node.body = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.body
      );
      node.returnType = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.returnType
      );
      //@ts-ignore
      node = <AnalyzedFunctionLiteralNode>{
        ...node,
        typeStack: typeStackMap,
        closure: closureMap,
        stack: stackMap,
      };
      break;
    // Variables
    case NodeType.VariableDefinition:
      if (stack.has(<string>node.name))
        BriskParseError(`Variable ${node.name} is already defined.`, node.position);
      _variables.set(_variables.size, {
        name: <string>node.name,
        global: node.global,
        constant: node.constant,
        exported: false,
        used: false,
        type: analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          node.type
        ),
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
          used: true,
        });
      } else {
        // Search The Above Stacks
        let name: number | undefined;
        for (const parentStack of stacks.reverse()) {
          if (parentStack.has(<string>node.name)) {
            name = <number>parentStack.get(<string>node.name);
            node.name = name;
            closure.add(name);
            break;
          }
        }
        if (name != undefined) {
          _variables.set(name, {
            ...(<VariableData>_variables.get(name)),
            used: true,
          });
        } else BriskParseError(`Variable ${node.name} is not defined.`, node.position);
      }
      break;
    case NodeType.MemberAccess:
      // TODO: we need to deal with these properly
      node.name = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.name
      );
      if (node.child)
        node.child = analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          node.child
        );
      break;
    case NodeType.Parameter:
      node.paramType = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.paramType
      );
      node.name = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        <AnalyzedVariableDefinitionNode>{
          ...node.name,
          global: false,
          constant: true,
          type: node.paramType,
        }
      );
      break;
    // Types
    case NodeType.TypeAliasDefinition:
    case NodeType.InterfaceDefinition:
      if (typeStack.has(<string>node.name))
        BriskParseError(`Type ${node.name} is already defined.`, node.position);
      _types.set(_types.size, {
        name: <string>node.name,
        exported: false,
        type: analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          node.typeLiteral
        ),
      });
      typeStack.set(<string>node.name, _types.size - 1);
      node.name = _variables.size - 1;
      break;
    case NodeType.TypeUnionLiteral:
      node.types = node.types.map((t) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          t
        )
      );
      break;
    case NodeType.ParenthesisTypeLiteral:
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.value
      );
      break;
    case NodeType.FunctionSignatureLiteral:
      node.params = node.params.map((param) =>
        analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          param
        )
      );
      node.returnType = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        node.returnType
      );
      break;
    case NodeType.InterfaceLiteral:
      node.fields = node.fields.map((field) => {
        field.fieldType = analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          field.fieldType
        );
        return field;
      });
      break;
    case NodeType.TypeUsage:
      if (typeStack.has(<string>node.name)) {
        node.name = <number>typeStack.get(<string>node.name);
      } else if (primTypes.includes(<PrimTypes>node.name)) {
        // TODO: remove this ts-ignore
        //@ts-ignore
        node = <TypePrimLiteralNode>{
          nodeType: NodeType.TypePrimLiteral,
          category: NodeCategory.Type,
          name: node.name,
          position: node.position,
        };
      } else if (!_types.has(<number>node.name)) {
        // Search The Above Stacks
        let name: number | undefined;
        for (const parentStack of stacks.reverse()) {
          if (parentStack.has(<string>node.name)) {
            name = <number>parentStack.get(<string>node.name);
            node.name = name;
            break;
          }
        }
        if (name == undefined) BriskParseError(`Type ${node.name} is not defined.`, node.position);
      }
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
    case NodeType.TypePrimLiteral:
    case NodeType.TypeCastExpression:
      break;
    // Other
    // Uncomment this when adding new nodes
    default:
      BriskParseError('Analyzer: Unknown Node Type', (<any>node).position);
      break;
  }
  return node;
};
const analyze = (program: ProgramNode) =>
  <AnalyzedProgramNode>(
    analyzeNode(new Map(), [], new Map(), new Map(), [], new Set(), new Map(), undefined, program)
  );

export default analyze;
