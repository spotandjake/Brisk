(module
 (type $none_=>_none (func))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32) (result i32)))
 (import "wasi_unstable" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))
 (memory $0 1)
 (table $functions 0 funcref)
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
 (func $_start
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (local.set $0
   (call $_malloc
    (i32.const 28)
   )
  )
  (i32.store
   (local.get $0)
   (i32.const 7)
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
   (i32.const 116)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 101)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 115)
  )
  (i32.store offset=24
   (local.get $0)
   (i32.const 116)
  )
  (local.set $1
   (local.get $0)
  )
  (local.set $2
   (i32.const 8)
  )
  (local.set $3
   (i32.const 20)
  )
  (local.set $4
   (call $_malloc
    (i32.const 20)
   )
  )
  (i32.store
   (local.get $4)
   (i32.const 5)
  )
  (i32.store offset=4
   (local.get $4)
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $4)
   (i32.const 5)
  )
  (i32.store offset=12
   (local.get $4)
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $4)
   (i32.const 1)
  )
  (drop
   (call $fd_write
    (local.get $4)
    (local.get $1)
    (local.get $2)
    (local.get $3)
   )
  )
 )
)
