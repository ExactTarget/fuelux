define(function respondsToKeyboardInputModule (require) {
	var $ = require('jquery');

	return function (QUnit) {
		QUnit.module( 'accessibility', {}, function () {
			QUnit.module( 'should respond to left key', {}, function() {
				QUnit.test('when branch is closed', function respondsToKeyboardInput (assert) {
					this.$tree.trigger(this.getKeyDown('left'));

					assert.ok(true, 'test');
				});

				QUnit.test('when branch is open', function respondsToKeyboardInput (assert) {
					this.$tree.trigger(this.getKeyDown('left'));

					assert.ok(true, 'test');
				});
			});
		});
	};
});
