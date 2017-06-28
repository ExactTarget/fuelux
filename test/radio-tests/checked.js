define(function radioDisableEnableModule () {
	return function radioDisableEnable (QUnit) {
		QUnit.test('check should check radio', function testCheck (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="radio"]');

			// Set checked state
			assert.notOk($input.prop('checked'), 'radio unchecked initially');
			this.$uncheckedEnabled.radio('check');
			assert.ok($input.prop('checked'), 'radio checked after calling check method');
		});

		QUnit.test('uncheck should uncheck radio', function testUncheck (assert) {
			var $input = this.$checkedEnabled.find('input[type="radio"]');

			// Set checked state
			assert.ok($input.prop('checked'), 'radio checked initially');
			this.$checkedEnabled.radio('uncheck');
			assert.notOk($input.prop('checked'), 'radio unchecked after calling uncheck method');
		});
	};
});
