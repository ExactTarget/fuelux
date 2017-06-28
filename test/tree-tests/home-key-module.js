define(function keyboardNavigationModuleFactory () {
	return function homeKeyModule (QUnit) {
		QUnit.module( 'should respond to home key', {}, function testHomeKeyPresses () {
			QUnit.skip('moves focus to first selectable node in tree', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
		});
	};
});
