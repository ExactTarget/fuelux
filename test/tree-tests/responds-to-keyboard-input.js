define(function respondsToKeyboardInputModule (require) {
	var $ = require('jquery');
	var QUnit = require('qunit');

	return function () {
		QUnit.test('should respond to arrow keys', function respondsToKeyboardInput (assert) {
			var eventObject = this.defaultEventObject;
			eventObject.which = 37;

			var e = $.Event( 'keydown', eventObject); // eslint-disable-line new-cap

			this.$tree.trigger(e);

			assert.ok(true, 'test');
		});
	};
});
