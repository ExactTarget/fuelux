define(function respondsToKeyboardInputModule (require) {
	var $ = require('jquery');

	return function (QUnit) {
		QUnit.module( 'focusIn', {}, function () {
			QUnit.test('should focus on first focusable branch when nothing is selected', function respondsToKeyboardInput (assert) {
				var $tree = this.$tree;

				// this.$tree.tree('discloseVisible');
				$tree.tree({
					dataSource: this.dataSource
				});

				setTimeout(function() {
					$tree.focus();
				}, 1000);

				// console.log('this.$tree', this.$tree.parent().html())

				assert.ok(false, 'test');
			});

			QUnit.test('should focus on first selected item when there is a selection', function respondsToKeyboardInput (assert) {
				this.$tree.trigger(this.getKeyDown('left'));

				assert.ok(true, 'test');
			});
		});
	};
});
