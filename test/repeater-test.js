/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/repeater-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	//html = $('<div>'+html+'</div>').find('#MyRepeaterContainer');

	require('bootstrap');
	require('fuelux/repeater');

	module('Fuel UX Repeater', {
		setup: function(){
			this.$markup = $(html);
			this.$markup.find('.repeater-views').append('' +
			'<label class="btn btn-default active">' +
			'<input name="repeaterViews" type="radio" value="test1.view1">' +
			'<span class="glyphicon glyphicon-asterisk"></span>' +
			'</label>' +
			'<label class="btn btn-default">' +
			'<input name="repeaterViews" type="radio" value="test2.view2">' +
			'<span class="glyphicon glyphicon-asterisk"></span>' +
			'</label>');
		},
		teardown: function(){
			delete $.fn.repeater.viewTypes.test1;
		}
	});

	test("should be defined on jquery object", function () {
		ok($().repeater, 'repeater method is defined');
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
						$search.trigger('searched.fu.repeater');
						break;
					case 1:
						equal(options.search, 'something', 'correct search value passed to dataSource upon searching');
						callback({});
						$search.find('input').val('');
						$search.trigger('cleared.fu.repeater');
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

	test("should handle canceling search correctly", function () {
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
						$search.trigger('searched.fu.repeater');
						break;
					case 1:
						equal(options.search, 'something', 'correct search value passed to dataSource upon searching');
						callback({});
						$search.find('input').val('');
						$search.trigger('canceled.fu.repeater');
						break;
					case 2:
						equal(options.search, undefined, 'search value not passed to dataSource after canceling');
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
					equal(options.view, 'test2.view2', 'correct view value passed to dataSource upon selecting different view');
				}else{
					equal(options.view, 'test1.view1', 'correct view value passed to dataSource initially');
					hasCalledDS = true;
					callback({});
					$views.find('label:last input').trigger('change');
				}
			},
			dropPagingCap: 3
		});
	});

	test("should run view plugin aspects correctly - pt 1", function () {
		var ran = 0;
		var $repeater = $(this.$markup);
		$.fn.repeater.viewTypes.test1 = {
			initialize: function(helpers, callback){
				equal(ran, 0, 'initialize function correctly ran first');
				equal(typeof helpers, 'object', 'initialize function provided helpers object');
				equal(typeof callback,'function', 'initialize function provided callback function');
				ran++;
				callback({});
			},
			selected: function(helpers){
				equal(ran, 1, 'selected function correctly ran upon view select');
				equal(typeof helpers, 'object', 'selected function provided helpers object');
				ran++;
			},
			dataOptions: function(options){
				equal(ran, 2, 'dataOptions function correctly ran prior to rendering');
				equal(typeof options, 'object', 'dataOptions function provided options object');
				ran++;
				return options;
			},

			before: function(helpers){
				equal(ran, 3, 'before function ran before renderItems function');
				equal(typeof helpers, 'object', 'before function provided helpers object');
				equal((helpers.container.length>0 && typeof helpers.data==='object'), true, 'helpers object contains appropriate attributes');
				ran++;
				return { item: '<div class="test1-wrapper" data-container="true"></div>' };
			},
			renderItem: function(helpers){
				equal((ran>3), true, 'renderItem function ran after before function');
				equal(typeof helpers, 'object', 'renderItem function provided helpers object');
				equal((helpers.container.length>0 && typeof helpers.data==='object' &&
				typeof helpers.index==='number' && typeof helpers.subset==='object'), true, 'helpers object contains appropriate attributes');
				equal(helpers.container.hasClass('test1-wrapper'), true, 'data-container="true" attribute functioning correctly');
				ran++;
				return { item: '<div class="test1-item"></div>' };
			},
			after: function(helpers){
				equal(ran, 7, 'after function ran after renderItems function');
				equal(typeof helpers, 'object', 'after function provided helpers object');
				equal((helpers.container.length>0 && typeof helpers.data==='object'), true, 'helpers object contains appropriate attributes');
				return false;
			},
			repeat: 'data.smileys'
		};
		$repeater.repeater({
			dataSource: function(options, callback){
				callback({ smileys: [':)', ':)', ':)'] });
			}
		});
	});

	test("should run view plugin aspects correctly - pt 2", function () {
		var ran = 0;
		var $repeater = $(this.$markup);
		$.fn.repeater.viewTypes.test1 = {
			render: function(helpers, callback){
				equal(1, 1, 'render function ran when defined');
				equal(typeof helpers, 'object', 'render function provided helpers object');
				equal((helpers.container.length>0 && typeof helpers.data==='object'), true, 'helpers object contains appropriate attributes');
			},
			resize: function(helpers){
				equal(1, 1, 'resize function correctly ran when control is cleared');
				equal(typeof helpers, 'object', 'resize function provided helpers object');
			},
			cleared: function(helpers){
				equal(1, 1, 'cleared function correctly ran when control is cleared');
				equal(typeof helpers, 'object', 'cleared function provided helpers object');
			}
		};
		$repeater.repeater({
			dataSource: function(options, callback){
				callback({ smileys: [':)', ':)', ':)'] });
				$repeater.repeater('resize');
				$repeater.repeater('clear');
			}
		});
	});

	test('views config option should function as expected', function(){
		var $repeater = $(this.$markup);
		var $views = $repeater.find('.repeater-views');
		$repeater.repeater({
			views: {
				view1: {
					dataSource: function(options, callback){
						equal(options.view, 'test1.view1', 'view-specific configuration honored');
						callback({});
						$views.find('label:last input').trigger('change');
					}
				},
				'test2.view2': {
					dataSource: function(options, callback){
						equal(options.view, 'test2.view2', 'view-specific configuration honored');
						callback({});
					}
				}
			}
		});
	});

	test("should handle disable / enable correctly", function () {
		var $repeater = $(this.$markup);

		var $search = $repeater.find('.repeater-header .search');
		var $filters = $repeater.find('.repeater-header .repeater-filters');
		var $views = $repeater.find('.repeater-header .repeater-views label');
		var $pageSize = $repeater.find('.repeater-footer .repeater-itemization .selectlist');
		var $primaryPaging = $repeater.find('.repeater-footer .repeater-primaryPaging .combobox');
		var $secondaryPaging = $repeater.find('.repeater-footer .repeater-secondaryPaging');
		var $prevBtn = $repeater.find('.repeater-prev');
		var $nextBtn = $repeater.find('.repeater-next');

		var disabled = 'disabled';

		$repeater.on('disabled.fu.repeater', function(){
			ok(1===1, 'disabled event called as expected');
		});

		$repeater.on('enabled.fu.repeater', function(){
			ok(1===1, 'enabled event called as expected');
		});

		$repeater.on('rendered.fu.repeater', function(){
			setTimeout(function(){
				$repeater.repeater('disable');

				$views.click();

				equal($search.hasClass(disabled), true, 'repeater search disabled as expected');
				equal($filters.hasClass(disabled), true, 'repeater filters disabled as expected');
				equal($views.attr(disabled), disabled, 'repeater views disabled as expected');
				equal($pageSize.hasClass(disabled), true, 'repeater pageSize disabled as expected');
				equal($primaryPaging.hasClass(disabled), true, 'repeater primaryPaging disabled as expected');
				equal($secondaryPaging.attr(disabled), disabled, 'repeater secondaryPaging disabled as expected');
				equal($prevBtn.attr(disabled), disabled, 'repeater prevBtn disabled as expected');
				equal($nextBtn.attr(disabled), disabled, 'repeater nextBtn disabled as expected');
				equal($repeater.hasClass(disabled), true, 'repeater has disabled class as expected');

				$repeater.repeater('enable');

				equal($search.hasClass(disabled), false, 'repeater search enabled as expected');
				equal($filters.hasClass(disabled), false, 'repeater filters enabled as expected');
				equal($views.attr(disabled), undefined, 'repeater views enabled as expected');
				equal($pageSize.hasClass(disabled), true, 'repeater pageSize disabled as expected');
				equal($primaryPaging.hasClass(disabled), false, 'repeater primaryPaging enabled as expected');
				equal($secondaryPaging.attr(disabled), undefined, 'repeater secondaryPaging enabled as expected');
				equal($prevBtn.attr(disabled), disabled, 'repeater prevBtn still disabled as expected (no more pages)');
				equal($nextBtn.attr(disabled), disabled, 'repeater nextBtn still disabled as expected (no more pages)');

				equal($repeater.hasClass(disabled), false, 'repeater no longer has disabled class as expected');
			}, 0);
		});
		$repeater.repeater();
	});

	asyncTest('should destroy control', function(){
		var $repeater = $(this.$markup);

		var afterSource = function(){
			setTimeout(function(){
				start();
				equal(typeof( $repeater.repeater('destroy')) , 'string', 'returns string (markup)');
				equal( $repeater.parent().length, false, 'control has been removed from DOM');
			}, 0);
		};

		$repeater.repeater({
			dataSource: function(options, callback){
				callback({ smileys: [':)', ':)', ':)'] });
				afterSource();
			}
		});
	});

});
