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
			this.dataSource = function (options, callback) {
				callback({
					data: [
						{ name: 'Ascending and Descending', type: 'folder', attr: { id: 'folder1' } },
						{ name: 'Sky and Water I (with custom icon)', type: 'item', attr: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
						{ name: 'Drawing Hands', type: 'folder', attr: { id: 'folder2', 'data-children': false } },
						{ name: 'Waterfall', type: 'item', attr: { id: 'item2' } },
						{ name: 'Belvedere', type: 'folder', attr: { id: 'folder3' } },
						{ name: 'Relativity (with custom icon)', type: 'item', attr: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
						{ name: 'House of Stairs', type: 'folder', attr: { id: 'folder4' } },
						{ name: 'Convex and Concave', type: 'item', attr: { id: 'item4' } }
					]
				});
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

	test("should call dataSource correctly", function () {
		var $tree= $(html);
		$tree.tree({
			dataSource: function(options, callback){
				ok(1===1, 'dataSource function called prior to rendering');
				equal(typeof options, 'object', 'dataSource provided options object');
				equal(typeof callback,'function', 'dataSource provided callback function');
				callback({data: []});
			}
		});
	});

	test("Tree should be populated by items on initialization", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({ dataSource: this.dataSource });

		equal($tree.find('.tree-branch').length, 5, 'Initial set of folders have been added');
		equal($tree.find('.tree-item').length, 5, 'Initial set of items have been added');
	});

	test("Folder should populate when opened", function(){
		var $tree = $(html).find('#MyTree');
		var $selNode;

		$tree.tree({ dataSource: this.dataSource });

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('openFolder', $selNode.find('.tree-branch-name'));
		equal($selNode.find('.tree-branch-children > li').length, 8, 'Folder has been populated with items/sub-folders');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('openFolder', $selNode.find('.tree-branch-header'));
		equal($selNode.find('.tree-branch-children > li').length, 4, 'Folder has been populated with sub-folders');
	});

	test("Single item/folder selection works as designed", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({ dataSource: this.dataSource });

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		equal($tree.tree('selectedItems').length, 1, 'Return new single selected value');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$tree.tree('selectItem', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-branch-name:eq(2)'));
		equal($tree.tree('selectedItems').length, 1, 'Return new single selected value');
	});

	test("Multiple item/folder selection works as designed", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			multiSelect: true
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		equal($tree.tree('selectedItems').length, 2, 'Return multiple selected values');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			multiSelect: true,
			folderSelect: true
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(2)'));
		equal($tree.tree('selectedItems').length, 2, 'Return multiple selected values');
		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
	});

	test("should destroy control", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		equal(typeof( $tree.tree('destroy')) , 'string', 'returns string (markup)');
		equal( $tree.parent().length, false, 'control has been removed from DOM');
	});
});
