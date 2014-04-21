/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var afterSource = function(){};
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

		for(i; i<l; i++){
			resp.items.push(data.repeater.listData[i]);
		}

		callback(resp);
		afterSource(options);
	};
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
					'<span class="glyphicon glyphicon-asterisk"></span>' +
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

	test('should handle sorting correctly', function(){
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

});
