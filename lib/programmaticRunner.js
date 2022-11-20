"use strict";

/** @typedef { { resolved?: ( value: T ) => Promise<T>, rejected?: ( reason: any ) => Promise<never>, deferred: <U=T>() => PromisesAPlusTests.Deferred<U> } } PromisesAPlusTests.Adapter  @template T */
/** @typedef { ( error?: PromisesAPlusTests.TestError ) => void                                                                                             } PromisesAPlusTests.Callback             */
/** @typedef { { promise: Promise<T>, resolve: (  value: T   ) => void, reject:  ( reason: any ) => void, }                                                 } PromisesAPlusTests.Deferred @template T */
/** @typedef { ( PromisesAPlusTests.TesterWithOptions | PromisesAPlusTests.TesterWithoutOptions ) & PromisesAPlusTests.MochaTester                          } PromisesAPlusTests.Export               */
/** @typedef { { failure_count?: number }                                                                                                                   } PromisesAPlusTests.MaybeFailureCount    */
/** @typedef { { mocha: PromisesAPlusTests.MochaTestMethod }                                                                                                } PromisesAPlusTests.MochaTester          */
/** @typedef { ( impormentation: PromisesAPlusTests.Adapter<any>                                                           ) => void                        } PromisesAPlusTests.MochaTestMethod      */
/** @typedef { PromisesAPlusTests.TesterWithOptions & PromisesAPlusTests.TesterWithoutOptions                                                               } PromisesAPlusTests.Tester               */
/** @typedef { Error & PromisesAPlusTests.MaybeFailureCount                                                                                                 } PromisesAPlusTests.TestError            */
/** @typedef { ( implementation: PromisesAPlusTests.Adapter<any>, mochaOptions: any, callback?: PromisesAPlusTests.Callback ) => void                       } PromisesAPlusTests.TesterWithOptions    */
/** @typedef { ( implementation: PromisesAPlusTests.Adapter<any>,                    callback?: PromisesAPlusTests.Callback ) => void                       } PromisesAPlusTests.TesterWithoutOptions */

let mocha_constructor = require("mocha");
let path = require("path");
let fs = require("fs");
let _ = require("underscore");

let testsDir = path.resolve(__dirname, "tests");

function normalizeAdapter(adapter) {
    if (!adapter.resolved) {
        adapter.resolved = function (value) {
            let d = adapter.deferred();
            d.resolve(value);
            return d.promise;
        };
    }

    if (!adapter.rejected) {
        adapter.rejected = function (reason) {
            let d = adapter.deferred();
            d.reject(reason);
            return d.promise;
        };
    }
}

/** @type { PromisesAPlusTests.Export } */
let promisesAPlusTests = function (
    /** @type { PromisesAPlusTests.Adapter<any> } */
    adapter,
    /** @type { any | PromisesAPlusTests.Callback } */
    mochaOpts_or_callback,
    /** @type { PromisesAPlusTests.Callback | void } */
    callback_or_omitted,
) {
    let mochaOpts = {}
    /** @type { PromisesAPlusTests.Callback } */
    let cb = function () { };
    if( mochaOpts_or_callback && typeof mochaOpts_or_callback !== "function" ) {
        mochaOpts = mochaOpts_or_callback;
        if( typeof callback_or_omitted === "function" ) {
            cb = callback_or_omitted;
        }
    } else if ( typeof mochaOpts_or_callback === "function" ) {
        cb = mochaOpts_or_callback
    }

    normalizeAdapter(adapter);
    mochaOpts = _.defaults(mochaOpts, { timeout: 200, slow: Infinity });

    fs.readdir(testsDir, function (err, testFileNames) {
        if (err) {
            cb(err);
            return;
        }

        let mocha = new mocha_constructor(mochaOpts);
        testFileNames.forEach(function (testFileName) {
            if (path.extname(testFileName) === ".js") {
                let testFilePath = path.resolve(testsDir, testFileName);
                mocha.addFile(testFilePath);
            }
        });

        global.adapter = adapter;
        mocha.run(function (failures) {
            delete global.adapter;
            if (failures > 0) {
                /** @type { PromisesAPlusTests.TestError } */
                let err = new Error("Test suite failed with " + failures + " failures.");
                err.failure_count = failures;
                cb(err);
            } else {
                cb();
            }
        });
    });
};

/** @type { PromisesAPlusTests.MochaTestMethod } */
promisesAPlusTests.mocha = function (adapter) {
    normalizeAdapter(adapter);

    global.adapter = adapter;

    require("./testFiles");
    // let testfiles = "./testFiles.js";
    // if( fs.existsSync(testfiles) ) {
    //     require( testfiles );
    // } else {
    //     throw new Error( `Missing required file ${testfiles}` )
    // }

    delete global.adapter;
};

/** @type { PromisesAPlusTests.Export } */
module.exports = promisesAPlusTests
