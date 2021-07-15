(module
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 2 funcref)
 (elem $functions (i32.const 0) $0 $1)
 (export "memory" (memory $0))
 (start $main)
 (func $0 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local.set $1
   (i32.load offset=12
    (local.get $1)
   )
  )
  (local.set $2
   (i32.load offset=16
    (local.get $1)
   )
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
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 7)
  )
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (local.get $1)
  )
  (i32.store offset=16
   (i32.load
    (i32.const 0)
   )
   (local.get $2)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $2)
    )
    (i32.sub
     (i32.load
      (i32.const 0)
     )
     (i32.const 20)
    )
    (i32.load offset=12
     (local.get $2)
    )
   )
  )
  (return
   (i32.const -1)
  )
 )
 (func $1 (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 4)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 16)
   )
  )
  (call $print
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 16)
   )
  )
  (return
   (i32.const -1)
  )
 )
 (func $main
  (local $0 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=16
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (local.set $0
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=16
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 0)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 7)
  )
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (i32.store offset=16
   (i32.load
    (i32.const 0)
   )
   (local.get $0)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 20)
   )
  )
  (drop
   (call_indirect (type $i32_i32_=>_i32)
    (i32.load offset=16
     (local.get $0)
    )
    (i32.sub
     (i32.load
      (i32.const 0)
     )
     (i32.const 20)
    )
    (i32.load offset=12
     (local.get $0)
    )
   )
  )
 )
)
