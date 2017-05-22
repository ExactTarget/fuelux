define(function singleSelectWorksModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function singleSelectWorks (assert) {
		var $tree = $(html).find('#MyTree');

		// MultiSelect: false is the default
		$tree.tree({
			dataSource: this.dataSource
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return new single selected value');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected item (none previously selected, 1st programatic selection)');

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd programatic selection)');

		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd programatic selection)');

		$tree.find('.tree-item:eq(1)').click();
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected item (item previously selected, 1st click selection)');

		$tree.find('.tree-branch-name:eq(1)').click();
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd click selection)');

		$tree.find('.tree-item:eq(2)').click();
		assert.equal($tree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd click selection)');
	};
});
