import {
  CustomPatternMatcherFunc,
  CustomPatternMatcherReturn,
  Lexer,
  createToken,
} from 'chevrotain';
import { LexerTokenType } from '../Types/LexerNodes';
import { NumberStyle, NumberType } from '../Types/Types';
// =================================================================
const matchNumber = (numberType: NumberType): CustomPatternMatcherFunc => {
  // Matching
  return (str: string, startOffset: number): CustomPatternMatcherReturn | null => {
    // Matching
    let currentChar = str.charAt(startOffset);
    if (
      currentChar == '.' ||
      (currentChar.charCodeAt(0) >= 48 && currentChar.charCodeAt(0) <= 57)
    ) {
      // Configuration
      const AllowDecimal =
        numberType == NumberType.Number ||
        numberType == NumberType.F32 ||
        numberType == NumberType.F64;
      if (!AllowDecimal && currentChar == '.') return null;
      // Parsing
      let endOffset = startOffset,
        numberStyle = NumberStyle.Decimal,
        length = 0;
      // Determine What Type Of Number We Are Parsing
      if (currentChar == '0') {
        endOffset++;
        currentChar = str.charAt(endOffset);
        // This could be binary, Hexadecimal, Octal
        if (currentChar == 'b' || currentChar == 'B') numberStyle = NumberStyle.Binary; // Binary
        if (currentChar == 'o' || currentChar == 'O') numberStyle = NumberStyle.Octal; // Octal
        if (
          (currentChar == 'x' || currentChar == 'X') &&
          !(numberType == NumberType.F32 || numberType == NumberType.F64)
        )
          numberStyle = NumberStyle.Hexadecimal; // Hexadecimal
        if (numberStyle != NumberStyle.Decimal) endOffset++;
        else endOffset--;
      }
      // Parse Number
      let hitDecimalPoint = false,
        lastCharacter = '';
      for (; endOffset < str.length; endOffset++) {
        // Set Current Character
        currentChar = str.charAt(endOffset);
        const charCode = currentChar.charCodeAt(0);
        // Start Parsing
        if (currentChar == '_' && lastCharacter != '_') continue;
        // Parse Decimal
        if (numberStyle == NumberStyle.Decimal) {
          if (currentChar == '.' && AllowDecimal && !hitDecimalPoint) {
            hitDecimalPoint = true;
            continue;
          }
          if (!(charCode >= 48 && charCode <= 57)) break;
        }
        // Parse Binary,Octal,Hexadecimal
        if (numberStyle == NumberStyle.Binary && !(currentChar == '0' || currentChar == '1')) break;
        if (numberStyle == NumberStyle.Octal && !(charCode >= 48 && charCode <= 55)) break;
        if (
          numberStyle == NumberStyle.Hexadecimal &&
          !(
            (charCode >= 48 && charCode <= 57) ||
            (charCode >= 65 && charCode <= 70) ||
            (charCode >= 97 && charCode <= 102)
          )
        )
          break;
        // Set Last Character
        lastCharacter = currentChar;
        length++;
      }
      // Check we actually have our tag
      if (numberType == NumberType.I32 && str.charAt(endOffset) != 'n') return null;
      if (numberType == NumberType.I64 && str.charAt(endOffset) != 'N') return null;
      if (numberType == NumberType.F32 && str.charAt(endOffset) != 'f') return null;
      if (numberType == NumberType.F64 && str.charAt(endOffset) != 'F') return null;
      if (numberType == NumberType.U32 && str.charAt(endOffset) != 'u') return null;
      if (numberType == NumberType.U64 && str.charAt(endOffset) != 'U') return null;
      // Increment
      if (numberType != NumberType.Number) endOffset++;
      // Return Results
      if (length != 0) {
        // Set the result
        const result: CustomPatternMatcherReturn = [str.slice(startOffset, endOffset)];
        // Return the result
        return result;
      }
    }
    return null;
  };
};
// =================================================================
// Categories
export const keywordTokens = createToken({
  name: LexerTokenType.Keywords,
  pattern: Lexer.NA,
});
export const literalTokens = createToken({
  name: LexerTokenType.Literals,
  pattern: Lexer.NA,
});
export const separatorTokens = createToken({
  name: LexerTokenType.Separators,
  pattern: Lexer.NA,
});
export const operators = createToken({
  name: LexerTokenType.Operators,
  pattern: Lexer.NA,
});
export const expressionOperators = createToken({
  name: LexerTokenType.ExpressionOperators,
  categories: operators,
  pattern: Lexer.NA,
});
export const statementOperators = createToken({
  name: LexerTokenType.StatementOperators,
  categories: operators,
  pattern: Lexer.NA,
});
export const assignmentOperators = createToken({
  name: LexerTokenType.AssignmentOperators,
  categories: operators,
  pattern: Lexer.NA,
});
export const operators180 = createToken({
  name: LexerTokenType.Operators180,
  categories: operators,
  pattern: Lexer.NA,
});
export const operators170 = createToken({
  name: LexerTokenType.Operators170,
  categories: operators,
  pattern: Lexer.NA,
});
export const operators160 = createToken({
  name: LexerTokenType.Operators160,
  categories: operators,
  pattern: Lexer.NA,
});
export const operators150 = createToken({
  name: LexerTokenType.Operators150,
  categories: operators,
  pattern: Lexer.NA,
});
export const operators140 = createToken({
  name: LexerTokenType.Operators140,
  categories: operators,
  pattern: Lexer.NA,
});
export const reserved = createToken({
  name: LexerTokenType.Reserved,
  pattern: Lexer.NA,
});
// Comments
export const TknComment = createToken({
  label: 'Comment',
  name: LexerTokenType.TknComment,
  group: Lexer.SKIPPED,
  pattern: /\/\/.*/,
}); // Comment
// Keywords
export const TknImport = createToken({
  label: 'Import',
  name: LexerTokenType.ImportToken,
  pattern: 'import',
  categories: keywordTokens,
});
export const TknWasm = createToken({
  label: 'Wasm Import Identifier',
  name: LexerTokenType.WasmToken,
  pattern: 'wasm',
  categories: keywordTokens,
});
export const TknFrom = createToken({
  label: 'From',
  name: LexerTokenType.FromToken,
  pattern: 'from',
  categories: keywordTokens,
});
export const TknExport = createToken({
  label: 'Export',
  name: LexerTokenType.ExportToken,
  pattern: 'export',
  categories: keywordTokens,
});
export const TknConst = createToken({
  label: 'Const',
  name: LexerTokenType.ConstToken,
  pattern: 'const',
  categories: keywordTokens,
});
export const TknLet = createToken({
  label: 'Let',
  name: LexerTokenType.LetToken,
  pattern: 'let',
  categories: keywordTokens,
});
export const TknIf = createToken({
  label: 'If',
  name: LexerTokenType.IfToken,
  pattern: 'if',
  categories: keywordTokens,
});
export const TknElse = createToken({
  label: 'Else',
  name: LexerTokenType.ElseToken,
  pattern: 'else',
  categories: keywordTokens,
});
export const TknWhile = createToken({
  label: 'While',
  name: LexerTokenType.TknWhile,
  pattern: 'while',
  categories: keywordTokens,
});
export const TknBreakIf = createToken({
  label: 'BreakIf',
  name: LexerTokenType.TknBreakIf,
  pattern: 'breakif',
  categories: keywordTokens,
});
export const TknBreak = createToken({
  label: 'Break',
  name: LexerTokenType.TknBreak,
  pattern: 'break',
  categories: keywordTokens,
});
export const TknContinueIf = createToken({
  label: 'ContinueIf',
  name: LexerTokenType.TknContinueIf,
  pattern: 'continueif',
  categories: keywordTokens,
});
export const TknContinue = createToken({
  label: 'Continue',
  name: LexerTokenType.TknContinue,
  pattern: 'continue',
  categories: keywordTokens,
});
export const TknInterface = createToken({
  label: 'Interface',
  name: LexerTokenType.InterfaceToken,
  pattern: 'interface',
  categories: keywordTokens,
});
export const TknType = createToken({
  label: 'Type',
  name: LexerTokenType.TypeToken,
  pattern: 'type',
  categories: keywordTokens,
});
export const TknReturn = createToken({
  label: 'Return',
  name: LexerTokenType.ReturnToken,
  pattern: 'return',
  categories: keywordTokens,
});
export const TknEnum = createToken({
  label: 'Enum',
  name: LexerTokenType.TknEnum,
  pattern: 'enum',
  categories: keywordTokens,
});
// Literals
export const TknString = createToken({
  label: 'String Literal',
  name: LexerTokenType.TknStringLiteral,
  categories: literalTokens,
  pattern: /'(?:[^\\'\n\r]|\\(?:[bfnrtv'\\]|u[0-9a-fA-F]{4}))*'/,
}); // String
export const TknI32 = createToken({
  label: 'I32 Literal',
  name: LexerTokenType.TknI32Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.I32),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}); // I32
export const TknI64 = createToken({
  label: 'I64 Literal',
  name: LexerTokenType.TknI64Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.I64),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}); // I64
export const TknU32 = createToken({
  label: 'U32 Literal',
  name: LexerTokenType.TknU32Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.U32),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}); // U32
export const TknU64 = createToken({
  label: 'U64 Literal',
  name: LexerTokenType.TknU64Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.U64),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
}); // U64
export const TknF32 = createToken({
  label: 'F32 Literal',
  name: LexerTokenType.TknF32Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.F32),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
}); // F32
export const TknF64 = createToken({
  label: 'F64 Literal',
  name: LexerTokenType.TknF64Literal,
  categories: literalTokens,
  pattern: matchNumber(NumberType.F64),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
}); // F64
export const TknNumber = createToken({
  label: 'Number Literal',
  name: LexerTokenType.TknNumberLiteral,
  categories: literalTokens,
  pattern: matchNumber(NumberType.Number),
  line_breaks: false,
  start_chars_hint: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'],
}); // Number
export const TknConstant = createToken({
  label: 'Constant Literal',
  name: LexerTokenType.TknConstantLiteral,
  categories: literalTokens,
  pattern: /(?:true|false|void)/,
}); // Constant
export const TknWasmCall = createToken({
  label: 'Wasm Call',
  name: LexerTokenType.TknWasmCall,
  categories: literalTokens,
  pattern: /@wasm((\.[1-9a-zA-Z$_]+)+)/,
}); // Wasm Call
// Separators
export const TknLParen = createToken({
  label: 'Left Parenthesis',
  name: LexerTokenType.LeftParenthesis,
  categories: separatorTokens,
  pattern: '(',
});
export const TknRParen = createToken({
  label: 'Right Parenthesis',
  name: LexerTokenType.RightParenthesis,
  categories: separatorTokens,
  pattern: ')',
});
export const TknLBrace = createToken({
  label: 'Left Brace',
  name: LexerTokenType.LeftBrace,
  categories: separatorTokens,
  pattern: '{',
});
export const TknRBrace = createToken({
  label: 'Right Brace',
  name: LexerTokenType.RightBrace,
  categories: separatorTokens,
  pattern: '}',
});
export const TknLBracket = createToken({
  label: 'Left Bracket',
  name: LexerTokenType.LeftBracket,
  categories: separatorTokens,
  pattern: '[',
});
export const TknRBracket = createToken({
  label: 'Right Bracket',
  name: LexerTokenType.RightBracket,
  categories: separatorTokens,
  pattern: ']',
});
export const TknComma = createToken({
  label: 'Comma',
  name: LexerTokenType.Comma,
  categories: separatorTokens,
  pattern: ',',
});
export const TknEllipsis = createToken({
  label: 'Tkn Ellipsis',
  name: LexerTokenType.TknEllipsis,
  pattern: '...',
});
export const TknPeriod = createToken({
  label: 'Period',
  name: LexerTokenType.Period,
  categories: separatorTokens,
  pattern: '.',
});
export const TknColon = createToken({
  label: 'Colon',
  name: LexerTokenType.Colon,
  categories: separatorTokens,
  pattern: ':',
});
export const TknSemiColon = createToken({
  label: 'Semicolon',
  name: LexerTokenType.Semicolon,
  categories: separatorTokens,
  pattern: ';',
});
export const TknThickArrow = createToken({
  label: 'ThickArrow',
  name: LexerTokenType.ThickArrow,
  categories: separatorTokens,
  pattern: '=>',
});
export const TknWhitespace = createToken({
  label: 'Whitespace',
  name: LexerTokenType.WhiteSpace,
  group: Lexer.SKIPPED,
  pattern: /[ \t\s\r\n]+/,
  line_breaks: true,
}); // ws
// Expression Operators
export const TknOperator180 = createToken({
  label: 'TknInFix180',
  name: LexerTokenType.TknOperator180,
  categories: operators180,
  pattern: /(\*\*)[~$&*/+\-=><^|!?%:.]*/,
});
export const TknOperator170 = createToken({
  label: 'TknInFix170',
  name: LexerTokenType.TknOperator170,
  categories: operators170,
  pattern: /(\*|\/|%)[~$&*/+\-=><^|!?%:.]*/,
});
export const TknOperator160 = createToken({
  label: 'TknInFix160',
  name: LexerTokenType.TknOperator160,
  categories: operators160,
  pattern: /(\+|-)[~$&*/+\-=><^|!?%:.]*/,
});
export const TknOperator150 = createToken({
  label: 'TknInFix150',
  name: LexerTokenType.TknOperator150,
  categories: operators150,
  pattern: /(\^|==|!=|<=|>=)[~$&*/+\-=><^|!?%:.]*/,
});
export const TknOperator140 = createToken({
  label: 'TknInFix140',
  name: LexerTokenType.TknOperator140,
  categories: operators140,
  pattern: /(&|\$|\|\||!|#)[~$&*/+\-=><^|!?%:.]*/,
});
export const TknLeftArrow = createToken({
  label: 'LeftArrow',
  name: LexerTokenType.TknLeftArrow,
  categories: operators140,
  pattern: '<',
});
export const TknRightArrow = createToken({
  label: 'RightArrow',
  name: LexerTokenType.TknRightArrow,
  categories: operators140,
  pattern: '>',
});
export const TknQuestionMark = createToken({
  label: 'Tkn Question Mark',
  name: LexerTokenType.TknQuestionMark,
  categories: operators140,
  pattern: '?',
});
export const TknUnion = createToken({
  label: 'Tkn Union',
  name: LexerTokenType.TknUnion,
  categories: operators,
  pattern: '|',
});
// Statement Operators
export const TknAssignmentOperator = createToken({
  label: 'TknAssignmentOperator',
  name: LexerTokenType.TknAssignmentOperator,
  categories: assignmentOperators,
  pattern: /[~$&*/+\-^|?%:.]=/,
});
export const TknEqual = createToken({
  label: 'Equal',
  name: LexerTokenType.TknAssignmentOperator,
  categories: assignmentOperators,
  pattern: '=',
});
// Reserved Tokens
export const TknMatch = createToken({
  label: 'Match',
  name: LexerTokenType.TknMatch,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'match',
});
export const TknClass = createToken({
  label: 'Class',
  name: LexerTokenType.TknClass,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'class',
});
export const TknImplements = createToken({
  label: 'Implements',
  name: LexerTokenType.TknImplements,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'implements',
});
export const TknExtends = createToken({
  label: 'Extends',
  name: LexerTokenType.TknExtends,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'extends',
});
export const TknFor = createToken({
  label: 'For',
  name: LexerTokenType.TknFor,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'for',
});
export const TknAwait = createToken({
  label: 'Await',
  name: LexerTokenType.TknAwait,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'await',
});
export const TknAsync = createToken({
  label: 'Async',
  name: LexerTokenType.TknAsync,
  categories: reserved,
  group: LexerTokenType.Reserved,
  pattern: 'async',
});
// Flags
export const TknFlag = createToken({
  label: 'Flag',
  name: LexerTokenType.TknFlag,
  pattern: /@(operator|unsafe|inline)/,
}); // Flag
// Marker
export const TknMarker = createToken({
  label: 'TknMarker',
  name: LexerTokenType.TknMarker,
  pattern: '@',
}); // Flag
// Identifiers
export const TknIdentifier = createToken({
  label: 'Identifier',
  name: LexerTokenType.TknIdentifier,
  pattern: /[a-zA-Z$_][1-9a-zA-Z$_]*/,
}); // Identifier
// =================================================================
export const Tokens = [
  TknWhitespace,
  // Categories
  keywordTokens,
  literalTokens,
  separatorTokens,
  operators,
  expressionOperators,
  statementOperators,
  operators180,
  operators170,
  operators160,
  operators150,
  operators140,
  reserved,
  // Comments
  TknComment,
  // Literals
  literalTokens,
  TknString,
  TknI32,
  TknI64,
  TknU32,
  TknU64,
  TknF32,
  TknF64,
  TknNumber,
  TknConstant,
  TknWasmCall,
  // Keywords
  TknImport,
  TknWasm,
  TknFrom,
  TknExport,
  TknConst,
  TknLet,
  TknIf,
  TknElse,
  TknWhile,
  TknBreakIf,
  TknBreak,
  TknContinueIf,
  TknContinue,
  TknInterface,
  TknType,
  TknReturn,
  TknEnum,
  // Separators
  TknLParen,
  TknRParen,
  TknLBrace,
  TknRBrace,
  TknLBracket,
  TknRBracket,
  TknComma,
  TknEllipsis,
  TknPeriod,
  TknColon,
  TknSemiColon,
  TknThickArrow,
  // Operators
  TknAssignmentOperator,
  TknOperator180,
  TknOperator170,
  TknOperator160,
  TknOperator150,
  TknOperator140,
  TknLeftArrow,
  TknRightArrow,
  TknEqual,
  TknQuestionMark,
  TknUnion,
  // Reserved Tokens
  TknMatch,
  TknClass,
  TknImplements,
  TknExtends,
  TknFor,
  TknAwait,
  TknAsync,
  // Flags
  TknFlag,
  // Marker
  TknMarker,
  // Identifiers
  TknIdentifier,
];
