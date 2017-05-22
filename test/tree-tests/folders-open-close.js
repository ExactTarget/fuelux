define(function foldersOpenCloseModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function foldersOpenClose (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		var $targetBranch = $($tree.find('.tree-branch')[ 0 ]);

		assert.equal($targetBranch.hasClass('tree-open'), false, 'Branch starts closed');
		$tree.tree('discloseFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'discloseFolder opens folder');
		$tree.tree('discloseFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'redundant discloseFolder calls leaves folder open');
		$tree.tree('closeFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'closeFolder closes folder');
		$tree.tree('closeFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'redundant closeFolder calls leaves folder closed');
		$tree.tree('toggleFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), true, 'toggleFolder on closed folder opens folder');
		$tree.tree('toggleFolder', $targetBranch);
		assert.equal($targetBranch.hasClass('tree-open'), false, 'toggleFolder on open folder closes folder');
	};
});
