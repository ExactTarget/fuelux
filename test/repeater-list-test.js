/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var afterSource = function(options){};
	var data = require('data');
	var dataSource = function(options, callback){
		var resp = {
			count: data.repeater.listData.length,
			items: [],
			page: options.pageIndex
		};
		var i, l;

		resp.pages = Math.ceil(resp.count/(options.pageSize || 50));

		i = options.pageIndex * (options.pageSize || 50);
		l = i + (options.pageSize || 50);
		l = (l <= resp.count) ? l : resp.count;
		resp.start = i + 1;
		resp.end = l;

		resp.columns = [
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

		if(!noItems){
			for(i; i<l; i++){
				resp.items.push(data.repeater.listData[i]);
			}
		}

		callback(resp);
		afterSource(options);
	};
	var noItems = false;
	var repeaterMarkup = require('text!test/repeater-markup.txt');

	require('bootstrap');
	require('fuelux/repeater');
	require('fuelux/repeater-list');

	module('Fuel UX Repeater', {
		setup: function(){
			this.$markup = $(repeaterMarkup);
			this.$markup.find('.repeater-views').append('' +
				'<label class="btn btn-default active">' +
					'<input name="repeaterViews" type="radio" value="list">' +
					'<span class="glyphicon glyphicon-list"></span>' +
				'</label>');
		}
	});

	test('should be defined on jquery object', function () {
		ok($.fn.repeater.views.list, 'repeater-list view plugin is defined');
	});

	test('should render correctly', function () {
		var headerColumns = ['Common Name', 'Latin Name', 'Appearance', 'Sound'];
		var itemColumns = ['cat', 'Felis catus', 'small, usually furry, domesticated carnivorous mammal', 'Meow meow!'];
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');
			var i;
			equal($repeater.find('.repeater-list-header').length, 1, 'repeater list header rendered');
			i = 0;
			$repeater.find('.repeater-list-header td').each(function(){
				equal($(this).text(), headerColumns[i], 'repeater list rendered correct header column');
				i++;
			});
			equal($repeater.find('.repeater-list-wrapper').length, 1, 'repeater list wrapper rendered');
			equal($items.length, 1, 'repeater list items rendered');
			i = 0;
			$items.find('tr:first td').each(function(){
				equal($(this).text(), itemColumns[i], 'repeater list rendered correct item column');
				i++;
			});
			i = $items.find('tr');
			equal(i.length, 10, 'repeater list rendered appropriate number of rows');
		};

		$repeater.repeater({
			dataSource: dataSource
		});
	});

	test('should call column and row callbacks correctly', function(){
		var hasCalled = { column: false, row: false };
		var num = { cols: 0, rows: 0 };
		var $repeater = $(this.$markup);

		afterSource = function(){
			equal(num.cols, 40, 'columnRendered callback called expected number of times');
			equal(num.rows, 10, 'rowRendered callback called expected number of times');
		};

		$repeater.repeater({
			dataSource: dataSource,
			list_columnRendered: function(helpers, callback){
				if(!hasCalled.column){
					ok(1===1, 'columnRendered callback called upon rendering column');
					equal((helpers.container.length>0 && helpers.item.length>0), true, 'columnRendered helpers object contains appropriate attributes');
					hasCalled.column = true;
				}
				num.cols++;
				callback();
			},
			list_rowRendered: function(helpers, callback){
				if(!hasCalled.row){
					ok(1===1, 'rowRendered callback called upon rendering column');
					equal((helpers.container.length>0 && helpers.item.length>0), true, 'rowRendered helpers object contains appropriate attributes');
					hasCalled.row = true;
				}
				num.rows++;
				callback();
			}
		});
	});

	test('should handle sorting option correctly', function(){
		var count = 0;
		var $repeater = $(this.$markup);
		var $first;

		afterSource = function(options){
			count++;
			switch(count){
				case 1:
					$first = $repeater.find('.repeater-list-header td:first');
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
					break;
			}
		};

		$repeater.repeater({
			dataSource: dataSource,
			list_sortClearing: true
		});
	});

	test('should handle noItemsHTML option correctly', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var txt = $repeater.find('.repeater-list-items tr.empty').text();
			equal(txt, 'TEST', 'correct noItemsHTML content appended when appropriate');
			noItems = false;
		};

		noItems = true;
		$repeater.repeater({
			dataSource: dataSource,
			list_noItemsHTML: 'TEST'
		});
	});

	test('should handle selectable (single) option correctly', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			equal($firstRow.hasClass('selectable'), true, 'rows have selectable class as expected');
			$firstRow.click();
			equal($firstRow.hasClass('selected'), true, 'row has selected class after being clicked as expected');
			$lastRow.click();
			equal((!$firstRow.hasClass('selected') && $lastRow.hasClass('selected')), true, 'selected class transfered to different row when clicked');
		};

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: true
		});
	});

	test('should handle selectable (multi) option correctly', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			equal($firstRow.hasClass('selectable'), true, 'rows have selectable class as expected');
			$firstRow.click();
			equal($firstRow.hasClass('selected'), true, 'row has selected class after being clicked as expected');
			$lastRow.click();
			equal(($firstRow.hasClass('selected') && $lastRow.hasClass('selected')), true, 'both rows have selected class after another click');
		};

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should clear selected items', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');

			$firstRow.click();
			$lastRow.click();
			//TODO: why is this timeout needed???
			setTimeout(function(){
				start();
				$repeater.repeater('clearSelectedItems');
				equal((!$firstRow.hasClass('selected') && !$lastRow.hasClass('selected')), true, 'selected items cleared as expected');
			}, 0);
		};

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should get selected items', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');
			var $firstRow = $items.find('tr:first');
			var $lastRow = $items.find('tr:last');
			var selected;

			$firstRow.click();
			$lastRow.click();
			setTimeout(function(){
				start();
				selected = $repeater.repeater('getSelectedItems');
				equal(selected.length, 2, 'returned array contains appropriate number of items');
				equal((typeof selected[0].data==='object' && selected[0].element.length>0), true, 'items in returned array contain appropriate object and attributes');
			}, 0);

		};

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: 'multi'
		});
	});

	asyncTest('should set selected items', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var $items = $repeater.find('.repeater-list-items');

			setTimeout(function(){
				start();

				$repeater.repeater('setSelectedItems', [{ index: 0 }]);
				equal($repeater.repeater('getSelectedItems').length, 1, 'correct number of items selected');
				equal($items.find('tr:first').hasClass('selected'), true, 'correct row selected by index');

				$repeater.repeater('setSelectedItems', [{ property: 'commonName', value: 'pig' }]);
				equal($repeater.repeater('getSelectedItems').length, 1, 'correct number of items selected');
				equal($items.find('tr:nth-child(5)').hasClass('selected'), true, 'correct row selected by property/value');

				$repeater.repeater('setSelectedItems', [{ index: 0 }, { property: 'commonName', value: 'dog' }], true);
				equal($repeater.repeater('getSelectedItems').length, 4, 'correct number of items selected when using force');
			}, 0);

		};

		$repeater.repeater({
			dataSource: dataSource,
			list_selectable: true
		});
	});

});
