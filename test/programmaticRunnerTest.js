"use strict";

let PromisesAPlusTests = require("../lib/programmaticRunner");


/** Test-compatible Wrapper for a pending standard-library Promise  */
// /** @type { PromisesAPlusTests.Deferred<any> } */
class DeferredPromise {

	/** Instead of passing functions to an executor callback, return them */
	constructor() {
		let __resolver;
		let __rejecter;
		this.promise = new Promise( (resolve,reject) => {
			__resolver = resolve;
			__rejecter = reject;
		} );
		this._resolver = __resolver;
		this._rejecter = __rejecter;
	}

	/** Settles [[promise]] to fulfilled */
	resolve( value ) { this._resolver( value ); }

	/** Settles [[promise]] to rejected */
	reject( reason ) { this._rejecter( reason ); }

}

/** Test-compatible Adapter for standard-library Promise  */
// /** @type { PromisesAPlusTests.Adapter<any> } */
class PromiseAdapter {

	constructor() { throw "Do not instantiate, use the class"; }

	/** Returns a [[Promise]] which has already resolved */
	static resolved(value ) { return new Promise( ( resolve,_reject) => { resolve(value ); } ); };

	/** Returns a [[Promise]] which has already rejected */
	/** @type { ( reason: any ) => Promise<never> } */
	static rejected(reason) { return new Promise( (_resolve, reject) => { reject( reason); } ); };

	/** Returns a [[DeferredPromise]] */
	static deferred(      ) { return new DeferredPromise; };

 }

describe( "Test tests on standard-library Promise", () => {
	PromisesAPlusTests.mocha( PromiseAdapter );
} );
