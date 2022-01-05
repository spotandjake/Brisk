// Imports
import { CstParser, TokenType, ILexingResult } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
// Parser
class Parser extends CstParser {
  constructor(tokens: TokenType[]) {
    super(tokens, {
      // TODO: The lower we can make this number the faster our parser
      maxLookahead: 3
    });
    this.performSelfAnalysis();
  }
  // Grammar
  public program = this.RULE('Program', () => {
    this.SUBRULE(this.statementList);
  });
  private statementList = this.RULE('StatementList', () => {
    this.MANY(() => {
      this.SUBRULE(this.wss);
      this.SUBRULE(this.statement);
      this.SUBRULE1(this.wss);
    });
  });
  private statement = this.RULE('Statement', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.emptyStatement) },
      { ALT: () => this.SUBRULE(this.importStatement) },
      { ALT: () => this.SUBRULE(this.wasmImportStatement) },
      { ALT: () => this.SUBRULE(this.exportStatement) },
      { ALT: () => this.SUBRULE(this.constantDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
    ]);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.TknSemiColon);
  });
  // Statements
  private emptyStatement = this.RULE('EmptyStatement', () => {
    this.CONSUME(Tokens.TknSemiColon);
  });
  private importStatement = this.RULE('ImportStatement', () => {
    this.SUBRULE(this.importStart);
    this.SUBRULE(this.variable);
    this.SUBRULE1(this.ws);
    this.CONSUME(Tokens.TknFrom);
    this.SUBRULE2(this.ws);
    this.SUBRULE(this.stringLiteral);
  });
  private wasmImportStatement = this.RULE('WasmImportStatement', () => {
    this.SUBRULE(this.importStart);
    this.CONSUME(Tokens.TknWasm);
    this.SUBRULE1(this.ws);
    this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.SUBRULE(this.wasmType);
    this.SUBRULE2(this.ws);
    this.CONSUME(Tokens.TknFrom);
    this.SUBRULE3(this.ws);
    this.SUBRULE(this.stringLiteral);
  });
  private exportStatement = this.RULE('ExportStatement', () => {
    this.CONSUME(Tokens.TknExport);
    this.SUBRULE(this.wss);
    this.SUBRULE(this.variable);
  });
  private constantDeclarationStatement = this.RULE('ConstantDeclaration', () => {
    this.CONSUME(Tokens.TknConst);
    this.SUBRULE(this.ws);
    this.SUBRULE(this.variable);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE2(this.wss);
    this.SUBRULE(this.expression); // TODO: Make Expression
  });
  private declarationStatement = this.RULE('Declaration', () => {
    this.CONSUME(Tokens.TknLet);
    this.SUBRULE(this.ws);
    this.SUBRULE(this.variable);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE2(this.wss);
    this.SUBRULE(this.expression); // TODO: Make Expression
  });
  // Expressions
  private expression = this.RULE('Expression', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.atom) },
      { ALT: () => this.SUBRULE(this.arithmeticExpression) },
      { ALT: () => this.SUBRULE(this.logicalExpression) },
      { ALT: () => this.SUBRULE(this.comparisonExpression) },
    ]);
  });
  private arithmeticExpression = this.RULE('ArithmeticExpression', () => {
    this.SUBRULE(this.expression);
    this.CONSUME(Tokens.arithmeticOperators);
    this.SUBRULE1(this.expression);
  });
  private logicalExpression = this.RULE('LogicalExpression', () => {
    this.CONSUME(Tokens.logicalOperators);
    this.SUBRULE(this.expression);
  });
  private comparisonExpression = this.RULE('ComparisonExpression', () => {
    this.SUBRULE(this.expression);
    this.CONSUME(Tokens.comparisonOperators);
    this.SUBRULE1(this.expression);
  });
  // Atoms
  private atom = this.RULE('Atom', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.stringLiteral) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.variable) },
    ]);
  });
  // Literals
  private stringLiteral = this.RULE('StringLiteral', () => {
    this.CONSUME(Tokens.TknString);
  });
  private numberLiteral = this.RULE('NumberLiteral', () => {
    this.CONSUME(Tokens.TknNumber);
  });
  private constantLiteral = this.RULE('ConstantLiteral', () => {
    this.CONSUME(Tokens.TknConstant);
  });
  private variable = this.RULE('Variable', () => {
    this.CONSUME(Tokens.TknIdentifier);
  });
  // Types
  private wasmType = this.RULE('wasmType', () => {
    this.SUBRULE(this.typeStart);
    this.OR([
      { ALT: () => this.SUBRULE(this.wasmFunctionSignature) },
      { ALT: () => this.SUBRULE(this.typeIdentifier) },
    ]);
  });
  private wasmFunctionSignature = this.RULE('WasmFunctionSignature', () => {
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        this.SUBRULE(this.typeIdentifier);
        this.SUBRULE2(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE4(this.wss);
    this.CONSUME(Tokens.TknThinArrow);
    this.SUBRULE5(this.wss);
    this.SUBRULE1(this.typeIdentifier);
  });
  private type = this.RULE('WasmType', () => {
    this.SUBRULE(this.typeStart);
    this.SUBRULE(this.typeIdentifier);
  });
  private typeStart = this.RULE('TypeStart', () => {
    this.CONSUME(Tokens.TknColon);
    this.SUBRULE(this.wss);
  });
  private typeIdentifier = this.RULE('TypeIdentifier', () => {
    this.CONSUME(Tokens.TknIdentifier);
  });
  // General Helpers
  private importStart = this.RULE('Import', () => {
    this.CONSUME(Tokens.TknImport);
    this.SUBRULE(this.ws);
  });
  private ws = this.RULE('WhiteSpace', () => {
    this.CONSUME(Tokens.TknWhitespace);
  });
  private wss = this.RULE('OptionalWhiteSpace', () => {
    this.MANY(() => this.CONSUME(Tokens.TknWhitespace));
  });
}
// Parse code
const parse = (lexingResult: ILexingResult) => {
  // =================================================================
  const parser = new Parser(Tokens.Tokens);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  if (parser.errors.length > 0) {
    // TODO: currently we dont throw an error when there is unknown code we just call it good this is a problem
    // TODO: Better Error handling
    throw new Error('Parsing errors detected');
  }
  console.dir(parser.program(), { depth: null });
  // =================================================================
  return 'test';
};
export default parse;