/* global describe:false, it:false, before:false, after:false */

/* mocha tests for Niffy go here */

var should = require('chai').should();
var Niffy = require('niffy');
describe('Segment App', function () {
	var basehost = 'http://fuelux-edge.herokuapp.com/';
	var testhost = 'http://localhost:8000/';
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
		it('/', function* () {
			yield niffy.test('/');
		});
	});
});
