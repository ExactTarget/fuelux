/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/combobox-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	html = $('<div>'+html+'</div>').find('#MyComboboxContainer');

	require('bootstrap');
	require('fuelux/combobox');

	module("Fuel UX Combobox");

	test("should be defined on jquery object", function () {
		ok($().combobox, 'combobox method is defined');
	});

	test("should return element", function () {
		var $combobox = $(html).find("#MyCombobox");
		ok($combobox.combobox() === $combobox , 'combobox should be initialized');
	});

	test("should disable dropdown menu if no items exists", function () {
		var $combobox = $(html).find('#MyComboboxSingleItem').combobox();
		equal($combobox.find('.btn').hasClass('disabled'), true, 'dropdown disabled');
	});

	test("should set disabled state", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('disable');
		equal($combobox.find('.btn').hasClass('disabled'), true, 'element disabled');
	});

	test("should set enabled state", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('disable');
		$combobox.combobox('enable');
		equal($combobox.find('.btn').hasClass('disabled'), false, 'element enabled');
	});

	test("should set default selection", function () {
		// should be "Three" based on the data-selected attribute
		var $combobox = $(html).find("#MyComboboxWithSelected").combobox();
		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Three', value: 3 };
		deepEqual(item, expectedItem, 'default item selected');
	});

	test("should not autoselect when no default selection", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: '' };
		deepEqual(item, expectedItem, 'no item selected');
	});

	test("should return selectedItem", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByIndex', 0);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'selectedItem returns expected value');
	});

	test("should return selectedItem", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByIndex', 0);

		var item1 = $combobox.combobox('selectedItem');
		var item2 = $combobox.combobox('getValue');
		deepEqual(item1, item2, 'getValue alias matches selectedItem');
	});

	test("should select by index", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByIndex', 0);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByValue', 2);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value with whitespace", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByValue', 'Item Five');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text", function() {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByText', 'THREE');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Three', value: 3 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function() {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectByText', 'Item Five');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by selector", function () {
		var $combobox = $(html).find("#MyCombobox").combobox();
		$combobox.combobox('selectBySelector', 'li[data-fizz=buzz]');

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text: 'Six', value: 6, foo: 'bar', fizz: 'buzz' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should fire changed event - item selected", function () {
		var eventFireCount = 0;
		var selectedText = '';
		var selectedValue = '';

		var $combobox = $(html).find("#MyCombobox").combobox().on('changed.fu.combobox', function (evt, data) {
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

		var $combobox = $(html).find("#MyCombobox").combobox();

		$combobox.find('input').on('change', function () {
			eventFireCount++;
		});

		// simulate changed event
		$combobox.find('a:first').click();

		equal(eventFireCount, 1, 'change event fired once');
	});

	test("should fire bubblable input change event - item selected", function () {
		var eventFireCount = 0;

		var $combobox = $(html).find("#MyCombobox").combobox();

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

		var $combobox = $(html).find("#MyCombobox").combobox().on('changed.fu.combobox', function (evt, data) {
			eventFireCount++;
			selectedText = data.text;
		});

		$combobox.find('input').val('Seven').change();

		equal(eventFireCount, 1, 'changed event fired once');
		equal(selectedText, 'Seven', 'text passed in from changed event');
	});

	test("should destroy control", function () {
		var id = '#MyCombobox';
		var $el = $(html).find(id).combobox();

		equal(typeof( $el.combobox('destroy')) , 'string', 'returns string (markup)');
		equal( $(html).find(id).length, false, 'control has been removed from DOM');
	});

	test("should remove whitespace", function () {
		var $combobox = $(html).find("#MyComboboxWithWhiteSpace").combobox();
		$combobox.combobox('selectByIndex', 0);

		var item = $combobox.combobox('selectedItem');
		equal(item.text, 'no whitespace', 'whitespace was removed');
	});

});
