define(function doesCallDataSourceModule (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function doesCallDataSource (assert) {
		var $tree = $(html);
		$tree.tree({
			dataSource: function dataSource (options, callback) {
				assert.ok(true, 'dataSource function called prior to rendering');
				assert.equal(typeof options, 'object', 'dataSource provided options object');
				assert.equal(typeof callback, 'function', 'dataSource provided callback function');
				callback({
					data: []
				});
			}
		});
	};
});
