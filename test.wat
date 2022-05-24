(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (result i32)))
  (type (;2;) (func (param i32) (result i32)))
  (type (;3;) (func (param i32) (result i32)))
  (type (;4;) (func (param i32) (result i32)))
  (type (;5;) (func (result i32)))
  (type (;6;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 2) (param i32) (result i32)
    (drop
      (call_indirect (type 1)
        (local.get 0)))
    (return
      (i32.const 1)))
  (func (;2;) (type 5) (result i32)
    (drop
      (call_indirect (type 4)
        (i32.const 4)
        (global.get 0)))
    (return
      (i32.const 1)))
  (func (;3;) (type 6)
    (global.set 0
      (i32.const 0))
    (global.set 1
      (i32.const 1))
    (drop
      (call_indirect (type 3)
        (i32.const 2)
        (global.get 1))))
  (table (;0;) 3 funcref)
  (memory (;0;) 1)
  (global (;0;) (mut i32) (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (start 3)
  (elem (;0;) (i32.const 0) func 0)
  (elem (;1;) (i32.const 1) func 1)
  (elem (;2;) (i32.const 2) func 2))
