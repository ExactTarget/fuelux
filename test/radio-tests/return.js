define(function radioReturnModule () {
	return function radioReturn (QUnit) {
		QUnit.test('should return checked state', function testReturn (assert) {
			// Verify checked state changes with uncheck method
			this.$checkedEnabled.radio('uncheck');
			assert.notOk(this.$checkedEnabled.radio('isChecked'), 'radio state is unchecked');

			// Verify checked state changes with check method
			this.$checkedEnabled.radio('check');
			assert.ok(this.$checkedEnabled.radio('isChecked'), 'radio state is checked');
		});
	};
});
