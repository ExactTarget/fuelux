/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');

	require('bootstrap');
	require('fuelux/pillbox');

	module("Fuel UX Pillbox", {
		setup: function(){
			this.pillboxHTML = '<div class="pillbox"><ul class="pillbox-list">' +
				'<li data-value="foo"><span>one</span><span>x</span></li>' +
				'<li><span>two</span><span>x</span></li>' +
				'<div class="pillbox-input-wrap">'+
					'<input type="text" class="pillbox-input" size="10" placeholder="add item">'+
						'<ul class="pillbox-suggest" style="display:none;">'+
						'</ul>' +
					'</div>' +
			'</ul></div>';
			this.emptyPillboxHTML = '<div class="pillbox"><ul class="pillbox-list"></ul></div>';
		}
	});

	test("should be defined on jquery object", function () {
		ok($(this.pillboxHTML).pillbox, 'pillbox method is defined');
	});

	test("should return element", function () {
		var $pillbox = $(this.pillboxHTML);
		ok($pillbox.pillbox() === $pillbox, 'pillbox should be initialized');
	});

	test("should behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox();

		equal($pillbox.pillbox('items').length, 2, 'pillbox returns both items');

		$pillbox.find('li > span:last').click();

		equal($pillbox.pillbox('items').length, 1, 'pillbox removed an item');
		deepEqual($pillbox.pillbox('items')[0], {text: 'one', value: 'foo'}, 'pillbox returns item data');
	});

	test("Input functionality should behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox();
		var $input = $pillbox.find('.pillbox-input');

		$input.val('three');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));

		deepEqual($pillbox.pillbox('items')[2], {text: 'three', value: 'three'}, 'pillbox returns added item');
	});

	test("itemCount function", function(){
		var $pillbox = $(this.emptyPillboxHTML).pillbox();

		equal($pillbox.pillbox('itemCount'), 0, 'itemCount on empty pillbox');

		$pillbox = $(this.pillboxHTML).pillbox();

		equal($pillbox.pillbox('itemCount'), 2, 'itemCount on pillbox with 2 items');
	});

	test("addItems/removeItems functions", function(){
		var $pillbox = $(this.emptyPillboxHTML).pillbox();

		equal($pillbox.pillbox('itemCount'), 0, 'pillbox is initially empty');

		$pillbox.pillbox('addItems', {text:'Item 1', value:1});
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 1', value: 1}, 'singe item added has correct text and value');

		$pillbox.pillbox('addItems', {text:'Item 2', value:2});
		$pillbox.pillbox('removeItems');
		equal($pillbox.pillbox('items').length, 0, 'removedItems removed all items');

		$pillbox.pillbox('addItems', {text:'Item 1', value:1},{text:'Item 2', value:2});
		deepEqual($pillbox.pillbox('items')[1], {text: 'Item 2', value: 2}, 'multiple items have been added correctly');

		$pillbox.pillbox('removeItems');

		$pillbox.pillbox('addItems', [{text:'Item 1', value:1},{text:'Item 2', value:2},{text:'Item 3', value:3}]);
		deepEqual($pillbox.pillbox('items')[2], {text: 'Item 3', value: 3}, 'multiple items have been added correctly by array');

		$pillbox.pillbox('removeItems',2,1);
		deepEqual($pillbox.pillbox('items')[1], {text: 'Item 3', value: 3}, 'single item has been removed at the correct index');
		$pillbox.pillbox('removeItems',1);
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 3', value: 3}, 'single item has been removed at the correct index');
	});

	test("removeByValue function", function(){
		var $pillbox = $(this.pillboxHTML).pillbox();

		equal($pillbox.pillbox('itemCount'), 2, 'pillbox has 2 items initially');

		$pillbox.pillbox('removeByValue', 'foo');

		equal($pillbox.pillbox('itemCount'), 1, 'pillbox has 1 item after removeByValue');
		deepEqual($pillbox.pillbox('items')[0], {text: 'two'}, 'item not removed has correct text and value');
	});

	test("removeByText function", function(){
		var $pillbox = $(this.pillboxHTML).pillbox();

		equal($pillbox.pillbox('itemCount'), 2, 'pillbox has 2 items initially');

		$pillbox.pillbox('removeByText', 'two');

		equal($pillbox.pillbox('itemCount'), 1, 'pillbox has 1 item after removeByText');
		deepEqual($pillbox.pillbox('items')[0], {text: 'one', value: 'foo'}, 'item not removed has correct text and value');
	});

	test("all user defined methods work as expected", function(){
		var $pillbox = $(this.pillboxHTML).pillbox({
			onAdd: function(data,callback){
				callbackTriggers++;
				callback(data);
			},
			onKeyDown: function( e, data, callback ){
				callbackTriggers++;
				callback(e, {data:[
					{text: 'three',value:'three-value'}
				]});
			},
			onRemove: function(data,callback){
				callbackTriggers++;
				callback(data);
			}
		});
		var $input = $pillbox.find('.pillbox-input');
		var callbackTriggers = 0;

		$input.val('three');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));
		equal(callbackTriggers, 1, 'onAdd triggered correctly');
		deepEqual($pillbox.pillbox('items')[2], {text: 'three', value: 'three'}, 'item correctly added after onAdd user callback');

		$input.trigger($.Event( "keydown", { keyCode: 97 } ));
		equal(callbackTriggers, 2, 'onKeyDown triggered correctly');

		$pillbox.find('> li > span:last').click();
		equal(callbackTriggers, 2, 'onRemove triggered correctly');
		deepEqual($pillbox.pillbox('items')[2], {text: 'three', value: 'three'}, 'item correctly added after onAdd user callback');

	});

	test("Suggestions functionality should behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox({
			onKeyDown: function( e, data, callback ){
				callback(e, {data:[
					{text: 'three',value:'three-value'}
				]});
			}
		});
		var $input = $pillbox.find('.pillbox-input');

		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) );

		$pillbox.find('.pillbox-suggest > li').trigger('mousedown');

		deepEqual($pillbox.pillbox('items')[2], {text: 'three', value: 'three-value'}, 'pillbox returns item added after user clicks suggestion');

		$input.val('three');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 40 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		deepEqual($pillbox.pillbox('items')[3], {text: 'three', value: 'three-value'}, 'pillbox returns item added after user keys down to suggestions');

		$input.val('three');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 38 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		deepEqual($pillbox.pillbox('items')[4], {text: 'three', value: 'three-value'}, 'pillbox returns item added after user keys up to suggestion');

		$input.val('three');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 9 } ) );
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		deepEqual($pillbox.pillbox('items')[5], {text: 'three', value: 'three-value'}, 'pillbox returns item added after user tabs down to suggestion');

		equal($pillbox.pillbox('items').length, 6, 'pillbox removed an item');
	});

	test("Edit functionality should behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox({
			edit: true
		});
		var $ul = $pillbox.find('ul');
		var $input = $pillbox.find('.pillbox-input');

		$pillbox.find('ul > li:first').click();
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), true, 'pillbox item enters edit mode');

		$input.trigger('blur');
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), false, 'pillbox item exits edit mode');

		$pillbox.find('ul > li:first').click();
		$input.val('test edit');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		deepEqual($pillbox.pillbox('items')[0], {text: 'test edit', value: 'test edit'}, 'pillbox item was able to be edited');
	});

	test("Triggers behave as designed", function () {
		var $pillbox = $(this.pillboxHTML).pillbox();
		var $input = $pillbox.find('.pillbox-input');

		$pillbox.on('clicked', function( ev, item ){
			deepEqual(item, {text: 'one', value: 'foo'}, 'clicked event is triggered');
		});
		$pillbox.find('> ul > li:first').click();
		$pillbox.off('clicked');

		$pillbox.on('added', function( ev, item ){
			deepEqual(item, {text: 'added test', value: 'added test'}, 'added event is triggered');
		});
		$input.val('added test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		$pillbox.off('added');

		$pillbox.on('removed', function( ev, item ){
			deepEqual(item, {text: 'added test', value: 'added test'}, 'removed event is triggered');
		});
		$pillbox.find('> ul > li:first > span:last').click();
		$pillbox.off('removed');

		$pillbox = $(this.pillboxHTML).pillbox({edit: true});
		$pillbox.on('edited', function( ev, item ){
			deepEqual(item, {text: 'edit test', value: 'edit test'}, 'edit event is triggered');
		});
		$pillbox.find('> ul > li:first').click();
		$input.val('edit test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
	});
});








