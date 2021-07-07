(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (import "env" "print" (func $print (param i32)))
 (import "env" "briskmemory" (func $briskmemory (param i32)))
 (memory (import "env" "memory") 1)
 (table $functions 2 funcref)
 (elem $functions (i32.const 0) $0 $1)
 (start $main)
 (func $0
  (local $0 i32)
  (call $print
   (local.get $0)
  )
 )
 (func $1
  (local $0 i32)
  (local $1 i32)
  (i32.store
   (i32.load
    (i32.const 0)
   )
   (i32.const 6)
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
  (i32.store offset=12
   (i32.load
    (i32.const 0)
   )
   (i32.const 101)
  )
  (i32.store offset=16
   (i32.load
    (i32.const 0)
   )
   (i32.const 115)
  )
  (i32.store offset=20
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
    (i32.const 24)
   )
  )
  (call $briskmemory
   (i32.const 1)
  )
  (local.set $0
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 24)
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
  (call $briskmemory
   (i32.const 1)
  )
  (local.set $1
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (call_indirect (type $none_=>_none)
   (i32.load offset=8
    (local.get $1)
   )
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
  (call $briskmemory
   (i32.const 1)
  )
  (local.set $0
   (i32.sub
    (i32.load
     (i32.const 0)
    )
    (i32.const 12)
   )
  )
  (call_indirect (type $none_=>_none)
   (i32.load offset=8
    (local.get $0)
   )
  )
 )
)
