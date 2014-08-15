/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var afterSource = function(options){};
	var data = require('data');
	var dataSource = function(options, callback){
		var numItems = 200;
		var resp = {
			count: numItems,
			items: [],
			pages: (Math.ceil(numItems/(options.pageSize || 30))),
			page: options.pageIndex
		};
		var i, l;

		i = options.pageIndex * (options.pageSize || 30);
		l = i + (options.pageSize || 30);
		resp.start = i + 1;
		resp.end = l;

		for(i; i<l; i++){
			resp.items.push({
				color: 'orange',
				name: ('Thumbnail ' + (i + 1)),
				src: 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png'
			});
		}

		callback(resp);
		afterSource(options);
	};
	var html = require('text!test/markup/repeater-markup.html');

	require('bootstrap');
	require('fuelux/repeater');
	require('fuelux/repeater-thumbnail');

	module('Fuel UX Repeater Thumbnail', {
		setup: function(){
			this.$markup = $(html);
			this.$markup.find('.repeater-views').append('' +
				'<label class="btn btn-default active">' +
					'<input name="repeaterViews" type="radio" value="thumbnail">' +
					'<span class="glyphicon glyphicon-th"></span>' +
				'</label>');
		}
	});

	test('should be defined on jquery object', function () {
		ok($.fn.repeater.views.thumbnail, 'repeater-thumbnail view plugin is defined');
	});

	test('should render correctly', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var items = 0;
			var $item;

			$repeater.find('.repeater-thumbnail-cont:first').find('.thumbnail').each(function(){
				items++;
			});

			equal(items, 10, 'correct number of items rendered');

			$item = $repeater.find('.thumbnail:first');
			equal($item.get(0).style.backgroundColor, 'orange', 'thumbnail background-color set correctly');
			equal($item.find('img').attr('src'), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'thumbnail image rendered correctly');
			equal($item.find('span').text(), 'Thumbnail 1', 'thumbnail label rendered correctly');
		};

		$repeater.repeater({
			dataSource: dataSource
		});
	});

	test('should render correctly if infinite scroll enabled', function(){
		var $repeater = $(this.$markup);

		afterSource = function(){
			var items = 0;

			$repeater.find('.repeater-thumbnail-cont:first').find('.thumbnail').each(function(){
				items++;
			});

			equal(items, 30, 'correct number of items rendered');
		};

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_infiniteScroll: true
		});
	});

	test('should call item callback correctly', function(){
		var hasCalled = false;
		var items = 0;
		var $repeater = $(this.$markup);

		afterSource = function(){
			equal(items, 10, 'items callback called expected number of times');
		};

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_itemRendered: function(helpers, callback){
				if(!hasCalled){
					ok(1===1, 'itemRendered callback called upon rendering item');
					equal((helpers.container.length>0 && helpers.item.length>0), true, 'itemRendered helpers object contains appropriate attributes');
					hasCalled = true;
				}
				items++;
				callback();
			}
		});
	});

	test('template option should work as expected', function() {
		var $repeater = $(this.$markup);
		var $item;

		afterSource = function () {
			$item = $repeater.find('.thumbnail:first');
			equal($item.find('.test1').text(), 'orange', 'template option working correctly - test 1');
			equal($item.find('.test2').text(), 'Thumbnail 1', 'template option working correctly - test 2');
			equal($item.find('.test3').text(), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'template option working correctly - test 3');
		};

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail"><div class="test1">{{color}}</div><div class="test2">{{name}}</div><div class="test3">{{src}}</div></div>'
		});
	});
});
