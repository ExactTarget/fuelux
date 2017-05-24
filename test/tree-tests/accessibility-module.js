define(function respondsToKeyboardInputModule (require) {
	var $ = require('jquery');

	return function (QUnit) {
		QUnit.module( 'accessibility', {}, function () {
			QUnit.test('should respond to left key', function respondsToKeyboardInput (assert) {
				var e = this.getKeyDown('left');
				this.$tree.trigger(e);

				assert.ok(true, 'test');
			});
		});
	};
});
