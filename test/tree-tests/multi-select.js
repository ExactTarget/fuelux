define(function multiSelectWorksModuleFactory () {
	return function multiSelectWorksModule (QUnit) {
		QUnit.module( 'multi', {}, function testDownKeyPresses () {
			QUnit.test('item works as designed', function loadTree (assert) {
				this.$tree.tree({
					dataSource: this.dataSource,
					multiSelect: true
				});

				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
				assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return single selected value');
				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(2)'));
				assert.equal(this.$tree.tree('selectedItems').length, 2, 'Return multiple selected values');
				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
				assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return single selected value');
			});

			QUnit.test('folder works as designed', function loadTree (assert) {
				this.$selectableFolderTree.tree({
					dataSource: this.dataSource,
					multiSelect: true,
					folderSelect: true
				});

				this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch:eq(1)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected value');
				this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch:eq(2)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 2, 'Return multiple selected values');
				this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch:eq(1)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected value');
			});

			QUnit.test('adds and removes aria-selected="true" to/from selected items', function loadTree (assert) {
				this.$tree.tree({
					dataSource: this.dataSource,
					multiSelect: true
				});

				var $toSelect1 = this.$tree.find('.tree-item:eq(1)');
				var $toSelect2 = this.$tree.find('.tree-item:eq(2)');

				assert.equal($toSelect1.attr('aria-selected'), 'false', "item 1's aria-selected attr present and set to false");
				assert.equal($toSelect2.attr('aria-selected'), 'false', "item 2's aria-selected attr present and set to false");

				this.$tree.tree('selectItem', $toSelect1);
				assert.ok($toSelect1.attr('aria-selected'), 'newly selected item 1 contains aria-selected="true"');
				assert.equal($toSelect2.attr('aria-selected'), 'false', "item 2's aria-selected attr still present and still set to false");

				this.$tree.tree('selectItem', $toSelect2);
				assert.ok($toSelect1.attr('aria-selected'), 'previously selected item 1 still contains aria-selected="true"');
				assert.ok($toSelect1.attr('aria-selected'), 'newly selected item 2 now contains aria-selected="true"');
			});

			QUnit.test('adds and removes aria-selected="true" to/from selected folders', function loadTree (assert) {
				this.$selectableFolderTree.tree({
					dataSource: this.dataSource,
					multiSelect: true,
					folderSelect: true
				});

				var $toSelect1 = this.$selectableFolderTree.find('.tree-branch:eq(1)');
				var $toSelect2 = this.$selectableFolderTree.find('.tree-branch:eq(2)');

				assert.equal($toSelect1.attr('aria-selected'), 'false', "item 1's aria-selected attr present and set to false");
				assert.equal($toSelect2.attr('aria-selected'), 'false', "item 2's aria-selected attr present and set to false");

				this.$selectableFolderTree.tree('selectItem', $toSelect1);
				assert.ok($toSelect1.attr('aria-selected'), 'newly selected item 1 contains aria-selected="true"');
				assert.equal($toSelect2.attr('aria-selected'), 'false', "item 2's aria-selected attr still present and still set to false");

				this.$selectableFolderTree.tree('selectItem', $toSelect2);
				assert.ok($toSelect1.attr('aria-selected'), 'previously selected item 1 still contains aria-selected="true"');
				assert.ok($toSelect1.attr('aria-selected'), 'newly selected item 2 now contains aria-selected="true"');
			});
		});
	};
});
