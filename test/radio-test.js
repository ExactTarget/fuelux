/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define(function radioTest (require) {
	var QUnit = require('qunit');
	var $ = require('jquery');

	require('bootstrap');
	require('fuelux/radio');

	QUnit.module('Fuel UX Radio', {
		beforeEach: require('./radio-tests/helpers').setup
	}, function runRadioTests () {
		QUnit.test('should be defined on jquery object', function isRadioDefined (assert) {
			assert.ok($().radio, 'radio method is defined');
		});

		QUnit.test('should return element', function doesRadioReturnRadio (assert) {
			assert.equal(this.$checkedEnabled.radio(), this.$checkedEnabled, 'radio should be initialized');
		});

		require('./radio-tests/initialization')(QUnit);
		require('./radio-tests/group')(QUnit);
		require('./radio-tests/disable')(QUnit);
		require('./radio-tests/checked')(QUnit);
		require('./radio-tests/return')(QUnit);
		require('./radio-tests/get-value')(QUnit);
		require('./radio-tests/events')(QUnit);
		require('./radio-tests/visibility')(QUnit);
		require('./radio-tests/destroy')(QUnit);
	});
});
