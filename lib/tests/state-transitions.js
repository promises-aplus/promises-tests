"use strict";

var assert = require("assert");

var adapter = global.adapter;
var pending = adapter.pending;

var other = {}; // a dummy value we don't want to be strict equal to
var sentinel = {}; // a sentinel fulfillment value to test for with strict equality

describe("State transitions", function () {
    // NOTE: Promises/A+ does not specify that attempts to change state twice should be silently ignored, so we allow
    // implementations to throw exceptions.
    it("cannot fulfill twice", function (done) {
        var tuple = pending();
        tuple.promise.then(function (value) {
            assert.strictEqual(value, sentinel);
            done();
        });

        tuple.fulfill(sentinel);
        try {
            tuple.fulfill(other);
        } catch (e) { }
    });

    it("cannot reject twice", function (done) {
        var tuple = pending();
        tuple.promise.then(null, function (reason) {
            assert.strictEqual(reason, sentinel);
            done();
        });

        tuple.reject(sentinel);
        try {
            tuple.reject(other);
        } catch (e) { }
    });

    it("cannot fulfill then reject", function (done) {
        var tuple = pending();
        tuple.promise.then(function (value) {
            assert.strictEqual(value, sentinel);
            done();
        });

        tuple.fulfill(sentinel);
        try {
            tuple.reject(other);
        } catch (e) { }
    });

    it("cannot reject then fulfill", function (done) {
        var tuple = pending();
        tuple.promise.then(null, function (reason) {
            assert.strictEqual(reason, sentinel);
            done();
        });

        tuple.reject(sentinel);
        try {
            tuple.fulfill(other);
        } catch (e) { }
    });
});
