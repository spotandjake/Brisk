# Type System
================================================================

## Introduction
Brisk has a strong type system that allows for user defined types.

## Defining Types
User defined types are a very important part of Brisk they are what allows things such as the `Number` type to exist in the language itself.

Types can be defined as interfaces below or by using the type keyword using the pattern shown in the sample below.
```ts
type Data = i32 | i64;
```

## Interfaces
Interfaces define the properties and type's the value of each property in an object have. you can define an interface using the same pattern as the sample below.
```ts
interface Test {
  field1: i32;
  field2: i64;
};
```
An interface can be used following the pattern below.
```ts
const test: Test = {
  field1: 1n,
  field2: 1N
};
```
An error will be thrown if there are fields missing or the types do not match, the properties of the interface above are both immutable and mandatory to allow optional properties you can do.
```ts
interface Test {
  field1: i32;
  field2?: i64; // This Field is Optional
};
```
It is important to note that accessing optional fields will need to be protected by type guards to ensure consistent types;
mutable fields can be defined using the same pattern as the sample below.
```ts
interface Test {
  let field1: i32; // This field is mutable
};
```

Another caveat of Brisk interfaces is that the order of the fields matters. you need to keep the fields in the correct order or else they will error.

## Union Types
Union types allow you to say a property or value is going to be one of several types this is useful in cases where you may want a function that can take a ton of different types of values such as a user friendly print function.

Union Types Can Be Defined Using The Syntax.
```ts
i32 | i64
```
These Can Be Used In And Type Field.

## Parenthesis Types
Just like in expressions parenthesis can wrap types keeping the precedence of the types clear. this can solve the ambiguity in code such as the example below.
```ts
type Function1 = (i32, i32) => i32 | i64;
```
Is function1 of type `(i32, i32) => (i32 | i64)` or `((i32, i32) => i32) | i64`. we can make it clear which one of these it is, by putting parenthesis around the function type.

## Primitive Types
Primitive types are the types that are included in the compiler. we try to keep most types in the language itself but you can not create types without some primtive types below is a list of basic types and there purpose.
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
Function types are different from most other types in the language because you need to define parameters and a return type to define a function type you can use the pattern below.
```ts
type FunctionExample = (i32, i32) => i32;
```

## Type Casting
Type casting is used a lot in Brisk, They allow you to specify that you want to treat one type as another as long as they are compatible.
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
In this case we need to cast integer to i32 before we can put in the field we do that in the example below.
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

You can type cast any structurally compatible type in brisk.

### What Is A Structurally Compatible Type?
A type is compatible with another type in a few cases example number 1, the primitive type is the same (`int32` resolves to `i32` which is the same as `i32`). example 2 the interface is compatible ( it has the same properties of the same type). example 3 the type matches one of the types defined in a type union.

## The Function Type
Personally i find writing function signatures to be painful so brisk has your back with the function type. the `Function` type is a special type that can only be used in variable definitions or return statements.
the function type infers the type of the function based on context for example.
```ts
const func: Function = (x: i32): i32 => 1n;
```
func would not be of type `Function` but instead of type `(i32) => i32`.

# Enums
In Brisk enums are a very special case defining an enum defines both a type and a value. enums values may be casted to any type as long as they are compatible, by default enum values are of the type of the enum they are defined under.