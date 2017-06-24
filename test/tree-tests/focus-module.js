define(function focusModuleFactory (require) {
	var $ = require('jquery');

	return function focusModule (QUnit) {
		QUnit.module( 'focusIn', {}, function focusInModule () {
			QUnit.test('should focus on first focusable branch when nothing is selected', function checkFocusOnNonSelect (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('initialized.fu.tree', function fireFocus () {
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

				$tree.on('initialized.fu.tree', function fireFocus () {
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
		});

		QUnit.module( 'fixFocusability', {}, function focusInModule () {
			QUnit.test('should correctly set tabindexes', function tabIndexTest (assert) {
				assert.expect( 3 );
				var $tree = this.$tree;

				$tree.on('initialized.fu.tree', function fireFocus () {
					var $focused = $($tree.find('li:not(".hidden"):first')[0]);
					assert.equal($focused.attr('tabindex'), undefined, 'tabindex defaults to undefined');

					$tree.on('focus', function testTabIndex () {
						var $notFocused = $($tree.find('li:not(".hidden, #' + $focused.attr('id') + '")'));
						var allSetToMinus1 = true;

						$notFocused.each(function gatherIndices (i, elm) {
							if (parseInt($(elm).attr('tabindex'), 10) >= 0) {
								allSetToMinus1 = false;
							}
						});

						assert.equal($focused.attr('tabindex'), '0', "focused branch's tabindex set to 0");
						assert.ok(allSetToMinus1, 'All ' + $notFocused.length + " other branch's tab indexes are set to -1");
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

		QUnit.module( 'setFocus', {}, function focusInModule () {
			QUnit.test("should set tree's aria-activedescendant attr to branch id", function tabIndexTest (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('initialized.fu.tree', function fireFocus () {
					$tree.on('focus', function testAriaActive () {
						var $focused = $(document.activeElement);
						assert.equal($tree.attr('aria-activedescendant'), $focused.attr('id'), "tree's aria-activedescendant is set to focused branch's ID");
					});

					var tree = document.getElementById('MyTree');

					var event = new Event('focus');

					tree.dispatchEvent(event);
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.test('should focus on passed in branch', function tabIndexTest (assert) {
				assert.expect( 1 );
				var $tree = this.$tree;

				$tree.on('initialized.fu.tree', function fireFocus () {
					var $passedInBranch = $($tree.find('li:not(".hidden"):first')[0]);

					$tree.on('focus', function testFocusedBranch () {
						var $focused = $(document.activeElement);
						assert.equal($passedInBranch.attr('id'), $focused.attr('id'), 'passed in branch is focused on');
					});

					var tree = document.getElementById('MyTree');

					var event = new Event('focus');

					tree.dispatchEvent(event);
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.test('should fire setFocus.fu.tree', function tabIndexTest (assert) {
				assert.expect( 2 );
				var $tree = this.$tree;

				$tree.on('initialized.fu.tree', function fireFocus () {
					var $expectedBranch = $($tree.find('li:not(".hidden"):first')[0]);

					$tree.on('setFocus.fu.tree', function testFiredEvent (e, bubbledBranch) {
						assert.ok(true, 'setFocus.fu.tree fired.');
						assert.equal($expectedBranch.attr('id'), $(bubbledBranch).attr('id'), 'bubbled branch is expected branch');
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
