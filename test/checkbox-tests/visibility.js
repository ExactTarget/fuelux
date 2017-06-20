define(function checkboxVisibilityModule () {
	return function checkboxVisibility (QUnit) {
		QUnit.test('should toggle checkbox container visibility', function testVisibility (assert) {
			var $container = this.$fixture.find('.checkboxToggle');

			assert.notOk($container.is(':visible'), 'toggle container hidden by default');
			this.$checkboxToggle.checkbox('check');
			assert.ok($container.is(':visible'), 'toggle container visible after check');
			this.$checkboxToggle.checkbox('uncheck');
			assert.notOk($container.is(':visible'), 'toggle container hidden after uncheck');
		});
	};
});
