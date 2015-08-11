/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/radio-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	html = $('<div>'+html+'</div>').find('#MyRadioContainer');

	require('bootstrap');
	require('fuelux/radio');

	module("Fuel UX Radio");

	test("should be defined on jquery object", function () {
		ok($().radio, 'radio method is defined');
	});

	test("should return element", function () {
		var $radio1 = $(html).find('#Radio1');
		ok($radio1.radio() === $radio1, 'radio should be initialized');
	});

	test("should set initial state for checked/enabled", function () {
		var $element = $(html).find('#RadioCheckedEnabled').clone();

		// initialize radio
		$element.find('label').radio();

		// ensure label has checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, true, 'label has "checked" class when input is checked');

		// ensure label does not have disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, false, 'label does not have "disabled" class when input is enabled');
	});

	test("should set initial state to checked for first item in group", function () {
		var $element = $(html).find('#RadioGroup').clone();

		$element.find('input').eq(0).prop('checked', 'checked');

		// initialize radio
		$element.find('label').radio();

		var item0 = $element.find('label').eq(0);
		equal(item0.hasClass('checked'), true, 'index 0 label has "checked" class when input is checked');

		var item1 = $element.find('label').eq(1);
		equal(item1.hasClass('checked'), false, 'index 1 label does not have "checked" class');

		var item2 = $element.find('label').eq(2);
		equal(item2.hasClass('checked'), false, 'index 2 label does not have "checked" class');
	});

	test("should set 2nd item checked and 1st item unchecked after selecting 2nd item in group", function () {
		var $element = $(html).find('#RadioGroup').clone();
		$element.appendTo(document.body); // append to body to capture clicks

		$element.find('input').eq(0).prop('checked', 'checked');

		// initialize radio
		$element.find('label').radio();

		var $input = $element.find('input').eq(1);
		$input.click();

		// ensure item 0 (1st) label has checked class
		var item0 = $element.find('label').eq(0);
		equal(item0.hasClass('checked'), false, 'index 0 label does not have "checked" class when input is checked');

		var item1 = $element.find('label').eq(1);
		equal(item1.hasClass('checked'), true, 'index 1 label has "checked" class');

		var item2 = $element.find('label').eq(2);
		equal(item2.hasClass('checked'), false, 'index 2 label does not have "checked" class');

		$element.remove();
	});

	test("should set initial state to checked for middle item in group", function () {
		var $element = $(html).find('#RadioGroup').clone();

		$element.find('input').eq(1).prop('checked', 'checked');

		// initialize radio
		$element.find('label').radio();

		var item0 = $element.find('label').eq(0);
		equal(item0.hasClass('checked'), false, 'index 0 label does not have "checked" class when input is checked');

		var item1 = $element.find('label').eq(1);
		equal(item1.hasClass('checked'), true, 'index 1 label has "checked" class');

		var item2 = $element.find('label').eq(2);
		equal(item2.hasClass('checked'), false, 'index 2 label does not have "checked" class');
	});

	test("should set initial state to checked for last item in group", function () {
		var $element = $(html).find('#RadioGroup').clone();

		$element.find('input').eq(2).prop('checked', 'checked');

		// initialize radio
		$element.find('label').radio();

		var item0 = $element.find('label').eq(0);
		equal(item0.hasClass('checked'), false, 'index 0 label does not have "checked" class when input is checked');

		var item1 = $element.find('label').eq(1);
		equal(item1.hasClass('checked'), false, 'index 1 label does not have "checked" class');

		var item2 = $element.find('label').eq(2);
		equal(item2.hasClass('checked'), true, 'index 2 label has "checked" class');
	});

	test("should set initial state for checked/disabled", function () {
		var $element = $(html).find('#RadioCheckedDisabled').clone();

		// initialize radio
		$element.find('label').radio();

		// ensure label has checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, true, 'label has "checked" class when input is checked');

		// ensure label has disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, true, 'label has "disabled" class when input is disabled');
	});

	test("should set initial state for unchecked/enabled", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();

		// initialize radio
		$element.find('label').radio();

		// ensure label does not have checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, false, 'label does not have "checked" class when input is unchecked');

		// ensure label does not have disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, false, 'label does not have "disabled" class when input is enabled');
	});

	test("should set initial state for unchecked/disabled", function () {
		var $element = $(html).find('#RadioUncheckedDisabled').clone();

		// initialize radio
		$element.find('label').radio();

		// ensure label does not have checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, false, 'label does not have "checked" class when input is unchecked');

		// ensure label has disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, true, 'label has "disabled" class when input is disabled');
	});

	test("should disable radio", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');

		// initialize radio
		var $radio = $element.find('label').radio();

		// set disabled state
		equal($input.prop('disabled'), false, 'radio enabled initially');
		$radio.radio('disable');
		equal($input.prop('disabled'), true, 'radio disabled after calling disable method');
	});

	test("should enable radio", function () {
		var $element = $(html).find('#RadioUncheckedDisabled').clone();
		var $input = $element.find('input[type="radio"]');

		// initialize radio
		var $radio = $element.find('label').radio();

		// set enabled state
		equal($input.prop('disabled'), true, 'radio disabled initially');
		$radio.radio('enable');
		equal($input.prop('disabled'), false, 'radio enabled after calling enable method');
	});

	test("should check radio", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');

		// initialize radio
		var $radio = $element.find('label').radio();

		// set checked state
		equal($input.prop('checked'), false, 'radio unchecked initially');
		$radio.radio('check');
		equal($input.prop('checked'), true, 'radio checked after calling check method');
	});

	test("should uncheck radio", function () {
		var $element = $(html).find('#RadioCheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');

		// initialize radio
		var $radio = $element.find('label').radio();

		// set checked state
		equal($input.prop('checked'), true, 'radio checked initially');
		$radio.radio('uncheck');
		equal($input.prop('checked'), false, 'radio unchecked after calling uncheck method');
	});

	test("should return checked state", function () {
		var $element = $(html).find('#RadioCheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');

		// initialize radio
		var $radio = $element.find('label').radio();

		// verify checked state changes with uncheck method
		$radio.radio('uncheck');
		equal($radio.radio('isChecked'), false, 'radio state is unchecked');

		// verify checked state changes with check method
		$radio.radio('check');
		equal($radio.radio('isChecked'), true, 'radio state is checked');
	});

	test("should trigger checked event when calling check method", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();

		// initialize radio
		var $radio = $element.find('label').radio();

		var triggered = false;
		$radio.on('checked.fu.radio', function(){
			triggered = true;
		});

		$radio.radio('check');

		equal(triggered, true, 'checked event triggered');
	});

	test("should trigger unchecked event when calling uncheck method", function () {
		var $element = $(html).find('#RadioCheckedEnabled').clone();

		// initialize radio
		var $radio = $element.find('label').radio();

		var triggered = false;
		$radio.on('unchecked.fu.radio', function(){
			triggered = true;
		});

		$radio.radio('uncheck');

		equal(triggered, true, 'unchecked event triggered');
	});

	test("should trigger changed event when calling checked/unchecked method", function () {
		var $element = $(html).find('#RadioCheckedEnabled').clone();

		// initialize radio
		var $radio = $element.find('label').radio();

		var triggered = false;
		var state = false;
		$radio.on('changed.fu.radio', function(evt, data){
			triggered = true;
			state = data;
		});

		$radio.radio('uncheck');

		equal(triggered, true, 'changed event triggered');
		equal(state, false, 'changed event triggered passing correct state');
	});

	test("should trigger changed event when clicking on input element", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');
		$element.appendTo(document.body); // append to body to capture clicks

		// initialize radio
		var $radio = $element.find('label').radio();

		var triggered = false;
		$element.on('changed.fu.radio', function(){
			triggered = true;
		});

		$input.click();
		equal(triggered, true, 'changed event triggered');

		$element.remove();
	});

	test("should trigger changed event when clicking on input element", function () {
		var $element = $(html).find('#RadioUncheckedEnabled').clone();
		var $input = $element.find('input[type="radio"]');
		$element.appendTo(document.body); // append to body to capture clicks

		// initialize radio
		var $radio = $element.find('label').radio();

		var triggered = false;
		$element.on('changed.fu.radio', function(){
			triggered = true;
		});

		$input.click();
		equal(triggered, true, 'changed event triggered');

		$element.remove();
	});

	test("should toggle radio container visibility", function() {
		var $element = $(html).find('#RadioToggle').clone();
		var $container = $element.find('.radioToggle');
		$element.appendTo(document.body); // append to body to check visibility

		// initialize radio
		var $radio = $element.find('label').radio();

		equal($container.is(':visible'), false, 'toggle container hidden by default');
		$radio.radio('check');
		equal($container.is(':visible'), true, 'toggle container visible after check');
		$radio.radio('uncheck');
		equal($container.is(':visible'), false, 'toggle container hidden after uncheck');

		$element.remove();
	});

	test("should destroy radio", function() {
		var $element = $(html).find('#RadioCheckedEnabled').clone();

		// initialize radio
		var $radio = $element.find('label').radio();
		var originalMarkup = $element.find('label')[0].outerHTML;

		equal($element.find('#Radio1').length, 1, 'radio exists in DOM by default');

		var markup = $radio.radio('destroy');

		equal(originalMarkup, markup, 'returned original markup');
		equal($element.find('#Radio1').length, 0, 'radio removed from DOM');
	});
});
