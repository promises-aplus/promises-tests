"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var dummy = {}; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.4: `onFulfilled` and `onRejected` must not be called before `then` returns.", function () {
    specify("already-fulfilled", function (done) {
        var thenHasReturned = false;

        fulfilled(dummy).then(function onFulfilled() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });

    specify("already-rejected", function (done) {
        var thenHasReturned = false;

        rejected(dummy).then(null, function onRejected() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });

    specify("immediately-fulfilled", function (done) {
        var thenHasReturned = false;
        var tuple = pending();

        tuple.promise.then(function onFulfilled() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;

        tuple.fulfill(dummy);
    });

    specify("immediately-rejected", function (done) {
        var thenHasReturned = false;
        var tuple = pending();

        tuple.promise.then(null, function onRejected() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;

        tuple.reject(dummy);
    });

    specify("eventually-fulfilled", function (done) {
        var thenHasReturned = false;
        var tuple = pending();

        tuple.promise.then(function onFulfilled() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;

        setTimeout(function () {
            tuple.fulfill(dummy);
        }, 50);
    });

    specify("eventually-rejected", function (done) {
        var thenHasReturned = false;
        var tuple = pending();

        tuple.promise.then(null, function onRejected() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;

        setTimeout(function () {
            tuple.reject(dummy);
        }, 50);
    });
});
