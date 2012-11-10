"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var dummy = {}; // we fulfill or reject with this when we don't intend to test against it
var sentinel = {}; // we want to be equal to this

describe("2.2.3: If `onRejected` is a function,", function () {
    describe("2.2.3.1: it must be called after `promise` is rejected, with `promise`’s reason as its first argument.",
             function () {
        specify("already-rejected", function (done) {
            rejected(sentinel).then(null, function onRejected(reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });

        specify("immediately-rejected", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function onRejected(reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            tuple.reject(sentinel);
        });

        specify("delay-rejected", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function onRejected(reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(sentinel);
            }, 50);
        });
    });

    describe("2.2.3.2: it must not be called more than once.", function () {
        specify("already-rejected", function (done) {
            var timesCalled = 0;

            rejected(dummy).then(null, function onRejectedCalled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });
        });

        specify("trying to reject a pending promise more than once, immediately", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(null, function onRejectedCalled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.reject(dummy);
            tuple.reject(dummy);
        });

        specify("trying to reject a pending promise more than once, delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(null, function onRejectedCalled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            setTimeout(function () {
                tuple.reject(dummy);
                tuple.reject(dummy);
            }, 50);
        });

        specify("trying to reject a pending promise more than once, immediately then delayed", function (done) {
            var tuple = pending();
            var timesCalled = 0;

            tuple.promise.then(null, function onRejectedCalled() {
                assert.strictEqual(++timesCalled, 1);
                done();
            });

            tuple.reject(dummy);
            setTimeout(function () {
                tuple.reject(dummy);
            }, 50);
        });
    });

    describe("2.2.2.3: it must not be called if `onFulfilled` has already been called.", function () {
        specify("already-fulfilled", function (done) {
            var onFulfilledCalled = false;

            fulfilled(dummy).then(function onFulfilled() {
                onFulfilledCalled = true;
            }, function onRejected() {
                assert.strictEqual(onFulfilledCalled, false);
                done();
            });

            setTimeout(done, 100);
        });

        specify("immediately-fulfilled", function (done) {
            var tuple = pending();
            var onFulfilledCalled = false;

            tuple.promise.then(function onFulfilled() {
                onFulfilledCalled = true;
            }, function onRejected() {
                assert.strictEqual(onFulfilledCalled, false);
                done();
            });

            tuple.fulfill(dummy);

            setTimeout(done, 100);
        });

        specify("delay-fulfilled", function (done) {
            var tuple = pending();
            var onFulfilledCalled = false;

            tuple.promise.then(function onFulfilled() {
                onFulfilledCalled = true;
            }, function onRejected() {
                assert.strictEqual(onFulfilledCalled, false);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(dummy);
            }, 50);

            setTimeout(done, 100);
        });
    });
});
