/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/selectlist'], function ($) {

	var html = '<div id="MySelectList" class="selectlist btn-group" data-resize="auto">' +
			'		<button type="button" class="btn btn-label"><span class="selected-label"></span></button>' +
			'		<button type="button" class="btn btn-dropdown dropdown-toggle" data-toggle="dropdown">' +
			'			<span class="caret"></span>' +
			'			<span class="sr-only">Toggle Dropdown</span>' +
			'		</button>' +
			'		<ul class="dropdown-menu" role="menu">' +
			'			<li data-value="1"><a href="#">One</a></li>' +
			'			<li data-value="2" data-selected="true"><a href="#">Two</a></li>' +
			'			<li data-value="3"><a href="#">Three</a></li>' +
			'			<li data-value="4" data-foo="bar" data-fizz="buzz"><a href="#">Buzz</a></li>' +
			'			<li data-value="Item Five"><a href="#">Item Five</a></li>' +
			'		</ul>' +
			'		<input class="hidden hidden-field" name="MySelectList" readonly="readonly" aria-hidden="true" type="text"/>' +
			'	</div>';


	module("Fuel UX button dropdown");

	test("should be defined on jquery object", function () {
		ok($(document.body).selectlist, 'selectlist method is defined');
	});

	test("should return element", function () {
		ok($(document.body).selectlist()[0] === document.body, 'document.body returned');
	});

	test("should set disabled state", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('disable');
		equal($selectlist.find('.btn').hasClass('disabled'), true, 'element disabled');
	});

	test("should set enabled state", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('disable');
		$selectlist.selectlist('enable');
		equal($selectlist.find('.btn').hasClass('disabled'), false, 'element enabled');
	});

	test("should set default selection", function () {
		// should be "Three" based on the data-selected attribute
		var $selectlist = $(html).selectlist();
		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'default item selected');
	});

	test("should select by index", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByIndex', 0);

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByValue', 2);

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value with whitespace", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByValue', 'Item Five');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByText', 'THREE');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Three' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByText', 'Item Five');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by selector", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectBySelector', 'li[data-fizz=buzz]');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Buzz', value: 4, foo: 'bar', fizz: 'buzz' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should fire changed event", function () {
		var eventFired = false;
		var selectedText = '';
		var selectedValue = '';

		var $selectlist = $(html).selectlist().on('changed', function (evt, data) {
			eventFired = true;
			selectedText = data.text;
			selectedValue = data.value;
		});

		// simulate changed event
		$selectlist.find('a:first').click();

		equal(eventFired, true, 'changed event fired');
		equal(selectedText, 'One', 'text passed in from changed event');
		equal(selectedValue, 1, 'value passed in from changed event');
	});

});
