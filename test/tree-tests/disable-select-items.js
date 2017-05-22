define(function disableSelectItemsModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function disableSelectItemsWorks (assert) {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			itemSelect: false
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		assert.equal($tree.tree('selectedItems').length, 0, 'Return no value');
	};
});
