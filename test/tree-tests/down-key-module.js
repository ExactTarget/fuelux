define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function downKeyModule (QUnit) {
		QUnit.module( 'should respond to down key', {}, function testDownKeyPresses () {
			QUnit.test('when focus is on node above sibling node, moves focus down to sibling', function loadTree (assert) {
				assert.expect(2);

				this.$tree.on('populated.fu.tree', function triggerDownArrow () {
					var $initialBranch = $(this.$tree.find('li:not(".hidden"):first'));
					var $nextBranch = $(this.$tree.find('li:not(".hidden")').get(1));

					$initialBranch.attr('tabindex', 0);
					$initialBranch.focus();

					this.$tree.on('keyboardNavigated.fu.tree', function testDownArrowResult () {
						assert.equal($(document.activeElement).attr('id'), $nextBranch.attr('id'), 'next sibling now has focus');
					});

					assert.equal($(document.activeElement).attr('id'), $initialBranch.attr('id'), 'initial branch has focus');

					var pressDownArrow = this.getKeyDown('down', $initialBranch);
					$initialBranch.trigger(pressDownArrow);
				}.bind(this));

				this.$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.skip('when focus is on last focusable child of parent, moves focus out of parent onto first focusable sibling of parent', function loadTree (assert) {

			});

			QUnit.skip('when focus is on open branch, moves focus into open branch onto first focusable child', function respondsToKeyboardInput (assert) {

			});

			QUnit.skip('when focus is on open empty branch, moves focus down to next sibling', function respondsToKeyboardInput (assert) {

			});
		});
	};
});
