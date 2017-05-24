define(function treeAcceptsNameModule () {
	return function treeAcceptsName (assert) {
		this.$tree.tree({
			dataSource: this.textDataSource
		});

		this.$tree.tree('selectFolder', this.$tree.find('.tree-branch-name:eq(1)'));
		assert.equal(this.$tree.tree('selectedItems')[ 0 ].text, 'node text', 'Param TEXT used in the datasource');
	};
});
