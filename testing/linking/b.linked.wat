(module
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
 (global $0 (mut i32) (i32.const 0))
 (global $1 (mut i32) (i32.const 0))
 (global $2 (mut i32) (i32.const 0))
 (global $3 (mut i32) (i32.const 0))
 (memory $0 1)
 (table $functions 1 funcref)
 (elem $functions (i32.const 0) $0)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
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
 (func $0 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $print
   (i32.const 3)
  )
  (return
   (i32.const -1)
  )
 )
 (func $entry_0
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
  (global.set $1
   (local.get $1)
  )
 )
 (func $entry_1
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (call $print
   (global.get $0)
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
   (i32.const 2)
  )
  (local.set $1
   (local.get $0)
  )
  (local.set $2
   (call $_malloc
    (i32.const 24)
   )
  )
  (i32.store offset=4
   (local.get $2)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $2)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $2)
   (i32.const 0)
  )
  (i32.store offset=16
   (local.get $2)
   (i32.const 0)
  )
  (local.set $3
   (local.get $2)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $3)
    )
    (i32.const 0)
    (i32.load offset=12
     (local.get $3)
    )
   )
  )
  (global.set $3
   (local.get $1)
  )
 )
 (func $_start
  (call $entry_0)
  (call $entry_1)
 )
)
