"use strict";

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;

var dummy = {}; // a dummy value that indicates we won't test against it

describe("2.2.1: Both `onFulfilled` and `onRejected` are optional arguments.", function () {
    describe("2.2.1.1: If `onFulfilled` is not a function, it must be ignored.", function () {
        specify("undefined", function (done) {
            rejected(dummy).then(undefined, function () {
                done();
            });
        });

        specify("null", function (done) {
            rejected(dummy).then(null, function () {
                done();
            });
        });

        specify("false", function (done) {
            rejected(dummy).then(false, function () {
                done();
            });
        });

        specify("5", function (done) {
            rejected(dummy).then(5, function () {
                done();
            });
        });

        specify("{}", function (done) {
            rejected(dummy).then({}, function () {
                done();
            });
        });
    });

    describe("2.2.1.1: If `onRejected` is not a function, it must be ignored.", function () {
        specify("undefined", function (done) {
            fulfilled(dummy).then(function () {
                done();
            });
        });

        specify("null", function (done) {
            fulfilled(dummy).then(function () {
                done();
            }, null);
        });

        specify("false", function (done) {
            fulfilled(dummy).then(function () {
                done();
            }, false);
        });

        specify("5", function (done) {
            fulfilled(dummy).then(function () {
                done();
            }, 5);
        });

        specify("{}", function (done) {
            fulfilled(dummy).then(function () {
                done();
            }, {});
        });
    });
});
