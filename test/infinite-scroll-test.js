/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var data = require('data');
	var html = require('text!test/markup/infinite-scroll-markup.html');

	require('bootstrap');
	require('fuelux/infinite-scroll');

	module('Fuel UX Infinite Scroll');

	// TODO: add click.fu.infinitescroll event testing

	test('should be defined on jquery object', function () {
		ok($().infinitescroll, 'infinitescroll method is defined');
	});

	test('should return element', function () {
		var $infiniteScroll = $(html);
		ok($infiniteScroll.infinitescroll() === $infiniteScroll, 'infinitescroll should be initialized');
	});

	asyncTest('default behavior should function as expected', function () {
		var $infiniteScroll = $(html);
		var scrollHeight;

		$('body').append($infiniteScroll);
		$infiniteScroll.append(data.infiniteScroll.content);
		$infiniteScroll.infinitescroll({
			dataSource: function(helpers, callback){
				start();

				ok(1===1, 'dataSource function called upon scrolling');
				ok((helpers.percentage && helpers.scrollTop), 'appropriate helpers passed to dataSource function');
				ok(typeof callback==='function', 'appropriate callback passed to dataSource function');

				callback({ content: data.infiniteScroll.content });

				ok($infiniteScroll.get(0).scrollHeight > scrollHeight, 'content appended correctly upon return of data');

				$infiniteScroll.remove();
			}
		});

		scrollHeight = $infiniteScroll.get(0).scrollHeight;
		$infiniteScroll.scrollTop(999999);
	});

//	asyncTest('hybrid option should function as expected', function () {
//		var $infiniteScroll = $(html);
//		var loadMore = 'Load More';
//		var button;
//
//		$('body').append($infiniteScroll);
//		$infiniteScroll.append(data.infiniteScroll.content);
//		$infiniteScroll.infinitescroll({
//			dataSource: function(helpers, callback){
//				start();
//
//				ok(1===1, 'dataSource function called upon clicking load button');
//
//				callback({ content: data.infiniteScroll.content });
//				$infiniteScroll.remove();
//			},
//			hybrid: { label: loadMore }
//		});
//
//		$infiniteScroll.scrollTop(999999);
//		setTimeout(function(){
//			start();
//			button = $infiniteScroll.find('.infinitescroll-load button');
//			ok(button.html() === loadMore, 'correct label applied to hybrid button');
//			stop();
//			button.click();
//		}, 0);
//	});

	asyncTest('percentage option should function as expected', function () {
		var $infiniteScroll = $(html);
		var percent = 85;

		$('body').append($infiniteScroll);
		$infiniteScroll.append(data.infiniteScroll.content);
		$infiniteScroll.infinitescroll({
			dataSource: function(helpers, callback){
				start();

				ok(1===1, 'dataSource function called upon scrolling to specified percentage');

				callback({ content: data.infiniteScroll.content });
				$infiniteScroll.remove();
			},
			percentage: percent
		});

		$infiniteScroll.scrollTop(($infiniteScroll.get(0).scrollHeight-($infiniteScroll.height()/(percent/100)))+1);
	});

	asyncTest('destroy control', function () {
		var $infiniteScroll = $(html);
		var scrollHeight;

		$('body').append($infiniteScroll);
		$infiniteScroll.append(data.infiniteScroll.content);
		$infiniteScroll.infinitescroll({
			dataSource: function(helpers, callback){
				start();
				callback({ content: data.infiniteScroll.content });

				equal(typeof( $infiniteScroll.infinitescroll('destroy')) , 'string', 'returns string (markup)');
				equal( $infiniteScroll.parent().length, false, 'control has been removed from DOM');

			}
		});

		scrollHeight = $infiniteScroll.get(0).scrollHeight;
		$infiniteScroll.scrollTop(999999);
	});

});
