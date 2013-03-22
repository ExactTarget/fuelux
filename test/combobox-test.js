/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/combobox'], function ($) {

	var html = '<div class="input-append dropdown combobox">' +
		'<input class="span2" type="text"><button class="btn" data-toggle="dropdown"><i class="caret"></i></button>' +
		'<ul class="dropdown-menu">' +
		'<li data-value="1"><a href="#">One</a></li>' +
		'<li data-value="2"><a href="#">Two</a></li>' +
		'<li data-value="3" data-selected="true"><a href="#">Three</a></li>' +
		'<li data-value="4" data-foo="bar" data-fizz="buzz"><a href="#">Four</a></li>' +
		'<li data-value="Item Five"><a href="#">Item Five</a></li>' +
		'</ul>' +
		'</div>';

	var htmlNoDefault = '<div class="input-append dropdown combobox">' +
		'<input class="span2" type="text"><button class="btn" data-toggle="dropdown"><i class="caret"></i></button>' +
		'<ul class="dropdown-menu">' +
		'<li data-value="1"><a href="#">One</a></li>' +
		'<li data-value="2"><a href="#">Two</a></li>' +
		'<li data-value="3"><a href="#">Three</a></li>' +
		'<li data-value="4" data-foo="bar" data-fizz="buzz"><a href="#">Four</a></li>' +
		'</ul>' +
		'</div>';

	module("Fuel UX combobox");

	test("should be defined on jquery object", function () {
		ok($(document.body).combobox, 'combobox method is defined');
	});

	test("should return element", function () {
		ok($(document.body).combobox()[0] === document.body, 'document.body returned');
	});

	test("should set disabled state", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('disable');
		equal($combobox.find('.btn').hasClass('disabled'), true, 'element disabled');
	});

	test("should set enabled state", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('disable');
		$combobox.combobox('enable');
		equal($combobox.find('.btn').hasClass('disabled'), false, 'element enabled');
	});

	test("should set default selection", function () {
		// should be "Three" based on the data-selected attribute
		var $combobox = $(html).combobox();
		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Three', value: 3 };
		deepEqual(item, expectedItem, 'default item selected');
	});

	test("should not autoselect when no default selection", function () {
		var $combobox = $(htmlNoDefault).combobox();
		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: '' };
		deepEqual(item, expectedItem, 'no item selected');
	});

	test("should select by index", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectByIndex', 0);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectByValue', 2);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value with whitespace", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectByValue', 'Item Five');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text", function() {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectByText', 'THREE');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Three', value: 3 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function() {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectByText', 'Item Five');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by selector", function () {
		var $combobox = $(html).combobox();
		$combobox.combobox('selectBySelector', 'li[data-fizz=buzz]');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Four', value: 4, foo: 'bar', fizz: 'buzz' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should fire changed event - item selected", function () {
		var eventFireCount = 0;
		var selectedText = '';
		var selectedValue = '';

		var $combobox = $(html).combobox().on('changed', function (evt, data) {
			eventFireCount++;
			selectedText = data.text;
			selectedValue = data.value;
		});

		// simulate changed event
		$combobox.find('a:first').click();

		equal(eventFireCount, 1, 'changed event fired once');
		equal(selectedText, 'One', 'text passed in from changed event');
		equal(selectedValue, 1, 'value passed in from changed event');
	});

	test("should fire input change event - item selected", function () {
		var eventFireCount = 0;

		var $combobox = $(html).combobox();

		$combobox.find('input').on('change', function () {
			eventFireCount++;
		});

		// simulate changed event
		$combobox.find('a:first').click();

		equal(eventFireCount, 1, 'change event fired once');
	});

	test("should fire bubblable input change event - item selected", function () {
		var eventFireCount = 0;

		var $combobox = $(html).combobox();

		$combobox.on('change', 'input', function () {
			eventFireCount++;
		});

		// simulate changed event
		$combobox.find('a:first').click();

		equal(eventFireCount, 1, 'change event bubbled once');
	});

	test("should fire changed event - input changed", function () {
		var eventFireCount = 0;
		var selectedText = '';

		var $combobox = $(html).combobox().on('changed', function (evt, data) {
			eventFireCount++;
			selectedText = data.text;
		});

		$combobox.find('input').val('Seven').change();

		equal(eventFireCount, 1, 'changed event fired once');
		equal(selectedText, 'Seven', 'text passed in from changed event');
	});

});