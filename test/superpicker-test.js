/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/superpicker-markup.html!strip');

	require('bootstrap');
	require('fuelux/superpicker');

	module('Fuel UX Superpicker');

	// TODO: add shown/hidden event test

	test('should be defined on jquery object', function () {
		ok($().find('#superpicker1').superpicker(), 'superpicker method is defined');
	});

	test('should return element', function () {
		var $superpicker = $(html).find('#superpicker1');
		ok($superpicker.superpicker() === $superpicker, 'superpicker should be initialized');
	});

	test('should behave as expected - input', function(){
		var $superpicker = $(html).find('#superpicker1');

		$('body').append($superpicker);
		$superpicker.superpicker();
		$superpicker.on('cancelled.fu.superpicker', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});

		$superpicker.find('.superpicker-field').focus();
		equal($superpicker.hasClass('showing'), true, 'superpicker shows when appropriate');

		$('body').click();
		equal($superpicker.hasClass('showing'), false, 'superpicker hides when appropriate');

		$superpicker.find('.superpicker-trigger').focus();
		equal($superpicker.hasClass('showing'), true, 'superpicker shows when appropriate');

		$superpicker.remove();
	});

	test('should behave as expected - textarea', function(){
		var $superpicker = $(html).find('#superpicker2');

		$superpicker.superpicker();
		$superpicker.on('cancelled.fu.superpicker', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});
		$('body').append($superpicker);

		$superpicker.find('textarea').focus();
		equal($superpicker.hasClass('showing'), true, 'superpicker shows when appropriate');

		$('body').click();
		equal($superpicker.hasClass('showing'), false, 'superpicker hides when appropriate');
		$superpicker.remove();
	});

	test('show/hide functions should behave as expected', function(){
		var $superpicker = $(html).find('#superpicker1');
		$superpicker.superpicker();

		$superpicker.superpicker('show');
		equal($superpicker.hasClass('showing'), true, 'superpicker shows when appropriate');

		$superpicker.superpicker('hide');
		equal($superpicker.hasClass('showing'), false, 'superpicker hides when appropriate');
	});

	test('trigger events should fire as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.superpicker();
		$superpicker.on('accepted.fu.superpicker', function(e, helpers){
			ok(1===1, 'accept event triggers on accept');
			equal(typeof e, 'object', 'event object passed in accept event');
			equal(typeof helpers, 'object', 'helpers object passed in accept event');
			equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
		});
		$superpicker.on('cancelled.fu.superpicker', function(e, helpers){
			ok(1===1, 'cancel event triggers on cancel');
			equal(typeof e, 'object', 'event object passed in cancel event');
			equal(typeof helpers, 'object', 'helpers object passed in cancel event');
			equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
		});

		$superpicker.find('input').focus().focus();
		$superpicker.find('.superpicker-cancel').click();
		$superpicker.find('input').focus().focus();
		$superpicker.find('.superpicker-accept').click();
	});

	test('onAccept function should be called as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.superpicker({
			onAccept: function(helpers){
				ok(1===1, 'onAccept function called on accept');
				equal(typeof helpers, 'object', 'helpers object passed to onAccept function');
				equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$superpicker.superpicker('hide');
			}
		});

		$superpicker.find('input').focus().focus();
		$superpicker.find('.superpicker-accept').click();
	});

	test('onCancel function should be called as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.superpicker({
			onCancel: function(helpers){
				ok(1===1, 'onCancel function called on cancel');
				equal(typeof helpers, 'object', 'helpers object passed to onCancel function');
				equal((helpers.previousValue!==undefined && helpers.contents!==undefined), true, 'helpers object contains correct attributes');
				$superpicker.superpicker('hide');
			}
		});

		$superpicker.find('input').focus().focus();
		$superpicker.find('.superpicker-cancel').click();
	});

	test('Enter and exit keys should trigger appropriate response', function(){
		var $superpicker = $(html).find('#superpicker1');
		var $input  = $superpicker.find('input');
		var e = $.Event("keydown");

		$superpicker.superpicker({
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
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.superpicker({
			externalClickAction: 'accepted'
		});

		$superpicker.find('input').focus().focus().val('test');
		$('body').click();
		equal($superpicker.find('input').val(), 'test', 'desired externalClickAction triggered on external click');
	});

	test('externalClickExceptions option should work as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$('body').append('<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>');
		$('body').append($superpicker);
		$superpicker.superpicker({
			externalClickExceptions: ['.test', '#test']
		});

		$superpicker.find('input').focus().focus();
		$('#test').click();
		equal($superpicker.hasClass('showing'), true, 'externalClick ignored for specified id');
		$('.test').click();
		equal($superpicker.hasClass('showing'), true, 'externalClick ignored for specified class');
		$('.innerTest').click();
		equal($superpicker.hasClass('showing'), true, 'externalClick ignored for child of specified selector');

		$superpicker.remove();
		$('.test,#test').remove();
	});

	test('explicit option should work as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$('body').append($superpicker);
		$superpicker.superpicker({
			explicit: true
		});

		$superpicker.find('input').focus().focus();
		$('body').click();
		equal($superpicker.hasClass('showing'), true, 'externalClick ignored due to not being an explicit accept/cancel action');
		$superpicker.find('.superpicker-accept').click();
		equal($superpicker.hasClass('showing'), false, 'superpicker not showing after explicit action');

		$superpicker.remove();
	});

	test('revertOnCancel option should work as expected', function(){
		var $superpicker;

		var setup = function(revert){
			$superpicker = $(html).find('#superpicker1');
			$('body').append($superpicker);
			$superpicker.find('input').val('test');
			$superpicker.superpicker({
				revertOnCancel: revert
			});
			$superpicker.find('input').focus().focus().val('blah blah blah');
			$superpicker.find('.superpicker-cancel').click();
		};

		setup(true);
		equal($superpicker.find('input').val(), 'test', 'value reverted when set to true');
		$superpicker.remove();

		setup(false);
		equal($superpicker.find('input').val(), 'blah blah blah', 'value not reverted when set to false');
		$superpicker.remove();
	});

	test('getValue method should function as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.find('input').val('test');
		$superpicker.superpicker();

		equal($superpicker.superpicker('getValue'), 'test', 'getValue working as expected');
	});

	test('setValue method should function as expected', function(){
		var $superpicker = $(html).find('#superpicker1');

		$superpicker.find('input').val('test');
		$superpicker.superpicker();

		$superpicker.superpicker('setValue', 'bloop');
		equal($superpicker.superpicker('getValue'), 'bloop', 'setValue working as expected');
	});

	test('should disable/enable as expected', function(){
		var $superpicker = $(html).find('#superpicker1');
		var $field = $superpicker.find('.superpicker-field');

		$superpicker.superpicker('disable');
		equal($superpicker.hasClass('disabled'), true, 'disabled class properly added to element');
		equal($field.attr('disabled'), 'disabled', 'disabled attribute properly added to field');

		$superpicker.superpicker('enable');
		equal($superpicker.hasClass('disabled'), false, 'disabled class properly removed from element');
		equal($field.attr('disabled'), undefined, 'disabled attribute properly removed from field');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#superpicker1');

		equal(typeof( $el.superpicker('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
