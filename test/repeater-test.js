/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/repeater-markup.html');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	//html = $('<div>'+html+'<div>').find('#MyRepeaterContainer');

	require('bootstrap');
	require('fuelux/repeater');

	module('Fuel UX Repeater', {
		setup: function(){
			this.$markup = $(html);
			this.$markup.find('.repeater-views').append('' +
				'<label class="btn btn-default active">' +
					'<input name="repeaterViews" type="radio" value="test1">' +
					'<span class="glyphicon glyphicon-asterisk"></span>' +
				'</label>' +
				'<label class="btn btn-default">' +
					'<input name="repeaterViews" type="radio" value="test2">' +
					'<span class="glyphicon glyphicon-asterisk"></span>' +
				'</label>');
		},
		teardown: function(){
			delete $.fn.repeater.views.test1;
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
					$filters.find('li:nth-child(2) a').click();
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

	test("should run view plugin aspects correctly", function () {
		var ran = 0;
		var $repeater = $(this.$markup);
		var repeated = false;
		var skipped = false;
		$.fn.repeater.views.test1 = {
			initialize: function(helpers, callback){
				equal(ran, 0, 'initialize function correctly ran first');
				equal(typeof helpers, 'object', 'initialize function provided helpers object');
				equal(typeof callback,'function', 'initialize function provided callback function');
				ran++;
				callback({});
			},
			selected: function(helpers, callback){
				equal(ran, 1, 'selected function correctly ran after initialization upon view select');
				equal(typeof helpers, 'object', 'selected function provided helpers object');
				equal(typeof callback,'function', 'selected function provided callback function');
				ran++;
				callback({});
			},
			renderer: {
				before: function(helpers, callback){
					equal(ran, 2, 'running first renderer as expected');
					equal(this.$element.find('.test1-wrapper').length, 0, 'before function ran before render function');
					equal(typeof helpers, 'object', 'before function provided helpers object');
					equal((helpers.container.length>0 && typeof helpers.data==='object'), true, 'helpers object contains appropriate attributes');
					equal(typeof callback,'function', 'before function provided callback function');
					ran++;
					callback({});
				},
				after: function(helpers, callback){
					equal(this.$element.find('.test1-wrapper').length, 1, 'after function ran after render function');
					equal(typeof helpers, 'object', 'before function provided helpers object');
					equal((helpers.container.length>0 && typeof helpers.data==='object' && helpers.item.length>0), true,
						'helpers object contains appropriate attributes');
					equal(typeof callback,'function', 'before function provided callback function');
					ran++;
					callback({});
				},
				complete: function(helpers, callback){
					equal(ran, 8, 'complete function ran after all nested renderers ran');
					equal(skipped, true, 'nested renderer\'s nested items skipped as appropriate');
					equal(typeof helpers, 'object', 'complete function provided helpers object');
					equal((helpers.container.length>0 && typeof helpers.data==='object' && helpers.item.length>0), true,
						'helpers object contains appropriate attributes');
					equal(typeof callback,'function', 'complete function provided callback function');
				},
				render: function(helpers, callback){
					equal(ran, 3, 'running render function when expected');
					equal(typeof helpers, 'object', 'render function provided helpers object');
					equal((helpers.container.length>0 && typeof helpers.data==='object'), true, 'helpers object contains appropriate attributes');
					equal(typeof callback,'function', 'render function provided callback function');
					ran++;
					callback({ item: '<div class="test1-wrapper" data-container="true"></div>' });
				},
				nested: [
					{
						render: function(helpers, callback){
							if(!repeated){
								equal(ran, 5, 'running nested renderer when expected');
								equal(typeof helpers, 'object', 'nested render function provided helpers object');
								equal((helpers.container.length>0 && typeof helpers.data==='object' &&
									helpers.index===0 && typeof helpers.subset==='object'), true, 'helpers object contains appropriate attributes');
								equal(helpers.container.hasClass('test1-wrapper'), true, 'data-container="true" attribute functioning correctly');
								equal(typeof callback,'function', 'nested render function provided callback function');
								repeated = true;
							}else{
								equal((ran===6 || ran===7), true, 'nested renderer repeated as expected');
							}
							ran++;
							skipped = true;
							callback({ item: $('<div class="test1-item"></div>'), skipNested: true });
						},
						repeat: 'data.smileys',
						nested: [
							{
								render: function(helpers, callback){
									skipped = false;
									callback({});
								}
							}
						]
					}
				]
			}
		};
		$repeater.repeater({
			dataSource: function(options, callback){
				callback({ smileys: [':)', ':)', ':)'] });
			}
		});
	});
});
