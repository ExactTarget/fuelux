/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/datagrid'], function($) {

	module("Fuel UX datagrid");

	test("should be defined on jquery object", function () {
		ok($(document.body).datagrid, 'datagrid method is defined');
	});

	test("should return element", function () {
		ok($(document.body).datagrid({ dataSource: emptyDataSource })[0] === document.body, 'document.body returned');
	});

	asyncTest("should render data source", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: stubDataSource }).on('loaded', function () {

			var $columnHeaders = $datagrid.find('thead tr').eq(1).find('th');
			equal($columnHeaders.eq(0).text(), 'Property One', 'column 1 header has label');
			equal($columnHeaders.eq(0).data('property'), 'property1', 'column 1 header has property name');
			ok($columnHeaders.eq(0).hasClass('sortable'), 'column 1 header is sortable');
			equal($columnHeaders.eq(1).text(), 'Property Two', 'column 2 header has label');
			equal($columnHeaders.eq(1).data('property'), 'property2', 'column 2 header has property name');
			ok($columnHeaders.eq(1).hasClass('sortable'), 'column 2 header is sortable');
			equal($columnHeaders.eq(2).text(), 'Property Three', 'column 3 header has label');
			equal($columnHeaders.eq(2).data('property'), 'property3', 'column 3 header has property name');
			ok(!$columnHeaders.eq(2).hasClass('sortable'), 'column 3 header is not sortable');

			var $datarows = $datagrid.find('tbody tr');
			equal($datarows.length, 8, 'all rows were rendered');

			var $testcells = $datarows.eq(4).find('td');
			equal($testcells.length, 3, 'rows have three columns');
			equal($testcells.eq(0).html(), 'M', 'column 1 data was rendered');
			equal($testcells.eq(1).html(), 'N', 'column 2 data was rendered');
			equal($testcells.eq(2).html(), 'O', 'column 3 data was rendered');

			var $status = $datagrid.find('.grid-controls span:first');
			equal($status.text(), '1 - 2 of 3 items', 'status is correctly displayed');

			var $page = $datagrid.find('.grid-pager input');
			equal($page.val(), '4', 'page is correctly displayed');

			var $pages = $datagrid.find('.grid-pages');
			equal($pages.text(), '5', 'page count is correctly displayed');

			start();
		});

		var $activityrow = $datagrid.find('tbody tr');
		equal($activityrow.length, 1, 'activity row was rendered');
	});

	asyncTest("should handle data source with zero records", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: emptyDataSource }).on('loaded', function () {

			var $datarows = $datagrid.find('tbody tr');
			equal($datarows.length, 1, 'row for status was rendered');

			var $testcell = $datarows.eq(0).find('td');
			equal($testcell.text(), '0 items', 'empty status is displayed');

			start();
		});

		var $activityrow = $datagrid.find('tbody tr');
		equal($activityrow.length, 1, 'activity row was rendered');
	});

	var emptyDataSource = {
		columns: function () {
			return [{
				property: 'property1',
				label: 'Property One',
				sortable: true
			}, {
				property: 'property2',
				label: 'Property Two',
				sortable: true
			}];
		},
		data: function (options, callback) {
			setTimeout(function () {
				callback({ data: [], start: 1, end: 0, count: 0, pages: 0, page: 1 });
			}, 0);
		}
	};

	var stubDataSource = {
		columns: function () {
			return [{
				property: 'property1',
				label: 'Property One',
				sortable: true
			}, {
				property: 'property2',
				label: 'Property Two',
				sortable: true
			}, {
				property: 'property3',
				label: 'Property Three',
				sortable: false
			}];
		},
		data: function (options, callback) {
			setTimeout(function () {
				callback({
					data: [
						{ property1: 'A', property2: 'B', property3: 'C' },
						{ property1: 'D', property2: 'E', property3: 'F' },
						{ property1: 'G', property2: 'H', property3: 'I' },
						{ property1: 'J', property2: 'K', property3: 'L' },
						{ property1: 'M', property2: 'N', property3: 'O' },
						{ property1: 'P', property2: 'Q', property3: 'R' },
						{ property1: 'S', property2: 'T', property3: 'U' },
						{ property1: 'V', property2: 'W', property3: 'X' }
					],
					start: 1, end: 2, count: 3, pages: 5, page: 4
				});
			}, 0);

		}
	};

	var datagridHTML = '<table id="MyGrid" class="table table-bordered datagrid">' +
		'<thead><tr><th>' +
		'<div class="datagrid-header-right"><div class="input-append search">' +
		'<input type="text" class="input-medium" placeholder="Search"><button class="btn"><i class="icon-search"></i></button>' +
		'</div></div>' +
		'</th></tr></thead>' +
		'<tfoot><tr><th>' +
		'<div class="datagrid-footer-left"><div class="grid-controls">' +
		'<span><span class="grid-start"></span> - <span class="grid-end"></span> of <span class="grid-count"></span></span>' +
		'<select class="grid-pagesize"><option>3</option></select>' +
		'<span>Per Page</span>' +
		'</div></div>' +
		'<div class="datagrid-footer-right"><div class="grid-pager">' +
		'<button class="btn grid-prevpage"><i class="icon-chevron-left"></i></button>' +
		'<span>Page</span>' +
		'<div class="input-append dropdown combobox">' +
		'<input class="span1" type="text"><button class="btn" data-toggle="dropdown"><i class="caret"></i></button>' +
		'<ul class="dropdown-menu"></ul>' +
		'</div>' +
		'<span>of <span class="grid-pages"></span></span>' +
		'<button class="btn grid-nextpage"><i class="icon-chevron-right"></i></button>' +
		'</div></div>' +
		'</th></tr></tfoot></table>';

});