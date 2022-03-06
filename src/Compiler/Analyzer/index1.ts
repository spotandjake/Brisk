import Node, {
  NodeType,
  NodeCategory,
  ProgramNode,
  DeclarationTypes,
  PrimTypes,
  primTypes,
  TypePrimLiteralNode,
  I32LiteralNode,
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
  parentNode: AllNodes | undefined,
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
          prevNode.category != NodeCategory.Type &&
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
          parentNode,
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
        parentNode,
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
        parentNode,
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
          parentNode,
          node.alternative
        );
      break;
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
      node.variable = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
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
                parentNode,
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
      // TODO: Allow exporting expressions & Types
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.value
      );
      // TODO: We Dont Want This Type Specific Code In Here
      if (node.value.nodeType == NodeType.VariableUsage) {
        const name = <number>node.value.name;
        _variables.set(name, {
          ...(<VariableData>_variables.get(name)),
          exported: true,
        });
      } else {
        BriskParseError('Implement Code For Other Exports', node.position);
      }
      break;
    case NodeType.DeclarationStatement:
      node.varType = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
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
        parentNode,
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
        parentNode,
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
        parentNode,
        node.name
      );
      // TODO: Check If Variable Was Mutable
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.value
      );
      break;
    }
    case NodeType.ReturnStatement: {
      if (!parentNode || parentNode.nodeType != NodeType.FunctionLiteral) {
        BriskParseError('Return Can Only Be Called In A Function', node.position);
      }
      node.returnValue = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.returnValue
      );
      break;
    }
    case NodeType.EnumDefinitionStatement:
      if (
        !node.variants.every((v) => v.value == undefined) &&
        node.variants.some((v) => v.value == undefined)
      ) {
        BriskParseError('All Enum Variants Must Be Given A Value', node.position);
      } else {
        // If the user does not specify values for any nodes we want to assign them
        node.variants = node.variants.map((variant, i) => {
          variant.value = <I32LiteralNode>{
            nodeType: NodeType.I32Literal,
            category: NodeCategory.Literal,
            value: `${i}n`, // Consider using A Number over an i32 here
            position: variant.position,
          };
          return variant;
        });
      }
      // TODO: Add The Node To The Variable List
      break;
    case NodeType.PostFixStatement:
      // TODO: Check That Variable Is Mutable
      node.value = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.value
      );
      break;
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
        parentNode,
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
        parentNode,
        node.rhs
      );
      break;
    case NodeType.UnaryExpression:
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
        parentNode,
        node.value
      );
      break;
    case NodeType.CallExpression:
      node.callee = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.callee
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
          parentNode,
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
          parentNode,
          arg
        )
      );
      break;
    // Literals
    // TODO: parse the literal types in here
    case NodeType.I32Literal:
    case NodeType.I64Literal:
    case NodeType.U32Literal:
    case NodeType.U64Literal:
    case NodeType.F32Literal:
    case NodeType.F64Literal:
    case NodeType.NumberLiteral:
      // console.log(node);
      break;
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
    case NodeType.ObjectLiteral: {
      const fields: string[] = [];
      node.fields = node.fields.map((field) => {
        if (field.nodeType == NodeType.ObjectField && fields.includes(field.name))
          BriskParseError(`Duplicate Field \`${field.name}\``, field.position);
        field.fieldValue = analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          parentNode,
          field.fieldValue
        );
        if (field.nodeType == NodeType.ObjectField) fields.push(field.name);
        return field;
      });
      break;
    }
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
          parentNode,
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
      // TODO: We Need To Perform Some Analysis Here
      node.parent = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.parent
      );
      node.property = analyzeNode(
        _types,
        typeStacks,
        typeStackMap,
        _variables,
        stacks,
        closureMap,
        stackMap,
        node,
        parentNode,
        node.property
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
        parentNode,
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
        parentNode,
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
          parentNode,
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
          parentNode,
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
        parentNode,
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
          parentNode,
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
        parentNode,
        node.returnType
      );
      break;
    case NodeType.InterfaceLiteral: {
      const fields: string[] = [];
      node.fields = node.fields.map((field) => {
        if (fields.includes(field.name))
          BriskParseError(`Duplicate Field \`${field.name}\``, field.position);
        field.fieldType = analyzeNode(
          _types,
          typeStacks,
          typeStackMap,
          _variables,
          stacks,
          closureMap,
          stackMap,
          node,
          parentNode,
          field.fieldType
        );
        fields.push(field.name);
        return field;
      });
      break;
    }
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
    case NodeType.ConstantLiteral:
    case NodeType.TypePrimLiteral:
    case NodeType.PropertyUsage:
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
    analyzeNode(
      new Map(),
      [],
      new Map(),
      new Map(),
      [],
      new Set(),
      new Map(),
      undefined,
      undefined,
      program
    )
  );

export default analyze;
