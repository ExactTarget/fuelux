/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/pillbox-markup.html');

	require('bootstrap');
	require('fuelux/pillbox');

	module("Fuel UX Pillbox");

	test("should be defined on jquery object", function () {
		ok($().find('#MyPillbox').pillbox, 'pillbox method is defined');
	});

	test("should return element", function () {
		var $pillbox = $(html).find('#MyPillbox');
		ok($pillbox.pillbox() === $pillbox, 'pillbox is initialized');
	});

	test("should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('items').length, 5, 'pillbox returns both items');

		$pillbox.find('li > span:last').click();

		equal($pillbox.pillbox('items').length, 4, 'pillbox removed an item');
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 1', value: 'foo'}, 'pillbox returns item data');
	});

	test("Input functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox();
		var $input = $pillbox.find('.pillbox-add-item');

		$input.val('three-value');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));

		deepEqual($pillbox.pillbox('items')[5], {text: 'three-value', value: 'three-value'}, 'pillbox returns added item');
	});

	test("itemCount function", function(){
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox();

		equal($pillbox.pillbox('itemCount'), 0, 'itemCount on empty pillbox');

		$pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'itemCount on pillbox with 5 items');
	});

	test("addItems/removeItems functions", function(){
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox();

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
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'pillbox has 7 items initially');

		$pillbox.pillbox('removeByValue', 'foo');

		equal($pillbox.pillbox('itemCount'), 4, 'pillbox has 1 item after removeByValue');
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 2'}, 'item not removed has correct text and value');
	});

	test("removeByText function", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'pillbox has 7 items initially');

		$pillbox.pillbox('removeByText', 'Item 2');

		equal($pillbox.pillbox('itemCount'), 4, 'pillbox has 1 item after removeByText');
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 1', value: 'foo'}, 'item not removed has correct text and value');
	});

	test("all user defined methods work as expected", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox({
			onAdd: function(data,callback){
				callbackTriggers++;
				callback(data);
			},
			onKeyDown: function( data, callback ){
				callbackTriggers++;
				callback({data:[
					{text: 'Item 3',value:'three-value'}
				]});
			},
			onRemove: function(data,callback){
				callbackTriggers++;
				callback(data);
			}
		});
		var $input = $pillbox.find('.pillbox-add-item');
		var callbackTriggers = 0;

		$input.val('anything');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));	//enter
		equal(callbackTriggers, 1, 'onAdd triggered correctly');
		deepEqual($pillbox.pillbox('items')[2], {text: 'Item 3', value: 'three-value'}, 'item correctly added after onAdd user callback');

		$input.trigger($.Event( "keydown", { keyCode: 97 } ));	// number 1
		equal(callbackTriggers, 2, 'onKeyDown triggered correctly');

		$pillbox.find('> li > .glyphicon-close').click();
		equal(callbackTriggers, 2, 'onRemove triggered correctly');
		deepEqual($pillbox.pillbox('items')[2], {text: 'Item 3', value: 'three-value'}, 'item correctly added after onAdd user callback');

	});

	test("Suggestions functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox({
			onKeyDown: function( data, callback ){
				callback({data:[
					{ text: 'Acai', value:  'acai' },
					{ text: 'African cherry orange', value:  'african cherry orange' },
					{ text: 'Banana', value:  'banana' },
					{ text: 'Bilberry', value:  'bilberry' },
					{ text: 'Cantaloupe', value:  'cantaloupe' },
					{ text: 'Ceylon gooseberry', value:  'ceylon gooseberry' },
					{ text: 'Dragonfruit', value:  'dragonfruit' },
					{ text: 'Dead Man\'s Fingers', value:  'dead man\'s fingers' },
					{ text: 'Fig', value:  'fig' },
					{ text: 'Forest strawberries', value:  'forest strawberries' },
					{ text: 'Governor’s Plum', value:  'governor’s plum' },
					{ text: 'Grapefruit', value:  'grapefruit' },
					{ text: 'Guava', value:  'guava' },
					{ text: 'Honeysuckle', value:  'honeysuckle' },
					{ text: 'Huckleberry', value:  'huckleberry' },
					{ text: 'Jackfruit', value:  'jackfruit' },
					{ text: 'Japanese Persimmon', value:  'japanese persimmon' },
					{ text: 'Key Lime', value:  'key lime' },
					{ text: 'Kiwi', value:  'kiwi' },
					{ text: 'Lemon', value:  'lemon' },
					{ text: 'Lillypilly', value:  'lillypilly' },
					{ text: 'Mandarin', value:  'mandarin' },
					{ text: 'Miracle Fruit', value:  'miracle fruit' },
					{ text: 'Orange', value:  'orange' },
					{ text: 'Oregon grape', value:  'oregon grape' },
					{ text: 'Persimmon', value:  'persimmon' },
					{ text: 'Pomegranate', value:  'pomegranate' },
					{ text: 'Rhubarb', value:  'rhubarb' },
					{ text: 'Rose hip', value:  'rose hip' },
					{ text: 'Soursop', value:  'soursop' },
					{ text: 'Starfruit', value:  'starfruit' },
					{ text: 'Tamarind', value:  'tamarind' },
					{ text: 'Thimbleberry', value:  'thimbleberry' },
					{ text: 'Wineberry', value:  'wineberry' },
					{ text: 'Wongi', value:  'wongi' },
					{ text: 'Youngberry', value: 'youngberry' }
				]});
			}
		});
		var $input = $pillbox.find('.pillbox-add-item');

		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$pillbox.find('.suggest > li').trigger('mousedown');
		deepEqual($pillbox.pillbox('items')[0], { text: 'Acai', value: 'acai' }, 'pillbox returns item added after user clicks suggestion');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 40 } ) ); // down
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter
		deepEqual($pillbox.pillbox('items')[1], { text: 'Acai', value: 'acai' }, 'pillbox returns item added after user keys down to suggestions');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 38 } ) ); // up
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter

		deepEqual($pillbox.pillbox('items')[2], { text: 'Acai', value: 'acai' }, 'pillbox returns item added after user keys up to suggestion');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 9 } ) ); // tab
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter
		deepEqual($pillbox.pillbox('items')[3], { text: 'Acai', value: 'acai' }, 'pillbox returns item added after user tabs down to suggestion');

		equal($pillbox.pillbox('items').length, 4, 'pillbox removed an item');
	});

	test("Edit functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox({
			edit: true
		});
		var $ul = $pillbox.find('.pill-group');
		var $input = $pillbox.find('.pillbox-add-item');

		$pillbox.find('.pill-group > li:first').click();
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), true, 'pillbox item enters edit mode');

		$input.trigger('blur');
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), false, 'pillbox item exits edit mode');

		$pillbox.find('.pill-group > li:first').click();
		$input.val('test edit');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		deepEqual($pillbox.pillbox('items')[0], {text: 'test edit', value: 'test edit'}, 'pillbox item was able to be edited');
	});

	test("Triggers behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox();
		var $input = $pillbox.find('.pillbox-add-item');

		$pillbox.on('clicked.fu.pillbox', function( ev, item ){
			deepEqual(item, {text: 'Item 1', value: 'foo'}, 'clicked event is triggered');
		});
		$pillbox.find('> ul > li:first').click();
		$pillbox.off('clicked.fu.pillbox');

		$pillbox.on('added.fu.pillbox', function( ev, item ){
			deepEqual(item, {text: 'added test', value: 'added test'}, 'added event is triggered');
		});
		$input.val('added test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		$pillbox.off('added.fu.pillbox');

		$pillbox.on('removed.fu.pillbox', function( ev, item ){
			deepEqual(item, {text: 'added test', value: 'added test'}, 'removed event is triggered');
		});
		$pillbox.find('> ul > li:first > span:last').click();
		$pillbox.off('removed.fu.pillbox');

		$pillbox = $(html).pillbox({edit: true});
		$pillbox.on('edited.fu.pillbox', function( ev, item ){
			deepEqual(item, {text: 'edit test', value: 'edit test'}, 'edit event is triggered');
		});
		$pillbox.find('> ul > li:first').click();
		$input.val('edit test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
	});
});








