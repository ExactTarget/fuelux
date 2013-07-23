/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/pillbox'], function($) {

	module("Fuel UX pillbox", {
		setup: function(){
			this.pillboxHTML = '<div><ul>' +
				'<li data-value="foo">one</li><li>two</li>' +
			'</ul></div>';
			this.emptyPillboxHTML = '<div><ul></ul></div>';
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

		$pillbox.find('li').eq(1).click();

		equal($pillbox.pillbox('items').length, 1, 'pillbox removed an item');
		deepEqual($pillbox.pillbox('items')[0], {text: 'one', value: 'foo'}, 'pillbox returns item data');
	});
	
	test("itemCount function", function(){
		var $pillbox = $(this.emptyPillboxHTML).pillbox();
		
		equal($pillbox.pillbox('itemCount'), 0, 'itemCount on empty pillbox');
		
		$pillbox = $(this.pillboxHTML).pillbox();
		
		equal($pillbox.pillbox('itemCount'), 2, 'itemCount on pillbox with 2 items');	
	});
	
	test("addItem function", function(){
		var $pillbox = $(this.emptyPillboxHTML).pillbox();
		
		equal($pillbox.pillbox('itemCount'), 0, 'pillbox is initially empty');
		
		$pillbox.pillbox('addItem', 'Item 1', 1);
		
		equal($pillbox.pillbox('itemCount'), 1, 'pillbox has 1 item after addItem called');		
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 1', value: 1}, 'item added has correct text and value');
	});
	
	test("addItem function with return value manipulation", function(){
		var $pillbox = $(this.emptyPillboxHTML).pillbox();
		
		equal($pillbox.pillbox('itemCount'), 0, 'pillbox is initially empty');
		
		var $item = $pillbox.pillbox('addItem', 'Item 1', 1);
		$item.data('emailid', 123);
		
		equal($pillbox.pillbox('itemCount'), 1, 'pillbox has 1 item after addItem called');		
		deepEqual($pillbox.pillbox('items')[0], {text: 'Item 1', value: 1, emailid: 123}, 'item added has correct text, value, and emailid');
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
	
	test("clear function", function(){
		var $pillbox = $(this.pillboxHTML).pillbox();
		
		equal($pillbox.pillbox('itemCount'), 2, 'pillbox has 2 items initially');
		
		$pillbox.pillbox('clear');
		
		equal($pillbox.pillbox('itemCount'), 0, 'pillbox empty after clear');
	});
});