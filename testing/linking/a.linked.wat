(module
 (type $none_=>_none (func))
 (memory $0 1)
 (export "memory" (memory $0))
 (func $0_entry
  (local $0 i32)
  (local $1 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (local.set $0
   (call $_malloc
    (i32.const 20)
   )
  )
  (i32.store offset=4
   (local.get $0)
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
   (i32.const 1)
  )
  (local.set $1
   (local.get $0)
  )
 )
 (func $1_entry
  (local $0 i32)
  (local $1 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (call $print
   (global.get $gimport$0)
  )
  (local.set $0
   (call $_malloc
    (i32.const 20)
   )
  )
  (i32.store offset=4
   (local.get $0)
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
   (i32.const 1)
  )
  (local.set $1
   (local.get $0)
  )
 )
 (func $2_entry
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (call $print
   (global.get $1)
  )
  (call $print
   (global.get $0)
  )
 )
 (func $_start
  (call $0_entry)
  (call $1_entry)
  (call $2_entry)
 )
)
