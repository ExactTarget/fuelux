define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function keyboardNavigationModule (QUnit) {
		QUnit.module( 'keyboard navigation', {}, function testKeyboardNav () {
			QUnit.module( 'should respond to left key', {}, function testLeftKeyPresses () {
				QUnit.test('on top node when branch is closed', function loadTree (assert) {
					assert.expect( 3 );
					var $tree = this.$tree;
					var leftKeyDown = this.getKeyDown('left');

					$tree.one('loaded.fu.tree', function selectFolder () {
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

				QUnit.test('when branch is disclosed, closes branch', function respondsToKeyboardInput (assert) {
					assert.expect( 3 );
					var $tree = this.$tree;
					var self = this;

					$tree.one('loaded.fu.tree', function selectFolder () {
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
		});
	};
});
