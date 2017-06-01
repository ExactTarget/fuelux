/* global describe:false, it:false */

/* mocha tests for Niffy go here */

var assert = require('assert');
describe('Array', function testArray () {
	describe('#indexOf()', function testIndexOf () {
		it('should return -1 when the value is not present', function testReturn () {
			assert.equal(-1, [1, 2, 3].indexOf(4));
		});
	});
});
