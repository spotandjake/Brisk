(module
 (type $none_=>_none (func))
 (type $none_=>_i32 (func (result i32)))
 (memory $0 1)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
 (start $_start)
 (func $_malloc (result i32)
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
    (i32.const 20)
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
   (i32.const 20)
  )
  (local.get $0)
 )
 (func $entry_0
  (local $0 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.tee $0
    (call $_malloc)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
   (i32.const 5)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 0)
  )
 )
 (func $_start
  (call $entry_0)
 )
)
