(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32) (result i32)))
  (type (;2;) (func (param i32) (result i32)))
  (type (;3;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 3)
    (global.set 0
      (i32.const 0))
    (global.set 1
      (i32.const 1))
    (if  ;; label = @1
      (i32.eq
        (global.get 1)
        (i32.const 1))
      (then
        (drop
          (call_indirect (type 0)
            (i32.const 2)
            (global.get 0)))))
    (if  ;; label = @1
      (i32.const 1)
      (then
        (drop
          (call_indirect (type 1)
            (i32.const 2)
            (global.get 0))))))
  (table (;0;) 1 funcref)
  (memory (;0;) 1)
  (global (;0;) (mut i32) (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (start 1)
  (elem (;0;) (i32.const 0) func 0))