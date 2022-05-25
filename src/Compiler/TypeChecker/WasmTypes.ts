import { Position } from '../Types/Types';
import {
  TypeLiteral,
  // NodeType
} from '../Types/ParseNodes';
import {
  createFunctionSignatureType,
  createPrimType,
  createUnionType,
} from '../Helpers/typeBuilders';
// Type Functions
const u32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'u32');
const u64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'u64');
const i32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'i32');
const i64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'i64');
const f32Type = (pos: Position): TypeLiteral => createPrimType(pos, 'f32');
const f64Type = (pos: Position): TypeLiteral => createPrimType(pos, 'f64');
const voidType = (pos: Position): TypeLiteral => createPrimType(pos, 'Void');
const ptrType = (pos: Position): TypeLiteral => createPrimType(pos, 'i32');
// WasmTypes Lists
type wasmType = { [key: string]: ((pos: Position) => TypeLiteral) | wasmType };
// TODO: Convert The Wasm Expression Object Into A Bunch of If Statements
// Wasm Expression Type Signatures
export const wasmExpressions: wasmType = {
  // General
  local: {
    // TODO: Get
    set: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [
          i32Type(pos),
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    },
    // TODO: Tee
  },
  global: {
    // TODO: Get
    set: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [
          i32Type(pos),
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    },
  },
  table: {
    // TODO: Get
    // TODO: Set
    // TODO: Size
    // TODO: Grow
    // TODO: Init
    // TODO: Fill
    // TODO: Copy
  },
  memory: {
    size: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [], ptrType(pos), new Map());
    },
    grow: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [ptrType(pos)], ptrType(pos), new Map());
    },
    init: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    copy: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    fill: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    atomic: {
      notify: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i32Type(pos)],
          i32Type(pos),
          new Map()
        );
      },
      wait32: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i32Type(pos), i64Type(pos)],
          i32Type(pos),
          new Map()
        );
      },
      wait64: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i64Type(pos), i64Type(pos)],
          i32Type(pos),
          new Map()
        );
      },
    },
  },
  data: {
    drop: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [
          createUnionType(
            pos,
            u32Type(pos),
            u64Type(pos),
            i32Type(pos),
            i64Type(pos),
            f32Type(pos),
            f64Type(pos)
          ),
        ],
        voidType(pos),
        new Map()
      );
    },
  },
  i32: {
    load: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i32Type(pos),
        new Map()
      );
    },
    load8_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i32Type(pos),
        new Map()
      );
    },
    load8_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i32Type(pos),
        new Map()
      );
    },
    load16_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i32Type(pos),
        new Map()
      );
    },
    load16_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i32Type(pos),
        new Map()
      );
    },
    store: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    store8: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    store16: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    const: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    clz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    ctz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    popcnt: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    eqz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    trunc_s: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
      },
    },
    trunc_u: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
      },
    },
    trunc_s_sat: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
      },
    },
    trunc_u_sat: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i32Type(pos), new Map());
      },
    },
    reinterpret: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], i32Type(pos), new Map());
    },
    extend8_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    extend16_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], i32Type(pos), new Map());
    },
    wrap: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i32Type(pos), new Map());
    },
    add: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    sub: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    mul: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    div_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    div_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    rem_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    rem_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    and: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    or: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    xor: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    shl: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    shr_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    shr_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    rotl: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    rotr: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    eq: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    ne: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    lt_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    lt_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    le_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    le_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    gt_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    gt_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    ge_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    ge_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos)],
        i32Type(pos),
        new Map()
      );
    },
    atomic: {
      load: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i32Type(pos),
          new Map()
        );
      },
      load8_u: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i32Type(pos),
          new Map()
        );
      },
      load16_u: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i32Type(pos),
          new Map()
        );
      },
      store: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i32Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      store8: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i32Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      store16: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i32Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      rmw: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
      },
      rmw8_u: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
      },
      rmw16_u: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i32Type(pos), i32Type(pos)],
            i32Type(pos),
            new Map()
          );
        },
      },
    },
  },
  i64: {
    load: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load8_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load8_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load16_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load16_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load32_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    load32_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        i64Type(pos),
        new Map()
      );
    },
    store: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    store8: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    store16: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    store32: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), i64Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    const: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    clz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    ctz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    popcnt: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    eqz: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    trunc_s: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
      },
    },
    trunc_u: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
      },
    },
    trunc_s_sat: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
      },
    },
    trunc_u_sat: {
      f32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f32Type(pos)], i64Type(pos), new Map());
      },
      f64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
      },
    },
    reinterpret: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], i64Type(pos), new Map());
    },
    extend8_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    extend16_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    extend32_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    extend_s: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    extend_u: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], i64Type(pos), new Map());
    },
    add: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    sub: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    mul: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    div_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    div_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    rem_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    rem_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    and: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    or: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    xor: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    shl: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    shr_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    shr_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    rotl: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    rotr: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    eq: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    ne: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    lt_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    lt_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    le_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    le_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    gt_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    gt_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    ge_s: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    ge_u: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i64Type(pos), i64Type(pos)],
        i64Type(pos),
        new Map()
      );
    },
    atomic: {
      load: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i64Type(pos),
          new Map()
        );
      },
      load8_u: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i64Type(pos),
          new Map()
        );
      },
      load16_u: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i64Type(pos),
          new Map()
        );
      },
      load32_u: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [i32Type(pos), ptrType(pos)],
          i64Type(pos),
          new Map()
        );
      },
      store: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i64Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      store8: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i64Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      store16: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i64Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      store32: (pos: Position) => {
        return createFunctionSignatureType(
          pos,
          [],
          [ptrType(pos), i64Type(pos)],
          voidType(pos),
          new Map()
        );
      },
      rmw: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
      },
      rmw8_u: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
      },
      rmw16_u: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
      },
      rmw32_u: {
        add: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        sub: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        and: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        or: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xor: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        xchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
        cmpxchg: (pos: Position) => {
          return createFunctionSignatureType(
            pos,
            [],
            [i32Type(pos), ptrType(pos), i64Type(pos), i64Type(pos)],
            i64Type(pos),
            new Map()
          );
        },
      },
    },
  },
  f32: {
    load: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        f32Type(pos),
        new Map()
      );
    },
    store: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), f32Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    const: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    neg: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    abs: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    ceil: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    floor: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    trunc: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    nearest: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    sqrt: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f32Type(pos), new Map());
    },
    reinterpret: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
    },
    convert_s: {
      i32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
      },
      i64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i64Type(pos)], f32Type(pos), new Map());
      },
    },
    convert_u: {
      i32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i32Type(pos)], f32Type(pos), new Map());
      },
      i64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i64Type(pos)], f32Type(pos), new Map());
      },
    },
    demote: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f32Type(pos)], f64Type(pos), new Map());
    },
    add: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    sub: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    mul: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    div: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    copysign: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    min: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    max: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    eq: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    ne: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    lt: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    le: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    gt: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
    ge: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f32Type(pos), f32Type(pos)],
        f32Type(pos),
        new Map()
      );
    },
  },
  f64: {
    load: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [i32Type(pos), i32Type(pos), ptrType(pos)],
        f64Type(pos),
        new Map()
      );
    },
    store: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [ptrType(pos), f64Type(pos)],
        voidType(pos),
        new Map()
      );
    },
    const: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    neg: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    abs: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    ceil: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    floor: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    trunc: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    nearest: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    sqrt: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f64Type(pos), new Map());
    },
    reinterpret: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
    },
    convert_s: {
      i32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i32Type(pos)], f64Type(pos), new Map());
      },
      i64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
      },
    },
    convert_u: {
      i32: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i32Type(pos)], f64Type(pos), new Map());
      },
      i64: (pos: Position) => {
        return createFunctionSignatureType(pos, [], [i64Type(pos)], f64Type(pos), new Map());
      },
    },
    promote: (pos: Position) => {
      return createFunctionSignatureType(pos, [], [f64Type(pos)], f32Type(pos), new Map());
    },
    add: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    sub: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    mul: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    div: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    copysign: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    min: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    max: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    eq: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    ne: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    lt: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    le: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    gt: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
    ge: (pos: Position) => {
      return createFunctionSignatureType(
        pos,
        [],
        [f64Type(pos), f64Type(pos)],
        f64Type(pos),
        new Map()
      );
    },
  },
  // TODO: V128
};
