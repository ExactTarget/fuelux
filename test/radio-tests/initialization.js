define(function radioInitializationModule () {
	return function radioInitialization (QUnit) {
		QUnit.module('should initialize correctly', {}, function testInitialization () {
			QUnit.test('for checked/enabled', function testCheckedEnabled (assert) {
				assert.ok(this.$checkedEnabled.hasClass('checked'), 'label has "checked" class when input is checked');
				assert.notOk(this.$checkedEnabled.hasClass('disabled'), 'label does not have "disabled" class when input is enabled');
			});

			QUnit.test('for checked/disabled', function testCheckedDisabled (assert) {
				assert.ok(this.$checkedDisabled.hasClass('checked'), 'label has "checked" class when input is checked');
				assert.ok(this.$checkedDisabled.hasClass('disabled'), 'label has "disabled" class when input is disabled');
			});

			QUnit.test('for unchecked/enabled', function testUncheckedEnabled (assert) {
				assert.notOk(this.$uncheckedEnabled.hasClass('checked'), 'label does not have "checked" class when input is unchecked');
				assert.notOk(this.$uncheckedEnabled.hasClass('disabled'), 'label does not have "disabled" class when input is enabled');
			});

			QUnit.test('for unchecked/disabled', function testUncheckedDisabled (assert) {
				assert.notOk(this.$uncheckedDisabled.hasClass('checked'), 'label does not have "checked" class when input is unchecked');
				assert.ok(this.$uncheckedDisabled.hasClass('disabled'), 'label has "disabled" class when input is disabled');
			});
		});
	};
});
