define(function discloseVisibleWorksModule (require) {
	var $ = require('jquery');

	return function discloseVisibleWorks (assert) {
		var ready = assert.async();
		var $tree = $('body').find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		var toBeOpened = $tree.find('.tree-branch:not(".tree-open, .hidden")').length;
		assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, 0, '0 folders open');

		$tree.one('disclosedVisible.fu.tree', function testDiscloseVisible () {
			assert.equal($tree.find('.tree-branch.tree-open:not(".hidden")').length, toBeOpened, toBeOpened + ' folders open');
			ready();
		});

		$tree.tree('discloseVisible');
	};
});
