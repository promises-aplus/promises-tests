<a href="https://promisesaplus.com/"><img src="https://promisesaplus.com/assets/logo-small.png" align="right" alt="Promises/A+ logo" /></a>

# Promises/A+ Compliance Test Suite (refreshed)

This suite tests compliance of a promise implementation with the [Promises/A+ specification](https://github.com/promises-aplus/promises-spec).

Passing the tests in this repo means that you have a Promises/A+ compliant implementation of the `then()` method, and you can display the [Promises/A+ logo](https://promisesaplus.com/assets/logo-small.png) in your README.

The [original suite](https://github.com/promises-aplus/promises-tests) seems to have been abandoned; this fork passes [`npm audit`](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities) and adds [TypeScript](https://typescriptlang.org/) types, without changing any of the tests.

Before it was abandoned, you could also [send a pull request](https://github.com/promises-aplus/promises-spec) to have your implementation listed on the [implementations page](https://promisesaplus.com/implementations).

## How To Run

The tests can run in either a Node.js environment or, if you set things up correctly, in the browser.

### Adapters

In order to test your promise library, you must expose a very minimal adapter interface. These are written as Node.js
modules with a few well-known exports:

- `resolved(value)`: creates a promise that is resolved with `value`.
- `rejected(reason)`: creates a promise that is already rejected with `reason`.
- `deferred()`: creates an object consisting of `{ promise, resolve, reject }`:
  - `promise` is a promise that is currently in the pending state.
  - `resolve(value)` resolves the promise with `value`.
  - `reject(reason)` moves the promise from the pending state to the rejected state, with rejection reason `reason`.

The `resolved` and `rejected` exports are actually optional, and will be automatically created by the test runner using
`deferred` if they are not present. But, if your promise library has the capability to create already-resolved or
already-rejected promises, then you should include these exports, so that the test runner can provide you with better
code coverage and uncover any bugs in those methods.

Note that the tests will never pass a promise or a thenable as a resolution. That means that we never use the promise-
or thenable-accepting forms of the resolve operation directly, and instead only use the direct fulfillment operation,
since fulfill and resolve are equivalent when not given a thenable.

Finally, note that none of these functions, including `deferred().resolve` and `deferred().reject`, should throw
exceptions. The tests are not structured to deal with that, and if your implementation has the potential to throw
exceptions—e.g., perhaps it throws when trying to resolve an already-resolved promise—you should wrap direct calls to
your implementation in `try`/`catch` when writing the adapter.

### From the CLI

This package comes with a command-line interface that can be used either by installing it globally with
`npm install promises-aplus-tests-refreshed -g` or by including it in your `package.json`'s `devDependencies` and using npm's
`scripts` feature. In the latter case, your setup might look something like

```json
{
    "devDependencies": {
        "promises-aplus-tests-refreshed": "*"
    },
    "scripts": {
        "test": "run-my-own-tests && promises-aplus-tests-refreshed test/my-adapter"
    }
}
```

The CLI takes as its first argument the filename of your adapter file, relative to the current working directory. It
tries to pass through any subsequent options to Mocha, so you can use e.g. `--reporter spec` or `--grep 2.2.4`.

### Programmatically

The main export of this package is a function that allows you to run the tests against an adapter:

```js
let promisesAplusTests = require("promises-aplus-tests-refreshed");

promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
```

You can also pass any Mocha options as the second parameter, e.g.

```js
promisesAplusTests(adapter, { reporter: "dot" }, function (err) {
  // As before.
});
```

### Within an Existing Mocha Test Suite

If you already have a Mocha test suite and want to include these tests in it, you can do:

```js
describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests-refreshed").mocha(adapter);
});
```

This also works in the browser, if you have your Mocha tests running there, as long as you use [browserify](http://browserify.org/).
