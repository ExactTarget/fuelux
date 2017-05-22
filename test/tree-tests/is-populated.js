define(function isTreePopulatedModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');
	var constants = require('./helpers').constants;

	return function isTreePopulated (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		assert.equal($tree.find('.tree-branch:not([data-template])').length, constants.NUM_FOLDERS, 'Initial set of folders have been added');
		assert.equal($tree.find('.tree-item:not([data-template])').length, constants.NUM_ITEMS, 'Initial set of items have been added');
		assert.equal($tree.find('.tree-overflow:not([data-template])').length, constants.NUM_OVERFLOWS, 'Initial overflow has been added');
	};
});
