/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/loader-markup.html');

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

	asyncTest('should play on init', function(){
		var $loader = $(html);

		$loader.loader();
		setTimeout(function(){
			start();
			ok($loader.attr('data-frame')!==1, 'loader playing on init');
		}, 160);
	});

	asyncTest('pause should function as expected', function(){
		var $loader = $(html);

		$loader.loader();
		$loader.loader('pause');
		setTimeout(function(){
			start();
			equal($loader.attr('data-frame'), 1, 'pause halts frame progression');
		}, 160);
	});

	asyncTest('play should function as expected', function(){
		var $loader = $(html);

		$loader.loader();
		$loader.loader('pause');
		$loader.loader('play');
		setTimeout(function(){
			start();
			ok($loader.attr('data-frame')!==1, 'play continues frame progression');
		}, 160);
	});

	asyncTest('reset should function as expected', function(){
		var $loader = $(html);

		$loader.loader();
		setTimeout(function(){
			start();
			$loader.loader('reset');
			equal($loader.attr('data-frame'), 1, 'reset reverts frame to beginning');
		}, 160);
	});

	test('next should function as expected', function(){
		var $loader = $(html);

		$loader.loader();
		$loader.loader('pause');
		$loader.loader('next');

		equal($loader.attr('data-frame'), 2, 'next increments frame by 1');
	});

	test('prev should function as expected', function(){
		var $loader = $(html);

		$loader.loader();
		$loader.loader('pause');
		$loader.loader('next');
		$loader.loader('previous');

		equal($loader.attr('data-frame'), 1, 'prev decrements frame by 1');
	});

	test("should destroy control", function () {
		var $el = $(html);

		equal(typeof( $el.loader('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
