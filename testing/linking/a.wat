(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 1 funcref)
 (elem $functions (i32.const 0) $0)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
 (func $0 (; has Stack IR ;) (param $0 i32) (param $1 i32) (result i32)
  (call $print
   (i32.const 12345)
  )
  (i32.const -1)
 )
 (func $_start (; has Stack IR ;)
  (local $0 i32)
  (if
   (i32.le_u
    (local.tee $0
     (i32.load
      (i32.const 0)
     )
    )
    (i32.const 4)
   )
   (block
    (i32.store
     (i32.const 0)
     (i32.const 4)
    )
    (local.set $0
     (i32.load
      (i32.const 0)
     )
    )
   )
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (local.get $0)
    (i32.const 28)
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
   (local.get $0)
   (i32.const 28)
  )
  (i32.store offset=4
   (local.get $0)
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
   (i32.const 0)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 0)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $0)
    )
    (i32.const 0)
    (i32.add
     (i32.load offset=12
      (local.get $0)
     )
     (i32.load offset=16
      (local.get $0)
     )
    )
   )
  )
 )
)
