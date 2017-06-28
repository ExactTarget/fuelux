define(function checkboxDisableEnableModule () {
	return function checkboxDisableEnable (QUnit) {
		QUnit.test('check should check checkbox', function testCheck (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="checkbox"]');

			// Set checked state
			assert.notOk($input.prop('checked'), 'checkbox unchecked initially');
			this.$uncheckedEnabled.checkbox('check');
			assert.ok($input.prop('checked'), 'checkbox checked after calling check method');
		});

		QUnit.test('uncheck should uncheck checkbox', function testUncheck (assert) {
			var $input = this.$checkedEnabled.find('input[type="checkbox"]');

			// Set checked state
			assert.ok($input.prop('checked'), 'checkbox checked initially');
			this.$checkedEnabled.checkbox('uncheck');
			assert.notOk($input.prop('checked'), 'checkbox unchecked after calling uncheck method');
		});

		QUnit.test('toggle should toggle checkbox', function testToggle (assert) {
			var $input = this.$checkedEnabled.find('input[type="checkbox"]');

			// Set checked state
			assert.ok($input.prop('checked'), 'checkbox checked initially');
			this.$checkedEnabled.checkbox('toggle');
			assert.notOk($input.prop('checked'), 'checkbox unchecked after calling toggle method');
			this.$checkedEnabled.checkbox('toggle');
			assert.ok($input.prop('checked'), 'checkbox checked after calling toggle method');
			this.$checkedEnabled.checkbox('toggle');
			assert.notOk($input.prop('checked'), 'checkbox unchecked after calling toggle method');
		});
	};
});
