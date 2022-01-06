// Imports
import { EmbeddedActionsParser, TokenType, ILexingResult, IToken } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
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
    const value = this.SUBRULE(this.statementList);
    return {
      nodeType: Nodes.NodeType.Program,
      category: Nodes.NodeCategory.General,
      // body: value, TODO: Get Value
      // position: TODO: Get Position
    };
  });
  private statementList = this.RULE('StatementList', () => {
    this.SUBRULE(this.wss);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.SUBRULE(this.flag) },
      ]);
      this.SUBRULE1(this.wss);
    });
    return 'TODO';
  });
  private statement = this.RULE('Statement', () => {
    this.SUBRULE(this._statement);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknSemiColon);
    return 'TODO';
  });
  private _statement = this.RULE('_Statement', () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.singleLineStatement) },
    ]);
    return 'TODO';
  });
  // Flags
  private flag = this.RULE('Flag', () => {
    this.CONSUME(Tokens.TknFlag);
    return 'TODO';
  });
  // Statements
  private blockStatement = this.RULE('BlockStatement', () => {
    this.CONSUME(Tokens.TknLBrace);
    this.SUBRULE(this.wss);
    this.MANY(() => {
      this.SUBRULE(this.statement);
      this.SUBRULE1(this.wss);
    });
    this.CONSUME(Tokens.TknRBrace);
    return 'TODO';
  });
  private singleLineStatement = this.RULE('SingleLineStatement', () => {
    this.OR([
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
    return 'TODO';
  });
  private importStatement = this.RULE('ImportStatement', () => {
    this.SUBRULE(this.importStart);
    this.SUBRULE(this.variable);
    this.SUBRULE1(this.ws);
    this.CONSUME(Tokens.TknFrom);
    this.SUBRULE2(this.ws);
    this.SUBRULE(this.stringLiteral);
    return 'TODO';
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
    return 'TODO';
  });
  private exportStatement = this.RULE('ExportStatement', () => {
    this.CONSUME(Tokens.TknExport);
    this.SUBRULE(this.wss);
    this.SUBRULE(this.variable);
    return 'TODO';
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
  private atom = this.RULE('Atom', () => {
    this.SUBRULE(this.wss);
    this.OR([
      { ALT: () => this.SUBRULE(this.stringLiteral) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
      { ALT: () => this.SUBRULE(this.variable) },
      { ALT: () => this.SUBRULE(this.propertyAccess), IGNORE_AMBIGUITIES: true },
    ]);
    this.SUBRULE1(this.wss);
    return 'TODO';
  });
  // Literals
  private stringLiteral = this.RULE('StringLiteral', () => {
    this.CONSUME(Tokens.TknString);
    return 'TODO';
  });
  private numberLiteral = this.RULE('NumberLiteral', () => {
    this.CONSUME(Tokens.TknNumber);
    return 'TODO';
  });
  private constantLiteral = this.RULE('ConstantLiteral', () => {
    this.CONSUME(Tokens.TknConstant);
    return 'TODO';
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
  private variable = this.RULE('Variable', () => {
    this.CONSUME(Tokens.TknIdentifier);
    return 'TODO';
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
  private importStart = this.RULE('Import', () => {
    this.CONSUME(Tokens.TknImport);
    this.SUBRULE(this.ws);
    return 'TODO';
  });
  private ws = this.RULE('WhiteSpace', () => {
    this.CONSUME(Tokens.TknWhitespace);
    return 'TODO';
  });
  private wss = this.RULE('OptionalWhiteSpace', (): Nodes.WhiteSpace => {
    let spaces: IToken[] = [];
    this.MANY(() => {
      spaces.push(this.CONSUME(Tokens.TknWhitespace));
    });
    console.log(spaces);
    return {
      nodeType: Nodes.NodeType.WhiteSpace,
      category: Nodes.NodeCategory.WhiteSpace,
      value: spaces.map((space) => space.image).join(''),
      position: {
        offset: spaces[0].startOffset,
        line: spaces[0].startLine || 0,
        col: spaces[0].startColumn || 0,
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