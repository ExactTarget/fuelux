define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function leftKeyModule (QUnit) {
		QUnit.module( 'should respond to left key', {}, function testLeftKeyPresses () {
			QUnit.test('on top node when branch is closed', function loadTree (assert) {
				assert.expect( 3 );
				var $tree = this.$tree;
				var leftKeyDown = this.getKeyDown('left');

				$tree.one('initialized.fu.tree', function selectFolder () {
					$tree.one('selected.fu.tree', function triggerKeypress () {
						var $focused = $(document.activeElement);
						assert.ok(!$focused.hasClass('tree-open'), 'key is being pressed on closed folder.');
						$tree.one('keyboardNavigated.fu.tree', function testFocus () {
							var $afterKeypressFocus = $(document.activeElement);
							assert.equal($focused.attr('id'), $afterKeypressFocus.attr('id'), 'focus does not change upon keypress.');
							assert.ok(!$focused.hasClass('tree-open'), 'folder is still closed.');
						});

						$focused.trigger(leftKeyDown);
					});

					// focus on first selectable folder
					$tree.tree('selectFolder', $($tree.find('.tree-branch:not(".hidden")')[0]));
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.skip('on child node when branch is closed', function loadTree (assert) {
				// The following doesn't actually work due to issues with browsers and focus.
				// Gave up due to time constraints. If you touch this part of the tree, please complete this test
				assert.expect( 4 );
				var $tree = this.$tree;
				var self = this;

				$tree.one('initialized.fu.tree', function selectFolder () {
					$tree.one('setFocus.fu.tree', function triggerDisclosure () {
						var $finalTargetFolder = $(document.activeElement);

						$tree.one('disclosedFolder.fu.tree', function triggerKeypress () {
							$tree.one('setFocus.fu.tree', function selectChildFolder () {
								var $focused = $(document.activeElement);

								assert.notOk($focused.hasClass('tree-open'), 'key is being pressed on closed folder.');
								assert.notEqual($focused.attr('id'), $finalTargetFolder.attr('id'), 'focus has changed from initially targeted folder.');
								$tree.on('keyboardNavigated.fu.tree', function testFocus () {
									var $finalFocusedFolder = $(document.activeElement);

									assert.equal($finalFocusedFolder.attr('id'), $finalTargetFolder.attr('id'), 'focus has changed.');
									assert.notOk($focused.hasClass('tree-open'), 'folder is now closed.');
								});
								var leftKeyDown = self.getKeyDown('left', $focused);

								$focused.trigger(leftKeyDown);
							});

							// focus on first selectable folder
							$tree.tree('selectFolder', $($finalTargetFolder.find('.tree-branch:not(".hidden")')[0]));
						});

						$tree.tree('discloseFolder', $($tree.find('.tree-branch:not(".hidden")')[0]));
					});

					// focus on first selectable folder
					$tree.tree('selectFolder', $($tree.find('.tree-branch:not(".hidden")')[0]));
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.test('when branch is disclosed, closes branch', function respondsToKeyboardInput (assert) {
				assert.expect( 3 );
				var $tree = this.$tree;
				var self = this;

				$tree.one('initialized.fu.tree', function selectFolder () {
					$tree.one('setFocus.fu.tree', function triggerDisclosure () {
						$tree.one('disclosedFolder.fu.tree', function triggerKeypress () {
							var $focused = $(document.activeElement);

							assert.ok($focused.hasClass('tree-open'), 'key is being pressed on open folder.');
							$tree.on('keyboardNavigated.fu.tree', function testFocus () {
								var $afterKeypressFocus = $(document.activeElement);
								assert.equal($focused.attr('id'), $afterKeypressFocus.attr('id'), 'focus does not change upon keypress.');
								assert.ok(!$focused.hasClass('tree-open'), 'folder is now closed.');
							});
							var leftKeyDown = self.getKeyDown('left', $focused);

							$focused.trigger(leftKeyDown);
						});

						$tree.tree('discloseFolder', $($tree.find('.tree-branch:not(".hidden")')[0]));
					});

					// focus on first selectable folder
					$tree.tree('selectFolder', $($tree.find('.tree-branch:not(".hidden")')[0]));
				});

				$tree.tree({
					dataSource: this.dataSource
				});
			});
		});
	};
});
