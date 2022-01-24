// Imports
import { EmbeddedActionsParser, TokenType, ILexingResult } from 'chevrotain';
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
      maxLookahead: 2,
      skipValidations: !__DEBUG__,
      errorMessageProvider: ErrorProvider(file),
    });
    this.file = file;
    this.performSelfAnalysis();
  }
  // Grammar
  public program = this.RULE('Program', (): Nodes.ProgramNode => {
    const body = this.SUBRULE(this.topLevelStatementList);
    return {
      nodeType: Nodes.NodeType.Program,
      category: Nodes.NodeCategory.General,
      body: body,
      position: {
        offset: 0,
        length: (<number>this.input.at(-1)?.endOffset || -1) + 1,
        line: 0,
        col: 0,
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
        { ALT: () => body.push(this.SUBRULE(this.flag)) },
      ]);
    });
    return body;
  });
  private topLevelStatement = this.RULE('TopLevelStatement', (): Nodes.Statement => {
    const statement = this.OR([
      { ALT: () => this.SUBRULE(this.importStatement) },
      { ALT: () => this.SUBRULE(this.exportStatement) },
    ]);
    this.CONSUME(Tokens.TknSemiColon);
    this.ACTION(() => (statement.position.length += 1));
    return statement;
  });
  private statement = this.RULE('Statement', (): Nodes.Statement => {
    const statement = this.SUBRULE(this._statement);
    this.CONSUME(Tokens.TknSemiColon);
    this.ACTION(() => (statement.position.length += 1));
    return statement;
  });
  private _statement = this.RULE('_Statement', (): Nodes.Statement => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.blockStatement) },
      { ALT: () => this.SUBRULE(this.typeDefinition) },
      { ALT: () => this.SUBRULE(this.returnStatement) },
      { ALT: () => this.SUBRULE(this.ifStatement) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
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
    this.MANY(() => {
      body.push(this.SUBRULE(this.statement));
    });
    const close = this.CONSUME(Tokens.TknRBrace);
    return {
      nodeType: Nodes.NodeType.BlockStatement,
      category: Nodes.NodeCategory.Statement,
      body: body,
      position: {
        offset: open.startOffset,
        length: <number>close.endOffset - open.startOffset + 1,
        line: open.startLine || 0,
        col: open.startColumn || 0,
        file: this.file,
      },
    };
  });
  private singleLineStatement = this.RULE('SingleLineStatement', (): Nodes.Statement => {
    return this.OR({
      IGNORE_AMBIGUITIES: true,
      DEF: [
        { ALT: () => this.SUBRULE(this.postFixStatement) },
        { ALT: () => this.SUBRULE(this.expressionStatement) },
        { ALT: () => this.SUBRULE(this.assignmentStatement) },
      ],
    });
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
          const alternative = this.OPTION(() => {
            this.CONSUME(Tokens.TknSemiColon);
            this.CONSUME(Tokens.TknElse);
            return this.SUBRULE(this._statement);
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
      position: {
        offset: location.startOffset,
        length:
          (alternative?.position.offset || body?.position.offset) +
          (alternative?.position.length || body?.position.length) -
          location.startOffset,
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
      const variable = this.OR([
        {
          ALT: () => {
            return this.SUBRULE(this.variableDefinitionNode);
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
      return this.ACTION(() => {
        if (typeSignature == undefined) {
          // TODO: we want to add support for destructuring imports
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
              file: this.file,
            },
          };
        }
      });
    }
  );
  private exportStatement = this.RULE('ExportStatement', (): Nodes.ExportStatementNode => {
    const location = this.CONSUME(Tokens.TknExport);
    const variable = this.OR([
      { ALT: () => this.SUBRULE(this.variable) },
      { ALT: () => this.SUBRULE(this.declarationStatement) },
      { ALT: () => this.SUBRULE(this.objectLiteral) },
    ]);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.ExportStatement,
        category: Nodes.NodeCategory.Statement,
        value: variable, // Allow exporting groups of variables
        position: {
          offset: location.startOffset,
          length: variable.position.offset + variable.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
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
    const name = this.SUBRULE(this.variableDefinitionNode);
    this.CONSUME(Tokens.TknColon);
    const varType = this.SUBRULE(this.typeLiteral);
    this.CONSUME(Tokens.assignmentOperators);
    const value = this.SUBRULE(this.expression);
    return this.ACTION(() => {
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
          file: this.file,
        },
      };
    });
  });
  private assignmentStatement = this.RULE(
    'assignmentStatement',
    (): Nodes.AssignmentStatementNode => {
      // TODO: Allow Support For Assigning To Member Access Nodes
      const name = this.SUBRULE(this.variableUsageNode);
      this.CONSUME(Tokens.assignmentOperators);
      const value = this.SUBRULE(this.expression);
      return this.ACTION(() => {
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
    const returnValue = this.SUBRULE(this.expression);
    const close = this.CONSUME(Tokens.TknRParen);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.ReturnStatement,
        category: Nodes.NodeCategory.Statement,
        returnValue: returnValue,
        position: {
          offset: location.startOffset,
          length: <number>close.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    });
  });
  private postFixStatement = this.RULE('PostFixStatement', (): Nodes.PostFixStatementNode => {
    const value = this.SUBRULE(this.variable);
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
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.PostFixStatement,
        category: Nodes.NodeCategory.Statement,
        operator: operator,
        value: value,
        position: {
          ...value.position,
          length: <number>location.endOffset - value.position.offset,
        },
      };
    });
  });
  private expressionStatement = this.RULE('expressionStatement', (): Nodes.Expression => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.callExpression, { ARGS: [true] }) },
      { ALT: () => this.SUBRULE(this.wasmCallExpression) },
    ]);
  });
  // Expressions
  private expression = this.RULE('Expression', (): Nodes.Expression => {
    return this.SUBRULE(this.comparisonExpression);
  });
  // TODO: Implement These In Brisk
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
      MAX_LOOKAHEAD: 3,
      DEF: [
        { ALT: () => this.SUBRULE(this.unaryExpression) },
        { ALT: () => this.SUBRULE(this.callExpression, { ARGS: [false] }) },
        { ALT: () => this.SUBRULE(this.wasmCallExpression) },
        { ALT: () => this.SUBRULE(this.literal) },
      ],
    });
  });
  private callExpression = this.RULE(
    'callExpression',
    (requireFunctionCall = false): Nodes.Expression => {
      const calls: (Nodes.ArgumentsNode | Nodes.Expression)[] = [];
      const callee = this.OR({
        MAX_LOOKAHEAD: 3,
        DEF: [
          { ALT: () => this.SUBRULE(this.parenthesisExpression) },
          { ALT: () => this.SUBRULE(this.variable) },
        ],
      });
      const FunctionHead = () => {
        this.AT_LEAST_ONE(() => calls.push(this.SUBRULE(this.arguments)));
        return this.ACTION(() => {
          return <Nodes.CallExpressionNode>calls.reduce((prevValue, currValue) => {
            return {
              nodeType: Nodes.NodeType.CallExpression,
              category: Nodes.NodeCategory.Expression,
              callee: <Nodes.Expression>prevValue,
              args: (<Nodes.ArgumentsNode>currValue).args,
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
    return this.ACTION(() => {
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
      return this.ACTION(() => {
        return {
          nodeType: Nodes.NodeType.ParenthesisExpression,
          category: Nodes.NodeCategory.Expression,
          value: expression,
          position: {
            offset: location.startOffset,
            length: <number>close.endOffset - location.startOffset + 1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            file: this.file,
          },
        };
      });
    }
  );
  private wasmCallExpression = this.RULE('wasmCallExpression', (): Nodes.WasmCallExpressionNode => {
    const location = this.CONSUME(Tokens.TknWasmCall);
    const args = this.SUBRULE(this.arguments);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.WasmCallExpression,
        category: Nodes.NodeCategory.Expression,
        name: location.image,
        args: args.args,
        position: {
          offset: location.startOffset,
          length: args.position.offset + args.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    });
  });
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
      args: args,
      position: {
        offset: location.startOffset,
        length: <number>close.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  // Literals
  private literal = this.RULE('Literal', (): Nodes.Literal => {
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
      { ALT: () => this.SUBRULE(this.objectLiteral) },
      { ALT: () => this.SUBRULE(this.functionDefinition) },
    ]);
  });
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
  private constantLiteral = this.RULE('ConstantLiteral', (): Nodes.ConstantLiteralNode => {
    const value = this.CONSUME(Tokens.TknConstant);
    return {
      nodeType: Nodes.NodeType.ConstantLiteral,
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
  private objectLiteral = this.RULE('ObjectLiteralNode', (): Nodes.ObjectLiteralNode => {
    const fields: (Nodes.ObjectFieldNode | Nodes.ObjectSpreadNode)[] = [];
    const location = this.CONSUME(Tokens.TknLBrace);
    this.AT_LEAST_ONE_SEP({
      SEP: Tokens.TknComma,
      DEF: () =>
        this.OR([
          { ALT: () => fields.push(this.SUBRULE(this.objectSpread)) },
          { ALT: () => fields.push(this.SUBRULE(this.objectField)) },
          {
            ALT: () => {
              const fieldValue = this.SUBRULE(this.variableUsageNode);
              fields.push({
                nodeType: Nodes.NodeType.ObjectField,
                category: Nodes.NodeCategory.Literal,
                name: <string>fieldValue.name,
                fieldValue: fieldValue,
                position: fieldValue.position,
              });
            },
          },
        ]),
    });
    const close = this.CONSUME(Tokens.TknRBrace);
    return {
      nodeType: Nodes.NodeType.ObjectLiteral,
      category: Nodes.NodeCategory.Literal,
      fields: fields,
      position: {
        offset: location.startOffset,
        length: <number>close.endOffset - location.startOffset + 1,
        line: location.startLine || 0,
        col: location.startColumn || 0,
        file: this.file,
      },
    };
  });
  private objectField = this.RULE('ObjectField', (): Nodes.ObjectFieldNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    this.CONSUME(Tokens.TknColon);
    const fieldValue = this.SUBRULE(this.expression);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.ObjectField,
        category: Nodes.NodeCategory.Literal,
        name: identifier.image,
        fieldValue: fieldValue,
        position: {
          offset: identifier.startOffset,
          length: fieldValue.position.offset + fieldValue.position.length - identifier.startOffset,
          line: identifier.startLine || 0,
          col: identifier.startColumn || 0,
          file: this.file,
        },
      };
    });
  });
  private objectSpread = this.RULE('ObjectSpread', (): Nodes.ObjectSpreadNode => {
    const location = this.CONSUME(Tokens.TknEllipsis);
    const fieldValue = this.SUBRULE(this.expression);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.ObjectSpread,
        category: Nodes.NodeCategory.Literal,
        fieldValue: fieldValue,
        position: {
          offset: location.startOffset,
          length: fieldValue.position.offset + fieldValue.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    });
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
    // TODO: We Want To Allow The Main Object To Be Any Expression
    const props: Nodes.PropertyUsageNode[] = [];
    const parent = this.OR([
      { ALT: () => this.SUBRULE(this.variableUsageNode) },
      // { ALT: () => this.SUBRULE(this.parenthesisExpression) },
      // { ALT: () => this.SUBRULE(this.objectLiteral) },
    ]);
    this.AT_LEAST_ONE(() => {
      this.CONSUME(Tokens.TknPeriod);
      props.push(this.SUBRULE(this.propertyUsageNode));
    });
    return this.ACTION(() => {
      return <Nodes.MemberAccessNode>props.reduce((prevValue: Nodes.Expression, currValue) => {
        return {
          nodeType: Nodes.NodeType.MemberAccess,
          category: Nodes.NodeCategory.Variable,
          parent: prevValue,
          property: currValue,
          position: {
            ...prevValue.position,
            length:
              currValue.position.offset + currValue.position.length - prevValue.position.offset,
          },
        };
      }, parent);
    });
  });
  private propertyUsageNode = this.RULE('PropertyUsageNode', (): Nodes.PropertyUsageNode => {
    const identifier = this.CONSUME(Tokens.TknIdentifier);
    return {
      nodeType: Nodes.NodeType.PropertyUsage,
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
  private functionDefinition = this.RULE('FunctionDefinition', (): Nodes.FunctionLiteralNode => {
    const params: Nodes.ParameterNode[] = [];
    const location = this.CONSUME(Tokens.TknLParen);
    this.MANY_SEP({
      SEP: Tokens.TknComma,
      DEF: () => {
        const name = this.SUBRULE(this.variableDefinitionNode);
        const optional: undefined | boolean = this.OPTION1(() => {
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
          paramType: paramType,
        });
      },
    });
    this.CONSUME(Tokens.TknRParen);
    this.CONSUME1(Tokens.TknColon);
    const returnType = this.SUBRULE1(this.typeLiteral);
    this.CONSUME(Tokens.TknThickArrow);
    const body = this.SUBRULE(this._statement);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.FunctionLiteral,
        category: Nodes.NodeCategory.Literal,
        returnType: returnType,
        params: params,
        body: body,
        position: {
          offset: location.startOffset,
          length: body.position.offset + body.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
          file: this.file,
        },
      };
    });
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
    const name = this.CONSUME(Tokens.TknIdentifier);
    this.CONSUME(Tokens.TknEqual);
    const typeLiteral = this.SUBRULE(this.typeLiteral);
    return this.ACTION(() => {
      return {
        nodeType: Nodes.NodeType.TypeAliasDefinition,
        category: Nodes.NodeCategory.Type,
        name: name.image,
        typeLiteral: typeLiteral,
        position: {
          offset: location.startOffset,
          length: typeLiteral.position.offset + typeLiteral.position.length - location.startOffset,
          line: location.startLine || 0,
          col: location.startColumn || 0,
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
      const interfaceLiteral = this.SUBRULE(this.InterfaceTypeLiteral);
      return this.ACTION(() => {
        return {
          nodeType: Nodes.NodeType.InterfaceDefinition,
          category: Nodes.NodeCategory.Type,
          name: name.image,
          typeLiteral: interfaceLiteral,
          position: {
            offset: location.startOffset,
            length:
              interfaceLiteral.position.offset +
              interfaceLiteral.position.length -
              location.startOffset -
              1,
            line: location.startLine || 0,
            col: location.startColumn || 0,
            file: this.file,
          },
        };
      });
    }
  );
  // TypeLiteral
  private typeUnionLiteral = this.RULE('TypeUnionLiteral', (): Nodes.TypeLiteral => {
    const types: Nodes.TypeLiteral[] = [];
    const lhs = this.SUBRULE(this._typeLiteral);
    this.MANY(() => {
      this.CONSUME(Tokens.TknUnion);
      types.push(this.SUBRULE1(this._typeLiteral));
    });
    return this.ACTION(() => {
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
  private _typeLiteral = this.RULE('_TypeLiteral', (): Nodes.TypeLiteral => {
    return this.OR([
      { ALT: () => this.SUBRULE(this.functionSignatureLiteral) },
      { ALT: () => this.SUBRULE(this.InterfaceTypeLiteral) },
      { ALT: () => this.SUBRULE(this.typeUsageNode) },
    ]);
  });
  private functionSignatureLiteral = this.RULE(
    'functionSignatureLiteral',
    (): Nodes.FunctionSignatureLiteralNode => {
      const params: Nodes.TypeLiteral[] = [];
      const location = this.CONSUME(Tokens.TknLParen);
      this.MANY_SEP({
        SEP: Tokens.TknComma,
        DEF: () => params.push(this.SUBRULE(this.typeLiteral)),
      });
      this.CONSUME(Tokens.TknRParen);
      this.CONSUME(Tokens.TknThickArrow);
      const returnType = this.SUBRULE1(this.typeLiteral);
      return this.ACTION(() => {
        return {
          nodeType: Nodes.NodeType.FunctionSignatureLiteral,
          category: Nodes.NodeCategory.Type,
          params: params,
          returnType: returnType,
          position: {
            offset: location.startOffset,
            length: returnType.position.offset + returnType.position.length - location.startOffset,
            line: location.startLine || 0,
            col: location.startColumn || 0,
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
          length: <number>close.endOffset - location.startOffset + 1,
          line: location.startLine || 0,
          col: location.startColumn || 0,
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
    return this.ACTION(() => {
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
          file: this.file,
        },
      };
    });
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
