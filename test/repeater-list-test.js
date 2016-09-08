/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function repeaterListTest (require) {
	var $ = require('jquery');
	var data = require('data');

	var makeDataSource = function makeDataSource (columns, items) {
		return function dataSource (options, callback) {
			// TODO: add 'itemDeselected.fu.repeater-list' event test
			var itemData = items || data.repeater.listData;

			var resp = {
				count: itemData.length,
				items: [],
				page: options.pageIndex
			};

			resp.pages = Math.ceil(resp.count / (options.pageSize || 50));

			var i = options.pageIndex * (options.pageSize || 50);
			var l = i + (options.pageSize || 50);
			l = (l <= resp.count) ? l : resp.count;
			resp.start = i + 1;
			resp.end = l;

			resp.columns = columns || [
				{
					label: 'Common Name',
					property: 'commonName',
					sortable: true
				},
				{
					label: 'Latin Name',
					property: 'latinName',
					sortable: true
				},
				{
					label: 'Appearance',
					property: 'appearance',
					sortable: true
				},
				{
					label: 'Sound',
					property: 'sound',
					sortable: true
				}
			];

			if (!noItems) {
				for (i; i < l; i++) {
					resp.items.push(itemData[i]);
				}
			}

			callback(resp);
		};
	};
	var dataSource = makeDataSource();
	var html = require('text!test/markup/repeater-markup.html!strip');
	var noItems = false;

	require('bootstrap');
	require('fuelux/repeater');
	require('fuelux/repeater-list');

	module('Fuel UX Repeater List', {
		setup: function setup () {
			this.$markup = $(html);
			this.$markup.find('.repeater-views').append('' +
				'<label class="btn btn-default active">' +
				'<input name="repeaterViews" type="radio" value="list">' +
				'<span class="glyphicon glyphicon-list"></span>' +
				'</label>');
		}
	});

	test('should be defined on jquery object', function jqueryDefined () {
		ok($.fn.repeater.viewTypes.list, 'repeater-list view plugin is defined');
	});

	asyncTest('should render correctly', function rendered () {
		var headingColumns = ['Common Name', 'Latin Name', 'Appearance', 'Sound'];
		var itemColumns = ['cat', 'Felis catus', 'small, usually furry, domesticated carnivorous mammal', 'Meow meow!'];
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			start();
			var $list = $repeater.find('.repeater-list');
			var i;
			var $tbody;

			equal($list.length, 1, 'repeater-list rendered');
			equal($list.find('.repeater-list-wrapper').length, 1, 'repeater-list-wrapper rendered');
			equal($list.find('table').length, 1, 'repeater-list table rendered');
			equal($list.find('thead').length, 1, 'repeater-list thead rendered');
			i = 0;
			$repeater.find('thead th').each(function eachTH () {
				equal($(this).find('.repeater-list-heading').text(), headingColumns[i], 'repeater-list rendered correct heading column');
				i++;
			});
			$tbody = $list.find('tbody');
			equal($tbody.length, 1, 'repeater-list tbody rendered');
			i = 0;
			$tbody.find('tr:first td').each(function eachTD () {
				equal($(this).text(), itemColumns[i], 'repeater-list rendered correct item column');
				i++;
			});
			i = $tbody.find('tr');
			equal(i.length, 10, 'repeater-list rendered appropriate number of rows');
		});

		$repeater.repeater({
			dataSource: dataSource
		});
	});

	asyncTest('should render in a reasonable amount of time.', function speetTest () {
		var $repeater = $(this.$markup);

		var startRender = Date.now();

		$repeater.one('loaded.fu.repeater', function reapeaterLoaded () {
			start();
			var doneRender = (Date.now() - startRender) / 1000;
			ok(doneRender < 2, 'Took less than 2 seconds to render. Rendered in ' + doneRender + ' seconds.');
		});

		var columnData = require('./data/enormousColumnData');
		var itemData = require('./data/enormousItemData');
		$repeater.repeater({ dataSource: makeDataSource(columnData, itemData) });
	});

	asyncTest('should call column and row callbacks correctly', function callsCallbacks () {
		var hasCalled = { column: false, row: false };
		var num = { cols: 0, rows: 0 };
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function reapeaterLoaded () {
			start();
			equal(num.cols, 40, 'columnRendered callback called expected number of times');
			equal(num.rows, 10, 'rowRendered callback called expected number of times');
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_columnRendered: function columnRendered (helpers, callback) {
				if (!hasCalled.column) {
					ok(true, 'columnRendered callback called upon rendering column');
					equal((helpers.container.length > 0 && helpers.item.length > 0), true, 'columnRendered helpers object contains appropriate attributes');
					equal((helpers.rowData instanceof Array), false, 'rowRendered rowData is an object');
					equal((typeof helpers.rowData.appearance), 'string', 'rowRendered rowData is an item from the dataSource');
					hasCalled.column = true;
				}
				num.cols++;
				callback();
			},
			list_rowRendered: function rowRendered (helpers, callback) {
				if (!hasCalled.row) {
					ok(true, 'rowRendered callback called upon rendering column');
					equal((helpers.rowData instanceof Array), false, 'rowRendered rowData is an object');
					equal((typeof helpers.rowData.appearance), 'string', 'rowRendered rowData is an item from the dataSource');
					equal((helpers.container.length > 0 && helpers.item.length > 0), true, 'rowRendered helpers object contains appropriate attributes');
					hasCalled.row = true;
				}
				num.rows++;
				callback();
			}
		});
	});

	asyncTest('should handle sorting option correctly', function sortingHandled () {
		var $repeater = $(this.$markup);
		var count = 0;
		var $first;

		$repeater.on('loaded.fu.repeater', function repeaterLoaded (e, options) {
			count++;

			switch (count) {
			case 1:
				$first = $repeater.find('.repeater-list thead .repeater-list-heading:first');
				$first.click();
				break;
			case 2:
				equal(($first.hasClass('sorted') && $first.find('span').hasClass('glyphicon-chevron-up')), true, 'asc sorted header has appropriate class and icon');
				equal(options.sortDirection, 'asc', 'dataSource passed appropriate sortDirection value');
				equal(options.sortProperty, 'commonName', 'dataSource passed appropriate sortProperty value');
				$first.click();
				break;
			case 3:
				equal(($first.hasClass('sorted') && $first.find('span').hasClass('glyphicon-chevron-down')), true, 'desc sorted header has appropriate class and icon');
				equal(options.sortDirection, 'desc', 'dataSource passed appropriate sortDirection value');
				equal(options.sortProperty, 'commonName', 'dataSource passed appropriate sortProperty value');
				$first.click();
				break;
			case 4:
				equal($first.hasClass('sorted'), false, 'previously sorted header reverted to non-sorted');
				equal(options.sortDirection, undefined, 'dataSource passed appropriate sortDirection value');
				equal(options.sortProperty, undefined, 'dataSource passed appropriate sortProperty value');
				$repeater.off('loaded.fu.repeater');
				start();
				break;
			default:
				break;
			}
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_sortClearing: true
		});
	});

	asyncTest('should highlight correct sorted column', function highlightsColumn () {
		var count = 0;
		var $repeater = $(this.$markup);
		var $col;
		var num;

		$repeater.on('loaded.fu.repeater', function loadedRepeater () {
			count++;

			switch (count) {
			case 1:
				$repeater.find('.repeater-list thead th:nth-child(1) .repeater-list-heading').click();
				break;
			case 2:
				$col = $repeater.find('.repeater-list tbody tr:first-child td:nth-child(1)');
				equal($col.hasClass('sorted'), true, 'correct sorted column highlighted');
				num = 0;
				$repeater.find('.repeater-list tbody tr').each(function eachTR () {
					if ($(this).find('td:nth-child(1)').hasClass('sorted')) {
						num++;
					}
				});
				equal(num, 10, 'correct number of columns highlighted');
				$repeater.off('loaded.fu.repeater');
				start();
				break;
			default:
				break;
			}
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_highlightSortedColumn: true
		});
	});

	asyncTest('should handle noItemsHTML option correctly', function noItemsHTMLHandled () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			start();
			var txt = $repeater.find('.repeater-list tbody tr.empty').text();
			equal(txt, 'TEST', 'correct noItemsHTML content appended when appropriate');
			noItems = false;
		});

		noItems = true;
		$repeater.repeater({
			dataSource: dataSource,
			list_noItemsHTML: 'TEST'
		});
	});

	asyncTest('should handle selectable (single) option correctly', function selectableSingleHandled () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			start();
			var $items = $repeater.find('.repeater-list tbody');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			equal($firstRow.hasClass('selectable'), true, 'rows have selectable class as expected');
			$firstRow.click();
			equal($firstRow.hasClass('selected'), true, 'row has selected class after being clicked as expected');
			$lastRow.click();
			equal((!$firstRow.hasClass('selected') && $lastRow.hasClass('selected')), true, 'selected class transferred to different row when clicked');
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: true
		});
	});

	asyncTest('should handle selectable (multi) option correctly', function selectableMultiHandled () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			start();
			var $items = $repeater.find('.repeater-list tbody');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			equal($firstRow.hasClass('selectable'), true, 'rows have selectable class as expected');
			$firstRow.click();
			equal($firstRow.hasClass('selected'), true, 'row has selected class after being clicked as expected');
			$lastRow.click();
			equal(($firstRow.hasClass('selected') && $lastRow.hasClass('selected')), true, 'both rows have selected class after another click');
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should clear selected items', function clearSelected () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			var $items = $repeater.find('.repeater-list tbody');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			$firstRow.click();
			$lastRow.click();

			setTimeout(function clearSelectedItems () {
				start();
				$repeater.repeater('list_clearSelectedItems');
				equal((!$firstRow.hasClass('selected') && !$lastRow.hasClass('selected')), true, 'selected items cleared as expected');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should get selected items', function getSelectedItems () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			var $items = $repeater.find('.repeater-list tbody');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');
			var selected;

			$firstRow.click();
			$lastRow.click();

			setTimeout(function getSelectedItemsCompleted () {
				start();
				selected = $repeater.repeater('list_getSelectedItems');
				var getValue = $repeater.repeater('getValue');
				equal(selected.length, 2, 'returned array contains appropriate number of items');
				equal((typeof selected[0].data === 'object' && selected[0].element.length > 0), true, 'items in returned array contain appropriate object and attributes');
				deepEqual(selected, getValue, 'getValue aliases selected');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should set selected items', function setSelectedItems () {
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			var $items = $repeater.find('.repeater-list tbody');

			setTimeout(function repeaterLoadedCompleted () {
				start();

				$repeater.repeater('list_setSelectedItems', [{ index: 0 }]);
				equal($repeater.repeater('list_getSelectedItems').length, 1, 'correct number of items selected');
				equal($items.find('tr:first').hasClass('selected'), true, 'correct row selected by index');

				$repeater.repeater('list_setSelectedItems', [{ property: 'commonName', value: 'pig' }]);
				equal($repeater.repeater('list_getSelectedItems').length, 1, 'correct number of items selected');
				equal($items.find('tr:nth-child(5)').hasClass('selected'), true, 'correct row selected by property/value');

				$repeater.repeater('list_setSelectedItems', [{ index: 0 }, { property: 'commonName', value: 'dog' }], true);
				equal($repeater.repeater('list_getSelectedItems').length, 4, 'correct number of items selected when using force');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: true
		});
	});

	asyncTest('actions column should show up when enabled', function actionColumnShown () {
		var $repeater = $(this.$markup);
		var repeaterOptions = {
			dataSource: dataSource,
			list_actions: {
				width: 37,
				items: [
					{
						name: 'edit',
						html: '<span class="glyphicon glyphicon-pencil"></span> Edit'
					},
					{
						name: 'copy',
						html: '<span class="glyphicon glyphicon-copy"></span> Copy'
					},
					{
						name: 'delete',
						html: '<span class="glyphicon glyphicon-trash"></span> Delete',
						clickAction: function onClick (helpers, callback, e) {
							testClickAction(helpers, callback, e);
							callback();
						}
					}
				]
			}
		};

		$repeater.one('loaded.fu.repeater', function repeaterLoaded () {
			var $repeaterCanvas = $repeater.find('.repeater-canvas');
			var $actionsTable = $repeater.find('table.table-actions');
			var $firstActionRowBtn = $actionsTable.find('tbody tr:first button');
			var $actionItem = $actionsTable.find('tbody tr:first li:last a');

			$firstActionRowBtn.dropdown('toggle');

			setTimeout(function repeaterLoadedCompleted () {
				start();

				equal($repeaterCanvas.hasClass('actions-enabled'), true, 'actions-enabled class added to repeater canvas');

				equal($actionsTable.length !== 0 && $actionsTable.length === 1, true, 'Actions table was created and only one');

				equal($repeater.find('.actions-column-wrapper').width() === repeaterOptions.list_actions.width, true, 'Actions table width set correctly');

				ok($actionsTable.find('tbody tr:first-child .btn-group').hasClass('open'), 'Actions dropdown opens on click');

				$actionItem.click();
			}, 0);
		});

		function testClickAction(helpers, callback, e) {
			equal((typeof helpers === 'object'), true, 'Items in row were returned after action click');
			var count = 0;
			for (var k in helpers.rowData) {
				if (helpers.rowData.hasOwnProperty(k)) {
					++count;
				}
			}
			equal(count === 4, true, 'Full row object was returned');
			equal((typeof callback === 'function'), true, 'callback is a function');
			equal((typeof e === 'object'), true, 'e is an object');
			equal((typeof e.target !== 'undefined'), true, 'e is probably a jQuery event object');
		}

		$repeater.repeater(repeaterOptions);
	});
});
