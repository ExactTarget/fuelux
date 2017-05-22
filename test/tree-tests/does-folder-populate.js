define(function doesFolderPopulateModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');
	var NUM_CHILDREN = require('./helpers').constants.NUM_CHILDREN;

	return function doesFolderPopulate (assert) {
		var $tree = $(html).find('#MyTree');
		var $selNode;

		$tree.tree({
			dataSource: this.dataSource
		});

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('discloseFolder', $selNode.find('.tree-branch-name'));
		assert.equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('discloseFolder', $selNode.find('.tree-branch-header'));
		assert.equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with sub-folders and items');
	};
});
