"use strict";

var Mocha = require("mocha");
var path = require("path");
var fs = require("fs");
var baseAdapter = require("./baseAdapter");

module.exports = function (adapter, cb) {
    if (typeof cb !== "function") {
        cb = function () { };
    }

    adapter = mixinBaseAdapter(adapter);

    var testsDir = path.resolve(__dirname, "tests");

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
                cb(new Error("Test suite failed with " + failures + " failures."));
            }
        });
    });
};

/**
 * Mixin methods from baseAdapter, if not already provided
 * @param  {Object} adapter test adapter
 * @return {Object} adapter, with baseAdapter methods mixed in
 */
function mixinBaseAdapter(adapter) {
    return Object.keys(baseAdapter).reduce(function (adapter, key) {
        if (!(key in adapter) && typeof baseAdapter[key] === "function") {
            // bind() since some tests rely on adapter methods being
            // callable without their context.
            adapter[key] = baseAdapter[key].bind(adapter);
        }

        return adapter;
    }, adapter);
}
