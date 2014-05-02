/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/placard-markup.html');

	require('bootstrap');
	require('fuelux/placard');

	module("Fuel UX Placard");

	test("should be defined on jquery object", function () {
		ok($(html).find('#placard1').placard(), 'placard method is defined');
	});

	test("should return element", function () {
		var $placard = $(html).find('#placard1');
		ok($placard.pillbox() === $placard, 'placard should be initialized');
	});

});
