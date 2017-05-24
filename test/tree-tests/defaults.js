define(function correctDefaultsModule () {
	return function correctDefaults (assert) {
		var defaults = this.$tree.tree.defaults;

		assert.equal(defaults.multiSelect, false, 'multiSelect defaults to false');
		assert.equal(defaults.cacheItems, true, 'cacheItems defaults to true');
		assert.equal(defaults.folderSelect, true, 'folderSelect defaults to true');
		assert.equal(defaults.itemSelect, true, 'itemSelect defaults to true');
		assert.equal(defaults.disclosuresUpperLimit, 0, 'disclosuresUpperLimit defaults to 0');
		assert.ok(defaults.dataSource, 'dataSource exists by default');
	};
});
