# Compiler Process
================================
1) lex file
2) parse lex tree
3) compile macros
4) well-formed check
5) optimize main code
  1) Constant Propagation
  2) Dead code Elimination
  3) determine functions that do not have closures and optimize them
  4) determine functions that are not passed around and call them directly
6) module linking
7) determine flags for functions such as disabling the gc
8) add calls for garbage collection
9) flatten parse tree
10) compile