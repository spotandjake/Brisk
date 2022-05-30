(module
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func))
  (import "env" "print" (func (;0;) (type 0)))
  (func (;1;) (type 1) (param i32 i32) (result i32)
    (local i32)
    local.get 1
    local.get 0
    call_indirect (type 0)
    local.set 2
    local.get 1
    i32.const 1
    i32.add
    local.set 1
    local.get 2
    i32.const 1
    i32.eq
    if  ;; label = @1
      local.get 0
      local.get 1
      global.get 2
      call_indirect (type 1)
      drop
    end
    i32.const 1
    return)
  (func (;2;) (type 0) (param i32) (result i32)
    local.get 0
    global.get 1
    call_indirect (type 0)
    drop
    local.get 0
    i32.const 100
    i32.eq
    if  ;; label = @1
      i32.const 0
      return
    end
    i32.const 1
    return)
  (func (;3;) (type 2)
    global.get 0
    i32.const 1
    i32.add
    global.set 2
    global.get 0
    i32.const 2
    i32.add
    i32.const 0
    global.get 2
    call_indirect (type 1)
    drop
    i32.const 8
    i32.const 48
    i32.store align=1
    i32.const 8
    i32.load align=1
    global.get 1
    call_indirect (type 0)
    drop)
  (table (;0;) 3 funcref)
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) i32 (i32.const 0))
  (global (;2;) (mut i32) (i32.const 0))
  (start 3)
  (elem (;0;) (i32.const 0) func 0)
  (elem (;1;) (i32.const 1) func 1)
  (elem (;2;) (i32.const 2) func 2))
