@preprocessor typescript
# Lexer
@{%
import Lexer from '../Lexer/Lexer';
import * as Nodes from './Types';
const lexer = Lexer();
%}
@lexer lexer
# General
main -> StatementList {%
  (data): Nodes.ProgramNode => {
    return {
      type: 'Program',
      body: data[0],
      position: {
        offset: 0,
        line: 0,
        col: 0
      }
    }
  }
%}
# Statements
StatementList -> Statement | StatementList Statement {%
  (data): Nodes.Statement[] => {
    const [ statementList, statement ] = data.filter(n => n);
    return [ ...statementList, statement ];
  }
%}
Statement -> (StatementCommand | StatementInfo) {% 
  (data): Nodes.Statement => data[0][0]
%}
  
StatementCommand -> 
  (ImportStatement | ImportWasmStatement | ExportStatement | DeclarationStatement | CallStatement | BlockStatement) %Token_semicolon wss {% 
  (data): Nodes.Statement => data[0][0]
%}
StatementInfo -> (FlagStatement | CommentStatement) wss {% 
  (data): Nodes.Statement => data[0][0]
%}
# StatementTypes
ImportStatement -> 
  %Token_import %Token_ws %Token_identifier %Token_ws %Token_from %Token_ws %Token_string {%
  (data): Nodes.ImportStatementNode => {
    const [ _, __, identifier, ___, ____, _____, path ] = data;
    return {
      type: 'importStatement',
      identifier: identifier.value,
      path: path.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col
      }
    }
  }
%}
ImportWasmStatement -> 
  %Token_import %Token_ws %Token_wasm %Token_ws %Token_identifier wss %Token_colon wss Type %Token_ws %Token_from %Token_ws %Token_string {%
  (data): Nodes.ImportWasmStatementNode => {
    const [ _, __, ___, ____, identifier, _____, dataType, ______, _______, ________, path ] = data.filter(n => n);
    return {
      type: 'importWasmStatement',
      dataType: dataType.value,
      identifier: identifier.value,
      path: path.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col
      }
    }
  }
%}
ExportStatement -> 
  %Token_export %Token_ws %Token_identifier {%
  (data): Nodes.ExportStatementNode => {
    const [ _, __, identifier ] = data;
    return {
      type: 'exportStatement',
      identifier: identifier.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col
      }
    }
  }
%}
DeclarationStatement -> 
  %Token_let %Token_ws %Token_identifier wss %Token_colon wss Type wss %Token_equal wss Expression {%
  (data): Nodes.DeclarationStatementNode => {
    const [ start, __, identifier, ___, dataType, ____, value ] = data.filter(n => n);
    return {
      type: 'declarationStatement',
      dataType: dataType.value,
      identifier: identifier.value,
      value: value,
      position: {
        offset: start.offset,
        line: start.line,
        col: start.col
      }
    }
  }
%}
CallStatement -> 
 %Token_identifier wss Arguments {%
  (data): Nodes.CallStatementNode => {
    const [ identifier, args ] = data.filter(n => n);
    return {
      type: 'callStatement',
      identifier: <string>identifier.value,
      arguments: args,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col
      }
    }
  }
%}
FlagStatement -> 
  %Token_flag {%
  (data): Nodes.FlagStatementNode => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'flagStatement',
      value: value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
CommentStatement -> 
  %Token_comment {%
  (data): Nodes.CommentStatementNode => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'commentStatement',
      value: value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
BlockStatement -> 
  %Token_left_bracket wss %Token_right_bracket {% (data): Nodes.Statement[] => [] %} |
  %Token_left_bracket wss StatementList wss %Token_right_bracket {% 
  (data): Nodes.BlockStatementNode => {
    const { value, offset, line, col } = data.filter(n => n)[0].position;
    return {
      type: 'blockStatement',
      body: data.filter(n => n)[1],
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
# Arguments
Arguments -> 
  %Token_left_paren wss %Token_right_paren {% (): Nodes.ExpressionNode[] => [] %} |
  %Token_left_paren wss ExpressionList wss %Token_right_paren {% 
  (data): Nodes.ExpressionNode[] => data.filter(n => n)[1]
%}
# Expression
ExpressionList -> Expression | ExpressionList wss %Token_comma wss Expression {%
  (data): Nodes.ExpressionNode[] => {
    const [ expressionList, _, expression ] = data.filter(n => n);
    return [ ...expressionList, expression ];
  }
%}
Expression -> (Atom | CallStatement | Variable) {% (data): Nodes.ExpressionNode => data[0][0] %}
# Atom
Variable -> %Token_identifier {%
  (data): Nodes.VariableNode => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'variable',
      identifier: value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
Atom -> (String | Number | Boolean | FunctionDeclaration) {% (data) => data[0][0] %}
# Literals
String -> %Token_string {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'literal',
      dataType: 'String',
      value: <string>value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
Number -> %Token_number {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'literal',
      dataType: 'Number',
      value: <number>value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
Boolean -> %Token_boolean {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col } = data[0];
    return {
      type: 'literal',
      dataType: 'Boolean',
      value: <boolean>value,
      position: {
        offset: offset,
        line: line,
        col: col
      }
    }
  }
%}
# Function
FunctionDeclaration -> 
  FunctionParameters wss %Token_colon wss Type wss %Token_thick_arrow wss FunctionBody {%
  (data): Nodes.FunctionDeclarationNode => {
    const [ parameters, _, dataType, __, body ] = data.filter(n => n);
    return {
      type: 'functionDeclaration',
      dataType: dataType.value,
      parameters: parameters,
      body: body,
      position: {
        offset: dataType.offset,
        line: dataType.line,
        col: dataType.col
      }
    };
  }
%}
FunctionParameters ->
  %Token_left_paren wss %Token_right_paren {% (): Nodes.FunctionParameterNode[] => [] %} |
  %Token_left_paren wss FunctionParameterList wss %Token_right_paren {% 
  (data): Nodes.FunctionParameterNode[] => data.filter(n => n)[1]
%}
FunctionParameterList -> 
  FunctionParameter | FunctionParameterList wss %Token_comma wss FunctionParameter {%
  (data): Nodes.FunctionParameterNode[] => {
    const [ paramList, _, Param ] = data.filter(n => n);
    return [ ...paramList, Param ];
  }
%}
FunctionParameter -> %Token_identifier wss %Token_colon wss Type {%
  (data): Nodes.FunctionParameterNode => {
    const [ identifier, _, dataType ] = data.filter(n => n);
    return {
      type: 'functionParameter',
      dataType: dataType.value,
      identifier: <string>identifier!.value,
      position: {
        offset: identifier!.offset,
        line: identifier!.line,
        col: identifier!.col
      }
    }
  }
%}
FunctionBody ->
  Expression {% (data): Nodes.Statement[] => [data[0]] %} |
  %Token_left_bracket wss %Token_right_bracket {% (data): Nodes.Statement[] => [] %} |
  %Token_left_bracket wss StatementList wss %Token_right_bracket {% 
  (data): Nodes.Statement[] => data.filter(n => n)[1]
%}
# Types
TypeList -> Type | TypeList wss %Token_comma wss Type {%
  (data): Nodes.TypeNode[] => {
    const [ typeList, _, type ] = data.filter(n => n);
    return [ ...typeList, type ];
  }
%}
Type -> (FunctionType | %Token_identifier) {% (data) => data[0][0] %}
FunctionType -> FunctionTypeParam wss %Token_arrow wss Type {%
  (data): Nodes.FuncTypeNode => {
    const [ params, _, result ] = data.filter(n => n);
    return {
      value: {
        type: 'functionType',
        params: params.map((n: any) => n.value),
        result: result.value
      }
    }
  }
%}
FunctionTypeParam -> 
  %Token_left_paren wss %Token_right_paren {% () => [] %}|
  %Token_left_paren wss TypeList wss %Token_right_paren {%
  (data): Nodes.TypeNode[] => {
    const TypeList = data.filter(n => n)[1];
    return TypeList;
  }
%}
# Random
wss  -> %Token_ws:* {% (d) => null %}