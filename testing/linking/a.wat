(module
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $2 (param i32)))
 (import "env" "print" (func $7 (param i32)))
 (global $0 (mut i32) (i32.const 1))
 (global $1 (mut i32) (i32.const 0))
 (global $2 (mut i32) (i32.const 2))
 (global $3 (mut i32) (i32.const 0))
 (global $4 (mut i32) (i32.const 0))
 (global $5 (mut i32) (i32.const 0))
 (global $6 (mut i32) (i32.const 6))
 (memory $0 1)
 (table $functions 4 funcref)
 (elem $functions (i32.const 0) $0 $3 $4 $5)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
 (func $0 (param $0 i32) (result i32)
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
 (func $1
  (local $0 i32)
  (local $1 i32)
  (local.set $0
   (call $0
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
 (func $3 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $2
   (i32.const 12)
  )
  (return
   (i32.const -1)
  )
 )
 (func $4 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $2
   (i32.const 123)
  )
  (return
   (i32.const -1)
  )
 )
 (func $5 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (call $2
   (i32.const 1234)
  )
  (return
   (i32.const -1)
  )
 )
 (func $6
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local.set $0
   (call $0
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
   (call $0
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
   (global.get $2)
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
   (call $0
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
   (global.get $2)
  )
  (i32.store offset=20
   (local.get $4)
   (i32.const 0)
  )
  (local.set $5
   (local.get $4)
  )
  (local.set $6
   (call $0
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
   (global.get $2)
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
 (func $8
  (call $7
   (global.get $3)
  )
  (call $7
   (global.get $1)
  )
 )
 (func $_start
  (call $1)
  (call $6)
  (call $8)
 )
)
