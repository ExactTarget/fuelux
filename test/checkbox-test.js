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

		require('./checkbox-tests/initialization')(QUnit);
		require('./checkbox-tests/disable')(QUnit);
		require('./checkbox-tests/checked')(QUnit);
		require('./checkbox-tests/return')(QUnit);

		// QUnit.test('should support getValue alias', function (assert) {
		// 	var $element = this.$checkedEnabled;

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();

		// 	// Verify alias aliases
		// 	assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		// 	$chk.checkbox('toggle');
		// 	assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		// 	$chk.checkbox('toggle');
		// 	assert.equal($chk.checkbox('isChecked'), $chk.checkbox('getValue'), 'getValue alias matches isChecked');
		// });

		// QUnit.test('should trigger checked event when calling check method', function (assert) {
		// 	var $element = this.$uncheckedEnabled;

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();

		// 	var triggered = false;
		// 	$chk.on('checked.fu.checkbox', function () {
		// 		triggered = true;
		// 	});

		// 	$chk.checkbox('check');

		// 	assert.equal(triggered, true, 'checked event triggered');
		// });

		// QUnit.test('should trigger unchecked event when calling uncheck method', function (assert) {
		// 	var $element = this.$checkedEnabled;

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();

		// 	var triggered = false;
		// 	$chk.on('unchecked.fu.checkbox', function () {
		// 		triggered = true;
		// 	});

		// 	$chk.checkbox('uncheck');

		// 	assert.equal(triggered, true, 'unchecked event triggered');
		// });

		// QUnit.test('should trigger changed event when calling checked/unchecked method', function (assert) {
		// 	var $element = this.$checkedEnabled;

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();

		// 	var triggered = false;
		// 	var state = false;
		// 	$chk.on('changed.fu.checkbox', function (evt, data) {
		// 		triggered = true;
		// 		state = data;
		// 	});

		// 	$chk.checkbox('uncheck');

		// 	assert.equal(triggered, true, 'changed event triggered');
		// 	assert.equal(state, false, 'changed event triggered passing correct state');
		// });

		// QUnit.test('should trigger changed event when clicking on input element', function (assert) {
		// 	var $element = this.$uncheckedEnabled;
		// 	var $input = $element.find('input[type="checkbox"]');
		// 	$element.appendTo(document.body); // Append to body to capture clicks

		// 	// Initialize checkbox
		// 	$element.find('label').checkbox();

		// 	var triggered = false;
		// 	$element.on('changed.fu.checkbox', function () {
		// 		triggered = true;
		// 	});

		// 	$input.click();
		// 	assert.equal(triggered, true, 'changed event triggered');

		// 	$element.remove();
		// });

		// QUnit.test('should trigger changed event when clicking on input element', function (assert) {
		// 	var $element = this.$uncheckedEnabled;
		// 	var $input = $element.find('input[type="checkbox"]');
		// 	$element.appendTo(document.body); // Append to body to capture clicks

		// 	// Initialize checkbox
		// 	$element.find('label').checkbox();

		// 	var triggered = false;
		// 	$element.on('changed.fu.checkbox', function () {
		// 		triggered = true;
		// 	});

		// 	$input.click();
		// 	assert.equal(triggered, true, 'changed event triggered');

		// 	$element.remove();
		// });

		// QUnit.test('should toggle checkbox container visibility', function (assert) {
		// 	var $element = this.$html.find('#CheckboxToggle').clone();
		// 	var $container = $element.find('.checkboxToggle');
		// 	$element.appendTo(document.body); // Append to body to check visibility

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();

		// 	assert.equal($container.is(':visible'), false, 'toggle container hidden by default');
		// 	$chk.checkbox('check');
		// 	assert.equal($container.is(':visible'), true, 'toggle container visible after check');
		// 	$chk.checkbox('uncheck');
		// 	assert.equal($container.is(':visible'), false, 'toggle container hidden after uncheck');

		// 	$element.remove();
		// });

		// QUnit.test('should destroy checkbox', function (assert) {
		// 	var $element = this.$checkedEnabled;

		// 	// Initialize checkbox
		// 	var $chk = $element.find('label').checkbox();
		// 	var originalMarkup = $element.find('label')[ 0 ].outerHTML;

		// 	assert.equal($element.find('#Checkbox1').length, 1, 'checkbox exists in DOM by default');

		// 	var markup = $chk.checkbox('destroy');

		// 	assert.equal(originalMarkup, markup, 'returned original markup');
		// 	assert.equal($element.find('#Checkbox1').length, 0, 'checkbox removed from DOM');
		// });
	});
});
