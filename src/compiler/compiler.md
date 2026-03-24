---
title: Compiler
---

## Values

Functions and constants included in the Compiler module.

### Compiler.**compile**

```grain
compile:
  (source: a, openSource: ((source: a) => String),
   sourceToString: ((source: a) => String)) => Bytes
```

Compiles the given source.

Parameters:

| param            | type                    | description                                                                                                                                                                                                                                                     |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`         | `a`                     | The source location (e.g., filepath, url, etc.) of the code being compiled.                                                                                                                                                                                     |
| `openSource`     | `(source: a) => String` | A function that takes a source location and returns the corresponding source code as a string. This allows the compiler to read source code from various locations (e.g., filesystem, network, etc.) without being tightly coupled to a specific I/O mechanism. |
| `sourceToString` | `(source: a) => String` | A function that takes a source location and returns a human-readable string representation of that source.                                                                                                                                                      |

Returns:

| type    | description         |
| ------- | ------------------- |
| `Bytes` | A compiled program. |

## Compiler.Pipeline

### Values

Functions and constants included in the Compiler.Pipeline module.

#### Compiler.Pipeline.**parse**

```grain
parse:
  (source: a, content: String) =>
   Result<ParseTree.Program<a>, Errors.BriskError<a>>
```

Parses the source code into a raw parse tree.

This is the first step in the compilation process, where the raw source code is transformed into
a structured representation that captures the important syntactic elements of the program.

Parameters:

| param     | type     | description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `source`  | `a`      | The source location (e.g., filepath, url, etc.) of the code being parsed. |
| `content` | `String` | The raw source code as a string.                                          |

Returns:

| type                                                 | description                                                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Result<ParseTree.Program<a>, Errors.BriskError<a>>` | `Ok(program)` if parsing is successful, or `Err(Error)` if there are syntax errors or other issues during parsing. |

#### Compiler.Pipeline.**source**

```grain
source: (program: ParseTree.Program<a>) => Void
```

Constructs the source tree from the parse tree.

