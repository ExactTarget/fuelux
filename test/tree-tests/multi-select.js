define(function multiSelectWorksModule () {
	return function multiSelectWorks (assert) {
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


		this.$selectableFolderTree.tree({
			dataSource: this.dataSource,
			multiSelect: true,
			folderSelect: true
		});

		this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch-name:eq(1)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected value');
		this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch-name:eq(2)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 2, 'Return multiple selected values');
		this.$selectableFolderTree.tree('selectFolder', this.$selectableFolderTree.find('.tree-branch-name:eq(1)'));
		assert.equal(this.$selectableFolderTree.tree('selectedItems').length, 1, 'Return single selected value');
	};
});
