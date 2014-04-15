/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var repeaterMarkup = require('text!test/repeater-markup.txt');

	require('bootstrap');
	require('fuelux/repeater');

	module('Fuel UX Repeater', {
		setup: function(){
			this.$markup = $(repeaterMarkup);
		}
	});

	test("should be defined on jquery object", function () {
		ok($(this.$markup).repeater, 'repeater method is defined');
	});

	test("should return element", function () {
		var $repeater = $(this.$markup);
		ok($repeater.repeater() === $repeater, 'repeater should be initialized');
	});
});
