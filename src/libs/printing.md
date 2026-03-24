---
title: Printing
---

This modules defines utilities for printing styled text to an ascii console.

## Types

Type declarations included in the Printing module.

### Printing.**Styles**

```grain
enum Styles {
  FgBlack,
  FgRed,
  FgGreen,
  FgYellow,
  FgBlue,
  FgMagenta,
  FgCyan,
  FgWhite,
  FgRGB(Number, Number, Number),
  BgBlack,
  BgRed,
  BgGreen,
  BgYellow,
  BgBlue,
  BgMagenta,
  BgCyan,
  BgWhite,
  Reset,
  Bold,
  Dim,
  Underline,
  Inverse,
  Hidden,
}
```

Styles that can be applied to a given text.

These styles match the ANSI escape codes for styling text in a terminal.

## Values

Functions and constants included in the Printing module.

### Printing.**getEscapeCode**

```grain
getEscapeCode: (option: Styles) => String
```

Retrieves the ANSI escape code corresponding to the given style option.

Parameters:

| param    | type     | description                                        |
| -------- | -------- | -------------------------------------------------- |
| `option` | `Styles` | The style option for which to get the escape code. |

Returns:

| type     | description                                                          |
| -------- | -------------------------------------------------------------------- |
| `String` | A string containing the ANSI escape code for the given style option. |

### Printing.**style**

```grain
style: (text: String, options: List<Styles>) => String
```

Applies the given styles to the provided text.

Parameters:

| param     | type           | description                            |
| --------- | -------------- | -------------------------------------- |
| `text`    | `String`       | The text to style.                     |
| `options` | `List<Styles>` | A list of styles to apply to the text. |

Returns:

| type     | description                                                    |
| -------- | -------------------------------------------------------------- |
| `String` | A string containing the original text with the styles applied. |

