/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux'], function($) {

	module("FuelUX combobox");

	test("should be defined on jquery object", function () {
		ok($(document.body).combobox, 'combobox method is defined');
	});

	test("should return element", function () {
		ok($(document.body).combobox()[0] === document.body, 'document.body returned');
	});

	test("should contain clicked item text", function () {
		var comboboxHTML = '<div>' +
			'<input type="text">' +
			'<a href="#">Action</a>' +
			'<a href="#">Another action</a>' +
			'<a href="#">Something else here</a>' +
		'</div>';

		var $combobox = $(comboboxHTML).combobox();
		
		$combobox.find('a').eq(1).click();
	
		equal($combobox.find('input').val(), 'Another action', 'input contains clicked item text');
	});

});