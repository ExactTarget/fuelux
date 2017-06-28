define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function rightKeyModule (QUnit) {
		QUnit.module( 'should respond to right key', {}, function testRightKeyPresses () {
			QUnit.skip('when branch is closed, discloses branch', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});

			QUnit.skip('when branch is disclosed, focuses into branch', function respondsToKeyboardInput (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
		});
	};
});
