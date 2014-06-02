/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/search-markup.html');

	require('bootstrap');
	require('fuelux/search');

	module("Fuel UX Search");

	test("should be defined on jquery object", function () {
		ok($(document.body).search, 'search method is defined');
	});

	test("should return element", function () {
		ok($(document.body).search()[0] === document.body, 'document.body returned');
	});


	test("should ignore empty search", function () {
		var $search = $(html);

		$search.search();
		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-search', 'search icon has not changed');
	});

	test("should ignore disabled button click", function () {
		var $search = $(html);

		$search.find('button').addClass('disabled');
		$search.search();

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-search', 'search icon has not changed');
	});

	test("should process valid search", function () {
		var $search = $(html);
		var searchText = '';

		$search.search().on('searched.fu.search', function (e, text) { searchText = text; });

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-remove', 'search icon has changed');
		equal(searchText, 'search text', 'search text was provided in event');
	});

	test("should allow search to be cleared", function () {
		var $search = $(html);
		var clearedEventFired = false;

		$search.search().on('cleared.fu.search', function (e, text) { clearedEventFired = true; });

		$search.find('input').val('search text');
		$search.find('button').click();
		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-search', 'search icon has returned');
		equal($search.find('input').val(), '', 'search text has been cleared');
		equal(clearedEventFired, true, 'cleared event was fired');
	});

	test("should process sequential searches", function () {
		var $search = $(html);
		var searchText = '';

		$search.search().on('searched.fu.search', function (e, text) { searchText = text; });

		$search.find('input').val('search text');
		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-remove', 'search icon has changed');
		equal(searchText, 'search text', 'search text was provided in event');

		$search.find('input').val('search text 2').keyup();
		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-search', 'search icon has returned');

		$search.find('button').click();

		equal($search.find('.glyphicon').attr('class'), 'glyphicon glyphicon-remove', 'search icon has changed');
		equal(searchText, 'search text 2', 'search text was provided in event');
	});

	test("should correctly respond to disable and enable methods", function () {
		var $search = $(html);

		$search.search();
		$search.search('disable');

		equal($search.find('input').attr('disabled'), 'disabled', 'input was disabled');
		equal($search.find('button').hasClass('disabled'), true, 'button was disabled');

		$search.search('enable');

		equal($search.find('input').attr('disabled'), undefined, 'input was enabled');
		equal($search.find('button').hasClass('disabled'), false, 'button was enabled');
	});

});