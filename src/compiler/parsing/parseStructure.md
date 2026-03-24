---
title: ParseStructure
---

## Values

Functions and constants included in the ParseStructure module.

### ParseStructure.**parseModule**

```grain
parseModule:
  (source: a, stream: Stream.Stream) =>
   Result<ParseTree.Structure.ComponentContent<a>, Errors.BriskError<a>>
```

### ParseStructure.**parseComponent**

```grain
parseComponent:
  (source: a, stream: Stream.Stream) =>
   Result<ParseTree.Structure.ComponentContent<a>, Errors.BriskError<a>>
```

