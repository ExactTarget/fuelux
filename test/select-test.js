/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/select'], function ($) {

	var html = '<div class="select btn-group">' +
		'<button data-toggle="dropdown" class="btn dropdown-toggle"><span class="dropdown-label"></span><span class="caret"></span></button>' +
		'<ul class="dropdown-menu">' +
		'<li data-value="1"><a href="#">One</a></li>' +
		'<li data-value="2"><a href="#">Two</a></li>' +
		'<li data-value="3" data-selected="true"><a href="#">Three</a></li>' +
		'<li data-value="4" data-foo="bar" data-fizz="buzz"><a href="#">Four</a></li>' +
		'<li data-value="Item Five"><a href="#">Item Five</a></li>' +
		'</ul>' +
		'</div>';


	module("Fuel UX select");

	test("should be defined on jquery object", function () {
		ok($(document.body).select, 'select method is defined');
	});

	test("should return element", function () {
		ok($(document.body).select()[0] === document.body, 'document.body returned');
	});

	test("should set disabled state", function () {
		var $select = $(html).select();
		$select.select('disable');
		equal($select.find('.btn').hasClass('disabled'), true, 'element disabled');
	});

	test("should set enabled state", function () {
		var $select = $(html).select();
		$select.select('disable');
		$select.select('enable');
		equal($select.find('.btn').hasClass('disabled'), false, 'element enabled');
	});

	test("should set default selection", function () {
		// should be "Three" based on the data-selected attribute
		var $select = $(html).select();
		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Three', value: 3 };
		deepEqual(item, expectedItem, 'default item selected');
	});

	test("should select by index", function () {
		var $select = $(html).select();
		$select.select('selectByIndex', 0);

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value", function () {
		var $select = $(html).select();
		$select.select('selectByValue', 2);

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value with whitespace", function () {
		var $select = $(html).select();
		$select.select('selectByValue', 'Item Five');

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text", function () {
		var $select = $(html).select();
		$select.select('selectByText', 'THREE');

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Three' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function () {
		var $select = $(html).select();
		$select.select('selectByText', 'Item Five');

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by selector", function () {
		var $select = $(html).select();
		$select.select('selectBySelector', 'li[data-fizz=buzz]');

		var item = $select.select('selectedItem');
		var expectedItem = { text: 'Four', value: 4, foo: 'bar', fizz: 'buzz' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should fire changed event", function () {
		var eventFired = false;
		var selectedText = '';
		var selectedValue = '';

		var $select = $(html).select().on('changed', function (evt, data) {
			eventFired = true;
			selectedText = data.text;
			selectedValue = data.value;
		});

		// simulate changed event
		$select.find('a:first').click();

		equal(eventFired, true, 'changed event fired');
		equal(selectedText, 'One', 'text passed in from changed event');
		equal(selectedValue, 1, 'value passed in from changed event');
	});
});