# Compiler
The Compiler is separated from the cli because it should not require node or need to know anything about the system it is running on. The cli handles the command line and file interaction whereas the compiler only handles compilation of the provided data.