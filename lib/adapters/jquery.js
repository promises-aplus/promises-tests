"use strict";

global.window = require("jsdom").jsdom().createWindow();
var $ = require("jquery-browserify");

exports.fulfilled = function (value) {
    var deferred = $.Deferred();
    deferred.resolve(value);
    return deferred.promise();
};

exports.rejected = function (reason) {
    var deferred = $.Deferred();
    deferred.reject(reason);
    return deferred.promise();
};

exports.pending = function () {
    var deferred = $.Deferred();

    return {
        promise: deferred.promise(),
        fulfill: deferred.resolve.bind(deferred),
        reject: deferred.reject.bind(deferred)
    };
};
