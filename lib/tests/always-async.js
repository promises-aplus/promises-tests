"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

describe("[Extension] Promises are always resolved asynchronously", function () {
    it("should be asynchronous for already-fulfilled promises", function (done) {
        var ticks = 0;
        process.nextTick(function () {
            ++ticks;
        });

        fulfilled().then(function () {
            assert(ticks > 0);
            done();
        });
    });

    it("should be asynchronous for already-rejected promises", function (done) {
        var ticks = 0;
        process.nextTick(function () {
            ++ticks;
        });

        rejected().then(null, function () {
            assert(ticks > 0);
            done();
        });

    });

    it("should be asynchronous for eventually-fulfilled promises", function (done) {
        var ticks = 0;
        process.nextTick(function () {
            ++ticks;
        });

        var tuple = pending();
        tuple.promise.then(function () {
            assert(ticks > 0);
            done();
        });

        tuple.fulfill();
    });

    it("should be asynchronous for eventually-rejected promises", function (done) {
        var ticks = 0;
        process.nextTick(function () {
            ++ticks;
        });

        var tuple = pending();
        tuple.promise.then(null, function () {
            assert(ticks > 0);
            done();
        });

        tuple.reject();
    });
});
