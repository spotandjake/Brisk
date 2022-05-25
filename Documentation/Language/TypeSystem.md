# Type System
================================================================

## Introduction
Brisk Has A Very Strong Type System That Allows For User Defined Types.

## Defining Types
User Defined Types Are A Very Important Part Of Brisk They Are What Allows Things Such A The `Number Type` To Exist In The Language Itself.

Types Can Be Defined As Interfaces Below Or By Using The Type Keyword Using The Pattern Shown In The Sample Below.
```ts
type Data = i32 | i64;
```

## Interfaces
Interfaces Define The Properties And Type's The Value Of Each Property In An Object Have. You Can Define An Interface Using The Same Pattern As The Sample Below.
```ts
interface Test {
  field1: i32;
  field2: i64;
};
```
To Use An Interface You Can Do.
```ts
const test: Test = {
  field1: 1n,
  field2: 1N
};
```
An Error will be thrown if there are fields missing or the types do not match, The Properties Of The Interface Above Are Both Immutable And Mandatory To Allow Optional Properties You Can Do.
```ts
interface Test {
  field1: i32;
  field2?: i64; // This Field is Optional
};
```
It is important to note that accessing optional fields will need to be protected by type guards to ensure consistent types;
Mutable Fields Can Be Defined using the same pattern as the sample below.
```ts
interface Test {
  let field1: i32; // This field is mutable
};
```

Another Caveat of Brisk Interfaces Is That The Order Of The Fields Matters. You Need To Keep The Fields In The Correct Order Or Else They Will Error.

## Union Types
union types allow you to say a property or value is going to be one of several types this is useful in cases where you may want a function that can take a ton of different types of values such as a user friendly print function.

Union Types Can Be Defined Using The Syntax.
```ts
i32 | i64
```
These Can Be Used In And Type Field.

## Parenthesis Types
Just Like In Expressions Parenthesis Can Wrap Types keeping The Precedence Of The Types Clear. This Can Solve The Ambiguity In Code Such As The Example Below.
```ts
type Function1 = (i32, i32) => i32 | i64;
```
Is Function1 of Type `(i32, i32) => (i32 | i64)` or `((i32, i32) => i32) | i64`. We Can Make It Clear Which One Of These It Is By Putting Parenthesis Around The Function Type.

## Primitive Types
Primitive Types Are The Types That Are Included In The Compiler. We Try To Keep Most Types In The Language Itself But You Cant Create Types Without Some Basic Types Below Is A List Of Basic Types And There Purpose.

| Name     | Implementation Status | Usage                                                     |
|----------|-----------------------|-----------------------------------------------------------|
| i32      | Used                  | Wasm Stack Type For The Wasm i32 Value                    |
| i64      | Used                  | Wasm Stack Type For The Wasm i64 Value                    |
| u32      | Used                  | Wasm Stack Type For Unsigned i32                          |
| u64      | Used                  | Wasm Stack Type For Unsigned i64                          |
| f32      | Used                  | Wasm Stack Type For 32 Bit Float                          |
| f64      | Used                  | Wasm Stack Type For 64 Bit Float                          |
| Void     | Used                  | Defines An Empty Value, May Be Moved To The Stdlib        |
| Boolean  | Temporary             | Defines A True Or False Value, May Be Moved To The Stdlib |
| Array    | Not Implemented       | Defines A List Of Data, May Be Moved To The Stdlib        |
| Number   | Partially Implemented | Defines A User Friendly Number                            |
| Function | Used                  | An Alias For Function Types That Can Be Inferred          |


## Defining Functions Types
Function Types Are Different From Most Other Types In The Language Because You Need To Define Parameters And A Return Type To Define A Function Type You Can Use The Pattern Below
```ts
type FunctionExample = (i32, i32) => i32;
```

## Type Casting
Type Casting Is Used A Lot In Brisk, The Type Checker Compares Types At The Top Level For Instance In The Example Below We Have A User Defined Type Named `Int32` Which Represents A value of an `i32` But we Cannot use the `integer` Variable In `field1` because It Expects An `i32`.
```ts
interface Numbers {
  field1: i32;
};
type Int32 = i32;
const integer: Int32 = 1n;
const integers: Numbers = {
  field1: integer // This Will Error Because The Types Do Not Match
};
```
In This Case We Need To Cast integer To i32 before we can put in the field we do that in the example below.
```ts
interface Numbers {
  field1: i32;
};
type Int32 = i32;
const integer: Int32 = 1n;
const integers: Numbers = {
  field1: <i32>integer
};
```

You Can Type Cast Any Structurally Compatible Type In Brisk.

### What Is A Structurally Compatible Type?
A Type Is Compatible With Another Type In A Few Cases Example Number 1, The Primitive Type Is The Same (`Int32` Resolves to `i32` which is the same as `i32`). Example 2 The Interface Is Compatible ( It Has The Same Properties Of The Same Type). Example 3 The Type Matches One Of The Types Defined In A Type Union.

## The Function Type
Personally I Find Writing Function Signatures To Be Painful So Brisk Has Your Back With The Function Type. The `Function` Type Is A Special Type That Can Only Be Used In Variable Definitions Or Return Statements.
The Function Type Infers The Type Of The Function Based On Context For Example.
```ts
const func: Function = (x: i32): i32 => 1n;
```
func would not be of type `Function` but instead of type `(i32) => i32`.

# Enums
In Brisk Enums Are A Very Special Case Defining An Enum Defines Both A Type And A Value. Enums Values May Be Casted To Any Type As Long As They Are Compatible, By Default Enum Values Are Of The Type of the Enum They Are Defined Under.