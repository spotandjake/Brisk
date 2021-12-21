(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $1 (param i32)))
 (global $1 (mut i32) (i32.const 0))
 (global $_MemoryPointer (mut i32) (i32.const 0))
 (memory $0 1)
 (table $functions 3 funcref)
 (elem $functions (i32.const 0) $0 $3 $4)
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
 (func $3 (; has Stack IR ;) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local.set $3
   (i32.load offset=12
    (local.get $0)
   )
  )
  (local.set $4
   (i32.load offset=12
    (local.get $1)
   )
  )
  (local.set $2
   (i32.load offset=16
    (local.get $1)
   )
  )
  (local.set $1
   (i32.load offset=20
    (local.get $1)
   )
  )
  (i32.store offset=4
   (local.tee $0
    (call $0
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
   (local.get $4)
  )
  (i32.store offset=16
   (local.get $0)
   (local.get $2)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 3)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $3)
    )
    (local.get $0)
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
  (i32.store offset=4
   (local.tee $0
    (call $0
     (i32.const 16)
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
   (local.get $1)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (local.get $2)
    )
    (local.get $0)
    (i32.add
     (i32.load offset=12
      (local.get $2)
     )
     (i32.load offset=16
      (local.get $2)
     )
    )
   )
  )
  (i32.const 1879048190)
 )
 (func $4 (; has Stack IR ;) (param $0 i32) (param $1 i32) (result i32)
  (call $1
   (i32.load offset=12
    (local.get $1)
   )
  )
  (i32.const 1879048190)
 )
 (func $_start (; has Stack IR ;)
  (local $0 i32)
  (local $1 i32)
  (local.set $0
   (call $0
    (i32.const 28)
   )
  )
  (i32.store offset=4
   (local.tee $1
    (call $0
     (i32.const 16)
    )
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $1)
   (i32.const 2)
  )
  (i32.store offset=12
   (local.get $1)
   (local.get $0)
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
   (i32.const 1)
  )
  (i32.store offset=20
   (local.get $0)
   (local.get $1)
  )
  (global.set $1
   (local.get $0)
  )
  (i32.store offset=4
   (local.tee $0
    (call $0
     (i32.const 28)
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
   (i32.const 1)
  )
  (i32.store offset=16
   (local.get $0)
   (i32.const 1)
  )
  (i32.store offset=20
   (local.get $0)
   (i32.const 0)
  )
  (i32.store offset=4
   (local.tee $1
    (call $0
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
   (i32.const 21)
  )
  (i32.store offset=16
   (local.get $1)
   (local.get $0)
  )
  (i32.store offset=20
   (local.get $1)
   (i32.const 1)
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=20
     (global.get $1)
    )
    (local.get $1)
    (i32.add
     (i32.load offset=12
      (global.get $1)
     )
     (i32.load offset=16
      (global.get $1)
     )
    )
   )
  )
 )
)
