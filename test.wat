(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32) (result i32)))
  (type (;2;) (func (param i32) (result i32)))
  (type (;3;) (func (param i32) (result i32)))
  (type (;4;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 1) (param i32) (result i32)
    (return
      (i32.const 1)))
  (func (;2;) (type 4)
    (global.set 0
      (i32.const 0))
    (global.set 1
      (i32.const 1))
    (global.set 2
      (call_indirect (type 1)
        (i32.const 1)
        (global.get 1)))
    (global.set 3
      (i32.const 1))
    (drop
      (call_indirect (type 2)
        (global.get 2)
        (global.get 0))))
  (table (;0;) 2 funcref)
  (memory (;0;) 1)
  (global (;0;) (mut i32) (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (global (;2;) (mut i32) (i32.const 0))
  (global (;3;) (mut i32) (i32.const 0))
  (start 2)
  (elem (;0;) (i32.const 0) func 0)
  (elem (;1;) (i32.const 1) func 1))
