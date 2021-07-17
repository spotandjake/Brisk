# Instructions for Logging Issues

## 1. Search for Duplicates

[Search the existing issues](https://github.com/spotandjake/Brisk/search?type=Issues) before logging a new one.

Some search tips:
 * *Don't* restrict your search to only open issues. An issue with a title similar to yours may have been closed as a duplicate of one with a less-findable title.
 * Check for synonyms.
 * Search for the title of the issue you're about to log. This sounds obvious but 80% of the time this is sufficient to find a duplicate when one exists.
 * Read more than the first page of results. Many bugs here use the same words so relevancy sorting is not particularly strong.
 * If you have a crash, search for the first few topmost function names shown in the call stack.

## 2. Did you find a bug?

When logging a bug, please be sure to include the following:
 * What version of Brisk you're using (run `Brisk --v`)
 * If at all possible, an *isolated* way to reproduce the behavior
 * The behavior you expect to see, and the actual behavior

## 3. Do you have a suggestion?

In general, things we find useful when reviewing suggestions are:
* A description of the problem you're trying to solve
* An overview of the suggested solution
* Examples of how the suggestion would work in various places
  * Code examples showing e.g. "this would be an error, this wouldn't"
  * Code examples showing the generated wasm (if applicable)
* If relevant, precedent in other languages can be useful for establishing context and expected behavior

# Instructions for Contributing Code

## What You'll Need

0. [A bug or feature you want to work on](https://github.com/spotandjake/Brisk/labels/help%20wanted)!
1. [A GitHub account](https://github.com/join).
2. A copy of the Brisk code. See the next steps for instructions.
3. [Node](https://nodejs.org), which runs JavaScript locally. Current or LTS will both work.
4. An editor. [VS Code](https://code.visualstudio.com) is the best place to start for Brisk.

## Get Started

1. Install node using the version you downloaded from [nodejs.org](https://nodejs.org).
2. Open a terminal.
3. Make a fork&mdash;your own copy&mdash;of Brisk on your GitHub account, then make a clone&mdash;a local copy&mdash;on your computer. ([Here are some step-by-step instructions](https://github.com/anitab-org/mentorship-android/wiki/Fork%2C-Clone-%26-Remote)). Add `--depth=1` to the end of the `git clone` command to save time.
4. Install the gulp command line tool: `yarn global add gulp-cli`
5. Change to the TypeScript folder you made: `cd Brisk`
6. Install dependencies: `yarn`
7. Make sure everything builds and tests pass: `yarn build`
8. Open the Brisk folder in your editor.
9. Follow the directions below to add and debug a test.

## Tips

### Using local builds

Run `yarn build` to build a version of the compiler/language service that reflects changes you've made. You can then run `yarn run` or `yarn start`to build and run in place of `brisk` in your project.

## Contributing bug fixes

Brisk is currently accepting contributions in the form of bug fixes. A bug must have an issue tracking it in the issue tracker that has been approved (labelled ["help wanted"](https://github.com/spotandjake/Brisk/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or in the "Backlog milestone") by the Brisk team. Your pull request should include a link to the bug that you are fixing. If you've submitted a PR for a bug, please post a comment in the bug to avoid duplication of effort.

## Contributing features

Features (things that add new or improved functionality to Brisk) may be accepted, but will need to first be approved (labelled ["help wanted"](https://github.com/spotandjake/Brisk/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or in the "Backlog" milestone) by a Brisk project maintainer in the suggestion issue. Features with language design impact, or that are adequately satisfied with external tools, will not be accepted.

## Housekeeping

Your pull request should:

* Include a description of what your change intends to do
* Be based on reasonably recent commit in the **main** branch
* Include adequate tests
    * At least one test should fail in the absence of your non-test code changes. If your PR does not match this criteria, please specify why
    * Tests should include reasonable permutations of the target fix/change
    * Include baseline changes with your change
* To avoid line ending issues, set `autocrlf = input` and `whitespace = cr-at-eol` in your git configuration

## Running the Tests

To run all tests, invoke the `yarn start-tests`:

```Shell
yarn start-tests
```

## Adding a Test

To add a new test case, add a `.ts` file in `./unit testing/test` with code that shows the bug is now fixed, or your new feature now works.
