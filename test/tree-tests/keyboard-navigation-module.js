define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');

	return function keyboardNavigationModule (QUnit) {
		QUnit.module( 'keyboard navigation', {}, function testKeyboardNav () {
			QUnit.module( 'should respond to left key', {}, function testLeftKeyPresses () {
				QUnit.test('on top node when branch is closed', function loadTree (assert) {
					assert.expect( 1 );
					var $tree = this.$tree;
					var leftKeyDown = this.getKeyDown('left');

					$tree.on('loaded.fu.tree', function selectFolder () {
						$tree.on('selected.fu.tree', function triggerKeypress () {
							var $focused = $(document.activeElement);
							$tree.on('keyboardNavigated.fu.tree', function testFocus () {
								var $afterKeypressFocuse = $(document.activeElement);
								assert.equal($focused.attr('id'), $afterKeypressFocuse.attr('id'), 'focus does not change');
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

				// QUnit.test('when branch is open', function respondsToKeyboardInput (assert) {
				// 	this.$tree.trigger(this.getKeyDown('left'));

				// 	assert.ok(true, 'test');
				// });
			});
		});
	};
});
