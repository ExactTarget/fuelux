define(function radioVisibilityModule () {
	window.console = window.console || {};

	return function radioVisibility (QUnit) {
		QUnit.test('should toggle radio container visibility', function testVisibility (assert) {
			var $container = this.$fixture.find('.radioToggle');

			assert.notOk($container.is(':visible'), 'toggle container hidden by default');
			this.$radioToggleOn.radio('check');
			assert.ok($container.is(':visible'), 'toggle container visible after check');
			this.$radioToggleOff.radio('check');
			assert.notOk($container.is(':visible'), 'toggle container hidden after uncheck');
		});

		QUnit.test('should not error on init if radio visibility visible', function testNonError (assert) {
			assert.expect(1);

			window.console.error = function error(msg) {
				assert.notOk(msg, 'console.error should not have fired');
			};

			var $radio = this.$fixture.find('#RadioHidden');
			var $input = $radio.find('input[type="radio"]');
			$input.css('visibility', 'visible');
			assert.equal($input.css('visibility'), 'visible', 'visibility set to visible');
			$radio.radio();
		});

		QUnit.test('should not error on init if radio visibility hidden and ignoreVisibilityCheck option passed', function testIgnoreError (assert) {
			assert.expect(1);

			window.console.error = function error(msg) {
				assert.notOk(msg, 'console.error should not have fired');
			};

			var $radio = this.$fixture.find('#RadioHidden');
			var $input = $radio.find('input[type="radio"]');

			assert.equal($input.css('visibility'), 'hidden', 'visibility set to hidden');
			$radio.radio({ignoreVisibilityCheck: true});
		});

		QUnit.test('should error on init if radio visibility hidden', function testHiddenError (assert) {
			assert.expect(2);

			window.console.error = function error(msg) {
				assert.ok(msg, 'console.error fired');
			};

			var $radio = this.$fixture.find('#RadioHidden');
			var $input = $radio.find('input[type="radio"]');

			assert.equal($input.css('visibility'), 'hidden', 'visibility set to hidden');
			$radio.radio();
		});

		QUnit.test('should error on init if radio visibility collapse', function testCollapseError (assert) {
			assert.expect(2);

			window.console.error = function error(msg) {
				assert.ok(msg, 'console.error fired');
			};

			var $radio = this.$fixture.find('#RadioHidden');
			var $input = $radio.find('input[type="radio"]');
			$input.css('visibility', 'collapse');
			assert.equal($input.css('visibility'), 'collapse', 'visibility set to collapse');
			$radio.radio();
		});
	};
});
