(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32) (result i32)))
  (type (;2;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 2)
    (global.set 0
      (i32.const 1))
    (drop
      (call_indirect (type 0)
        (i32.const 1)
        (global.get 0)))
    (global.set 1
      (i32.const 1)))
  (table (;0;) 2 funcref)
  (global (;0;) (mut i32) (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (start 1)
  (elem (;0;) (i32.const 0) func 1))
