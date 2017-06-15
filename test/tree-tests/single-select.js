define(function singleSelectWorksModuleFactory () {
	var $ = require('jquery');

	return function singleSelectWorksModule (QUnit) {
		QUnit.module( 'single', {}, function testDownKeyPresses () {
			QUnit.test('item works as designed', function loadTree (assert) {
				// MultiSelect: false is the default
				this.$tree.tree({
					dataSource: this.dataSource
				});

				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
				assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return single selected value');
				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(2)'));
				assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return new single selected value');
			});

			QUnit.test('folder works as designed', function loadTree (assert) {
				this.$selectableFolderTree.tree({
					dataSource: this.dataSource,
					folderSelect: true
				});

				this.$selectableFolderTree.tree('selectItem', this.$selectableFolderTree.find('.tree-item:eq(1)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (none previously selected, 1st programatic selection)');

				this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch:eq(1)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd programatic selection)');

				this.$selectableFolderTree.tree('selectItem', this.$selectableFolderTree.find('.tree-item:eq(2)'));
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd programatic selection)');

				this.$selectableFolderTree.find('.tree-item:eq(1)').click();
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (item previously selected, 1st click selection)');

				this.$selectableFolderTree.find('.tree-branch:eq(1)').click();
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd click selection)');

				this.$selectableFolderTree.find('.tree-item:eq(2)').click();
				assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd click selection)');
			});

			QUnit.test('adds and removes aria-selected="true" to/from selected item', function loadTree (assert) {
				// MultiSelect: false is the default
				this.$tree.tree({
					dataSource: this.dataSource
				});

				var $toSelect = this.$tree.find('.tree-item:eq(1)');
				assert.equal($toSelect.attr('aria-selected'), 'false', "item's aria-selected attr present and set to false");
				this.$tree.tree('selectItem', $toSelect);
				assert.ok($toSelect.attr('aria-selected'), 'newly selected item contains aria-selected="true"');
				this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(2)'));
				assert.equal($toSelect.attr('aria-selected'), 'false', "newly deselected item's aria-selected attr present and set to false");
			});

			QUnit.test('adds and removes aria-selected="true" to/from selected folder', function loadTree (assert) {
				this.$selectableFolderTree.tree({
					dataSource: this.dataSource,
					folderSelect: true
				});

				var $toSelect = this.$selectableFolderTree.find('.tree-branch:eq(1)');
				assert.equal($toSelect.attr('aria-selected'), 'false', "item's aria-selected attr present and set to false");
				this.$selectableFolderTree.tree('selectItem', $toSelect);
				assert.ok($toSelect.attr('aria-selected'), 'newly selected item contains aria-selected="true"');
				this.$selectableFolderTree.tree('selectItem', this.$selectableFolderTree.find('.tree-item:eq(2)'));
				assert.equal($toSelect.attr('aria-selected'), 'false', "newly deselected item's aria-selected attr present and set to false");
			});
		});
	};
});
