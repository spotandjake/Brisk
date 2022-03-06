import { Position } from '../Types/Types';
import Node, {
  NodeType,
  ProgramNode,
  Statement,
  Expression,
  NodeCategory,
  VariableUsageNode,
  DeclarationStatementNode,
  ExportStatementValue,
  DeclarationTypes,
} from '../Types/ParseNodes';
import { BriskParseError } from '../Errors/Compiler';
import AnalyzerNode, {
  ImportMap,
  ExportMap,
  AnalyzeNode,
  AnalyzedProgramNode,
  AnalyzedBlockStatementNode,
  TypeMap,
  TypeStack,
  VariableData,
  VariableMap,
  VariableStack,
} from '../Types/AnalyzerNodes';
// Analyze Node Interface
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
  const createVariable = (varPool: VariableMap, varStack: VariableStack, varData: VariableData) => {
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
    varName: string,
    position: Position,
    { exported }: { exported: boolean }
  ): VariableData => {
    // Get Reference To Variable In VarPool
    if (!varStack.has(varName)) BriskParseError(`Variable ${varName} Not Found`, position);
    const variableReference = <number>varStack.get(varName);
    // Get Variable Value
    // TODO: Determine  A Better Error Message here
    if (!varPool.has(variableReference)) BriskParseError('Compiler Bug Please Report', position);
    // Get Value
    const value = <VariableData>varPool.get(variableReference);
    // Set Variable To used
    varPool.set(variableReference, {
      ...value,
      used: true,
      exported: exported || value.exported,
    });
    // Return Value
    return value;
  };
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
      //TODO: We Need To Deal With Analyzing Returns
      // Don't Allow Definition Statements Here
      if (node.alternative?.nodeType == NodeType.DeclarationStatement)
        BriskParseError('Declaration May Not Appear In A Single-Statement If', node.position);
      node.condition = <Expression>_analyzeNode(node.condition);
      // Analyze Body And Alternative
      node.body = <Statement>_analyzeNode(node.body);
      if (node.alternative) node.alternative = <Statement>_analyzeNode(node.body);
      return node;
    case NodeType.FlagStatement:
      // TODO: Implement Analysis For Flag Statements
      console.log('TODO: Analyze Flag Statement');
      process.exit(1);
      break;
    case NodeType.BlockStatement: {
      // Create Our New Stacks
      const varStack: VariableStack = new Map();
      const typeStack: TypeStack = new Map();
      // Return Our Node
      return <AnalyzedBlockStatementNode>{
        ...node,
        body: node.body.map((child: Statement) =>
          _analyzeNode(child, {
            // Stacks
            _closure: _closure,
            _varStack: varStack,
            _typeStack: typeStack,
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
      // TODO: Add Import Item To List
      // Add Variable
      createVariable(_variables, _varStack, {
        name: node.variable.name,
        global: true,
        constant: true,
        exported: false,
        used: false,
        type: node.typeSignature,
      });
      // Return Node
      return node;
    case NodeType.ExportStatement: {
      // Determine Export name
      if (node.value.nodeType == NodeType.VariableUsage) {
        // Toggle The Variables Export Flag
        if (_exports.has(node.value.name))
          BriskParseError(
            `You May Only Export A Value With The Name of \`${node.value.name}\` once per file`,
            node.position
          );
        const variableData = getVariable(
          _variables,
          _varStack,
          node.value.name,
          node.value.position,
          { exported: true }
        );
        _exports.set(node.value.name, {
          name: node.value.name,
          value: node.value,
          type: variableData.type,
        });
      } else if (node.value.nodeType == NodeType.DeclarationStatement) {
        node.value = <DeclarationStatementNode>_analyzeNode(node.value);
        // Export Variable Value
        // TODO: Make The Export Value A VariableUsage
        const variableData = getVariable(
          _variables,
          _varStack,
          node.value.name.name,
          node.value.position,
          { exported: true }
        );
        _exports.set(variableData.name, {
          name: variableData.name,
          value: node.value,
          type: variableData.type,
        });
      } else if (node.value.nodeType == NodeType.ObjectLiteral) {
        node.value = <ExportStatementValue>_analyzeNode(node.value);
        // We Want To Export Each Field As A Separate Export
        console.log(node);
      }
      return node;
    }
    case NodeType.DeclarationStatement:
      // TODO: Handle Destructuring
      node.value = <Expression>_analyzeNode(node.value);
      // Add Variable
      createVariable(_variables, _varStack, {
        name: node.name.name,
        global: parentNode?.nodeType == NodeType.Program,
        constant: node.declarationType == DeclarationTypes.Constant,
        exported: false,
        used: false,
        type: node.varType,
      });
      return node;
    case NodeType.AssignmentStatement:
    case NodeType.ReturnStatement:
    case NodeType.PostFixStatement:
    case NodeType.EnumDefinitionStatement:
      console.log('TODO: Analyze Statements');
      process.exit(1);
      break;
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
    case NodeType.UnaryExpression:
    case NodeType.ParenthesisExpression:
    case NodeType.TypeCastExpression:
    case NodeType.CallExpression:
    case NodeType.WasmCallExpression:
      console.log('TODO: Analyze Expressions');
      process.exit(1);
      break;
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
    case NodeType.FunctionLiteral:
    case NodeType.ObjectLiteral:
      console.log('TODO: Analyze Literals');
      process.exit(1);
      break;
    // Types
    case NodeType.TypeAliasDefinition:
    case NodeType.InterfaceDefinition:
    case NodeType.TypePrimLiteral:
    case NodeType.TypeUnionLiteral:
    case NodeType.ParenthesisTypeLiteral:
    case NodeType.FunctionSignatureLiteral:
    case NodeType.InterfaceLiteral:
    case NodeType.TypeUsage:
      console.log('TODO: Analyze Types');
      process.exit(1);
      break;
    // Variables
    case NodeType.VariableUsage:
    case NodeType.MemberAccess:
    case NodeType.PropertyUsage:
    case NodeType.Parameter:
      console.log('TODO: Analyze Variables');
      process.exit(1);
      break;
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
