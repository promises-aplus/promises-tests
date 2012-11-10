"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var dummy = {}; // we fulfill or reject with this when we don't intend to test against it
var sentinel = {}; // we want to be equal to this

describe("2.2.2: If `onFulfilled` is a function,", function () {
    describe("2.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s value as its first argument.",
             function () {
        specify("already-fulfilled", function (done) {
            fulfilled(sentinel).then(function onFulfilled(value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });

        specify("immediately-fulfilled", function (done) {
            var tuple = pending();
            tuple.promise.then(function onFulfilled(value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            tuple.fulfill(sentinel);
        });

        specify("delay-fulfilled", function (done) {
            var tuple = pending();
            tuple.promise.then(function onFulfilled(value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(sentinel);
            }, 50);
        });
    });

    describe("2.2.2.2: it must not be called more than once.", function () {
        specify("already-fulfilled", function (done) {
            var timesCalled = 0;

            fulfilled(dummy).then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });
        });

        specify("trying to fulfill a pending promise more than once, immediately", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.fulfill(dummy);
            tuple.fulfill(dummy);
        });

        specify("trying to fulfill a pending promise more than once, delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(dummy);
                tuple.fulfill(dummy);
            }, 50);
        });

        specify("trying to fulfill a pending promise more than once, immediately then delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.fulfill(dummy);
            setTimeout(function () {
                tuple.fulfill(dummy);
            }, 50);
        });
    });

    describe("2.2.2.3: it must not be called if `onRejected` has already been called.", function () {
        specify("already-rejected", function (done) {
            var onRejectedCalled = false;
            rejected(dummy).then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            setTimeout(done, 100);
        });

        specify("immediately-rejected", function (done) {
            var tuple = pending();
            var onRejectedCalled = false;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            tuple.reject(dummy);

            setTimeout(done, 100);
        });

        specify("delay-rejected", function (done) {
            var tuple = pending();
            var onRejectedCalled = false;

            tuple.promise.then(function onFulfilled() {
                assert.strictEqual(onRejectedCalled, false);
                done();
            }, function onRejected() {
                onRejectedCalled = true;
            });

            setTimeout(function () {
                tuple.reject(dummy);
            }, 50);

            setTimeout(done, 100);
        });
    });
});
