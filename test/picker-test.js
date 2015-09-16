/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/picker-markup.html!strip');

	require('bootstrap');
	require('fuelux/picker');

	module('Fuel UX Picker');

	// TODO: add shown/hidden event test

	test('should be defined on jquery object', function () {
		ok($().find('#picker1').picker(), 'picker method is defined');
	});

	test('should return element', function () {
		var $picker = $(html).find('#picker1');
		ok($picker.picker() === $picker, 'picker should be initialized');
	});

	test('should behave as expected - input', function(){
		var $picker = $(html).find('#picker1');

		$('body').append($picker);
		$picker.picker();
		$picker.on('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});

		console.log($picker.find('.picker-trigger'));

		var $textInputTrigger = $($picker.find('.picker-trigger')[0]);
		var $otherTrigger = $($picker.find('.picker-trigger')[1]);
		$textInputTrigger.focus().focus();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$('body').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');

		$textInputTrigger.click();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$textInputTrigger.click();
		equal($picker.hasClass('showing'), true, 'picker continues showing when text input clicked and picker is already showing');

		$otherTrigger.click();
		equal($picker.hasClass('showing'), false, 'picker hides when non-text input clicked and picker is already showing');

		$picker.remove();
	});

	test('should behave as expected - button', function(){
		var $picker = $(html).find('#picker2');

		$picker.picker();
		$picker.on('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});
		$('body').append($picker);

		$($picker.find('.picker-trigger')[1]).focus();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$('body').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
		$picker.remove();
	});

	test('show/hide functions should behave as expected', function(){
		var $picker = $(html).find('#picker1');
		$picker.picker();

		$picker.picker('show');
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$picker.picker('hide');
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');
	});

	test('trigger events should fire as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.picker();
		$picker.on('accepted.fu.picker', function(e, helpers){
			ok(1===1, 'accept event triggers on accept');
			equal(typeof e, 'object', 'event object passed in accept event');
			equal(typeof helpers, 'object', 'helpers object passed in accept event');
			equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
		});
		$picker.on('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'cancel event triggers on cancel');
			equal(typeof e, 'object', 'event object passed in cancel event');
			equal(typeof helpers, 'object', 'helpers object passed in cancel event');
			equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
		});

		$picker.find('input').focus().focus();
		$picker.find('.picker-cancel').click();
		$picker.find('input').focus().focus();
		$picker.find('.picker-accept').click();
	});

	test('onAccept function should be called as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.picker({
			onAccept: function(helpers){
				ok(1===1, 'onAccept function called on accept');
				equal(typeof helpers, 'object', 'helpers object passed to onAccept function');
				equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$picker.picker('hide');
			}
		});

		$picker.find('input').focus().focus();
		$picker.find('.picker-accept').click();
	});

	test('onCancel function should be called as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.picker({
			onCancel: function(helpers){
				ok(1===1, 'onCancel function called on cancel');
				equal(typeof helpers, 'object', 'helpers object passed to onCancel function');
				equal((helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$picker.picker('hide');
			}
		});

		$picker.find('input').focus().focus();
		$picker.find('.picker-cancel').click();
	});

	test('Enter and exit keys should trigger appropriate response', function(){
		var $picker = $(html).find('#picker1');
		var $input  = $picker.find('input');
		var e = $.Event("keydown");

		$picker.picker({
			onAccept: function(){
				ok(1===1, 'onAccept function called when enter keypress');
			},
			onCancel: function(){
				ok(1===1, 'onCancel function called when exit keypress');
			}
		});

		e.keyCode = 13;
		$input.trigger(e);
		e.keyCode = 27;
		$input.trigger(e);
	});


	test('externalClickExceptions option should work as expected', function(){
		var $picker = $(html).find('#picker1');

		$('body').append('<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>');
		$('body').append($picker);
		$picker.picker({
			externalClickExceptions: ['.test', '#test']
		});

		$picker.find('input').focus().focus();
		$('#test').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for specified id');
		$('.test').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for specified class');
		$('.innerTest').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored for child of specified selector');

		$picker.remove();
		$('.test,#test').remove();
	});

	test('explicit option should work as expected', function(){
		var $picker = $(html).find('#picker1');

		$('body').append($picker);
		$picker.picker({
			explicit: true
		});

		$picker.find('input').focus().focus();
		$('body').click();
		equal($picker.hasClass('showing'), true, 'externalClick ignored due to not being an explicit accept/cancel action');
		$picker.find('.picker-accept').click();
		equal($picker.hasClass('showing'), false, 'picker not showing after explicit action');

		$picker.remove();
	});

	test('should disable/enable as expected', function(){
		var $picker = $(html).find('#picker1');
		var $trigger = $picker.find('.picker-trigger');

		$picker.picker('disable');
		equal($picker.hasClass('disabled'), true, 'disabled class properly added to element');
		equal($trigger.attr('disabled'), 'disabled', 'disabled attribute properly added to trigger');

		$picker.picker('enable');
		equal($picker.hasClass('disabled'), false, 'disabled class properly removed from element');
		equal($trigger.attr('disabled'), undefined, 'disabled attribute properly removed from trigger');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#picker1');

		equal(typeof( $el.picker('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
