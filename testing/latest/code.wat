(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $1 (param i32)))
 (global $_MemoryPointer (mut i32) (i32.const 0))
 (memory $0 1)
 (export "_start" (func $_start))
 (export "memory" (memory $0))
 (func $0 (; has Stack IR ;) (param $0 i32) (result i32)
  (local $1 i32)
  (global.set $_MemoryPointer
   (i32.add
    (local.tee $1
     (global.get $_MemoryPointer)
    )
    (local.get $0)
   )
  )
  (if
   (i32.ge_u
    (global.get $_MemoryPointer)
    (memory.size)
   )
   (drop
    (memory.grow
     (i32.const 1)
    )
   )
  )
  (i32.store
   (local.get $1)
   (local.get $0)
  )
  (local.get $1)
 )
 (func $_start (; has Stack IR ;)
  (call $1
   (i32.const 21)
  )
 )
)
