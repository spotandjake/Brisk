import Node, {
  DeclarationTypes,
  Expression,
  NodeCategory,
  NodeType,
  ObjectFieldNode,
  ProgramNode,
  Statement,
  TypeUsageNode,
  ValueSpreadNode,
  VariableUsageNode,
} from '../Types/ParseNodes';
import {
  AnalyzerProperties,
  ExportMap,
  ImportMap,
  TypeMap,
  TypeStack,
  VariableClosure,
  VariableMap,
  VariableStack,
} from '../Types/AnalyzerNodes';
import { createParenthesisType, createPrimType, createUnionType } from '../Helpers/typeBuilders';
import { BriskError, BriskParseError, BriskTypeError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
import {
  createType,
  createVariable,
  getType,
  getTypeReference,
  getVariable,
  getVariableReference,
  setType,
  setVariable,
} from '../Helpers/Helpers';
// Analyze Node
const analyzeNode = <T extends Exclude<Node, ProgramNode>>(
  // Code
  rawProgram: string,
  // Stacks
  properties: AnalyzerProperties,
  // Nodes
  parentNode: Node,
  node: T
): T => {
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
  const _analyzeNode = <_T extends Exclude<Node, ProgramNode>>(
    childNode: _T,
    props: Partial<AnalyzerProperties> = properties,
    parentNode: Node = node
  ): _T => analyzeNode(rawProgram, { ...properties, ...props }, parentNode, childNode);
  // Match The Node For Analysis
  switch (node.nodeType) {
    // Statements
    case NodeType.IfStatement:
      // Don't Allow Definition Statements Here
      if (node.alternative?.nodeType == NodeType.DeclarationStatement)
        BriskParseError(
          rawProgram,
          BriskErrorType.NoDeclarationInSingleLineStatement,
          [],
          node.position
        );
      node.condition = _analyzeNode(node.condition);
      // Analyze Body And Alternative
      node.body = _analyzeNode(node.body);
      if (node.alternative != undefined) {
        // Analyze The Alternative Path
        node.alternative = _analyzeNode(node.alternative);
        // Check If Both Paths Return
        if (
          'data' in node.body &&
          'pathReturns' in node.body.data &&
          node.body.data.pathReturns &&
          'data' in node.alternative &&
          'pathReturns' in node.alternative.data &&
          node.alternative.data.pathReturns
        )
          node.data.pathReturns = true;
      }
      return node;
    case NodeType.FlagStatement:
      if (node.args.length != 0) {
        if (node.value == 'operator') {
          if (node.args.length != 2)
            BriskTypeError(
              rawProgram,
              BriskErrorType.FlagExpectedArguments,
              [node.value, '2', `${node.args.length}`],
              node.args.position
            );
          return node;
        }
        BriskTypeError(
          rawProgram,
          BriskErrorType.FlagExpectedArguments,
          [node.value, '0', `${node.args.length}`],
          node.args.position
        );
      }
      return node;
    case NodeType.BlockStatement: {
      // Create Our New Stacks
      const varStack: VariableStack = new Map();
      const typeStack: TypeStack = new Map();
      let pathReturns = false;
      // Return Our Node
      return {
        ...node,
        body: node.body.map((child, i) => {
          // Analyze Body
          const analyzedChild = _analyzeNode(child, {
            // Stacks
            _closure: _closure,
            _varStack: varStack,
            _typeStack: typeStack,
            // Stack Pool
            _varStacks: [..._varStacks, _varStack],
            _typeStacks: [..._typeStacks, _typeStack],
          });
          // No Point In Analyzing After A Return Statement
          if ('data' in child && 'pathReturns' in child.data && child.data.pathReturns) {
            // Disallow Dead Code
            if (i != node.body.length - 1) {
              BriskTypeError(rawProgram, BriskErrorType.DeadCode, [], node.body[i + 1].position);
            }
            // Set Block Data To Include Info That This Block Returns
            pathReturns = true;
          }
          // Push Child To Body
          return analyzedChild;
        }),
        data: {
          _varStack: varStack,
          _typeStack: typeStack,

          pathReturns: pathReturns,
        },
      };
    }
    case NodeType.ImportStatement: {
      _imports.set(node.variable.name, {
        name: node.variable.name,
        path: node.source.value,
        position: node.position,
      });
      node.variable.reference = createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.variable.name,
          mainScope: true,
          global: true,
          constant: true,
          import: true,
          type: createPrimType(node.variable.position, 'Unknown'),
        },
        node.position
      );
      return node;
    }
    case NodeType.WasmImportStatement: {
      // Analyze Type
      node.typeSignature = _analyzeNode(node.typeSignature);
      // Add Variable
      node.variable.reference = createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.variable.name,
          mainScope: true,
          global: true,
          constant: true,
          wasmImport: true,
          type: node.typeSignature,
        },
        node.position
      );
      // Return Node
      return node;
    }
    case NodeType.ExportStatement: {
      // Analysis
      node.value = _analyzeNode(node.value);
      // Analyze Object Literal
      if (node.value.nodeType == NodeType.ObjectLiteral) {
        // Add Fields To Export
        for (const field of node.value.fields) {
          if (field.nodeType == NodeType.ValueSpread) {
            BriskError(rawProgram, BriskErrorType.InvalidExport, ['Object Spread'], field.position);
          } else {
            if (_exports.has(field.name))
              BriskTypeError(
                rawProgram,
                BriskErrorType.DuplicateExport,
                [field.name],
                field.position
              );
            _exports.set(field.name, {
              name: field.name,
              value: field.fieldValue,
              typeExport: false,
              valueExport: true,
            });
          }
        }
        return node;
      } else if (
        node.value.nodeType == NodeType.InterfaceDefinition ||
        node.value.nodeType == NodeType.EnumDefinitionStatement ||
        node.value.nodeType == NodeType.TypeAliasDefinition
      ) {
        // Get Type Data
        const typeData = getType(_types, node.value);
        setType(_types, node.value, { exported: true });
        // Check Export Valid
        if (_exports.has(typeData.name))
          BriskTypeError(
            rawProgram,
            BriskErrorType.DuplicateExport,
            [typeData.name],
            node.position
          );
        // Set Exported
        _exports.set(typeData.name, {
          name: typeData.name,
          value: <TypeUsageNode>{
            nodeType: NodeType.TypeUsage,
            category: NodeCategory.Type,
            name: typeData.name,
            reference: typeData.reference,
            position: node.position,
          },
          typeExport: true,
          valueExport: node.value.nodeType == NodeType.EnumDefinitionStatement,
        });
      } else {
        // Regular Export
        const exportName =
          node.value.nodeType == NodeType.DeclarationStatement ? node.value.name : node.value;
        // Set Variable To Exported
        setVariable(_variables, exportName, { exported: true, used: true });
        const exportData = getVariable(_variables, exportName);
        // Check Export Valid
        if (_exports.has(exportData.name))
          BriskTypeError(
            rawProgram,
            BriskErrorType.DuplicateExport,
            [exportData.name],
            node.position
          );
        // Set Exported
        _exports.set(exportData.name, {
          name: exportData.name,
          value: <VariableUsageNode>{
            nodeType: NodeType.VariableUsage,
            category: NodeCategory.Variable,
            name: exportData.name,
            reference: exportData.reference,
            position: node.position,
          },
          typeExport: false,
          valueExport: true,
        });
        // set reference
        if (node.value.nodeType == NodeType.VariableUsage)
          node.value.reference = exportData.reference;
        else node.value.name.reference = exportData.reference;
      }
      // Return Value
      return node;
    }
    case NodeType.DeclarationStatement: {
      // TODO: Handle Destructuring
      // Analyze Type Variable
      node.varType = _analyzeNode(node.varType);
      // Add Variable To Stack
      node.name.reference = createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name.name,
          mainScope: parentNode.nodeType == NodeType.Program,
          constant: node.declarationType == DeclarationTypes.Constant,
          type: node.varType,
        },
        node.position
      );
      // Analyze The Value
      node.value = _analyzeNode(node.value);
      return node;
    }
    case NodeType.AssignmentStatement:
      // Analyze Value
      node.value = _analyzeNode(node.value);
    case NodeType.PostFixStatement: {
      // Analyze Variable
      node.name = _analyzeNode(node.name);
      if (node.name.nodeType == NodeType.MemberAccess) return node;
      // Verify That Var Exists And Is mutable
      const variableData = getVariable(_variables, node.name);
      if (variableData.constant)
        BriskTypeError(
          rawProgram,
          BriskErrorType.ConstantAssignment,
          [variableData.name],
          node.position
        );
      return node;
    }
    case NodeType.ReturnStatement:
      if (node.returnValue) node.returnValue = _analyzeNode(node.returnValue);
      return node;
    case NodeType.EnumDefinitionStatement: {
      // TODO: Add To Variable List As An Object Maybe
      // Create New Type Stack
      const typeStack: TypeStack = new Map();
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((genericType) => {
          return _analyzeNode(genericType, {
            // Stacks
            _typeStack: typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Ensure No Duplicate Variants
      const variants: Set<string> = new Set();
      for (const variant of node.variants) {
        if (variants.has(variant.identifier))
          BriskTypeError(
            rawProgram,
            BriskErrorType.DuplicateField,
            [variant.identifier],
            variant.position
          );
        variants.add(variant.identifier);
      }
      // Analyze Variants
      node.variants = node.variants.map((variant) => {
        return _analyzeNode(variant, {
          // Stacks
          _typeStack: typeStack,
          // Stack Pool
          _typeStacks: [..._typeStacks, _typeStack],
        });
      });
      // TODO: Should this have a type Reference or a variable reference?
      // Add To Type Stack
      node.reference = createType(
        rawProgram,
        _types,
        _typeStack,
        {
          name: node.name,
          exported: false,
          type: node,
        },
        node.position
      );
      // Add To Variable Stack
      node.reference = createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name,
          mainScope: parentNode.nodeType == NodeType.Program,
          constant: true,
          type: <TypeUsageNode>{
            nodeType: NodeType.TypeUsage,
            category: NodeCategory.Type,
            name: node.name,
            reference: node.reference,
            position: node.position,
          },
        },
        node.position
      );
      // Set Data Payload
      node.data = {
        _typeStack: typeStack,
      };
      return node;
    }
    case NodeType.EnumVariant:
      // Analyze Value
      if (node.value) {
        if (Array.isArray(node.value))
          node.value = node.value.map((typeLiteral) => _analyzeNode(typeLiteral));
        else if (node.value.category == NodeCategory.Expression)
          node.value = _analyzeNode(node.value);
      }
      return node;
    // Expressions
    case NodeType.ComparisonExpression:
    case NodeType.ArithmeticExpression:
      node.lhs = _analyzeNode(node.lhs);
      node.rhs = _analyzeNode(node.rhs);
      return node;
    case NodeType.TypeCastExpression:
      node.typeLiteral = _analyzeNode(node.typeLiteral);
    case NodeType.UnaryExpression:
    case NodeType.ParenthesisExpression:
      node.value = _analyzeNode(node.value);
      return node;
    case NodeType.CallExpression:
      // Analyze Callee
      node.callee = _analyzeNode(node.callee);
      // Analyze Arguments
      node.args = node.args.map((arg: Expression) => _analyzeNode(arg));
      return node;
    case NodeType.WasmCallExpression:
      node.args = node.args.map((arg) => _analyzeNode(arg));
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
      node.params.forEach((param, i) => {
        if (param.optional && i != node.params.length - 1 && !node.params[i + 1].optional)
          BriskTypeError(
            rawProgram,
            BriskErrorType.OptionalParametersMustAppearLast,
            [],
            param.position
          );
      });
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((genericType) => {
          return _analyzeNode(genericType, {
            // Parent Stacks
            _varStacks: [..._varStacks, _varStack],
            _typeStacks: [..._typeStacks, _typeStack],
            // Stacks
            _closure: closure,
            _varStack: varStack,
            _typeStack: typeStack,
          });
        });
      }
      // Analyze ReturnType
      node.returnType = _analyzeNode(node.returnType, {
        // Parent Stacks
        _varStacks: [..._varStacks, _varStack],
        _typeStacks: [..._typeStacks, _typeStack],
        // Stacks
        _closure: closure,
        _varStack: varStack,
        _typeStack: typeStack,
      });
      // Analyze Params
      node.params = node.params.map((param) => {
        return _analyzeNode(param, {
          // Parent Stacks
          _varStacks: [..._varStacks, _varStack],
          _typeStacks: [..._typeStacks, _typeStack],
          // Stacks
          _closure: closure,
          _varStack: varStack,
          _typeStack: typeStack,
        });
      });
      // Analyze Body
      node.body = _analyzeNode(node.body, {
        // Parent Stacks
        _varStacks: [..._varStacks, _varStack],
        _typeStacks: [..._typeStacks, _typeStack],
        // Stacks
        _closure: closure,
        _varStack: varStack,
        _typeStack: typeStack,
      });
      // Set Return Type
      let pathReturns = false;
      if ('data' in node.body && 'pathReturns' in node.body.data) {
        // Has Return Value
        pathReturns = node.body.data?.pathReturns;
      } else if (node.body.nodeType != NodeType.BlockStatement) {
        // Is A Single Line Function
        pathReturns = true;
      }
      // Set Data Payload
      node.data = {
        _closure: closure,
        _varStack: varStack,
        _typeStack: typeStack,

        pathReturns: pathReturns,
      };
      // Analyze Params
      return node;
    }
    case NodeType.ArrayLiteral: {
      // Analyze Elements
      node.elements = node.elements.map((element) => {
        if (element.nodeType == NodeType.ValueSpread) return _analyzeNode(element.value);
        else return _analyzeNode(element);
      });
      // Return Node
      return node;
    }
    case NodeType.ObjectLiteral: {
      // Analyze Fields
      const fields: (ObjectFieldNode | ValueSpreadNode)[] = [];
      for (const field of node.fields) {
        // field
        if (field.nodeType == NodeType.ValueSpread) field.value = _analyzeNode(field.value);
        else field.fieldValue = _analyzeNode(field.fieldValue);
        // Check if field exists
        if (
          field.nodeType == NodeType.ObjectField &&
          fields.some((f) => f.nodeType == NodeType.ObjectField && f.name == field.name)
        )
          BriskTypeError(rawProgram, BriskErrorType.DuplicateField, [field.name], field.position);
        fields.push(field);
      }
      node.fields = fields;
      return node;
    }
    // Types
    case NodeType.InterfaceDefinition:
    case NodeType.TypeAliasDefinition: {
      // Create New Type Stack
      const typeStack: TypeStack = new Map();
      // Set Type
      node.reference = createType(
        rawProgram,
        _types,
        _typeStack,
        {
          name: node.name,
          exported: false,
          type: node.typeLiteral,
        },
        node.position
      );
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((genericType) => {
          return _analyzeNode(genericType, {
            // Stacks
            _typeStack: typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Interface
      node.typeLiteral = _analyzeNode(node.typeLiteral, {
        // Stacks
        _typeStack: typeStack,
        // Stack Pool
        _typeStacks: [..._typeStacks, _typeStack],
      });
      // Complete Type
      setType(_types, node, { type: node.typeLiteral });
      // Set Data Payload
      node.data = {
        _typeStack: typeStack,
      };
      return node;
    }
    case NodeType.TypePrimLiteral:
      return node;
    case NodeType.TypeUnionLiteral:
      // Analyze Types
      node.types = node.types.map((type) => _analyzeNode(type));
      return node;
    case NodeType.ArrayTypeLiteral:
      // Analyze Length
      if (node.length) node.length = _analyzeNode(node.length);
      // Analyze Value
      node.value = _analyzeNode(node.value);
      return node;
    case NodeType.ParenthesisTypeLiteral:
      node.value = _analyzeNode(node.value);
      return node;
    case NodeType.FunctionSignatureLiteral: {
      // Create New Type Stack
      const typeStack: TypeStack = new Map();
      // Analyze Generic Types
      if (node.genericTypes) {
        node.genericTypes = node.genericTypes.map((genericType) => {
          return _analyzeNode(genericType, {
            // Stacks
            _typeStack: typeStack,
            // Stack Pool
            _typeStacks: [..._typeStacks, _typeStack],
          });
        });
      }
      // Analyze Parameter Types
      node.params = node.params.map((param) =>
        _analyzeNode(param, {
          // Stacks
          _typeStack: typeStack,
          // Stack Pool
          _typeStacks: [..._typeStacks, _typeStack],
        })
      );
      // Analyze Return Types
      node.returnType = _analyzeNode(node.returnType, {
        // Stacks
        _typeStack: typeStack,
        // Stack Pool
        _typeStacks: [..._typeStacks, _typeStack],
      });
      // Set Data Payload
      node.data = {
        _typeStack: typeStack,
      };
      // Return Data Type
      return node;
    }
    case NodeType.InterfaceLiteral: {
      // Analyze Fields
      const fields: Set<string> = new Set();
      node.fields = node.fields.map((field) => {
        if (fields.has(field.name))
          BriskTypeError(rawProgram, BriskErrorType.DuplicateField, [field.name], field.position);
        field.fieldType = _analyzeNode(field.fieldType);
        fields.add(field.name);
        return field;
      });
      return node;
    }
    case NodeType.TypeUsage:
      node.reference = getTypeReference(rawProgram, node, {
        pool: _types,
        stack: _typeStack,
        stacks: _typeStacks,
      });
      return node;
    case NodeType.GenericType:
      // Analyze Constraints
      if (node.constraints) node.constraints = _analyzeNode(node.constraints);
      // Create Type
      node.reference = createType(
        rawProgram,
        _types,
        _typeStack,
        {
          name: node.name,
          exported: false,
          type: node,
        },
        node.position
      );
      return node;
    // Variables
    case NodeType.VariableUsage: {
      // Resolve Variable Reference
      node.reference = getVariableReference(rawProgram, node, {
        pool: _variables,
        stack: _varStack,
        stacks: _varStacks,
      });
      // Add To Closure
      if (!_varStack.has(node.name)) {
        if (getVariable(_variables, node).mainScope)
          setVariable(_variables, node, { global: true });
        _closure.add(node.reference);
      }
      // Set Variable To Used
      setVariable(_variables, node, { used: true });
      // Return Node
      return node;
    }
    case NodeType.MemberAccess:
      // Analyze Parent
      node.parent = _analyzeNode(node.parent);
      // Analyze Child
      node.property = _analyzeNode(node.property);
    case NodeType.PropertyUsage:
      // Analyze Node Property
      if (node.property) node.property = _analyzeNode(node.property);
      // Return node
      return node;
    case NodeType.Parameter: {
      if (node.optional) {
        node.paramType = createUnionType(
          node.paramType.position,
          createPrimType(node.paramType.position, 'Void'),
          createParenthesisType(node.paramType.position, node.paramType)
        );
      }
      // Change Type To Include Void
      node.paramType = _analyzeNode(node.paramType);
      // Add Variable To Stack
      // TODO: Support Rest Syntax
      node.name.reference = createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name.name,
          constant: !node.mutable,
          parameter: true,
          type: node.paramType,
        },
        node.position
      );
      return node;
    }
  }
};
// Analyze Program
const analyzeProgram = (rawProgram: string, program: ProgramNode): ProgramNode => {
  // Compile Program Node
  const imports: ImportMap = new Map();
  const exports: ExportMap = new Map();
  const variables: VariableMap = new Map();
  const types: TypeMap = new Map();
  const varStack: VariableStack = new Map();
  const typeStack: TypeStack = new Map();
  // Return Our Node
  return {
    ...program,
    // Analyze Body
    body: program.body.map((child: Statement, i: number) => {
      // Ensure Import and Export Statements is at the top and bottom of the file.
      const { nodeType, position } = child;
      const prevNode = program.body[i - 1];
      if (prevNode != undefined) {
        if (
          (nodeType == NodeType.ImportStatement || nodeType == NodeType.WasmImportStatement) &&
          prevNode.category != NodeCategory.Type &&
          prevNode.nodeType != NodeType.ImportStatement &&
          prevNode.nodeType != NodeType.WasmImportStatement
        )
          BriskParseError(rawProgram, BriskErrorType.ImportStatementExpectedAtTop, [], position);
        if (prevNode.nodeType == NodeType.ExportStatement && nodeType != NodeType.ExportStatement)
          BriskParseError(rawProgram, BriskErrorType.ExportStatementExpectedAtBottom, [], position);
      }
      // Compile The Node
      return analyzeNode(
        rawProgram,
        {
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
        },
        program,
        child
      );
    }),
    // Append Data
    data: {
      _imports: imports,
      _exports: exports,
      _variables: variables,
      _types: types,
      _varStack: varStack,
      _typeStack: typeStack,
    },
  };
};

export default analyzeProgram;
