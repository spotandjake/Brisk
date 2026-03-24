---
title: Parser
---

This module exposes the main parser for brisk.

This modules only responsibility is at the program level,
actual parsing implementations are implemented in the other parsing modules focused
on specific sections of the syntax.

## Values

Functions and constants included in the Parser module.

### Parser.**parse**

```grain
parse:
  (source: a, content: String) =>
   Result<ParseTree.Program<a>, Errors.BriskError<a>>
```

