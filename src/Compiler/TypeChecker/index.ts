import { NodeType, NodeCategory, Type } from '../Types/ParseNodes';
import { Position } from '../Types/Types';
import { AnalyzerNode, AnalyzedExpression, VariableData, VariableMap, VariableStack, AnalyzedProgramNode } from '../Types/AnalyzerNodes';
import { BriskTypeError } from '../Errors/Compiler';

const typeNodeString = (typeNode: Type) =>
  typeNode.nodeType == NodeType.Type ? typeNode.name : `(${typeNode.params.map(param => param.name).join(', ')}) -> ${typeNode.returnType.name}`;
const createTypeNode = (name: string, position: Position): Type => {
  return { nodeType: NodeType.Type, category: NodeCategory.Type, name: name, position: position };
};
const checkValidType = (
  expected: Type,
  got: Type,
  position: Position,
  message = (expected: string, got: string) => `Expected Type \`${expected}\`, got \`${got}\``
) => {
  if (expected.name == 'Any' || got.name == 'Any') return;
  if (expected.name != got.name)
    BriskTypeError(message(typeNodeString(expected), typeNodeString(got)), position);
};
const typeCheckNode = (_variables: VariableMap, stack: VariableStack, node: AnalyzerNode): Type => {
  // Properties
  // What are we analyzing
  // Finding Closures
  // Determining Globals, Top level values
  // Determining Used Variables
  // Determine Global Functions
  // Logic for analyzing the parse Tree
  switch (node.nodeType) {
    case NodeType.Program:
      node.body.map(child => typeCheckNode(node.variables, node.stack, <AnalyzerNode>child));
      return createTypeNode('Void', node.position);
    // Statements
    case NodeType.BlockStatement:
      node.body.map(child => typeCheckNode(_variables, node.stack, <AnalyzerNode>child));
      return createTypeNode('Void', node.position);
    case NodeType.IfStatement: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.condition);
      console.log(typeNode);
      console.log(node.condition);
      checkValidType(createTypeNode('Boolean', node.position), typeNode, node.position);
      typeCheckNode(_variables, stack, <AnalyzerNode>node.body);
      if (node.alternative) typeCheckNode(_variables, stack, <AnalyzerNode>node.alternative);
      return createTypeNode('Void', node.position);
    }
    case NodeType.WasmImportStatement:
    case NodeType.ImportStatement:
    case NodeType.ExportStatement:
      // TODO: this is gonna need to be used to get types from other files / cross file type checking
      return createTypeNode('Void', node.position);
    case NodeType.DeclarationStatement: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      checkValidType(node.varType, typeNode, node.position);
      return createTypeNode('Void', node.position);
    }
    case NodeType.AssignmentStatement: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      const expectedType = typeCheckNode(_variables, stack, node.name);
      checkValidType(expectedType, typeNode, node.position);
      return createTypeNode('Void', node.position);
    }
    // Expressions
    case NodeType.ComparisonExpression:
      checkValidType(
        typeCheckNode(_variables, stack, <AnalyzedExpression>node.lhs),
        typeCheckNode(_variables, stack, <AnalyzedExpression>node.rhs),
        node.position,
        (expected: string, got: string) => `Expected Type \`${expected}\`, got \`${got}\`, lhs must match rhs`
      );
      return createTypeNode('Boolean', node.position);
    case NodeType.ArithmeticExpression:
      checkValidType(
        createTypeNode('Number', node.position),
        typeCheckNode(_variables, stack, <AnalyzedExpression>node.lhs),
        node.position
      );
      checkValidType(
        createTypeNode('Number', node.position),
        typeCheckNode(_variables, stack, <AnalyzedExpression>node.rhs),
        node.position
      );
      return createTypeNode('Number', node.position);
    case NodeType.LogicExpression: {
      const typeNode = typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
      checkValidType(createTypeNode('Boolean', node.position), typeNode, node.position);
      return createTypeNode('Boolean', node.position);
    }
    case NodeType.ParenthesisExpression:
      return typeCheckNode(_variables, stack, <AnalyzedExpression>node.value);
    case NodeType.CallExpression:
      // TODO: Type Check This, we will need union types and to determine the type in the analyzer
      return createTypeNode('Any', node.position);
    case NodeType.WasmCallExpression:
      if (node.name.length == 0) {
        BriskTypeError('You must specify the function name', node.position);
        return createTypeNode('Void', node.position);
      } else {
        const checkArgs = (expected: Type[], got: Type[]) => {
          if (expected.length != got.length)
            BriskTypeError(`Expected ${expected.length} arguments, got ${got.length} arguments`, node.position);
          else expected.forEach((arg, i) => checkValidType(arg, got[i], node.position));
        };
        // TODO: Add atomic stuff, try to make this code a lot smaller
        switch (node.name.slice(6)) {
          // Global
          // Memory
          case 'memory.size':
            checkArgs(
              [],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'memory.grow':
            checkArgs(
              [createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          // TODO: implement memory.init, memory.copy, memory.fill
          // i32
          case 'i32.load':
          case 'i32.load8_s':
          case 'i32.load8_u':
          case 'i32.load16_s':
          case 'i32.load16_u':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.store':
          case 'i32.store8':
          case 'i32.store16':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          case 'i32.const':
            checkArgs(
              [createTypeNode('Number', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.clz':
          case 'i32.ctz':
          case 'i32.popcnt':
          case 'i32.eqz':
            checkArgs(
              [createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.trunc_s.f32':
          case 'i32.trunc_u.f32':
          case 'i32.trunc_s_sat.f32':
          case 'i32.trunc_u_sat.f32':
          case 'i32.reinterpret':
            checkArgs(
              [createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.trunc_s.f64':
          case 'i32.trunc_u.f64':
          case 'i32.trunc_s_sat.f64':
          case 'i32.trunc_u_sat.f64':
            checkArgs(
              [createTypeNode('f64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.wrap':
            checkArgs(
              [createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          case 'i32.extend8_s':
          case 'i32.extend16_s':
          case 'i32.add':
          case 'i32.sub':
          case 'i32.mul':
          case 'i32.div_s':
          case 'i32.div_u':
          case 'i32.rem_s':
          case 'i32.rem_u':
          case 'i32.and':
          case 'i32.or':
          case 'i32.xor':
          case 'i32.shl':
          case 'i32.shr_u':
          case 'i32.shr_s':
          case 'i32.rotl':
          case 'i32.rotr':
          case 'i32.eq':
          case 'i32.ne':
          case 'i32.lt_s':
          case 'i32.lt_u':
          case 'i32.le_s':
          case 'i32.le_u':
          case 'i32.gt_s':
          case 'i32.gt_u':
          case 'i32.ge_s':
          case 'i32.ge_u':
            checkArgs(
              [createTypeNode('i32', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i32', node.position);
          // i64
          case 'i64.load':
          case 'i64.load8_s':
          case 'i64.load8_u':
          case 'i64.load16_s':
          case 'i64.load16_u':
          case 'i64.load32_s':
          case 'i64.load32_u':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          case 'i64.store':
          case 'i64.store8':
          case 'i64.store16':
          case 'i64.store32':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position), createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          case 'i64.const':
            checkArgs(
              [createTypeNode('Number', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          case 'i64.clz':
          case 'i64.ctz':
          case 'i64.popcnt':
          case 'i64.eqz':
            checkArgs(
              [createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          case 'i64.trunc_s.f32':
          case 'i64.trunc_u.f32':
          case 'i64.trunc_s_sat.f32':
          case 'i64.trunc_u_sat.f32':
          case 'i64.reinterpret':
            checkArgs(
              [createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          case 'i64.trunc_s.f64':
          case 'i64.trunc_u.f64':
          case 'i64.trunc_s_sat.f64':
          case 'i64.trunc_u_sat.f64':
            checkArgs(
              [createTypeNode('f64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          case 'i64.extend8_s':
          case 'i64.extend16_s':
          case 'i64.extend32_s':
          case 'i64.extend_s':
          case 'i64.extend_u':
          case 'i64.add':
          case 'i64.sub':
          case 'i64.mul':
          case 'i64.div_s':
          case 'i64.div_u':
          case 'i64.rem_s':
          case 'i64.rem_u':
          case 'i64.and':
          case 'i64.or':
          case 'i64.xor':
          case 'i64.shl':
          case 'i64.shr_u':
          case 'i64.shr_s':
          case 'i64.rotl':
          case 'i64.rotr':
          case 'i64.eq':
          case 'i64.ne':
          case 'i64.lt_s':
          case 'i64.lt_u':
          case 'i64.le_s':
          case 'i64.le_u':
          case 'i64.gt_s':
          case 'i64.gt_u':
          case 'i64.ge_s':
          case 'i64.ge_u':
            checkArgs(
              [createTypeNode('i64', node.position), createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('i64', node.position);
          // f32
          case 'f32.load':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.store':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position), createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          case 'f32.const':
          case 'f32.const_bits':
            checkArgs(
              [createTypeNode('Number', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.neg':
          case 'f32.abs':
          case 'f32.ceil':
          case 'f32.floor':
          case 'f32.trunc':
          case 'f32.nearest':
          case 'f32.sqrt':
            checkArgs(
              [createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.reinterpret':
          case 'f32.convert_s.i32':
          case 'f32.convert_u.i32':
            checkArgs(
              [createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.convert_s.64':
          case 'f32.convert_u.64':
            checkArgs(
              [createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.demote':
            checkArgs(
              [createTypeNode('f64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          case 'f32.add':
          case 'f32.sub':
          case 'f32.mul':
          case 'f32.div':
          case 'f32.copysign':
          case 'f32.min':
          case 'f32.max':
          case 'f32.eq':
          case 'f32.ne':
          case 'f32.lt':
          case 'f32.le':
          case 'f32.gt':
          case 'f32.ge':
            checkArgs(
              [createTypeNode('f32', node.position), createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          // f64
          case 'f64.load':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.store':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position), createTypeNode('i32', node.position), createTypeNode('f64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          case 'f64.const':
            checkArgs(
              [createTypeNode('Number', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.const_bits':
            checkArgs(
              [createTypeNode('Number', node.position), createTypeNode('Number', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.neg':
          case 'f64.abs':
          case 'f64.ceil':
          case 'f64.floor':
          case 'f64.trunc':
          case 'f64.nearest':
          case 'f64.sqrt':
            checkArgs(
              [createTypeNode('f64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.convert_s.i32':
          case 'f64.convert_u.i32':
            checkArgs(
              [createTypeNode('i32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.reinterpret':
          case 'f64.convert_s.64':
          case 'f64.convert_u.64':
            checkArgs(
              [createTypeNode('i64', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.promote':
            checkArgs(
              [createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f64', node.position);
          case 'f64.add':
          case 'f64.sub':
          case 'f64.mul':
          case 'f64.div':
          case 'f64.copysign':
          case 'f64.min':
          case 'f64.max':
          case 'f64.eq':
          case 'f64.ne':
          case 'f64.lt':
          case 'f64.le':
          case 'f64.gt':
          case 'f64.ge':
            checkArgs(
              [createTypeNode('f32', node.position), createTypeNode('f32', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('f32', node.position);
          // General Projects
          case 'drop':
            checkArgs(
              [createTypeNode('Any', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          case 'return':
            // TODO: this isnt meant to be any it is meant to be specific to the function
            checkArgs(
              [createTypeNode('Any', node.position)],
              node.args.map(arg => typeCheckNode(_variables, stack, <AnalyzedExpression>arg))
            );
            return createTypeNode('Void', node.position);
          // Other
          default:
            BriskTypeError(`Unknown Wasm Instruction \`${node.name}\``, node.position);
            return createTypeNode('Void', node.position);
        }
      }
    // Literals
    case NodeType.FunctionLiteral:
      node.params.forEach(param => typeCheckNode(_variables, node.stack, param));
      typeCheckNode(_variables, node.stack, <AnalyzerNode>node.body);
      return createTypeNode('Function', node.position);
    case NodeType.StringLiteral:
      return createTypeNode('String', node.position);
    case NodeType.I32Literal:
      return createTypeNode('i32', node.position);
    case NodeType.I64Literal:
      return createTypeNode('i64', node.position);
    case NodeType.U32Literal:
      return createTypeNode('u32', node.position);
    case NodeType.U64Literal:
      return createTypeNode('u64', node.position);
    case NodeType.F32Literal:
      return createTypeNode('f32', node.position);
    case NodeType.F64Literal:
      return createTypeNode('f64', node.position);
    case NodeType.NumberLiteral:
      return createTypeNode('Number', node.position);
    case NodeType.ConstantLiteral:
      if (node.value == 'true' || node.value == 'false') {
        return createTypeNode('Boolean', node.position);
      }
      // Then it is void
      return createTypeNode('Void', node.position);
    // Variables
    case NodeType.VariableUsage:
      return (<VariableData><unknown>_variables.get(<number>node.name)).type;
    case NodeType.MemberAccess:
      // TODO: We need to build ways to store these and figure out how we are gonna store objects
      BriskTypeError('Add Support for member access types', node.position);
      return createTypeNode('Void', node.position);
    case NodeType.Parameter:
      return node.paramType;
    // Ignore
    case NodeType.FlagStatement:
      return createTypeNode('Void', node.position);
    // Other
    // Uncomment this when adding new nodes
    default:
      BriskTypeError('TypeChecker: Unknown Node Type', node.position);
      return createTypeNode('Void', node.position);
  }
};
const typeCheck = (program: AnalyzedProgramNode) => {
  typeCheckNode(program.variables, program.stack, program);
};
export default typeCheck;