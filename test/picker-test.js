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

		$picker.find('.picker-field').focus();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$('body').click();
		equal($picker.hasClass('showing'), false, 'picker hides when appropriate');

		$picker.find('.picker-trigger').focus();
		equal($picker.hasClass('showing'), true, 'picker shows when appropriate');

		$picker.remove();
	});

	test('should behave as expected - textarea', function(){
		var $picker = $(html).find('#picker2');

		$picker.picker();
		$picker.on('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});
		$('body').append($picker);

		$picker.find('textarea').focus();
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
			equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
		});
		$picker.on('cancelled.fu.picker', function(e, helpers){
			ok(1===1, 'cancel event triggers on cancel');
			equal(typeof e, 'object', 'event object passed in cancel event');
			equal(typeof helpers, 'object', 'helpers object passed in cancel event');
			equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
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
				equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
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
				equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
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

	test('externalClickAction option should work as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.picker({
			externalClickAction: 'accepted'
		});

		$picker.find('input').focus().focus().val('test');
		$('body').click();
		equal($picker.find('input').val(), 'test', 'desired externalClickAction triggered on external click');
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

	test('revertOnCancel option should work as expected', function(){
		var $picker;

		var setup = function(revert){
			$picker = $(html).find('#picker1');
			$('body').append($picker);
			$picker.find('input').val('test');
			$picker.picker({
				revertOnCancel: revert
			});
			$picker.find('input').focus().focus().val('blah blah blah');
			$picker.find('.picker-cancel').click();
		};

		setup(true);
		equal($picker.find('input').val(), 'test', 'value reverted when set to true');
		$picker.remove();

		setup(false);
		equal($picker.find('input').val(), 'blah blah blah', 'value not reverted when set to false');
		$picker.remove();
	});

	test('getValue method should function as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.find('input').val('test');
		$picker.picker();

		equal($picker.picker('getValue'), 'test', 'getValue working as expected');
	});

	test('setValue method should function as expected', function(){
		var $picker = $(html).find('#picker1');

		$picker.find('input').val('test');
		$picker.picker();

		$picker.picker('setValue', 'bloop');
		equal($picker.picker('getValue'), 'bloop', 'setValue working as expected');
	});

	test('should disable/enable as expected', function(){
		var $picker = $(html).find('#picker1');
		var $field = $picker.find('.picker-field');

		$picker.picker('disable');
		equal($picker.hasClass('disabled'), true, 'disabled class properly added to element');
		equal($field.attr('disabled'), 'disabled', 'disabled attribute properly added to field');

		$picker.picker('enable');
		equal($picker.hasClass('disabled'), false, 'disabled class properly removed from element');
		equal($field.attr('disabled'), undefined, 'disabled attribute properly removed from field');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#picker1');

		equal(typeof( $el.picker('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
