define(function treeAcceptsNameModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function treeAcceptsName (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.textDataSource
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		assert.equal($tree.tree('selectedItems')[ 0 ].text, 'node text', 'Param TEXT used in the datasource');
	};
});
