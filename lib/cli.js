#!/usr/bin/env node
"use strict";

var path = require("path");
var programmaticRunner = require("./programmaticRunner");

var filePath = getAdapterFilePath();
var adapter = adapterObjectFromFilePath(filePath);
var mochaOpts = getMochaOpts();
programmaticRunner(adapter, mochaOpts, function (err) {
    if (err) {
        process.exit(err.failures || -1);
    }
});

function getAdapterFilePath() {
    if (process.argv[2]) {
        return path.join(process.cwd(), process.argv[2]);
    } else {
        throw new Error("Specify your adapter file as an argument.");
    }
}

function getMochaOpts() {
    var rawOpts = process.argv.slice(3);
    var opts = {};

    rawOpts.join(" ").split("--").forEach(function (opt) {
        var optSplit = opt.split(" ");

        var key = optSplit[0];
        var value = optSplit[1] === "" ? true : optSplit[1];

        if (key) {
            opts[key] = value;
        }
    });

    return opts;
}

function adapterObjectFromFilePath(filePath) {
    try {
        return require(filePath);
    } catch (e) {
        var error = new Error("Error `require`ing adapter file " + filePath + "\n\n" + e);
        error.cause = e;

        throw error;
    }
}
