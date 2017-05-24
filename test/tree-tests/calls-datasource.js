define(function doesCallDataSourceModule (require) {
	var $ = require('jquery');

	return function doesCallDataSource (assert) {
		assert.expect( 3 );

		this.$tree.tree({
			dataSource: function dataSource (options, callback) {
				assert.ok(true, 'dataSource function called prior to rendering');
				assert.equal(typeof options, 'object', 'dataSource provided options object');
				assert.equal(typeof callback, 'function', 'dataSource provided callback function');
				callback({
					data: []
				});
			}
		});

		var $fixture = $( '#qunit-fixture' );

		$fixture.append(this.$tree);
	};
});
