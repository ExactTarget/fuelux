define(function checkboxReturnModule () {
	return function checkboxReturn (QUnit) {
		QUnit.test('should return checked state', function testReturn (assert) {
			// Verify checked state changes with toggle method
			assert.ok(this.$checkedEnabled.checkbox('isChecked'), 'checkbox state is checked');
			this.$checkedEnabled.checkbox('toggle');
			assert.notOk(this.$checkedEnabled.checkbox('isChecked'), 'checkbox state is unchecked');
			this.$checkedEnabled.checkbox('toggle');
			assert.ok(this.$checkedEnabled.checkbox('isChecked'), 'checkbox state is checked');

			// Verify checked state changes with uncheck method
			this.$checkedEnabled.checkbox('uncheck');
			assert.notOk(this.$checkedEnabled.checkbox('isChecked'), 'checkbox state is unchecked');

			// Verify checked state changes with check method
			this.$checkedEnabled.checkbox('check');
			assert.ok(this.$checkedEnabled.checkbox('isChecked'), 'checkbox state is checked');
		});
	};
});
