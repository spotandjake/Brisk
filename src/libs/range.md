---
title: Range
---

Utilities for working with source ranges.

## Types

Type declarations included in the Range module.

### Range.**Range**

```grain
record Range<a> {
  start: Position.Position<a>,
  end: Position.Position<a>,
}
```

Fields:

| name    | type                    | description                      |
| ------- | ----------------------- | -------------------------------- |
| `start` | `Position.Position<a0>` | The start position of the range. |
| `end`   | `Position.Position<a0>` | The end position of the range.   |

## Values

Functions and constants included in the Range module.

### Range.**make**

```grain
make: (start: Position.Position<a>, end: Position.Position<a>) => Range<a>
```

Creates a brand new source range.

NOTE: The start and end positions must have the same source.

Parameters:

| param   | type                   | description                     |
| ------- | ---------------------- | ------------------------------- |
| `start` | `Position.Position<a>` | The start position of the range |
| `end`   | `Position.Position<a>` | The end position of the range   |

Returns:

| type       | description              |
| ---------- | ------------------------ |
| `Range<a>` | A brand new source range |

Throws:

`Failure(String)`

* If the start and end positions have different sources

