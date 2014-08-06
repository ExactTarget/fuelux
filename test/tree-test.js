/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html');

	require('bootstrap');
	require('fuelux/tree');

	module("Fuel UX Tree", {
		setup: function(){
			this.emptyDataSource = function (options, callback) {
				setTimeout(function () {
					callback({ data: []});
				}, 0);
			};

			this.stubDataSource = function (options, callback) {
				setTimeout(function () {
					callback({
						data: [
						{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
						{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
						{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'folder2', 'data-children': false } },
						{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
						{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'folder3' } },
						{ name: 'Relativity (with custom icon)', type: 'item', dataAttributes: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
						{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'folder4' } },
						{ name: 'Convex and Concave', type: 'item', dataAttributes: { id: 'item4' } }
						]
					});
				}, 0);
			};

		}
	});

	test("should be defined on jquery object", function () {
		ok($().tree, 'tree method is defined');
	});

	test("should return element", function () {
		var $tree = $(html);
		ok($tree.tree() === $tree, 'tree should be initialized');
	});

	asyncTest("Tree should be populated by items on initialization", function () {

		var $tree = $(html).find('#MyTree').tree({ dataSource: this.stubDataSource }).on('loaded.fu.tree', function () {

			equal($tree.find('.tree-branch').length, 5, 'Initial set of folders have been added');
			equal($tree.find('.tree-item').length, 5, 'Initial set of items have been added');

			start();
		});

	});

//	asyncTest("Folders should be populated when folder is clicked", function () {
//
//		var $tree = $(html).tree({ dataSource: this.stubDataSource }).on('loaded.fu.tree, function () {
//
//			var $folder = $tree.find('.tree-folder:eq(1)');
//			var event = 0;
//
//			$tree.off('loaded');
//
//			$tree.on('opened.fu.tree', function () {
//				event++;
//			});
//
//			$tree.on('closed.fu.tree', function () {
//				event++;
//			});
//
//			$tree.tree('selectFolder', $folder[0]);
//
//			$tree.on('loaded.fu.tree', function() {
//				$tree.off('loaded');
//
//				equal($folder.find('.tree-folder').length, 2, 'Folders have populated');
//				equal($folder.find('.tree-item').length, 2, 'Items have populated');
//
//				equal(event, 1, 'Open event triggered');
//
//				$tree.tree('selectFolder', $folder[0]);
//				$tree.on('loaded.fu.tree', function() {
//					equal(event, 2, 'Close event triggered');
//					start();
//				});
//			});
//
//		});
//
//	});

	asyncTest("Single item selection works as designed", function () {

		var $tree = $(html).find('#MyTree').tree({ dataSource: this.stubDataSource }).on('loaded.fu.tree',function() {

			var data;

			$tree.on('selected.fu.tree', function (e, items) {
				data = items.selected;
			});

			$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
			equal(data.length, 1, 'Single item selected');
			equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
			$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
			equal(data.length, 1, 'New single item selected');
			equal($tree.tree('selectedItems').length, 1, 'Return new single selected value');

			start();
		});

	});

	asyncTest("Multiple item selection works as designed", function () {

		var $tree = $(html).find('#MyTree').tree({ dataSource: this.stubDataSource, multiSelect: true }).on('loaded.fu.tree',function() {

			var data;

			$tree.on('selected.fu.tree', function (e, items) {
				data = items.selected;
			});

			$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
			equal(data.length, 1, 'Single item selected');
			equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
			$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
			equal(data.length, 2, 'Double item selected');
			equal($tree.tree('selectedItems').length, 2, 'Return multiple selected values');
			$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
			equal(data.length, 1, 'Duplicate selection');

			start();
		});

	});


	asyncTest('should destroy control', function () {

		var $tree = $(html).find('#MyTree').tree({ dataSource: this.stubDataSource, multiSelect: true }).on('loaded.fu.tree',function() {

			var $el = $(this);

			equal(typeof( $el.tree('destroy')) , 'string', 'returns string (markup)');
			equal( $el.parent().length, false, 'control has been removed from DOM');

			start();
		});

	});


});
