/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/selectlist-markup.html');

	require('bootstrap');
	require('fuelux/selectlist');

	module("Fuel UX Selectlist");

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
		var expectedItem = { text: 'Three', value: 3 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function () {
		var $selectlist = $(html).selectlist();
		$selectlist.selectlist('selectByText', 'Item Five');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
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
