import { Position } from '../Types/Types';
import Node, {
  NodeType,
  ProgramNode,
  Statement,
  Expression,
  NodeCategory,
  DeclarationStatementNode,
  DeclarationTypes,
  TypeLiteral,
  VariableUsage,
  TypeUnionLiteralNode,
  TypePrimLiteralNode,
  ParenthesisTypeLiteralNode,
  ObjectLiteralNode,
  ObjectFieldNode,
  ObjectSpreadNode,
  primTypes,
  TypeUsageNode,
  PropertyUsageNode
} from '../Types/ParseNodes';
import { BriskParseError, BriskTypeError } from '../Errors/Compiler';
import AnalyzerNode, {
  ImportMap,
  ExportMap,
  AnalyzeNode,
  AnalyzedProgramNode,
  AnalyzedBlockStatementNode,
  TypeMap,
  TypeStack,
  TypeData,
  VariableClosure,
  VariableData,
  VariableMap,
  VariableStack,
  AnalyzedFunctionLiteralNode,
} from '../Types/AnalyzerNodes';
// Variable Interactions
const createVariable = (
  varPool: VariableMap,
  varStack: VariableStack,
  varData: VariableData,
  position: Position
) => {
  // Check If Variable Already Exists On Stack
  if (varStack.has(varData.name))
    BriskParseError(`Variable ${varData.name} Has Already been Declared`, position);
  // Create Reference To Map
  const variableReference = varPool.size;
  // Add Variable To Pool
  varPool.set(variableReference, varData);
  // Add Variable To Stack
  varStack.set(varData.name, variableReference);
};
const getVariable = (
  varPool: VariableMap,
  varStack: VariableStack,
  _closure: VariableClosure,
  varStacks: VariableStack[],
  varReference: VariableUsage | string,
  position: Position,
  { used=true, exported=false }: { used?: boolean, exported?: boolean }
): VariableData => {
  // Get Variable Reference
  let varName: string;
  if (typeof varReference == 'string') varName = varReference; 
  else if (varReference.nodeType == NodeType.VariableUsage) varName = varReference.name;
  else {
    // TODO: Implement Checking On Member Access
    BriskParseError(`Member Access Not Yet Implemented`, position);
    process.exit(1);
  }
  // Search The Stacks
  const _varStack = [...varStacks, varStack].reverse().find((s) => s.has(varName));
  // Check If It Exists
  if (_varStack == undefined)
    BriskParseError(`Variable ${varName} Not Found`, position);
  // Get Node
  const variableReference = <number>(<VariableStack>_varStack).get(varName);
  // Check If We need To Add To Closure
  if (!varStack.has(varName))
    _closure.add(variableReference);
  if (!varPool.has(variableReference))
    BriskParseError('Compiler Bug Please Report', position);
  const value = <VariableData>varPool.get(variableReference);
  // Set Variable To used
  varPool.set(variableReference, {
    ...value,
    used: value.used || used,
    exported: value.exported || exported,
  });
  // Return Value
  return value;
};
const createType = (
  typePool: TypeMap,
  typeStack: TypeStack,
  typeData: TypeData,
  position: Position
) => {
  // Do Not Allow You To Write Over Primitive Types
  if ((<Set<string>>primTypes).has(typeData.name))
    BriskParseError(`You May Not Declare A Type With The Same Name As A Primitive Type`, position);
  // Check If Variable Already Exists On Stack
  if (typeStack.has(typeData.name))
    BriskParseError(`Type ${typeData.name} Has Already been Declared`, position);
  // Create Reference To Map
  const variableReference = typePool.size;
  // Add Variable To Pool
  typePool.set(variableReference, typeData);
  // Add Variable To Stack
  typeStack.set(typeData.name, variableReference);
};
const getType = (
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeReference: TypeUsageNode | string,
  position: Position,
  { exported=false }: { exported?: boolean }
): VariableData => {
  // Get Variable Reference
  let varName: string;
  if (typeof typeReference == 'string') varName = typeReference; 
  else if (typeReference.nodeType == NodeType.TypeUsage) varName = typeReference.name;
  else {
    // TODO: Implement Checking On Member Access
    BriskParseError(`Member Access Not Yet Implemented`, position);
    process.exit(1);
  }
  // Search The Stacks
  const _varStack = [...typeStacks, typeStack].reverse().find((s) => s.has(varName));
  // Check If It Exists
  if (_varStack == undefined)
    BriskParseError(`Type ${varName} Not Found`, position);
  // Get Node
  const variableReference = <number>(<VariableStack>_varStack).get(varName);
  if (!typePool.has(variableReference))
    BriskParseError('Compiler Bug Please Report', position);
  const value = <VariableData>typePool.get(variableReference);
  // Set Variable To used
  typePool.set(variableReference, {
    ...value,
    exported: value.exported || exported,
  });
  // Return Value
  return value;
};
// Analyze Node
const analyzeNode = (
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
  const _analyzeNode = (
    childNode: Node,
    props: Partial<AnalyzeNode> = properties,
    parentNode: Node = node
  ): AnalyzerNode => {
    return analyzeNode({ ...properties, ...props }, parentNode, childNode);
  };
  // Match The Node For Analysis
  switch (node.nodeType) {
    // General
    case NodeType.Program: {
      // Create Our New Stacks
      const imports: ImportMap = new Map();
      const exports: ExportMap = new Map();
      const variables: VariableMap = new Map();
      const types: TypeMap = new Map();
      const varStack: VariableStack = new Map();
      const typeStack: TypeStack = new Map();
      // Ensure That Import Statements Exist At The Top Of File
      // Ensure That Export Statements Exist At Bottom Of File
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
      // Return Our Node
      return <AnalyzedProgramNode>{
        ...node,
        body: node.body.map((child: Statement) =>
          _analyzeNode(child, {
            _imports: imports,
            _exports: exports,
            // Our Global Variable And Type Pools
            _variables: variables,
            _types: types,
            // Parent Stacks
            _varStacks: [],
            _typeStacks: [],
            // Stacks
            _closure: new Set(),
            _varStack: varStack,
            _typeStack: typeStack,
          })
        ),
        data: {
          _imports: imports,
          _exports: exports,
          _variables: variables,
          _types: types,
          _varStack: varStack,
          _typeStack: typeStack,
        },
      };
    }
    // Statements
    case NodeType.IfStatement:
      // Don't Allow Definition Statements Here
      if (node.alternative?.nodeType == NodeType.DeclarationStatement)
        BriskParseError('Declaration May Not Appear In A Single-Statement If', node.position);
      node.condition = <Expression>_analyzeNode(node.condition);
      // Analyze Body And Alternative
      node.body = <Statement>_analyzeNode(node.body);
      if (node.alternative) node.alternative = <Statement>_analyzeNode(node.body);
      return node;
    case NodeType.FlagStatement:
      if (node.args.length != 0) {
        if (node.value == 'operator') {
          if (node.args.length != 2)
            BriskTypeError(`Operator Flag Can Only Take 2 Arguments Found ${node.args.length}`, node.args.position);
          if (node.args.args[0].nodeType != NodeType.StringLiteral)
            BriskTypeError(`Operator Flag Expected A String At Argument Zero`, node.args.position);
          if (node.args.args[1].nodeType != NodeType.NumberLiteral)
            BriskTypeError(`Operator Flag Expected A Number At Argument Zero`, node.args.position);
          return node;
        }
        BriskTypeError(`Flag Did Not Expect Arguments`, node.args.position);
      }
      // TODO: Ensure this is valid
      return node;
    case NodeType.BlockStatement: {
      // Create Our New Stacks
      const varStack: VariableStack = new Map();
      const typeStack: TypeStack = new Map();
      // Push Our Old Stack To The List
      // Return Our Node
      return <AnalyzedBlockStatementNode>{
        ...node,
        body: node.body.map((child: Statement) =>
          _analyzeNode(child, {
            // Stacks
            _closure: _closure,
            _varStack: varStack,
            _typeStack: typeStack,
            // Stack Pool
            _varStacks: [..._varStacks, _varStack],
            _typeStacks: [..._typeStacks, _typeStack],
          })
        ),
        data: {
          _varStack: varStack,
          _typeStack: typeStack,
        },
      };
    }
    case NodeType.ImportStatement:
      // TODO: Compile The Other Files And Get Type Data, For Rest Of Analysis
      // TODO: Add Import Item To List
      console.log('TODO: Analyze Import Statement');
      process.exit(1);
      break;
    case NodeType.WasmImportStatement:
      // Analyze Type
      node.typeSignature = <TypeLiteral>_analyzeNode(node.typeSignature);
      // Add Variable
      createVariable(_variables, _varStack, {
        name: node.variable.name,
        global: true,
        constant: true,
        parameter: false,
        exported: false,
        import: false,
        wasmImport: true,
        used: false,
        type: node.typeSignature,
      }, node.position);
      // Return Node
      return node;
    case NodeType.ExportStatement: {
      // Analysis
      if (node.value.nodeType == NodeType.ObjectLiteral) {
        // Analyze Value
        node.value = <ObjectLiteralNode>_analyzeNode(node.value);
        // TODO: Handle Object Exports
        BriskParseError('Object Export Not Yet Implemented', node.position);
        return node;
      }
      // Deal With Other Types Of Exports
      if (node.value.nodeType == NodeType.DeclarationStatement)
        node.value = <DeclarationStatementNode>_analyzeNode(node.value);
      const variableName = node.value.nodeType == NodeType.DeclarationStatement ? node.value.name.name : node.value;
      // Set Variable Information
      const variableData = getVariable(
        _variables,
        _varStack,
        _closure,
        _varStacks,
        variableName,
        node.value.position,
        { used: true, exported: true }
      );
      // Change Export State
      _exports.set(variableData.name, {
        name: variableData.name,
        value: node.value,
        type: variableData.type,
      });
      // Return Value
      return node;
    }
    case NodeType.DeclarationStatement:
      // TODO: Handle Destructuring
      // Add Variable To Stack
      createVariable(_variables, _varStack, {
        name: node.name.name,
        global: parentNode?.nodeType == NodeType.Program,
        constant: node.declarationType == DeclarationTypes.Constant,
        parameter: false,
        exported: false,
        import: false,
        wasmImport: false,
        used: false,
        type: node.varType,
      }, node.position);
      // Analyze The Value
      node.value = <Expression>_analyzeNode(node.value);
      return node;
    case NodeType.AssignmentStatement:
      // Analyze Value
      node.value = <Expression>_analyzeNode(node.value);
    case NodeType.PostFixStatement:
      // Analyze Variable
      node.name = <VariableUsage>_analyzeNode(node.name);
      // Verify That Var Exists And Is mutable
      const variableData = getVariable(_variables, _varStack, _closure, _varStacks, node.name, node.position, {  used: false });
      if (variableData.constant)
        BriskTypeError(`Assignment To Constant Variable`, node.position);
      return node;
    case NodeType.ReturnStatement:
      node.returnValue = <Expression>_analyzeNode(node.returnValue);
      return node;
    case NodeType.EnumDefinitionStatement:
      // TODO: Add To Variable List As An Object Maybe
      // TODO: Analyze Variants
      console.log(node);
      console.log('TODO: Analyze Statements');
      process.exit(1);
      break;
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      node.lhs = <Expression>_analyzeNode(node.lhs);
      node.rhs = <Expression>_analyzeNode(node.rhs);
      return node;
    case NodeType.TypeCastExpression:
      node.typeLiteral = <TypeLiteral>_analyzeNode(node.typeLiteral);
    case NodeType.UnaryExpression:
    case NodeType.ParenthesisExpression:
      node.value = <Expression>_analyzeNode(node.value);
      return node;
    case NodeType.CallExpression:
      // Analyze Callee
      node.callee = <Expression>_analyzeNode(node.callee);
      // Analyze Arguments
      node.args = node.args.map((arg: Expression) => <Expression>_analyzeNode(arg));
      return node;
    case NodeType.WasmCallExpression:
      node.args = node.args.map((arg) => <Expression>_analyzeNode(arg));
      return node;
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
      return node;
    case NodeType.FunctionLiteral: {
      // Create New Closure
      const closure: VariableClosure = new Set();
      const varStack: VariableStack = new Map();
      const typeStack: TypeStack = new Map();
      // Make Sure Optional Parameters Are Last
      let foundOptional = false;
      for (const param of node.params) {
        if (param.optional) foundOptional = true;
        else if (foundOptional)
          BriskParseError(`Optional Parameters Must Appear Last In A Function Definition`, param.position);
      }
      // Analyze Params
      return <AnalyzedFunctionLiteralNode>{
        ...node,
        returnType: <TypeLiteral>_analyzeNode(node.returnType),
        params: node.params.map(param => _analyzeNode(param, {
          // Parent Stacks
          _varStacks:[ ..._varStacks, _varStack ],
          _typeStacks: [ ..._typeStacks, _typeStack ],
          // Stacks
          _closure: closure,
          _varStack: varStack,
          _typeStack: typeStack,
        })),
        body: _analyzeNode(node.body, {
          // Parent Stacks
          _varStacks:[ ..._varStacks, _varStack ],
          _typeStacks: [ ..._typeStacks, _typeStack ],
          // Stacks
          _closure: closure,
          _varStack: varStack,
          _typeStack: typeStack,
        }),
        data: {
          _closure: closure,
          _varStack: varStack,
          _typeStack: typeStack,
        },
      };
    }
    case NodeType.ObjectLiteral:
      // Analyze Fields
      const fields: (ObjectFieldNode | ObjectSpreadNode)[] = [];
      for (const field of node.fields) {
        // field
        field.fieldValue = <Expression>_analyzeNode(field.fieldValue);
        // Check if field exists
        if (
          field.nodeType == NodeType.ObjectField &&
          fields.some(f => f.nodeType == NodeType.ObjectField && f.name == field.name)
        ) BriskTypeError(`Duplicate Field Name ${field.name}`, field.position);
        fields.push(field);
      }
      node.fields = fields;
      return node;
    // Types
    // TODO: Allow Recursive Types
    case NodeType.InterfaceDefinition:
      // Analyze Interface
      node.typeLiteral = <TypeLiteral>_analyzeNode(node.typeLiteral);
    case NodeType.TypeAliasDefinition:
      createType(
        _types,
        _typeStack,
        {
          name: node.name,
          exported: false,
          type: node.typeLiteral
        },
        node.position
      );
      return node;
    case NodeType.TypePrimLiteral:
      return node;
    case NodeType.TypeUnionLiteral:
      // Analyze Types
      node.types = node.types.map(type => <TypeLiteral>_analyzeNode(type));
      return node;
    case NodeType.ParenthesisTypeLiteral:
      node.value = <TypeLiteral>_analyzeNode(node.value);
      return node;
    case NodeType.FunctionSignatureLiteral:
      // Analyze Parameter Types
      node.params = node.params.map(param => <TypeLiteral>_analyzeNode(param));
      // Analyze Return Types
      node.returnType = <TypeLiteral>_analyzeNode(node.returnType);
      return node;
    case NodeType.InterfaceLiteral: {
      // Analyze Fields
      const fields: Set<string> = new Set();
      node.fields = node.fields.map(field => {
        if (fields.has(field.name))
          BriskTypeError(`Field ${field.name} has already been declared`, field.position);
        field.fieldType = <TypeLiteral>_analyzeNode(field.fieldType);
        fields.add(field.name);
        return field;
      });
      return node;
    }
    case NodeType.TypeUsage:
      // Check If Type Is A Primitive Type
      if ((<Set<string>>primTypes).has(node.name)) {
        return <TypePrimLiteralNode>{
          nodeType: NodeType.TypePrimLiteral,
          category: NodeCategory.Type,
          name: node.name,
          position: node.position
        };
      }
      getType(_types, _typeStack, _typeStacks, node.name, node.position, {});
      return node;
    // Variables
    case NodeType.VariableUsage:
      getVariable(_variables, _varStack, _closure, _varStacks, node, node.position, {});
      return node;
    case NodeType.MemberAccess:
      // Analyze Parent
      node.parent = <Expression>_analyzeNode(node.parent);
      // Analyze Child
      node.property = <PropertyUsageNode>_analyzeNode(node.property);
    case NodeType.PropertyUsage:
      // Return node
      return node;
    case NodeType.Parameter:
      // Change Type To Include Void
      node.paramType = <TypeLiteral>_analyzeNode(node.optional ? <TypeUnionLiteralNode>{
        nodeType: NodeType.TypeUnionLiteral,
        category: NodeCategory.Type,
        types: [
          <TypePrimLiteralNode>{
            nodeType: NodeType.TypePrimLiteral,
            category: NodeCategory.Type,
            name: 'Void',
            position: node.paramType.position
          },
          <ParenthesisTypeLiteralNode> {
            nodeType: NodeType.ParenthesisTypeLiteral,
            category: NodeCategory.Type,
            value: node.paramType,
            position: node.paramType.position
          }
        ],
        position: node.paramType.position,
      } : node.paramType);
      // Add Variable To Stack
      // TODO: Support Destructuring
      createVariable(_variables, _varStack, {
        name: node.name.name,
        global: false,
        constant: !node.mutable,
        parameter: true,
        exported: false,
        import: false,
        wasmImport: false,
        used: false,
        type: node.paramType,
      }, node.position);
      return node;
    // Otherwise
    default:
      console.log('Analyzer Unknown Node');
      console.log(node);
      process.exit(1);
  }
};
// Analyze Program
const analyzeProgram = (program: ProgramNode) => {
  return analyzeNode(
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

export default analyzeProgram;
