"use strict";

var assert = require("assert");
var sinon = require("sinon");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;
var testRejected = require("./helpers/testThreeCases").testRejected;

var dummy = {}; // we fulfill or reject with this when we don't intend to test against it
var other = {}; // a value we don't want to be strict equal to
var sentinel = {}; // a sentinel fulfillment value to test for with strict equality
var sentinel2 = {};
var sentinel3 = {};

function callbackAggregator(times, ultimateCallback) {
    var soFar = 0;
    return function () {
        if (++soFar === times) {
            ultimateCallback();
        }
    };
}

describe("2.2.5: `then` may be called any number of times.", function () {
    describe("multiple boring fulfillment handlers", function () {
        testFulfilled(sentinel, function (promise, done) {
            var handler1 = sinon.stub().returns(other);
            var handler2 = sinon.stub().returns(other);
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
    });

    describe("multiple boring rejection handlers", function () {
        testRejected(sentinel, function (promise, done) {
            var handler1 = sinon.stub().returns(other);
            var handler2 = sinon.stub().returns(other);
            var handler3 = sinon.stub().returns(other);

            var spy = sinon.spy();
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

    describe("multiple fulfillment handlers, one of which throws", function () {
        testFulfilled(sentinel, function (promise, done) {
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
    });

    describe("multiple rejection handlers, one of which throws", function () {
        testRejected(sentinel, function (promise, done) {
            var handler1 = sinon.stub().returns(other);
            var handler2 = sinon.stub().throws(other);
            var handler3 = sinon.stub().returns(other);

            var spy = sinon.spy();
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

    describe("results in multiple branching chains with their own fulfillment/rejection values", function () {
        testFulfilled(dummy, function (promise, done) {
            var semiDone = callbackAggregator(3, done);

            promise.then(function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                semiDone();
            });

            promise.then(function () {
                throw sentinel2;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel2);
                semiDone();
            });

            promise.then(function () {
                return sentinel3;
            }).then(function (value) {
                assert.strictEqual(value, sentinel3);
                semiDone();
            });
        });

        testRejected(sentinel, function (promise, done) {
            var semiDone = callbackAggregator(3, done);

            promise.then(null, function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                semiDone();
            });

            promise.then(null, function () {
                throw sentinel2;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel2);
                semiDone();
            });

            promise.then(null, function () {
                return sentinel3;
            }).then(function (value) {
                assert.strictEqual(value, sentinel3);
                semiDone();
            });
        });
    });
});
