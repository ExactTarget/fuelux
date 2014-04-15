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

//	test("should handle pagination correctly", function () {
//
//	});

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
