---
title: Helpers
---

Helpers for parsing.

## Values

Functions and constants included in the Helpers module.

### Helpers.**getStreamPosition**

```grain
getStreamPosition: (source: a, stream: Stream.Stream) => Position.Position<a>
```

Constructs a position from the given stream.

Parameters:

| param    | type            | description                                |
| -------- | --------------- | ------------------------------------------ |
| `source` | `a`             | The source of the stream                   |
| `stream` | `Stream.Stream` | The actual byte stream we are operating on |

Returns:

| type                   | description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `Position.Position<a>` | A position representing the current location in the stream |

### Helpers.**skipWhiteSpace**

```grain
skipWhiteSpace: (stream: Stream.Stream) => Void
```

Skips whitespace characters in the stream until it encounters a non-whitespace character.

WhiteSpace:
- ' ' (space)
- '\t' (tab)
- '\n' (newline)
- '\r' (carriage return)
- ';' (semicolon)

Parameters:

| param    | type            | description                   |
| -------- | --------------- | ----------------------------- |
| `stream` | `Stream.Stream` | The byte stream to operate on |

### Helpers.**parseStructuralIdentifier**

```grain
parseStructuralIdentifier:
  (source: a, stream: Stream.Stream) => Result<String, Errors.BriskError<a>>
```

Parses a structural identifier from the stream.

StructuralIdentifier:
- An identifier that can be used for modules and components.
- [A-Z][a-zA-Z0-9_]*

Parameters:

| param    | type            | description                   |
| -------- | --------------- | ----------------------------- |
| `source` | `a`             | The source of the stream      |
| `stream` | `Stream.Stream` | The byte stream to operate on |

Returns:

| type                                   | description                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Result<String, Errors.BriskError<a>>` | `Ok(identifier)` if successful, or `Err(err)` if the stream is empty or the identifier is invalid |

