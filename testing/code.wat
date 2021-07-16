(module
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
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
 (func $_Briskload (param $0 i32) (param $1 i32) (result i32)
  (return
   (i32.load offset=5449432
    (local.get $0)
   )
  )
 )
 (func $_Brisksize (result i32)
  (return
   (memory.size)
  )
 )
 (func $_Briskgrow (param $0 i32) (result i32)
  (return
   (memory.grow
    (local.get $0)
   )
  )
 )
 (func $_start
  (local $0 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 24)
    )
   )
   (i32.const 6)
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
   (i32.const 2)
  )
  (i64.store offset=16
   (local.get $0)
   (i64.const -26388279066624)
  )
  (call $print
   (local.get $0)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 24)
    )
   )
   (i32.const 6)
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
   (i32.const 3)
  )
  (call $print
   (local.get $0)
  )
 )
)
