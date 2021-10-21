// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var Tkn_semicolon: any;
declare var Tkn_import: any;
declare var Tkn_ws: any;
declare var Tkn_identifier: any;
declare var Tkn_from: any;
declare var Tkn_str: any;
declare var Tkn_wasm: any;
declare var Tkn_colon: any;
declare var Tkn_export: any;
declare var Tkn_let: any;
declare var Tkn_equal: any;
declare var Tkn_flag: any;
declare var Tkn_comment: any;
declare var Tkn_l_bracket: any;
declare var Tkn_r_bracket: any;
declare var Tkn_l_paren: any;
declare var Tkn_r_paren: any;
declare var Tkn_comma: any;
declare var Tkn_number: any;
declare var Tkn_bool: any;
declare var Tkn_thick_arrow: any;
declare var Tkn_arrow: any;

import path from 'path';
import Lexer from '../Lexer/Lexer';
import * as Nodes from '../../Types';
const lexer = new Lexer('stub');

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
        (data): Nodes.Program => {
          const programFlags: Nodes.FlagStatementNode[] = [];
          for (const node of data[0]) {
            if (node.type != Nodes.ParseTreeNodeType.flagStatement) break;
            programFlags.push(node);
          }
          return {
            type: Nodes.ParseTreeNodeType.Program,
            flags: programFlags,
            body: data[0],
            exports: [],
            imports: [],
            position: {
              offset: 0,
              line: 0,
              col: 0,
              file: data[0][0].position.file
            }
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
    {"name": "StatementCommand$subexpression$1", "symbols": ["ImportWasmStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["ExportStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["DeclarationStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["CallStatement"]},
    {"name": "StatementCommand$subexpression$1", "symbols": ["BlockStatement"]},
    {"name": "StatementCommand", "symbols": ["StatementCommand$subexpression$1", (lexer.has("Tkn_semicolon") ? {type: "Tkn_semicolon"} : Tkn_semicolon), "wss"], "postprocess":  
        (data): Nodes.Statement => data[0][0]
        },
    {"name": "StatementInfo$subexpression$1", "symbols": ["FlagStatement"]},
    {"name": "StatementInfo$subexpression$1", "symbols": ["CommentStatement"]},
    {"name": "StatementInfo", "symbols": ["StatementInfo$subexpression$1", "wss"], "postprocess":  
        (data): Nodes.Statement => data[0][0]
        },
    {"name": "ImportStatement", "symbols": [(lexer.has("Tkn_import") ? {type: "Tkn_import"} : Tkn_import), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_from") ? {type: "Tkn_from"} : Tkn_from), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_str") ? {type: "Tkn_str"} : Tkn_str)], "postprocess": 
        (data): Nodes.ImportStatementNode => {
          const [ _, __, identifier, ___, ____, _____, p ] = data;
          return {
            type: Nodes.ParseTreeNodeType.importStatement,
            identifier: identifier.value,
            path: path.join(path.parse(identifier.file).dir, path.parse(p.value).ext == '' ? `${p.value}.br` : p.value),
            position: {
              offset: identifier.offset,
              line: identifier.line,
              col: identifier.col,
              file: identifier.file
            }
          }
        }
        },
    {"name": "ImportWasmStatement", "symbols": [(lexer.has("Tkn_import") ? {type: "Tkn_import"} : Tkn_import), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_wasm") ? {type: "Tkn_wasm"} : Tkn_wasm), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier), "wss", (lexer.has("Tkn_colon") ? {type: "Tkn_colon"} : Tkn_colon), "wss", "Type", (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_from") ? {type: "Tkn_from"} : Tkn_from), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_str") ? {type: "Tkn_str"} : Tkn_str)], "postprocess": 
        (data): Nodes.ImportWasmStatementNode => {
          const [ _, __, ___, ____, identifier, _____, dataType, ______, _______, ________, p ] = data.filter(n => n);
          return {
            type: Nodes.ParseTreeNodeType.importWasmStatement,
            dataType: dataType.value,
            identifier: identifier.value,
            path: p.value,
            position: {
              offset: identifier.offset,
              line: identifier.line,
              col: identifier.col,
              file: identifier.file
            }
          }
        }
        },
    {"name": "ExportStatement", "symbols": [(lexer.has("Tkn_export") ? {type: "Tkn_export"} : Tkn_export), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier)], "postprocess": 
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
        },
    {"name": "DeclarationStatement", "symbols": [(lexer.has("Tkn_let") ? {type: "Tkn_let"} : Tkn_let), (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws), (lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier), "wss", (lexer.has("Tkn_colon") ? {type: "Tkn_colon"} : Tkn_colon), "wss", "Type", "wss", (lexer.has("Tkn_equal") ? {type: "Tkn_equal"} : Tkn_equal), "wss", "Expression"], "postprocess": 
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
        },
    {"name": "CallStatement", "symbols": [(lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier), "wss", "Arguments"], "postprocess": 
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
        },
    {"name": "FlagStatement", "symbols": [(lexer.has("Tkn_flag") ? {type: "Tkn_flag"} : Tkn_flag)], "postprocess": 
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
        },
    {"name": "CommentStatement", "symbols": [(lexer.has("Tkn_comment") ? {type: "Tkn_comment"} : Tkn_comment)], "postprocess": 
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
        },
    {"name": "BlockStatement", "symbols": [(lexer.has("Tkn_l_bracket") ? {type: "Tkn_l_bracket"} : Tkn_l_bracket), "wss", (lexer.has("Tkn_r_bracket") ? {type: "Tkn_r_bracket"} : Tkn_r_bracket)], "postprocess": (data): Nodes.Statement[] => []},
    {"name": "BlockStatement", "symbols": [(lexer.has("Tkn_l_bracket") ? {type: "Tkn_l_bracket"} : Tkn_l_bracket), "wss", "StatementList", "wss", (lexer.has("Tkn_r_bracket") ? {type: "Tkn_r_bracket"} : Tkn_r_bracket)], "postprocess":  
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
        },
    {"name": "Arguments", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess": (): Nodes.ExpressionNode[] => []},
    {"name": "Arguments", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", "ExpressionList", "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess":  
        (data): Nodes.ExpressionNode[] => data.filter(n => n)[1]
        },
    {"name": "ExpressionList", "symbols": ["Expression"]},
    {"name": "ExpressionList", "symbols": ["ExpressionList", "wss", (lexer.has("Tkn_comma") ? {type: "Tkn_comma"} : Tkn_comma), "wss", "Expression"], "postprocess": 
        (data): Nodes.ExpressionNode[] => {
          const [ expressionList, _, expression ] = data.filter(n => n);
          return [ ...expressionList, expression ];
        }
        },
    {"name": "Expression$subexpression$1", "symbols": ["Atom"]},
    {"name": "Expression$subexpression$1", "symbols": ["CallStatement"]},
    {"name": "Expression$subexpression$1", "symbols": ["Variable"]},
    {"name": "Expression", "symbols": ["Expression$subexpression$1"], "postprocess": (data): Nodes.ExpressionNode => data[0][0]},
    {"name": "Variable", "symbols": [(lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier)], "postprocess": 
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
        },
    {"name": "Atom$subexpression$1", "symbols": ["String"]},
    {"name": "Atom$subexpression$1", "symbols": ["Number"]},
    {"name": "Atom$subexpression$1", "symbols": ["Boolean"]},
    {"name": "Atom$subexpression$1", "symbols": ["FunctionDeclaration"]},
    {"name": "Atom", "symbols": ["Atom$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "String", "symbols": [(lexer.has("Tkn_str") ? {type: "Tkn_str"} : Tkn_str)], "postprocess": 
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
        },
    {"name": "Number", "symbols": [(lexer.has("Tkn_number") ? {type: "Tkn_number"} : Tkn_number)], "postprocess": 
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
        },
    {"name": "Boolean", "symbols": [(lexer.has("Tkn_bool") ? {type: "Tkn_bool"} : Tkn_bool)], "postprocess": 
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
        },
    {"name": "FunctionDeclaration", "symbols": ["FunctionParameters", "wss", (lexer.has("Tkn_colon") ? {type: "Tkn_colon"} : Tkn_colon), "wss", "Type", "wss", (lexer.has("Tkn_thick_arrow") ? {type: "Tkn_thick_arrow"} : Tkn_thick_arrow), "wss", "FunctionBody"], "postprocess": 
        (data): Nodes.FunctionNode => {
          const [ parameters, _, dataType, __, body ] = data.filter(n => n);
          const FunctionFlags: Nodes.FlagStatementNode[] = [];
          for (const node of body) {
            if (node.type != Nodes.ParseTreeNodeType.flagStatement) break;
            FunctionFlags.push(node);
          }
          // Generate more detailed Node
          return {
            type: Nodes.ParseTreeNodeType.functionNode,
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
        },
    {"name": "FunctionParameters", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess": (): Nodes.FunctionParameterNode[] => []},
    {"name": "FunctionParameters", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", "FunctionParameterList", "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess":  
        (data): Nodes.FunctionParameterNode[] => data.filter(n => n)[1]
        },
    {"name": "FunctionParameterList", "symbols": ["FunctionParameter"]},
    {"name": "FunctionParameterList", "symbols": ["FunctionParameterList", "wss", (lexer.has("Tkn_comma") ? {type: "Tkn_comma"} : Tkn_comma), "wss", "FunctionParameter"], "postprocess": 
        (data): Nodes.FunctionParameterNode[] => {
          const [ paramList, _, Param ] = data.filter(n => n);
          return [ ...paramList, Param ];
        }
        },
    {"name": "FunctionParameter", "symbols": [(lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier), "wss", (lexer.has("Tkn_colon") ? {type: "Tkn_colon"} : Tkn_colon), "wss", "Type"], "postprocess": 
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
        },
    {"name": "FunctionBody", "symbols": ["Expression"], "postprocess": (data): Nodes.Statement[] => [data[0]]},
    {"name": "FunctionBody", "symbols": [(lexer.has("Tkn_l_bracket") ? {type: "Tkn_l_bracket"} : Tkn_l_bracket), "wss", (lexer.has("Tkn_r_bracket") ? {type: "Tkn_r_bracket"} : Tkn_r_bracket)], "postprocess": (data): Nodes.Statement[] => []},
    {"name": "FunctionBody", "symbols": [(lexer.has("Tkn_l_bracket") ? {type: "Tkn_l_bracket"} : Tkn_l_bracket), "wss", "StatementList", "wss", (lexer.has("Tkn_r_bracket") ? {type: "Tkn_r_bracket"} : Tkn_r_bracket)], "postprocess":  
        (data): Nodes.Statement[] => data.filter(n => n)[1]
        },
    {"name": "TypeList", "symbols": ["Type"]},
    {"name": "TypeList", "symbols": ["TypeList", "wss", (lexer.has("Tkn_comma") ? {type: "Tkn_comma"} : Tkn_comma), "wss", "Type"], "postprocess": 
        (data): Nodes.TypeNode[] => {
          const [ typeList, _, type ] = data.filter(n => n);
          return [ ...typeList, type ];
        }
        },
    {"name": "Type$subexpression$1", "symbols": ["FunctionType"]},
    {"name": "Type$subexpression$1", "symbols": [(lexer.has("Tkn_identifier") ? {type: "Tkn_identifier"} : Tkn_identifier)]},
    {"name": "Type", "symbols": ["Type$subexpression$1"], "postprocess": (data) => data[0][0]},
    {"name": "FunctionType", "symbols": ["FunctionTypeParam", "wss", (lexer.has("Tkn_arrow") ? {type: "Tkn_arrow"} : Tkn_arrow), "wss", "Type"], "postprocess": 
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
        },
    {"name": "FunctionTypeParam", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess": () => []},
    {"name": "FunctionTypeParam", "symbols": [(lexer.has("Tkn_l_paren") ? {type: "Tkn_l_paren"} : Tkn_l_paren), "wss", "TypeList", "wss", (lexer.has("Tkn_r_paren") ? {type: "Tkn_r_paren"} : Tkn_r_paren)], "postprocess": 
        (data): Nodes.TypeNode[] => {
          const TypeList = data.filter(n => n)[1];
          return TypeList;
        }
        },
    {"name": "wss$ebnf$1", "symbols": []},
    {"name": "wss$ebnf$1", "symbols": ["wss$ebnf$1", (lexer.has("Tkn_ws") ? {type: "Tkn_ws"} : Tkn_ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "wss", "symbols": ["wss$ebnf$1"], "postprocess": (d) => null}
  ],
  ParserStart: "main",
};

export default grammar;
