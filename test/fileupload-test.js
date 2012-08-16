/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/fileupload'], function($) {

	module("FuelUX fileupload");

	test("should be defined on jquery object", function () {
		ok($(document.body).fileupload, 'fileupload method is defined');
	});

	test("should return element", function () {
		ok($(document.body).fileupload()[0] === document.body, 'document.body returned');
	});	

});