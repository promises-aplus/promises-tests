/**
 * This module provides default implementations of fulfilled(value)
 * and rejected(reason) methods that delegate to pending().  Test
 * adapters need only implement pending(), but may choose to provide
 * specialized implementations of fulfilled(value) and rejected(reason)
 * if they want.
 */
"use strict";

exports.fulfilled = function (value) {
	var pending = this.pending();
	pending.fulfill(value);
	return pending.promise;
};

exports.rejected = function (reason) {
	var pending = this.pending();
	pending.reject(reason);
	return pending.promise;
};