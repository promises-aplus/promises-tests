"use strict";

var assert = require("assert");
var sinon = require("sinon");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;

var other = {}; // a dummy value we don't want to be strict equal to
var sentinel = {}; // a sentinel fulfillment value to test for with strict equality

function callbackAggregator(times, ultimateCallback) {
    var soFar = 0;
    return function () {
        if (++soFar === times) {
            ultimateCallback();
        }
    };
}

describe("Multiple handlers", function () {
    describe("when there are multiple fulfillment handlers for a fulfilled promise", function () {
        it("should call them all, in order, with the same fulfillment value", function (done) {
            var promise = fulfilled(sentinel);

            // Don't let their return value *or* thrown exceptions impact each other.
            var handler1 = sinon.stub().returns(other);
            var handler2 = sinon.stub().throws(other);
            var handler3 = sinon.stub().returns(other);

            var spy = sinon.spy();
            promise.then(handler1, spy);
            promise.then(handler2, spy);
            promise.then(handler3, spy);

            promise.then(function (value) {
                assert.strictEqual(value, sentinel);

                sinon.assert.calledWith(handler1, sinon.match.same(sentinel));
                sinon.assert.calledWith(handler2, sinon.match.same(sentinel));
                sinon.assert.calledWith(handler3, sinon.match.same(sentinel));
                sinon.assert.notCalled(spy);

                done();
            });
        });

        it("should generate multiple branching chains with their own fulfillment values", function (done) {
            var promise = fulfilled(other);
            var semiDone = callbackAggregator(2, done);

            var sentinel2 = {};

            promise.then(function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                semiDone();
            });

            promise.then(function () {
                return sentinel2;
            }).then(function (value) {
                assert.strictEqual(value, sentinel2);
                semiDone();
            });
        });
    });

    describe("when there are multiple rejection handlers for a rejected promise", function () {
        it("should call them all, in order, with the same rejection reason", function (done) {
            var promise = rejected(sentinel);

            // Don't let their return value *or* thrown exceptions impact each other.
            var spy = sinon.spy();
            var handler1 = sinon.stub().returns(other);
            var handler2 = sinon.stub().throws(other);
            var handler3 = sinon.stub().returns(other);

            promise.then(spy, handler1);
            promise.then(spy, handler2);
            promise.then(spy, handler3);

            promise.then(null, function (reason) {
                assert.strictEqual(reason, sentinel);

                sinon.assert.calledWith(handler1, sinon.match.same(sentinel));
                sinon.assert.calledWith(handler2, sinon.match.same(sentinel));
                sinon.assert.calledWith(handler3, sinon.match.same(sentinel));
                sinon.assert.notCalled(spy);

                done();
            });
        });
    });
});
