// Imports
import { Position } from '../Types/Types';
import {
  TypeData,
  TypeMap,
  TypeStack,
  VariableData,
  VariableMap,
  VariableStack,
} from '../Types/AnalyzerNodes';
import {
  EnumDefinitionStatementNode,
  GenericTypeNode,
  InterfaceDefinitionNode,
  TypeAliasDefinitionNode,
  TypeUsageNode,
  VariableDefinitionNode,
  VariableUsageNode,
  primTypes,
} from '../Types/ParseNodes';
import { BriskError, BriskReferenceError } from '../Errors/Compiler';
import { BriskErrorType } from '../Errors/Errors';
// Local Types
export type VariableInfo = Omit<VariableData, 'reference'>;
export type VariableNode = VariableUsageNode | VariableDefinitionNode;
interface VariableContainer {
  pool: VariableMap;
  stack: VariableStack;
  stacks: VariableStack[];
}

export type TypeInfo = Omit<TypeData, 'reference'>;
export type TypeNode =
  | EnumDefinitionStatementNode
  | TypeUsageNode
  | TypeAliasDefinitionNode
  | InterfaceDefinitionNode
  | GenericTypeNode;
interface TypeContainer {
  pool: TypeMap;
  stack: TypeStack;
  stacks: TypeStack[];
}
// Variables
/**
 * Creates A new Variable And Puts It On The Stack
 *
 * @param  {string} rawProgram The Raw Program String
 * @param  {VariableMap} pool Variable Pool
 * @param  {VariableStack} stack Variable Stack
 * @param  {VariableInfo} data Variable Info
 * @param  {Position} pos The Current Node Position
 *
 * @returns A Reference To The Variable In The Pool
 */
export const createVariable = (
  rawProgram: string,
  pool: VariableMap,
  stack: VariableStack,
  data: VariableInfo,
  pos: Position
): number => {
  // Check If Variable Already Exists On Stack
  if (stack.has(data.name))
    BriskReferenceError(
      rawProgram,
      BriskErrorType.VariableHasAlreadyBeenDeclared,
      [data.name],
      pos
    );
  // Create Reference To Pool
  const reference = pool.size;
  // Add Variable To Stack
  stack.set(data.name, reference);
  // Default Variable Data
  const defaultValue = {
    mainScope: false,
    global: false,
    parameter: false,
    exported: false,
    import: false,
    wasmImport: false,
    used: false,
    baseType: undefined,
  };
  // Add Variable To Pool
  pool.set(reference, { ...defaultValue, ...data, reference: reference });
  return reference;
};
/**
 * Gives You A Reference To The Pool For The Current Variable
 *
 * @param  {VariableNode} variable The Variable You Want A Reference To
 * @returns A Reference To The Variable In The Pool
 */
export const _getVariableReference = (variable: VariableNode): number => variable.reference!;
/**
 * Gives You A Reference To The Pool For The Current Variable
 *
 * @param  {string} rawProgram The Raw Program String
 * @param  {VariableNode} variable The Variable You Want A Reference To
 * @param  {VariableContainer} VariableContainer The Program Variable State
 * @returns A Reference To The Variable In The Pool
 */
export const getVariableReference = (
  rawProgram: string,
  variable: VariableNode,
  { stack, stacks }: VariableContainer
): number => {
  // Do The Simple Check
  if (variable.reference != undefined) return _getVariableReference(variable);
  // Now To Search
  const parentStack = [...stacks, stack].reverse().find((s) => s.has(variable.name));
  // Error if not found
  if (parentStack == undefined)
    return BriskReferenceError(rawProgram, BriskErrorType.VariableNotFound, [], variable.position);
  // Get Reference
  return parentStack.get(variable.name)!;
};
/**
 * Gets A Variable From The Pool
 *
 * @param  {VariableMap} pool Variable Pool
 * @param  {VariableNode} variable The Variable You Want A Reference To
 *
 * @returns The Data Of The Given Variable
 */
export const getVariable = (pool: VariableMap, variable: VariableNode): Required<VariableData> => {
  // Get Reference
  const reference = _getVariableReference(variable);
  // Get Variable Data
  const value = pool.get(reference)!;
  // Return Variable Data
  return value;
};
/**
 * Mutates A Variable in the Pool
 *
 * @param  {VariableMap} pool Variable Pool
 * @param  {VariableNode} variable The Variable You Want A Reference To
 * @param  {Partial<VariableInfo>} data The Data You Want To Mutate
 *
 * @returns A Reference To The Variable
 */
export const setVariable = (
  pool: VariableMap,
  variable: VariableNode,
  data: Partial<VariableInfo>
): number => {
  // Get A Reference
  const reference = _getVariableReference(variable);
  // Get Variable Data
  const value = getVariable(pool, variable);
  // Set Variable
  pool.set(reference, { ...value, ...data });
  // Return Reference
  return reference;
};
// TypeVariables
/**
 * Creates A new Type And Puts It On The Stack
 *
 * @param  {string} rawProgram The Raw Program String
 * @param  {TypeMap} pool Type Pool
 * @param  {TypeStack} stack Type Stack
 * @param  {TypeInfo} data Type Info
 * @param  {Position} pos The Current Node Position
 *
 * @returns A Reference To The Type In The Pool
 */
export const createType = (
  rawProgram: string,
  pool: TypeMap,
  stack: TypeStack,
  data: TypeInfo,
  pos: Position
): number => {
  // Prevent Writing Over The Primitive Types
  if ((<Set<string>>primTypes).has(data.name))
    BriskError(rawProgram, BriskErrorType.InvalidTypeName, [data.name], pos);
  // Check If Type Already Exists On Stack
  if (stack.has(data.name))
    BriskReferenceError(rawProgram, BriskErrorType.TypeHasAlreadyBeenDeclared, [data.name], pos);
  // Create Reference To Pool
  const reference = pool.size;
  // Add Type To Stack
  stack.set(data.name, reference);
  // Add Type To Pool
  pool.set(reference, { ...data, reference: reference });
  return reference;
};
/**
 * Gives You A Reference To The Pool For The Current Type
 *
 * @param  {TypeNode} type The Type You Want A Reference To
 * @returns A Reference To The Type In The Pool
 */
export const _getTypeReference = (type: TypeNode): number => type.reference!;
/**
 * Gives You A Reference To The Pool For The Current Type
 *
 * @param  {string} rawProgram The Raw Program String
 * @param  {TypeNode} type The Type You Want A Reference To
 * @param  {TypeContainer} TypeContainer The Program Type State
 * @returns A Reference To The Type In The Pool
 */
export const getTypeReference = (
  rawProgram: string,
  type: TypeNode,
  { stack, stacks }: TypeContainer
): number => {
  // Do The Simple Check
  if (type.reference != undefined) return _getTypeReference(type);
  // Now To Search
  const parentStack = [...stacks, stack].reverse().find((s) => s.has(type.name));
  // Error if not found
  if (parentStack == undefined)
    return BriskReferenceError(rawProgram, BriskErrorType.VariableNotFound, [], type.position);
  // Get Reference
  return parentStack.get(type.name)!;
};
/**
 * Gets A type From The Pool
 *
 * @param  {TypeMap} pool type Pool
 * @param  {TypeNode} type The type You Want A Reference To
 *
 * @returns The Data Of The Given type
 */
export const getType = (pool: TypeMap, type: TypeNode): TypeData => {
  // Get Reference
  const reference = _getTypeReference(type);
  // Get type Data
  const value = pool.get(reference)!;
  // Return type Data
  return value;
};
/**
 * Mutates A Type in the Pool
 *
 * @param  {TypeMap} pool Type Pool
 * @param  {TypeNode} type The Type You Want A Reference To
 * @param  {Partial<TypeInfo>} data The Data You Want To Mutate
 *
 * @returns A Reference To The Type
 */
export const setType = (pool: TypeMap, type: TypeNode, data: Partial<TypeInfo>): number => {
  // Get A Reference
  const reference = _getTypeReference(type);
  // Get Variable Data
  const value = getType(pool, type);
  // Set Variable
  pool.set(reference, { ...value, ...data });
  // Return Reference
  return reference;
};
