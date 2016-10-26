/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/loader-markup.html!strip');

	require('bootstrap');
	require('fuelux/loader');

	module('Fuel UX Loader');

	test('should be defined on jquery object', function () {
		ok($().loader(), 'loader method is defined');
	});

	test('should return element', function () {
		var $loader = $(html);
		ok($loader.loader() === $loader, 'loader is initialized');
	});

	test("should destroy control", function () {
		var $el = $(html);

		equal(typeof( $el.loader('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
