'use strict';

var path = require('path');
var commander = require('commander');
var tslib = require('tslib');
var fs = require('fs');
var nearley = require('nearley');
var moo = require('moo');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var nearley__default = /*#__PURE__*/_interopDefaultLegacy(nearley);
var moo__namespace = /*#__PURE__*/_interopNamespace(moo);

let tokens = [
    {
        type: 'keyword',
        id: 'import',
        match: /import/
    },
    {
        type: 'keyword',
        id: 'from',
        match: /from/
    },
    {
        type: 'keyword',
        id: 'export',
        match: /export/
    },
    {
        type: 'keyword',
        id: 'let',
        match: /let/
    },
    {
        type: 'separator',
        id: 'left_paren',
        match: /\(/
    },
    {
        type: 'separator',
        id: 'right_paren',
        match: /\)/
    },
    {
        type: 'separator',
        id: 'left_bracket',
        match: /\{/
    },
    {
        type: 'separator',
        id: 'right_bracket',
        match: /\}/
    },
    {
        type: 'separator',
        id: 'comma',
        match: /,/
    },
    {
        type: 'separator',
        id: 'colon',
        match: /:/
    },
    {
        type: 'separator',
        id: 'semicolon',
        match: /;/
    },
    {
        type: 'separator',
        id: 'ws',
        match: /[ \t\s]+/,
        lineBreaks: true
    },
    {
        type: 'operator',
        id: 'arrow',
        match: /=>/
    },
    {
        type: 'operator',
        id: 'equal',
        match: /=/
    },
    {
        type: 'literal',
        id: 'string',
        match: /'.*'/,
        value: (text) => text.slice(1, text.length - 1)
    },
    {
        type: 'literal',
        id: 'number',
        match: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
        value: (text) => Number(text)
    },
    {
        type: 'literal',
        id: 'boolean',
        match: /(?:true|false)/,
        value: (text) => text == 'true'
    },
    {
        type: 'flag',
        id: 'flag',
        match: /@.*/,
        value: (text) => text.slice(1)
    },
    {
        type: 'comment',
        id: 'comment',
        match: /\/\/.*/,
        value: (text) => text.slice(2).trim()
    },
    {
        type: 'identifier',
        id: 'identifier',
        match: /[a-zA-Z$_][1-9a-zA-Z$_]*/
    },
];

const Lexer = () => {
    let mooTokens = {};
    tokens.forEach(({ id, match, lineBreaks, value }) => {
        mooTokens[`Token_${id}`] = { match, lineBreaks, value };
    });
    return moo__namespace.compile(mooTokens);
};

const lexer = Lexer();
const grammar = {
    Lexer: lexer,
    ParserRules: [
        { "name": "main", "symbols": ["StatementList"], "postprocess": (data) => {
                return {
                    type: 'Program',
                    body: data[0]
                };
            }
        },
        { "name": "StatementList", "symbols": ["Statement"] },
        { "name": "StatementList", "symbols": ["StatementList", "Statement"], "postprocess": (data) => {
                const [statementList, statement] = data.filter(n => n);
                return [...statementList, statement];
            }
        },
        { "name": "Statement$subexpression$1", "symbols": ["StatementCommand"] },
        { "name": "Statement$subexpression$1", "symbols": ["StatementInfo"] },
        { "name": "Statement", "symbols": ["Statement$subexpression$1"], "postprocess": (data) => data[0][0]
        },
        { "name": "StatementCommand$subexpression$1", "symbols": ["ImportStatement"] },
        { "name": "StatementCommand$subexpression$1", "symbols": ["ExportStatement"] },
        { "name": "StatementCommand$subexpression$1", "symbols": ["DeclarationStatement"] },
        { "name": "StatementCommand$subexpression$1", "symbols": ["CallStatement"] },
        { "name": "StatementCommand", "symbols": ["StatementCommand$subexpression$1", (lexer.has("Token_semicolon") ? { type: "Token_semicolon" } : Token_semicolon), "wss"], "postprocess": (data) => data[0][0]
        },
        { "name": "StatementInfo$subexpression$1", "symbols": ["FlagStatement"] },
        { "name": "StatementInfo$subexpression$1", "symbols": ["CommentStatement"] },
        { "name": "StatementInfo", "symbols": ["StatementInfo$subexpression$1", "wss"], "postprocess": (data) => data[0][0]
        },
        { "name": "ImportStatement", "symbols": [(lexer.has("Token_import") ? { type: "Token_import" } : Token_import), (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws), (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws), (lexer.has("Token_from") ? { type: "Token_from" } : Token_from), (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws), (lexer.has("Token_string") ? { type: "Token_string" } : Token_string)], "postprocess": (data) => {
                const [_, __, identifier, ___, ____, _____, path] = data;
                return {
                    type: 'importStatement',
                    identifier: identifier.value,
                    path: path.value,
                    position: {
                        offset: identifier.offset,
                        line: identifier.line,
                        col: identifier.col
                    }
                };
            }
        },
        { "name": "ExportStatement", "symbols": [(lexer.has("Token_export") ? { type: "Token_export" } : Token_export), (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws), (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier)], "postprocess": (data) => {
                const [_, __, identifier] = data;
                return {
                    type: 'exportStatement',
                    identifier: identifier.value,
                    position: {
                        offset: identifier.offset,
                        line: identifier.line,
                        col: identifier.col
                    }
                };
            }
        },
        { "name": "DeclarationStatement", "symbols": [(lexer.has("Token_let") ? { type: "Token_let" } : Token_let), (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws), (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), "wss", (lexer.has("Token_colon") ? { type: "Token_colon" } : Token_colon), "wss", (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), "wss", (lexer.has("Token_equal") ? { type: "Token_equal" } : Token_equal), "wss", "Expression"], "postprocess": (data) => {
                const [start, __, identifier, ___, dataType, ____, value] = data.filter(n => n);
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
                };
            }
        },
        { "name": "CallStatement", "symbols": [(lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), "wss", "Arguments"], "postprocess": (data) => {
                const [identifier, args] = data.filter(n => n);
                return {
                    type: 'callStatement',
                    identifier: identifier.value,
                    arguments: args,
                    position: {
                        offset: identifier.offset,
                        line: identifier.line,
                        col: identifier.col
                    }
                };
            }
        },
        { "name": "FlagStatement", "symbols": [(lexer.has("Token_flag") ? { type: "Token_flag" } : Token_flag)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'flagStatement',
                    value: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "CommentStatement", "symbols": [(lexer.has("Token_comment") ? { type: "Token_comment" } : Token_comment)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'commentStatement',
                    value: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "Arguments", "symbols": [(lexer.has("Token_left_paren") ? { type: "Token_left_paren" } : Token_left_paren), "wss", (lexer.has("Token_right_paren") ? { type: "Token_right_paren" } : Token_right_paren)], "postprocess": () => [] },
        { "name": "Arguments", "symbols": [(lexer.has("Token_left_paren") ? { type: "Token_left_paren" } : Token_left_paren), "wss", "ExpressionList", "wss", (lexer.has("Token_right_paren") ? { type: "Token_right_paren" } : Token_right_paren)], "postprocess": (data) => data.filter(n => n)[1]
        },
        { "name": "ExpressionList", "symbols": ["Expression"] },
        { "name": "ExpressionList", "symbols": ["ExpressionList", "wss", (lexer.has("Token_comma") ? { type: "Token_comma" } : Token_comma), "wss", "Expression"], "postprocess": (data) => {
                const [expressionList, _, expression] = data.filter(n => n);
                return [...expressionList, expression];
            }
        },
        { "name": "Expression$subexpression$1", "symbols": ["Atom"] },
        { "name": "Expression$subexpression$1", "symbols": ["CallStatement"] },
        { "name": "Expression$subexpression$1", "symbols": ["Variable"] },
        { "name": "Expression", "symbols": ["Expression$subexpression$1"], "postprocess": (data) => data[0][0] },
        { "name": "Variable", "symbols": [(lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'variable',
                    identifier: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "Atom$subexpression$1", "symbols": ["String"] },
        { "name": "Atom$subexpression$1", "symbols": ["Number"] },
        { "name": "Atom$subexpression$1", "symbols": ["Boolean"] },
        { "name": "Atom$subexpression$1", "symbols": ["FunctionDeclaration"] },
        { "name": "Atom", "symbols": ["Atom$subexpression$1"], "postprocess": (data) => data[0][0] },
        { "name": "String", "symbols": [(lexer.has("Token_string") ? { type: "Token_string" } : Token_string)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'literal',
                    dataType: 'string',
                    value: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "Number", "symbols": [(lexer.has("Token_number") ? { type: "Token_number" } : Token_number)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'literal',
                    dataType: 'number',
                    value: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "Boolean", "symbols": [(lexer.has("Token_boolean") ? { type: "Token_boolean" } : Token_boolean)], "postprocess": (data) => {
                const { value, offset, line, col } = data[0];
                return {
                    type: 'literal',
                    dataType: 'boolean',
                    value: value,
                    position: {
                        offset: offset,
                        line: line,
                        col: col
                    }
                };
            }
        },
        { "name": "FunctionDeclaration", "symbols": ["FunctionParameters", "wss", (lexer.has("Token_colon") ? { type: "Token_colon" } : Token_colon), "wss", (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), "wss", (lexer.has("Token_arrow") ? { type: "Token_arrow" } : Token_arrow), "wss", "FunctionBody"], "postprocess": (data) => {
                const [parameters, _, dataType, __, body] = data.filter(n => n);
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
        { "name": "FunctionParameters", "symbols": [(lexer.has("Token_left_paren") ? { type: "Token_left_paren" } : Token_left_paren), "wss", (lexer.has("Token_right_paren") ? { type: "Token_right_paren" } : Token_right_paren)], "postprocess": () => [] },
        { "name": "FunctionParameters", "symbols": [(lexer.has("Token_left_paren") ? { type: "Token_left_paren" } : Token_left_paren), "wss", "FunctionParameterList", "wss", (lexer.has("Token_right_paren") ? { type: "Token_right_paren" } : Token_right_paren)], "postprocess": (data) => data.filter(n => n)[1]
        },
        { "name": "FunctionParameterList", "symbols": ["FunctionParameter"] },
        { "name": "FunctionParameterList", "symbols": ["FunctionParameterList", "wss", (lexer.has("Token_comma") ? { type: "Token_comma" } : Token_comma), "wss", "FunctionParameter"], "postprocess": (data) => {
                const [paramList, _, Param] = data.filter(n => n);
                return [...paramList, Param];
            }
        },
        { "name": "FunctionParameter", "symbols": [(lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier), "wss", (lexer.has("Token_colon") ? { type: "Token_colon" } : Token_colon), "wss", (lexer.has("Token_identifier") ? { type: "Token_identifier" } : Token_identifier)], "postprocess": (data) => {
                const [identifier, _, dataType] = data.filter(n => n);
                return {
                    type: 'functionParameter',
                    dataType: dataType.value,
                    identifier: identifier.value,
                    position: {
                        offset: identifier.offset,
                        line: identifier.line,
                        col: identifier.col
                    }
                };
            }
        },
        { "name": "FunctionBody", "symbols": ["Expression"], "postprocess": (data) => [data[0]] },
        { "name": "FunctionBody", "symbols": [(lexer.has("Token_left_bracket") ? { type: "Token_left_bracket" } : Token_left_bracket), "wss", (lexer.has("Token_right_bracket") ? { type: "Token_right_bracket" } : Token_right_bracket)], "postprocess": (data) => [] },
        { "name": "FunctionBody", "symbols": [(lexer.has("Token_left_bracket") ? { type: "Token_left_bracket" } : Token_left_bracket), "wss", "StatementList", "wss", (lexer.has("Token_right_bracket") ? { type: "Token_right_bracket" } : Token_right_bracket)], "postprocess": (data) => data.filter(n => n)[1]
        },
        { "name": "wss$ebnf$1", "symbols": [] },
        { "name": "wss$ebnf$1", "symbols": ["wss$ebnf$1", (lexer.has("Token_ws") ? { type: "Token_ws" } : Token_ws)], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "wss", "symbols": ["wss$ebnf$1"], "postprocess": (d) => null }
    ],
    ParserStart: "main",
};

const getSymbolDisplay = (symbol, lsp) => {
    const type = typeof symbol;
    if (type === 'string')
        return symbol;
    else if (type === 'object' && symbol.literal)
        return JSON.stringify(symbol.literal);
    else if (type === 'object' && symbol instanceof RegExp)
        return `character matching ${symbol}`;
    else if (type === 'object' && symbol.hasOwnProperty('type')) {
        for (const token of tokens) {
            if (symbol.type == `Token_${token.id}`)
                return `character matching ${token.match.toString()}`;
        }
        if (!lsp)
            throw new Error(`Unknown symbol type: ${symbol}`);
        return '';
    }
    else if (!lsp)
        throw new Error(`Unknown symbol type: ${symbol}`);
};
const isTerminalSymbol = (symbol) => typeof symbol !== 'string';
const Parser = (filename, code, lsp = false) => {
    const parser = new nearley__default['default'].Parser(nearley__default['default'].Grammar.fromCompiled(grammar), { keepHistory: true });
    try {
        parser.feed(code);
        return parser.results[0];
    }
    catch (err) {
        try {
            const { offset } = err;
            const { table } = parser;
            const lastColumnIndex = table.length - 2;
            const lastColumn = table[lastColumnIndex];
            let tok;
            let msg = "";
            let width = process.stdout.columns * 4;
            let visibleCode = code.slice(Math.max(offset - width / 4, 0), Math.min(offset + width / 4, code.length)).split('\n');
            if (visibleCode.length > 2) {
                visibleCode.shift();
                visibleCode.pop();
            }
            let lineNumber = 0;
            let column = 0;
            for (const line of visibleCode) {
                msg += `${lineNumber} | ${line}\n`;
                if (column + line.length >= offset && column <= offset) {
                    let tokenLength = lastColumn.states[0].dot;
                    let tokenStart = offset - column - tokenLength;
                    ;
                    msg += " ".repeat(tokenStart + `${lineNumber} |`.length + 1);
                    msg += "\x1b[1m\x1b[31m^\x1b[0m".repeat(tokenLength);
                    msg += ` \x1b[1m\x1b[31m expected one of  found '${line.slice(tokenStart, tokenStart + tokenLength)}\x1b[0m'`;
                    tok = line.slice(tokenStart, tokenStart + tokenLength);
                    msg += "\n";
                }
                lineNumber++;
                column += line.length;
            }
            msg += 'expected one of the following:\n';
            for (let i = 0; i < lastColumn.states.length; i++) {
                const state = lastColumn.states[i];
                const nextSymbol = state.rule.symbols[state.dot];
                if (nextSymbol && isTerminalSymbol(nextSymbol)) {
                    const symbolDisplay = getSymbolDisplay(nextSymbol, lsp);
                    const stateStack = table[lastColumnIndex].states[i];
                    let trace = `${stateStack.rule.name} → `;
                    stateStack.rule.symbols.forEach((symbol, i) => {
                        let { literal } = symbol;
                        if (literal) {
                            if (literal == tok.charAt(i))
                                trace += `\x1b[1m\x1b[32m${literal}\x1b[0m`;
                            else
                                trace += `\x1b[1m\x1b[31m${literal}\x1b[0m`;
                        }
                        else {
                            trace += `\x1b[1m\x1b[31m ${symbol.type ? symbol.type : symbol.toString()}\x1b[0m`;
                        }
                    });
                    msg += `├──A ${symbolDisplay} based on:\n`;
                    msg += `│  ╰─ ${trace}\n`;
                }
            }
            if (!lsp)
                console.log(msg);
            if (!lsp)
                process.exit(1);
        }
        catch (e) {
            if (!lsp)
                console.log(err);
            if (!lsp)
                process.exit(1);
        }
    }
};

const _BriskError = (type, message, file, position) => {
    console.log(`\x1b[31m\x1b[1m${type}: ${message}`);
    console.log(`at ${path__namespace.join(file.dir, file.base)}:${position.line}:${position.col}\x1b[0m`);
    process.exit(1);
};
const BriskError = (msg, file, pos) => {
    _BriskError('Error', msg, file, pos);
};
const BriskSyntaxError = (msg, file, pos) => {
    _BriskError('SyntaxError', msg, file, pos);
};
const BriskReferenceError = (msg, file, pos) => {
    _BriskError('ReferenceError', msg, file, pos);
};

const RecurseTree = (Node, callback) => {
    const RecurseNodes = (Parent, Node, index, stack, trace, callback) => {
        trace = [...trace, Parent];
        switch (Node.type) {
            case 'Program':
            case 'functionDeclaration':
            case 'functionNode':
                stack = new Stack(stack);
                if (Node.type == 'functionDeclaration') {
                    Node.parameters = Node.parameters.map((Param, i) => RecurseNodes(Node, Param, i, stack, trace, callback)).filter((n) => n);
                }
                Node.body = Node.body.map((Statement, i) => RecurseNodes(Node, Statement, i, stack, trace, callback)).filter((n) => n);
                break;
            case 'callStatement':
                Node.arguments = Node.arguments.map((Expression, i) => RecurseNodes(Node, Expression, i, stack, trace, callback)).filter((n) => n);
                break;
            case 'declarationStatement':
                Node.value = RecurseNodes(Node, Node.value, 0, stack, trace, callback);
                break;
        }
        return callback(Parent, Node, index, stack, trace);
    };
    return RecurseNodes([], Node, 0, new Stack(), [], callback);
};
class Stack {
    constructor(ParentStack) {
        this.local = {};
        this.closure = {};
        this.ParentStack = ParentStack;
    }
    has(name) {
        if (this.hasLocal(name))
            return true;
        else if (this.hasClosure(name))
            return true;
        else if (this.ParentStack && this.ParentStack.has(name)) {
            this.setClosure(name, this.ParentStack.get(name));
            return true;
        }
        else
            return false;
    }
    hasLocal(name) {
        return this.local.hasOwnProperty(name);
    }
    hasClosure(name) {
        return this.closure.hasOwnProperty(name);
    }
    hasParent(name) {
        return this.ParentStack ? this.ParentStack.hasLocal(name) : false;
    }
    setLocal(name, value) {
        this.local[name] = value;
    }
    setClosure(name, value) {
        this.closure[name] = value;
    }
    get(name) {
        if (this.hasLocal(name))
            return this.local[name];
        else if (this.hasClosure(name))
            return this.closure[name];
        else {
            if (this.ParentStack && this.ParentStack.has(name)) {
                this.setClosure(name, this.ParentStack.get(name));
            }
        }
    }
    getLocal(name) {
        return this.local[name];
    }
    getClosure(name) {
        return this.closure[name];
    }
    get length() {
        return Object.keys(this.local).length + Object.keys(this.closure).length;
    }
}

const Analyzer = (filename, Program) => {
    Program = RecurseTree(Program, (Parent, Node, index, stack, trace) => {
        switch (Node.type) {
            case 'Program':
                let ProgramFlags = [];
                for (const node of Node.body) {
                    if (node.type != 'flagStatement')
                        break;
                    ProgramFlags.push(node);
                }
                Node = {
                    type: 'Program',
                    flags: ProgramFlags,
                    variables: stack,
                    body: Node.body
                };
                break;
            case 'importStatement':
                if (!stack.hasLocal(Node.identifier))
                    stack.setLocal(Node.identifier, true);
                else
                    BriskSyntaxError(`redeclaration of ${Node.identifier}`, filename, Node.position);
                Node.path = path__namespace.join(filename.dir, Node.path);
                break;
            case 'exportStatement':
                if (!stack.has(Node.identifier))
                    BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
                break;
            case 'declarationStatement':
                if (!stack.hasLocal(Node.identifier))
                    stack.setLocal(Node.identifier, true);
                else
                    BriskSyntaxError(`redeclaration of ${Node.identifier}`, filename, Node.position);
                break;
            case 'callStatement':
                if (!stack.has(Node.identifier)) {
                    if (Parent.type == 'functionDeclaration') {
                        let { type, identifier } = trace[trace.length - 2];
                        if (type == 'declarationStatement' && identifier == Node.identifier)
                            stack.setClosure(Node.identifier, true);
                    }
                    else
                        BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
                }
                break;
            case 'variable':
                if (!stack.has(Node.identifier))
                    BriskReferenceError(`${Node.identifier} is not defined`, filename, Node.position);
                break;
            case 'functionDeclaration':
                let FunctionFlags = [];
                for (const node of Node.body) {
                    if (node.type != 'flagStatement')
                        break;
                    FunctionFlags.push(node);
                }
                Node = {
                    type: 'functionNode',
                    dataType: Node.dataType,
                    flags: FunctionFlags,
                    variables: stack,
                    parameters: Node.parameters,
                    body: Node.body,
                    position: Node.position
                };
                break;
            case 'functionParameter':
                stack.setLocal(Node.identifier, true);
                break;
        }
        return Node;
    });
    return Program;
};

let Verifier = (filename, Program) => {
    Program = RecurseTree(Program, (Parent, Node, index, stack, trace) => {
        switch (Node.type) {
            case 'importStatement':
                let exists = fs__namespace.existsSync(Node.path);
                if (!exists)
                    BriskError(`cannot find module ${Node.path}`, filename, Node.position);
                break;
        }
        return Node;
    });
};

let Optimizer = (filename, Program) => {
    Program = RecurseTree(Program, (Parent, Node, index, stack, trace) => {
        switch (Node.type) {
            case 'commentStatement':
                Node = null;
                break;
        }
        return Node;
    });
    return Program;
};

let briskCompiler = (filename) => tslib.__awaiter(void 0, void 0, void 0, function* () {
    let exists = fs__namespace.existsSync(filename);
    if (!exists)
        throw new Error(`${filename} does not exist`);
    let FilePath = filename;
    let ProgramPath = path__namespace.parse(FilePath);
    let code = yield fs__namespace.promises.readFile(filename, 'utf-8');
    let parsed = Parser(filename, code);
    let analyzed = Analyzer(ProgramPath, parsed);
    Verifier(ProgramPath, analyzed);
    let optimized = Optimizer(ProgramPath, analyzed);
    console.dir(optimized, { depth: null });
});

const program = new commander.Command();
program
    .version('0.0.3');
program
    .option('-v, --version', 'output CLI, Compiler and LSP versions');
program
    .on("option:version", () => {
    console.log('version');
});
program
    .command('compile <file')
    .description('compile Brisk Program')
    .action((file) => {
    console.log('compiling');
    console.log(file);
});
program
    .command('lsp <file')
    .description('Run Brisk lsp')
    .action((file) => {
    console.log('lsp');
    console.log(file);
});
program
    .command('run <file')
    .description('run brisk file')
    .action((file) => {
    console.log('run');
    console.log(file);
});
program
    .arguments('<file>')
    .action((file) => briskCompiler(path__namespace.join(process.cwd(), file)));
program.parse(process.argv);
//# sourceMappingURL=brisk.js.map
