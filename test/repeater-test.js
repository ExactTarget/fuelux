/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var repeaterMarkup = require('text!test/repeater-markup.txt');

	require('bootstrap');
	require('fuelux/repeater');

	module('Fuel UX Repeater', {
		setup: function(){
			this.$markup = $(repeaterMarkup);
			this.$markup.find('.repeater-views').append('' +
				'<label class="btn btn-default active">' +
					'<input name="repeaterViews" type="radio" value="test1">' +
					'<span class="glyphicon glyphicon-asterisk"></span>' +
				'</label>' +
				'<label class="btn btn-default">' +
					'<input name="repeaterViews" type="radio" value="test2">' +
					'<span class="glyphicon glyphicon-asterisk"></span>' +
				'</label>');
		}
	});

	test("should be defined on jquery object", function () {
		ok($(this.$markup).repeater, 'repeater method is defined');
	});

	test("should return element", function () {
		var $repeater = $(this.$markup);
		ok($repeater.repeater() === $repeater, 'repeater should be initialized');
	});

	test("should call dataSource correctly", function () {
		var $repeater = $(this.$markup);
		$repeater.repeater({
			dataSource: function(options, callback){
				ok(1===1, 'dataSource function called prior to rendering');
				equal(typeof options, 'object', 'dataSource provided options object');
				equal(typeof callback,'function', 'dataSource provided callback function');
				callback({});
			}
		});
	});

	test("should handle filtering correctly", function () {
		var hasCalledDS = false;
		var $repeater = $(this.$markup);
		var $filters = $repeater.find('.repeater-filters');
		$repeater.repeater({
			dataSource: function(options, callback){
				if(hasCalledDS){
					ok(1===1, 'dataSource called again upon selecting different filter');
					equal(options.filter.text, 'Some', 'filter text property correct on change');
					equal(options.filter.value, 'some', 'filter value property correct on change');
				}else{
					equal(typeof options.filter, 'object', 'filter object passed to dataSource');
					equal(options.filter.text, 'All', 'filter text property correct initially');
					equal(options.filter.value, 'all', 'filter value property correct initially');
					callback({});

					hasCalledDS = true;
					$filters.find('button').click();
					$filters.find('li:first a').click();
				}
			}
		});
	});

	test("should handle itemization correctly", function () {
		var hasCalledDS = false;
		var $repeater = $(this.$markup);
		var $pageSizes = $repeater.find('.repeater-itemization .selectlist');
		$repeater.repeater({
			dataSource: function(options, callback){
				if(hasCalledDS){
					ok(1===1, 'dataSource called again upon selecting different page size');
					equal(options.pageSize, 5, 'correct pageSize passed after change');
				}else{
					equal(options.pageIndex, 0, 'correct pageIndex passed to dataSource');
					equal(options.pageSize, 10, 'correct pageSize passed to dataSource');
					callback({ count: 200, end: 10, start: 1 });
					equal($repeater.find('.repeater-count').text(), '200', 'count set correctly');
					equal($repeater.find('.repeater-end').text(), '10', 'end index set correctly');
					equal($repeater.find('.repeater-start').text(), '1', 'start index set correctly');

					hasCalledDS = true;
					$pageSizes.find('button').click();
					$pageSizes.find('li:first a').click();
				}
			}
		});
	});

	test("should handle pagination correctly", function () {
		var count = -1;
		var $repeater = $(this.$markup);
		var $primaryPaging = $repeater.find('.repeater-primaryPaging');
		var $secondaryPaging = $repeater.find('.repeater-secondaryPaging');
		$repeater.repeater({
			dataSource: function(options, callback){
				count++;
				switch (count){
					case 0:
						equal(options.pageIndex, 0, 'correct pageIndex passed to dataSource');
						callback({ page: 0, pages: 2 });
						equal($primaryPaging.hasClass('active'), true, 'primary paging has active class');
						equal($primaryPaging.find('input').val(), '1', 'primary paging displaying correct page');
						equal($primaryPaging.find('li').length, 2, 'primary paging has correct number of selectable items');
						$repeater.find('.repeater-next').click();
						break;
					case 1:
						ok(1===1, 'dataSource called again upon clicking next button');
						equal(options.pageIndex, 1, 'correct pageIndex passed to dataSource on next click');
						callback({ page: 1, pages: 6 });
						equal($secondaryPaging.hasClass('active'), true, 'secondary paging has active class');
						equal($secondaryPaging.val(), '2', 'secondary paging displaying correct page');
						$repeater.find('.repeater-prev').click();
						break;
					case 2:
						ok(1===1, 'dataSource called again upon clicking prev button');
						equal(options.pageIndex, 0, 'correct pageIndex passed to dataSource on prev click');
						callback({});
						break;
				}
			},
			dropPagingCap: 3
		});
	});

	test("should handle search correctly", function () {
		var count = -1;
		var $repeater = $(this.$markup);
		var $search = $repeater.find('.repeater-search');
		$repeater.repeater({
			dataSource: function(options, callback){
				count++;
				switch (count){
					case 0:
						equal(options.search, undefined, 'search value not passed to dataSource initially as expected');
						callback({});
						$search.find('input').val('something');
						$search.trigger('searched');
						break;
					case 1:
						equal(options.search, 'something', 'correct search value passed to dataSource upon searching');
						callback({});
						$search.find('input').val('');
						$search.trigger('cleared');
						break;
					case 2:
						equal(options.search, undefined, 'search value not passed to dataSource after clearing');
						callback({});
						break;
				}
			},
			dropPagingCap: 3
		});
	});

	test("should handle views correctly", function () {
		var hasCalledDS = false;
		var $repeater = $(this.$markup);
		var $views = $repeater.find('.repeater-views');
		$repeater.repeater({
			dataSource: function(options, callback){
				if(hasCalledDS){
					equal(options.view, 'test2', 'correct view value passed to dataSource upon selecting different view');
				}else{
					equal(options.view, 'test1', 'correct view value passed to dataSource initially');
					hasCalledDS = true;
					callback({});
					$views.find('label:last input').trigger('change');
				}
			},
			dropPagingCap: 3
		});
	});

//	asyncTest("should run view plugin aspects correctly", function () {
//		var $repeater = $(this.$markup);
//		$.fn.repeater.views.test1 = {
//			initialize: function(helpers, callback){
//			},
//			selected: function(helpers, callback){
//
//			},
//			renderer: {
//				before: function(helpers, callback){
//
//				},
//				after: function(helpers, callback){
//
//				},
//				complete: function(helpers, callback){
//
//				},
//				render: function(helpers){
//
//				},
//				nested: [
//					{
//						render: function(){
//
//						},
//						repeat: 'data.smileys',
//						nested: [
//							{
//								render: function(){}
//							}
//						]
//					}
//				]
//			}
//		};
//		$repeater.repeater({
//			dataSource: function(options, callback){
//				callback({ smileys: [':)', ':)', ':)'] });
//			}
//		});
//	});


});
