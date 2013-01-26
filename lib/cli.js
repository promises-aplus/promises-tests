#!/usr/bin/env node
"use strict";

var path = require("path");
var programmaticRunner = require("./programmaticRunner");

var filePath = getAdapterFilePath();
var adapter = adapterObjectFromFilePath(filePath);

function runTests(adapter) {
	programmaticRunner(adapter, function (err) {
		if (err) {
			process.exit(err.failures || -1);
		}
	});
}

if (typeof(adapter) === "function") {
	adapter(runTests);
} else {
	runTests(adapter);
}

function getAdapterFilePath() {
    if (process.argv[2]) {
        return path.join(process.cwd(), process.argv[2]);
    } else {
        throw new Error("Specify your adapter file as an argument.");
    }
}

function adapterObjectFromFilePath(filePath) {
    try {
        return require(filePath);
    } catch (e) {
        throw new Error("Error `require`ing adapter file " + filePath);
    }
}
