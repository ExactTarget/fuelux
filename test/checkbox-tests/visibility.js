define(function checkboxVisibilityModule () {
	window.console = window.console || {};

	return function checkboxVisibility (QUnit) {
		QUnit.test('should toggle checkbox container visibility', function testVisibility (assert) {
			var $container = this.$fixture.find('.checkboxToggle');

			assert.notOk($container.is(':visible'), 'toggle container hidden by default');
			this.$checkboxToggle.checkbox('check');
			assert.ok($container.is(':visible'), 'toggle container visible after check');
			this.$checkboxToggle.checkbox('uncheck');
			assert.notOk($container.is(':visible'), 'toggle container hidden after uncheck');
		});

		QUnit.test('should not error on init if checkbox visibility visible', function testNonError (assert) {
			assert.expect(1);

			window.console.error = function error(msg) {
				assert.notOk(msg, 'console.error should not have fired');
			};

			var $checkbox = this.$fixture.find('#CheckboxHidden');
			var $input = $checkbox.find('input[type="checkbox"]');
			$input.css('visibility', 'visible');
			assert.equal($input.css('visibility'), 'visible', 'visibility set to visible');
			$checkbox.checkbox();
		});

		QUnit.test('should not error on init if checkbox visibility hidden and ignoreVisibilityCheck option passed', function testIgnoreError (assert) {
			assert.expect(1);

			window.console.error = function error(msg) {
				assert.notOk(msg, 'console.error should not have fired');
			};

			var $checkbox = this.$fixture.find('#CheckboxHidden');
			var $input = $checkbox.find('input[type="checkbox"]');

			assert.equal($input.css('visibility'), 'hidden', 'visibility set to hidden');
			$checkbox.checkbox({ignoreVisibilityCheck: true});
		});

		QUnit.test('should error on init if checkbox visibility hidden', function testHiddenError (assert) {
			assert.expect(2);

			window.console.error = function error(msg) {
				assert.ok(msg, 'console.error fired');
			};

			var $checkbox = this.$fixture.find('#CheckboxHidden');
			var $input = $checkbox.find('input[type="checkbox"]');

			assert.equal($input.css('visibility'), 'hidden', 'visibility set to hidden');
			$checkbox.checkbox();
		});

		QUnit.test('should error on init if checkbox visibility collapse', function testCollapseError (assert) {
			assert.expect(2);

			window.console.error = function error(msg) {
				assert.ok(msg, 'console.error fired');
			};

			var $checkbox = this.$fixture.find('#CheckboxHidden');
			var $input = $checkbox.find('input[type="checkbox"]');
			$input.css('visibility', 'collapse');
			assert.equal($input.css('visibility'), 'collapse', 'visibility set to collapse');
			$checkbox.checkbox();
		});
	};
});
