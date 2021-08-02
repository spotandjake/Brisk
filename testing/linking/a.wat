(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
 (global $0 (mut i32) (i32.const 0))
 (global $2 (mut i32) (i32.const 0))
 (global $3 (mut i32) (i32.const 0))
 (global $4 (mut i32) (i32.const 0))
 (memory $0 1)
 (table $functions 4 funcref)
 (elem $functions (i32.const 0) $0 $1 $2 $3)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
 (start $_start)
 (func $_malloc (param $0 i32) (result i32)
  (local $1 i32)
  (if
   (i32.le_u
    (local.tee $1
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
    (local.set $1
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
    (local.get $1)
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
  (local.get $1)
 )
 (func $0 (param $0 i32) (param $1 i32) (result i32)
  (call $print
   (i32.const 12)
  )
  (i32.const -1)
 )
 (func $1 (param $0 i32) (param $1 i32) (result i32)
  (call $print
   (i32.const 123)
  )
  (i32.const -1)
 )
 (func $2 (param $0 i32) (param $1 i32) (result i32)
  (call $print
   (i32.const 1234)
  )
  (i32.const -1)
 )
 (func $3 (param $0 i32) (param $1 i32) (result i32)
  (call $print
   (i32.const 1)
  )
  (i32.const -1)
 )
 (func $_start
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (i32.store offset=4
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
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
   (i32.const 1)
  )
  (global.set $0
   (local.get $0)
  )
  (call $print
   (global.get $0)
  )
  (i32.store offset=4
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
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
   (i32.const 2)
  )
  (i32.store offset=4
   (local.tee $1
    (call $_malloc
     (i32.const 24)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $1)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $1)
   (i32.const 0)
  )
  (i32.store offset=16
   (local.get $1)
   (i32.const 0)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $1)
    )
    (i32.const 0)
    (i32.load offset=12
     (local.get $1)
    )
   )
  )
  (call $print
   (local.get $0)
  )
  (i32.store offset=4
   (local.tee $1
    (call $_malloc
     (i32.const 24)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $1)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $1)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $1)
   (i32.const 0)
  )
  (i32.store offset=4
   (local.tee $2
    (call $_malloc
     (i32.const 24)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $2)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $2)
   (i32.const 2)
  )
  (i32.store offset=16
   (local.get $2)
   (i32.const 0)
  )
  (global.set $2
   (local.get $0)
  )
  (global.set $3
   (local.get $1)
  )
  (global.set $4
   (local.get $2)
  )
  (i32.store offset=4
   (local.tee $0
    (call $_malloc
     (i32.const 24)
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
   (i32.const 0)
  )
  (call $print
   (i32.const 4)
  )
  (call $print
   (global.get $2)
  )
  (call $print
   (global.get $0)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $0)
    )
    (i32.const 0)
    (i32.load offset=12
     (local.get $0)
    )
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (global.get $3)
    )
    (i32.const 0)
    (i32.load offset=12
     (global.get $3)
    )
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (global.get $4)
    )
    (i32.const 0)
    (i32.load offset=12
     (global.get $4)
    )
   )
  )
 )
)
