/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
define(function (require) {
	var $ = require('jquery');
	var html = require('text!test/markup/tree-markup.html!strip');

	$('body').append(html);

	require('bootstrap');
	require('fuelux/tree');

	module("Fuel UX Tree", {
		setup: function () {
			var callLimit = 50;
			var callCount = 0;

			function guid () {
				function s4 () {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			}

			this.dataSource = function (options, callback) {
				if (callCount >= callLimit) {
					callback({
						data: [
							{
								"name": "Convex and Concave",
								"type": "item",
								"attr": {
									"id": "item4"
								}
							}
						]
					}, 400);
					return;
				}

				callCount++;

				callback({
					data: [
						{
							name: 'Ascending and Descending',
							type: 'folder',
							attr: {
								id: 'folder' + guid(),
							}
						},
						{
							name: 'Sky and Water I (with custom icon)',
							type: 'item',
							attr: {
								id: 'folder' + guid(),
								'data-icon': 'glyphicon glyphicon-file'
							}
						},
						{
							name: 'Drawing Hands',
							type: 'folder',
							attr: {
								id: 'folder' + guid(),
								'data-children': false
							}
						},
						{
							name: 'Waterfall',
							type: 'item',
							attr: {
								id: 'item2'
							}
						},
						{
							name: 'Belvedere',
							type: 'folder',
							attr: {
								id: 'folder' + guid(),
							}
						},
						{
							name: 'Relativity (with custom icon)',
							type: 'item',
							attr: {
								id: 'item3',
								'data-icon': 'glyphicon glyphicon-picture'
							}
						},
						{
							name: 'House of Stairs',
							type: 'folder',
							attr: {
								id: 'folder' + guid(),
							}
						},
						{
							name: 'Convex and Concave',
							type: 'item',
							attr: {
								id: 'item4'
							}
						},
						{
							name: 'Load More',
							type: 'overflow',
							attr: {
								id: 'overflow1'
							}
						}
					]
				});
			};

			this.textDataSource = function (options, callback) {
				callback({
					data: [
						{
							text: 'node text',
							type: 'folder',
							attr: {
								id: 'folder1'
							}
						}
					]
				});
			};

		}
	});

	var NUM_CHILDREN = 9;
	var NUM_FOLDERS = 4;
	var NUM_ITEMS = 4;
	var NUM_OVERFLOWS = 1;

	test("should be defined on jquery object", function () {
		ok($().tree, 'tree method is defined');
	});

	test("should return element", function () {
		var $tree = $(html);
		ok($tree.tree() === $tree, 'tree should be initialized');
	});

	test("should have correct defaults", function correctDefaults() {
		var $tree = $(html);

		var defaults = $tree.tree.defaults;

		equal(defaults.multiSelect, false, 'multiSelect defaults to false');
		equal(defaults.cacheItems, true, 'cacheItems defaults to true');
		equal(defaults.folderSelect, true, 'folderSelect defaults to true');
		equal(defaults.itemSelect, true, 'itemSelect defaults to true');
		equal(defaults.disclosuresUpperLimit, 0, 'disclosuresUpperLimit defaults to 0');
		ok(defaults.dataSource, 'dataSource exists by default');
	});

	test("should call dataSource correctly", function () {
		var $tree = $(html);
		$tree.tree({
			dataSource: function (options, callback) {
				ok(1 === 1, 'dataSource function called prior to rendering');
				equal(typeof options, 'object', 'dataSource provided options object');
				equal(typeof callback, 'function', 'dataSource provided callback function');
				callback({
					data: []
				});
			}
		});
	});

	test("Tree should be populated by items on initialization", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		equal($tree.find('.tree-branch:not([data-template])').length, NUM_FOLDERS, 'Initial set of folders have been added');
		equal($tree.find('.tree-item:not([data-template])').length, NUM_ITEMS, 'Initial set of items have been added');
		equal($tree.find('.tree-overflow:not([data-template])').length, NUM_OVERFLOWS, 'Initial overflow has been added');
	});

	test("Folder should populate when opened", function () {
		var $tree = $(html).find('#MyTree');
		var $selNode;

		$tree.tree({
			dataSource: this.dataSource
		});

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('discloseFolder', $selNode.find('.tree-branch-name'));
		equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$selNode = $tree.find('.tree-branch:eq(1)');
		$tree.tree('discloseFolder', $selNode.find('.tree-branch-header'));
		equal($selNode.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with sub-folders and items');
	});

	test("getValue alias should function", function() {
		var $tree = $(html).find('#MyTree');

		// multiSelect: false is the default
		$tree.tree({
			dataSource: this.dataSource
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		deepEqual($tree.tree('selectedItems'), $tree.tree('getValue'), 'getValue aliases selectedItems');
	});

	test("Single item/folder selection works as designed", function () {
		var $tree = $(html).find('#MyTree');

		// multiSelect: false is the default
		$tree.tree({
			dataSource: this.dataSource
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected value');
		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		equal($tree.tree('selectedItems').length, 1, 'Return new single selected value');

		$tree = $(html).find('#MyTreeSelectableFolder');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: true
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected item (none previously selected, 1st programatic selection)');

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd programatic selection)');

		$tree.tree('selectItem', $tree.find('.tree-item:eq(2)'));
		equal($tree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd programatic selection)');

		$tree.find('.tree-item:eq(1)').click();
		equal($tree.tree('selectedItems').length, 1, 'Return single selected item (item previously selected, 1st click selection)');

		$tree.find('.tree-branch-name:eq(1)').click();
		equal($tree.tree('selectedItems').length, 1, 'Return single selected folder (item previously selected, 2nd click selection)');

		$tree.find('.tree-item:eq(2)').click();
		equal($tree.tree('selectedItems').length, 1, 'Return single selected item (folder previously selected, 3rd click selection)');

	});

	// test("Overflow click works as designed", function () {
	// 	var $tree = $(html).find('#MyTree');

	// 	$tree.tree({
	// 		dataSource: this.dataSource
	// 	});

	// 	equal($tree.find('> li:not([data-template])').length, NUM_CHILDREN, 'Initial set of folders (' + NUM_CHILDREN + ' children) have been added');
	// 	$tree.find('.tree-overflow:eq(0)').click();
	// 	//Once overflow is clicked, all original contents is loaded again, and original overflow is actually REMOVED from tree contents.
	// 	var NUM_AFTER_OVERFLOW_CLICK = (NUM_CHILDREN * 2) - 1;
	// 	equal($tree.find('> li:not([data-template])').length, NUM_AFTER_OVERFLOW_CLICK, 'Overflow contents (now ' + NUM_AFTER_OVERFLOW_CLICK + ' children) have loaded');

	// });

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

	test("should not allow selecting items if disabled", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			itemSelect: false
		});

		$tree.tree('selectItem', $tree.find('.tree-item:eq(1)'));
		equal($tree.tree('selectedItems').length, 0, 'Return no value');
	});

	test("should not allow selecting folders if disabled", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource,
			folderSelect: false
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems').length, 0, 'Return no value');
	});

	test('folders should open and close correctly', function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		var $targetBranch = $($tree.find('.tree-branch')[0]);

		equal($targetBranch.hasClass('tree-open'), false, 'Branch starts closed');
		$tree.tree('discloseFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), true, 'discloseFolder opens folder');
		$tree.tree('discloseFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), true, 'redundant discloseFolder calls leaves folder open');
		$tree.tree('closeFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), false, 'closeFolder closes folder');
		$tree.tree('closeFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), false, 'redundant closeFolder calls leaves folder closed');
		$tree.tree('toggleFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), true, 'toggleFolder on closed folder opens folder');
		$tree.tree('toggleFolder', $targetBranch);
		equal($targetBranch.hasClass('tree-open'), false, 'toggleFolder on open folder closes folder');
	});

	asyncTest("should disclose visible folders", function () {
		var $tree = $('body').find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		var toBeOpened = $tree.find(".tree-branch:not('.tree-open, .hidden')").length;
		equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, 0, '0 folders open');

		$tree.one('disclosedVisible.fu.tree', function () {
			equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, toBeOpened, toBeOpened + ' folders open');
			start();
		});

		$tree.tree('discloseVisible');
	});

	asyncTest("should disclose all folders up to limit, and then close them, then open them all", function () {
		var $tree = $('body').find('#MyTree2');

		$tree.tree({
			dataSource: this.dataSource,
			disclosuresUpperLimit: 2
		});

		equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, 0, '0 folders open');
		$tree.one('exceededDisclosuresLimit.fu.tree', function exceededDisclosuresLimit() {
			equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, 20, '20 folders open');

			$tree.one('closedAll.fu.tree', function closedAll() {
				equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, 0, '0 folders open');

				$tree.data('ignore-disclosures-limit', true);

				$tree.one('disclosedAll.fu.tree', function exceededDisclosuresLimit() {
					equal($tree.find(".tree-branch.tree-open:not('.hidden')").length, 200, '200 folders open');
					start();
				});

				$tree.tree('discloseAll');
			});

			$tree.tree('closeAll');
		});

		$tree.tree('discloseAll');
	});

	test("should refresh an already opened/cached folder with new nodes", function () {
		var $tree = $(html).find('#MyTree');
		var $folderToRefresh;
		var initialLoadedFolderId, refreshedLoadedFolderId;
		var selector = '.tree-branch-children > li:eq(0)';

		$tree.tree({
			dataSource: this.dataSource
		});
		$folderToRefresh = $tree.find('.tree-branch:eq(1)');

		// open folder
		$tree.tree('discloseFolder', $folderToRefresh.find('.tree-branch-name'));
		equal($folderToRefresh.find('.tree-branch-children > li').length, NUM_CHILDREN, 'Folder has been populated with items/sub-folders');
		initialLoadedFolderId = $folderToRefresh.find(selector).attr('id');

		// refresh and see if it's the same ID
		$tree.tree('refreshFolder', $folderToRefresh);
		refreshedLoadedFolderId = $folderToRefresh.find('.tree-branch-children > li:eq(0)').attr('id');
		notEqual(refreshedLoadedFolderId, initialLoadedFolderId, 'Folder has been refreshed and populated with different items/sub-folders');
	});

	test("should destroy control", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.dataSource
		});

		equal(typeof ($tree.tree('destroy')), 'string', 'returns string (markup)');
		equal($tree.parent().length, false, 'control has been removed from DOM');
	});

	test("Tree should accept TEXT as the NAME property in the datasource", function () {
		var $tree = $(html).find('#MyTree');

		$tree.tree({
			dataSource: this.textDataSource
		});

		$tree.tree('selectFolder', $tree.find('.tree-branch-name:eq(1)'));
		equal($tree.tree('selectedItems')[0].text, 'node text', 'Param TEXT used in the datasource');
	});
});
