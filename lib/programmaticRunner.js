"use strict";

var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");

var testsDir = path.resolve(__dirname, "tests");

function normalizeAdapter(adapter) {
    if (!adapter.fulfilled) {
        adapter.fulfilled = function (value) {
            var tuple = adapter.pending();
            tuple.fulfill(value);
            return tuple.promise;
        };
    }

    if (!adapter.rejected) {
        adapter.rejected = function (reason) {
            var tuple = adapter.pending();
            tuple.reject(reason);
            return tuple.promise;
        };
    }
}

module.exports = function (adapter, cb) {
    if (typeof cb !== "function") {
        cb = function () { };
    }

    normalizeAdapter(adapter);

    fs.readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        var mocha = new Mocha({ reporter: "spec", timeout: 200, slow: Infinity });
        testFileNames.forEach(function (testFileName) {
            if (path.extname(testFileName) === ".js") {
                var testFilePath = path.resolve(testsDir, testFileName);
                mocha.addFile(testFilePath);
            }
        });

        global.adapter = adapter;
        mocha.run(function (failures) {
            delete global.adapter;
            if (failures > 0) {
                var err = new Error("Test suite failed with " + failures + " failures.");
                err.failures = failures;
                cb(err);
            } else {
                cb(null);
            }
        });
    });
};

module.exports.mocha = function (adapter) {
    normalizeAdapter(adapter);

    global.adapter = adapter;

    var testFileNames = fs.readdirSync(testsDir);
    testFileNames.forEach(function (testFileName) {
        if (path.extname(testFileName) === ".js") {
            var testFilePath = path.resolve(testsDir, testFileName);
            require(testFilePath);
        }
    });

    delete global.adapter;
};
