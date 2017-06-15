define(function doesFolderPopulateModule (require) {
	var NUM_CHILDREN = require('./helpers').constants.NUM_CHILDREN;

	return function doesFolderPopulate (assert) {
		var $selNode;

		this.$tree.tree({
			dataSource: this.dataSource
		});

		$selNode = this.$tree.find('.tree-branch:eq(1)');
		this.$tree.tree('discloseFolder', $selNode.find('.tree-branch-name'));
		assert.equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');


		this.$selectableFolderTree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$selNode = this.$selectableFolderTree.find('.tree-branch:eq(1)');
		this.$selectableFolderTree.tree('discloseFolder', $selNode.find('.tree-branch-header'));
		assert.equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with sub-folders and items');
	};
});
