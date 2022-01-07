// Imports
import { EmbeddedActionsParser, TokenType, ILexingResult, IToken, createSyntaxDiagramsCode } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
import { LexerTokenType } from '../Types/LexerNodes';
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
    const variable = this.SUBRULE(this.variableNode);
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
    const variable = this.SUBRULE(this.variableNode);
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
  private constantDeclarationStatement = this.RULE('ConstantDeclaration', (): Nodes.DeclarationStatementNode => {
    const location = this.CONSUME(Tokens.TknConst);
    this.SUBRULE(this.ws);
    const name = this.SUBRULE(this.variableNode);
    this.SUBRULE1(this.wss);
    const varType = this.SUBRULE(this.type);
    this.SUBRULE2(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE3(this.wss);
    const value = this.SUBRULE(this.expression);
    return {
      nodeType: Nodes.NodeType.DeclarationStatement,
      category: Nodes.NodeCategory.Statement,
      declarationType: Nodes.DeclarationTypes.Constant,
      name: name,
      varType: varType,
      value: value,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private declarationStatement = this.RULE('Declaration', (): Nodes.DeclarationStatementNode => {
    const location = this.CONSUME(Tokens.TknLet);
    this.SUBRULE(this.ws);
    const name = this.SUBRULE(this.variableNode);
    this.SUBRULE(this.wss);
    const varType = this.SUBRULE(this.type);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE2(this.wss);
    const value = this.SUBRULE(this.expression);
    return {
      nodeType: Nodes.NodeType.DeclarationStatement,
      category: Nodes.NodeCategory.Statement,
      declarationType: Nodes.DeclarationTypes.Lexical,
      name: name,
      varType: varType,
      value: value,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private assignmentStatement = this.RULE('assignmentStatement', (): Nodes.AssignmentStatementNode => {
    const name = this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE1(this.wss);
    const value = this.SUBRULE(this.expression);
    return {
      nodeType: Nodes.NodeType.AssignmentStatement,
      category: Nodes.NodeCategory.Statement,
      name: name,
      value: value,
      position: name.position,
    };
  });
  // Expressions
  private expression = this.RULE('Expression', (): Nodes.Expression => {
    return this.SUBRULE(this.arithmeticExpression);
  });
  // private comparisonExpression = this.RULE('ComparisonExpression', () => {
  //   this.SUBRULE(this.logicalExpression);
  //   this.MANY(() => {
  //     this.CONSUME(Tokens.comparisonOperators);
  //     this.SUBRULE1(this.logicalExpression);
  //   });
  // });
  // TODO: we cannot wrap these in parenthesis at the moment that is a problem
  private arithmeticExpression = this.RULE('ArithmeticExpression', (): Nodes.Expression | Nodes.ArithmeticExpressionNode => {
    const operators: Nodes.ArithmeticExpressionOperator[] = [];
    const expressions: Nodes.Expression[] = [];
    const lhs = this.SUBRULE(this.simpleExpression);
    this.MANY(() => {
      switch (this.CONSUME(Tokens.arithmeticOperators).tokenType.name) {
        case LexerTokenType.TknAdd:
          operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticAdd);
          break;
        case LexerTokenType.TknSubtract:
          operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticSub);
          break;
      }
      expressions.push(this.SUBRULE1(this.simpleExpression));
    });
    console.log(lhs);
    console.log(expressions);
    if (expressions.length == 0) {
      return lhs;
    } else {
      return expressions.reduce((prevValue, currentValue, index) => {
        return {
          nodeType: Nodes.NodeType.ArithmeticExpression,
          category: Nodes.NodeCategory.Expression,
          lhs: prevValue,
          operator: operators[index],
          rhs: currentValue,
          position: prevValue.position
        };
      }, lhs);
    }
  });
  // TODO: if we could get rid of this that would be fantastic, but it is needed to avoid left recursion
  private simpleExpression = this.RULE('SimpleExpression', (): Nodes.Expression => {
    return this.OR([
      {
        ALT: () => this.SUBRULE(this.logicalExpression)
      },
      {
        ALT: () => this.SUBRULE(this.parenthesisExpression)
      },
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
  });
  private logicalExpression = this.RULE('LogicalExpression', (): Nodes.LogicExpressionNode => {
    const logicalOperatorToken = this.CONSUME(Tokens.logicalOperators);
    let operator;
    switch (logicalOperatorToken.tokenType.name) {
      case LexerTokenType.TknNot:
        operator = Nodes.LogicalExpressionOperator.LogicalNot;
        break;
      default:
        // TODO: Remover this, This should never be hit in the compiler
        operator = Nodes.LogicalExpressionOperator.LogicalNot;
    }
    const value = this.SUBRULE1(this.simpleExpression);
    return {
      nodeType: Nodes.NodeType.LogicExpression,
      category: Nodes.NodeCategory.Expression,
      operator: operator,
      value: value,
      position: {
        offset: logicalOperatorToken.startOffset,
        line: logicalOperatorToken.startLine || 0,
        col: logicalOperatorToken.startColumn || 0,
        file: this.file,
      },
    };
  });
  private parenthesisExpression = this.RULE('ParenthesisExpression', (): Nodes.ParenthesisExpressionNode => {
    const location = this.CONSUME(Tokens.TknLParen);
    const expression = this.SUBRULE(this.expression);
    this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.ParenthesisExpression,
      category: Nodes.NodeCategory.Expression,
      value: expression,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      }
    };
  });
  private callExpression = this.RULE('CallExpression', (): Nodes.CallExpressionNode => {
    const args: Nodes.Expression[] = [];
    const name = this.SUBRULE(this.variable);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE1(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE2(this.wss);
        args.push(this.SUBRULE(this.expression));
        this.SUBRULE3(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.CallExpression,
      category: Nodes.NodeCategory.Expression,
      name: name,
      args: args,
      position: name.position,
    };
  });
  private wasmCallExpression = this.RULE('wasmCallExpression', (): Nodes.WasmCallExpressionNode => {
    const name: string[] = [];
    const args: Nodes.Expression[] = [];
    const location = this.CONSUME(Tokens.TknWasmCall);
    this.atLeastOne(0, () => {
      this.SUBRULE(this.wss);
      this.CONSUME(Tokens.TknPeriod);
      this.SUBRULE1(this.wss);
      name.push(this.CONSUME(Tokens.TknIdentifier).image);
      this.SUBRULE2(this.wss);
    });
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE3(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE4(this.wss);
        args.push(this.SUBRULE(this.expression));
        this.SUBRULE5(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.WasmCallExpression,
      category: Nodes.NodeCategory.Expression,
      name: name,
      args: args,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });

  // Atoms
  private atom = this.RULE('Atom', (): Nodes.Atom => {
    this.SUBRULE(this.wss);
    const atom = this.OR([
      { ALT: () => this.SUBRULE(this.stringLiteral) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
      { ALT: () => this.SUBRULE(this.variableNode) },
      { ALT: () => this.SUBRULE(this.memberAccessNode), IGNORE_AMBIGUITIES: true },
    ]);
    this.SUBRULE1(this.wss);
    return atom;
  });
  // Literals
  private stringLiteral = this.RULE('StringLiteral', (): Nodes.StringLiteralNode => {
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
  private numberLiteral = this.RULE('NumberLiteral', (): Nodes.NumberLiteralNode => {
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
  private variable = this.RULE('Variable', (): Nodes.Variable => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.variableNode) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
    ]);
  });
  private variableNode = this.RULE('VariableNode', (): Nodes.VariableNode => {
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
  // TODO: this needs to redone we only want to capture one property and we want this to be captured by a memberStatement or something
  private memberAccessNode = this.RULE('MemberAccess', (): Nodes.MemberAccessNode => {
    const name = this.SUBRULE(this.variableNode);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknPeriod);
    this.SUBRULE1(this.wss);
    const child = this.OR([
      { ALT: () => this.SUBRULE(this.memberAccessNode) },
      { ALT: () => this.SUBRULE1(this.variableNode) },
    ]);
    return {
      nodeType: Nodes.NodeType.MemberAccess,
      category: Nodes.NodeCategory.Variable,
      name: name,
      child: child,
      position: name.position,
    };
  });
  private functionDefinition = this.RULE('FunctionDefinition', (): Nodes.FunctionLiteralNode => {
    const params: Nodes.ParameterNode[] = [];
    const location = this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        const name = this.SUBRULE(this.variable);
        this.SUBRULE2(this.wss);
        const paramType = this.SUBRULE(this.type);
        this.SUBRULE3(this.wss);
        params.push({
          name: name,
          paramType: paramType,
        });
      }
    });
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE4(this.wss);
    const returnType = this.SUBRULE1(this.type);
    this.SUBRULE5(this.wss);
    this.CONSUME(Tokens.TknThickArrow);
    this.SUBRULE6(this.wss);
    const body = this.SUBRULE(this._statement);
    return {
      nodeType: Nodes.NodeType.FunctionLiteral,
      category: Nodes.NodeCategory.Literal,
      returnType: returnType,
      params: params,
      body: body,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      }
    };
  });
  // Types
  private wasmType = this.RULE('wasmType', (): Nodes.Type => {
    this.SUBRULE(this.typeStart);
    return this.OR([
      { ALT: () => this.SUBRULE(this.wasmFunctionSignature) },
      { ALT: () => this.SUBRULE(this.typeIdentifier) },
    ]);
  });
  private wasmFunctionSignature = this.RULE('WasmFunctionSignature', (): Nodes.FunctionTypeNode => {
    const params: Nodes.TypeNode[] = [];
    const location = this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        params.push(this.SUBRULE(this.typeIdentifier));
        this.SUBRULE2(this.wss);
      }
    });
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE4(this.wss);
    this.CONSUME(Tokens.TknThinArrow);
    this.SUBRULE5(this.wss);
    const returnType = this.SUBRULE1(this.typeIdentifier);
    return {
      nodeType: Nodes.NodeType.FunctionType,
      category: Nodes.NodeCategory.Type,
      params: params,
      returnType: returnType,
      position: {
        offset: location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private type = this.RULE('WasmType', (): Nodes.TypeNode => {
    const position = this.SUBRULE(this.typeStart);
    const nodeType = this.SUBRULE(this.typeIdentifier);
    return { ...nodeType, position: position };
  });
  private typeIdentifier = this.RULE('TypeIdentifier', (): Nodes.TypeNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.Type,
      category: Nodes.NodeCategory.Type,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        file: this.file,
      }
    };
  });
  private typeStart = this.RULE('TypeStart', (): Position => {
    const location = this.CONSUME(Tokens.TknColon);
    this.SUBRULE(this.wss);
    return {
      offset: location.startOffset,
      line: location.startLine || 0,
      col: location.startColumn || 0,
      file: this.file,
    };
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
  private wss = this.RULE('OptionalWhiteSpace', (): Nodes.WhiteSpaceNode => {
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
  return createSyntaxDiagramsCode(parser.getSerializedGastProductions());
};
export default parse;