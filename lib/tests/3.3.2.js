"use strict";

var assert = require("assert");
var thenables = require("./helpers/thenables");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality
var sentinelArray = [sentinel]; // a sentinel fulfillment value to test when we need an array

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

function testCallingResolvePromise(x, stringRepresentation, test) {
    describe("`x` is " + stringRepresentation, function () {
        describe("`thenable.then` calls `resolvePromise` synchronously", function () {
            function thenableFactory() {
                return {
                    then: function (resolvePromise) {
                        resolvePromise(x);
                    }
                };
            }

            testThenableAssimilation(thenableFactory, test);
        });

        describe("`thenable.then` calls `resolvePromise` asynchronously", function () {
            function thenableFactory() {
                return {
                    then: function (resolvePromise) {
                        setTimeout(function () {
                            resolvePromise(x);
                        }, 0);
                    }
                };
            }

            testThenableAssimilation(thenableFactory, test);
        });
    });
}

function testCallingRejectPromise(reason, stringRepresentation, test) {
    describe("`reason` is " + stringRepresentation, function () {
        describe("`thenable.then` calls `rejectPromise` synchronously", function () {
            function thenableFactory() {
                return {
                    then: function (resolvePromise, rejectPromise) {
                        rejectPromise(reason);
                    }
                };
            }

            testThenableAssimilation(thenableFactory, test);
        });

        describe("`thenable.then` calls `rejectPromise` asynchronously", function () {
            function thenableFactory() {
                return {
                    then: function (resolvePromise, rejectPromise) {
                        setTimeout(function () {
                            rejectPromise(reason);
                        }, 0);
                    }
                };
            }

            testThenableAssimilation(thenableFactory, test);
        });
    });
}

function testCallingResolvePromiseFulfillsWith(x, stringRepresentation, fulfillmentValue) {
    testCallingResolvePromise(x, stringRepresentation, function (promise, done) {
        promise.then(function onPromiseFulfilled(value) {
            assert.strictEqual(value, fulfillmentValue);
            done();
        });
    });
}

function testCallingResolvePromiseRejectsWith(x, stringRepresentation, rejectionReason) {
    testCallingResolvePromise(x, stringRepresentation, function (promise, done) {
        promise.then(null, function onPromiseRejected(reason) {
            assert.strictEqual(reason, rejectionReason);
            done();
        });
    });
}

function testCallingRejectPromiseRejectsWith(reason, stringRepresentation) {
    testCallingRejectPromise(reason, stringRepresentation, function (promise, done) {
        promise.then(null, function onPromiseRejected(rejectionReason) {
            assert.strictEqual(rejectionReason, reason);
            done();
        });
    });
}

describe("3.3.2: Otherwise, call `thenable.then` with first argument `resolvePromise` and second argument " +
         "`rejectedPromise`, where:", function () {
    describe("3.3.2.1: If/when `resolvePromise` is called with a value `x`,", function () {
        describe("3.2.2.1.1: If `x` is not a thenable, `promise` must be fulfilled with `x`", function () {
            testCallingResolvePromiseFulfillsWith(undefined, "`undefined`", undefined);
            testCallingResolvePromiseFulfillsWith(null, "`null`", null);
            testCallingResolvePromiseFulfillsWith(false, "`false`", false);
            testCallingResolvePromiseFulfillsWith(5, "`5`", 5);
            testCallingResolvePromiseFulfillsWith(sentinel, "an object", sentinel);
            testCallingResolvePromiseFulfillsWith(sentinelArray, "an array", sentinelArray);
        });

        describe("3.2.2.1.1: If `x` is a thenable, run `Assimilate(promise, x)`", function () {
            describe("one level deep (thenable-for-thenable)", function () {
                Object.keys(thenables.fulfilled).forEach(function (stringRepresentation) {
                    var x = thenables.fulfilled[stringRepresentation](sentinel);
                    testCallingResolvePromiseFulfillsWith(x, stringRepresentation, sentinel);
                });

                Object.keys(thenables.rejected).forEach(function (stringRepresentation) {
                    var x = thenables.rejected[stringRepresentation](sentinel);
                    testCallingResolvePromiseRejectsWith(x, stringRepresentation, sentinel);
                });
            });

            // TODO: two levels deep, maybe 3.
        });
    });

    describe("3.3.2.2: If/when `rejectPromise` is called with a reason `reason`, `promise` must be rejected with " +
             "`reason`.", function () {
        testCallingRejectPromiseRejectsWith(undefined, "`undefined`");
        testCallingRejectPromiseRejectsWith(null, "`null`");
        testCallingRejectPromiseRejectsWith(false, "`false`");
        testCallingRejectPromiseRejectsWith(5, "`5`");
        testCallingRejectPromiseRejectsWith(sentinel, "an object");
        testCallingRejectPromiseRejectsWith(sentinelArray, "an array");

        Object.keys(thenables.fulfilled).forEach(function (stringRepresentation) {
            var reason = thenables.fulfilled[stringRepresentation](dummy);
            testCallingRejectPromiseRejectsWith(reason, stringRepresentation);
        });

        Object.keys(thenables.rejected).forEach(function (stringRepresentation) {
            var reason = thenables.rejected[stringRepresentation](dummy);
            testCallingRejectPromiseRejectsWith(reason, stringRepresentation);
        });
    });

    describe("3.3.2.3: If both `resolvePromise` and `rejectPromise` are called, or multiple calls to the same " +
             "argument are made, the first call takes precendence, and any further calls are ignored.", function () {
        describe("calling `resolvePromise` then `rejectPromise`, both synchronously", function () {

        });

        describe("calling `resolvePromise` synchronously then `rejectPromise` asynchronously", function () {

        });

        describe("calling `resolvePromise` then `rejectPromise`, both asynchronously", function () {

        });

        describe("calling `rejectPromise` then `resolvePromise`, both synchronously", function () {

        });

        describe("calling `rejectPromise` synchronously then `resolvePromise` asynchronously", function () {

        });

        describe("calling `rejectPromise` then `resolvePromise`, both asynchronously", function () {

        });

        describe("calling `resolvePromise` twice synchronously", function () {

        });

        describe("calling `resolvePromise` twice, first synchronously then asynchronously", function () {

        });

        describe("calling `resolvePromise` twice, both times asynchronously", function () {

        });

        describe("calling `rejectPromise` twice synchronously", function () {

        });

        describe("calling `rejectPromise` twice, first synchronously then asynchronously", function () {

        });

        describe("calling `rejectPromise` twice, both times asynchronously", function () {

        });
    });

    describe("3.3.2.4: If the call to thenable.then throws an exception,", function () {
        describe("3.3.2.4.1: If `resolvePromise` or `rejectPromise` have been called, ignore it.", function () {
            describe("`resolvePromise` was called", function () {

            });

            describe("`rejectPromise` was called", function () {

            });

            describe("`resolvePromise` then `rejectPromise` were called", function () {

            });

            describe("`rejectPromise` then `resolvePromise` were called", function () {

            });
        });

        describe("3.3.2.4.2: Otherwise, `promise` must be rejected with the thrown exception as the reason.",
                 function () {
            describe("straightforward case", function () {

            });

            describe("`resolvePromise` is then called asynchronously", function () {

            });

            describe("`rejectPromise` is then called asynchronously", function () {

            });
        });
    });
});
