# Stack
```
simple number    0bxx1
pointer*         0b000
reserved         0b010
reserved         0b100
constants        0b110
```
## Number
|  0-31  | 32  |
|--------|-----|
| Number | Tag |

Tagged as `2n+1`.

## Constants
| Value |   Number   |
|-------|------------|
| true  | 4294967294 |
| false | 2147483646 |

# Heap