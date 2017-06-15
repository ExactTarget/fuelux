define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function upKeyModule (QUnit) {
		QUnit.module( 'should respond to up key', {}, function testUpKeyPresses () {
			QUnit.skip('when focus is on node below sibling node, moves focus up to sibling', function loadTree (assert) {

			});

			QUnit.skip('when focus is below open sibling, moves focus into last focusable child of sibling', function loadTree (assert) {

			});

			QUnit.skip('when focus is in first child of open branch, moves focus onto parent', function respondsToKeyboardInput (assert) {

			});
		});
	};
});
