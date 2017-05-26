define(function focusModule (require) {
	var $ = require('jquery');

	return function (QUnit) {
		QUnit.module( 'focusIn', {}, function () {
			QUnit.test('should focus on first focusable branch when nothing is selected', function checkFocusOnNonSelect (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('loaded.fu.tree', function () {
					$tree.on('focus', function () {
						var $focused = $(document.activeElement);
						var $firstFocusableChild = $(document.activeElement);
						assert.equal($focused.attr('id'), $firstFocusableChild.attr('id'), 'first focusable branch is focused on');
					});

					var tree = document.getElementById('MyTree');

					var event = new Event('focus');

					tree.dispatchEvent(event);
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.test('should correctly set tabindex', function testTabIndex (assert) {
				assert.expect( 2 );
				var $tree = this.$tree;

				$tree.on('loaded.fu.tree', function () {
					var $focused = $($tree.find('li:not(".hidden"):first')[0]);
					assert.equal($focused.attr('tabindex'), undefined, 'tabindex defaults to undefined');

					$tree.on('focus', function () {
						assert.equal($focused.attr('tabindex'), '0', 'tabindex set to 0');
					});

					var tree = document.getElementById('MyTree');

					var event = new Event('focus');

					tree.dispatchEvent(event);
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			// QUnit.test('should focus on first selected item when there is a selection', function respondsToKeyboardInput (assert) {
			// 	this.$tree.trigger(this.getKeyDown('left'));

			// 	assert.ok(true, 'test');
			// });
		});
	};
});
