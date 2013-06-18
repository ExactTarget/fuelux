/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/tree'], function($) {

	module("Fuel UX tree", { setup: testSetup });

	test("should be defined on jquery object", function () {
		ok($(document.body).tree, 'tree method is defined');
	});

	test("should return element", function () {
		ok($(document.body).tree({ dataSource: this.emptyDataSource })[0] === document.body, 'document.body returned');
	});

	asyncTest("Tree should be populated by items on initialization", function () {

		var $tree = $(this.treeHTML).tree({ dataSource: this.stubDataSource }).on('loaded', function () {

			equal($tree.find('.tree-folder').length, 3, 'Initial set of folders have been added');
			equal($tree.find('.tree-item').length, 3, 'Initial set of items have been added');

			start();
		});

	});

	asyncTest("Folders should be populated when folder is clicked", function () {

		var $tree = $(this.treeHTML).tree({ dataSource: this.stubDataSource }).on('loaded', function () {

			var $folder = $tree.find('.tree-folder:eq(1)');
			var event = 0;

			$tree.off('loaded');

			$tree.on('opened', function () {
				event++;
			});

			$tree.on('closed', function () {
				event++;
			});

			$tree.tree('selectFolder', $folder[0]);

			$tree.on('loaded', function() {
				$tree.off('loaded');

				equal($folder.find('.tree-folder').length, 2, 'Folders have populated');
				equal($folder.find('.tree-item').length, 2, 'Items have populated');

				equal(event, 1, 'Open event triggered');

				$tree.tree('selectFolder', $folder[0]);
				$tree.on('loaded', function() {
					equal(event, 2, 'Close event triggered');
					start();
				});
			});

		});

	});

	asyncTest("Single item selection works as designed", function () {

		var $tree = $(this.treeHTML).tree({ dataSource: this.stubDataSource }).on('loaded',function() {

			var data;

			$tree.on('selected', function (e, items) {
				data = items.info;
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

		var $tree = $(this.treeHTML).tree({ dataSource: this.stubDataSource, multiSelect: true }).on('loaded',function() {

			var data;

			$tree.on('selected', function (e, items) {
				data = items.info;
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

	function testSetup() {

		this.emptyDataSource = {
			data: function (options, callback) {
				setTimeout(function () {
					callback({ data: []});
				}, 0);
			}
		};

		this.stubDataSource = {
			data: function (options, callback) {

				setTimeout(function () {
					callback({
						data: [
							{ name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F1' } },
							{ name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F2' } },
							{ name: 'Test Item 1', type: 'item', additionalParameters: { id: 'I1' } },
							{ name: 'Test Item 2', type: 'item', additionalParameters: { id: 'I2' } }
						]
					});
				}, 0);

			}
		};

		this.treeHTML =	'<div id="ex-tree" class="tree">' +
							'<div class = "tree-folder" style="display:none;">' +
								'<div class="tree-folder-header">' +
									'<i class="icon-folder-close"></i>' +
									'<div class="tree-folder-name"></div>' +
								'</div>' +
								'<div class="tree-folder-content"></div>' +
								'<div class="tree-loader" style="display:none"></div>' +
							'</div>' +
							'<div class="tree-item" style="display:none;">' +
								'<i class="tree-dot"></i>' +
								'<div class="tree-item-name"></div>' +
							'</div>' +
						'</div>';
	}
});
