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
	};
});
