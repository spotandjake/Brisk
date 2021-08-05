(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "GRAIN$MODULE$print" "BRISK$EXPORTc" (global $0 i32))
 (import "env" "print" (func $print (param i32)))
 (global $1 (mut i32) (i32.const 1))
 (memory $0 1)
 (table $functions 0 funcref)
 (export "memory" (memory $0))
 (export "BRISK$EXPORT$a" (global $1))
 (export "_start" (func $_start))
 (start $_start)
 (func $_malloc (param $0 i32) (result i32)
  (local $1 i32)
  (local.set $1
   (i32.load
    (i32.const 0)
   )
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (local.get $1)
    (local.get $0)
   )
  )
  (if
   (i32.ge_u
    (i32.load
     (i32.const 0)
    )
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
  (return
   (local.get $1)
  )
 )
 (func $_start
  (local $0 i32)
  (local $1 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (call $print
   (global.get $0)
  )
  (local.set $0
   (call $_malloc
    (i32.const 36)
   )
  )
  (i32.store offset=4
   (local.get $0)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
   (i32.const 4)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 83)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 116)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 114)
  )
  (i32.store offset=24
   (local.get $0)
   (i32.const 105)
  )
  (i32.store offset=28
   (local.get $0)
   (i32.const 110)
  )
  (i32.store offset=32
   (local.get $0)
   (i32.const 103)
  )
  (local.set $1
   (local.get $0)
  )
  (call $print
   (local.get $1)
  )
 )
)
