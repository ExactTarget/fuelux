define(function disableSelectFoldersModule () {
	return function disableSelectFoldersWorks (assert) {
		this.$tree.tree({
			dataSource: this.dataSource,
			folderSelect: false
		});

		this.$tree.tree('selectFolder', this.$tree.find('.tree-branch-name:eq(1)'));
		assert.equal(this.$tree.tree('selectedItems').length, 0, 'Return no value');
	};
});
