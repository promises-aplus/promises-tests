"use strict";

var assert = require("assert");

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

var other = {}; // a dummy value we don't want to be strict equal to
var sentinel = {}; // a sentinel fulfillment value to test for with strict equality

describe("[Extension] Returning a promise from a fulfilled promise's fulfillment callback", function () {
    describe("when the returned promise is fulfilled", function () {
        it("should call the second fulfillment callback with the value", function (done) {
            fulfilled(other).then(function () {
                return fulfilled(sentinel);
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });

    describe("when the returned promise is rejected", function () {
        it("should call the second rejection callback with the reason", function (done) {
            fulfilled(other).then(function () {
                return rejected(sentinel);
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });
});

describe("[Extension] Returning a promise from a rejected promise's rejection callback", function () {
    describe("when the returned promise is fulfilled", function () {
        it("should call the second fulfillment callback with the value", function (done) {
            rejected(other).then(null, function () {
                return fulfilled(sentinel);
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });
        });
    });

    describe("when the returned promise is rejected", function () {
        it("should call the second rejection callback with the reason", function (done) {
            rejected(other).then(null, function () {
                return rejected(sentinel);
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });
        });
    });
});

describe("[Extension] Returning a promise from an eventually-fulfilled promise's fulfillment callback", function () {
    describe("when the returned promise is eventually-fulfilled", function () {
        it("should call the second fulfillment callback with the value", function (done) {
            var tuple = pending();
            tuple.promise.then(function () {
                var tuple2 = pending();
                setTimeout(function () {
                    tuple2.fulfill(sentinel);
                }, 10);
                return tuple2.promise;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(other);
            }, 10);
        });
    });

    describe("when the returned promise is rejected", function () {
        it("should call the second rejection callback with the reason", function (done) {
            var tuple = pending();
            tuple.promise.then(function () {
                var tuple2 = pending();
                setTimeout(function () {
                    tuple2.reject(sentinel);
                }, 10);
                return tuple2.promise;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.fulfill(other);
            }, 10);
        });
    });
});

describe("[Extension] Returning a promise from an eventually-rejected promise's rejection callback", function () {
    describe("when the returned promise is eventually-fulfilled", function () {
        it("should call the second fulfillment callback with the value", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function () {
                var tuple2 = pending();
                setTimeout(function () {
                    tuple2.fulfill(sentinel);
                }, 10);
                return tuple2.promise;
            }).then(function (value) {
                assert.strictEqual(value, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(other);
            }, 10);
        });
    });

    describe("when the returned promise is rejected", function () {
        it("should call the second rejection callback with the reason", function (done) {
            var tuple = pending();
            tuple.promise.then(null, function () {
                var tuple2 = pending();
                setTimeout(function () {
                    tuple2.reject(sentinel);
                }, 10);
                return tuple2.promise;
            }).then(null, function (reason) {
                assert.strictEqual(reason, sentinel);
                done();
            });

            setTimeout(function () {
                tuple.reject(other);
            }, 10);
        });
    });
});
