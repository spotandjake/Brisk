(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 1) (param i32 i32) (result i32)
    (local i32)
    (local.set 2
      (call_indirect (type 0)
        (local.get 1)
        (local.get 0)))
    (local.set 1
      (i32.add
        (local.get 1)
        (i32.const 1)))
    (if  ;; label = @1
      (i32.eq
        (local.get 2)
        (i32.const 1))
      (then
        (drop
          (call_indirect (type 1)
            (local.get 0)
            (local.get 1)
            (global.get 1)))))
    (return
      (i32.const 1)))
  (func (;2;) (type 0) (param i32) (result i32)
    (drop
      (call_indirect (type 0)
        (local.get 0)
        (global.get 0)))
    (if  ;; label = @1
      (i32.eq
        (local.get 0)
        (i32.const 100))
      (then
        (return
          (i32.const 0))))
    (return
      (i32.const 1)))
  (func (;3;) (type 2)
    (local i32)
    (global.set 1
      (i32.const 1))
    (drop
      (call_indirect (type 1)
        (i32.const 2)
        (i32.const 0)
        (global.get 1)))
    (local.set 0
      (i32.const 1)))
  (table (;0;) 3 funcref)
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) (mut i32) (i32.const 0))
  (start 3)
  (elem (;0;) (i32.const 0) func 0)
  (elem (;1;) (i32.const 1) func 1)
  (elem (;2;) (i32.const 2) func 2))
