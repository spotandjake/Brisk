// Imports
import { EmbeddedActionsParser, TokenType, ILexingResult, IToken } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
import ErrorProvider from './ErrorProvider';
import { LexerTokenType } from '../Types/LexerNodes';
import * as Nodes from '../Types/ParseNodes';
//@ts-ignore
import { __DEBUG__ } from '@brisk/config';
// Parser
class Parser extends EmbeddedActionsParser {
  private file: string;
  constructor(tokens: TokenType[], file: string) {
    super(tokens, {
      // TODO: Lower This To One
      maxLookahead: 2,
      skipValidations: !__DEBUG__,
      errorMessageProvider: ErrorProvider(file),
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
        length: 0, // TODO: Get Length For This
        line: 0,
        col: 0,
        file: this.file,
      },
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
    this.CONSUME(Tokens.TknSemiColon, {
      ERR_MSG: 'expecting `;` at end of Statement',
    });
    return statement;
  });
  private _statement = this.RULE('_Statement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.typeDefinition) },
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
        length: <number>flag.endOffset - flag.startOffset + 1,
        line: flag.startLine || 0,
        col: flag.startColumn || 0,
        file: this.file,
      },
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
        length: <number>open.endOffset - open.startOffset + 1,
        line: open.startLine || 0,
        col: open.startColumn || 0,
        file: this.file,
      },
    };
  });
  private singleLineStatement = this.RULE('SingleLineStatement', () => {
    return this.OR({
      IGNORE_AMBIGUITIES: true,
      DEF: [
        { ALT: () => this.SUBRULE(this.ifStatement) },
        { ALT: () => this.SUBRULE(this.importStatement) },
        { ALT: () => this.SUBRULE(this.exportStatement) },
        { ALT: () => this.SUBRULE(this.constantDeclarationStatement) },
        { ALT: () => this.SUBRULE(this.declarationStatement) },
        { ALT: () => this.SUBRULE(this.assignmentStatement) },
        { ALT: () => this.SUBRULE(this.expressionStatement) },
      ],
    });
  });
  private ifStatement = this.RULE('IfStatement', (): Nodes.IfStatementNode => {
    const location = this.CONSUME(Tokens.TknIf);
    this.SUBRULE(this.wss);
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE1(this.wss);
    const condition = this.SUBRULE(this.expression);
    this.SUBRULE2(this.wss);
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE3(this.wss);
    const { body, alternative } = this.OR([
      {
        ALT: () => {
          const body = this.SUBRULE(this.singleLineStatement);
          const alternative = this.OPTION(() => {
            this.CONSUME(Tokens.TknSemiColon);
            this.SUBRULE4(this.wss);
            this.CONSUME(Tokens.TknElse);
            this.SUBRULE5(this.wss);
            return this.SUBRULE(this._statement);
          });
          return { body, alternative };
        },
      },
      {
        ALT: () => {
          const body = this.SUBRULE(this.blockStatement);
          const alternative = this.OPTION1(() => {
            this.SUBRULE6(this.wss);
            this.CONSUME1(Tokens.TknElse);
            this.SUBRULE7(this.wss);
            return this.SUBRULE1(this._statement);
          });
          return { body, alternative };
        },
      },
    ]);
    return {
      nodeType: Nodes.NodeType.IfStatement,
      category: Nodes.NodeCategory.Statement,
      condition: condition,
      body: body,
      alternative: alternative,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private importStatement = this.RULE(
    'ImportStatement',
    (): Nodes.ImportStatementNode | Nodes.WasmImportStatementNode => {
      let typeSignature: Nodes.TypeLiteral | undefined;
      const location = this.CONSUME(Tokens.TknImport);
      this.SUBRULE(this.wss);
      const variable = this.OR([
        {
          ALT: () => {
            return this.SUBRULE(this.variableDefinitionNode);
          },
        },
        {
          ALT: () => {
            this.CONSUME(Tokens.TknWasm);
            this.SUBRULE1(this.wss);
            const variable = this.SUBRULE1(this.variableDefinitionNode);
            this.SUBRULE2(this.wss);
            this.CONSUME(Tokens.TknColon);
            this.SUBRULE3(this.wss);
            typeSignature = this.SUBRULE(this.typeLiteral);
            return variable;
          },
        },
      ]);
      this.SUBRULE4(this.wss);
      this.CONSUME(Tokens.TknFrom);
      this.SUBRULE5(this.wss);
      const source = this.SUBRULE(this.stringLiteral);
      if (typeSignature == undefined) {
        // TODO: we want to add support for destructuring imports
        // TODO: Fix Length
        return {
          nodeType: Nodes.NodeType.ImportStatement,
          category: Nodes.NodeCategory.Statement,
          variable: variable,
          source: source,
          position: {
            offset: location.startOffset,
            length: 0,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            file: this.file,
          },
        };
      } else {
        return {
          nodeType: Nodes.NodeType.WasmImportStatement,
          category: Nodes.NodeCategory.Statement,
          typeSignature: typeSignature,
          variable: variable,
          source: source,
          position: {
            offset: location.startOffset,
            length: 0,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            file: this.file,
          },
        };
      }
    }
  );
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
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private constantDeclarationStatement = this.RULE(
    'ConstantDeclaration',
    (): Nodes.DeclarationStatementNode => {
      const location = this.CONSUME(Tokens.TknConst);
      this.SUBRULE(this.wss);
      const name = this.SUBRULE(this.variableDefinitionNode);
      this.SUBRULE1(this.wss);
      this.CONSUME(Tokens.TknColon);
      this.SUBRULE2(this.wss);
      const varType = this.SUBRULE(this.typeLiteral);
      this.SUBRULE3(this.wss);
      this.CONSUME(Tokens.assignmentOperators);
      this.SUBRULE4(this.wss);
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
          length: <number>location.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  private declarationStatement = this.RULE('Declaration', (): Nodes.DeclarationStatementNode => {
    const location = this.CONSUME(Tokens.TknLet);
    this.SUBRULE(this.wss);
    const name = this.SUBRULE(this.variableDefinitionNode);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.TknColon);
    this.SUBRULE2(this.wss);
    const varType = this.SUBRULE(this.typeLiteral);
    this.SUBRULE3(this.wss);
    this.CONSUME(Tokens.assignmentOperators);
    this.SUBRULE4(this.wss);
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
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private assignmentStatement = this.RULE(
    'assignmentStatement',
    (): Nodes.AssignmentStatementNode => {
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
    }
  );
  private expressionStatement = this.RULE('expressionStatement', (): Nodes.Expression => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.callExpression) },
      { ALT: () => this.SUBRULE(this.wasmCallExpression) },
    ]);
  });
  // Expressions
  private expression = this.RULE('Expression', (): Nodes.Expression => {
    return this.SUBRULE(this.comparisonExpression);
  });
  private comparisonExpression = this.RULE(
    'ComparisonExpression',
    (): Nodes.Expression | Nodes.ComparisonExpressionNode => {
      let length = 0;
      const operators: Nodes.ComparisonExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.arithmeticExpression);
      length += this.SUBRULE(this.wss).position?.length || 0;
      this.MANY(() => {
        const operator = this.CONSUME(Tokens.comparisonOperators);
        length += operator.image.length;
        switch (operator.tokenType.name) {
          case LexerTokenType.TknComparisonEqual:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonEqual);
            break;
          case LexerTokenType.TknComparisonNotEqual:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonNotEqual);
            break;
          case LexerTokenType.TknComparisonLessThan:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonLessThan);
            break;
          case LexerTokenType.TknComparisonGreaterThan:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonGreaterThan);
            break;
          case LexerTokenType.TknComparisonLessThanOrEqual:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonLessThanOrEqual);
            break;
          case LexerTokenType.TknComparisonGreaterThanOrEqual:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonGreaterThanOrEqual);
            break;
        }
        length += this.SUBRULE1(this.wss).position?.length || 0;
        expressions.push(this.SUBRULE1(this.arithmeticExpression));
        length += this.SUBRULE2(this.wss).position?.length || 0;
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          const expr = expressions.reduce(
            (prevValue, currentValue, index): Nodes.ComparisonExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ComparisonExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length: prevValue.position.length + currentValue.position.length + length,
                },
              };
            },
            lhs
          );
          expr.position.length = expr.position.length += length;
          return expr;
        });
      }
    }
  );
  private arithmeticExpression = this.RULE(
    'ArithmeticExpression',
    (): Nodes.Expression | Nodes.ArithmeticExpressionNode => {
      let length = 0;
      const operators: Nodes.ArithmeticExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.simpleExpression);
      length += this.SUBRULE(this.wss).position?.length ?? 0;
      this.MANY(() => {
        const operator = this.CONSUME(Tokens.arithmeticOperators);
        length += operator.image.length;
        switch (operator.tokenType.name) {
          case LexerTokenType.TknAdd:
            operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticAdd);
            break;
          case LexerTokenType.TknSubtract:
            operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticSub);
            break;
          case LexerTokenType.TknDivision:
            operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticDiv);
            break;
          case LexerTokenType.TknMultiply:
            operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticMul);
            break;
          case LexerTokenType.TknPower:
            operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticPow);
            break;
        }
        length += this.SUBRULE1(this.wss).position?.length ?? 0;
        expressions.push(this.SUBRULE1(this.simpleExpression));
        length += this.SUBRULE2(this.wss).position?.length ?? 0;
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          const expr = expressions.reduce(
            (prevValue, currentValue, index): Nodes.ArithmeticExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ArithmeticExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length: prevValue.position.length + currentValue.position.length + 1,
                },
              };
            },
            lhs
          );
          expr.position.length = expr.position.length += length;
          return expr;
        });
      }
    }
  );
  private simpleExpression = this.RULE('SimpleExpression', (): Nodes.Expression => {
    return this.OR({
      MAX_LOOKAHEAD: 3,
      IGNORE_AMBIGUITIES: true,
      DEF: [
        {
          ALT: () => this.SUBRULE(this.logicalExpression),
        },
        {
          ALT: () => this.SUBRULE(this.parenthesisExpression),
        },
        {
          ALT: () => this.SUBRULE(this.atom),
        },
        {
          ALT: () => this.SUBRULE(this.callExpression),
        },
        {
          ALT: () => this.SUBRULE(this.wasmCallExpression),
        },
        {
          ALT: () => this.SUBRULE(this.castExpression),
        },
      ],
    });
  });
  private castExpression = this.RULE('CaseExpression', (): Nodes.TypeCastExpressionNode => {
    const location = this.CONSUME(Tokens.TknComparisonLessThan);
    this.SUBRULE(this.wss);
    const castType = this.SUBRULE(this.typeLiteral);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.TknComparisonGreaterThan);
    this.SUBRULE2(this.wss);
    const value = this.SUBRULE(this.simpleExpression);
    return {
      nodeType: Nodes.NodeType.TypeCastExpression,
      category: Nodes.NodeCategory.Expression,
      castType: castType,
      value: value,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private logicalExpression = this.RULE('LogicalExpression', (): Nodes.LogicExpressionNode => {
    const logicalOperatorToken = this.CONSUME(Tokens.logicalOperators);
    let operator;
    switch (logicalOperatorToken.tokenType.name) {
      case LexerTokenType.TknNot:
        operator = Nodes.LogicalExpressionOperator.LogicalNot;
        break;
      default:
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
        length: <number>logicalOperatorToken.endOffset - logicalOperatorToken.startOffset + 1,
        line: logicalOperatorToken.startLine || 0,
        col: logicalOperatorToken.startColumn || 0,
        file: this.file,
      },
    };
  });
  private parenthesisExpression = this.RULE(
    'ParenthesisExpression',
    (): Nodes.ParenthesisExpressionNode => {
      const location = this.CONSUME(Tokens.TknLParen);
      const expression = this.SUBRULE(this.expression);
      this.CONSUME(Tokens.TknRParen);
      return {
        nodeType: Nodes.NodeType.ParenthesisExpression,
        category: Nodes.NodeCategory.Expression,
        value: expression,
        position: {
          offset: location.startOffset,
          length: 2 + expression.position?.length || 0,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  private callExpression = this.RULE('CallExpression', (): Nodes.CallExpressionNode => {
    const args: Nodes.Expression[] = [];
    const name = this.SUBRULE(this.variable);
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        args.push(this.SUBRULE(this.expression));
        this.SUBRULE2(this.wss);
      },
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
    const args: Nodes.Expression[] = [];
    const location = this.CONSUME(Tokens.TknWasmCall);
    this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        this.SUBRULE1(this.wss);
        args.push(this.SUBRULE(this.expression));
        this.SUBRULE2(this.wss);
      },
    });
    this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.WasmCallExpression,
      category: Nodes.NodeCategory.Expression,
      name: location.image,
      args: args,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
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
      { ALT: () => this.SUBRULE(this.i32Literal) },
      { ALT: () => this.SUBRULE(this.i64Literal) },
      { ALT: () => this.SUBRULE(this.u32Literal) },
      { ALT: () => this.SUBRULE(this.u64Literal) },
      { ALT: () => this.SUBRULE(this.f32Literal) },
      { ALT: () => this.SUBRULE(this.f64Literal) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
      { ALT: () => this.SUBRULE(this.variable) },
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
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private i32Literal = this.RULE('I32Literal', (): Nodes.I32LiteralNode => {
    const value = this.CONSUME(Tokens.TknI32);
    return {
      nodeType: Nodes.NodeType.I32Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private i64Literal = this.RULE('I64Literal', (): Nodes.I64LiteralNode => {
    const value = this.CONSUME(Tokens.TknI64);
    return {
      nodeType: Nodes.NodeType.I64Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private u32Literal = this.RULE('U32Literal', (): Nodes.U32LiteralNode => {
    const value = this.CONSUME(Tokens.TknU32);
    return {
      nodeType: Nodes.NodeType.U32Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private u64Literal = this.RULE('U64Literal', (): Nodes.U64LiteralNode => {
    const value = this.CONSUME(Tokens.TknU64);
    return {
      nodeType: Nodes.NodeType.U64Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private f32Literal = this.RULE('F32Literal', (): Nodes.F32LiteralNode => {
    const value = this.CONSUME(Tokens.TknF32);
    return {
      nodeType: Nodes.NodeType.F32Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private f64Literal = this.RULE('F64Literal', (): Nodes.F64LiteralNode => {
    const value = this.CONSUME(Tokens.TknF64);
    return {
      nodeType: Nodes.NodeType.F64Literal,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
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
        length: <number>value.endOffset - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private constantLiteral = this.RULE('ConstantLiteral', () => {
    const value = this.CONSUME(Tokens.TknConstant);
    return {
      nodeType: Nodes.NodeType.ConstantLiteral,
      category: Nodes.NodeCategory.Literal,
      value: value.image,
      position: {
        offset: value.startOffset,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        file: this.file,
      },
    };
  });
  private variable = this.RULE('Variable', (): Nodes.Variable => {
    return this.OR({
      MAX_LOOKAHEAD: 2,
      DEF: [
        { ALT: () => this.SUBRULE(this.memberAccessNode) },
        { ALT: () => this.SUBRULE(this.variableUsageNode) },
      ],
    });
  });
  private variableDefinitionNode = this.RULE(
    'VariableDefinitionNode',
    (): Nodes.VariableDefinitionNode => {
      const identifier = this.CONSUME(Tokens.TknIdentifier);
      return {
        nodeType: Nodes.NodeType.VariableDefinition,
        category: Nodes.NodeCategory.Variable,
        name: identifier.image,
        position: {
          offset: identifier.startOffset,
          length: <number>identifier.endOffset - identifier.startOffset + 1,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  private variableUsageNode = this.RULE('VariableUsageNode', (): Nodes.VariableUsageNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.VariableUsage,
      category: Nodes.NodeCategory.Variable,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        length: <number>identifier.endOffset - identifier.startOffset + 1,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        file: this.file,
      },
    };
  });
  private memberAccessNode = this.RULE('MemberAccess', (): Nodes.MemberAccessNode => {
    const name = this.SUBRULE(this.variableUsageNode);
    this.CONSUME(Tokens.TknPeriod);
    const child = this.SUBRULE(this.variable);
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
        const name = this.SUBRULE(this.variableDefinitionNode);
        this.SUBRULE2(this.wss);
        this.CONSUME(Tokens.TknColon);
        this.SUBRULE3(this.wss);
        const paramType = this.SUBRULE(this.typeLiteral);
        this.SUBRULE4(this.wss);
        params.push({
          nodeType: Nodes.NodeType.Parameter,
          category: Nodes.NodeCategory.Variable,
          name: name,
          paramType: paramType,
        });
      },
    });
    this.CONSUME(Tokens.TknRParen);
    this.SUBRULE5(this.wss);
    this.CONSUME1(Tokens.TknColon);
    this.SUBRULE6(this.wss);
    const returnType = this.SUBRULE1(this.typeLiteral);
    this.SUBRULE7(this.wss);
    this.CONSUME(Tokens.TknThickArrow);
    this.SUBRULE8(this.wss);
    const body = this.SUBRULE(this._statement);
    return {
      nodeType: Nodes.NodeType.FunctionLiteral,
      category: Nodes.NodeCategory.Literal,
      returnType: returnType,
      params: params,
      body: body,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  // Types
  private typeDefinition = this.RULE('TypeDefinition', (): Nodes.TypeDefinition => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.typeAlias) },
      { ALT: () => this.SUBRULE(this.interfaceDefinition) },
    ]);
  });
  private typeLiteral = this.RULE('TypeLiteral', (): Nodes.TypeLiteral => {
    return this.SUBRULE(this.typeUnionLiteral);
  });
  // Type Definition
  private typeAlias = this.RULE('TypeAliasDefinition', (): Nodes.TypeAliasDefinitionNode => {
    const location = this.CONSUME(Tokens.TknType);
    this.SUBRULE(this.wss);
    const name = this.CONSUME(Tokens.TknIdentifier);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.TknEqual);
    this.SUBRULE2(this.wss);
    const typeLiteral = this.SUBRULE(this.typeLiteral);
    return {
      nodeType: Nodes.NodeType.TypeAliasDefinition,
      category: Nodes.NodeCategory.Type,
      name: name.image,
      typeLiteral: typeLiteral,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private interfaceDefinition = this.RULE(
    'InterfaceDefinition',
    (): Nodes.InterfaceDefinitionNode => {
      const location = this.CONSUME(Tokens.TknInterface);
      this.SUBRULE(this.wss);
      const name = this.CONSUME(Tokens.TknIdentifier);
      this.SUBRULE1(this.wss);
      const interfaceLiteral = this.SUBRULE(this.InterfaceTypeLiteral);
      return {
        nodeType: Nodes.NodeType.InterfaceDefinition,
        category: Nodes.NodeCategory.Type,
        name: name.image,
        typeLiteral: interfaceLiteral,
        position: {
          offset: location.startOffset,
          length: <number>location.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  // TypeLiteral
  private typeUnionLiteral = this.RULE(
    'TypeUnionLiteral',
    (): Nodes.TypeLiteral | Nodes.TypeUnionLiteralNode => {
      const types: Nodes.TypeLiteral[] = [];
      const lhs = this.SUBRULE(this._typeLiteral);
      this.SUBRULE(this.wss);
      this.MANY(() => {
        this.CONSUME(Tokens.TknUnion);
        this.SUBRULE1(this.wss);
        types.push(this.SUBRULE1(this._typeLiteral));
        this.SUBRULE2(this.wss);
      });
      if (types.length == 0) {
        return lhs;
      } else {
        return {
          nodeType: Nodes.NodeType.TypeUnionLiteral,
          category: Nodes.NodeCategory.Type,
          types: [lhs, ...types],
          position: lhs.position,
        };
      }
    }
  );
  private _typeLiteral = this.RULE('_TypeLiteral', (): Nodes.TypeLiteral => {
    return this.OR([
      // TODO: fix this
      // { ALT: () => this.SUBRULE(this.parenthesisType), IGNORE_AMBIGUITIES: true },
      { ALT: () => this.SUBRULE(this.functionSignatureLiteral) },
      { ALT: () => this.SUBRULE(this.InterfaceTypeLiteral) },
      { ALT: () => this.SUBRULE(this.typeUsageNode) },
    ]);
  });
  private parenthesisType = this.RULE('ParenthesisType', (): Nodes.ParenthesisTypeLiteralNode => {
    const location = this.CONSUME(Tokens.TknLParen);
    this.SUBRULE(this.wss);
    const value = this.SUBRULE(this.typeLiteral);
    this.SUBRULE1(this.wss);
    this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.ParenthesisTypeLiteral,
      category: Nodes.NodeCategory.Type,
      value: value,
      position: {
        offset: location.startOffset,
        length: <number>location.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private functionSignatureLiteral = this.RULE(
    'functionSignatureLiteral',
    (): Nodes.FunctionSignatureLiteralNode => {
      const params: Nodes.TypeLiteral[] = [];
      const location = this.CONSUME(Tokens.TknLParen);
      this.SUBRULE(this.wss);
      this.MANY_SEP({
        SEP: Tokens.TknComma,
        DEF: () => {
          this.SUBRULE1(this.wss);
          params.push(this.SUBRULE(this.typeLiteral));
          this.SUBRULE2(this.wss);
        },
      });
      this.CONSUME(Tokens.TknRParen);
      this.SUBRULE4(this.wss);
      this.CONSUME(Tokens.TknThinArrow);
      this.SUBRULE5(this.wss);
      const returnType = this.SUBRULE1(this.typeLiteral);
      return {
        nodeType: Nodes.NodeType.FunctionSignatureLiteral,
        category: Nodes.NodeCategory.Type,
        params: params,
        returnType: returnType,
        position: {
          offset: location.startOffset,
          length: <number>location.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  private InterfaceTypeLiteral = this.RULE(
    'InterfaceTypeLiteralNode',
    (): Nodes.InterfaceLiteralNode => {
      const fields: Nodes.InterfaceFieldNode[] = [];
      const location = this.CONSUME(Tokens.TknLBrace);
      this.SUBRULE(this.wss);
      this.MANY(() => {
        this.SUBRULE1(this.wss);
        fields.push(this.SUBRULE(this.interfaceField));
        this.SUBRULE2(this.wss);
        this.CONSUME(Tokens.TknSemiColon);
        this.SUBRULE3(this.wss);
      });
      this.CONSUME(Tokens.TknRBrace);
      return {
        nodeType: Nodes.NodeType.InterfaceLiteral,
        category: Nodes.NodeCategory.Type,
        fields: fields,
        position: {
          offset: location.startOffset,
          length: <number>location.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    }
  );
  private interfaceField = this.RULE('InterfaceField', (): Nodes.InterfaceFieldNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    this.CONSUME(Tokens.TknColon);
    this.SUBRULE(this.wss);
    const fieldType = this.SUBRULE(this.typeLiteral);
    return {
      nodeType: Nodes.NodeType.InterfaceField,
      category: Nodes.NodeCategory.Type,
      name: identifier.image,
      fieldType: fieldType,
      position: {
        offset: identifier.startOffset,
        length: <number>identifier.endOffset - identifier.startOffset + 1,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        file: this.file,
      },
    };
  });
  // TypeUsage
  private typeUsageNode = this.RULE('TypeUsage', (): Nodes.TypeUsageNode => {
    const identifier = this.SUBRULE(this.typeIdentifier);
    return {
      nodeType: Nodes.NodeType.TypeUsage,
      category: Nodes.NodeCategory.Type,
      name: identifier.name,
      position: identifier.position,
    };
  });
  // General Type Stuff
  private typeIdentifier = this.RULE('TypeIdentifier', (): Nodes.TypeIdentifierNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.TypeIdentifier,
      category: Nodes.NodeCategory.Type,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        length: <number>identifier.endOffset - identifier.startOffset + 1,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        file: this.file,
      },
    };
  });
  // General Helpers
  private wss = this.RULE('OptionalWhiteSpace', (): Nodes.WhiteSpaceNode => {
    const spaces: IToken[] = [];
    this.MANY(() => spaces.push(this.CONSUME(Tokens.TknWhitespace)));
    return {
      nodeType: Nodes.NodeType.WhiteSpace,
      category: Nodes.NodeCategory.WhiteSpace,
      value: spaces.map((space) => space.image).join(''),
      position: {
        offset: spaces[0]?.startOffset || 0,
        length: <number>spaces.at(-1)?.endOffset - spaces[0]?.startOffset + 1 || 0,
        line: spaces[0]?.startLine || 0,
        col: spaces[0]?.startColumn || 0,
        file: this.file,
      },
    };
  });
}
// Parse code
const parse = (lexingResult: ILexingResult, file: string) => {
  // =================================================================
  const parser = new Parser(Tokens.Tokens, file);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  if (parser.errors.length > 0) throw new Error('Parsing errors detected');
  // =================================================================
  return parser.program();
};
export default parse;
