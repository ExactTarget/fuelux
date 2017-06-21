define(function radioEventsModule () {
	return function radioEvents (QUnit) {
		QUnit.module('should trigger', {}, function testInitialization () {
			QUnit.test('checked event when calling check method', function testCheckedTrigger (assert) {
				assert.expect(1);

				this.$uncheckedEnabled.on('checked.fu.radio', function checkedTriggered () {
					assert.ok(true, 'checked event triggered');
				});

				this.$uncheckedEnabled.radio('check');
			});

			QUnit.test('unchecked event when calling uncheck method', function testUncheckedTrigger (assert) {
				assert.expect(1);

				this.$checkedEnabled.on('unchecked.fu.radio', function uncheckedTriggered () {
					assert.ok(true, 'unchecked event triggered');
				});

				this.$checkedEnabled.radio('uncheck');
			});

			QUnit.test('changed event when calling checked/unchecked method', function testChangedTrigger (assert) {
				assert.expect(2);

				this.$checkedEnabled.on('changed.fu.radio', function changedTriggered (evt, data) {
					assert.ok(true, 'changed event triggered');
					assert.notOk(data, 'changed event triggered passing correct state');
				});

				this.$checkedEnabled.radio('uncheck');
			});

			QUnit.test('changed event when clicking on input element', function testClickChecked (assert) {
				assert.expect(1);

				this.$uncheckedEnabled.on('changed.fu.radio', function changedTriggered () {
					assert.ok(true, 'changed event triggered');
				});

				this.$uncheckedEnabled.find('input[type="radio"]').click();
			});
		});
	};
});
