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
		require('./checkbox-tests/get-value')(QUnit);
		require('./checkbox-tests/events')(QUnit);
		require('./checkbox-tests/visibility')(QUnit);
		require('./checkbox-tests/destroy')(QUnit);
	});
});
