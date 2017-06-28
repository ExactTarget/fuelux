define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function endKeyModule (QUnit) {
		QUnit.module( 'should respond to end key', {}, function testEndKeyPresses () {
			QUnit.skip('moves focus to last selectable node in tree', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
		});
	};
});
