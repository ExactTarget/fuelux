define(function refreshWorksModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');
	var NUM_CHILDREN = require('./helpers').constants.NUM_CHILDREN;

	return function refreshWorks (assert) {
		var $tree = $(html).find('#MyTree');
		var $folderToRefresh;
		var initialLoadedFolderId;
		var refreshedLoadedFolderId;
		var selector = '.tree-branch-children > li:eq(0)';

		$tree.tree({
			dataSource: this.dataSource
		});
		$folderToRefresh = $tree.find('.tree-branch:eq(1)');

		// Open folder
		$tree.tree('discloseFolder', $folderToRefresh.find('.tree-branch-name'));
		assert.equal($folderToRefresh.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');
		initialLoadedFolderId = $folderToRefresh.find(selector).attr('id');

		// Refresh and see if it's the same ID
		$tree.tree('refreshFolder', $folderToRefresh);
		refreshedLoadedFolderId = $folderToRefresh.find('.tree-branch-children > li:eq(0)').attr('id');
		assert.notEqual(refreshedLoadedFolderId, initialLoadedFolderId, 'Folder has been refreshed and populated with different items/sub-folders');
	};
});
