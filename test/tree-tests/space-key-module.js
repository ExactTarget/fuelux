define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function spaceKeyModule (QUnit) {
		QUnit.module( 'should respond to space key', {}, function testSpaceKeyPresses () {
			QUnit.skip('when focus is on selectable node, select node', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});

			QUnit.skip('when focus is on non-selectable, disclose-able node, toggles node', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});

			QUnit.skip('when focus is on non-selectable, non-disclose-able node, clicks on node (this is probably "loading...")', function respondsToKeyboardInput (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
		});

		QUnit.module( 'should not respond to space key', {}, function testSpaceKeyPresses () {
			QUnit.test('when focus is on a child element', function loadTree (assert) {
				assert.expect(1);

				this.$tree.on('initialized.fu.tree', function triggerDownArrow () {
					var $initialBranch = $(this.$tree.find('li:not(".hidden")').get(1));

					$initialBranch.attr('tabindex', 0);
					$initialBranch.focus();

					this.$tree.on('keyboardNavigated.fu.tree', function testDownArrowResult () {
						assert.notOk(true, 'the keyboardNavigated event should not be triggered');
					});

					assert.equal($(document.activeElement).attr('id'), $initialBranch.attr('id'), 'initial branch has focus');

					var $popoverDiv = $('<div class="popover" />');
					$initialBranch.append($popoverDiv);

					var pressSpaceKey = this.getKeyDown('down', $popoverDiv);
					$popoverDiv.trigger(pressSpaceKey);
				}.bind(this));

				this.$tree.tree({
					dataSource: this.dataSource
				});
			});
		});
	};
});
