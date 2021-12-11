(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (import "env" "print" (func $1 (param i32)))
 (global $1 (mut i32) (i32.const 0))
 (global $2 (mut i32) (i32.const 0))
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
 (func $2 (; has Stack IR ;) (param $0 i32) (param $1 i32) (result i32)
  (call $1
   (i32.const 21)
  )
  (i32.const -1)
 )
 (func $_start (; has Stack IR ;)
  (local $0 i32)
  (global.set $1
   (i32.const 21)
  )
  (call $1
   (i32.const 21)
  )
  (global.set $2
   (i32.const 2147483646)
  )
  (call $1
   (i32.const 2147483646)
  )
  (i32.store offset=4
   (local.tee $0
    (call $0
     (i32.const 28)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 0)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 1)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 0)
  )
 )
)
