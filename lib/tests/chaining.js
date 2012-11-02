"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var other = {}; // a dummy value we don't want to be strict equal to
var sentinel = {}; // a sentinel fulfillment value to test for with strict equality

describe("Chaining off of a fulfilled promise", function () {
    describe("when the first fulfillment callback returns a new value", function () {
        it("should call the second fulfillment callback with that new value", function (done) {
            fulfilled(other).then(function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });

    describe("when the first fulfillment callback throws an error", function () {
        it("should call the second rejection callback with that error as the reason", function (done) {
            fulfilled(other).then(function () {
                throw sentinel;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });

    describe("with only a rejection callback", function () {
        it("should call the second fulfillment callback with the original value", function (done) {
            fulfilled(sentinel).then(null, function () {
                return other;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });
});

describe("Chaining off of a rejected promise", function () {
    describe("when the first rejection callback returns a new value", function () {
        it("should call the second fulfillment callback with that new value", function (done) {
            rejected(other).then(null, function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });

    describe("when the first rejection callback throws a new reason", function () {
        it("should call the second rejection callback with that new reason", function (done) {
            rejected(other).then(null, function () {
                throw sentinel;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });

    describe("when there is only a fulfillment callback", function () {
        it("should call the second rejection callback with the original reason", function (done) {
            rejected(sentinel).then(function () {
                return other;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });
});

describe("Chaining off of an eventually-fulfilled promise", function () {
    describe("when the first fulfillment callback returns a new value", function () {
        it("should call the second fulfillment callback with that new value", function (done) {
            var tuple = pending();
            tuple.promise.then(function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(other);
            }, 10);
        });
    });

    describe("when the first fulfillment callback throws an error", function () {
        it("should call the second rejection callback with that error as the reason", function (done) {
            var tuple = pending();
            tuple.promise.then(function () {
                throw sentinel;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(other);
            }, 10);
        });
    });

    describe("with only a rejection callback", function () {
        it("should call the second fulfillment callback with the original value", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function () {
                return other;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(sentinel);
            }, 10);
        });
    });
});

describe("Chaining off of an eventually-rejected promise", function () {
    describe("when the first rejection callback returns a new value", function () {
        it("should call the second fulfillment callback with that new value", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function () {
                return sentinel;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(other);
            }, 10);
        });
    });

    describe("when the first rejection callback throws a new reason", function () {
        it("should call the second rejection callback with that new reason", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function () {
                throw sentinel;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(other);
            }, 10);
        });
    });

    describe("when there is only a fulfillment callback", function () {
        it("should call the second rejection callback with the original reason", function (done) {
            var tuple = pending();
            tuple.promise.then(function () {
                return other;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(sentinel);
            }, 10);
        });
    });
});
