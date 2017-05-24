define(function refreshWorksModule (require) {
	var NUM_CHILDREN = require('./helpers').constants.NUM_CHILDREN;

	return function refreshWorks (assert) {
		var $folderToRefresh;
		var initialLoadedFolderId;
		var refreshedLoadedFolderId;
		var selector = '.tree-branch-children > li:eq(0)';

		this.$tree.tree({
			dataSource: this.dataSource
		});
		$folderToRefresh = this.$tree.find('.tree-branch:eq(1)');

		// Open folder
		this.$tree.tree('discloseFolder', $folderToRefresh.find('.tree-branch-name'));
		assert.equal($folderToRefresh.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');
		initialLoadedFolderId = $folderToRefresh.find(selector).attr('id');

		// Refresh and see if it's the same ID
		this.$tree.tree('refreshFolder', $folderToRefresh);
		refreshedLoadedFolderId = $folderToRefresh.find('.tree-branch-children > li:eq(0)').attr('id');
		assert.notEqual(refreshedLoadedFolderId, initialLoadedFolderId, 'Folder has been refreshed and populated with different items/sub-folders');
	};
});
