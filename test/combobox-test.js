/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var originalHTML = require('text!test/markup/combobox-markup.html!strip');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	var html = $('<div>'+originalHTML+'</div>').find('#MyComboboxContainer');

	require('bootstrap');
	require('fuelux/combobox');

	module("Fuel UX Combobox", {
		beforeEach: function () {
			html = null;
			html = $('<div>'+originalHTML+'</div>').find('#MyComboboxContainer');
		}
	});

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
		var expectedItem = { notFound: true, text: '' };
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

	var userInteracts = function userInteracts($combobox) {
		var DOWN_KEY = 40;
		var DOWN_EVENT = jQuery.Event("keyup", {which: DOWN_KEY, keyCode: DOWN_KEY, charCode: DOWN_KEY});
		var UP_KEY = 38;
		var UP_EVENT = jQuery.Event("keyup", {which: UP_KEY, keyCode: UP_KEY, charCode: UP_KEY});
		var BACKSPACE_KEY = 8;
		var BACKSPACE_EVENT = jQuery.Event("keyup", {which: BACKSPACE_KEY, keyCode: BACKSPACE_KEY, charCode: BACKSPACE_KEY});
		var ENTER_KEY = 13;
		var ENTER_EVENT = jQuery.Event("keyup", {which: ENTER_KEY, keyCode: ENTER_KEY, charCode: ENTER_KEY});
		var T_KEY = 84;
		var T_EVENT = jQuery.Event("keyup", {which: T_KEY, keyCode: T_KEY, charCode: T_KEY});

		// Due to browser security, we are unable to fire "synthetic" events manually. Therefore, we must
		// set the input to what we want -THEN- fire the event that would have caused that change
		// http://stackoverflow.com/questions/13944835/how-to-simulate-typing-in-input-field-using-jquery
		// NOTE that if we fire the event and then set the input it won't work because the input will not
		// yet contain the value we are expecting. So, below you will see that we set the value to 'T' just
		// prior to firing the keyboard event that would have done the setting.
		$combobox.find('input')
			.val('')
			.trigger(BACKSPACE_EVENT)
			.trigger(BACKSPACE_EVENT)
			.trigger(BACKSPACE_EVENT)
			.trigger(BACKSPACE_EVENT)
			.trigger(BACKSPACE_EVENT)
			.val('T')
			.trigger(T_EVENT)
			.trigger(DOWN_EVENT)
			.trigger(ENTER_EVENT);
	};

	test("should not select any menu items via keyboard navigation with filter off and showOptionsOnKeypress off", function() {
		var $combobox = $(html).find("#MyCombobox").combobox();

		userInteracts($combobox);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { notFound: true, text:'T' };
		deepEqual(item, expectedItem, 'Combobox was not triggered, filter not activated');
	});

	test("should respond to keypresses appropriately with filter off and showOptionsOnKeypress on", function() {
		var $combobox = $(html).find("#MyComboboxWithSelectedForOptions").combobox({ showOptionsOnKeypress: true });

		userInteracts($combobox);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Four', value: 4 };
		deepEqual(item, expectedItem, 'Combobox was triggered with filter inactive but showOptionsOnKeypress active');
	});

	test("should respond to keypresses appropriately with filter and showOptionsOnKeypress on", function() {
		var $combobox = $(html).find("#MyComboboxWithSelectedForFilter").combobox({ showOptionsOnKeypress: true, filterOnKeypress: true });

		userInteracts($combobox);

		var item = $combobox.combobox('selectedItem');
		var expectedItem = { text:'Two', value: 2 };
		deepEqual(item, expectedItem, 'Combobox was triggered with filter active');
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

	test("should fire changed event once when input is changed", function () {
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
