# Promises/A+ Compliance Test Suite

This suite tests compliance of a promise implementation with the [Promises/A+ specification][].

[Promises/A+ specification]: https://github.com/promises-aplus/promises-spec

## How To Run

The tests run in a Node.js environment; make sure you have that installed.

### Adapters

In order to test your promise library, you must expose a very minimal adapter interface. These are written as Node.js modules with a single export:

- `pending()`: creates a tuple consisting of `{ promise, fulfill, reject }`:
  - `promise` is a promise object that is currently in the pending state.
  - `fulfill(value)` moves the promise from the pending state to a fulfilled state, with fulfillment value `value`.
  - `reject(reason)` moves the promise from the pending state to the rejected state, with rejection reason `reason`.

Your adapter *may* additionally provide the following two exports, if your promise library provides specialized/optimized implementations.

- `fulfilled(value)`: creates a promise that is already fulfilled with `value`.
- `rejected(reason)`: creates a promise that is already rejected with `reason`.

Default implementations of `fulfilled` and/or `rejected` (which rely on `pending`) will be used if your adapter doesn't provide them.

### From the CLI

This package comes with a command-line interface that can be used either by installing it globally with
`npm install promises-aplus-tests -g` or by including it in your `package.json`'s `devDependencies` and using npm's
`scripts` feature. In the latter case, your setup might look something like

```json
{
    "devDependencies": {
        "promises-aplus-tests": "*"
    },
    "scripts": {
        "test": "run-my-own-tests && promises-aplus-tests test/my-adapter"
    }
}
```

The CLI takes as its single argument the filename of your adapter file, relative to the current working directory.

### Programmatically

The main export of this package is a function that allows you to run the tests against an adapter:

```js
var promisesAplusTests = require("promises-aplus-tests");

promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});
```
