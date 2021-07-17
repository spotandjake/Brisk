(module
<<<<<<< Updated upstream
 (type $i32_=>_i32 (func (param i32) (result i32)))
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
   (i64.const 9223372036854770000)
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
   (i32.const 2)
  )
  (i64.store offset=16
   (local.get $0)
   (i64.const -9223372036854770000)
  )
  (call $print
   (local.get $0)
  )
=======
 (func $_start
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
>>>>>>> Stashed changes
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
   (i32.const 4)
  )
<<<<<<< Updated upstream
  (f64.store offset=16
   (local.get $0)
   (f64.const -922337203685477.1)
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
   (i32.const 4)
  )
  (f64.store offset=16
   (local.get $0)
   (f64.const 922337203685477.1)
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
   (i32.const 4)
  )
  (f64.store offset=16
   (local.get $0)
   (f64.const 9223.111111)
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
=======
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
>>>>>>> Stashed changes
   (i32.const 0)
  )
  (i32.store offset=8
   (local.get $0)
<<<<<<< Updated upstream
   (i32.const 5)
  )
  (i32.store offset=12
   (local.get $0)
   (i32.const 4)
  )
  (f64.store offset=16
   (local.get $0)
   (f64.const 9223.1111111)
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
   (i32.const 4)
  )
  (f64.store offset=16
   (local.get $0)
   (f64.const -9223.11111111)
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
   (i32.const 4)
  )
  (f64.store offset=16
   (local.get $0)
   (f64.const 1677.111)
  )
  (call $print
   (local.get $0)
=======
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
   (local.get $1)
>>>>>>> Stashed changes
  )
 )
)
