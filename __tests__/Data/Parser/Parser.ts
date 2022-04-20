import { Lexer, ILexingResult } from 'chevrotain';
const data: ILexingResult = {
  tokens: [{
    image: '\r\n',
    startOffset: 17,
    endOffset: 18,
    startLine: 1,
    endLine: 1,
    startColumn: 18,
    endColumn: 19,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'import',
    startOffset: 19,
    endOffset: 24,
    startLine: 2,
    endLine: 2,
    startColumn: 1,
    endColumn: 6,
    tokenTypeIdx: 8,
    tokenType: {
      name: 'ImportToken',
      PATTERN: /import/,
      tokenTypeIdx: 8,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Import'
    }
  }, {
    image: ' ',
    startOffset: 25,
    endOffset: 25,
    startLine: 2,
    endLine: 2,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'test',
    startOffset: 26,
    endOffset: 29,
    startLine: 2,
    endLine: 2,
    startColumn: 8,
    endColumn: 11,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 30,
    endOffset: 30,
    startLine: 2,
    endLine: 2,
    startColumn: 12,
    endColumn: 12,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'from',
    startOffset: 31,
    endOffset: 34,
    startLine: 2,
    endLine: 2,
    startColumn: 13,
    endColumn: 16,
    tokenTypeIdx: 10,
    tokenType: {
      name: 'FromToken',
      PATTERN: /from/,
      tokenTypeIdx: 10,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'From'
    }
  }, {
    image: ' ',
    startOffset: 35,
    endOffset: 35,
    startLine: 2,
    endLine: 2,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\'test\'',
    startOffset: 36,
    endOffset: 41,
    startLine: 2,
    endLine: 2,
    startColumn: 18,
    endColumn: 23,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ';',
    startOffset: 42,
    endOffset: 42,
    startLine: 2,
    endLine: 2,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 43,
    endOffset: 44,
    startLine: 2,
    endLine: 2,
    startColumn: 25,
    endColumn: 26,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'import',
    startOffset: 45,
    endOffset: 50,
    startLine: 3,
    endLine: 3,
    startColumn: 1,
    endColumn: 6,
    tokenTypeIdx: 8,
    tokenType: {
      name: 'ImportToken',
      PATTERN: /import/,
      tokenTypeIdx: 8,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Import'
    }
  }, {
    image: ' ',
    startOffset: 51,
    endOffset: 51,
    startLine: 3,
    endLine: 3,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'wasm',
    startOffset: 52,
    endOffset: 55,
    startLine: 3,
    endLine: 3,
    startColumn: 8,
    endColumn: 11,
    tokenTypeIdx: 9,
    tokenType: {
      name: 'WasmToken',
      PATTERN: /wasm/,
      tokenTypeIdx: 9,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Wasm Import Identifier'
    }
  }, {
    image: ' ',
    startOffset: 56,
    endOffset: 56,
    startLine: 3,
    endLine: 3,
    startColumn: 12,
    endColumn: 12,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'test',
    startOffset: 57,
    endOffset: 60,
    startLine: 3,
    endLine: 3,
    startColumn: 13,
    endColumn: 16,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 61,
    endOffset: 61,
    startLine: 3,
    endLine: 3,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 62,
    endOffset: 62,
    startLine: 3,
    endLine: 3,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 63,
    endOffset: 63,
    startLine: 3,
    endLine: 3,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: 'i32',
    startOffset: 64,
    endOffset: 66,
    startLine: 3,
    endLine: 3,
    startColumn: 20,
    endColumn: 22,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ',',
    startOffset: 67,
    endOffset: 67,
    startLine: 3,
    endLine: 3,
    startColumn: 23,
    endColumn: 23,
    tokenTypeIdx: 24,
    tokenType: {
      name: 'Comma',
      PATTERN: /,/,
      tokenTypeIdx: 24,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Comma'
    }
  }, {
    image: ' ',
    startOffset: 68,
    endOffset: 68,
    startLine: 3,
    endLine: 3,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'i32',
    startOffset: 69,
    endOffset: 71,
    startLine: 3,
    endLine: 3,
    startColumn: 25,
    endColumn: 27,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ')',
    startOffset: 72,
    endOffset: 72,
    startLine: 3,
    endLine: 3,
    startColumn: 28,
    endColumn: 28,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 73,
    endOffset: 73,
    startLine: 3,
    endLine: 3,
    startColumn: 29,
    endColumn: 29,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '->',
    startOffset: 74,
    endOffset: 75,
    startLine: 3,
    endLine: 3,
    startColumn: 30,
    endColumn: 31,
    tokenTypeIdx: 32,
    tokenType: {
      name: 'TknThinArrow',
      PATTERN: /->/,
      tokenTypeIdx: 32,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Signature Arrow'
    }
  }, {
    image: ' ',
    startOffset: 76,
    endOffset: 76,
    startLine: 3,
    endLine: 3,
    startColumn: 32,
    endColumn: 32,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'i32',
    startOffset: 77,
    endOffset: 79,
    startLine: 3,
    endLine: 3,
    startColumn: 33,
    endColumn: 35,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 80,
    endOffset: 80,
    startLine: 3,
    endLine: 3,
    startColumn: 36,
    endColumn: 36,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'from',
    startOffset: 81,
    endOffset: 84,
    startLine: 3,
    endLine: 3,
    startColumn: 37,
    endColumn: 40,
    tokenTypeIdx: 10,
    tokenType: {
      name: 'FromToken',
      PATTERN: /from/,
      tokenTypeIdx: 10,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'From'
    }
  }, {
    image: ' ',
    startOffset: 85,
    endOffset: 85,
    startLine: 3,
    endLine: 3,
    startColumn: 41,
    endColumn: 41,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\'test\'',
    startOffset: 86,
    endOffset: 91,
    startLine: 3,
    endLine: 3,
    startColumn: 42,
    endColumn: 47,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ';',
    startOffset: 92,
    endOffset: 92,
    startLine: 3,
    endLine: 3,
    startColumn: 48,
    endColumn: 48,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 93,
    endOffset: 94,
    startLine: 3,
    endLine: 3,
    startColumn: 49,
    endColumn: 50,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'import',
    startOffset: 95,
    endOffset: 100,
    startLine: 4,
    endLine: 4,
    startColumn: 1,
    endColumn: 6,
    tokenTypeIdx: 8,
    tokenType: {
      name: 'ImportToken',
      PATTERN: /import/,
      tokenTypeIdx: 8,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Import'
    }
  }, {
    image: ' ',
    startOffset: 101,
    endOffset: 101,
    startLine: 4,
    endLine: 4,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'wasm',
    startOffset: 102,
    endOffset: 105,
    startLine: 4,
    endLine: 4,
    startColumn: 8,
    endColumn: 11,
    tokenTypeIdx: 9,
    tokenType: {
      name: 'WasmToken',
      PATTERN: /wasm/,
      tokenTypeIdx: 9,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Wasm Import Identifier'
    }
  }, {
    image: ' ',
    startOffset: 106,
    endOffset: 106,
    startLine: 4,
    endLine: 4,
    startColumn: 12,
    endColumn: 12,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 't',
    startOffset: 107,
    endOffset: 107,
    startLine: 4,
    endLine: 4,
    startColumn: 13,
    endColumn: 13,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 108,
    endOffset: 108,
    startLine: 4,
    endLine: 4,
    startColumn: 14,
    endColumn: 14,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 109,
    endOffset: 109,
    startLine: 4,
    endLine: 4,
    startColumn: 15,
    endColumn: 15,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'i32',
    startOffset: 110,
    endOffset: 112,
    startLine: 4,
    endLine: 4,
    startColumn: 16,
    endColumn: 18,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 113,
    endOffset: 113,
    startLine: 4,
    endLine: 4,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'from',
    startOffset: 114,
    endOffset: 117,
    startLine: 4,
    endLine: 4,
    startColumn: 20,
    endColumn: 23,
    tokenTypeIdx: 10,
    tokenType: {
      name: 'FromToken',
      PATTERN: /from/,
      tokenTypeIdx: 10,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'From'
    }
  }, {
    image: ' ',
    startOffset: 118,
    endOffset: 118,
    startLine: 4,
    endLine: 4,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\'test\'',
    startOffset: 119,
    endOffset: 124,
    startLine: 4,
    endLine: 4,
    startColumn: 25,
    endColumn: 30,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ';',
    startOffset: 125,
    endOffset: 125,
    startLine: 4,
    endLine: 4,
    startColumn: 31,
    endColumn: 31,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 126,
    endOffset: 127,
    startLine: 4,
    endLine: 4,
    startColumn: 32,
    endColumn: 33,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 164,
    endOffset: 165,
    startLine: 5,
    endLine: 5,
    startColumn: 37,
    endColumn: 38,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 186,
    endOffset: 187,
    startLine: 6,
    endLine: 6,
    startColumn: 21,
    endColumn: 22,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 211,
    endOffset: 212,
    startLine: 7,
    endLine: 7,
    startColumn: 24,
    endColumn: 25,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'if',
    startOffset: 213,
    endOffset: 214,
    startLine: 8,
    endLine: 8,
    startColumn: 1,
    endColumn: 2,
    tokenTypeIdx: 14,
    tokenType: {
      name: 'IfToken',
      PATTERN: /if/,
      tokenTypeIdx: 14,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'If'
    }
  }, {
    image: ' ',
    startOffset: 215,
    endOffset: 215,
    startLine: 8,
    endLine: 8,
    startColumn: 3,
    endColumn: 3,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 216,
    endOffset: 216,
    startLine: 8,
    endLine: 8,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '1',
    startOffset: 217,
    endOffset: 217,
    startLine: 8,
    endLine: 8,
    startColumn: 5,
    endColumn: 5,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 218,
    endOffset: 218,
    startLine: 8,
    endLine: 8,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '==',
    startOffset: 219,
    endOffset: 220,
    startLine: 8,
    endLine: 8,
    startColumn: 7,
    endColumn: 8,
    tokenTypeIdx: 29,
    tokenType: {
      name: 'TknComparisonEqual',
      PATTERN: /==/,
      CATEGORIES: [{
        name: 'ComparisonOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 4,
        CATEGORIES: [],
        categoryMatches: [29, 30],
        categoryMatchesMap: {
          '29': true,
          '30': true
        },
        isParent: true
      }],
      tokenTypeIdx: 29,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Comparison Equal'
    }
  }, {
    image: ' ',
    startOffset: 221,
    endOffset: 221,
    startLine: 8,
    endLine: 8,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 222,
    endOffset: 222,
    startLine: 8,
    endLine: 8,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ')',
    startOffset: 223,
    endOffset: 223,
    startLine: 8,
    endLine: 8,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 224,
    endOffset: 224,
    startLine: 8,
    endLine: 8,
    startColumn: 12,
    endColumn: 12,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '{',
    startOffset: 225,
    endOffset: 225,
    startLine: 8,
    endLine: 8,
    startColumn: 13,
    endColumn: 13,
    tokenTypeIdx: 18,
    tokenType: {
      name: 'LeftBrace',
      PATTERN: /\{/,
      tokenTypeIdx: 18,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Brace'
    }
  }, {
    image: '\r\n  ',
    startOffset: 226,
    endOffset: 229,
    startLine: 8,
    endLine: 9,
    startColumn: 14,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 230,
    endOffset: 234,
    startLine: 9,
    endLine: 9,
    startColumn: 3,
    endColumn: 7,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 235,
    endOffset: 235,
    startLine: 9,
    endLine: 9,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'If Test\'',
    startOffset: 236,
    endOffset: 244,
    startLine: 9,
    endLine: 9,
    startColumn: 9,
    endColumn: 17,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 245,
    endOffset: 245,
    startLine: 9,
    endLine: 9,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 246,
    endOffset: 246,
    startLine: 9,
    endLine: 9,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 247,
    endOffset: 248,
    startLine: 9,
    endLine: 9,
    startColumn: 20,
    endColumn: 21,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '}',
    startOffset: 249,
    endOffset: 249,
    startLine: 10,
    endLine: 10,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 19,
    tokenType: {
      name: 'RightBrace',
      PATTERN: /\}/,
      tokenTypeIdx: 19,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Brace'
    }
  }, {
    image: ' ',
    startOffset: 250,
    endOffset: 250,
    startLine: 10,
    endLine: 10,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'else',
    startOffset: 251,
    endOffset: 254,
    startLine: 10,
    endLine: 10,
    startColumn: 3,
    endColumn: 6,
    tokenTypeIdx: 15,
    tokenType: {
      name: 'ElseToken',
      PATTERN: /else/,
      tokenTypeIdx: 15,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Else'
    }
  }, {
    image: ' ',
    startOffset: 255,
    endOffset: 255,
    startLine: 10,
    endLine: 10,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'if',
    startOffset: 256,
    endOffset: 257,
    startLine: 10,
    endLine: 10,
    startColumn: 8,
    endColumn: 9,
    tokenTypeIdx: 14,
    tokenType: {
      name: 'IfToken',
      PATTERN: /if/,
      tokenTypeIdx: 14,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'If'
    }
  }, {
    image: ' ',
    startOffset: 258,
    endOffset: 258,
    startLine: 10,
    endLine: 10,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 259,
    endOffset: 259,
    startLine: 10,
    endLine: 10,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'test\'',
    startOffset: 260,
    endOffset: 265,
    startLine: 10,
    endLine: 10,
    startColumn: 12,
    endColumn: 17,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 266,
    endOffset: 266,
    startLine: 10,
    endLine: 10,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 267,
    endOffset: 267,
    startLine: 10,
    endLine: 10,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '{',
    startOffset: 268,
    endOffset: 268,
    startLine: 10,
    endLine: 10,
    startColumn: 20,
    endColumn: 20,
    tokenTypeIdx: 18,
    tokenType: {
      name: 'LeftBrace',
      PATTERN: /\{/,
      tokenTypeIdx: 18,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Brace'
    }
  }, {
    image: '\r\n  ',
    startOffset: 269,
    endOffset: 272,
    startLine: 10,
    endLine: 11,
    startColumn: 21,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 273,
    endOffset: 277,
    startLine: 11,
    endLine: 11,
    startColumn: 3,
    endColumn: 7,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 278,
    endOffset: 278,
    startLine: 11,
    endLine: 11,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'Else If Test\'',
    startOffset: 279,
    endOffset: 292,
    startLine: 11,
    endLine: 11,
    startColumn: 9,
    endColumn: 22,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 293,
    endOffset: 293,
    startLine: 11,
    endLine: 11,
    startColumn: 23,
    endColumn: 23,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 294,
    endOffset: 294,
    startLine: 11,
    endLine: 11,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 295,
    endOffset: 296,
    startLine: 11,
    endLine: 11,
    startColumn: 25,
    endColumn: 26,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '}',
    startOffset: 297,
    endOffset: 297,
    startLine: 12,
    endLine: 12,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 19,
    tokenType: {
      name: 'RightBrace',
      PATTERN: /\}/,
      tokenTypeIdx: 19,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Brace'
    }
  }, {
    image: ' ',
    startOffset: 298,
    endOffset: 298,
    startLine: 12,
    endLine: 12,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'else',
    startOffset: 299,
    endOffset: 302,
    startLine: 12,
    endLine: 12,
    startColumn: 3,
    endColumn: 6,
    tokenTypeIdx: 15,
    tokenType: {
      name: 'ElseToken',
      PATTERN: /else/,
      tokenTypeIdx: 15,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Else'
    }
  }, {
    image: ' ',
    startOffset: 303,
    endOffset: 303,
    startLine: 12,
    endLine: 12,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '{',
    startOffset: 304,
    endOffset: 304,
    startLine: 12,
    endLine: 12,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 18,
    tokenType: {
      name: 'LeftBrace',
      PATTERN: /\{/,
      tokenTypeIdx: 18,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Brace'
    }
  }, {
    image: '\r\n  ',
    startOffset: 305,
    endOffset: 308,
    startLine: 12,
    endLine: 13,
    startColumn: 9,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 309,
    endOffset: 313,
    startLine: 13,
    endLine: 13,
    startColumn: 3,
    endColumn: 7,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 314,
    endOffset: 314,
    startLine: 13,
    endLine: 13,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'Else Test\'',
    startOffset: 315,
    endOffset: 325,
    startLine: 13,
    endLine: 13,
    startColumn: 9,
    endColumn: 19,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 326,
    endOffset: 326,
    startLine: 13,
    endLine: 13,
    startColumn: 20,
    endColumn: 20,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 327,
    endOffset: 327,
    startLine: 13,
    endLine: 13,
    startColumn: 21,
    endColumn: 21,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 328,
    endOffset: 329,
    startLine: 13,
    endLine: 13,
    startColumn: 22,
    endColumn: 23,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '}',
    startOffset: 330,
    endOffset: 330,
    startLine: 14,
    endLine: 14,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 19,
    tokenType: {
      name: 'RightBrace',
      PATTERN: /\}/,
      tokenTypeIdx: 19,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Brace'
    }
  }, {
    image: ';',
    startOffset: 331,
    endOffset: 331,
    startLine: 14,
    endLine: 14,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 332,
    endOffset: 333,
    startLine: 14,
    endLine: 14,
    startColumn: 3,
    endColumn: 4,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'if',
    startOffset: 334,
    endOffset: 335,
    startLine: 15,
    endLine: 15,
    startColumn: 1,
    endColumn: 2,
    tokenTypeIdx: 14,
    tokenType: {
      name: 'IfToken',
      PATTERN: /if/,
      tokenTypeIdx: 14,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'If'
    }
  }, {
    image: ' ',
    startOffset: 336,
    endOffset: 336,
    startLine: 15,
    endLine: 15,
    startColumn: 3,
    endColumn: 3,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 337,
    endOffset: 337,
    startLine: 15,
    endLine: 15,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '1',
    startOffset: 338,
    endOffset: 338,
    startLine: 15,
    endLine: 15,
    startColumn: 5,
    endColumn: 5,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 339,
    endOffset: 339,
    startLine: 15,
    endLine: 15,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '==',
    startOffset: 340,
    endOffset: 341,
    startLine: 15,
    endLine: 15,
    startColumn: 7,
    endColumn: 8,
    tokenTypeIdx: 29,
    tokenType: {
      name: 'TknComparisonEqual',
      PATTERN: /==/,
      CATEGORIES: [{
        name: 'ComparisonOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 4,
        CATEGORIES: [],
        categoryMatches: [29, 30],
        categoryMatchesMap: {
          '29': true,
          '30': true
        },
        isParent: true
      }],
      tokenTypeIdx: 29,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Comparison Equal'
    }
  }, {
    image: ' ',
    startOffset: 342,
    endOffset: 342,
    startLine: 15,
    endLine: 15,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 343,
    endOffset: 343,
    startLine: 15,
    endLine: 15,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ')',
    startOffset: 344,
    endOffset: 344,
    startLine: 15,
    endLine: 15,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 345,
    endOffset: 345,
    startLine: 15,
    endLine: 15,
    startColumn: 12,
    endColumn: 12,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 346,
    endOffset: 350,
    startLine: 15,
    endLine: 15,
    startColumn: 13,
    endColumn: 17,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 351,
    endOffset: 351,
    startLine: 15,
    endLine: 15,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'test\'',
    startOffset: 352,
    endOffset: 357,
    startLine: 15,
    endLine: 15,
    startColumn: 19,
    endColumn: 24,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 358,
    endOffset: 358,
    startLine: 15,
    endLine: 15,
    startColumn: 25,
    endColumn: 25,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 359,
    endOffset: 359,
    startLine: 15,
    endLine: 15,
    startColumn: 26,
    endColumn: 26,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 360,
    endOffset: 361,
    startLine: 15,
    endLine: 15,
    startColumn: 27,
    endColumn: 28,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'else',
    startOffset: 362,
    endOffset: 365,
    startLine: 16,
    endLine: 16,
    startColumn: 1,
    endColumn: 4,
    tokenTypeIdx: 15,
    tokenType: {
      name: 'ElseToken',
      PATTERN: /else/,
      tokenTypeIdx: 15,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Else'
    }
  }, {
    image: ' ',
    startOffset: 366,
    endOffset: 366,
    startLine: 16,
    endLine: 16,
    startColumn: 5,
    endColumn: 5,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 367,
    endOffset: 371,
    startLine: 16,
    endLine: 16,
    startColumn: 6,
    endColumn: 10,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 372,
    endOffset: 372,
    startLine: 16,
    endLine: 16,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'test\'',
    startOffset: 373,
    endOffset: 378,
    startLine: 16,
    endLine: 16,
    startColumn: 12,
    endColumn: 17,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 379,
    endOffset: 379,
    startLine: 16,
    endLine: 16,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 380,
    endOffset: 380,
    startLine: 16,
    endLine: 16,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n\r\n',
    startOffset: 381,
    endOffset: 384,
    startLine: 16,
    endLine: 17,
    startColumn: 20,
    endColumn: 1,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'if',
    startOffset: 385,
    endOffset: 386,
    startLine: 18,
    endLine: 18,
    startColumn: 1,
    endColumn: 2,
    tokenTypeIdx: 14,
    tokenType: {
      name: 'IfToken',
      PATTERN: /if/,
      tokenTypeIdx: 14,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'If'
    }
  }, {
    image: ' ',
    startOffset: 387,
    endOffset: 387,
    startLine: 18,
    endLine: 18,
    startColumn: 3,
    endColumn: 3,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 388,
    endOffset: 388,
    startLine: 18,
    endLine: 18,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: 'true',
    startOffset: 389,
    endOffset: 392,
    startLine: 18,
    endLine: 18,
    startColumn: 5,
    endColumn: 8,
    tokenTypeIdx: 39,
    tokenType: {
      name: 'Constant',
      PATTERN: /(?:true|false|void)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 39,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Constant Literal'
    }
  }, {
    image: ')',
    startOffset: 393,
    endOffset: 393,
    startLine: 18,
    endLine: 18,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 394,
    endOffset: 394,
    startLine: 18,
    endLine: 18,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '{',
    startOffset: 395,
    endOffset: 395,
    startLine: 18,
    endLine: 18,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 18,
    tokenType: {
      name: 'LeftBrace',
      PATTERN: /\{/,
      tokenTypeIdx: 18,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Brace'
    }
  }, {
    image: '\r\n  ',
    startOffset: 396,
    endOffset: 399,
    startLine: 18,
    endLine: 19,
    startColumn: 12,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 400,
    endOffset: 404,
    startLine: 19,
    endLine: 19,
    startColumn: 3,
    endColumn: 7,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 405,
    endOffset: 405,
    startLine: 19,
    endLine: 19,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'true\'',
    startOffset: 406,
    endOffset: 411,
    startLine: 19,
    endLine: 19,
    startColumn: 9,
    endColumn: 14,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 412,
    endOffset: 412,
    startLine: 19,
    endLine: 19,
    startColumn: 15,
    endColumn: 15,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 413,
    endOffset: 413,
    startLine: 19,
    endLine: 19,
    startColumn: 16,
    endColumn: 16,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 414,
    endOffset: 415,
    startLine: 19,
    endLine: 19,
    startColumn: 17,
    endColumn: 18,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '}',
    startOffset: 416,
    endOffset: 416,
    startLine: 20,
    endLine: 20,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 19,
    tokenType: {
      name: 'RightBrace',
      PATTERN: /\}/,
      tokenTypeIdx: 19,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Brace'
    }
  }, {
    image: ';',
    startOffset: 417,
    endOffset: 417,
    startLine: 20,
    endLine: 20,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n\r\n',
    startOffset: 418,
    endOffset: 421,
    startLine: 20,
    endLine: 21,
    startColumn: 3,
    endColumn: 1,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'if',
    startOffset: 422,
    endOffset: 423,
    startLine: 22,
    endLine: 22,
    startColumn: 1,
    endColumn: 2,
    tokenTypeIdx: 14,
    tokenType: {
      name: 'IfToken',
      PATTERN: /if/,
      tokenTypeIdx: 14,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'If'
    }
  }, {
    image: ' ',
    startOffset: 424,
    endOffset: 424,
    startLine: 22,
    endLine: 22,
    startColumn: 3,
    endColumn: 3,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 425,
    endOffset: 425,
    startLine: 22,
    endLine: 22,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: 'false',
    startOffset: 426,
    endOffset: 430,
    startLine: 22,
    endLine: 22,
    startColumn: 5,
    endColumn: 9,
    tokenTypeIdx: 39,
    tokenType: {
      name: 'Constant',
      PATTERN: /(?:true|false|void)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 39,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Constant Literal'
    }
  }, {
    image: ')',
    startOffset: 431,
    endOffset: 431,
    startLine: 22,
    endLine: 22,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 432,
    endOffset: 432,
    startLine: 22,
    endLine: 22,
    startColumn: 11,
    endColumn: 11,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 433,
    endOffset: 437,
    startLine: 22,
    endLine: 22,
    startColumn: 12,
    endColumn: 16,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 438,
    endOffset: 438,
    startLine: 22,
    endLine: 22,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'test\'',
    startOffset: 439,
    endOffset: 444,
    startLine: 22,
    endLine: 22,
    startColumn: 18,
    endColumn: 23,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 445,
    endOffset: 445,
    startLine: 22,
    endLine: 22,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 446,
    endOffset: 446,
    startLine: 22,
    endLine: 22,
    startColumn: 25,
    endColumn: 25,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n\r\n',
    startOffset: 447,
    endOffset: 450,
    startLine: 22,
    endLine: 23,
    startColumn: 26,
    endColumn: 1,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 473,
    endOffset: 474,
    startLine: 24,
    endLine: 24,
    startColumn: 23,
    endColumn: 24,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'print',
    startOffset: 475,
    endOffset: 479,
    startLine: 25,
    endLine: 25,
    startColumn: 1,
    endColumn: 5,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 480,
    endOffset: 480,
    startLine: 25,
    endLine: 25,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '\'test\'',
    startOffset: 481,
    endOffset: 486,
    startLine: 25,
    endLine: 25,
    startColumn: 7,
    endColumn: 12,
    tokenTypeIdx: 37,
    tokenType: {
      name: 'String',
      PATTERN: /'.*'/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 37,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'String Literal'
    }
  }, {
    image: ')',
    startOffset: 487,
    endOffset: 487,
    startLine: 25,
    endLine: 25,
    startColumn: 13,
    endColumn: 13,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 488,
    endOffset: 488,
    startLine: 25,
    endLine: 25,
    startColumn: 14,
    endColumn: 14,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 489,
    endOffset: 490,
    startLine: 25,
    endLine: 25,
    startColumn: 15,
    endColumn: 16,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'f',
    startOffset: 491,
    endOffset: 491,
    startLine: 26,
    endLine: 26,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 492,
    endOffset: 492,
    startLine: 26,
    endLine: 26,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: ')',
    startOffset: 493,
    endOffset: 493,
    startLine: 26,
    endLine: 26,
    startColumn: 3,
    endColumn: 3,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 494,
    endOffset: 494,
    startLine: 26,
    endLine: 26,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 495,
    endOffset: 496,
    startLine: 26,
    endLine: 26,
    startColumn: 5,
    endColumn: 6,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '@wasm',
    startOffset: 497,
    endOffset: 501,
    startLine: 27,
    endLine: 27,
    startColumn: 1,
    endColumn: 5,
    tokenTypeIdx: 40,
    tokenType: {
      name: 'Wasm Instruction Call',
      PATTERN: /@wasm/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 40,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Wasm Call'
    }
  }, {
    image: '.',
    startOffset: 502,
    endOffset: 502,
    startLine: 27,
    endLine: 27,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 25,
    tokenType: {
      name: 'Period',
      PATTERN: /\./,
      tokenTypeIdx: 25,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Period'
    }
  }, {
    image: 'i32',
    startOffset: 503,
    endOffset: 505,
    startLine: 27,
    endLine: 27,
    startColumn: 7,
    endColumn: 9,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '.',
    startOffset: 506,
    endOffset: 506,
    startLine: 27,
    endLine: 27,
    startColumn: 10,
    endColumn: 10,
    tokenTypeIdx: 25,
    tokenType: {
      name: 'Period',
      PATTERN: /\./,
      tokenTypeIdx: 25,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Period'
    }
  }, {
    image: 'add',
    startOffset: 507,
    endOffset: 509,
    startLine: 27,
    endLine: 27,
    startColumn: 11,
    endColumn: 13,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 510,
    endOffset: 510,
    startLine: 27,
    endLine: 27,
    startColumn: 14,
    endColumn: 14,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '1',
    startOffset: 511,
    endOffset: 511,
    startLine: 27,
    endLine: 27,
    startColumn: 15,
    endColumn: 15,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ',',
    startOffset: 512,
    endOffset: 512,
    startLine: 27,
    endLine: 27,
    startColumn: 16,
    endColumn: 16,
    tokenTypeIdx: 24,
    tokenType: {
      name: 'Comma',
      PATTERN: /,/,
      tokenTypeIdx: 24,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Comma'
    }
  }, {
    image: ' ',
    startOffset: 513,
    endOffset: 513,
    startLine: 27,
    endLine: 27,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 514,
    endOffset: 514,
    startLine: 27,
    endLine: 27,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ')',
    startOffset: 515,
    endOffset: 515,
    startLine: 27,
    endLine: 27,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 516,
    endOffset: 516,
    startLine: 27,
    endLine: 27,
    startColumn: 20,
    endColumn: 20,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 517,
    endOffset: 518,
    startLine: 27,
    endLine: 27,
    startColumn: 21,
    endColumn: 22,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 548,
    endOffset: 549,
    startLine: 28,
    endLine: 28,
    startColumn: 30,
    endColumn: 31,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'let',
    startOffset: 550,
    endOffset: 552,
    startLine: 29,
    endLine: 29,
    startColumn: 1,
    endColumn: 3,
    tokenTypeIdx: 13,
    tokenType: {
      name: 'LetToken',
      PATTERN: /let/,
      tokenTypeIdx: 13,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Let'
    }
  }, {
    image: ' ',
    startOffset: 553,
    endOffset: 553,
    startLine: 29,
    endLine: 29,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'a',
    startOffset: 554,
    endOffset: 554,
    startLine: 29,
    endLine: 29,
    startColumn: 5,
    endColumn: 5,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 555,
    endOffset: 555,
    startLine: 29,
    endLine: 29,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 556,
    endOffset: 556,
    startLine: 29,
    endLine: 29,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'Number',
    startOffset: 557,
    endOffset: 562,
    startLine: 29,
    endLine: 29,
    startColumn: 8,
    endColumn: 13,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 563,
    endOffset: 563,
    startLine: 29,
    endLine: 29,
    startColumn: 14,
    endColumn: 14,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '=',
    startOffset: 564,
    endOffset: 564,
    startLine: 29,
    endLine: 29,
    startColumn: 15,
    endColumn: 15,
    tokenTypeIdx: 34,
    tokenType: {
      name: 'TknEqual',
      PATTERN: /=/,
      CATEGORIES: [{
        name: 'AssignmentOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 5,
        CATEGORIES: [],
        categoryMatches: [34],
        categoryMatchesMap: {
          '34': true
        },
        isParent: true
      }],
      tokenTypeIdx: 34,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Equal'
    }
  }, {
    image: ' ',
    startOffset: 565,
    endOffset: 565,
    startLine: 29,
    endLine: 29,
    startColumn: 16,
    endColumn: 16,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '!',
    startOffset: 566,
    endOffset: 566,
    startLine: 29,
    endLine: 29,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 33,
    tokenType: {
      name: 'TknNot',
      PATTERN: /!/,
      CATEGORIES: [{
        name: 'LogicalOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 7,
        CATEGORIES: [],
        categoryMatches: [33],
        categoryMatchesMap: {
          '33': true
        },
        isParent: true
      }],
      tokenTypeIdx: 33,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Not'
    }
  }, {
    image: '1',
    startOffset: 567,
    endOffset: 567,
    startLine: 29,
    endLine: 29,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 568,
    endOffset: 568,
    startLine: 29,
    endLine: 29,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '+',
    startOffset: 569,
    endOffset: 569,
    startLine: 29,
    endLine: 29,
    startColumn: 20,
    endColumn: 20,
    tokenTypeIdx: 35,
    tokenType: {
      name: 'TknAdd',
      PATTERN: /\+/,
      CATEGORIES: [{
        name: 'ArithmeticOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 6,
        CATEGORIES: [],
        categoryMatches: [35, 36],
        categoryMatchesMap: {
          '35': true,
          '36': true
        },
        isParent: true
      }],
      tokenTypeIdx: 35,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Add'
    }
  }, {
    image: ' ',
    startOffset: 570,
    endOffset: 570,
    startLine: 29,
    endLine: 29,
    startColumn: 21,
    endColumn: 21,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 571,
    endOffset: 571,
    startLine: 29,
    endLine: 29,
    startColumn: 22,
    endColumn: 22,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '1',
    startOffset: 572,
    endOffset: 572,
    startLine: 29,
    endLine: 29,
    startColumn: 23,
    endColumn: 23,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 573,
    endOffset: 573,
    startLine: 29,
    endLine: 29,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '+',
    startOffset: 574,
    endOffset: 574,
    startLine: 29,
    endLine: 29,
    startColumn: 25,
    endColumn: 25,
    tokenTypeIdx: 35,
    tokenType: {
      name: 'TknAdd',
      PATTERN: /\+/,
      CATEGORIES: [{
        name: 'ArithmeticOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 6,
        CATEGORIES: [],
        categoryMatches: [35, 36],
        categoryMatchesMap: {
          '35': true,
          '36': true
        },
        isParent: true
      }],
      tokenTypeIdx: 35,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Add'
    }
  }, {
    image: ' ',
    startOffset: 575,
    endOffset: 575,
    startLine: 29,
    endLine: 29,
    startColumn: 26,
    endColumn: 26,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 576,
    endOffset: 576,
    startLine: 29,
    endLine: 29,
    startColumn: 27,
    endColumn: 27,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ')',
    startOffset: 577,
    endOffset: 577,
    startLine: 29,
    endLine: 29,
    startColumn: 28,
    endColumn: 28,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 578,
    endOffset: 578,
    startLine: 29,
    endLine: 29,
    startColumn: 29,
    endColumn: 29,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '+',
    startOffset: 579,
    endOffset: 579,
    startLine: 29,
    endLine: 29,
    startColumn: 30,
    endColumn: 30,
    tokenTypeIdx: 35,
    tokenType: {
      name: 'TknAdd',
      PATTERN: /\+/,
      CATEGORIES: [{
        name: 'ArithmeticOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 6,
        CATEGORIES: [],
        categoryMatches: [35, 36],
        categoryMatchesMap: {
          '35': true,
          '36': true
        },
        isParent: true
      }],
      tokenTypeIdx: 35,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Add'
    }
  }, {
    image: ' ',
    startOffset: 580,
    endOffset: 580,
    startLine: 29,
    endLine: 29,
    startColumn: 31,
    endColumn: 31,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 581,
    endOffset: 581,
    startLine: 29,
    endLine: 29,
    startColumn: 32,
    endColumn: 32,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 582,
    endOffset: 582,
    startLine: 29,
    endLine: 29,
    startColumn: 33,
    endColumn: 33,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '+',
    startOffset: 583,
    endOffset: 583,
    startLine: 29,
    endLine: 29,
    startColumn: 34,
    endColumn: 34,
    tokenTypeIdx: 35,
    tokenType: {
      name: 'TknAdd',
      PATTERN: /\+/,
      CATEGORIES: [{
        name: 'ArithmeticOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 6,
        CATEGORIES: [],
        categoryMatches: [35, 36],
        categoryMatchesMap: {
          '35': true,
          '36': true
        },
        isParent: true
      }],
      tokenTypeIdx: 35,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Add'
    }
  }, {
    image: ' ',
    startOffset: 584,
    endOffset: 584,
    startLine: 29,
    endLine: 29,
    startColumn: 35,
    endColumn: 35,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 585,
    endOffset: 585,
    startLine: 29,
    endLine: 29,
    startColumn: 36,
    endColumn: 36,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: '1',
    startOffset: 586,
    endOffset: 586,
    startLine: 29,
    endLine: 29,
    startColumn: 37,
    endColumn: 37,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ' ',
    startOffset: 587,
    endOffset: 587,
    startLine: 29,
    endLine: 29,
    startColumn: 38,
    endColumn: 38,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '==',
    startOffset: 588,
    endOffset: 589,
    startLine: 29,
    endLine: 29,
    startColumn: 39,
    endColumn: 40,
    tokenTypeIdx: 29,
    tokenType: {
      name: 'TknComparisonEqual',
      PATTERN: /==/,
      CATEGORIES: [{
        name: 'ComparisonOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 4,
        CATEGORIES: [],
        categoryMatches: [29, 30],
        categoryMatchesMap: {
          '29': true,
          '30': true
        },
        isParent: true
      }],
      tokenTypeIdx: 29,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Comparison Equal'
    }
  }, {
    image: ' ',
    startOffset: 590,
    endOffset: 590,
    startLine: 29,
    endLine: 29,
    startColumn: 41,
    endColumn: 41,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 591,
    endOffset: 591,
    startLine: 29,
    endLine: 29,
    startColumn: 42,
    endColumn: 42,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ')',
    startOffset: 592,
    endOffset: 592,
    startLine: 29,
    endLine: 29,
    startColumn: 43,
    endColumn: 43,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ' ',
    startOffset: 593,
    endOffset: 593,
    startLine: 29,
    endLine: 29,
    startColumn: 44,
    endColumn: 44,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '+',
    startOffset: 594,
    endOffset: 594,
    startLine: 29,
    endLine: 29,
    startColumn: 45,
    endColumn: 45,
    tokenTypeIdx: 35,
    tokenType: {
      name: 'TknAdd',
      PATTERN: /\+/,
      CATEGORIES: [{
        name: 'ArithmeticOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 6,
        CATEGORIES: [],
        categoryMatches: [35, 36],
        categoryMatchesMap: {
          '35': true,
          '36': true
        },
        isParent: true
      }],
      tokenTypeIdx: 35,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Add'
    }
  }, {
    image: ' ',
    startOffset: 595,
    endOffset: 595,
    startLine: 29,
    endLine: 29,
    startColumn: 46,
    endColumn: 46,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'true',
    startOffset: 596,
    endOffset: 599,
    startLine: 29,
    endLine: 29,
    startColumn: 47,
    endColumn: 50,
    tokenTypeIdx: 39,
    tokenType: {
      name: 'Constant',
      PATTERN: /(?:true|false|void)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 39,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Constant Literal'
    }
  }, {
    image: ';',
    startOffset: 600,
    endOffset: 600,
    startLine: 29,
    endLine: 29,
    startColumn: 51,
    endColumn: 51,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 601,
    endOffset: 602,
    startLine: 29,
    endLine: 29,
    startColumn: 52,
    endColumn: 53,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'let',
    startOffset: 603,
    endOffset: 605,
    startLine: 30,
    endLine: 30,
    startColumn: 1,
    endColumn: 3,
    tokenTypeIdx: 13,
    tokenType: {
      name: 'LetToken',
      PATTERN: /let/,
      tokenTypeIdx: 13,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Let'
    }
  }, {
    image: ' ',
    startOffset: 606,
    endOffset: 606,
    startLine: 30,
    endLine: 30,
    startColumn: 4,
    endColumn: 4,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'f',
    startOffset: 607,
    endOffset: 607,
    startLine: 30,
    endLine: 30,
    startColumn: 5,
    endColumn: 5,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 608,
    endOffset: 608,
    startLine: 30,
    endLine: 30,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 609,
    endOffset: 609,
    startLine: 30,
    endLine: 30,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'Function',
    startOffset: 610,
    endOffset: 617,
    startLine: 30,
    endLine: 30,
    startColumn: 8,
    endColumn: 15,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 618,
    endOffset: 618,
    startLine: 30,
    endLine: 30,
    startColumn: 16,
    endColumn: 16,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '=',
    startOffset: 619,
    endOffset: 619,
    startLine: 30,
    endLine: 30,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 34,
    tokenType: {
      name: 'TknEqual',
      PATTERN: /=/,
      CATEGORIES: [{
        name: 'AssignmentOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 5,
        CATEGORIES: [],
        categoryMatches: [34],
        categoryMatchesMap: {
          '34': true
        },
        isParent: true
      }],
      tokenTypeIdx: 34,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Equal'
    }
  }, {
    image: ' ',
    startOffset: 620,
    endOffset: 620,
    startLine: 30,
    endLine: 30,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '(',
    startOffset: 621,
    endOffset: 621,
    startLine: 30,
    endLine: 30,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: 'test',
    startOffset: 622,
    endOffset: 625,
    startLine: 30,
    endLine: 30,
    startColumn: 20,
    endColumn: 23,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 626,
    endOffset: 626,
    startLine: 30,
    endLine: 30,
    startColumn: 24,
    endColumn: 24,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 627,
    endOffset: 627,
    startLine: 30,
    endLine: 30,
    startColumn: 25,
    endColumn: 25,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'Number',
    startOffset: 628,
    endOffset: 633,
    startLine: 30,
    endLine: 30,
    startColumn: 26,
    endColumn: 31,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ')',
    startOffset: 634,
    endOffset: 634,
    startLine: 30,
    endLine: 30,
    startColumn: 32,
    endColumn: 32,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ':',
    startOffset: 635,
    endOffset: 635,
    startLine: 30,
    endLine: 30,
    startColumn: 33,
    endColumn: 33,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 636,
    endOffset: 636,
    startLine: 30,
    endLine: 30,
    startColumn: 34,
    endColumn: 34,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'Number',
    startOffset: 637,
    endOffset: 642,
    startLine: 30,
    endLine: 30,
    startColumn: 35,
    endColumn: 40,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 643,
    endOffset: 643,
    startLine: 30,
    endLine: 30,
    startColumn: 41,
    endColumn: 41,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '=>',
    startOffset: 644,
    endOffset: 645,
    startLine: 30,
    endLine: 30,
    startColumn: 42,
    endColumn: 43,
    tokenTypeIdx: 31,
    tokenType: {
      name: 'TknArrow',
      PATTERN: /=>/,
      tokenTypeIdx: 31,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Arrow'
    }
  }, {
    image: ' ',
    startOffset: 646,
    endOffset: 646,
    startLine: 30,
    endLine: 30,
    startColumn: 44,
    endColumn: 44,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '{',
    startOffset: 647,
    endOffset: 647,
    startLine: 30,
    endLine: 30,
    startColumn: 45,
    endColumn: 45,
    tokenTypeIdx: 18,
    tokenType: {
      name: 'LeftBrace',
      PATTERN: /\{/,
      tokenTypeIdx: 18,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Brace'
    }
  }, {
    image: '\r\n  ',
    startOffset: 648,
    endOffset: 651,
    startLine: 30,
    endLine: 31,
    startColumn: 46,
    endColumn: 2,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'return',
    startOffset: 652,
    endOffset: 657,
    startLine: 31,
    endLine: 31,
    startColumn: 3,
    endColumn: 8,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: '(',
    startOffset: 658,
    endOffset: 658,
    startLine: 31,
    endLine: 31,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 16,
    tokenType: {
      name: 'LeftParen',
      PATTERN: /\(/,
      tokenTypeIdx: 16,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Left Parenthesis'
    }
  }, {
    image: 'test',
    startOffset: 659,
    endOffset: 662,
    startLine: 31,
    endLine: 31,
    startColumn: 10,
    endColumn: 13,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ')',
    startOffset: 663,
    endOffset: 663,
    startLine: 31,
    endLine: 31,
    startColumn: 14,
    endColumn: 14,
    tokenTypeIdx: 17,
    tokenType: {
      name: 'RightParen',
      PATTERN: /\)/,
      tokenTypeIdx: 17,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Parenthesis'
    }
  }, {
    image: ';',
    startOffset: 664,
    endOffset: 664,
    startLine: 31,
    endLine: 31,
    startColumn: 15,
    endColumn: 15,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 665,
    endOffset: 666,
    startLine: 31,
    endLine: 31,
    startColumn: 16,
    endColumn: 17,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '}',
    startOffset: 667,
    endOffset: 667,
    startLine: 32,
    endLine: 32,
    startColumn: 1,
    endColumn: 1,
    tokenTypeIdx: 19,
    tokenType: {
      name: 'RightBrace',
      PATTERN: /\}/,
      tokenTypeIdx: 19,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Right Brace'
    }
  }, {
    image: ';',
    startOffset: 668,
    endOffset: 668,
    startLine: 32,
    endLine: 32,
    startColumn: 2,
    endColumn: 2,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n',
    startOffset: 669,
    endOffset: 670,
    startLine: 32,
    endLine: 32,
    startColumn: 3,
    endColumn: 4,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'const',
    startOffset: 671,
    endOffset: 675,
    startLine: 33,
    endLine: 33,
    startColumn: 1,
    endColumn: 5,
    tokenTypeIdx: 12,
    tokenType: {
      name: 'ConstToken',
      PATTERN: /const/,
      tokenTypeIdx: 12,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Const'
    }
  }, {
    image: ' ',
    startOffset: 676,
    endOffset: 676,
    startLine: 33,
    endLine: 33,
    startColumn: 6,
    endColumn: 6,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'a',
    startOffset: 677,
    endOffset: 677,
    startLine: 33,
    endLine: 33,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ':',
    startOffset: 678,
    endOffset: 678,
    startLine: 33,
    endLine: 33,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 26,
    tokenType: {
      name: 'Colon',
      PATTERN: /:/,
      tokenTypeIdx: 26,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Colon'
    }
  }, {
    image: ' ',
    startOffset: 679,
    endOffset: 679,
    startLine: 33,
    endLine: 33,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'Number',
    startOffset: 680,
    endOffset: 685,
    startLine: 33,
    endLine: 33,
    startColumn: 10,
    endColumn: 15,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ' ',
    startOffset: 686,
    endOffset: 686,
    startLine: 33,
    endLine: 33,
    startColumn: 16,
    endColumn: 16,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '=',
    startOffset: 687,
    endOffset: 687,
    startLine: 33,
    endLine: 33,
    startColumn: 17,
    endColumn: 17,
    tokenTypeIdx: 34,
    tokenType: {
      name: 'TknEqual',
      PATTERN: /=/,
      CATEGORIES: [{
        name: 'AssignmentOperators',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 5,
        CATEGORIES: [],
        categoryMatches: [34],
        categoryMatchesMap: {
          '34': true
        },
        isParent: true
      }],
      tokenTypeIdx: 34,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Equal'
    }
  }, {
    image: ' ',
    startOffset: 688,
    endOffset: 688,
    startLine: 33,
    endLine: 33,
    startColumn: 18,
    endColumn: 18,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '1',
    startOffset: 689,
    endOffset: 689,
    startLine: 33,
    endLine: 33,
    startColumn: 19,
    endColumn: 19,
    tokenTypeIdx: 38,
    tokenType: {
      name: 'Number',
      PATTERN: /[-|+]?[0-9]*(?:\.?[0-9]+)/,
      CATEGORIES: [{
        name: 'Literals',
        PATTERN: Lexer.NA,
        tokenTypeIdx: 3,
        CATEGORIES: [],
        categoryMatches: [37, 38, 39, 40],
        categoryMatchesMap: {
          '37': true,
          '38': true,
          '39': true,
          '40': true
        },
        isParent: true
      }],
      tokenTypeIdx: 38,
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Number Literal'
    }
  }, {
    image: ';',
    startOffset: 690,
    endOffset: 690,
    startLine: 33,
    endLine: 33,
    startColumn: 20,
    endColumn: 20,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }, {
    image: '\r\n\r\n',
    startOffset: 691,
    endOffset: 694,
    startLine: 33,
    endLine: 34,
    startColumn: 21,
    endColumn: 1,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: '\r\n',
    startOffset: 710,
    endOffset: 711,
    startLine: 35,
    endLine: 35,
    startColumn: 16,
    endColumn: 17,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'export',
    startOffset: 712,
    endOffset: 717,
    startLine: 36,
    endLine: 36,
    startColumn: 1,
    endColumn: 6,
    tokenTypeIdx: 11,
    tokenType: {
      name: 'ExportToken',
      PATTERN: /export/,
      tokenTypeIdx: 11,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Export'
    }
  }, {
    image: ' ',
    startOffset: 718,
    endOffset: 718,
    startLine: 36,
    endLine: 36,
    startColumn: 7,
    endColumn: 7,
    tokenTypeIdx: 28,
    tokenType: {
      name: 'Space',
      PATTERN: /[ \t\s\r\n]+/,
      tokenTypeIdx: 28,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Whitespace',
      LINE_BREAKS: true
    }
  }, {
    image: 'f',
    startOffset: 719,
    endOffset: 719,
    startLine: 36,
    endLine: 36,
    startColumn: 8,
    endColumn: 8,
    tokenTypeIdx: 43,
    tokenType: {
      name: 'TknIdentifier',
      PATTERN: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
      tokenTypeIdx: 43,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Identifier'
    }
  }, {
    image: ';',
    startOffset: 720,
    endOffset: 720,
    startLine: 36,
    endLine: 36,
    startColumn: 9,
    endColumn: 9,
    tokenTypeIdx: 27,
    tokenType: {
      name: 'Semicolon',
      PATTERN: /;/,
      tokenTypeIdx: 27,
      CATEGORIES: [],
      categoryMatches: [],
      categoryMatchesMap: {},
      isParent: false,
      LABEL: 'Semicolon'
    }
  }],
  groups: {},
  errors: []
};
export default data;