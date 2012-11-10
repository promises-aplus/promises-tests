"use strict";

var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");

module.exports = function (adapter, cb) {
    if (typeof cb !== "function") {
        cb = function () { };
    }

    var testsDir = path.resolve(__dirname, "tests");

    fs.readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        var mocha = new Mocha({ reporter: "spec", timeout: 200, slow: Infinity });
        testFileNames.forEach(function (testFileName) {
            var testFilePath = path.resolve(testsDir, testFileName);
            mocha.addFile(testFilePath);
        });

        global.adapter = adapter;
        mocha.run(function (failures) {
            delete global.adapter;
            if (failures > 0) {
                cb(new Error("Test suite failed with " + failures + " failures."));
            }
        });
    });
};
