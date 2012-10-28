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

			var $topHeader = $datagrid.find('thead tr:first').find('th');
			equal($topHeader.attr('colspan'), '3', 'header spans all columns');

			var $footer = $datagrid.find('tfoot th');
			equal($footer.attr('colspan'), '3', 'footer spans all columns');

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
			equal($page.val(), '1', 'page is correctly displayed');

			var $pagedropdownitems = $datagrid.find('.grid-pager .dropdown-menu li');
			equal($pagedropdownitems.length, 5, 'dropdown shows all pages');

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
			equal($testcell.attr('colspan'), '2', 'empty status spans all columns');

			start();
		});

		var $activityrow = $datagrid.find('tbody tr');
		equal($activityrow.length, 1, 'activity row was rendered');
	});

	asyncTest("should handle header clicks", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: stubDataSource }).one('loaded', function () {

			var $columnHeaders = $datagrid.find('thead tr').eq(1).find('th');

			$datagrid.one('loaded', function () {

				equal(stubDataSource.options.sortProperty, 'property1', 'iteration one - sort property was set properly');
				equal(stubDataSource.options.sortDirection, 'asc', 'iteration one - sort direction was set properly');
				ok($columnHeaders.eq(0).hasClass('sorted'), 'iteration one - header has sorted class');
				ok($columnHeaders.eq(0).find('i').hasClass('icon-chevron-up'), 'iteration one - header has sorting indicator');

				$datagrid.one('loaded', function () {

					equal(stubDataSource.options.sortProperty, 'property1', 'iteration two - sort property was set properly');
					equal(stubDataSource.options.sortDirection, 'desc', 'iteration two - sort direction was set properly');
					ok($columnHeaders.eq(0).hasClass('sorted'), 'iteration two - header has sorted class');
					ok($columnHeaders.eq(0).find('i').hasClass('icon-chevron-down'), 'iteration two - header has sorting indicator');

					$datagrid.one('loaded', function () {

						equal(stubDataSource.options.sortProperty, 'property2', 'iteration three - sort property was set properly');
						equal(stubDataSource.options.sortDirection, 'asc', 'iteration three - sort direction was set properly');
						ok($columnHeaders.eq(1).hasClass('sorted'), 'iteration three - header has sorted class');
						ok($columnHeaders.eq(1).find('i').hasClass('icon-chevron-up'), 'iteration three - header has sorting indicator');

						start();
					});

					$columnHeaders.eq(1).click();
				});

				$columnHeaders.eq(0).click();
			});

			$columnHeaders.eq(0).click();
		});
	});

	asyncTest("should handle page changes", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: stubDataSource }).one('loaded', function () {

			var $pagecontrols = $datagrid.find('.grid-pager');
			var $previousbutton = $pagecontrols.find('button:first');
			var $nextbutton = $pagecontrols.find('button:last');
			var $pageinput = $pagecontrols.find('input');

			equal($previousbutton.attr('disabled'), 'disabled', 'iteration one - previous button is disabled');
			equal($nextbutton.attr('disabled'), undefined, 'iteration one - next button is enabled');

			$datagrid.one('loaded', function () {

				equal(stubDataSource.options.pageIndex, 1, 'iteration two - page index was incremented');
				equal($previousbutton.attr('disabled'), undefined, 'iteration two - previous button is enabled');
				equal($nextbutton.attr('disabled'), undefined, 'iteration two - next button is enabled');

				$datagrid.one('loaded', function () {

					equal(stubDataSource.options.pageIndex, 0, 'iteration three - page index was incremented');
					equal($previousbutton.attr('disabled'), 'disabled', 'iteration three - previous button is disabled');
					equal($nextbutton.attr('disabled'), undefined, 'iteration three - next button is enabled');

					$datagrid.one('loaded', function () {

						equal(stubDataSource.options.pageIndex, 4, 'iteration four - page index was changed');
						equal($previousbutton.attr('disabled'), undefined, 'iteration four - previous button is enabled');
						equal($nextbutton.attr('disabled'), 'disabled', 'iteration four - next button is disabled');

						start();
					});

					$pageinput.val('5').change();
				});

				$previousbutton.click();
			});

			$nextbutton.click();
		});
	});

	asyncTest("should handle page size changes", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: stubDataSource }).one('loaded', function () {

			var $pagesize = $datagrid.find('.grid-pagesize');

			equal(stubDataSource.options.pageSize, 3, 'page size has default value');

			$datagrid.one('loaded', function () {

				equal(stubDataSource.options.pageSize, 6, 'page size was changed');
				start();
			});

			$pagesize.val('6').change();
		});
	});

	asyncTest("should handle search changes", function () {
		var $datagrid = $(datagridHTML).datagrid({ dataSource: stubDataSource }).one('loaded', function () {

			var $searchcontrol = $datagrid.find('.search');

			equal(stubDataSource.options.search, undefined, 'search is undefined by default');

			$datagrid.one('loaded', function () {

				equal(stubDataSource.options.search, 'my search', 'search was changed');

				$datagrid.one('loaded', function () {

					equal(stubDataSource.options.search, undefined, 'search was cleared');
					start();
				});

				$searchcontrol.trigger('cleared');
			});

			$searchcontrol.trigger('searched', 'my search');
		});
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
			this.options = options;

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
					start: 1, end: 2, count: 3, pages: 5, page: options.pageIndex + 1
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
		'<select class="grid-pagesize"><option>3</option><option>6</option></select>' +
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