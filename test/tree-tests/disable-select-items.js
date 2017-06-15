define(function disableSelectItemsModule () {
	return function disableSelectItemsWorks (assert) {
		this.$tree.tree({
			dataSource: this.dataSource,
			itemSelect: false
		});

		this.$tree.tree('selectItem', this.$tree.find('.tree-item:eq(1)'));
		assert.equal(this.$tree.tree('selectedItems').length, 0, 'Return no value');
	};
});
