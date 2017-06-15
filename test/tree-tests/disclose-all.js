define(function discloseAllWorksModule () {
	return function discloseAllWorks (assert) {
		var ready = assert.async();
		var $tree = this.$tree2;

		$tree.tree({
			dataSource: this.dataSource,
			disclosuresUpperLimit: 2
		});

		assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, 0, '0 folders open');
		$tree.one('exceededDisclosuresLimit.fu.tree', function exceededDisclosuresLimit() {
			assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, 20, '20 folders open');

			$tree.one('closedAll.fu.tree', function closedAll() {
				assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, 0, '0 folders open');

				$tree.data('ignore-disclosures-limit', true);

				$tree.one('disclosedAll.fu.tree', function disclosedAll () {
					assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, 200, '200 folders open');
					ready();
				});

				$tree.tree('discloseAll');
			});

			$tree.tree('closeAll');
		});

		$tree.tree('discloseAll');
	};
});
