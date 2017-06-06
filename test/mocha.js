/* global describe:false, it:false, before:false, after:false */

/* mocha tests for Niffy go here */

var should = require('chai').should();
var Niffy = require('niffy');
describe('Segment App', function () {
	var basehost = 'http://localhost:8000/test/regression';
	var testhost = 'http://localhost:8013/test/regression';
	var niffy;
	before(function instantiateNiffy () {
		niffy = new Niffy(basehost, testhost, { show: true, threshold: 0 });
	});
	after(function* () {
		yield niffy.end();
	});

	/**
	 * Logged in.
	 */
	describe('Logged In', function () {
		/**
		 * Top level.
		 */
		it('/checkbox.html', function* () {
			yield niffy.test('/checkbox.html');
		});
	});
});
