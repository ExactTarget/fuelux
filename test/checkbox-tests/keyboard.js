define(function checkboxKeyboardModule () {
	return function checkboxKeyboard (QUnit) {
		QUnit.test('spacebar should check and uncheck checkbox', function testSpace (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="checkbox"]');

			// Set checked state
			assert.notOk($input.prop('checked'), 'checkbox unchecked initially');
			// select checkbox & hit spacebar
			assert.ok($input.prop('checked'), 'checkbox checked after hitting spacebar on focused checkbox');
			// hit spacebar again
			assert.ok($input.prop('checked'), 'checkbox unchecked after hitting spacebar on focused checkbox');
		});
		QUnit.test('enter should check and uncheck checkbox', function testEnter (assert) {
			var $input = this.$uncheckedEnabled.find('input[type="checkbox"]');

			// Set checked state
			assert.notOk($input.prop('checked'), 'checkbox unchecked initially');
			// select checkbox & hit enter
			assert.ok($input.prop('checked'), 'checkbox checked after hitting enter on focused checkbox');
			// hit enter again
			assert.ok($input.prop('checked'), 'checkbox unchecked after hitting enter on focused checkbox');
		});
		QUnit.test('should be tab-able', function testTab (assert) {
			// Test to see if checkbox is focused
			// Hit tab
			// Teest to make sure checkbox is now focused
		});
	};
});
