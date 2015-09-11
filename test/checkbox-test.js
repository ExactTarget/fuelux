/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/checkbox-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	html = $('<div>'+html+'</div>').find('#MyCheckboxContainer');

	require('bootstrap');
	require('fuelux/checkbox');

	module("Fuel UX Checkbox");

	test("should be defined on jquery object", function () {
		ok($().checkbox, 'checkbox method is defined');
	});

	test("should return element", function () {
		var $chk1 = $(html).find('#Checkbox1');
		ok($chk1.checkbox() === $chk1, 'checkbox should be initialized');
	});

	test("should set initial state for checked/enabled", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();

		// initialize checkbox
		$element.find('label').checkbox();

		// ensure label has checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, true, 'label has "checked" class when input is checked');

		// ensure label does not have disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, false, 'label does not have "disabled" class when input is enabled');
	});

	test("should set initial state for checked/disabled", function () {
		var $element = $(html).find('#CheckboxCheckedDisabled').clone();

		// initialize checkbox
		$element.find('label').checkbox();

		// ensure label has checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, true, 'label has "checked" class when input is checked');

		// ensure label has disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, true, 'label has "disabled" class when input is disabled');
	});

	test("should set initial state for unchecked/enabled", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();

		// initialize checkbox
		$element.find('label').checkbox();

		// ensure label does not have checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, false, 'label does not have "checked" class when input is unchecked');

		// ensure label does not have disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, false, 'label does not have "disabled" class when input is enabled');
	});

	test("should set initial state for unchecked/disabled", function () {
		var $element = $(html).find('#CheckboxUncheckedDisabled').clone();

		// initialize checkbox
		$element.find('label').checkbox();

		// ensure label does not have checked class
		var checked = $element.find('label').hasClass('checked');
		equal(checked, false, 'label does not have "checked" class when input is unchecked');

		// ensure label has disabled class
		var disabled = $element.find('label').hasClass('disabled');
		equal(disabled, true, 'label has "disabled" class when input is disabled');
	});

	test("should disable checkbox", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// set disabled state
		equal($input.prop('disabled'), false, 'checkbox enabled initially');
		$chk.checkbox('disable');
		equal($input.prop('disabled'), true, 'checkbox disabled after calling disable method');
	});

	test("should enable checkbox", function () {
		var $element = $(html).find('#CheckboxUncheckedDisabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// set enabled state
		equal($input.prop('disabled'), true, 'checkbox disabled initially');
		$chk.checkbox('enable');
		equal($input.prop('disabled'), false, 'checkbox enabled after calling enable method');
	});

	test("should check checkbox", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// set checked state
		equal($input.prop('checked'), false, 'checkbox unchecked initially');
		$chk.checkbox('check');
		equal($input.prop('checked'), true, 'checkbox checked after calling check method');
	});

	test("should uncheck checkbox", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// set checked state
		equal($input.prop('checked'), true, 'checkbox checked initially');
		$chk.checkbox('uncheck');
		equal($input.prop('checked'), false, 'checkbox unchecked after calling uncheck method');
	});

	test("should toggle checkbox", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// set checked state
		equal($input.prop('checked'), true, 'checkbox checked initially');
		$chk.checkbox('toggle');
		equal($input.prop('checked'), false, 'checkbox unchecked after calling toggle method');
		$chk.checkbox('toggle');
		equal($input.prop('checked'), true, 'checkbox checked after calling toggle method');
		$chk.checkbox('toggle');
		equal($input.prop('checked'), false, 'checkbox unchecked after calling toggle method');
	});

	test("should return checked state", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		// verify checked state changes with toggle method
		equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');
		$chk.checkbox('toggle');
		equal($chk.checkbox('isChecked'), false, 'checkbox state is unchecked');
		$chk.checkbox('toggle');
		equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');

		// verify checked state changes with uncheck method
		$chk.checkbox('uncheck');
		equal($chk.checkbox('isChecked'), false, 'checkbox state is unchecked');

		// verify checked state changes with check method
		$chk.checkbox('check');
		equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');
	});

	test("should support getValue alias", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');

		// initialize checkbox
		var $chk = $element.find('label').checkbox();
		// verify alias aliases
		equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		$chk.checkbox('toggle');
		equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		$chk.checkbox('toggle');
		equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
	});

	test("should trigger checked event when calling check method", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		var triggered = false;
		$chk.on('checked.fu.checkbox', function(){
			triggered = true;
		});

		$chk.checkbox('check');

		equal(triggered, true, 'checked event triggered');
	});

	test("should trigger unchecked event when calling uncheck method", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		var triggered = false;
		$chk.on('unchecked.fu.checkbox', function(){
			triggered = true;
		});

		$chk.checkbox('uncheck');

		equal(triggered, true, 'unchecked event triggered');
	});

	test("should trigger changed event when calling checked/unchecked method", function () {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		var triggered = false;
		var state = false;
		$chk.on('changed.fu.checkbox', function(evt, data){
			triggered = true;
			state = data;
		});

		$chk.checkbox('uncheck');

		equal(triggered, true, 'changed event triggered');
		equal(state, false, 'changed event triggered passing correct state');
	});

	test("should trigger changed event when clicking on input element", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');
		$element.appendTo(document.body); // append to body to capture clicks

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		var triggered = false;
		$element.on('changed.fu.checkbox', function(){
			triggered = true;
		});

		$input.click();
		equal(triggered, true, 'changed event triggered');

		$element.remove();
	});

	test("should trigger changed event when clicking on input element", function () {
		var $element = $(html).find('#CheckboxUncheckedEnabled').clone();
		var $input = $element.find('input[type="checkbox"]');
		$element.appendTo(document.body); // append to body to capture clicks

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		var triggered = false;
		$element.on('changed.fu.checkbox', function(){
			triggered = true;
		});

		$input.click();
		equal(triggered, true, 'changed event triggered');

		$element.remove();
	});

	test("should toggle checkbox container visibility", function() {
		var $element = $(html).find('#CheckboxToggle').clone();
		var $container = $element.find('.checkboxToggle');
		$element.appendTo(document.body); // append to body to check visibility

		// initialize checkbox
		var $chk = $element.find('label').checkbox();

		equal($container.is(':visible'), false, 'toggle container hidden by default');
		$chk.checkbox('check');
		equal($container.is(':visible'), true, 'toggle container visible after check');
		$chk.checkbox('uncheck');
		equal($container.is(':visible'), false, 'toggle container hidden after uncheck');

		$element.remove();
	});

	test("should destroy checkbox", function() {
		var $element = $(html).find('#CheckboxCheckedEnabled').clone();

		// initialize checkbox
		var $chk = $element.find('label').checkbox();
		var originalMarkup = $element.find('label')[0].outerHTML;

		equal($element.find('#Checkbox1').length, 1, 'checkbox exists in DOM by default');

		var markup = $chk.checkbox('destroy');

		equal(originalMarkup, markup, 'returned original markup');
		equal($element.find('#Checkbox1').length, 0, 'checkbox removed from DOM');
	});
});