define(function checkboxDisableEnableModule () {
	return function checkboxDisableEnable (QUnit) {
		QUnit.test('should disable correctly', function testDisable (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="checkbox"]');

			// Set disabled state
			assert.notOk($input.prop('disabled'), 'checkbox starts enabled');
			this.$uncheckedEnabled.checkbox('disable');
			assert.ok($input.prop('disabled'), 'checkbox disabled after calling disable method');
		});

		QUnit.test('should enable correctly', function testEnable (assert) {
			var $input = this.$uncheckedDisabled.find('input[type="checkbox"]');

			// Set enabled state
			assert.ok($input.prop('disabled'), 'checkbox starts disabled');
			this.$uncheckedDisabled.checkbox('enable');
			assert.notOk($input.prop('disabled'), 'checkbox enabled after calling enable method');
		});
	};
});
