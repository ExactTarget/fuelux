/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define(function checkboxTest (require) {
	var QUnit = require('qunit');
	var $ = require('jquery');

	require('bootstrap');
	require('fuelux/checkbox');


	QUnit.module('Fuel UX Checkbox', {
		beforeEach: require('./checkbox-tests/helpers').setup
	}, function runCheckboxTests () {
		QUnit.test('should be defined on jquery object', function isCheckboxDefined (assert) {
			assert.ok($().checkbox, 'checkbox method is defined');
		});

		QUnit.test('should return element', function doesCheckboxReturnCheckbox (assert) {
			assert.ok(this.$checkedEnabled.checkbox() === this.$checkedEnabled, 'checkbox should be initialized');
		});

		QUnit.test('should set initial state for checked/enabled', function (assert) {
			// Initialize checkbox
			this.$checkedEnabled.find('label').checkbox();

			// Ensure label has checked class
			var checked = this.$checkedEnabled.find('label').hasClass('checked');
			assert.equal(checked, true, 'label has "checked" class when input is checked');

			// Ensure label does not have disabled class
			var disabled = this.$checkedEnabled.find('label').hasClass('disabled');
			assert.equal(disabled, false, 'label does not have "disabled" class when input is enabled');
		});

		QUnit.test('should set initial state for checked/disabled', function (assert) {
			var $element = this.$checkedDisabled;

			// Initialize checkbox
			$element.find('label').checkbox();

			// Ensure label has checked class
			var checked = $element.find('label').hasClass('checked');
			assert.equal(checked, true, 'label has "checked" class when input is checked');

			// Ensure label has disabled class
			var disabled = $element.find('label').hasClass('disabled');
			assert.equal(disabled, true, 'label has "disabled" class when input is disabled');
		});

		QUnit.test('should set initial state for unchecked/enabled', function (assert) {
			var $element = this.$uncheckedEnabled;

			// Initialize checkbox
			$element.find('label').checkbox();

			// Ensure label does not have checked class
			var checked = $element.find('label').hasClass('checked');
			assert.equal(checked, false, 'label does not have "checked" class when input is unchecked');

			// Ensure label does not have disabled class
			var disabled = $element.find('label').hasClass('disabled');
			assert.equal(disabled, false, 'label does not have "disabled" class when input is enabled');
		});

		QUnit.test('should set initial state for unchecked/disabled', function (assert) {
			var $element = this.$uncheckedDisabled;

			// Initialize checkbox
			$element.find('label').checkbox();

			// Ensure label does not have checked class
			var checked = $element.find('label').hasClass('checked');
			assert.equal(checked, false, 'label does not have "checked" class when input is unchecked');

			// Ensure label has disabled class
			var disabled = $element.find('label').hasClass('disabled');
			assert.equal(disabled, true, 'label has "disabled" class when input is disabled');
		});

		QUnit.test('should disable checkbox', function (assert) {
			var $element = this.$uncheckedEnabled;
			var $input = $element.find('input[type="checkbox"]');

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Set disabled state
			assert.equal($input.prop('disabled'), false, 'checkbox enabled initially');
			$chk.checkbox('disable');
			assert.equal($input.prop('disabled'), true, 'checkbox disabled after calling disable method');
		});

		QUnit.test('should enable checkbox', function (assert) {
			var $element = this.$uncheckedDisabled;
			var $input = $element.find('input[type="checkbox"]');

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Set enabled state
			assert.equal($input.prop('disabled'), true, 'checkbox disabled initially');
			$chk.checkbox('enable');
			assert.equal($input.prop('disabled'), false, 'checkbox enabled after calling enable method');
		});

		QUnit.test('should check checkbox', function (assert) {
			var $element = this.$uncheckedEnabled;
			var $input = $element.find('input[type="checkbox"]');

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Set checked state
			assert.equal($input.prop('checked'), false, 'checkbox unchecked initially');
			$chk.checkbox('check');
			assert.equal($input.prop('checked'), true, 'checkbox checked after calling check method');
		});

		QUnit.test('should uncheck checkbox', function (assert) {
			var $element = this.$checkedEnabled;
			var $input = $element.find('input[type="checkbox"]');

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Set checked state
			assert.equal($input.prop('checked'), true, 'checkbox checked initially');
			$chk.checkbox('uncheck');
			assert.equal($input.prop('checked'), false, 'checkbox unchecked after calling uncheck method');
		});

		QUnit.test('should toggle checkbox', function (assert) {
			var $element = this.$checkedEnabled;
			var $input = $element.find('input[type="checkbox"]');

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Set checked state
			assert.equal($input.prop('checked'), true, 'checkbox checked initially');
			$chk.checkbox('toggle');
			assert.equal($input.prop('checked'), false, 'checkbox unchecked after calling toggle method');
			$chk.checkbox('toggle');
			assert.equal($input.prop('checked'), true, 'checkbox checked after calling toggle method');
			$chk.checkbox('toggle');
			assert.equal($input.prop('checked'), false, 'checkbox unchecked after calling toggle method');
		});

		QUnit.test('should return checked state', function (assert) {
			var $element = this.$checkedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Verify checked state changes with toggle method
			assert.equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), false, 'checkbox state is unchecked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');

			// Verify checked state changes with uncheck method
			$chk.checkbox('uncheck');
			assert.equal($chk.checkbox('isChecked'), false, 'checkbox state is unchecked');

			// Verify checked state changes with check method
			$chk.checkbox('check');
			assert.equal($chk.checkbox('isChecked'), true, 'checkbox state is checked');
		});

		QUnit.test('should support getValue alias', function (assert) {
			var $element = this.$checkedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			// Verify alias aliases
			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
			$chk.checkbox('toggle');
			assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		});

		QUnit.test('should trigger checked event when calling check method', function (assert) {
			var $element = this.$uncheckedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			var triggered = false;
			$chk.on('checked.fu.checkbox', function () {
				triggered = true;
			});

			$chk.checkbox('check');

			assert.equal(triggered, true, 'checked event triggered');
		});

		QUnit.test('should trigger unchecked event when calling uncheck method', function (assert) {
			var $element = this.$checkedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			var triggered = false;
			$chk.on('unchecked.fu.checkbox', function () {
				triggered = true;
			});

			$chk.checkbox('uncheck');

			assert.equal(triggered, true, 'unchecked event triggered');
		});

		QUnit.test('should trigger changed event when calling checked/unchecked method', function (assert) {
			var $element = this.$checkedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			var triggered = false;
			var state = false;
			$chk.on('changed.fu.checkbox', function (evt, data) {
				triggered = true;
				state = data;
			});

			$chk.checkbox('uncheck');

			assert.equal(triggered, true, 'changed event triggered');
			assert.equal(state, false, 'changed event triggered passing correct state');
		});

		QUnit.test('should trigger changed event when clicking on input element', function (assert) {
			var $element = this.$uncheckedEnabled;
			var $input = $element.find('input[type="checkbox"]');
			$element.appendTo(document.body); // Append to body to capture clicks

			// Initialize checkbox
			$element.find('label').checkbox();

			var triggered = false;
			$element.on('changed.fu.checkbox', function () {
				triggered = true;
			});

			$input.click();
			assert.equal(triggered, true, 'changed event triggered');

			$element.remove();
		});

		QUnit.test('should trigger changed event when clicking on input element', function (assert) {
			var $element = this.$uncheckedEnabled;
			var $input = $element.find('input[type="checkbox"]');
			$element.appendTo(document.body); // Append to body to capture clicks

			// Initialize checkbox
			$element.find('label').checkbox();

			var triggered = false;
			$element.on('changed.fu.checkbox', function () {
				triggered = true;
			});

			$input.click();
			assert.equal(triggered, true, 'changed event triggered');

			$element.remove();
		});

		QUnit.test('should toggle checkbox container visibility', function (assert) {
			var $element = this.$html.find('#CheckboxToggle').clone();
			var $container = $element.find('.checkboxToggle');
			$element.appendTo(document.body); // Append to body to check visibility

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();

			assert.equal($container.is(':visible'), false, 'toggle container hidden by default');
			$chk.checkbox('check');
			assert.equal($container.is(':visible'), true, 'toggle container visible after check');
			$chk.checkbox('uncheck');
			assert.equal($container.is(':visible'), false, 'toggle container hidden after uncheck');

			$element.remove();
		});

		QUnit.test('should destroy checkbox', function (assert) {
			var $element = this.$checkedEnabled;

			// Initialize checkbox
			var $chk = $element.find('label').checkbox();
			var originalMarkup = $element.find('label')[ 0 ].outerHTML;

			assert.equal($element.find('#Checkbox1').length, 1, 'checkbox exists in DOM by default');

			var markup = $chk.checkbox('destroy');

			assert.equal(originalMarkup, markup, 'returned original markup');
			assert.equal($element.find('#Checkbox1').length, 0, 'checkbox removed from DOM');
		});
	});
});
