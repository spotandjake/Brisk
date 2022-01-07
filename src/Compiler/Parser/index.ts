// Imports
import { EmbeddedActionsParser, TokenType, ILexingResult, IToken } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
import { Position } from '../Types/Types';
import * as Nodes from '../Types/ParseNodes';
// Parser
class Parser extends EmbeddedActionsParser {
  private file: string;
  constructor(tokens: TokenType[], file: string) {
    super(tokens, {
      // TODO: The lower we can make this number the faster our parser
      maxLookahead: 3
    });
    this.file = file;
    this.performSelfAnalysis();
  }
  // Grammar
  public program = this.RULE('Program', (): Nodes.ProgramNode => {
    const body = this.SUBRULE(this.statementList);
    return {
      nodeType: Nodes.NodeType.Program,
      category: Nodes.NodeCategory.General,
      body: body,
      position: {
        offset: 0,
        line: 0,
        col: 0,
        file: this.file,
      }
    };
  });
  private statementList = this.RULE('StatementList', (): Nodes.Statement[] => {
    const body: Nodes.Statement[] = [];
    this.SUBRULE(this.wss);
    this.MANY(() => {
      this.OR([
        { ALT: () => body.push(this.SUBRULE(this.statement)) },
        { ALT: () => body.push(this.SUBRULE(this.flag)) },
      ]);
      this.SUBRULE1(this.wss);
    });
    return body;
  });
  private statement = this.RULE('Statement', (): Nodes.Statement => {
    const statement = this.SUBRULE(this._statement);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknSemiColon);
    return statement;
  });
  private _statement = this.RULE('_Statement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.singleLineStatement) },
    ]);
  });
  // Flags
  private flag = this.RULE('Flag', (): Nodes.FlagNode => {
    const flag = this.CONSUME(Tokens.TknFlag);
    return {
      nodeType: Nodes.NodeType.FlagStatement,
      category: Nodes.NodeCategory.Statement,
      value: flag.image,
      position: {
        offset: flag.startOffset,
        line: flag.startLine || 0,
        col: flag.startColumn || 0,
        file: this.file,
      }
    };
  });
  // Statements
  private blockStatement = this.RULE('BlockStatement', (): Nodes.BlockStatementNode => {
    const body: Nodes.Statement[] = [];
    const open = this.CONSUME(Tokens.TknLBrace);
    this.SUBRULE(this.wss);
    this.MANY(() => {
      body.push(this.SUBRULE(this.statement));
      this.SUBRULE1(this.wss);
    });
    this.CONSUME(Tokens.TknRBrace);
    return {
      nodeType: Nodes.NodeType.BlockStatement,
      category: Nodes.NodeCategory.Statement,
      body: body,
      position: {
        offset: open.startOffset,
        line: open.startLine || 0,
        col: open.startColumn || 0,
        file: this.file,
      }
    };
  });
  private singleLineStatement = this.RULE('SingleLineStatement', () => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.importStatement) },
      { ALT: () => this.SUBRULE(this.wasmImportStatement) },
      { ALT: () => this.SUBRULE(this.exportStatement) },
      { ALT: () => this.SUBRULE(this.constantDeclarationStatement) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
      { ALT: () => this.SUBRULE(this.assignmentStatement) },
      { ALT: () => this.SUBRULE(this.callExpression), IGNORE_AMBIGUITIES: true }
      ,
      { ALT: () => this.SUBRULE(this.wasmCallExpression) }
    ]);
  });
  private importStatement = this.RULE('ImportStatement', (): Nodes.ImportStatementNode => {
    const position = this.SUBRULE(this.importStart);
    const variable = this.SUBRULE(this.variable);
    this.SUBRULE1(this.ws);
    this.CONSUME(Tokens.TknFrom);
    this.SUBRULE2(this.ws);
    const source = this.SUBRULE(this.stringLiteral);
    return {
      nodeType: Nodes.NodeType.ImportStatement,
      category: Nodes.NodeCategory.Statement,
      variable: variable, // TODO: we want to add support for destructuring imports
      source: source,
      position: position
    };
  });
  private wasmImportStatement = this.RULE('WasmImportStatement', (): Nodes.WasmImportStatementNode => {
    const position = this.SUBRULE(this.importStart);
    this.CONSUME(Tokens.TknWasm);
    this.SUBRULE1(this.ws);
    const variable = this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    const typeSignature = this.SUBRULE(this.wasmType);
    this.SUBRULE2(this.ws);
    this.CONSUME(Tokens.TknFrom);
    this.SUBRULE3(this.ws);
    const source = this.SUBRULE(this.stringLiteral);
    return {
      nodeType: Nodes.NodeType.WasmImportStatement,
      category: Nodes.NodeCategory.Statement,
      typeSignature: typeSignature,
      variable: variable, // TODO: we want to add support for destructuring imports
      source: source,
      position: position
    };
  });
  private exportStatement = this.RULE('ExportStatement', (): Nodes.ExportStatementNode => {
    const location = this.CONSUME(Tokens.TknExport);
    this.SUBRULE(this.wss);
    const variable = this.SUBRULE(this.variable);
    return {
      nodeType: Nodes.NodeType.ExportStatement,
      category: Nodes.NodeCategory.Statement,
      variable: variable, // Allow exporting groups of variables
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      }
    };
  });
  private constantDeclarationStatement = this.RULE('ConstantDeclaration', () => {
    this.CONSUME(Tokens.TknConst);
    this.SUBRULE(this.ws);
    this.SUBRULE(this.variable);
    this.SUBRULE1(this.wss);
    this.SUBRULE(this.type);
    this.SUBRULE2(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE3(this.wss);
    this.SUBRULE(this.expression);
    return 'TODO';
  });
  private declarationStatement = this.RULE('Declaration', () => {
    this.CONSUME(Tokens.TknLet);
    this.SUBRULE(this.ws);
    this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.SUBRULE(this.type);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE2(this.wss);
    this.SUBRULE(this.expression);
    return 'TODO';
  });
  private assignmentStatement = this.RULE('assignmentStatement', () => {
    this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE1(this.wss);
    this.SUBRULE(this.expression);
    return 'TODO';
  });
  // Expressions
  private expression = this.RULE('Expression', () => {
    this.OR([
      {
        ALT: () => this.SUBRULE(this.callExpression)
      },
      {
        ALT: () => this.SUBRULE(this.wasmCallExpression)
      },
      {
        ALT: () => this.SUBRULE(this.atom), IGNORE_AMBIGUITIES: true
      },
    ]);
    return 'TODO';
  });
  // private parenthesisExpression = this.RULE('ParenthesisExpression', () => {
  //   this.CONSUME(Tokens.TknLParen);
  //   this.SUBRULE(this.callExpression);
  //   this.CONSUME(Tokens.TknRParen);
  // });
  private callExpression = this.RULE('CallExpression', () => {
    this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE1(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE2(this.wss);
        // this.SUBRULE(this.arithmeticExpression);
        this.SUBRULE(this.atom);
        this.SUBRULE3(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    return 'TODO';
  });
  private wasmCallExpression = this.RULE('wasmCallExpression', () => {
    this.CONSUME(Tokens.TknWasmCall);
    this.atLeastOne(0, () => {
      this.SUBRULE(this.wss);
      this.CONSUME(Tokens.TknPeriod);
      this.SUBRULE1(this.wss);
      this.CONSUME(Tokens.TknIdentifier);
      this.SUBRULE2(this.wss);
    });
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE3(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE4(this.wss);
        // this.SUBRULE(this.arithmeticExpression);
        this.SUBRULE(this.atom);
        this.SUBRULE5(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    return 'TODO';
  });
  // private arithmeticExpression = this.RULE('ArithmeticExpression', () => {
  //   this.SUBRULE(this.comparisonExpression);
  //   this.MANY(() => {
  //     this.CONSUME(Tokens.arithmeticOperators);
  //     this.SUBRULE1(this.comparisonExpression);
  //   });
  // });
  // private comparisonExpression = this.RULE('ComparisonExpression', () => {
  //   this.SUBRULE(this.logicalExpression);
  //   this.MANY(() => {
  //     this.CONSUME(Tokens.comparisonOperators);
  //     this.SUBRULE1(this.logicalExpression);
  //   });
  // });
  // private logicalExpression = this.RULE('LogicalExpression', () => { // TODO: these are not working
  //   this.OR([
  //     {
  //       ALT: () => this.SUBRULE(this.atom)
  //     },
  //     {
  //       ALT: () => {
  //         this.CONSUME(Tokens.logicalOperators);
  //         this.SUBRULE1(this.atom);
  //       }
  //     },
  //   ]);
  // });
  // Atoms
  private atom = this.RULE('Atom', (): Nodes.Atom => {
    this.SUBRULE(this.wss);
    const atom = this.OR([
      { ALT: () => this.SUBRULE(this.stringLiteral) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
      { ALT: () => this.SUBRULE(this.variable) },
      { ALT: () => this.SUBRULE(this.propertyAccess), IGNORE_AMBIGUITIES: true },
    ]);
    this.SUBRULE1(this.wss);
    return atom;
  });
  // Literals
  private stringLiteral = this.RULE('StringLiteral', (): Nodes.StringLiteral => {
    const value = this.CONSUME(Tokens.TknString);
    return {
      nodeType: Nodes.NodeType.StringLiteral,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      }
    };
  });
  private numberLiteral = this.RULE('NumberLiteral', (): Nodes.NumberLiteral => {
    const value = this.CONSUME(Tokens.TknNumber);
    return {
      nodeType: Nodes.NodeType.NumberLiteral,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      }
    };
  });
  private constantLiteral = this.RULE('ConstantLiteral', () => {
    const value = this.CONSUME(Tokens.TknConstant);
    return {
      nodeType: Nodes.NodeType.NumberLiteral,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      }
    };
  });
  // TODO: this needs to redone we only want to capture one property and we want this to be captured by a memberStatement or something
  private propertyAccess = this.RULE('PropertyAccess', () => {
    this.SUBRULE(this.variable);
    this.atLeastOne(0, () => {
      this.SUBRULE(this.wss);
      this.CONSUME(Tokens.TknPeriod);
      this.SUBRULE1(this.wss);
      this.CONSUME(Tokens.TknIdentifier);
      this.SUBRULE2(this.wss);
    });
    return 'TODO';
  });
  private variable = this.RULE('Variable', (): Nodes.Variable => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.Variable,
      category: Nodes.NodeCategory.Variable,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        file: this.file,
      },
    };
  });
  private functionDefinition = this.RULE('FunctionDefinition', () => {
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        this.SUBRULE(this.variable);
        this.SUBRULE2(this.wss);
        this.SUBRULE(this.type);
        this.SUBRULE3(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE4(this.wss);
    this.SUBRULE1(this.type);
    this.SUBRULE5(this.wss);
    this.CONSUME(Tokens.TknThickArrow);
    this.SUBRULE6(this.wss);
    this.SUBRULE(this._statement);
    return 'TODO';
  });
  // Types
  private wasmType = this.RULE('wasmType', () => {
    this.SUBRULE(this.typeStart);
    this.OR([
      { ALT: () => this.SUBRULE(this.wasmFunctionSignature) },
      { ALT: () => this.SUBRULE(this.typeIdentifier) },
    ]);
    return 'TODO';
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
    return 'TODO';
  });
  private type = this.RULE('WasmType', () => {
    this.SUBRULE(this.typeStart);
    this.SUBRULE(this.typeIdentifier);
    return 'TODO';
  });
  private typeStart = this.RULE('TypeStart', () => {
    this.CONSUME(Tokens.TknColon);
    this.SUBRULE(this.wss);
    return 'TODO';
  });
  private typeIdentifier = this.RULE('TypeIdentifier', () => {
    this.CONSUME(Tokens.TknIdentifier);
    return 'TODO';
  });
  // General Helpers
  private importStart = this.RULE('Import', (): Position => {
    const location = this.CONSUME(Tokens.TknImport);
    this.SUBRULE(this.ws);
    return {
      offset: location.startOffset,
      line: location.startLine || 0,
      col: location.startColumn || 0,
      file: this.file,
    };
  });
  private ws = this.RULE('WhiteSpace', () => {
    const space = this.CONSUME(Tokens.TknWhitespace);
    return {
      nodeType: Nodes.NodeType.WhiteSpace,
      category: Nodes.NodeCategory.WhiteSpace,
      value: space.image,
      position: {
        offset: space.startOffset,
        line: space.startLine || 0,
        col: space.startColumn || 0,
        file: this.file,
      }
    };
  });
  private wss = this.RULE('OptionalWhiteSpace', (): Nodes.WhiteSpace => {
    const spaces: IToken[] = [];
    this.MANY(() => spaces.push(this.CONSUME(Tokens.TknWhitespace)));
    return {
      nodeType: Nodes.NodeType.WhiteSpace,
      category: Nodes.NodeCategory.WhiteSpace,
      value: spaces.map((space) => space.image).join(''),
      position: {
        offset: spaces[0]?.startOffset || 0,
        line: spaces[0]?.startLine || 0,
        col: spaces[0]?.startColumn || 0,
        file: this.file,
      }
    };
  });
}
// Parse code
const parse = (lexingResult: ILexingResult, file: string) => {
  // =================================================================
  const parser = new Parser(Tokens.Tokens, file);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  if (parser.errors.length > 0) {
    // TODO: currently we dont throw an error when there is unknown code we just call it good this is a problem
    // TODO: Better Error handling
    throw new Error('Parsing errors detected');
  }
  console.log('================================================================');
  console.dir(parser.program(), { depth: null });
  // =================================================================
  return 'test';
};
export default parse;