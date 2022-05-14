import { Position } from '../Types/Types';
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
  primTypes,
} from '../Types/ParseNodes';
import {
  AnalyzerProperties,
  ExportMap,
  ImportMap,
  TypeData,
  TypeMap,
  TypeStack,
  VariableClosure,
  VariableData,
  VariableMap,
  VariableStack,
} from '../Types/AnalyzerNodes';
import { createParenthesisType, createPrimType, createUnionType } from '../Helpers/index';
import { BriskError, BriskParseError, BriskTypeError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Variable Interactions
const createVariable = (
  code: string,
  varPool: VariableMap,
  varStack: VariableStack,
  varData: VariableData,
  position: Position
) => {
  // Check If Variable Already Exists On Stack
  if (varStack.has(varData.name))
    BriskParseError(code, BriskErrorType.VariableHasAlreadyBeenDeclared, [varData.name], position);
  // Create Reference To Map
  const variableReference = varPool.size;
  // Add Variable To Pool
  varPool.set(variableReference, varData);
  // Add Variable To Stack
  varStack.set(varData.name, variableReference);
};
const getVariable = (
  rawProgram: string,
  varPool: VariableMap,
  varStack: VariableStack,
  _closure: VariableClosure,
  varStacks: VariableStack[],
  varReference: VariableUsageNode | string,
  position: Position,
  { used = true, exported = false }: { used?: boolean; exported?: boolean }
): VariableData => {
  // Get Variable Reference
  let varName: string;
  if (typeof varReference == 'string') varName = varReference;
  else varName = varReference.name;
  // Search The Stacks
  const _varStack = [...varStacks, varStack].reverse().find((s) => s.has(varName));
  // Check If It Exists
  if (_varStack == undefined)
    return BriskTypeError(rawProgram, BriskErrorType.VariableNotFound, [varName], position);
  // Get Node
  const variableReference = _varStack.get(varName)!;
  // Check If We need To Add To Closure
  if (!varStack.has(varName)) _closure.add(variableReference);
  if (!varPool.has(variableReference))
    return BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  const value = varPool.get(variableReference)!;
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
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeData: TypeData,
  position: Position
) => {
  // Do Not Allow You To Write Over Primitive Types
  if ((<Set<string>>primTypes).has(typeData.name))
    BriskTypeError(rawProgram, BriskErrorType.InvalidTypeName, [typeData.name], position);
  // Check If Variable Already Exists On Stack
  if (typeStack.has(typeData.name))
    BriskTypeError(
      rawProgram,
      BriskErrorType.TypeHasAlreadyBeenDeclared,
      [typeData.name],
      position
    );
  // Create Reference To Map
  const variableReference = typePool.size;
  // Add Variable To Pool
  typePool.set(variableReference, typeData);
  // Add Variable To Stack
  typeStack.set(typeData.name, variableReference);
  // Return Type Reference
  return variableReference;
};
const getType = (
  rawProgram: string,
  typePool: TypeMap,
  typeStack: TypeStack,
  typeStacks: TypeStack[],
  typeReference: TypeUsageNode | string,
  position: Position,
  { exported = false }: { exported?: boolean }
): TypeData => {
  // Get Variable Reference
  let varName: string;
  if (typeof typeReference == 'string') varName = typeReference;
  else varName = typeReference.name;
  // Search The Stacks
  const _varStack = [...typeStacks, typeStack].reverse().find((s) => s.has(varName));
  // Check If It Exists
  if (_varStack == undefined)
    return BriskTypeError(rawProgram, BriskErrorType.TypeNotFound, [varName], position);
  // Get Node
  const variableReference = _varStack.get(varName)!;
  if (!typePool.has(variableReference))
    return BriskError(rawProgram, BriskErrorType.CompilerError, [], position);
  const value = typePool.get(variableReference)!;
  // Set Variable To used
  typePool.set(variableReference, {
    ...value,
    exported: value.exported || exported,
  });
  // Return Value
  return value;
};
// Analyze Node
const analyzeNode = <T extends Node>(
  // Code
  rawProgram: string,
  // Stacks
  properties: AnalyzerProperties,
  // Nodes
  parentNode: Node | undefined,
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
  const _analyzeNode = <_T extends Node>(
    childNode: _T,
    props: Partial<AnalyzerProperties> = properties,
    parentNode: Node = node
  ): _T => {
    return analyzeNode(rawProgram, { ...properties, ...props }, parentNode, childNode);
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
          BriskParseError(
            rawProgram,
            BriskErrorType.ImportStatementExpectedAtTop,
            [],
            statementNode.position
          );
        if (statementNode.nodeType == NodeType.ExportStatement) hitExportNode = true;
        if (statementNode.nodeType != NodeType.ExportStatement && hitExportNode)
          BriskParseError(
            rawProgram,
            BriskErrorType.ExportStatementExpectedAtBottom,
            [],
            statementNode.position
          );
        prevNode = statementNode;
      }
      // Analyze Body
      node.body = node.body.map((child: Statement) => {
        return _analyzeNode(child, {
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
        });
      });
      // Set Data Payload
      node.data = {
        _imports: imports,
        _exports: exports,
        _variables: variables,
        _types: types,
        _varStack: varStack,
        _typeStack: typeStack,
      };
      // Return Our Node
      return node;
    }
    // Statements
    case NodeType.IfStatement:
      // Don't Allow Definition Statements Here
      if (node.alternative?.nodeType == NodeType.DeclarationStatement)
        BriskParseError(
          rawProgram,
          BriskErrorType.DeclarationCannotOccurInsideSingleLineStatement,
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
          node.alternative.data &&
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
      // Remove Dead Code After ReturnStatement
      const body: Statement[] = [];
      for (const [index, child] of node.body.entries()) {
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
        // Push Child To Body
        body.push(analyzedChild);
        // No Point In Analyzing After A Return Statement
        if ('data' in child && 'pathReturns' in child.data && child.data.pathReturns) {
          // Disallow Dead Code
          if (index != node.body.length - 1) {
            BriskTypeError(rawProgram, BriskErrorType.DeadCode, [], node.body[index + 1].position);
          }
          // Set Block Data To Include Info That This Block Returns
          pathReturns = true;
        }
      }
      // Set Body
      node.body = body;
      // Set Data Payload
      node.data = {
        _varStack: varStack,
        _typeStack: typeStack,

        pathReturns: pathReturns,
      };
      // Return Our Node
      return node;
    }
    case NodeType.ImportStatement:
      _imports.set(node.variable.name, {
        name: node.variable.name,
        path: node.source.value,
        position: node.position,
      });
      createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.variable.name,
          global: true,
          constant: true,
          parameter: false,
          exported: false,
          import: true,
          wasmImport: false,
          used: false,
          type: createPrimType(node.variable.position, 'Unknown'),
        },
        node.position
      );
      return node;
    case NodeType.WasmImportStatement:
      // Analyze Type
      node.typeSignature = _analyzeNode(node.typeSignature);
      // Add Variable
      createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.variable.name,
          global: true,
          constant: true,
          parameter: false,
          exported: false,
          import: false,
          wasmImport: true,
          used: false,
          type: node.typeSignature,
        },
        node.position
      );
      // Return Node
      return node;
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
        // Analyze Type Export
        const exportName = node.value.name;
        // Get Type Data
        const typeData = getType(
          rawProgram,
          _types,
          _typeStack,
          _typeStacks,
          exportName,
          node.position,
          {
            exported: true,
          }
        );
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
            position: node.position,
          },
          typeExport: true,
          valueExport: node.value.nodeType == NodeType.EnumDefinitionStatement,
        });
      } else {
        // Regular Export
        const exportName: string =
          node.value.nodeType == NodeType.DeclarationStatement
            ? node.value.name.name
            : node.value.name;
        // Set Variable To Exported
        const exportData = getVariable(
          rawProgram,
          _variables,
          _varStack,
          _closure,
          _varStacks,
          exportName,
          node.value.position,
          { used: true, exported: true }
        );
        if (exportData == undefined) {
          BriskError(rawProgram, BriskErrorType.CompilerError, [], node.position);
          return node;
        }
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
            position: node.position,
          },
          typeExport: false,
          valueExport: true,
        });
      }
      // Return Value
      return node;
    }
    case NodeType.DeclarationStatement:
      // TODO: Handle Destructuring
      // Analyze Type Variable
      node.varType = _analyzeNode(node.varType);
      // Add Variable To Stack
      createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name.name,
          global: parentNode?.nodeType == NodeType.Program,
          constant: node.declarationType == DeclarationTypes.Constant,
          parameter: false,
          exported: false,
          import: false,
          wasmImport: false,
          used: false,
          type: node.varType,
        },
        node.position
      );
      // Analyze The Value
      node.value = _analyzeNode(node.value);
      return node;
    case NodeType.AssignmentStatement:
      // Analyze Value
      node.value = _analyzeNode(node.value);
    case NodeType.PostFixStatement: {
      // Analyze Variable
      node.name = _analyzeNode(node.name);
      if (node.name.nodeType == NodeType.MemberAccess) return node;
      // Verify That Var Exists And Is mutable
      const variableData = getVariable(
        rawProgram,
        _variables,
        _varStack,
        _closure,
        _varStacks,
        node.name,
        node.position,
        { used: false }
      );
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
      // Add To Type Stack
      createType(
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
      createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name,
          global: parentNode?.nodeType == NodeType.Program,
          constant: true,
          parameter: false,
          exported: false,
          import: false,
          wasmImport: false,
          used: false,
          type: <TypeUsageNode>{
            nodeType: NodeType.TypeUsage,
            category: NodeCategory.Type,
            name: node.name,
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
      let foundOptional = false;
      for (const param of node.params) {
        if (param.optional) foundOptional = true;
        else if (foundOptional)
          BriskTypeError(
            rawProgram,
            BriskErrorType.OptionalParametersMustAppearLast,
            [],
            param.position
          );
      }
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
      const typeReference = createType(
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
      _types.set(typeReference, {
        name: node.name,
        exported: false,
        type: node.typeLiteral,
      });
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
      getType(rawProgram, _types, _typeStack, _typeStacks, node.name, node.position, {});
      return node;
    case NodeType.GenericType:
      // Analyze Constraints
      if (node.constraints) node.constraints = _analyzeNode(node.constraints);
      // Create Type
      createType(
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
    case NodeType.VariableUsage:
      getVariable(rawProgram, _variables, _varStack, _closure, _varStacks, node, node.position, {});
      return node;
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
      createVariable(
        rawProgram,
        _variables,
        _varStack,
        {
          name: node.name.name,
          global: false,
          constant: !node.mutable,
          parameter: true,
          exported: false,
          import: false,
          wasmImport: false,
          used: false,
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
  return analyzeNode(
    rawProgram,
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
