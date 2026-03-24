---
title: Errors
---

Utilities and definitions for working with compiler errors in Brisk.

## Types

Type declarations included in the Errors module.

### Errors.**BriskError**

```grain
enum BriskError<a> {
  ParsingError(Position.Position<a>, String),
  ParsingUnexpectedEndOfInput(Position.Position<a>),
}
```

A list of all possible compiler errors in brisk.

## Values

Functions and constants included in the Errors module.

### Errors.**errorToString**

```grain
errorToString:
  (error: BriskError<a>, sourceToString: ((source: a) => String)) => String
```

Formats an error into a human-readable string, including the error code, message, and position information.

Parameters:

| param            | type                    | description                                                                                                |
| ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `error`          | `BriskError<a>`         | The error to format.                                                                                       |
| `sourceToString` | `(source: a) => String` | A function that takes a source location and returns a human-readable string representation of that source. |

Returns:

| type     | description                       |
| -------- | --------------------------------- |
| `String` | A formatted error message string. |

