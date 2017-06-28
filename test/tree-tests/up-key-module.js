define(function keyboardNavigationModuleFactory (require) {
	var $ = require('jquery');
	var emptyFolderData = require('./data/emptyFolder');

	return function upKeyModule (QUnit) {
		QUnit.module( 'should respond to up key', {}, function testUpKeyPresses () {
			QUnit.test('when focus is on node below sibling node, moves focus up to sibling', function loadTree (assert) {
				assert.expect(2);

				this.$tree.on('initialized.fu.tree', function triggerDownArrow () {
					var $initialBranch = $(this.$tree.find('li:not(".hidden")').get(1));
					var $previousBranch = $(this.$tree.find('li:not(".hidden")').get(0));

					$initialBranch.attr('tabindex', 0);
					$initialBranch.focus();

					this.$tree.on('keyboardNavigated.fu.tree', function testDownArrowResult () {
						assert.equal($(document.activeElement).attr('id'), $previousBranch.attr('id'), 'previous sibling now has focus');
					});

					assert.equal($(document.activeElement).attr('id'), $initialBranch.attr('id'), 'initial branch has focus');

					var pressUpArrow = this.getKeyDown('up', $initialBranch);
					$initialBranch.trigger(pressUpArrow);
				}.bind(this));

				this.$tree.tree({
					dataSource: this.dataSource
				});
			});

			QUnit.skip('when focus is below open sibling, moves focus into last focusable child of sibling', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});

			QUnit.skip('when focus is in first child of open branch, moves focus onto parent', function respondsToKeyboardInput (assert) {

			});

			QUnit.test('when focus is on node below open empty branch, moves focus onto empty branch', function loadTree (assert) {
				assert.expect(4);
				assert.notOk(emptyFolderData[0].children.length, 'empty branch has no children');

				this.$tree.on('initialized.fu.tree', function triggerDiscloseFolder () {
					var $initialBranch = $(this.$tree.find('li:not(".hidden")').get(1));
					var $emptyBranch = $(this.$tree.find('li:not(".hidden")').get(0));

					this.$tree.on('disclosedFolder.fu.tree', function triggerDownArrow () {
						assert.ok($emptyBranch.hasClass('tree-open'), 'empty branch is open');
						$initialBranch.attr('tabindex', 0);
						$initialBranch.focus();

						this.$tree.on('keyboardNavigated.fu.tree', function testDownArrowResult () {
							assert.equal($(document.activeElement).attr('id'), $emptyBranch.attr('id'), 'after up pressed, empty branch now has focus');
						});

						assert.equal($(document.activeElement).attr('id'), $initialBranch.attr('id'), 'branch below empty open branch has focus');

						var pressDownArrow = this.getKeyDown('up', $initialBranch);
						$initialBranch.trigger(pressDownArrow);
					}.bind(this));

					this.$tree.tree('discloseFolder', $emptyBranch);
				}.bind(this));

				this.$tree.tree({
					staticData: emptyFolderData
				});
			});
		});
	};
});
