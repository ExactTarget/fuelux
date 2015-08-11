/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
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
				name: ('Thumbnail ' + (i + 1)),
				src: 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png'
			});
		}

		callback(resp);
	};
	var html = require('text!test/markup/repeater-markup.html!strip');

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
		ok($.fn.repeater.viewTypes.thumbnail, 'repeater-thumbnail view plugin is defined');
	});

	asyncTest('should render correctly', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			start();
			var items = 0;
			var $item;

			$repeater.find('.repeater-thumbnail-cont:first').find('.thumbnail').each(function(){
				items++;
			});

			equal(items, 10, 'correct number of items rendered');

			$item = $repeater.find('.thumbnail:first');
			equal($item.find('img').attr('src'), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'thumbnail image rendered correctly');
			equal($item.find('span').text(), 'Thumbnail 1', 'thumbnail label rendered correctly');
		});

		$repeater.repeater({
			dataSource: dataSource
		});
	});

	asyncTest('should render correctly if infinite scroll enabled', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			start();
			var items = 0;

			$repeater.find('.repeater-thumbnail-cont:first').find('.thumbnail').each(function(){
				items++;
			});

			equal(items, 30, 'correct number of items rendered');
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_infiniteScroll: true
		});
	});

	asyncTest('should call item callback correctly', function(){
		var hasCalled = false;
		var items = 0;
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			start();
			equal(items, 10, 'items callback called expected number of times');
		});

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

	asyncTest('template option should work as expected', function() {
		var $repeater = $(this.$markup);
		var $item;

		$repeater.one('loaded.fu.repeater', function(){
			start();
			$item = $repeater.find('.thumbnail:first');
			equal($item.find('.test2').text(), 'Thumbnail 1', 'template option working correctly - test 1');
			equal($item.find('.test3').text(), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'template option working correctly - test 2');
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail"><div class="test2">{{name}}</div><div class="test3">{{src}}</div></div>'
		});
	});

	asyncTest('should handle selectable (single) option correctly', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			start();
			var $cont = $repeater.find('.repeater-thumbnail-cont');
			var $firstItem = $cont.find('.repeater-thumbnail:first');
			var $lastItem = $cont.find('.repeater-thumbnail:last');

			equal($firstItem.hasClass('selectable'), true, 'thumbnails have selectable class as expected');
			$firstItem.click();
			equal($firstItem.hasClass('selected'), true, 'thumbnail has selected class after being clicked as expected');
			$lastItem.click();
			equal((!$firstItem.hasClass('selected') && $lastItem.hasClass('selected')), true, 'selected class transferred to different thumbnail when clicked');
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_selectable: true
		});
	});

	asyncTest('should handle selectable (multi) option correctly', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			start();
			var $cont = $repeater.find('.repeater-thumbnail-cont');
			var $firstItem = $cont.find('.repeater-thumbnail:first');
			var $lastItem = $cont.find('.repeater-thumbnail:last');

			equal($firstItem.hasClass('selectable'), true, 'thumbnails have selectable class as expected');
			$firstItem.click();
			equal($firstItem.hasClass('selected'), true, 'thumbnail has selected class after being clicked as expected');
			$lastItem.click();
			equal(($firstItem.hasClass('selected') && $lastItem.hasClass('selected')), true, 'both thumbnails have selected class after another click');
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		});
	});

	asyncTest('should clear selected items', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			var $cont = $repeater.find('.repeater-thumbnail-cont');
			var $firstItem = $cont.find('.repeater-thumbnail:first');
			var $lastItem = $cont.find('.repeater-thumbnail:last');

			$firstItem.click();
			$lastItem.click();
			
			setTimeout(function(){
				start();
				$repeater.repeater('thumbnail_clearSelectedItems');
				equal((!$firstItem.hasClass('selected') && !$lastItem.hasClass('selected')), true, 'selected thumbnails cleared as expected');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		});
	});

	asyncTest('should get selected items', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			var $cont = $repeater.find('.repeater-thumbnail-cont');
			var $firstItem = $cont.find('.repeater-thumbnail:first');
			var $lastItem = $cont.find('.repeater-thumbnail:last');
			var selected;

			$firstItem.click();
			$lastItem.click();
			
			setTimeout(function(){
				start();
				selected = $repeater.repeater('thumbnail_getSelectedItems');
				equal(selected.length, 2, 'returned array contains appropriate number of items');
				equal(selected[0].length>0, true, 'returned array items are jQuery elements as appropriate');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		});
	});

	asyncTest('should set selected items', function(){
		var $repeater = $(this.$markup);

		$repeater.one('loaded.fu.repeater', function(){
			var $cont = $repeater.find('.repeater-thumbnail-cont');

			setTimeout(function(){
				var n = 0;

				start();

				$repeater.find('.repeater-thumbnail').each(function(){
					if(n===4){
						$(this).addClass('test');
						return false;
					}else{
						n++;
					}
				});

				$repeater.repeater('thumbnail_setSelectedItems', [{ index: 0 }]);
				equal($repeater.repeater('thumbnail_getSelectedItems').length, 1, 'correct number of items selected');
				equal($cont.find('.repeater-thumbnail:first').hasClass('selected'), true, 'correct thumbnail selected by index');

				$repeater.repeater('thumbnail_setSelectedItems', [{ selector: '.test' }]);
				equal($repeater.repeater('thumbnail_getSelectedItems').length, 1, 'correct number of items selected');
				equal($repeater.find('.repeater-thumbnail.test').hasClass('selected'), true, 'correct thumbnail selected by selector');

				$repeater.repeater('thumbnail_setSelectedItems', [{ index: 0 }, { index: 1 }, { index: 2 }, { selector: '.test' }], true);
				equal($repeater.repeater('thumbnail_getSelectedItems').length, 4, 'correct number of thumbnails selected when using force');
			}, 0);
		});

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_selectable: true
		});
	});

	asyncTest('should handle alignment option properly', function(){
		var alignment = 'none';
		var $repeater = $(this.$markup);
		var self = this;
		
		function loaded(){
			var $cont = $repeater.find('.repeater-thumbnail-cont');
		
			setTimeout(function(){
				switch(alignment){
					case 'center':
						equal($cont.hasClass('align-center'), true, 'repeater-thumbnail-cont has align-center class when alignment option set to ' + alignment);
						equal($cont.find('span.spacer').length>0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment);
						alignment = 'justify';
						break;
					case 'justify':
						equal($cont.hasClass('align-justify'), true, 'repeater-thumbnail-cont has align-justify class when alignment option set to ' + alignment);
						equal($cont.find('span.spacer').length>0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment);
						alignment = 'left';
						break;
					case 'left':
						equal($cont.hasClass('align-left'), true, 'repeater-thumbnail-cont has align-left class when alignment option set to ' + alignment);
						equal($cont.find('span.spacer').length>0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment);
						alignment = 'right';
						break;
					case 'right':
						equal($cont.hasClass('align-right'), true, 'repeater-thumbnail-cont has align-right class when alignment option set to ' + alignment);
						equal($cont.find('span.spacer').length>0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment);
						alignment = false;
						break;
					default:
						equal($cont.hasClass('align-center align-justify align-left align-right'), false, 'repeater-thumbnail-cont does not have alignment classes when alignment set to ' + alignment);
						equal($cont.find('span.spacer').length, 0, 'repeater-thumbnail-cont does not contain spacers when alignment option set to ' + alignment);
						if(alignment==='none'){
							alignment = 'center';
						}else{
							start();
							return;
						}
				}
				
				$repeater.remove();
				$repeater = $(self.$markup);
				
				$repeater.one('loaded.fu.repeater', loaded);
				
				$repeater.repeater({
					dataSource: dataSource,
					thumbnail_alignment: alignment
				});
			}, 0);
		}

		$repeater.one('loaded.fu.repeater', loaded);

		$repeater.repeater({
			dataSource: dataSource,
			thumbnail_alignment: alignment
		});
	});
});
