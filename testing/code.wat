(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 1 funcref)
 (elem $functions (i32.const 0) $0)
 (export "memory" (memory $0))
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
  (return
   (local.get $1)
  )
 )
 (func $0 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local.set $2
   (i32.load offset=12
    (local.get $1)
   )
  )
  (local.set $3
   (call $_malloc
    (i32.const 20)
   )
  )
  (i32.store
   (local.get $3)
   (i32.const 5)
  )
  (i32.store offset=4
   (local.get $3)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $3)
   (i32.const 5)
  )
  (i32.store offset=12
   (local.get $3)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $3)
   (i32.const 1)
  )
  (return
   (local.get $3)
  )
 )
 (func $_start
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (local.set $0
   (call $_malloc
    (i32.const 16)
   )
  )
  (i32.store
   (local.get $0)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.get $0)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
   (i32.const 3)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 0)
  )
  (local.set $1
   (local.get $0)
  )
  (local.set $2
   (call $_malloc
    (i32.const 16)
   )
  )
  (i32.store
   (local.get $2)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.get $2)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $2)
   (i32.const 3)
  )
  (i32.store offset=12
   (local.get $2)
   (i32.const 1)
  )
  (local.set $3
   (local.get $2)
  )
  (local.set $4
   (call $_malloc
    (i32.const 24)
   )
  )
  (i32.store
   (local.get $4)
   (i32.const 6)
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
   (i32.const 0)
  )
  (i32.store offset=16
   (local.get $4)
   (i32.const 0)
  )
  (local.set $5
   (local.get $4)
  )
  (local.set $6
   (call $_malloc
    (i32.const 16)
   )
  )
  (i32.store
   (local.get $6)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.get $6)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $6)
   (i32.const 3)
  )
  (i32.store offset=12
   (local.get $6)
   (i32.const 1)
  )
  (local.set $7
   (call $_malloc
    (i32.const 16)
   )
  )
  (i32.store
   (local.get $7)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.get $7)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $7)
   (i32.const 7)
  )
  (i32.store offset=12
   (local.get $7)
   (local.get $6)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $5)
    )
    (local.get $7)
    (i32.load offset=12
     (local.get $5)
    )
   )
  )
  (local.set $8
   (call $_malloc
    (i32.const 20)
   )
  )
  (i32.store
   (local.get $8)
   (i32.const 5)
  )
  (i32.store offset=4
   (local.get $8)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $8)
   (i32.const 5)
  )
  (i32.store offset=12
   (local.get $8)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $8)
   (i32.const 1)
  )
  (local.set $9
   (call $_malloc
    (i32.const 16)
   )
  )
  (i32.store
   (local.get $9)
   (i32.const 4)
  )
  (i32.store offset=4
   (local.get $9)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $9)
   (i32.const 7)
  )
  (i32.store offset=12
   (local.get $9)
   (local.get $8)
  )
  (local.set $10
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $5)
    )
    (local.get $9)
    (i32.load offset=12
     (local.get $5)
    )
   )
  )
  (local.set $11
   (local.get $1)
  )
 )
)
