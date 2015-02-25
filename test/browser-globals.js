/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

( function() {

	$(function () {

		module('FuelUX Component Initialization (via Browser Globals)', {
			setup: function () {
				this.elems = $('#qunit-fixture').children();
			}
		});

		// Needed for saucelab testing
		var log = [];
		var testName;

		QUnit.done(function (test_results) {
			var tests = [];
			for (var i = 0, len = log.length; i < len; i++) {
				var details = log[i];
				tests.push({
					name: details.name,
					result: details.result,
					expected: details.expected,
					actual: details.actual,
					source: details.source
				});
			}
			test_results.tests = tests;

			window.global_test_results = test_results;
		});
		QUnit.testStart(function (testDetails) {
			QUnit.log = function (details) {
				if (!details.result) {
					details.name = testDetails.name;
					log.push(details);
				}
			};
		});

		// In order to be be UMD compliant, modules must work with
		// AMD (require.js) and as browser globals. The following tests
		// check to see if the only the browser global is present
		// and nothing else.

		test('checkbox should be defined on jQuery object', function () {
			ok($().checkbox, 'checkbox method is defined');
		});

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

	});

})();