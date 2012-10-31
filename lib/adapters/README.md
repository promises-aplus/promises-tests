The adapters expose *only* the interface necessary for testing [CommonJS Promises/A][]. In particular, I did not want to
introduce the concept of a deferred, and especially the fact that you can usually resolve a deferred with a promise
(which keeps the underlying promise in a pending state, waiting on the passed promise). Those are beyond the scope of
Promises/A:

> This API does not define how promises are created, but only defines the necessary interface that a promise must
> provide for promise consumers to interact with it. Implementors are free to define how promises are generated.

Instead, Promises/A has only the concept that promises have a state, and can transition between them:

> A promise may be in one of the three states, unfulfilled, fulfilled, and failed. The promise may only move from
> unfulfilled to fulfilled, or unfulfilled to failed.

We have adopted the terminology "pending" in place of "unfulfilled," and "rejected" in place of "failed," as these have
seen more currency in most modern promise implementations.

Thus we desire the following interface from adapters:

- `fulfilled(value)`: creates a promise that is already fulfilled with `value`.
- `rejected(reason)`: creates a promise that is already rejected with `reason`.
- `pending()`: creates a tuple consisting of `{ promise, fulfill, reject }`:
  - `promise` is a promise object that is currently in the pending state.
  - `fulfill(value)` moves the promise from the pending state to a fulfilled state, with fulfillment value `value`.
  - `reject(reason)` moves the promise from the pending state to the rejected state, with rejection reason `reason`.

[CommonJS Promises/A]: http://wiki.commonjs.org/wiki/Promises/A
