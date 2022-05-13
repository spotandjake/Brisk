<p align="center">
  <a href="https://github.com/spotandjake/Brisk">
    <img src="https://img.shields.io/github/repo-size/spotandjake/Brisk?color=%2350E6FF" alt="">
  </a>
  <a href="https://choosealicense.com/licenses/apache-2.0//">
    <img src="https://img.shields.io/github/license/spotandjake/Brisk?color=%2350E6FF&style=flat-square" alt="License: Apache 2.0">
  </a>
  <a href="https://github.com/spotandjake/Brisk">
    <img alt="Brisk Version" src="https://img.shields.io/github/package-json/v/spotandjake/Brisk?color=%2350E6FF&style=flat-square">
  </a>
</p>

# Description
***

`Brisk` is a language written with the sole purpose of educating myself on language and compiler design and to get familiar with wasm.
# Language Goals
***

An Easy To Program Language That Compiles To Web Assembly. The Goal Of brisk Is To Allow Users To Write Code Easily While Still Being Performant And Powerful. Brisk Syntax Is Similar To Typescript At Its Core While Adding Features Such As Advanced Enums That Make It Extremely Powerful.
# Language Fundamentals
***

Brisk is a super basic easy to use, and easy to extend the language with only the bare minimum set in stone.

# Getting started
***

```
git clone https://github.com/spotandjake/Brisk
cd Brisk
yarn install
yarn build
```
# Yarn Instructions
***
Compiling a Brisk Program
```
yarn start <file>
```
Compiling the Brisk compiler
```
yarn build
```
Compiling a Brisk Program without Recompiling the Compiler
```
yarn run <file>
```
Lint the Compiler
```
yarn lint
```
Package the Compiler to an executable
```
yarn package
```

# Compiler Executable Command Line Instructions
***

General Arguments
```
Brisk -v, Brisk --version: Output the current Brisk Compiler Version
Brisk -h, Brisk --help: Output Help On using the Compiler
```
Compile A Program
```
Brisk <file>
Brisk compile <file>
```
Run a wasm binary: soon to change
```
Brisk run <file>
```
# Brisk Package Manager
***

Not Implemented Yet, Still to come
