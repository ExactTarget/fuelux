define(function getValueAliasModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function getValueAliasWorks (assert) {
		var $tree = $(html).find('#MyTree');

		// MultiSelect: false is the default
		$tree.tree({
			dataSource: this.dataSource
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.deepEqual($tree.tree('selectedItems'), $tree.tree('getValue'), 'getValue aliases selectedItems');
	};
});
