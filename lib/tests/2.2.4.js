"use strict";

var assert = require("assert");
var testFulfilled = require("./helpers/testThreeCases").testFulfilled;
var testRejected = require("./helpers/testThreeCases").testRejected;

var dummy = {}; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.4: `onFulfilled` and `onRejected` must not be called before `then` returns.", function () {
    testFulfilled(dummy, function (promise, done) {
        var thenHasReturned = false;

        promise.then(function onFulfilled() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });

    testRejected(dummy, function (promise, done) {
        var thenHasReturned = false;

        promise.then(null, function onRejected() {
            assert(thenHasReturned);
            done();
        });

        thenHasReturned = true;
    });
});
