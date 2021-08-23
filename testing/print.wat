(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32) (result i32)))
 (import "wasi_unstable" "fd_write" (func $1 (param i32 i32 i32 i32) (result i32)))
 (global $_MemoryPointer (mut i32) (i32.const 0))
 (memory $0 1)
 (table $functions 2 funcref)
 (elem $functions (i32.const 0) $0 $2)
 (export "_start" (func $_start))
 (export "memory" (memory $0))
 (func $0 (; has Stack IR ;) (param $0 i32) (result i32)
  (local $1 i32)
  (global.set $_MemoryPointer
   (i32.add
    (local.tee $1
     (global.get $_MemoryPointer)
    )
    (local.get $0)
   )
  )
  (if
   (i32.ge_u
    (global.get $_MemoryPointer)
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
 (func $2 (; has Stack IR ;) (param $0 i32) (param $1 i32) (result i32)
  (drop
   (call $1
    (i32.const 1)
    (local.tee $0
     (i32.load offset=12
      (local.get $1)
     )
    )
    (i32.load
     (i32.add
      (local.get $0)
      (i32.const 4)
     )
    )
    (i32.const 200)
   )
  )
  (i32.const -1)
 )
 (func $_start (; has Stack IR ;)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (i32.store offset=4
   (local.tee $1
    (call $0
     (i32.const 28)
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
   (i32.const 1)
  )
  (i32.store offset=20
   (local.get $1)
   (i32.const 0)
  )
  (i32.store offset=4
   (local.tee $0
    (call $0
     (i32.const 56)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
   (i32.const 4)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 72)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 101)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 108)
  )
  (i32.store offset=24
   (local.get $0)
   (i32.const 108)
  )
  (i32.store offset=28
   (local.get $0)
   (i32.const 111)
  )
  (i32.store offset=32
   (local.get $0)
   (i32.const 32)
  )
  (i32.store offset=36
   (local.get $0)
   (i32.const 87)
  )
  (i32.store offset=40
   (local.get $0)
   (i32.const 111)
  )
  (i32.store offset=44
   (local.get $0)
   (i32.const 114)
  )
  (i32.store offset=48
   (local.get $0)
   (i32.const 108)
  )
  (i32.store offset=52
   (local.get $0)
   (i32.const 100)
  )
  (i32.store offset=4
   (local.tee $2
    (call $0
     (i32.const 16)
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
   (local.get $0)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $1)
    )
    (local.get $2)
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
 )
)
