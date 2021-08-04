(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
 (global $0 (mut i32) (i32.const 0))
 (global $1 i32 (i32.const 0))
 (global $2 (mut i32) (i32.const 0))
 (global $3 (mut i32) (i32.const 0))
 (global $4 (mut i32) (i32.const 0))
 (global $5 (mut i32) (i32.const 0))
 (global $6 (mut i32) (i32.const 0))
 (global $7 (mut i32) (i32.const 0))
 (global $8 (mut i32) (i32.const 0))
 (global $9 (mut i32) (i32.const 0))
 (global $10 (mut i32) (i32.const 3))
 (memory $0 1)
 (table $functions 4 funcref)
 (elem $functions (i32.const 0) $0 $1 $2 $3)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
 (func $_malloc (param $0 i32) (result i32)
  (local $1 i32)
  (local.set $1
   (i32.load
    (i32.const 0)
   )
  )
  (if
   (i32.le_u
    (local.get $1)
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
   (i32.const 12)
  )
  (return
   (i32.const -1)
  )
 )
 (func $1 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $print
   (i32.const 123)
  )
  (return
   (i32.const -1)
  )
 )
 (func $2 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $print
   (i32.const 1234)
  )
  (return
   (i32.const -1)
  )
 )
 (func $3 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $print
   (i32.const 12345)
  )
  (return
   (i32.const -1)
  )
 )
 (func $entry_0
  (local $0 i32)
  (local $1 i32)
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
  (global.set $0
   (local.get $1)
  )
 )
 (func $entry_1
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
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
    (i32.const 28)
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
   (global.get $6)
  )
  (i32.store offset=20
   (local.get $2)
   (i32.const 0)
  )
  (local.set $3
   (local.get $2)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $3)
    )
    (i32.const 0)
    (i32.add
     (i32.load offset=12
      (local.get $3)
     )
     (i32.load offset=16
      (local.get $3)
     )
    )
   )
  )
  (local.set $4
   (call $_malloc
    (i32.const 28)
   )
  )
  (i32.store offset=4
   (local.get $4)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $4)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $4)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $4)
   (global.get $6)
  )
  (i32.store offset=20
   (local.get $4)
   (i32.const 0)
  )
  (local.set $5
   (local.get $4)
  )
  (local.set $6
   (call $_malloc
    (i32.const 28)
   )
  )
  (i32.store offset=4
   (local.get $6)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $6)
   (i32.const 1)
  )
  (i32.store offset=12
   (local.get $6)
   (i32.const 2)
  )
  (i32.store offset=16
   (local.get $6)
   (global.get $6)
  )
  (i32.store offset=20
   (local.get $6)
   (i32.const 0)
  )
  (local.set $7
   (local.get $6)
  )
  (global.set $3
   (local.get $1)
  )
  (global.set $4
   (local.get $5)
  )
  (global.set $5
   (local.get $7)
  )
 )
 (func $entry_2
  (local $0 i32)
  (local $1 i32)
  (local.set $0
   (call $_malloc
    (i32.const 28)
   )
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
   (global.get $10)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 0)
  )
  (local.set $1
   (local.get $0)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $1)
    )
    (i32.const 0)
    (i32.add
     (i32.load offset=12
      (local.get $1)
     )
     (i32.load offset=16
      (local.get $1)
     )
    )
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (global.get $4)
    )
    (i32.const 0)
    (i32.add
     (i32.load offset=12
      (global.get $4)
     )
     (i32.load offset=16
      (global.get $4)
     )
    )
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (global.get $5)
    )
    (i32.const 0)
    (i32.add
     (i32.load offset=12
      (global.get $5)
     )
     (i32.load offset=16
      (global.get $5)
     )
    )
   )
  )
 )
 (func $_start
  (call $entry_0)
  (call $entry_1)
  (call $entry_2)
 )
)
