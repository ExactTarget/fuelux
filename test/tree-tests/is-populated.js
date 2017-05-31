define(function isTreePopulatedModule (require) {
	var constants = require('./helpers').constants;

	return function isTreePopulated (assert) {
		assert.expect( 3 );
		this.$tree.tree({
			dataSource: this.dataSource
		});

		assert.equal(this.$tree.find('.tree-branch:not([data-template])').length, constants.NUM_FOLDERS, 'Initial set of folders have been added');
		assert.equal(this.$tree.find('.tree-item:not([data-template])').length, constants.NUM_ITEMS, 'Initial set of items have been added');
		assert.equal(this.$tree.find('.tree-overflow:not([data-template])').length, constants.NUM_OVERFLOWS, 'Initial overflow has been added');
	};
});
