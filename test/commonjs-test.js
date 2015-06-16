window.$ = window.jQuery = require('jquery');
var bootstrap = require('bootstrap');
var moment = require('moment');
var fuelux = require('../dist/js/npm');
var QUnit = require('qunitjs');

// In order to be be UMD compliant, modules must work with
// CommonJS. The following tests check to see if the plugin
// is on the jQuery namespace and nothing else.

test('combobox should be defined on jQuery object', function () {
	ok($().combobox, 'combobox method is defined');
});

test('datepicker should be defined on the jQuery object', function () {
	ok($().datepicker, 'datepicker method is defined');
});

test('dropdownautoflip should be defined on the jQuery object', function () {
	ok($().dropdownautoflip, 'dropdownautoflip method is defined');
});

test('infinitescroll should be defined on the jQuery object', function () {
	ok($().infinitescroll, 'infinitescroll method is defined');
});

test('loader should be defined on the jQuery object', function () {
	ok($().loader, 'loader method is defined');
});

test('pillbox should be defined on jQuery object', function () {
	ok($().pillbox, 'pillbox method is defined');
});

test('radio should be defined on jQuery object', function () {
	ok($().radio, 'radio method is defined');
});

test('repeater should be defined on jQuery object', function () {
	ok($().repeater, 'repeater method is defined');
});

test('repeater list should be defined on jQuery object', function () {
	ok($.fn.repeater.viewTypes.list, 'repeater list view is defined');
});

test('repeater thumbnail should be defined on jQuery object', function () {
	ok($.fn.repeater.viewTypes.thumbnail, 'repeater thumbnail view is defined');
});

test('scheduler should be defined on the jQuery object', function () {
	ok($().scheduler, 'scheduler method is defined');
});

test('search should be defined on jQuery object', function () {
	ok($().search, 'search method is defined');
});

test('selectlist should be defined on jQuery object', function () {
	ok($().selectlist, 'selectlist method is defined');
});

test('spinbox should be defined on jQuery object', function () {
	ok($().spinbox, 'spinbox method is defined');
});

test('tree should be defined on jQuery object', function () {
	ok($().tree, 'tree method is defined');
});

test('wizard should be defined on jQuery object', function () {
	ok($().wizard, 'wizard method is defined');
});
