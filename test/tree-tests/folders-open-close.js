define(function foldersOpenCloseModule (require) {
	var $ = require('jquery');

	return function foldersOpenClose (assert) {
		this.$tree.tree({
			dataSource: this.dataSource
		});

		var $targetBranch = $(this.$tree.find('.tree-branch')[ 0 ]);

		assert.equal($targetBranch.hasClass('tree-open'), false, 'Branch starts closed');
		this.$tree.tree('discloseFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'discloseFolder opens folder');
		this.$tree.tree('discloseFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'redundant discloseFolder calls leaves folder open');
		this.$tree.tree('closeFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'closeFolder closes folder');
		this.$tree.tree('closeFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'redundant closeFolder calls leaves folder closed');
		this.$tree.tree('toggleFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'toggleFolder on closed folder opens folder');
		this.$tree.tree('toggleFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'toggleFolder on open folder closes folder');
	};
});
