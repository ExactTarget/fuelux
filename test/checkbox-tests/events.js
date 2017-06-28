define(function checkboxEventsModule () {
	return function checkboxEvents (QUnit) {
		QUnit.module('should trigger', {}, function testInitialization () {
			QUnit.test('checked event when calling check method', function testCheckedTrigger (assert) {
				assert.expect(1);

				this.$uncheckedEnabled.on('checked.fu.checkbox', function checkedTriggered () {
					assert.ok(true, 'checked event triggered');
				});

				this.$uncheckedEnabled.checkbox('check');
			});

			QUnit.test('unchecked event when calling uncheck method', function testUncheckedTrigger (assert) {
				assert.expect(1);

				this.$checkedEnabled.on('unchecked.fu.checkbox', function uncheckedTriggered () {
					assert.ok(true, 'unchecked event triggered');
				});

				this.$checkedEnabled.checkbox('uncheck');
			});

			QUnit.test('changed event when calling checked/unchecked method', function testChangedTrigger (assert) {
				assert.expect(2);

				this.$checkedEnabled.on('changed.fu.checkbox', function changedTriggered (evt, data) {
					assert.ok(true, 'changed event triggered');
					assert.notOk(data, 'changed event triggered passing correct state');
				});

				this.$checkedEnabled.checkbox('uncheck');
			});

			QUnit.test('changed event when clicking on input unchecked element', function testClickChecked (assert) {
				assert.expect(1);

				this.$uncheckedEnabled.on('changed.fu.checkbox', function changedTriggered () {
					assert.ok(true, 'changed event triggered');
				});

				this.$uncheckedEnabled.find('input[type="checkbox"]').click();
			});

			QUnit.test('changed event when clicking on input checked element', function testClickUnchecked (assert) {
				assert.expect(1);

				this.$checkedEnabled.on('changed.fu.checkbox', function changedTriggered () {
					assert.ok(true, 'changed event triggered');
				});

				this.$checkedEnabled.find('input[type="checkbox"]').click();
			});
		});
	};
});
