/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/selectlist-markup.html');
	/* FOR DEV TESTING */
	//var html = require('text!dev.html!strip');
	html = $('<div>'+html+'</div>');

	$('body').append(html);

	require('bootstrap');
	require('fuelux/selectlist');

	module("Fuel UX Selectlist");

	test("should be defined on jquery object", function () {
		ok($().selectlist, 'selectlist method is defined');
	});

	test("should return element", function () {
		var $selectlist = $(html).find('#MySelectlist').selectlist();
		ok($selectlist.selectlist() === $selectlist, 'selectlist should be initialized');
	});

	test("should autosize correctly", function () {
		var $selectlist8 = $('body').find('#MySelectlist8').selectlist();
		var $selectlist9 = $('body').find('#MySelectlist9').selectlist();
		var $btn, minWidth;

		//measure all children of selectlist to be tested (add them all to a span and see how wide the span is) and make sure the selectlist is actually big enough to fit that
		$btn = $selectlist8.find('button.dropdown-toggle');
		var $textLengthTester = $('<span id="textLengthTester" style="display:inline-block;"></span>').appendTo('body');
		$selectlist8.find('li').each(function(index, element){
			//set the p tag right/left padding to that of the selectlist button right/left padding
			$('<p style="padding: 0 ' + $btn.css('padding-right') + ' 0 ' + $btn.css('padding-left') + ';">' + $(element).text() + '</p>').appendTo($textLengthTester);
		});
		minWidth = $textLengthTester.width();
		ok(($selectlist8.width() >= minWidth), 'selectlist autoresized to ' + $selectlist8.width() + ' should be greater than ' + minWidth);


		//hidden selectlists have no size
		ok($selectlist9.width() === 0, 'selectlist hidden, sized 0');

		//remove hidden to prepare to measure its new size
		$selectlist9.removeClass('hidden');

		//measure all children of selectlist to be tested (add them all to a span and see how wide the span is) and make sure the selectlist is actually big enough to fit that
		$btn = $selectlist9.find('button.dropdown-toggle');
		$textLengthTester = $('<span id="textLengthTester" style="display:inline-block;"></span>').appendTo('body');
		$selectlist9.find('li').each(function(index, element){
			//set the p tag right/left padding to that of the selectlist button right/left padding
			$('<p style="padding: 0 ' + $btn.css('padding-right') + ' 0 ' + $btn.css('padding-left') + ';">' + $(element).text() + '</p>').appendTo($textLengthTester);
		});
		minWidth = $textLengthTester.width();
		ok(($selectlist9.width() >= minWidth), 'selectlist was hidden, now shown, sized ' + $selectlist9.width() + ' should be greater than ' + minWidth);
	});

	test("should set disabled state", function () {
		var $selectlist = $(html).find('#MySelectlist').selectlist();
		$selectlist.selectlist('disable');
		equal($selectlist.find('.btn').hasClass('disabled'), true, 'element disabled');
	});

	test("should set enabled state", function () {
		var $selectlist = $(html).find('#MySelectlist').selectlist();
		$selectlist.selectlist('disable');
		$selectlist.selectlist('enable');
		equal($selectlist.find('.btn').hasClass('disabled'), false, 'element enabled');
	});

	test("should set default selection", function () {
		var $selectlist = $(html).find('#MySelectlist2').selectlist(); //.selectlist();
		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = { selected: true, text: 'Two', value: 2 };
		deepEqual(item, expectedItem, 'default item selected');
	});

	test("should select by index", function () {
		var $selectlist = $(html).find('#MySelectlist3').selectlist();
		$selectlist.selectlist('selectByIndex', 0);

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'One', value: 1 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value", function () {
		var $selectlist = $(html.find('#MySelectlist4').selectlist()); //.selectlist();
		$selectlist.selectlist('selectByValue', 2);

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'Two', value: 2 }; //weird
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by value with whitespace", function () {
		var $selectlist = $(html).find('#MySelectlist5').selectlist();
		$selectlist.selectlist('selectByValue', 'Item Five');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'Item Five', value: 'Item Five' }; //weird
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text", function () {
		var $selectlist = $(html).find('#MySelectlist6').selectlist();
		$selectlist.selectlist('selectByText', 'THREE');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'Three', value: 3 };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by text with whitespace", function () {
		var $selectlist = $(html).find('#MySelectlist').selectlist();
		$selectlist.selectlist('selectByText', 'Item Five');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'Item Five', value: 'Item Five' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should select by selector", function () {
		var $selectlist = $(html).find('#MySelectlist').selectlist();
		$selectlist.selectlist('selectBySelector', 'li[data-fizz=buzz]');

		var item = $selectlist.selectlist('selectedItem');
		var expectedItem = {selected: true, text: 'Buzz', value: 4, foo: 'bar', fizz: 'buzz' };
		deepEqual(item, expectedItem, 'item selected');
	});

	test("should fire change event", function () {
		var eventFired = false;
		var selectedText = '';
		var selectedValue = '';

		var $selectlist = $(html).find('#MySelectlist').selectlist().on('changed.fu.selectlist', function (evt, data) {
			eventFired = true;
			selectedText = data.text;
			selectedValue = data.value;
		});

		// simulate changed event
		$selectlist.find('.dropdown-menu a:first').click();

		equal(eventFired, true, 'change event fired');
		equal(selectedText, 'One', 'text passed in from change event');
		equal(selectedValue, 1, 'value passed in from change event');
	});

	test("should destroy control", function () {
		var $el = $(html).find('#MySelectlist').selectlist();

		equal(typeof( $el.selectlist('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
