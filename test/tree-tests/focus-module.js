define(function focusModuleFactory (require) {
	var $ = require('jquery');

	return function focusModule (QUnit) {
		QUnit.module( 'focusIn', {}, function focusInModule () {
			QUnit.test('should focus on first focusable branch when nothing is selected', function checkFocusOnNonSelect (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('loaded.fu.tree', function fireFocus () {
					$tree.on('focus', function testFocus () {
						var $focused = $(document.activeElement);
						var $firstFocusableChild = $($tree.find('li:not(".hidden"):first')[0]);
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

			QUnit.test('should focus on selected child branch when it is selected', function checkFocusOnSelect (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('loaded.fu.tree', function fireFocus () {
					var $secondSelectableChild = $($tree.find('li:not(".hidden")')[1]);
					$tree.tree('selectItem', $secondSelectableChild);


					$tree.on('focus', function testFocus () {
						var $focused = $(document.activeElement);
						assert.equal($focused.attr('id'), $secondSelectableChild.attr('id'), 'selected item is focused on');
					});

					var tree = document.getElementById('MyTree');

					var event = new Event('focus');

					tree.dispatchEvent(event);
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.test('should correctly set tabindex', function tabIndexTest (assert) {
				assert.expect( 2 );
				var $tree = this.$tree;

				$tree.on('loaded.fu.tree', function fireFocus () {
					var $focused = $($tree.find('li:not(".hidden"):first')[0]);
					assert.equal($focused.attr('tabindex'), undefined, 'tabindex defaults to undefined');

					$tree.on('focus', function testTabIndex () {
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
		});
	};
});
