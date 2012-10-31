"use strict";

var readStream = require("read-stream");
var promiseStream = require("promise-stream");

exports.fulfilled = function (value) {
    var rs = readStream();
    var promise = promiseStream(rs.stream);
    rs.end(value);

    return promise;
};

exports.rejected = function (reason) {
    // Pretty sure this implementation is wrong.

    var rs = readStream();
    var promise = promiseStream(rs.stream);
    rs.stream.emit("error", reason);

    return promise;
};

exports.pending = function () {
    var rs = readStream();
    var promise = promiseStream(rs.stream);

    return {
        promise: promise,
        fulfill: rs.end.bind(rs),
        reject: rs.stream.emit.bind(rs.stream, "error")
    };
};
