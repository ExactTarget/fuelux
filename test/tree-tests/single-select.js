define(function singleSelectWorksModule () {
	return function singleSelectWorks (assert) {
		// MultiSelect: false is the default
		this.$tree.tree({
			dataSource: this.dataSource
		});

		this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
		assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return single selected value');
		this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(2)'));
		assert.equal(this.$tree.tree('selectedItems').length, 1, 'Return new single selected value');


		this.$selectableFolderTree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		this.$selectableFolderTree.tree('selectItem', this.$selectableFolderTree.find('.tree-item:eq(1)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (none previously selected, 1st programatic selection)');

		this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch-name:eq(1)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd programatic selection)');

		this.$selectableFolderTree.tree('selectItem', this.$selectableFolderTree.find('.tree-item:eq(2)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd programatic selection)');

		this.$selectableFolderTree.find('.tree-item:eq(1)').click();
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (item previously selected, 1st click selection)');

		this.$selectableFolderTree.find('.tree-branch-name:eq(1)').click();
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd click selection)');

		this.$selectableFolderTree.find('.tree-item:eq(2)').click();
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd click selection)');
	};
});
