(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (type (;1;) (func))
  (func (;0;) (type 0) (param i32 i32) (result i32)
    (local i32)
    local.get 0
    local.get 1
    i32.add
    local.set 2
    local.get 2)
  (func (;1;) (type 1)
    (local i32)
    i32.const 1
    i32.const 1
    i32.add
    local.set 0)
  (memory (;0;) 2)
  (export "add" (func 0))
  (start 1))
