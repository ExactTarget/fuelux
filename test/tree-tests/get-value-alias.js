define(function getValueAliasModule () {
	return function getValueAliasWorks (assert) {
		// MultiSelect: false is the default
		this.$tree.tree({
			dataSource: this.dataSource
		});

		this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
		assert.deepEqual(this.$tree.tree('selectedItems'), this.$tree.tree('getValue'), 'getValue aliases selectedItems');
	};
});
