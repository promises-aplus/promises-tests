"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality

function testThenableAssimilation(thenableFactory, test) {
    specify("via return from a fulfilled promise", function (done) {
        var promise = fulfilled(dummy).then(function onBasePromiseFulfilled() {
            return thenableFactory();
        });

        test(promise, done);
    });

    specify("via return from a rejected promise", function (done) {
        var promise = rejected(dummy).then(null, function onBasePromiseRejected() {
            return thenableFactory();
        });

        test(promise, done);
    });
}

describe("3.3.1: If `thenable` is a promise, adopt its state", function () {
    describe("3.3.1.1: If `thenable` is pending, `promise` must remain pending until `thenable` is fulfilled or " +
             "rejected.", function () {
        function thenableFactory() {
            return pending().promise;
        }

        testThenableAssimilation(thenableFactory, function (promise, done) {
            var wasFulfilled = false;
            var wasRejected = false;

            promise.then(
                function onPromiseFulfilled() {
                    wasFulfilled = true;
                },
                function onPromiseRejected() {
                    wasRejected = true;
                }
            );

            setTimeout(function () {
                assert.strictEqual(wasFulfilled, false);
                assert.strictEqual(wasRejected, false);
                done();
            }, 100);
        });
    });

    describe("3.3.1.2: If/when `thenable` is fulfilled, `promise` must be fulfilled with the same value.", function () {
        describe("`thenable` is already-fulfilled", function () {
            function thenableFactory() {
                return fulfilled(sentinel);
            }

            testThenableAssimilation(thenableFactory, function (promise, done) {
                promise.then(function onPromiseFulfilled(value) {
                    assert.strictEqual(value, sentinel);
                    done();
                });
            });
        });

        describe("`thenable` is eventually-fulfilled", function () {
            var tuple = null;

            function thenableFactory() {
                tuple = pending();
                setTimeout(function () {
                    tuple.fulfill(sentinel);
                }, 50);
                return tuple.promise;
            }

            testThenableAssimilation(thenableFactory, function (promise, done) {
                promise.then(function onPromiseFulfilled(value) {
                    assert.strictEqual(value, sentinel);
                    done();
                });
            });
        });
    });

    describe("3.3.1.3: If/when `thenable` is rejected, `promise` must be rejected with the same reason.", function () {
        describe("`thenable` is already-rejected", function () {
            function thenableFactory() {
                return rejected(sentinel);
            }

            testThenableAssimilation(thenableFactory, function (promise, done) {
                promise.then(null, function onPromiseRejected(reason) {
                    assert.strictEqual(reason, sentinel);
                    done();
                });
            });
        });

        describe("`thenable` is eventually-rejected", function () {
            var tuple = null;

            function thenableFactory() {
                tuple = pending();
                setTimeout(function () {
                    tuple.reject(sentinel);
                }, 50);
                return tuple.promise;
            }

            testThenableAssimilation(thenableFactory, function (promise, done) {
                promise.then(null, function onPromiseRejected(reason) {
                    assert.strictEqual(reason, sentinel);
                    done();
                });
            });
        });
    });
});
