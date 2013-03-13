"use strict";

var adapter = global.adapter;
var fulfilled = adapter.fulfilled;
var rejected = adapter.rejected;
var pending = adapter.pending;

exports.fulfilled = {
    "a synchronously-fulfilled custom thenable": function (value) {
        return {
            then: function (onFulfilled) {
                onFulfilled(value);
            }
        };
    },

    "an asynchronously-fulfilled custom thenable": function (value) {
        return {
            then: function (onFulfilled) {
                setTimeout(function () {
                    onFulfilled(value);
                }, 0);
            }
        };
    },

    "an already-fulfilled promise": function (value) {
        return fulfilled(value);
    },

    "an eventually-fulfilled promise": function (value) {
        var tuple = pending();
        setTimeout(function () {
            tuple.fulfill(value);
        }, 50);
        return tuple.promise;
    }
};

exports.rejected = {
    "a synchronously-rejected custom thenable": function (reason) {
        return {
            then: function (onFulfilled, onRejected) {
                onRejected(reason);
            }
        };
    },

    "an asynchronously-rejected custom thenable": function (reason) {
        return {
            then: function (onFulfilled, onRejected) {
                setTimeout(function () {
                    onRejected(reason);
                }, 0);
            }
        };
    },

    "an already-rejected promise": function (reason) {
        return rejected(reason);
    },

    "an eventually-rejected promise": function (reason) {
        var tuple = pending();
        setTimeout(function () {
            tuple.reject(reason);
        }, 50);
        return tuple.promise;
    }
};

// TODO add pathalogical versions; they still fit in these categories e.g. throw -> rejected, resolve() resolve() -> fulfill.
