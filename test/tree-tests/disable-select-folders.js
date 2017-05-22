define(function disableSelectFoldersModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function disableSelectFoldersWorks (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: false
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 0, 'Return no value');
	};
});
