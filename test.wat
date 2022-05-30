(module $./Resources/CodeGen.br
  (type (;0;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func))
  (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (type 0)))
  (func $writeCharacter (type 1) (param $pointer2 i32) (param $character3 i32) (result i32)
    (i32.store align=1
      (local.get $pointer2)
      (local.get $character3))
    (local.set $pointer2
      (i32.add
        (local.get $pointer2)
        (i32.const 1)))
    (return
      (local.get $pointer2)))
  (func $_start (type 2)
    (local $writeCharacter1 i32) (local $pointer4 i32)
    (local.set $writeCharacter1
      (i32.const 1))
    (local.set $pointer4
      (i32.const 8))
    (i32.store align=1
      (i32.const 0)
      (i32.const 8))
    (i32.store align=1
      (i32.const 4)
      (i32.const 12))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 72)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 101)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 108)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 108)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 111)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 32)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 87)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 111)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 114)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 108)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 100)
        (local.get $writeCharacter1)))
    (local.set $pointer4
      (call_indirect (type 1)
        (local.get $pointer4)
        (i32.const 10)
        (local.get $writeCharacter1)))
    (drop
      (call_indirect (type 0)
        (i32.const 1)
        (i32.const 0)
        (i32.const 1)
        (i32.const 20)
        (global.get 1))))
  (table (;0;) 2 funcref)
  (memory (;0;) 1)
  (global (;0;) i32 (i32.const 0))
  (global (;1;) i32 (i32.const 0))
  (export "_start" (func $_start))
  (export "memory" (memory 0))
  (start $_start)
  (elem (;0;) (i32.const 0) func $fd_write)
  (elem (;1;) (i32.const 1) func $writeCharacter))
