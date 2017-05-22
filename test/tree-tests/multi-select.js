define(function multiSelectWorksModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function multiSelectWorks (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			multiSelect: true
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		assert.equal($tree.tree('selectedItems').length, 2, 'Return multiple selected values');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected value');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			multiSelect: true,
			folderSelect: true
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(2)'));
		assert.equal($tree.tree('selectedItems').length, 2, 'Return multiple selected values');
		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
	};
});
