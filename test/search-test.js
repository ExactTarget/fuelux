/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/search'], function($) {

	module("Fuel UX search");

	test("should be defined on jquery object", function () {
		ok($(document.body).search, 'search method is defined');
	});

	test("should return element", function () {
		ok($(document.body).search()[0] === document.body, 'document.body returned');
	});

	test("should ignore empty search", function () {
		var searchHTML = '<div><input><button><i class="icon-search"></i></button></div>';

		var $search = $(searchHTML).search();

		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-search', 'search icon has not changed');
	});

	test("should ignore disabled button click", function () {
		var searchHTML = '<div><input><button class="disabled"><i class="icon-search"></i></button></div>';

		var $search = $(searchHTML).search();

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-search', 'search icon has not changed');
	});

	test("should process valid search", function () {
		var searchHTML = '<div><input><button><i></i></button></div>';
		var searchText = '';

		var $search = $(searchHTML).search().on('searched', function (e, text) { searchText = text; });

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-remove', 'search icon has changed');
		equal(searchText, 'search text', 'search text was provided in event');
	});

	test("should allow search to be cleared", function () {
		var searchHTML = '<div><input><button><i></i></button></div>';
		var clearedEventFired = false;

		var $search = $(searchHTML).search().on('cleared', function (e, text) { clearedEventFired = true; });

		$search.find('input').val('search text');
		$search.find('button').click();
		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-search', 'search icon has returned');
		equal($search.find('input').val(), '', 'search text has been cleared');
		equal(clearedEventFired, true, 'cleared event was fired');
	});

	test("should process sequential searches", function () {
		var searchHTML = '<div><input><button><i></i></button></div>';
		var searchText = '';

		var $search = $(searchHTML).search().on('searched', function (e, text) { searchText = text; });

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-remove', 'search icon has changed');
		equal(searchText, 'search text', 'search text was provided in event');

		$search.find('input').val('search text 2').keyup();
		equal($search.find('i').attr('class'), 'icon-search', 'search icon has returned');

		$search.find('button').click();

		equal($search.find('i').attr('class'), 'icon-remove', 'search icon has changed');
		equal(searchText, 'search text 2', 'search text was provided in event');
	});

	test("should correctly respond to disable and enable methods", function () {
		var searchHTML = '<div><input><button><i></i></button></div>';

		var $search = $(searchHTML).search();
		$search.search('disable');

		equal($search.find('input').attr('disabled'), 'disabled', 'input was disabled');
		equal($search.find('button').hasClass('disabled'), true, 'button was disabled');

		$search.search('enable');

		equal($search.find('input').attr('disabled'), undefined, 'input was enabled');
		equal($search.find('button').hasClass('disabled'), false, 'button was enabled');
	});

});