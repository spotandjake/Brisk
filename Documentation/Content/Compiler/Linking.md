# Brisk Linker

Linking in brisk is performed statically at compile time, the linker links outputted wasm files according to the abi used by the brisk compiler, the brisk linker allows linking with wasm and wat files as long as they follow the abi, if you try linking to a wat or wasm file that does not follow the abi you will likely run into unspecified errors.

## Brisk Linker Globals
+ `_MemoryPointer` is the memory pointer used in the program, most globals in the linker are duplicated and renamed but this is left and used throughout all the modules.
+ `_FunctionTableOffset` this is an offset that the linker sets when linking, this allows us to link with first class functions.

## Brisk Linker WalkThrough
1) Make A DependencyGraph
2) Sort the graph
3) Remap globals and stuff and link them