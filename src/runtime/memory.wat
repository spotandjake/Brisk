(module
  (memory $0 1)
  (func $_malloc (param $0 i32) (result i32)
    (local $1 i32)
    (if
      (i32.le_u
        (local.tee $1
          (i32.load (i32.const 0))
        )
        (i32.const 4)
      )
      (block
        (i32.store
          (i32.const 0)
          (i32.const 4)
        )
        (local.set $1
          (i32.load (i32.const 0))
        )
      )
    )
    (i32.store
      (i32.const 0)
      (i32.add
        (local.get $0)
        (local.get $1)
      )
    )
    (if
      (i32.ge_u
        (i32.load (i32.const 0))
        (memory.size)
      )
      (drop
        (memory.grow (i32.const 1))
      )
    )
    (i32.store
      (local.get $1)
      (local.get $0)
    )
    (local.get $1)
  )
  (export "_malloc" (func $_malloc))
)