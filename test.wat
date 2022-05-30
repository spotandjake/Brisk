(module $./Resources/CodeGen.br
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func))
  (import "env" "print" (func $print (type 0)))
  (func $loop (type 1) (param $t2 i32) (param $index3 i32) (result i32)
    (local $test4 i32)
    (local.set $test4
      (call_indirect (type 0)
        (local.get $index3)
        (local.get $t2)))
    (local.set $index3
      (i32.add
        (local.get $index3)
        (i32.const 1)))
    (if  ;; label = @1
      (i32.eq
        (local.get $test4)
        (i32.const 1))
      (then
        (drop
          (call_indirect (type 1)
            (local.get $t2)
            (local.get $index3)
            (global.get 2)))))
    (return
      (i32.const 1)))
  (func $AmbiguousFunction2 (type 0) (param $index5 i32) (result i32)
    (drop
      (call_indirect (type 0)
        (local.get $index5)
        (global.get 1)))
    (if  ;; label = @1
      (i32.eq
        (local.get $index5)
        (i32.const 100))
      (then
        (return
          (i32.const 0))))
    (return
      (i32.const 1)))
  (func $_start (type 2)
    (global.set 2
      (i32.const 1))
    (drop
      (call_indirect (type 1)
        (i32.const 2)
        (i32.const 0)
        (global.get 2))))
  (table (;0;) 3 funcref)
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) i32 (i32.const 0))
  (global (;2;) (mut i32) (i32.const 0))
  (export "_start" (func $_start))
  (start $_start)
  (elem (;0;) (i32.const 0) func $print)
  (elem (;1;) (i32.const 1) func $loop)
  (elem (;2;) (i32.const 2) func $AmbiguousFunction2))
