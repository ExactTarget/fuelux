define(function Module () {
	return function destroyWorks (assert) {
		assert.equal(typeof (this.$tree.tree('destroy')), 'string', 'returns string (markup)');
		assert.equal(this.$tree.parent().length, false, 'control has been removed from DOM');
	};
});
