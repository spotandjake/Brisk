(module
  (memory $0 1)
  (global $_MemoryPointer (mut i32) (i32.const 0))
  (func $_malloc (param $0 i32) (result i32)
    (local $1 i32)
    (local.set $1 (global.get $_MemoryPointer))
    (global.set $_MemoryPointer
      (i32.add (local.get $1) (local.get $0))
    )
    (if
      (i32.ge_u
        (global.get $_MemoryPointer)
        (memory.size)
      )
      (drop (memory.grow (i32.const 1)))
    )
    (i32.store
      (local.get $1)
      (local.get $0)
    )
    (return (local.get $1))
  )
  (export "_malloc" (func $_malloc))
)