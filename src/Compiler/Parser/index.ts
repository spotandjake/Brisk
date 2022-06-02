// Imports
import { EmbeddedActionsParser, ILexingResult, TokenType } from 'chevrotain';
import * as Tokens from '../Lexer/Tokens';
import ErrorProvider from './ErrorProvider';
import { LexerTokenType } from '../Types/LexerNodes';
import * as Nodes from '../Types/ParseNodes';
import { BriskCustomError } from '../Errors/Compiler';
//@ts-ignore
import { __DEBUG__ } from '@brisk/config';
// Parser
class Parser extends EmbeddedActionsParser {
  private basePath: string;
  private file: string;
  constructor(tokens: TokenType[], basePath: string, file: string) {
    super(tokens, {
      maxLookahead: 2,
      skipValidations: !__DEBUG__,
      errorMessageProvider: ErrorProvider(),
    });
    this.basePath = basePath;
    this.file = file;
    this.performSelfAnalysis();
  }
  // Grammar
  public program = this.RULE('Program', (): Nodes.ProgramNode => {
    const body = this.SUBRULE(this.topLevelStatementList);
    return {
      nodeType: Nodes.NodeType.Program,
      category: Nodes.NodeCategory.General,
      name: this.file,
      body: body,
      data: {
        // Pools
        _imports: new Map(),
        _exports: new Map(),
        _variables: new Map(),
        _types: new Map(),
        // Stacks
        _varStack: new Map(),
        _typeStack: new Map(),
      },
      position: {
        offset: 0,
        length: (this.input.at(-1)?.endOffset || -1) + 1,
        line: 0,
        col: 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private topLevelStatementList = this.RULE('TopLevelStatementList', (): Nodes.Statement[] => {
    const body: Nodes.Statement[] = [];
    this.MANY(() => {
      this.OR([
        { ALT: () => body.push(this.SUBRULE(this.topLevelStatement)) },
        { ALT: () => body.push(this.SUBRULE(this.statement)) },
      ]);
    });
    return body;
  });
  private topLevelStatement = this.RULE('TopLevelStatement', (): Nodes.Statement => {
    const statement = this.OR([
      { ALT: () => this.SUBRULE(this.importStatement) },
      { ALT: () => this.SUBRULE(this.exportStatement) },
      { ALT: () => this.SUBRULE(this.flag) },
    ]);
    this.CONSUME(Tokens.TknSemiColon);
    this.ACTION(() => (statement.position.length += 1));
    return statement;
  });
  private statement = this.RULE('Statement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.optionalSemiColon) },
      { ALT: () => this.SUBRULE(this.semiStatement) },
    ]);
  });
  private optionalSemiColon = this.RULE('OptionalSemi', (): Nodes.Statement => {
    const statement = this.OR([
      { ALT: () => this.SUBRULE(this.enumDefinitionStatement) },
      { ALT: () => this.SUBRULE(this.interfaceDefinition) },
    ]);
    this.OPTION(() => {
      this.CONSUME(Tokens.TknSemiColon);
      this.ACTION(() => (statement.position.length += 1));
    });
    return statement;
  });
  private semiStatement = this.RULE('SemiStatement', (): Nodes.Statement => {
    const statement = this.SUBRULE(this._statement);
    this.CONSUME(Tokens.TknSemiColon);
    this.ACTION(() => (statement.position.length += 1));
    return statement;
  });
  private _statement = this.RULE('_Statement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.typeAlias) },
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
      { ALT: () => this.SUBRULE(this.singleLineStatement) },
    ]);
  });
  // Flags
  private flag = this.RULE('Flag', (): Nodes.FlagNode => {
    const flag = this.CONSUME(Tokens.TknFlag);
    const args = this.SUBRULE(this.arguments);
    return {
      nodeType: Nodes.NodeType.FlagStatement,
      category: Nodes.NodeCategory.Statement,
      value: flag.image.slice(1),
      args: args,
      position: {
        offset: flag.startOffset,
        length: flag.endOffset! - flag.startOffset + 1,
        line: flag.startLine || 0,
        col: flag.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  // Statements
  private blockStatement = this.RULE('BlockStatement', (): Nodes.BlockStatementNode => {
    const body: Nodes.Statement[] = [];
    const open = this.CONSUME(Tokens.TknLBrace);
    this.MANY(() => {
      body.push(this.SUBRULE(this.statement));
    });
    const close = this.CONSUME(Tokens.TknRBrace);
    return {
      nodeType: Nodes.NodeType.BlockStatement,
      category: Nodes.NodeCategory.Statement,
      body: body,
      data: {
        _varStack: new Map(),
        _typeStack: new Map(),

        pathReturns: false,
      },
      position: {
        offset: open.startOffset,
        length: close.endOffset! - open.startOffset + 1,
        line: open.startLine || 0,
        col: open.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private singleLineStatement = this.RULE('SingleLineStatement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.returnStatement) },
      {
        GATE: this.BACKTRACK(this.expressionStatement),
        ALT: () => this.SUBRULE(this.expressionStatement),
      },
      {
        GATE: this.BACKTRACK(this.assignmentStatement),
        ALT: () => this.SUBRULE(this.assignmentStatement),
      },
      {
        GATE: this.BACKTRACK(this.postFixStatement),
        ALT: () => this.SUBRULE(this.postFixStatement),
      },
    ]);
  });
  private ifStatement = this.RULE('IfStatement', (): Nodes.IfStatementNode => {
    const location = this.CONSUME(Tokens.TknIf);
    this.CONSUME(Tokens.TknLParen);
    const condition = this.SUBRULE(this.expression);
    this.CONSUME(Tokens.TknRParen);
    const { body, alternative } = this.OR([
      {
        ALT: () => {
          const body = this.SUBRULE(this.singleLineStatement);
          const alternative = this.OPTION({
            GATE: () => this.LA(2).tokenType == Tokens.TknElse,
            DEF: () => {
              this.CONSUME(Tokens.TknSemiColon);
              this.CONSUME(Tokens.TknElse);
              return this.SUBRULE(this._statement);
            },
          });
          return { body, alternative };
        },
      },
      {
        ALT: () => {
          const body = this.SUBRULE(this.blockStatement);
          const alternative = this.OPTION1(() => {
            this.CONSUME1(Tokens.TknElse);
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
      data: {
        pathReturns: false,
      },
      position: {
        offset: location.startOffset,
        length:
          (alternative?.position.offset || body?.position.offset) +
          (alternative?.position.length || body?.position.length) -
          location.startOffset,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private importStatement = this.RULE(
    'ImportStatement',
    (): Nodes.ImportStatementNode | Nodes.WasmImportStatementNode => {
      let typeSignature: Nodes.TypeLiteral | undefined;
      const location = this.CONSUME(Tokens.TknImport);
      const variable = this.OR([
        {
          ALT: () => {
            // TODO: Support Destructuring Imports
            return this.SUBRULE(this.variableDefinition);
          },
        },
        {
          ALT: () => {
            this.CONSUME(Tokens.TknWasm);
            const variable = this.SUBRULE1(this.variableDefinitionNode);
            this.CONSUME(Tokens.TknColon);
            typeSignature = this.SUBRULE(this.typeLiteral);
            return variable;
          },
        },
      ]);
      this.CONSUME(Tokens.TknFrom);
      const source = this.SUBRULE(this.stringLiteral);
      return this.ACTION((): Nodes.ImportStatementNode | Nodes.WasmImportStatementNode => {
        if (typeSignature == undefined) {
          return {
            nodeType: Nodes.NodeType.ImportStatement,
            category: Nodes.NodeCategory.Statement,
            variable: variable,
            source: source,
            position: {
              offset: location.startOffset,
              length: source.position.offset + source.position.length - location.startOffset,
              line: location.startLine || 0,
              col: location.startColumn || 0,
              basePath: this.basePath,
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
              length: source?.position.offset + source?.position.length - location.startOffset,
              line: location.startLine || 0,
              col: location.startColumn || 0,
              basePath: this.basePath,
              file: this.file,
            },
          };
        }
      });
    }
  );
  private exportStatement = this.RULE('ExportStatement', (): Nodes.ExportStatementNode => {
    const location = this.CONSUME(Tokens.TknExport);
    const variable: Nodes.ExportStatementValue = this.OR([
      { ALT: () => this.SUBRULE(this.variableUsageNode) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
      { ALT: () => this.SUBRULE(this.objectLiteral) },
      { ALT: () => this.SUBRULE(this.interfaceDefinition) },
      { ALT: () => this.SUBRULE(this.enumDefinitionStatement) },
      { ALT: () => this.SUBRULE(this.typeAlias) },
    ]);
    return this.ACTION((): Nodes.ExportStatementNode => {
      return {
        nodeType: Nodes.NodeType.ExportStatement,
        category: Nodes.NodeCategory.Statement,
        value: variable, // Allow exporting groups of variables
        position: {
          offset: location.startOffset,
          length: variable.position.offset + variable.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private declarationStatement = this.RULE('Declaration', (): Nodes.DeclarationStatementNode => {
    const { location, declarationType } = this.OR([
      {
        ALT: () => {
          return {
            location: this.CONSUME(Tokens.TknLet),
            declarationType: Nodes.DeclarationTypes.Lexical,
          };
        },
      },
      {
        ALT: () => {
          return {
            location: this.CONSUME(Tokens.TknConst),
            declarationType: Nodes.DeclarationTypes.Constant,
          };
        },
      },
    ]);
    const name = this.SUBRULE(this.variableDefinition);
    this.CONSUME(Tokens.TknColon);
    const varType = this.SUBRULE(this.typeLiteral);
    this.CONSUME(Tokens.assignmentOperators);
    const value = this.SUBRULE(this.expression);
    return this.ACTION((): Nodes.DeclarationStatementNode => {
      return {
        nodeType: Nodes.NodeType.DeclarationStatement,
        category: Nodes.NodeCategory.Statement,
        declarationType: declarationType,
        name: name,
        varType: varType,
        value: value,
        position: {
          offset: location.startOffset,
          length: value.position.offset + value.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private assignmentStatement = this.RULE(
    'assignmentStatement',
    (): Nodes.AssignmentStatementNode => {
      const name = this.SUBRULE(this.variableUsage);
      this.CONSUME(Tokens.assignmentOperators);
      const value = this.SUBRULE(this.expression);
      return this.ACTION((): Nodes.AssignmentStatementNode => {
        return {
          nodeType: Nodes.NodeType.AssignmentStatement,
          category: Nodes.NodeCategory.Statement,
          name: name,
          value: value,
          position: {
            ...name.position,
            length: value.position.offset + value.position.length - name.position.offset - 1,
          },
        };
      });
    }
  );
  private returnStatement = this.RULE('ReturnStatement', (): Nodes.ReturnStatementNode => {
    const location = this.CONSUME(Tokens.TknReturn);
    this.CONSUME(Tokens.TknLParen);
    const returnValue = this.OPTION(() => this.SUBRULE(this.expression));
    const close = this.CONSUME(Tokens.TknRParen);
    return this.ACTION((): Nodes.ReturnStatementNode => {
      return {
        nodeType: Nodes.NodeType.ReturnStatement,
        category: Nodes.NodeCategory.Statement,
        returnValue: returnValue,
        data: {
          pathReturns: true,
        },
        position: {
          offset: location.startOffset,
          length: close.endOffset! - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private postFixStatement = this.RULE('PostFixStatement', (): Nodes.PostFixStatementNode => {
    const name = this.SUBRULE(this.variableUsage);
    const { location, operator } = this.OR([
      {
        ALT: () => {
          const location = this.CONSUME(Tokens.TknPostFixIncrement);
          return { location: location, operator: Nodes.PostFixOperator.Increment };
        },
      },
      {
        ALT: () => {
          const location = this.CONSUME(Tokens.TknPostFixDecrement);
          return { location: location, operator: Nodes.PostFixOperator.Decrement };
        },
      },
    ]);
    return this.ACTION((): Nodes.PostFixStatementNode => {
      return {
        nodeType: Nodes.NodeType.PostFixStatement,
        category: Nodes.NodeCategory.Statement,
        operator: operator,
        name: name,
        position: {
          ...name.position,
          length: location.endOffset! - name.position.offset,
        },
      };
    });
  });
  private expressionStatement = this.RULE('expressionStatement', (): Nodes.Expression => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.callExpression, { ARGS: [true, true] }) },
      { ALT: () => this.SUBRULE(this.wasmCallExpression, { ARGS: [true] }) },
    ]);
  });
  // Enums
  private enumDefinitionStatement = this.RULE(
    'EnumDefinitionStatement',
    (): Nodes.EnumDefinitionStatementNode => {
      const variants: Nodes.EnumVariantNode[] = [];
      const location = this.CONSUME(Tokens.TknEnum);
      const identifier = this.CONSUME(Tokens.TknIdentifier);
      const genericTypes = this.OPTION(() => this.SUBRULE(this.genericType));
      this.CONSUME(Tokens.TknLBrace);
      variants.push(this.SUBRULE(this.enumVariant));
      this.MANY(() => {
        this.CONSUME(Tokens.TknComma);
        variants.push(this.SUBRULE1(this.enumVariant));
      });
      this.OPTION1(() => this.CONSUME1(Tokens.TknComma));
      const close = this.CONSUME(Tokens.TknRBrace);
      return this.ACTION((): Nodes.EnumDefinitionStatementNode => {
        return {
          nodeType: Nodes.NodeType.EnumDefinitionStatement,
          category: Nodes.NodeCategory.Statement,
          name: identifier.image,
          variants: variants,
          genericTypes: genericTypes,
          data: {
            _typeStack: new Map(),
          },
          position: {
            offset: location.startOffset,
            length: close.endOffset! - location.startOffset + 1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    }
  );
  private enumVariant = this.RULE('EnumVariant', (): Nodes.EnumVariantNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    const value = this.OPTION(() => {
      return this.OR([
        {
          ALT: () => {
            this.CONSUME(Tokens.TknEqual);
            const value = this.SUBRULE(this.literal);
            return {
              endOffset: (value?.position?.offset || 0) + value?.position?.length || 0,
              value: value,
            };
          },
        },
        {
          ALT: () => {
            const values: Nodes.TypeLiteral[] = [];
            this.CONSUME(Tokens.TknLParen);
            this.AT_LEAST_ONE_SEP({
              SEP: Tokens.TknComma,
              DEF: () => values.push(this.SUBRULE(this.typeLiteral)),
            });
            const location = this.CONSUME(Tokens.TknRParen);
            return {
              value: values,
              endOffset: location?.endOffset || 0,
            };
          },
        },
      ]);
    });
    return this.ACTION((): Nodes.EnumVariantNode => {
      return {
        nodeType: Nodes.NodeType.EnumVariant,
        category: Nodes.NodeCategory.Enum,
        identifier: identifier.image,
        value: value?.value,
        position: {
          offset: identifier.startOffset,
          length: (value?.endOffset ?? identifier.endOffset) - identifier.startOffset + 1,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  // Expressions
  private expression = this.RULE('Expression', (): Nodes.Expression => {
    return this.SUBRULE(this.comparisonExpression);
  });
  private comparisonExpression = this.RULE(
    'ComparisonExpression',
    (): Nodes.Expression | Nodes.ComparisonExpressionNode => {
      const operators: Nodes.ComparisonExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.arithmeticShiftingExpression);
      this.MANY(() => {
        const operator = this.CONSUME(Tokens.comparisonOperators);
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
          case LexerTokenType.TknComparisonAnd:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonAnd);
            break;
          case LexerTokenType.TknComparisonOr:
            operators.push(Nodes.ComparisonExpressionOperator.ComparisonOr);
            break;
        }
        expressions.push(this.SUBRULE1(this.arithmeticShiftingExpression));
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          return expressions.reduce(
            (prevValue, currentValue, index): Nodes.ComparisonExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ComparisonExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length:
                    currentValue.position.offset +
                    currentValue.position.length -
                    prevValue.position.offset,
                },
              };
            },
            lhs
          );
        });
      }
    }
  );
  // Arithmetic Expressions
  private arithmeticShiftingExpression = this.RULE(
    'ArithmeticShiftingExpression',
    (): Nodes.Expression => {
      const operators: Nodes.ArithmeticExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.arithmeticScalingExpression);
      this.MANY(() => {
        operators.push(
          this.OR([
            {
              ALT: () => {
                this.CONSUME(Tokens.TknAdd);
                return Nodes.ArithmeticExpressionOperator.ArithmeticAdd;
              },
            },
            {
              ALT: () => {
                this.CONSUME(Tokens.TknSub);
                return Nodes.ArithmeticExpressionOperator.ArithmeticSub;
              },
            },
          ])
        );
        expressions.push(this.SUBRULE1(this.arithmeticScalingExpression));
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          return expressions.reduce(
            (prevValue, currentValue, index): Nodes.ArithmeticExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ArithmeticExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length:
                    currentValue.position.offset +
                    currentValue.position.length -
                    prevValue.position.offset,
                },
              };
            },
            lhs
          );
        });
      }
    }
  );
  private arithmeticScalingExpression = this.RULE(
    'ArithmeticScalingExpression',
    (): Nodes.Expression => {
      const operators: Nodes.ArithmeticExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.arithmeticPowerExpression);
      this.MANY(() => {
        operators.push(
          this.OR([
            {
              ALT: () => {
                this.CONSUME(Tokens.TknDiv);
                return Nodes.ArithmeticExpressionOperator.ArithmeticDiv;
              },
            },
            {
              ALT: () => {
                this.CONSUME(Tokens.TknMul);
                return Nodes.ArithmeticExpressionOperator.ArithmeticMul;
              },
            },
          ])
        );
        expressions.push(this.SUBRULE1(this.arithmeticPowerExpression));
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          return expressions.reduce(
            (prevValue, currentValue, index): Nodes.ArithmeticExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ArithmeticExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length:
                    currentValue.position.offset +
                    currentValue.position.length -
                    prevValue.position.offset,
                },
              };
            },
            lhs
          );
        });
      }
    }
  );
  private arithmeticPowerExpression = this.RULE(
    'ArithmeticPowerExpression',
    (): Nodes.Expression => {
      const operators: Nodes.ArithmeticExpressionOperator[] = [];
      const expressions: Nodes.Expression[] = [];
      const lhs = this.SUBRULE(this.simpleExpression);
      this.MANY(() => {
        this.CONSUME(Tokens.TknPow);
        operators.push(Nodes.ArithmeticExpressionOperator.ArithmeticPow);
        expressions.push(this.SUBRULE1(this.simpleExpression));
      });
      if (expressions.length == 0) {
        return lhs;
      } else {
        return this.ACTION(() => {
          return expressions.reduce(
            (prevValue, currentValue, index): Nodes.ArithmeticExpressionNode => {
              return {
                nodeType: Nodes.NodeType.ArithmeticExpression,
                category: Nodes.NodeCategory.Expression,
                lhs: prevValue,
                operator: operators[index],
                rhs: currentValue,
                position: {
                  ...prevValue.position,
                  length:
                    currentValue.position.offset +
                    currentValue.position.length -
                    prevValue.position.offset,
                },
              };
            },
            lhs
          );
        });
      }
    }
  );
  // Simple Expressions
  private simpleExpression = this.RULE('SimpleExpression', (): Nodes.Expression => {
    return this.OR({
      MAX_LOOKAHEAD: 6,
      DEF: [
        { ALT: () => this.SUBRULE(this._simpleExpression) },
        { ALT: () => this.SUBRULE(this.functionDefinition) },
      ],
    });
  });
  private _simpleExpression = this.RULE('_SimpleExpression', (): Nodes.Expression => {
    return this.OR({
      MAX_LOOKAHEAD: 3,
      DEF: [
        { ALT: () => this.SUBRULE(this.typeCastExpression) },
        { ALT: () => this.SUBRULE(this.unaryExpression) },
        { ALT: () => this.SUBRULE(this.callExpression, { ARGS: [false, false] }) },
        { ALT: () => this.SUBRULE(this.wasmCallExpression, { ARGS: [false] }) },
        { ALT: () => this.SUBRULE(this._literal) },
      ],
    });
  });
  private typeCastExpression = this.RULE('TypeCastExpression', (): Nodes.TypeCastExpression => {
    const location = this.CONSUME(Tokens.TknComparisonLessThan);
    const typeLiteral = this.SUBRULE(this.typeLiteral);
    this.CONSUME(Tokens.TknComparisonGreaterThan);
    const value = this.SUBRULE(this._simpleExpression);
    return this.ACTION((): Nodes.TypeCastExpression => {
      return {
        nodeType: Nodes.NodeType.TypeCastExpression,
        category: Nodes.NodeCategory.Expression,
        value: value,
        typeLiteral: typeLiteral,
        position: {
          offset: location.startOffset,
          length: value.position.offset + value.position.length - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private callExpression = this.RULE(
    'callExpression',
    (requireFunctionCall = false, statement = false): Nodes.Expression => {
      const calls: (Nodes.ArgumentsNode | Nodes.Expression)[] = [];
      const callee = this.OR({
        MAX_LOOKAHEAD: 3,
        DEF: [
          { ALT: () => this.SUBRULE(this.parenthesisExpression) },
          { ALT: () => this.SUBRULE(this.variableUsage) },
        ],
      });
      const FunctionHead = () => {
        this.AT_LEAST_ONE(() => calls.push(this.SUBRULE(this.arguments)));
        return this.ACTION((): Nodes.CallExpressionNode => {
          return calls.reduce((prevValue, currValue): Nodes.CallExpressionNode => {
            return {
              nodeType: Nodes.NodeType.CallExpression,
              category: Nodes.NodeCategory.Expression,
              callee: <Nodes.Expression>prevValue,
              args: (<Nodes.ArgumentsNode>currValue).args,
              statement: statement,
              position: {
                ...prevValue.position,
                length:
                  currValue.position.offset + currValue.position.length - prevValue.position.offset,
              },
            };
          }, callee);
        });
      };
      if (requireFunctionCall) return FunctionHead();
      else return this.OPTION(FunctionHead) || callee;
    }
  );
  private unaryExpression = this.RULE('UnaryExpression', (): Nodes.UnaryExpressionNode => {
    const { location, operator } = this.OR([
      {
        ALT: () => {
          return {
            location: this.CONSUME(Tokens.TknNot),
            operator: Nodes.UnaryExpressionOperator.UnaryNot,
          };
        },
      },
      {
        ALT: () => {
          return {
            location: this.CONSUME(Tokens.TknAdd),
            operator: Nodes.UnaryExpressionOperator.UnaryPositive,
          };
        },
      },
      {
        ALT: () => {
          return {
            location: this.CONSUME(Tokens.TknSub),
            operator: Nodes.UnaryExpressionOperator.UnaryNegative,
          };
        },
      },
    ]);
    const value = this.SUBRULE1(this.expression);
    return this.ACTION((): Nodes.UnaryExpressionNode => {
      return {
        nodeType: Nodes.NodeType.UnaryExpression,
        category: Nodes.NodeCategory.Expression,
        operator: operator,
        value: value,
        position: {
          offset: location.startOffset,
          length: value.position.offset + value.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private parenthesisExpression = this.RULE(
    'ParenthesisExpression',
    (): Nodes.ParenthesisExpressionNode => {
      const location = this.CONSUME(Tokens.TknLParen);
      const expression = this.SUBRULE(this.expression);
      const close = this.CONSUME(Tokens.TknRParen);
      return this.ACTION((): Nodes.ParenthesisExpressionNode => {
        return {
          nodeType: Nodes.NodeType.ParenthesisExpression,
          category: Nodes.NodeCategory.Expression,
          value: expression,
          position: {
            offset: location.startOffset,
            length: close.endOffset! - location.startOffset + 1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    }
  );
  private wasmCallExpression = this.RULE(
    'wasmCallExpression',
    (statement = false): Nodes.WasmCallExpressionNode => {
      const location = this.CONSUME(Tokens.TknWasmCall);
      const args = this.SUBRULE(this.arguments);
      return this.ACTION((): Nodes.WasmCallExpressionNode => {
        return {
          nodeType: Nodes.NodeType.WasmCallExpression,
          category: Nodes.NodeCategory.Expression,
          name: location.image,
          args: args.args,
          statement: statement,
          position: {
            offset: location.startOffset,
            length: args.position.offset + args.position.length - location.startOffset,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    }
  );
  private arguments = this.RULE('Arguments', (): Nodes.ArgumentsNode => {
    const args: Nodes.Expression[] = [];
    const location = this.CONSUME(Tokens.TknLParen);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => args.push(this.SUBRULE(this.expression)),
    });
    const close = this.CONSUME(Tokens.TknRParen);
    return {
      nodeType: Nodes.NodeType.Arguments,
      category: Nodes.NodeCategory.General,
      length: args.length,
      args: args,
      position: {
        offset: location.startOffset,
        length: close.endOffset! - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  // Literals
  private literal = this.RULE('Literal', (): Nodes.Literal => {
    return this.OR([
      { ALT: () => this.SUBRULE(this._literal) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
    ]);
  });
  private _literal = this.RULE('_Literal', (): Nodes.Literal => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.stringLiteral) },
      { ALT: () => this.SUBRULE(this.i32Literal) },
      { ALT: () => this.SUBRULE(this.i64Literal) },
      { ALT: () => this.SUBRULE(this.u32Literal) },
      { ALT: () => this.SUBRULE(this.u64Literal) },
      { ALT: () => this.SUBRULE(this.f32Literal) },
      { ALT: () => this.SUBRULE(this.f64Literal) },
      { ALT: () => this.SUBRULE(this.numberLiteral) },
      { ALT: () => this.SUBRULE(this.constantLiteral) },
      { ALT: () => this.SUBRULE(this.arrayLiteral) },
      { ALT: () => this.SUBRULE(this.objectLiteral) },
    ]);
  });
  private stringLiteral = this.RULE('StringLiteral', (): Nodes.StringLiteralNode => {
    const value = this.CONSUME(Tokens.TknString);
    return {
      nodeType: Nodes.NodeType.StringLiteral,
      category: Nodes.NodeCategory.Literal,
      value: value.image.slice(1, -1),
      position: {
        offset: value.startOffset,
        length: value.endOffset! - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private i32Literal = this.RULE('I32Literal', (): Nodes.I32LiteralNode => {
    const value = this.CONSUME(Tokens.TknI32);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.I32Literal,
        category: Nodes.NodeCategory.Literal,
        value: Number(value.image.slice(0, -1)),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private i64Literal = this.RULE('I64Literal', (): Nodes.I64LiteralNode => {
    const value = this.CONSUME(Tokens.TknI64);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.I64Literal,
        category: Nodes.NodeCategory.Literal,
        value: BigInt(value.image.slice(0, -1).replace(/_/g, '')),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private u32Literal = this.RULE('U32Literal', (): Nodes.U32LiteralNode => {
    const value = this.CONSUME(Tokens.TknU32);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.U32Literal,
        category: Nodes.NodeCategory.Literal,
        value: Number(value.image.slice(0, -1)),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private u64Literal = this.RULE('U64Literal', (): Nodes.U64LiteralNode => {
    const value = this.CONSUME(Tokens.TknU64);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.U64Literal,
        category: Nodes.NodeCategory.Literal,
        value: BigInt(value.image.slice(0, -1).replace(/_/g, '')),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private f32Literal = this.RULE('F32Literal', (): Nodes.F32LiteralNode => {
    const value = this.CONSUME(Tokens.TknF32);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.F32Literal,
        category: Nodes.NodeCategory.Literal,
        value: Number(value.image.slice(0, -1)),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private f64Literal = this.RULE('F64Literal', (): Nodes.F64LiteralNode => {
    const value = this.CONSUME(Tokens.TknF64);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.F64Literal,
        category: Nodes.NodeCategory.Literal,
        value: Number(value.image.slice(0, -1)),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private numberLiteral = this.RULE('NumberLiteral', (): Nodes.NumberLiteralNode => {
    const value = this.CONSUME(Tokens.TknNumber);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.NumberLiteral,
        category: Nodes.NodeCategory.Literal,
        value: Number(value.image),
        position: {
          offset: value.startOffset,
          length: value.endOffset! - value.startOffset + 1,
          line: value.startLine || 0,
          col: value.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private constantLiteral = this.RULE('ConstantLiteral', (): Nodes.ConstantLiteralNode => {
    const value = this.CONSUME(Tokens.TknConstant);
    return {
      nodeType: Nodes.NodeType.ConstantLiteral,
      category: Nodes.NodeCategory.Literal,
      value: <'true' | 'false' | 'void'>value.image,
      position: {
        offset: value.startOffset,
        length: value.endOffset! - value.startOffset + 1,
        line: value.startLine || 0,
        col: value.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private arrayLiteral = this.RULE('ArrayLiteralNode', (): Nodes.ArrayLiteralNode => {
    const elements: Nodes.Expression[] = [];
    const location = this.CONSUME(Tokens.TknLBracket);
    elements.push(this.SUBRULE(this.expression));
    this.MANY(() => {
      this.CONSUME(Tokens.TknComma);
      elements.push(this.SUBRULE1(this.expression));
    });
    this.OPTION(() => this.CONSUME1(Tokens.TknComma));
    const close = this.CONSUME(Tokens.TknRBracket);
    return {
      nodeType: Nodes.NodeType.ArrayLiteral,
      category: Nodes.NodeCategory.Literal,
      length: elements.length,
      elements: elements,
      position: {
        offset: location.startOffset,
        length: close.endOffset! - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private objectLiteral = this.RULE('ObjectLiteralNode', (): Nodes.ObjectLiteralNode => {
    const fields: (Nodes.ObjectFieldNode | Nodes.ValueSpreadNode)[] = [];
    const location = this.CONSUME(Tokens.TknLBrace);
    fields.push(this.SUBRULE(this.objectFieldValue));
    this.MANY(() => {
      this.CONSUME(Tokens.TknComma);
      fields.push(this.SUBRULE1(this.objectFieldValue));
    });
    this.OPTION(() => this.CONSUME1(Tokens.TknComma));
    const close = this.CONSUME(Tokens.TknRBrace);
    return {
      nodeType: Nodes.NodeType.ObjectLiteral,
      category: Nodes.NodeCategory.Literal,
      fields: fields,
      position: {
        offset: location.startOffset,
        length: close.endOffset! - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private objectFieldValue = this.RULE(
    'ObjectFieldValue',
    (): Nodes.ObjectFieldNode | Nodes.ValueSpreadNode => {
      return this.OR([
        { ALT: () => this.SUBRULE(this.valueSpread) },
        { ALT: () => this.SUBRULE(this.objectField) },
        {
          ALT: () => {
            const fieldValue = this.SUBRULE(this.variableUsageNode);
            return {
              nodeType: Nodes.NodeType.ObjectField,
              category: Nodes.NodeCategory.Literal,
              name: fieldValue.name,
              fieldValue: fieldValue,
              position: fieldValue.position,
            };
          },
        },
      ]);
    }
  );
  private objectField = this.RULE('ObjectField', (): Nodes.ObjectFieldNode => {
    const mutable: undefined | boolean = this.OPTION(() => {
      this.CONSUME(Tokens.TknLet);
      return true;
    });
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    this.CONSUME(Tokens.TknColon);
    const fieldValue = this.SUBRULE(this.expression);
    return this.ACTION((): Nodes.ObjectFieldNode => {
      return {
        nodeType: Nodes.NodeType.ObjectField,
        category: Nodes.NodeCategory.Literal,
        name: identifier.image,
        fieldValue: fieldValue,
        fieldMutable: mutable ?? false,
        position: {
          offset: identifier.startOffset,
          length: fieldValue.position.offset + fieldValue.position.length - identifier.startOffset,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private valueSpread = this.RULE('ValueSpread', (): Nodes.ValueSpreadNode => {
    const location = this.CONSUME(Tokens.TknEllipsis);
    const fieldValue = this.SUBRULE(this.expression);
    return this.ACTION((): Nodes.ValueSpreadNode => {
      return {
        nodeType: Nodes.NodeType.ValueSpread,
        category: Nodes.NodeCategory.Literal,
        value: fieldValue,
        position: {
          offset: location.startOffset,
          length: fieldValue.position.offset + fieldValue.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private variableUsage = this.RULE('Variable', (): Nodes.VariableUsage => {
    return this.OR({
      MAX_LOOKAHEAD: 2,
      DEF: [
        { ALT: () => this.SUBRULE(this.memberAccessNode) },
        { ALT: () => this.SUBRULE(this.variableUsageNode) },
      ],
    });
  });
  private variableDefinition = this.RULE('VariableDefinition', (): Nodes.VariableDefinition => {
    return this.OR([{ ALT: () => this.SUBRULE(this.variableDefinitionNode) }]);
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
          length: identifier.endOffset! - identifier.startOffset + 1,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    }
  );
  // TODO: Implement Object Destructuring
  private variableUsageNode = this.RULE('VariableUsageNode', (): Nodes.VariableUsageNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.VariableUsage,
      category: Nodes.NodeCategory.Variable,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        length: identifier.endOffset! - identifier.startOffset + 1,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
  private memberAccessNode = this.RULE('MemberAccess', (): Nodes.MemberAccessNode => {
    // TODO: Allow Member Access Nodes On Any Expression
    const parent = this.OR([
      { ALT: () => this.SUBRULE(this.variableUsageNode) },
      // { ALT: () => this.SUBRULE(this.parenthesisExpression) },
      // { ALT: () => this.SUBRULE(this.objectLiteral) },
      // { ALT: () => this.SUBRULE(this.callExpression, { ARGS: [false, true]}) },
    ]);
    const property = this.SUBRULE(this.propertyUsageNode);
    return this.ACTION((): Nodes.MemberAccessNode => {
      return {
        nodeType: Nodes.NodeType.MemberAccess,
        category: Nodes.NodeCategory.Variable,
        parent: parent,
        property: property,
        position: {
          offset: parent.position.offset,
          length: parent.position.length + property.position.length,
          line: parent.position.line,
          col: parent.position.col,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private propertyUsageNode = this.RULE('PropertyUsageNode', (): Nodes.PropertyUsageNode => {
    const start = this.CONSUME(Tokens.TknPeriod);
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    const property = this.OPTION(() => this.SUBRULE(this.propertyUsageNode));
    return this.ACTION((): Nodes.PropertyUsageNode => {
      let length = start.endOffset! - identifier.startOffset + 1;
      if (property) {
        length += property.position.length;
      }
      return {
        nodeType: Nodes.NodeType.PropertyUsage,
        category: Nodes.NodeCategory.Variable,
        name: identifier.image,
        property: property,
        position: {
          offset: start.startOffset,
          length: length,
          line: start.startLine || 0,
          col: start.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private functionDefinition = this.RULE('FunctionDefinition', (): Nodes.FunctionLiteralNode => {
    const params: Nodes.ParameterNode[] = [];
    const genericTypes = this.OPTION(() => this.SUBRULE(this.genericType));
    const location = this.CONSUME(Tokens.TknLParen);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        const mutable: undefined | boolean = this.OPTION1(() => {
          this.CONSUME(Tokens.TknLet);
          return true;
        });
        const name = this.SUBRULE(this.variableDefinition);
        const optional: undefined | boolean = this.OPTION2(() => {
          this.CONSUME(Tokens.TknQuestionMark);
          return true;
        });
        this.CONSUME(Tokens.TknColon);
        const paramType = this.SUBRULE(this.typeLiteral);
        params.push({
          nodeType: Nodes.NodeType.Parameter,
          category: Nodes.NodeCategory.Variable,
          name: name,
          optional: optional ?? false,
          mutable: mutable ?? false,
          paramType: paramType,
          position: name.position,
        });
      },
    });
    this.CONSUME(Tokens.TknRParen);
    this.CONSUME1(Tokens.TknColon);
    const returnType = this.SUBRULE1(this.typeLiteral);
    this.CONSUME(Tokens.TknThickArrow);
    const body = this.OR([
      {
        GATE: this.BACKTRACK(this.blockStatement),
        ALT: () => this.SUBRULE(this.blockStatement),
      },
      { ALT: () => this.SUBRULE(this.expression) },
    ]);
    return this.ACTION((): Nodes.FunctionLiteralNode => {
      return {
        nodeType: Nodes.NodeType.FunctionLiteral,
        category: Nodes.NodeCategory.Literal,
        params: params,
        returnType: returnType,
        body: body,
        genericTypes: genericTypes,
        data: {
          _closure: new Set(),
          _varStack: new Map(),
          _typeStack: new Map(),

          pathReturns: false,
        },
        position: {
          offset: location.startOffset,
          length: body.position.offset + body.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  // Types
  private typeLiteral = this.RULE('TypeLiteral', (): Nodes.TypeLiteral => {
    return this.SUBRULE(this.typeUnionLiteral);
  });
  // Type Definition
  private typeAlias = this.RULE('TypeAliasDefinition', (): Nodes.TypeAliasDefinitionNode => {
    const location = this.CONSUME(Tokens.TknType);
    const name = this.CONSUME(Tokens.TknIdentifier);
    const genericTypes = this.OPTION(() => this.SUBRULE(this.genericType));
    this.CONSUME(Tokens.TknEqual);
    const typeLiteral = this.SUBRULE(this.typeLiteral);
    return this.ACTION((): Nodes.TypeAliasDefinitionNode => {
      return {
        nodeType: Nodes.NodeType.TypeAliasDefinition,
        category: Nodes.NodeCategory.Type,
        name: name.image,
        typeLiteral: typeLiteral,
        genericTypes: genericTypes,
        data: {
          _typeStack: new Map(),
        },
        position: {
          offset: location.startOffset,
          length: typeLiteral.position.offset + typeLiteral.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private interfaceDefinition = this.RULE(
    'InterfaceDefinition',
    (): Nodes.InterfaceDefinitionNode => {
      const location = this.CONSUME(Tokens.TknInterface);
      const name = this.CONSUME(Tokens.TknIdentifier);
      const genericTypes = this.OPTION(() => this.SUBRULE(this.genericType));
      const interfaceLiteral = this.SUBRULE(this.InterfaceTypeLiteral);
      return this.ACTION((): Nodes.InterfaceDefinitionNode => {
        return {
          nodeType: Nodes.NodeType.InterfaceDefinition,
          category: Nodes.NodeCategory.Type,
          name: name.image,
          typeLiteral: interfaceLiteral,
          genericTypes: genericTypes,
          data: {
            _typeStack: new Map(),
          },
          position: {
            offset: location.startOffset,
            length:
              interfaceLiteral.position.offset +
              interfaceLiteral.position.length -
              location.startOffset -
              1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    }
  );
  // TypeLiteral
  private typeUnionLiteral = this.RULE('TypeUnionLiteral', (): Nodes.TypeLiteral => {
    const types: Nodes.TypeLiteral[] = [];
    const lhs = this.SUBRULE(this.arrayType);
    this.MANY(() => {
      this.CONSUME(Tokens.TknUnion);
      types.push(this.SUBRULE1(this.arrayType));
    });
    return this.ACTION((): Nodes.TypeLiteral => {
      if (types.length == 0) {
        return lhs;
      } else {
        const lastType = <Nodes.TypeLiteral>types.at(-1);
        return {
          nodeType: Nodes.NodeType.TypeUnionLiteral,
          category: Nodes.NodeCategory.Type,
          types: [lhs, ...types],
          position: {
            ...lhs.position,
            length: lastType.position.offset + lastType.position.length - lhs.position.offset,
          },
        };
      }
    });
  });
  private arrayType = this.RULE('ArrayType', (): Nodes.ArrayTypeLiteralNode | Nodes.TypeLiteral => {
    const value = this.SUBRULE(this._typeLiteral);
    const arrayType = this.OPTION(() => {
      this.CONSUME(Tokens.TknLBracket);
      const lengthValue = this.OPTION1(() => {
        return this.SUBRULE(this.numberLiteral);
      });
      const close = this.CONSUME(Tokens.TknRBracket);
      return {
        lengthValue: lengthValue,
        closeValue: close,
      };
    });
    return this.ACTION((): Nodes.ArrayTypeLiteralNode | Nodes.TypeLiteral => {
      if (arrayType) {
        const { lengthValue, closeValue } = arrayType;
        return {
          nodeType: Nodes.NodeType.ArrayTypeLiteral,
          category: Nodes.NodeCategory.Type,
          length: lengthValue,
          value: value,
          position: {
            offset: value.position.offset,
            length: closeValue.endOffset! - value.position.offset + 1,
            line: value.position.line,
            col: value.position.col,
            basePath: this.basePath,
            file: this.file,
          },
        };
      }
      return value;
    });
  });
  private _typeLiteral = this.RULE('_TypeLiteral', (): Nodes.TypeLiteral => {
    return this.OR([
      {
        GATE: this.BACKTRACK(this.functionSignatureLiteral),
        ALT: () => this.SUBRULE(this.functionSignatureLiteral),
      },
      { ALT: () => this.SUBRULE(this.parenthesisType) },
      { ALT: () => this.SUBRULE(this.InterfaceTypeLiteral) },
      { ALT: () => this.SUBRULE(this.typeUsageNode) },
    ]);
  });
  private parenthesisType = this.RULE('ParenthesisType', (): Nodes.ParenthesisTypeLiteralNode => {
    const location = this.CONSUME(Tokens.TknLParen);
    const value = this.SUBRULE(this.typeLiteral);
    const close = this.CONSUME(Tokens.TknRParen);
    return this.ACTION((): Nodes.ParenthesisTypeLiteralNode => {
      return {
        nodeType: Nodes.NodeType.ParenthesisTypeLiteral,
        category: Nodes.NodeCategory.Type,
        value: value,
        position: {
          offset: location.startOffset,
          length: close.endOffset! - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  private functionSignatureLiteral = this.RULE(
    'functionSignatureLiteral',
    (): Nodes.FunctionSignatureLiteralNode => {
      // TODO: Support Generic Type On FunctionSignature Literals
      const params: Nodes.TypeLiteral[] = [];
      const genericTypes = this.OPTION(() => this.SUBRULE(this.genericType));
      const location = this.CONSUME(Tokens.TknLParen);
      this.MANY_SEP({
        SEP: Tokens.TknComma,
        DEF: () => params.push(this.SUBRULE(this.typeLiteral)),
      });
      this.CONSUME(Tokens.TknRParen);
      this.CONSUME(Tokens.TknThickArrow);
      const returnType = this.SUBRULE1(this.typeLiteral);
      return this.ACTION((): Nodes.FunctionSignatureLiteralNode => {
        return {
          nodeType: Nodes.NodeType.FunctionSignatureLiteral,
          category: Nodes.NodeCategory.Type,
          params: params,
          returnType: returnType,
          genericTypes: genericTypes,
          data: {
            _typeStack: new Map(),
          },
          position: {
            offset: location.startOffset,
            length: returnType.position.offset + returnType.position.length - location.startOffset,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    }
  );
  private InterfaceTypeLiteral = this.RULE(
    'InterfaceTypeLiteralNode',
    (): Nodes.InterfaceLiteralNode => {
      const fields: Nodes.InterfaceFieldNode[] = [];
      const location = this.CONSUME(Tokens.TknLBrace);
      this.MANY(() => {
        fields.push(this.SUBRULE(this.interfaceField));
        this.CONSUME(Tokens.TknSemiColon);
      });
      const close = this.CONSUME(Tokens.TknRBrace);
      return {
        nodeType: Nodes.NodeType.InterfaceLiteral,
        category: Nodes.NodeCategory.Type,
        fields: fields,
        position: {
          offset: location.startOffset,
          length: close.endOffset! - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    }
  );
  private interfaceField = this.RULE('InterfaceField', (): Nodes.InterfaceFieldNode => {
    const mutable: undefined | boolean = this.OPTION(() => {
      this.CONSUME(Tokens.TknLet);
      return true;
    });
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    const optional: undefined | boolean = this.OPTION1(() => {
      this.CONSUME(Tokens.TknQuestionMark);
      return true;
    });
    this.CONSUME(Tokens.TknColon);
    const fieldType = this.SUBRULE(this.typeLiteral);
    return this.ACTION((): Nodes.InterfaceFieldNode => {
      return {
        nodeType: Nodes.NodeType.InterfaceField,
        category: Nodes.NodeCategory.Type,
        name: identifier.image,
        fieldType: fieldType,
        optional: optional ?? false,
        mutable: mutable ?? false,
        position: {
          offset: identifier.startOffset,
          length: fieldType.position.offset + fieldType.position.length - identifier.startOffset,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          basePath: this.basePath,
          file: this.file,
        },
      };
    });
  });
  // TypeUsage
  private typeUsageNode = this.RULE(
    'TypeUsage',
    (): Nodes.TypeUsageNode | Nodes.TypePrimLiteralNode => {
      const identifier = this.SUBRULE(this.typeIdentifier);
      if ((<Set<string>>Nodes.primTypes).has(identifier.name)) {
        return {
          nodeType: Nodes.NodeType.TypePrimLiteral,
          category: Nodes.NodeCategory.Type,
          name: <Nodes.PrimTypes>identifier.name,
          position: identifier.position,
        };
      } else {
        return {
          nodeType: Nodes.NodeType.TypeUsage,
          category: Nodes.NodeCategory.Type,
          name: identifier.name,
          position: identifier.position,
        };
      }
    }
  );
  // General Type Stuff
  private genericType = this.RULE('GenericType', (): Nodes.GenericTypeNode[] => {
    const generics: {
      identifier: Nodes.TypeIdentifierNode;
      constraints: Nodes.TypeLiteral | undefined;
    }[] = [];
    const location = this.CONSUME(Tokens.TknComparisonLessThan);
    const identifier = this.SUBRULE(this.typeIdentifier);
    const constraint = this.OPTION(() => {
      this.CONSUME(Tokens.TknEqual);
      return this.SUBRULE(this.typeLiteral);
    });
    generics.push({
      identifier: identifier,
      constraints: constraint,
    });
    this.MANY(() => {
      this.CONSUME(Tokens.TknComma);
      const identifier = this.SUBRULE1(this.typeIdentifier);
      const constraint = this.OPTION1(() => {
        this.CONSUME1(Tokens.TknEqual);
        return this.SUBRULE1(this.typeLiteral);
      });
      generics.push({
        identifier: identifier,
        constraints: constraint,
      });
    });
    const close = this.CONSUME(Tokens.TknComparisonGreaterThan);
    return this.ACTION((): Nodes.GenericTypeNode[] => {
      return generics.map((generic): Nodes.GenericTypeNode => {
        return {
          nodeType: Nodes.NodeType.GenericType,
          category: Nodes.NodeCategory.Type,
          name: generic.identifier.name,
          constraints: generic.constraints,
          valueType: undefined,
          position: {
            offset: location.startOffset,
            length: close.endOffset! - location.startOffset + 1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            basePath: this.basePath,
            file: this.file,
          },
        };
      });
    });
  });
  private typeIdentifier = this.RULE('TypeIdentifier', (): Nodes.TypeIdentifierNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.TypeIdentifier,
      category: Nodes.NodeCategory.Type,
      name: identifier.image,
      position: {
        offset: identifier.startOffset,
        length: identifier.endOffset! - identifier.startOffset + 1,
        line: identifier.startLine || 0,
        col: identifier.startColumn || 0,
        basePath: this.basePath,
        file: this.file,
      },
    };
  });
}
// Parse code
const parse = (lexingResult: ILexingResult, code: string, basePath: string, file: string) => {
  // =================================================================
  const parser = new Parser(Tokens.Tokens, basePath, file);
  // "input" is a setter which will reset the parser's state.
  parser.input = lexingResult.tokens;
  const parsed = parser.program();
  if (parser.errors.length > 0) {
    const { message, token } = parser.errors[0];
    const expectedSemiColon = message == 'Expected SemiColon';
    const position = {
      offset: token.startOffset,
      length: expectedSemiColon ? 1 : (token.endOffset ?? 0) - token.startOffset + 1,
      line: token.startLine || 0,
      col: token.startColumn || 0,
      basePath: basePath,
      file: file,
    };
    BriskCustomError(code, 'ParseError', message, position);
  }
  if (parsed == undefined) {
    throw new Error('Parsed was undefined');
  }
  // =================================================================
  return parsed;
};
export default parse;
