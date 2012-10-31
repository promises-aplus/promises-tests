#!/usr/bin/env node
"use strict";

var path = require("path");
var readline = require("readline");
var programmaticRunner = require("./programmaticRunner");

var rl = readline.createInterface(process.stdin, process.stdout);

var getTestSuites = promptFactory(rl, 2, "Test suite (promises-a or all): ", processTestSuiteInput);
var getAdapter = promptFactory(rl, 3, "Adapter file name: ", processAdapterInput);

getTestSuites(function (suites) {
    getAdapter(function (adapter) {
        rl.close();

        programmaticRunner(adapter, suites);
    });
});


function promptFactory(rl, argvPosition, promptText, processor) {
    var exitWithError = process.exit.bind(process, 1);

    return function prompter(cb) {
        if (process.argv[argvPosition]) {
            processor(process.argv[argvPosition], exitWithError, cb);
            return;
        }

        rl.question(promptText, function (result) {
            var retry = prompter.bind(null, cb);
            processor(result, retry, cb);
        });
    };
}

function processTestSuiteInput(input, failAction, successAction) {
    if (input !== "promises-a" && input !== "all") {
        console.error("Invalid test suite name; must be promises-a or all.\n");
        failAction();
    } else {
        var suites = input === "promises-a" ? ["promises-a"] :
            ["promises-a", "always-async", "resolution-races", "returning-a-promise"];
        successAction(suites);
    }
}

function processAdapterInput(input, failAction, successAction) {
    var adapter;
    var filePath = path.join(process.cwd(), input);
    try {
        adapter = require(filePath);
    } catch (e) {
        console.error("Error `require`ing adapter file " + filePath + "\n");
        failAction();
    }

    if (adapter) {
        successAction(adapter);
    }
}
