(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (import "GRAIN$MODULE$c" "BRISK$EXPORTc" (global $0 i32))
 (import "GRAIN$MODULE$b" "BRISK$EXPORTb" (global $1 i32))
 (import "env" "print" (func $print (param i32)))
 (memory $0 1)
 (table $functions 0 funcref)
 (export "memory" (memory $0))
 (export "_start" (func $_start))
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
  (i32.store
   (local.get $1)
   (local.get $0)
  )
  (return
   (local.get $1)
  )
 )
 (func $_start
  (i32.store
   (i32.const 0)
   (i32.const 4)
  )
  (call $print
   (global.get $1)
  )
  (call $print
   (global.get $0)
  )
 )
)
