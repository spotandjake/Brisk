---
title: Position
---

Utilities for working with source positions.

What is a source position? Throughout the compiler we want to be able to track
the origin within the source of various constructs. This is important for error
reporting, source maps and other features. Regularly this is done with a simple
position { file: String, line: Int, column: Int, offset: Int } however,
this model assumes that the source is always a file, which is not the
case for us. In our case, we track source positions using a type,
all code still has a string source, so we still track
`{ line: Int, column: Int, offset: Int }`, but instead of a file
we track the source which can be a file, url, module, or any other concept.

What difference does this make? While this doesn't impact the user much,
it does greatly improve our ability to run the compiler in different
environments, such as the browser, where we may not have a file system, or
we may want to compile code from a url or module.

## Types

Type declarations included in the Position module.

### Position.**Position**

```grain
record Position<a> {
  source: a,
  line: Uint32,
  column: Uint32,
  offset: Uint32,
}
```

A position in the source code.

NOTE: The source does not have to be a file.

Fields:

| name     | type     | description                        |
| -------- | -------- | ---------------------------------- |
| `source` | `a0`     | The source of the position.        |
| `line`   | `Uint32` | The line number of the position.   |
| `column` | `Uint32` | The column number of the position. |
| `offset` | `Uint32` | The offset of the position.        |

## Values

Functions and constants included in the Position module.

### Position.**make**

```grain
make:
  (source: a, line: Uint32, column: Uint32, offset: Uint32) => Position<a>
```

Creates a brand new position.

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `source` | `a`      | The source of the position        |
| `line`   | `Uint32` | The line number of the position   |
| `column` | `Uint32` | The column number of the position |
| `offset` | `Uint32` | The offset of the position        |

Returns:

| type          | description                 |
| ------------- | --------------------------- |
| `Position<a>` | A brand new source position |

