(module $./runtime/constants.br
  (type (;0;) (func))
  (func $_start (type 0)
    (global.set 1
      (i32.const 0)))
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (export "$Brisk$heapOffset" (global 1))
  (export "memory" (memory 0))
  (start $_start))
