(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (func (;0;) (type 0) (param i32 i32) (result i32)
    (local i32)
    i32.const 1
    i32.const 1
    i32.add
    local.set 2
    local.get 2)
  (export "add" (func 0)))
