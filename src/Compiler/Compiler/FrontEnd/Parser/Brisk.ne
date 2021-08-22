@preprocessor typescript
# Lexer
@{%
import Lexer from '../Lexer/Lexer';
import * as Nodes from '../../Types';
const lexer = new Lexer('stub');
%}
@lexer lexer
# General
main -> StatementList {%
  (data): Nodes.ProgramNode => {
    const programFlags: Nodes.FlagStatementNode[] = [];
    for (const node of data[0]) {
      if (node.type != Nodes.ParseTreeNodeType.flagStatement) break;
      programFlags.push(node);
    }
    return {
      type: Nodes.ParseTreeNodeType.Program,
      flags: programFlags,
      body: data[0],
      position: {
        offset: 0,
        line: 0,
        col: 0,
        file: data[0][0].position.file
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
  (ImportStatement | ImportWasmStatement | ExportStatement | DeclarationStatement | CallStatement | BlockStatement) %Tkn_semicolon wss {% 
  (data): Nodes.Statement => data[0][0]
%}
StatementInfo -> (FlagStatement | CommentStatement) wss {% 
  (data): Nodes.Statement => data[0][0]
%}
# StatementTypes
ImportStatement -> 
  %Tkn_import %Tkn_ws %Tkn_identifier %Tkn_ws %Tkn_from %Tkn_ws %Tkn_string {%
  (data): Nodes.ImportStatementNode => {
    const [ _, __, identifier, ___, ____, _____, path ] = data;
    return {
      type: Nodes.ParseTreeNodeType.importStatement,
      identifier: identifier.value,
      path: path.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col,
        file: identifier.file
      }
    }
  }
%}
ImportWasmStatement -> 
  %Tkn_import %Tkn_ws %Tkn_wasm %Tkn_ws %Tkn_identifier wss %Tkn_colon wss Type %Tkn_ws %Tkn_from %Tkn_ws %Tkn_string {%
  (data): Nodes.ImportWasmStatementNode => {
    const [ _, __, ___, ____, identifier, _____, dataType, ______, _______, ________, path ] = data.filter(n => n);
    return {
      type: Nodes.ParseTreeNodeType.importWasmStatement,
      dataType: dataType.value,
      identifier: identifier.value,
      path: path.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col,
        file: identifier.file
      }
    }
  }
%}
ExportStatement -> 
  %Tkn_export %Tkn_ws %Tkn_identifier {%
  (data): Nodes.ExportStatementNode => {
    const [ _, __, identifier ] = data;
    return {
      type: Nodes.ParseTreeNodeType.exportStatement,
      identifier: identifier.value,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col,
        file: identifier.file
      }
    }
  }
%}
DeclarationStatement -> 
  %Tkn_let %Tkn_ws %Tkn_identifier wss %Tkn_colon wss Type wss %Tkn_equal wss Expression {%
  (data): Nodes.DeclarationStatementNode => {
    const [ start, __, identifier, ___, dataType, ____, value ] = data.filter(n => n);
    return {
      type: Nodes.ParseTreeNodeType.declarationStatement,
      dataType: dataType.value,
      identifier: identifier.value,
      value: value,
      position: {
        offset: start.offset,
        line: start.line,
        col: start.col,
        file: start.file
      }
    }
  }
%}
CallStatement -> 
 %Tkn_identifier wss Arguments {%
  (data): Nodes.CallStatementNode => {
    const [ identifier, args ] = data.filter(n => n);
    return {
      type: Nodes.ParseTreeNodeType.callStatement,
      identifier: <string>identifier.value,
      arguments: args,
      position: {
        offset: identifier.offset,
        line: identifier.line,
        col: identifier.col,
        file: identifier.file
      }
    }
  }
%}
FlagStatement -> 
  %Tkn_flag {%
  (data): Nodes.FlagStatementNode => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.flagStatement,
      value: value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
CommentStatement -> 
  %Tkn_comment {%
  (data): Nodes.CommentStatementNode => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.commentStatement,
      value: value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
BlockStatement -> 
  %Tkn_left_bracket wss %Tkn_right_bracket {% (data): Nodes.Statement[] => [] %} |
  %Tkn_left_bracket wss StatementList wss %Tkn_right_bracket {% 
  (data): Nodes.BlockStatementNode => {
    const { value, offset, line, col, file } = data.filter(n => n)[0].position;
    return {
      type: Nodes.ParseTreeNodeType.blockStatement,
      body: data.filter(n => n)[1],
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
# Arguments
Arguments -> 
  %Tkn_left_paren wss %Tkn_right_paren {% (): Nodes.ExpressionNode[] => [] %} |
  %Tkn_left_paren wss ExpressionList wss %Tkn_right_paren {% 
  (data): Nodes.ExpressionNode[] => data.filter(n => n)[1]
%}
# Expression
ExpressionList -> Expression | ExpressionList wss %Tkn_comma wss Expression {%
  (data): Nodes.ExpressionNode[] => {
    const [ expressionList, _, expression ] = data.filter(n => n);
    return [ ...expressionList, expression ];
  }
%}
Expression -> (Atom | CallStatement | Variable) {% (data): Nodes.ExpressionNode => data[0][0] %}
# Atom
Variable -> %Tkn_identifier {%
  (data): Nodes.VariableNode => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.variable,
      identifier: value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
Atom -> (String | Number | Boolean | FunctionDeclaration) {% (data) => data[0][0] %}
# Literals
String -> %Tkn_string {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.literal,
      dataType: 'String',
      value: <string>value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
Number -> %Tkn_number {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.literal,
      dataType: 'Number',
      value: <number>value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
Boolean -> %Tkn_boolean {%
  (data: Nodes.Token[]): Nodes.LiteralNode  => {
    const { value, offset, line, col, file } = data[0];
    return {
      type: Nodes.ParseTreeNodeType.literal,
      dataType: 'Boolean',
      value: <boolean>value,
      position: {
        offset: offset,
        line: line,
        col: col,
        file: file
      }
    }
  }
%}
# Function
FunctionDeclaration -> 
  FunctionParameters wss %Tkn_colon wss Type wss %Tkn_thick_arrow wss FunctionBody {%
  (data): Nodes.FunctionDeclarationNode => {
    const [ parameters, _, dataType, __, body ] = data.filter(n => n);
    const FunctionFlags: Nodes.FlagStatementNode[] = [];
    for (const node of body) {
      if (node.type != Nodes.ParseTreeNodeType.flagStatement) break;
      FunctionFlags.push(node);
    }
    // Generate more detailed Node
    return {
      type: Nodes.ParseTreeNodeType.functionDeclaration,
      dataType: dataType.value,
      flags: FunctionFlags,
      parameters: parameters,
      body: body,
      position: {
        offset: dataType.offset,
        line: dataType.line,
        col: dataType.col,
        file: dataType.file
      }
    };
  }
%}
FunctionParameters ->
  %Tkn_left_paren wss %Tkn_right_paren {% (): Nodes.FunctionParameterNode[] => [] %} |
  %Tkn_left_paren wss FunctionParameterList wss %Tkn_right_paren {% 
  (data): Nodes.FunctionParameterNode[] => data.filter(n => n)[1]
%}
FunctionParameterList -> 
  FunctionParameter | FunctionParameterList wss %Tkn_comma wss FunctionParameter {%
  (data): Nodes.FunctionParameterNode[] => {
    const [ paramList, _, Param ] = data.filter(n => n);
    return [ ...paramList, Param ];
  }
%}
FunctionParameter -> %Tkn_identifier wss %Tkn_colon wss Type {%
  (data): Nodes.FunctionParameterNode => {
    const [ identifier, _, dataType ] = data.filter(n => n);
    return {
      type: Nodes.ParseTreeNodeType.functionParameter,
      dataType: dataType.value,
      identifier: <string>identifier!.value,
      position: {
        offset: identifier!.offset,
        line: identifier!.line,
        col: identifier!.col,
        file: identifier!.file
      }
    }
  }
%}
FunctionBody ->
  Expression {% (data): Nodes.Statement[] => [data[0]] %} |
  %Tkn_left_bracket wss %Tkn_right_bracket {% (data): Nodes.Statement[] => [] %} |
  %Tkn_left_bracket wss StatementList wss %Tkn_right_bracket {% 
  (data): Nodes.Statement[] => data.filter(n => n)[1]
%}
# Types
TypeList -> Type | TypeList wss %Tkn_comma wss Type {%
  (data): Nodes.TypeNode[] => {
    const [ typeList, _, type ] = data.filter(n => n);
    return [ ...typeList, type ];
  }
%}
Type -> (FunctionType | %Tkn_identifier) {% (data) => data[0][0] %}
FunctionType -> FunctionTypeParam wss %Tkn_arrow wss Type {%
  (data): Nodes.FuncTypeNode => {
    const [ params, _, result ] = data.filter(n => n);
    return {
      value: {
        type: Nodes.ParseTreeNodeType.functionType,
        params: params.map((n: any) => n.value),
        result: result.value
      }
    }
  }
%}
FunctionTypeParam -> 
  %Tkn_left_paren wss %Tkn_right_paren {% () => [] %}|
  %Tkn_left_paren wss TypeList wss %Tkn_right_paren {%
  (data): Nodes.TypeNode[] => {
    const TypeList = data.filter(n => n)[1];
    return TypeList;
  }
%}
# Random
wss  -> %Tkn_ws:* {% (d) => null %}