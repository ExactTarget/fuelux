define(function Module (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	return function tabIndexModule (QUnit) {
		QUnit.module( 'tab indexes', {}, function testTabIndexes () {
			QUnit.skip('are all set to -1 on tree load', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
			QUnit.skip('are set to 1 for selected items', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
			QUnit.skip('are all set to -1 on new item selection', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
			QUnit.skip('root tree element is set to -1 on item selection', function loadTree (assert) {
				// Skipped due to time constraints. If you touch this part of the tree, please complete this test
			});
		});
	};
});
