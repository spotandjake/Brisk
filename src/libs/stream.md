---
title: Stream
---

A module for working with streams of bytes.

Streams are used to advance through and read data from a byte array.

```grain
from "./stream.gr" include Stream
```

```grain
let bytes = Stream.fromString("hello")
assert Stream.Get.char(bytes) == "h"
assert Stream.GetAndAdvance.char(bytes) == "h"
assert Stream.Expect.char("h", bytes) == true
assert Stream.ExpectAndAdvance.char("e", bytes) == true
```

## Types

Type declarations included in the Stream module.

### Stream.**Stream**

```grain
type Stream
```

A stream of bytes.

## Values

Functions and constants included in the Stream module.

### Stream.**fromBytes**

```grain
fromBytes: (bytes: Bytes) => Stream
```

Create a stream from a byte object.

Parameters:

| param   | type    | description                             |
| ------- | ------- | --------------------------------------- |
| `bytes` | `Bytes` | The byte array to convert into a stream |

Returns:

| type     | description       |
| -------- | ----------------- |
| `Stream` | : A stream object |

Examples:

```grain
Stream.fromBytes(b"hello")
```

### Stream.**fromString**

```grain
fromString: (string: String) => Stream
```

Create a stream from a string.

Parameters:

| param    | type     | description                         |
| -------- | -------- | ----------------------------------- |
| `string` | `String` | The string to convert into a stream |

Returns:

| type     | description       |
| -------- | ----------------- |
| `Stream` | : A stream object |

Examples:

```grain
Stream.fromString("hello")
```

### Stream.**isEmpty**

```grain
isEmpty: (stream: Stream) => Bool
```

Checks if we have reached the end of the stream.

Parameters:

| param    | type     | description         |
| -------- | -------- | ------------------- |
| `stream` | `Stream` | The stream to check |

Returns:

| type   | description                                                  |
| ------ | ------------------------------------------------------------ |
| `Bool` | `true` if we are at the end of the stream, `false` otherwise |

Examples:

```grain
let stream = Stream.fromString("hello")
assert Stream.isEmpty(stream) == false
Stream.advance(5, stream)
assert Stream.isEmpty(stream) == true
```

### Stream.**getPosition**

```grain
getPosition: (stream: Stream) => Number
```

Get the current position in the stream.

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the position of |

Examples:

```grain
let stream = Stream.fromString("hello")
assert Stream.getPosition(stream) == 0
Stream.advance(1, stream)
assert Stream.getPosition(stream) == 1
```

### Stream.**getLine**

```grain
getLine: (stream: Stream) => Number
```

Get the current line in the stream.

Parameters:

| param    | type     | description                   |
| -------- | -------- | ----------------------------- |
| `stream` | `Stream` | The stream to get the line of |

Examples:

```grain
let stream = Stream.fromString("hello\nworld")
assert Stream.getLine(stream) == 1
Stream.advanceLine(stream)
assert Stream.getLine(stream) == 2
```

### Stream.**getColumn**

```grain
getColumn: (stream: Stream) => Number
```

Get the current column in the stream.

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the column of |

Examples:

```grain
let stream = Stream.fromString("hello\nworld")
assert Stream.getColumn(stream) == 1
Stream.advance(5, stream)
assert Stream.getColumn(stream) == 6
Stream.advanceLine(stream)
assert Stream.getColumn(stream) == 1
```

### Stream.**getByteSize**

```grain
getByteSize: (stream: Stream) => Number
```

Get the size of the stream in bytes.

Parameters:

| param    | type     | description                   |
| -------- | -------- | ----------------------------- |
| `stream` | `Stream` | The stream to get the size of |

Returns:

| type     | description                       |
| -------- | --------------------------------- |
| `Number` | : The size of the stream in bytes |

Examples:

```grain
let stream = Stream.fromString("hello")
assert Stream.getByteSize(stream) == 5
```

```grain
let stream = Stream.fromString("Hello 🌍")
assert Stream.getByteSize(stream) == 10
```

### Stream.**getBytes**

```grain
getBytes: (stream: Stream) => Bytes
```

Get the remaining bytes in the stream.

Parameters:

| param    | type     | description                              |
| -------- | -------- | ---------------------------------------- |
| `stream` | `Stream` | The stream to get the remaining bytes of |

Examples:

```grain
Stream.getBytes(Stream.fromString("hello")) == b"hello"
```

## Stream.Advance

Utilities for advancing the stream.

### Values

Functions and constants included in the Stream.Advance module.

#### Stream.Advance.**advance**

```grain
advance: (byteCount: Number, stream: Stream) => Void
```

Advance the stream by a given number of bytes.

Parameters:

| param       | type     | description                                  |
| ----------- | -------- | -------------------------------------------- |
| `byteCount` | `Number` | The number of bytes to advance the stream by |
| `stream`    | `Stream` | The stream to advance                        |

Examples:

```grain
let stream = Stream.fromString("hello")
Stream.advance(4, stream)
assert Stream.Get.char(stream) == "0"
```

#### Stream.Advance.**advanceLine**

```grain
advanceLine: (stream: Stream) => Void
```

Advance the stream by one line.

The columns is reset to 0 and the line count is incremented.
line and column positions do not affect the position in the stream.

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

Examples:

```grain
let stream = Stream.fromString("helloworld")
Stream.advanceLine(stream)
Stream.advanceLine(stream)
assert Stream.Get.char(stream) == "h"
assert Stream.getLine(stream) == 2
```

#### Stream.Advance.**byte**

```grain
byte: (stream: Stream) => Void
```

Advance the stream by one byte.

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

Examples:

```grain
let stream = Stream.fromString("hello")
Stream.Advance.byte(stream)
assert Stream.Get.char(stream) == "e"
```

#### Stream.Advance.**bytes**

```grain
bytes: (byteCount: Number, stream: Stream) => Void
```

Advance the stream by `byteCount` bytes.

Parameters:

| param       | type     | description                                  |
| ----------- | -------- | -------------------------------------------- |
| `byteCount` | `Number` | The number of bytes to advance the stream by |
| `stream`    | `Stream` | The stream to advance                        |

Examples:

```grain
let stream = Stream.fromString("hello")
Stream.Advance.bytes(2, stream)
assert Stream.Get.char(stream) == "l"
```

#### Stream.Advance.**int64**

```grain
int64: (stream: Stream) => Void
```

Advance the stream by the size of an int64 (8 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**int32**

```grain
int32: (stream: Stream) => Void
```

Advance the stream by the size of an int32 (4 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**int16**

```grain
int16: (stream: Stream) => Void
```

Advance the stream by the size of an int16 (2 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**int8**

```grain
int8: (stream: Stream) => Void
```

Advance the stream by the size of an int8 (1 byte).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**uint64**

```grain
uint64: (stream: Stream) => Void
```

Advance the stream by the size of a uint64 (8 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**uInt32**

```grain
uInt32: (stream: Stream) => Void
```

Advance the stream by the size of a uint32 (4 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**uInt16**

```grain
uInt16: (stream: Stream) => Void
```

Advance the stream by the size of a uint16 (2 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**uInt8**

```grain
uInt8: (stream: Stream) => Void
```

Advance the stream by the size of a uint8 (1 byte).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**float64**

```grain
float64: (stream: Stream) => Void
```

Advance the stream by the size of a float64 (8 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**float32**

```grain
float32: (stream: Stream) => Void
```

Advance the stream by the size of a float32 (4 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

#### Stream.Advance.**char**

```grain
char: (stream: Stream) => Void
```

Advance the stream by the size of a char (1-4 bytes).

Parameters:

| param    | type     | description           |
| -------- | -------- | --------------------- |
| `stream` | `Stream` | The stream to advance |

## Stream.Get

Utilities for reading the next item in the stream.

These functions read the next item in the stream, but do not advance the stream.

```grain
let stream = Stream.fromString("hello")
assert Stream.Get.char(stream) == "h"
```

### Values

Functions and constants included in the Stream.Get module.

#### Stream.Get.**byte**

```grain
byte: (stream: Stream) => Uint8
```

Get the next byte in the stream.

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the byte from |

Returns:

| type    | description                   |
| ------- | ----------------------------- |
| `Uint8` | : The next byte in the stream |

Examples:

```grain
let stream = Stream.fromString("hello")
assert Stream.Get.byte(stream) == 104
```

#### Stream.Get.**bytes**

```grain
bytes: (byteCount: Number, stream: Stream) => Bytes
```

Get the next `byteCount` bytes in the stream.

Parameters:

| param       | type     | description                      |
| ----------- | -------- | -------------------------------- |
| `byteCount` | `Number` | The number of bytes to get       |
| `stream`    | `Stream` | The stream to get the bytes from |

Returns:

| type    | description                                |
| ------- | ------------------------------------------ |
| `Bytes` | : The next `byteCount` bytes in the stream |

Examples:

```grain
let stream = Stream.fromString("hello")
assert Stream.Get.bytes(2, stream) == b"he"
```

#### Stream.Get.**int64**

```grain
int64: (stream: Stream) => Int64
```

Get the next int64 in the stream.

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int64 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int64` | : The next int64 in the stream |

#### Stream.Get.**int32**

```grain
int32: (stream: Stream) => Int32
```

Get the next int32 in the stream.

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int32 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int32` | : The next int32 in the stream |

#### Stream.Get.**int16**

```grain
int16: (stream: Stream) => Int16
```

Get the next int16 in the stream.

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int16 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int16` | : The next int16 in the stream |

#### Stream.Get.**int8**

```grain
int8: (stream: Stream) => Int8
```

Get the next int8 in the stream.

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the int8 from |

Returns:

| type   | description                   |
| ------ | ----------------------------- |
| `Int8` | : The next int8 in the stream |

#### Stream.Get.**uInt64**

```grain
uInt64: (stream: Stream) => Uint64
```

Get the next uint64 in the stream.

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint64 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint64` | : The next uint64 in the stream |

#### Stream.Get.**uInt32**

```grain
uInt32: (stream: Stream) => Uint32
```

Get the next uint32 in the stream.

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint32 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint32` | : The next uint32 in the stream |

#### Stream.Get.**uInt16**

```grain
uInt16: (stream: Stream) => Uint16
```

Get the next uint16 in the stream.

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint16 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint16` | : The next uint16 in the stream |

#### Stream.Get.**uInt8**

```grain
uInt8: (stream: Stream) => Uint8
```

Get the next uint8 in the stream.

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the uint8 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Uint8` | : The next uint8 in the stream |

#### Stream.Get.**float64**

```grain
float64: (stream: Stream) => Float64
```

Get the next float64 in the stream.

Parameters:

| param    | type     | description                        |
| -------- | -------- | ---------------------------------- |
| `stream` | `Stream` | The stream to get the float64 from |

Returns:

| type      | description                      |
| --------- | -------------------------------- |
| `Float64` | : The next float64 in the stream |

#### Stream.Get.**float32**

```grain
float32: (stream: Stream) => Float32
```

Get the next float32 in the stream.

Parameters:

| param    | type     | description                        |
| -------- | -------- | ---------------------------------- |
| `stream` | `Stream` | The stream to get the float32 from |

Returns:

| type      | description                      |
| --------- | -------------------------------- |
| `Float32` | : The next float32 in the stream |

#### Stream.Get.**char**

```grain
char: (stream: Stream) => Char
```

Get the next char in the stream.

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the char from |

Returns:

| type   | description                   |
| ------ | ----------------------------- |
| `Char` | : The next char in the stream |

## Stream.GetAndAdvance

Utilities for reading the next item in the stream and advancing the stream.

### Values

Functions and constants included in the Stream.GetAndAdvance module.

#### Stream.GetAndAdvance.**byte**

```grain
byte: (stream: Stream) => Uint8
```

Get the next byte in the stream and advance the stream by one byte.

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the byte from |

Returns:

| type    | description                   |
| ------- | ----------------------------- |
| `Uint8` | : The next byte in the stream |

#### Stream.GetAndAdvance.**bytes**

```grain
bytes: (byteCount: Number, stream: Stream) => Bytes
```

Get the next `byteCount` bytes in the stream and advance the stream by `byteCount` bytes.

Parameters:

| param       | type     | description                      |
| ----------- | -------- | -------------------------------- |
| `byteCount` | `Number` | The number of bytes to get       |
| `stream`    | `Stream` | The stream to get the bytes from |

Returns:

| type    | description                              |
| ------- | ---------------------------------------- |
| `Bytes` | The next `byteCount` bytes in the stream |

#### Stream.GetAndAdvance.**int64**

```grain
int64: (stream: Stream) => Int64
```

Get the next int64 in the stream and advance the stream by the size of an int64 (8 bytes).

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int64 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int64` | : The next int64 in the stream |

#### Stream.GetAndAdvance.**int32**

```grain
int32: (stream: Stream) => Int32
```

Get the next int32 in the stream and advance the stream by the size of an int32 (4 bytes).

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int32 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int32` | : The next int32 in the stream |

#### Stream.GetAndAdvance.**int16**

```grain
int16: (stream: Stream) => Int16
```

Get the next int16 in the stream and advance the stream by the size of an int16 (2 bytes).

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the int16 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Int16` | : The next int16 in the stream |

#### Stream.GetAndAdvance.**int8**

```grain
int8: (stream: Stream) => Int8
```

Get the next int8 in the stream and advance the stream by the size of an int8 (1 byte).

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the int8 from |

Returns:

| type   | description                   |
| ------ | ----------------------------- |
| `Int8` | : The next int8 in the stream |

#### Stream.GetAndAdvance.**uint64**

```grain
uint64: (stream: Stream) => Uint64
```

Get the next uint64 in the stream and advance the stream by the size of a uint64 (8 bytes).

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint64 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint64` | : The next uint64 in the stream |

#### Stream.GetAndAdvance.**uInt32**

```grain
uInt32: (stream: Stream) => Uint32
```

Get the next uint32 in the stream and advance the stream by the size of a uint32 (4 bytes).

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint32 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint32` | : The next uint32 in the stream |

#### Stream.GetAndAdvance.**uInt16**

```grain
uInt16: (stream: Stream) => Uint16
```

Get the next uint16 in the stream and advance the stream by the size of a uint16 (2 bytes).

Parameters:

| param    | type     | description                       |
| -------- | -------- | --------------------------------- |
| `stream` | `Stream` | The stream to get the uint16 from |

Returns:

| type     | description                     |
| -------- | ------------------------------- |
| `Uint16` | : The next uint16 in the stream |

#### Stream.GetAndAdvance.**uInt8**

```grain
uInt8: (stream: Stream) => Uint8
```

Get the next uint8 in the stream and advance the stream by the size of a uint8 (1 byte).

Parameters:

| param    | type     | description                      |
| -------- | -------- | -------------------------------- |
| `stream` | `Stream` | The stream to get the uint8 from |

Returns:

| type    | description                    |
| ------- | ------------------------------ |
| `Uint8` | : The next uint8 in the stream |

#### Stream.GetAndAdvance.**float64**

```grain
float64: (stream: Stream) => Float64
```

Get the next float64 in the stream and advance the stream by the size of a float64 (8 bytes).

Parameters:

| param    | type     | description                        |
| -------- | -------- | ---------------------------------- |
| `stream` | `Stream` | The stream to get the float64 from |

Returns:

| type      | description                      |
| --------- | -------------------------------- |
| `Float64` | : The next float64 in the stream |

#### Stream.GetAndAdvance.**float32**

```grain
float32: (stream: Stream) => Float32
```

Get the next float32 in the stream and advance the stream by the size of a float32 (4 bytes).

Parameters:

| param    | type     | description                        |
| -------- | -------- | ---------------------------------- |
| `stream` | `Stream` | The stream to get the float32 from |

Returns:

| type      | description                      |
| --------- | -------------------------------- |
| `Float32` | : The next float32 in the stream |

#### Stream.GetAndAdvance.**char**

```grain
char: (stream: Stream) => Char
```

Get the next char in the stream and advance the stream by the size of a char (1-4 bytes).

Parameters:

| param    | type     | description                     |
| -------- | -------- | ------------------------------- |
| `stream` | `Stream` | The stream to get the char from |

Returns:

| type   | description                   |
| ------ | ----------------------------- |
| `Char` | : The next char in the stream |

## Stream.ExpectAndAdvance

### Values

Functions and constants included in the Stream.ExpectAndAdvance module.

#### Stream.ExpectAndAdvance.**byte**

```grain
byte: (byte: Uint8, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**bytes**

```grain
bytes: (bytes: Bytes, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**int64**

```grain
int64: (value: Int64, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**int32**

```grain
int32: (value: Int32, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**int16**

```grain
int16: (value: Int16, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**int8**

```grain
int8: (value: Int8, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**uInt64**

```grain
uInt64: (value: Uint64, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**uInt32**

```grain
uInt32: (value: Uint32, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**uInt16**

```grain
uInt16: (value: Uint16, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**uInt8**

```grain
uInt8: (value: Uint8, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**float64**

```grain
float64: (value: Float64, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**float32**

```grain
float32: (value: Float32, stream: Stream) => Bool
```

#### Stream.ExpectAndAdvance.**char**

```grain
char: (value: Char, stream: Stream) => Bool
```

