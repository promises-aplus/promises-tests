"use strict";

var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");
var _ = require("underscore");

function normalizeAdapter(adapter) {
    if (!adapter.resolved) {
        adapter.resolved = function (value) {
            var d = adapter.deferred();
            d.resolve(value);
            return d.promise;
        };
    }

    if (!adapter.rejected) {
        adapter.rejected = function (reason) {
            var d = adapter.deferred();
            d.reject(reason);
            return d.promise;
        };
    }
}

module.exports = function (adapter, mochaOpts, cb) {
    if (typeof mochaOpts === "function") {
        cb = mochaOpts;
        mochaOpts = {};
    }
    if (typeof cb !== "function") {
        cb = function () { };
    }

    normalizeAdapter(adapter);
    mochaOpts = _.defaults(mochaOpts, { timeout: 200, slow: Infinity });
    var testFileNames = [
        "./tests/2.1.2",
        "./tests/2.1.3",
        "./tests/2.2.1",
        "./tests/2.2.2",
        "./tests/2.2.3",
        "./tests/2.2.4",
        "./tests/2.2.5",
        "./tests/2.2.6",
        "./tests/2.2.7",
        "./tests/2.3.1",
        "./tests/2.3.2",
        "./tests/2.3.3",
        "./tests/2.3.7",
    ];


    var mocha = new Mocha(mochaOpts);
    testFileNames.forEach(function (testFileName) {
        if (path.extname(testFileName) === ".js") {
            var testFilePath = path.resolve(__dirname, testFileName);
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
};

module.exports.mocha = function (adapter) {
    normalizeAdapter(adapter);

    global.adapter = adapter;

    require("./tests/2.1.2");
    require("./tests/2.1.3");
    require("./tests/2.2.1");
    require("./tests/2.2.2");
    require("./tests/2.2.3");
    require("./tests/2.2.4");
    require("./tests/2.2.5");
    require("./tests/2.2.6");
    require("./tests/2.2.7");
    require("./tests/2.3.1");
    require("./tests/2.3.2");
    require("./tests/2.3.3");
    require("./tests/2.3.4");

    delete global.adapter;
};
