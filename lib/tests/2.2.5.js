/*jshint strict: false */

var assert = require("assert");

var adapter = global.adapter;
var resolved = adapter.resolved;
var rejected = adapter.rejected;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `this` value).", function () {
    describe("strict mode", function () {
        specify("fulfilled", function (done) {
            // Make the tests tolerant of older environments which don't have the correct semantics for `this` in strict mode
            // (e.g. because they don't implement strict mode at all).
            var defaultThisStrict = (function () {
                "use strict";
                return this;
            }());

            resolved(dummy).then(function onFulfilled() {
                "use strict";

                assert.strictEqual(this, undefined);
                done();
            });
        });

        specify("rejected", function (done) {
            var defaultThisStrict = (function () {
                "use strict";
                return this;
            }());

            rejected(dummy).then(null, function onRejected() {
                "use strict";

                assert.strictEqual(this, undefined);
                done();
            });
        });
    });

    describe("sloppy mode", function () {
        specify("fulfilled", function (done) {
            var defaultThisSloppy = (function () {
                return this;
            }());

            resolved(dummy).then(function onFulfilled() {
                assert.strictEqual(this, global);
                done();
            });
        });

        specify("rejected", function (done) {
            var defaultThisSloppy = (function () {
                return this;
            }());

            rejected(dummy).then(null, function onRejected() {
                assert.strictEqual(this, global);
                done();
            });
        });
    });
});
