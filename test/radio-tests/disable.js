define(function radioDisableEnableModule () {
	return function radioDisableEnable (QUnit) {
		QUnit.test('should disable correctly', function testDisable (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="radio"]');

			// Set disabled state
			assert.notOk($input.prop('disabled'), 'radio starts enabled');
			this.$uncheckedEnabled.radio('disable');
			assert.ok($input.prop('disabled'), 'radio disabled after calling disable method');
		});

		QUnit.test('should enable correctly', function testEnable (assert) {
			var $input = this.$uncheckedDisabled.find('input[type="radio"]');

			// Set enabled state
			assert.ok($input.prop('disabled'), 'radio starts disabled');
			this.$uncheckedDisabled.radio('enable');
			assert.notOk($input.prop('disabled'), 'radio enabled after calling enable method');
		});
	};
});
