(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 0 funcref)
 (export "memory" (memory $0))
 (start $main)
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
 (func $main
  (local $0 i32)
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 16)
    )
   )
   (i32.const 4)
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
   (i32.const 97)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
   )
   (i32.const 5)
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
  (call $print
   (local.get $0)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
   )
   (i32.const 5)
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
   (i32.const -1)
  )
  (call $print
   (local.get $0)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
   )
   (i32.const 5)
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
  (f32.store offset=16
   (local.get $0)
   (f32.const 1.100000023841858)
  )
  (call $print
   (local.get $0)
  )
  (i32.store
   (local.tee $0
    (call $_malloc
     (i32.const 20)
    )
   )
   (i32.const 5)
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
  (f32.store offset=16
   (local.get $0)
   (f32.const -1.100000023841858)
  )
  (call $print
   (local.get $0)
  )
 )
)
