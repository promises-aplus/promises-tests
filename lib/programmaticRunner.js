"use strict";

var Mocha = require("mocha");
var path = require("path");

module.exports = function (adapter, tests, cb) {
    tests = tests === undefined ? ["promises-a"] : tests;

    var mocha = new Mocha({ reporter: "spec" });
    tests.forEach(function (testName) {
        var testFileName = path.resolve(__dirname, "tests", testName + ".js");
        mocha.addFile(testFileName);
    });

    global.adapter = adapter;
    mocha.run(function () {
        delete global.adapter;

        if (typeof cb === "function") {
            cb.apply(null, arguments);
        }
    });
};
