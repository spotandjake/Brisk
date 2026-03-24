---
title: ParseTree
---

## Types

Type declarations included in the ParseTree module.

### ParseTree.**Program**

```grain
record Program<a> {
  position: Range.Range<a>,
  body: Structure.Component<a>,
}
```

## ParseTree.Literal

### Types

Type declarations included in the ParseTree.Literal module.

#### ParseTree.Literal.**StringLiteral**

```grain
record StringLiteral<a> {
  position: Range.Range<a>,
  value: String,
}
```

#### ParseTree.Literal.**CharLiteral**

```grain
record CharLiteral<a> {
  position: Range.Range<a>,
  value: Char,
}
```

#### ParseTree.Literal.**BooleanLiteral**

```grain
record BooleanLiteral<a> {
  position: Range.Range<a>,
  value: Bool,
}
```

#### ParseTree.Literal.**Int8Literal**

```grain
record Int8Literal<a> {
  position: Range.Range<a>,
  value: Int8,
}
```

#### ParseTree.Literal.**Int16Literal**

```grain
record Int16Literal<a> {
  position: Range.Range<a>,
  value: Int16,
}
```

#### ParseTree.Literal.**Int32Literal**

```grain
record Int32Literal<a> {
  position: Range.Range<a>,
  value: Int32,
}
```

#### ParseTree.Literal.**Int64Literal**

```grain
record Int64Literal<a> {
  position: Range.Range<a>,
  value: Int64,
}
```

#### ParseTree.Literal.**Uint8Literal**

```grain
record Uint8Literal<a> {
  position: Range.Range<a>,
  value: Uint8,
}
```

#### ParseTree.Literal.**Uint16Literal**

```grain
record Uint16Literal<a> {
  position: Range.Range<a>,
  value: Uint16,
}
```

#### ParseTree.Literal.**Uint32Literal**

```grain
record Uint32Literal<a> {
  position: Range.Range<a>,
  value: Uint32,
}
```

#### ParseTree.Literal.**Uint64Literal**

```grain
record Uint64Literal<a> {
  position: Range.Range<a>,
  value: Uint64,
}
```

#### ParseTree.Literal.**Float32Literal**

```grain
record Float32Literal<a> {
  position: Range.Range<a>,
  value: Float32,
}
```

#### ParseTree.Literal.**Float64Literal**

```grain
record Float64Literal<a> {
  position: Range.Range<a>,
  value: Float64,
}
```

#### ParseTree.Literal.**Literal**

```grain
enum Literal<a> {
  String(StringLiteral<a>),
  Char(CharLiteral<a>),
  Boolean(BooleanLiteral<a>),
  Int8(Int8Literal<a>),
  Int16(Int16Literal<a>),
  Int32(Int32Literal<a>),
  Int64(Int64Literal<a>),
  Uint8(Uint8Literal<a>),
  Uint16(Uint16Literal<a>),
  Uint32(Uint32Literal<a>),
  Uint64(Uint64Literal<a>),
  Float32(Float32Literal<a>),
  Float64(Float64Literal<a>),
}
```

## ParseTree.Expression

### Types

Type declarations included in the ParseTree.Expression module.

#### ParseTree.Expression.**Pattern**

```grain
type Pattern<a> = String
```

#### ParseTree.Expression.**LetExpression**

```grain
record LetExpression<a> {
  position: Range.Range<a>,
  binds: List<(Pattern<a>, Expression<a>)>,
}
```

#### ParseTree.Expression.**IfExpression**

```grain
record IfExpression<a> {
  position: Range.Range<a>,
  condition: Expression<a>,
  thenBranch: Expression<a>,
  elseBranch: Option<Expression<a>>,
}
```

#### ParseTree.Expression.**MatchExpression**

```grain
record MatchExpression<a> {
  position: Range.Range<a>,
  value: Expression<a>,
  cases: List<(Pattern<a>, Expression<a>)>,
}
```

#### ParseTree.Expression.**WhileExpression**

```grain
record WhileExpression<a> {
  position: Range.Range<a>,
  condition: Expression<a>,
  body: Expression<a>,
}
```

#### ParseTree.Expression.**ForExpression**

```grain
record ForExpression<a> {
  position: Range.Range<a>,
  init: Option<Expression<a>>,
  test: Option<Expression<a>>,
  update: Option<Expression<a>>,
  body: Expression<a>,
}
```

#### ParseTree.Expression.**BlockExpression**

```grain
record BlockExpression<a> {
  position: Range.Range<a>,
  body: List<Expression<a>>,
}
```

#### ParseTree.Expression.**LiteralExpression**

```grain
record LiteralExpression<a> {
  position: Range.Range<a>,
  value: Literal.Literal<a>,
}
```

#### ParseTree.Expression.**BinaryOperationExpression**

```grain
record BinaryOperationExpression<a> {
  position: Range.Range<a>,
  operator: String,
  left: Expression<a>,
  right: Expression<a>,
}
```

#### ParseTree.Expression.**PrefixOperationExpression**

```grain
record PrefixOperationExpression<a> {
  position: Range.Range<a>,
  operator: String,
  operand: Expression<a>,
}
```

#### ParseTree.Expression.**PostfixOperationExpression**

```grain
record PostfixOperationExpression<a> {
  position: Range.Range<a>,
  operator: String,
  operand: Expression<a>,
}
```

#### ParseTree.Expression.**CallExpression**

```grain
record CallExpression<a> {
  position: Range.Range<a>,
  callee: Expression<a>,
  arguments: List<Expression<a>>,
}
```

#### ParseTree.Expression.**ReturnExpression**

```grain
record ReturnExpression<a> {
  position: Range.Range<a>,
  value: Option<Expression<a>>,
}
```

#### ParseTree.Expression.**BreakExpression**

```grain
record BreakExpression<a> {
  position: Range.Range<a>,
}
```

#### ParseTree.Expression.**ContinueExpression**

```grain
record ContinueExpression<a> {
  position: Range.Range<a>,
}
```

#### ParseTree.Expression.**CastExpression**

```grain
record CastExpression<a> {
  position: Range.Range<a>,
  value: Expression<a>,
  targetType: String,
}
```

#### ParseTree.Expression.**ArrayIndexExpression**

```grain
record ArrayIndexExpression<a> {
  position: Range.Range<a>,
  array: Expression<a>,
  index: Expression<a>,
}
```

#### ParseTree.Expression.**MemberAccessExpression**

```grain
record MemberAccessExpression<a> {
  position: Range.Range<a>,
  object: Expression<a>,
  property: String,
}
```

#### ParseTree.Expression.**IdentifierExpression**

```grain
record IdentifierExpression<a> {
  position: Range.Range<a>,
  name: String,
}
```

#### ParseTree.Expression.**Expression**

```grain
enum Expression<a> {
  Let(LetExpression<a>),
  If(IfExpression<a>),
  Match(MatchExpression<a>),
  While(WhileExpression<a>),
  For(ForExpression<a>),
  Block(BlockExpression<a>),
  BinaryOperation(BinaryOperationExpression<a>),
  PrefixOperation(PrefixOperationExpression<a>),
  PostfixOperation(PostfixOperationExpression<a>),
  Call(CallExpression<a>),
  Return(ReturnExpression<a>),
  Break(BreakExpression<a>),
  Continue(ContinueExpression<a>),
  Cast(CastExpression<a>),
  Literal(LiteralExpression<a>),
  ArrayIndex(ArrayIndexExpression<a>),
  MemberAccess(MemberAccessExpression<a>),
  Identifier(IdentifierExpression<a>),
}
```

## ParseTree.Module

### Types

Type declarations included in the ParseTree.Module module.

#### ParseTree.Module.**Include**

```grain
record Include<a> {
  position: Range.Range<a>,
  file: String,
  identifier: String,
}
```

#### ParseTree.Module.**Provide**

```grain
record Provide<a> {
  position: Range.Range<a>,
  declaration: Expression.Expression<a>,
}
```

#### ParseTree.Module.**ModuleStatement**

```grain
enum ModuleStatement<a> {
  Include(Include<a>),
  Provide(Provide<a>),
  Expression(Expression.Expression<a>),
}
```

## ParseTree.Structure

### Types

Type declarations included in the ParseTree.Structure module.

#### ParseTree.Structure.**Module**

```grain
record Module<a> {
  position: Range.Range<a>,
  name: String,
  body: List<ModuleContent<a>>,
}
```

#### ParseTree.Structure.**ModuleContent**

```grain
enum ModuleContent<a> {
  SubModule(Module<a>),
  ModuleStatement(Module.ModuleStatement<a>),
}
```

#### ParseTree.Structure.**Component**

```grain
record Component<a> {
  position: Range.Range<a>,
  name: String,
  body: List<ComponentContent<a>>,
}
```

#### ParseTree.Structure.**ComponentContent**

```grain
enum ComponentContent<a> {
  Module(Module<a>),
  Component(Component<a>),
}
```

