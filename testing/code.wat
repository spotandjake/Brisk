(module
 (type $none_=>_none (func))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_=>_i32_i32_i32 (func (param i32) (result i32 i32 i32)))
 (import "env" "print" (func $print (param i32 i32 i32) (result i32)))
 (memory $0 1)
 (table $functions 3 funcref)
 (elem $functions (i32.const 0) $0 $1 $2)
 (export "memory" (memory $0))
 (start $main)
 (func $0 (param $0 i32) (result i32 i32 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 4)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 116)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (local.set $3
   (i32.const 5450344)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const -1)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (local.set $4
   (i32.const 5450896)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (local.set $5
   (i32.const 5451448)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (local.set $6
   (i32.const 5452000)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (unreachable)
 )
 (func $1
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 4)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 104)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
 )
 (func $2
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
 )
 (func $main
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 4)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 116)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (local.set $0
   (i32.const 5449792)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (local.set $1
   (i32.const 5453416)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (local.set $2
   (i32.const 5454688)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=8
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
    (i32.const 12)
   )
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 5)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 2)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (local.set $3
   (i32.const 5456416)
  )
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 3)
  )
  (i32.store offset=4
   (i32.load
    (i32.const 0)
   )
   (i32.const 1)
  )
  (i32.store offset=8
   (i32.load
    (i32.const 0)
   )
   (i32.const 2)
  )
  (i32.store
   (i32.const 0)
   (i32.add
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
 )
)
