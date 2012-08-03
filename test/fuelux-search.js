/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux'], function($) {

	module("FuelUX search");

	test("should be defined on jquery object", function () {
		ok($(document.body).search, 'search method is defined');
	});

	test("should return element", function () {
		ok($(document.body).search()[0] === document.body, 'document.body returned');
	});

	test("should ignore empty search", function () {
		var searchHTML = '<div><input><button><i></i></button></div>';

		var $search = $(searchHTML).search();

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

});