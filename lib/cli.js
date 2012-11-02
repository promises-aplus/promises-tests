#!/usr/bin/env node
"use strict";

var path = require("path");
var readline = require("readline");
var programmaticRunner = require("./programmaticRunner");

var rl = readline.createInterface(process.stdin, process.stdout);
var exitWithError = process.exit.bind(process, 1);

getAdapter(function (adapter) {
    rl.close();
    programmaticRunner(adapter);
});

function getAdapter(cb) {
    if (process.argv[2]) {
        processAdapterInput(process.argv[2], exitWithError, cb);
        return;
    }

    rl.question("Adapter file name: ", function (result) {
        var retry = getAdapter.bind(null, cb);
        processAdapterInput(result, retry, cb);
    });
}

function processAdapterInput(input, failAction, successAction) {
    var adapter;
    var filePath = path.join(process.cwd(), input);
    try {
        adapter = require(filePath);
    } catch (e) {
        console.error("Error `require`ing adapter file " + filePath + "\n");
        failAction();
        return;
    }

    successAction(adapter);
}
