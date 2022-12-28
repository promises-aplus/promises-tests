"use strict";

/** @typedef { { resolved?: ( value: T ) => Promise<T>, rejected?: ( reason: any ) => Promise<never>, deferred: <U=T>() => PromisesAPlusTests.Deferred<U> } } PromisesAPlusTests.Adapter  @template T */
/** @typedef { ( error?: PromisesAPlusTests.TestError ) => void                                                                                             } PromisesAPlusTests.Callback             */
/** @typedef { { promise: Promise<T>, resolve: (  value: T   ) => void, reject:  ( reason: any ) => void, }                                                 } PromisesAPlusTests.Deferred @template T */
/** @typedef { ( PromisesAPlusTests.TesterWithOptions | PromisesAPlusTests.TesterWithoutOptions ) & PromisesAPlusTests.MochaTester                          } PromisesAPlusTests.Export               */
/** @typedef { { failure_count?: number }                                                                                                                   } PromisesAPlusTests.MaybeFailureCount    */
/** @typedef { { mocha: PromisesAPlusTests.MochaTestMethod }                                                                                                } PromisesAPlusTests.MochaTester          */
/** @typedef { ( implementation: PromisesAPlusTests.Adapter<any>                                                           ) => void                        } PromisesAPlusTests.MochaTestMethod      */
/** @typedef { PromisesAPlusTests.TesterWithOptions & PromisesAPlusTests.TesterWithoutOptions                                                               } PromisesAPlusTests.Tester               */
/** @typedef { Error & PromisesAPlusTests.MaybeFailureCount                                                                                                 } PromisesAPlusTests.TestError            */
/** @typedef { ( implementation: PromisesAPlusTests.Adapter<any>, mochaOptions: any, callback?: PromisesAPlusTests.Callback ) => void                       } PromisesAPlusTests.TesterWithOptions    */
/** @typedef { ( implementation: PromisesAPlusTests.Adapter<any>,                    callback?: PromisesAPlusTests.Callback ) => void                       } PromisesAPlusTests.TesterWithoutOptions */

let Mocha = require("mocha");
let path = require("path");
let fs = require("fs");
let _ = require("underscore");

let testsDir = path.resolve(__dirname, "tests");

/** @type { (adapter: PromisesAPlusTests.Adapter<any>) => void } */
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
			/** @type { PromisesAPlusTests.Deferred<never> } */
			let d = adapter.deferred();
			d.reject(reason);
			return d.promise;
		};
	}
}

/** @type { PromisesAPlusTests.Export } */
function PromisesAPlusTests (
	/** @type { PromisesAPlusTests.Adapter<any> } */
	adapter,
	/** @type { any | PromisesAPlusTests.Callback } */
	mocha_options_or_callback,
	/** @type { PromisesAPlusTests.Callback | void } */
	callback_or_omitted,
) {
	let mochaOpts = {}
	/** @type { PromisesAPlusTests.Callback } */
	let cb = function () { };
	if( mocha_options_or_callback && typeof mocha_options_or_callback !== "function" ) {
		mochaOpts = mocha_options_or_callback;
		if( typeof callback_or_omitted === "function" ) {
			cb = callback_or_omitted;
		}
	} else if ( typeof mocha_options_or_callback === "function" ) {
		cb = mocha_options_or_callback
	}

	normalizeAdapter(adapter);
	mochaOpts = _.defaults(mochaOpts, { timeout: 200, slow: Infinity });

	fs.readdir( testsDir, (err, testFileNames) => {
		if (err) {
			cb(err);
			return;
		}

		let mocha = new Mocha(mochaOpts);
		testFileNames.forEach( (testFileName) => {
			if( path.extname(testFileName) === ".js" ) {
				let testFilePath = path.resolve( testsDir, testFileName );
				mocha.addFile(testFilePath);
			}
		});

		global.adapter = adapter;
		mocha.run( (failures) => {
			delete global.adapter;
			if (failures > 0) {
				/** @type { PromisesAPlusTests.TestError } */
				let err = new Error("Test suite failed with " + failures + " failures.");
				err.failure_count = failures;
				cb(err);
			} else {
				cb();
			}
		} );
	} );
};

/** @type { PromisesAPlusTests.MochaTestMethod } */
PromisesAPlusTests.mocha = function mocha(adapter) {
	normalizeAdapter(adapter);
	global.adapter = adapter;
	require("./testFiles");
	delete global.adapter;
};

/** @type { PromisesAPlusTests.Export } */
module.exports = PromisesAPlusTests
