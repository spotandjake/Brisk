(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 0 funcref)
 (export "memory" (memory $0))
 (start $main)
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
   (i32.const 5449712)
  )
  (call $print
   (local.get $0)
  )
 )
)
