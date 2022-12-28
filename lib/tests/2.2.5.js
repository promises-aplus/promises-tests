/*jshint strict: false */

var assert = require("assert");

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).", function () {
    describe("strict mode", function () {
        specify("fulfilled", function (done) {
            resolved(dummy).then(
                /** @type { ( this: typeof globalThis) => void } */
                function onFulfilled() {
                    "use strict";
                    assert.strictEqual(this, undefined);
                    done();
                }
            );
        });

        specify("rejected", function (done) {
            rejected(dummy).then(
                null,
                /** @type { ( this: typeof globalThis) => void } */
                function onRejected() {
                    "use strict";
                    assert.strictEqual(this, undefined);
                    done();
                }
            );
        });
    });

    describe("sloppy mode", function () {
        specify("fulfilled", function (done) {
            resolved(dummy).then(
                /** @type { ( this: typeof globalThis) => void } */
                function onFulfilled() {
                    assert.strictEqual(this, global);
                    done();
                }
            );
        });

        specify("rejected", function (done) {
            rejected(dummy).then(
                null,
                /** @type { ( this: typeof globalThis) => void } */
                function onRejected() {
                    assert.strictEqual(this, global);
                    done();
                }
            );
        });
    });
});
