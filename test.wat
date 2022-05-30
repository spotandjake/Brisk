(module $./Resources/CodeGen.br
  (type (;0;) (func (param i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func))
  (import "env" "print" (func $print (type 0)))
  (func $loop (type 1) (param $t2 i32) (param $index3 i32) (result i32)
    (local $test4 i32)
    local.get $index3
    local.get $t2
    call_indirect (type 0)
    local.set $test4
    local.get $index3
    i32.const 1
    i32.add
    local.set $index3
    local.get $test4
    i32.const 1
    i32.eq
    if  ;; label = @1
      local.get $t2
      local.get $index3
      global.get 2
      call_indirect (type 1)
      drop
    end
    i32.const 1
    return)
  (func $AmbiguousFunction2 (type 0) (param $index5 i32) (result i32)
    local.get $index5
    global.get 1
    call_indirect (type 0)
    drop
    local.get $index5
    i32.const 100
    i32.eq
    if  ;; label = @1
      i32.const 0
      return
    end
    i32.const 1
    return)
  (func $main (type 2)
    i32.const 1
    global.set 2
    i32.const 2
    i32.const 0
    global.get 2
    call_indirect (type 1)
    drop)
  (table (;0;) 3 funcref)
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) i32 (i32.const 0))
  (global (;2;) (mut i32) (i32.const 0))
  (start $main)
  (elem (;0;) (i32.const 0) func $print)
  (elem (;1;) (i32.const 1) func $loop)
  (elem (;2;) (i32.const 2) func $AmbiguousFunction2))
