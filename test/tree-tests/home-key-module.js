define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function homeKeyModule (QUnit) {
		QUnit.module( 'should respond to home key', {}, function testHomeKeyPresses () {
			QUnit.skip('moves focus to first selectable node in tree', function loadTree (assert) {

			});
		});
	};
});
