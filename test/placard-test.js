/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/placard-markup.html!strip');

	require('bootstrap');
	require('fuelux/placard');

	module('Fuel UX Placard');

	// TODO: add shown/hidden event test

	test('should be defined on jquery object', function () {
		ok($().find('#placard1').placard(), 'placard method is defined');
	});

	test('should return element', function () {
		var $placard = $(html).find('#placard1');
		ok($placard.placard() === $placard, 'placard should be initialized');
	});

	test('should behave as expected - input', function(){
		var $placard = $(html).find('#placard1');

		$('body').append($placard);
		$placard.placard();
		$placard.on('cancelled.fu.placard', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});

		$placard.find('input').focus().focus();
		equal($placard.hasClass('showing'), true, 'placard shows when appropriate');

		$('body').click();
		equal($placard.hasClass('showing'), false, 'placard hides when appropriate');
		$placard.remove();
	});

	test('should behave as expected - textarea', function(){
		var $placard = $(html).find('#placard2');

		$placard.placard();
		$placard.on('cancelled.fu.placard', function(e, helpers){
			ok(1===1, 'default action event (cancel) triggered upon external click');
		});
		$('body').append($placard);

		$placard.find('textarea').focus().focus();
		equal($placard.hasClass('showing'), true, 'placard shows when appropriate');

		$('body').click();
		equal($placard.hasClass('showing'), false, 'placard hides when appropriate');
		$placard.remove();
	});

	test('show/hide functions should behave as expected', function(){
		var $placard = $(html).find('#placard1');
		$placard.placard();

		$placard.placard('show');
		equal($placard.hasClass('showing'), true, 'placard shows when appropriate');

		$placard.placard('hide');
		equal($placard.hasClass('showing'), false, 'placard hides when appropriate');
	});

	test('trigger events should fire as expected', function(){
		var $placard = $(html).find('#placard1');

		$placard.placard();
		$placard.on('accepted.fu.placard', function(e, helpers){
			ok(1===1, 'accept event triggers on accept');
			equal(typeof e, 'object', 'event object passed in accept event');
			equal(typeof helpers, 'object', 'helpers object passed in accept event');
			equal((helpers.previousValue!==undefined && helpers.value!==undefined), true, 'helpers object contains correct attributes');
		});
		$placard.on('cancelled.fu.placard', function(e, helpers){
			ok(1===1, 'cancel event triggers on cancel');
			equal(typeof e, 'object', 'event object passed in cancel event');
			equal(typeof helpers, 'object', 'helpers object passed in cancel event');
			equal((helpers.previousValue!==undefined && helpers.value!==undefined), true, 'helpers object contains correct attributes');
		});

		$placard.find('input').focus().focus();
		$placard.find('.placard-cancel').click();
		$placard.find('input').focus().focus();
		$placard.find('.placard-accept').click();
	});

	test('onAccept function should be called as expected', function(){
		var $placard = $(html).find('#placard1');

		$placard.placard({
			onAccept: function(helpers){
				ok(1===1, 'onAccept function called on accept');
				equal(typeof helpers, 'object', 'helpers object passed to onAccept function');
				equal((helpers.previousValue!==undefined && helpers.value!==undefined), true, 'helpers object contains correct attributes');
				$placard.placard('hide');
			}
		});

		$placard.find('input').focus().focus();
		$placard.find('.placard-accept').click();
	});

	test('onCancel function should be called as expected', function(){
		var $placard = $(html).find('#placard1');

		$placard.placard({
			onCancel: function(helpers){
				ok(1===1, 'onCancel function called on cancel');
				equal(typeof helpers, 'object', 'helpers object passed to onCancel function');
				equal((helpers.previousValue!==undefined && helpers.value!==undefined), true, 'helpers object contains correct attributes');
				$placard.placard('hide');
			}
		});

		$placard.find('input').focus().focus();
		$placard.find('.placard-cancel').click();
	});

	test('Enter and exit keys should trigger appropriate response', function(){
		var $placard = $(html).find('#placard1');
		var $input  = $placard.find('input');
		var e = $.Event("keydown");

		$placard.placard({
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
		var $placard = $(html).find('#placard1');

		$placard.placard({
			externalClickAction: 'accepted'
		});

		$placard.find('input').focus().focus().val('test');
		$('body').click();
		equal($placard.find('input').val(), 'test', 'desired externalClickAction triggered on external click');
	});

	test('externalClickExceptions option should work as expected', function(){
		var $placard = $(html).find('#placard1');

		$('body').append('<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>');
		$('body').append($placard);
		$placard.placard({
			externalClickExceptions: ['.test', '#test']
		});

		$placard.find('input').focus().focus();
		$('#test').click();
		equal($placard.hasClass('showing'), true, 'externalClick ignored for specified id');
		$('.test').click();
		equal($placard.hasClass('showing'), true, 'externalClick ignored for specified class');
		$('.innerTest').click();
		equal($placard.hasClass('showing'), true, 'externalClick ignored for child of specified selector');

		$placard.remove();
		$('.test,#test').remove();
	});

	test('explicit option should work as expected', function(){
		var $placard = $(html).find('#placard1');

		$('body').append($placard);
		$placard.placard({
			explicit: true
		});

		$placard.find('input').focus().focus();
		$('body').click();
		equal($placard.hasClass('showing'), true, 'externalClick ignored due to not being an explicit accept/cancel action');
		$placard.find('.placard-accept').click();
		equal($placard.hasClass('showing'), false, 'placard not showing after explicit action');

		$placard.remove();
	});

	test('revertOnCancel option should work as expected', function(){
		var $placard;

		var setup = function(revert){
			$placard = $(html).find('#placard1');
			$('body').append($placard);
			$placard.find('input').val('test');
			$placard.placard({
				revertOnCancel: revert
			});
			$placard.find('input').focus().focus().val('blah blah blah');
			$placard.find('.placard-cancel').click();
		};

		setup(true);
		equal($placard.find('input').val(), 'test', 'value reverted when set to true');
		$placard.remove();

		setup(false);
		equal($placard.find('input').val(), 'blah blah blah', 'value not reverted when set to false');
		$placard.remove();
	});

	test('getValue method should function as expected', function(){
		var $placard = $(html).find('#placard1');

		$placard.find('input').val('test');
		$placard.placard();

		equal($placard.placard('getValue'), 'test', 'getValue working as expected');
	});

	test('setValue method should function as expected', function(){
		var $placard = $(html).find('#placard1');

		$placard.find('input').val('test');
		$placard.placard();

		$placard.placard('setValue', 'bloop');
		equal($placard.placard('getValue'), 'bloop', 'setValue working as expected');
	});

	test('should disable/enable as expected', function(){
		var $placard = $(html).find('#placard1');
		var $field = $placard.find('.placard-field');

		$placard.placard('disable');
		equal($placard.hasClass('disabled'), true, 'disabled class properly added to element');
		equal($field.attr('disabled'), 'disabled', 'disabled attribute properly added to field');

		$placard.placard('enable');
		equal($placard.hasClass('disabled'), false, 'disabled class properly removed from element');
		equal($field.attr('disabled'), undefined, 'disabled attribute properly removed from field');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#placard1');

		equal(typeof( $el.placard('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
