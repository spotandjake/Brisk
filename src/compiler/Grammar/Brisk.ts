// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var Token_semicolon: any;
declare var Token_import: any;
declare var Token_ws: any;
declare var Token_identifier: any;
declare var Token_from: any;
declare var Token_string: any;
declare var Token_export: any;
declare var Token_let: any;
declare var Token_colon: any;
declare var Token_equal: any;
declare var Token_flag: any;
declare var Token_comment: any;
declare var Token_left_paren: any;
declare var Token_right_paren: any;
declare var Token_comma: any;
declare var Token_number: any;
declare var Token_boolean: any;
declare var Token_arrow: any;
declare var Token_left_bracket: any;
declare var Token_right_bracket: any;

import Lexer from '../Lexer/Moo-Lexer';
import * as Nodes from './Types';
const lexer = Lexer();

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main", "symbols": ["StatementList"], "postprocess": 
        (data): Nodes.ProgramNode => {
          return {
            type: 'Program',
            body: data[0]
          }
        }
        },
    {"name": "StatementList", "symbols": ["Statement"]},
    {"name": "StatementList", "symbols": ["StatementList", "Statement"], "postprocess": 
        (data): Nodes.Statement[] => {
          const [ statementList, statement ] = data.filter(n => n);
          return [ ...statementList, statement ];
        }
        },
    {"name": "Statement$subexpression$1", "symbols": ["StatementCommand"]},
    {"name": "Statement$subexpression$1", "symbols": ["StatementInfo"]},
    {"name": "Statement", "symbols": ["Statement$subexpression$1"], "postprocess":  
        (data): Nodes.Statement => data[0][0]
        },
    {"name": "StatementCommand$subexpression$1", "symbols": ["ImportStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["ExportStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["DeclarationStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["CallStatement"]},
    {"name": "StatementCommand", "symbols": ["StatementCommand$subexpression$1", (lexer.has("Token_semicolon") ? {type: "Token_semicolon"} : Token_semicolon), "wss"], "postprocess":  
        (data): Nodes.Statement => data[0][0]
        },
    {"name": "StatementInfo$subexpression$1", "symbols": ["FlagStatement"]},
    {"name": "StatementInfo$subexpression$1", "symbols": ["CommentStatement"]},
    {"name": "StatementInfo", "symbols": ["StatementInfo$subexpression$1", "wss"], "postprocess":  
        (data): Nodes.Statement => data[0][0]
        },
    {"name": "ImportStatement", "symbols": [(lexer.has("Token_import") ? {type: "Token_import"} : Token_import), (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws), (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws), (lexer.has("Token_from") ? {type: "Token_from"} : Token_from), (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws), (lexer.has("Token_string") ? {type: "Token_string"} : Token_string)], "postprocess": 
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
        },
    {"name": "ExportStatement", "symbols": [(lexer.has("Token_export") ? {type: "Token_export"} : Token_export), (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws), (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier)], "postprocess": 
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
        },
    {"name": "DeclarationStatement", "symbols": [(lexer.has("Token_let") ? {type: "Token_let"} : Token_let), (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws), (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), "wss", (lexer.has("Token_colon") ? {type: "Token_colon"} : Token_colon), "wss", (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), "wss", (lexer.has("Token_equal") ? {type: "Token_equal"} : Token_equal), "wss", "Expression"], "postprocess": 
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
        },
    {"name": "CallStatement", "symbols": [(lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), "wss", "Arguments"], "postprocess": 
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
        },
    {"name": "FlagStatement", "symbols": [(lexer.has("Token_flag") ? {type: "Token_flag"} : Token_flag)], "postprocess": 
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
        },
    {"name": "CommentStatement", "symbols": [(lexer.has("Token_comment") ? {type: "Token_comment"} : Token_comment)], "postprocess": 
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
        },
    {"name": "Arguments", "symbols": [(lexer.has("Token_left_paren") ? {type: "Token_left_paren"} : Token_left_paren), "wss", (lexer.has("Token_right_paren") ? {type: "Token_right_paren"} : Token_right_paren)], "postprocess": (): Nodes.ExpressionNode[] => []},
    {"name": "Arguments", "symbols": [(lexer.has("Token_left_paren") ? {type: "Token_left_paren"} : Token_left_paren), "wss", "ExpressionList", "wss", (lexer.has("Token_right_paren") ? {type: "Token_right_paren"} : Token_right_paren)], "postprocess":  
        (data): Nodes.ExpressionNode[] => data.filter(n => n)[1]
        },
    {"name": "ExpressionList", "symbols": ["Expression"]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "wss", (lexer.has("Token_comma") ? {type: "Token_comma"} : Token_comma), "wss", "Expression"], "postprocess": 
        (data): Nodes.ExpressionNode[] => {
          const [ expressionList, _, expression ] = data.filter(n => n);
          return [ ...expressionList, expression ];
        }
        },
    {"name": "Expression$subexpression$1", "symbols": ["Atom"]},
    {"name": "Expression$subexpression$1", "symbols": ["CallStatement"]},
    {"name": "Expression$subexpression$1", "symbols": ["Variable"]},
    {"name": "Expression", "symbols": ["Expression$subexpression$1"], "postprocess": (data): Nodes.ExpressionNode => data[0][0]},
    {"name": "Variable", "symbols": [(lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier)], "postprocess": 
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
        },
    {"name": "Atom$subexpression$1", "symbols": ["String"]},
    {"name": "Atom$subexpression$1", "symbols": ["Number"]},
    {"name": "Atom$subexpression$1", "symbols": ["Boolean"]},
    {"name": "Atom$subexpression$1", "symbols": ["FunctionDeclaration"]},
    {"name": "Atom", "symbols": ["Atom$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "String", "symbols": [(lexer.has("Token_string") ? {type: "Token_string"} : Token_string)], "postprocess": 
        (data: Nodes.mooNode[]): Nodes.LiteralNode  => {
          const { value, offset, line, col } = data[0];
          return {
            type: 'literal',
            dataType: 'string',
            value: <string>value,
            position: {
              offset: offset,
              line: line,
              col: col
            }
          }
        }
        },
    {"name": "Number", "symbols": [(lexer.has("Token_number") ? {type: "Token_number"} : Token_number)], "postprocess": 
        (data: Nodes.mooNode[]): Nodes.LiteralNode  => {
          const { value, offset, line, col } = data[0];
          return {
            type: 'literal',
            dataType: 'number',
            value: <number>value,
            position: {
              offset: offset,
              line: line,
              col: col
            }
          }
        }
        },
    {"name": "Boolean", "symbols": [(lexer.has("Token_boolean") ? {type: "Token_boolean"} : Token_boolean)], "postprocess": 
        (data: Nodes.mooNode[]): Nodes.LiteralNode  => {
          const { value, offset, line, col } = data[0];
          return {
            type: 'literal',
            dataType: 'boolean',
            value: <boolean>value,
            position: {
              offset: offset,
              line: line,
              col: col
            }
          }
        }
        },
    {"name": "FunctionDeclaration", "symbols": ["FunctionParameters", "wss", (lexer.has("Token_colon") ? {type: "Token_colon"} : Token_colon), "wss", (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), "wss", (lexer.has("Token_arrow") ? {type: "Token_arrow"} : Token_arrow), "wss", "FunctionBody"], "postprocess": 
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
        },
    {"name": "FunctionParameters", "symbols": [(lexer.has("Token_left_paren") ? {type: "Token_left_paren"} : Token_left_paren), "wss", (lexer.has("Token_right_paren") ? {type: "Token_right_paren"} : Token_right_paren)], "postprocess": (): Nodes.FunctionParameterNode[] => []},
    {"name": "FunctionParameters", "symbols": [(lexer.has("Token_left_paren") ? {type: "Token_left_paren"} : Token_left_paren), "wss", "FunctionParameterList", "wss", (lexer.has("Token_right_paren") ? {type: "Token_right_paren"} : Token_right_paren)], "postprocess":  
        (data): Nodes.FunctionParameterNode[] => data.filter(n => n)[1]
        },
    {"name": "FunctionParameterList", "symbols": ["FunctionParameter"]},
    {"name": "FunctionParameterList", "symbols": ["FunctionParameterList", "wss", (lexer.has("Token_comma") ? {type: "Token_comma"} : Token_comma), "wss", "FunctionParameter"], "postprocess": 
        (data): Nodes.FunctionParameterNode[] => {
          const [ paramList, _, Param ] = data.filter(n => n);
          return [ ...paramList, Param ];
        }
        },
    {"name": "FunctionParameter", "symbols": [(lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier), "wss", (lexer.has("Token_colon") ? {type: "Token_colon"} : Token_colon), "wss", (lexer.has("Token_identifier") ? {type: "Token_identifier"} : Token_identifier)], "postprocess": 
        (data: (null | Nodes.mooNode)[]): Nodes.FunctionParameterNode => {
          const [ identifier, _, dataType ] = data.filter(n => n);
          return {
            type: 'functionParameter',
            dataType: <string>dataType!.value,
            identifier: <string>identifier!.value,
            position: {
              offset: identifier!.offset,
              line: identifier!.line,
              col: identifier!.col
            }
          }
        }
        },
    {"name": "FunctionBody", "symbols": ["Expression"], "postprocess": (data): Nodes.Statement[] => [data[0]]},
    {"name": "FunctionBody", "symbols": [(lexer.has("Token_left_bracket") ? {type: "Token_left_bracket"} : Token_left_bracket), "wss", (lexer.has("Token_right_bracket") ? {type: "Token_right_bracket"} : Token_right_bracket)], "postprocess": (data): Nodes.Statement[] => []},
    {"name": "FunctionBody", "symbols": [(lexer.has("Token_left_bracket") ? {type: "Token_left_bracket"} : Token_left_bracket), "wss", "StatementList", "wss", (lexer.has("Token_right_bracket") ? {type: "Token_right_bracket"} : Token_right_bracket)], "postprocess":  
        (data): Nodes.Statement[] => data.filter(n => n)[1]
        },
    {"name": "wss$ebnf$1", "symbols": []},
    {"name": "wss$ebnf$1", "symbols": ["wss$ebnf$1", (lexer.has("Token_ws") ? {type: "Token_ws"} : Token_ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "wss", "symbols": ["wss$ebnf$1"], "postprocess": (d) => null}
  ],
  ParserStart: "main",
};

export default grammar;
