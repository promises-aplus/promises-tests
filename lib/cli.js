#!/usr/bin/env node
"use strict";

let path = require("path");
let getMochaOpts = require("./getMochaOpts");
let programmaticRunner = require("./programmaticRunner");

let filePath = getAdapterFilePath();
let adapter = adapterObjectFromFilePath(filePath);
let mochaOpts = getMochaOpts(process.argv.slice(3));
programmaticRunner(adapter, mochaOpts, function (err) {
    if (err) {
        process.exit(err.failure_count || -1);
    }
});

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
        let error = new Error("Error `require`ing adapter file " + filePath + "\n\n" + e);
        error.cause = e;

        throw error;
    }
}
