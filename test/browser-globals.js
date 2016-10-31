/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

(function(QUnit) {

	$(function () {

		QUnit.module('FuelUX Component Initialization (via Browser Globals)', {
			beforeEach: function(assert) {
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

		QUnit.test('checkbox should be defined on jQuery object', function(assert) {
			assert.ok($().checkbox, 'checkbox method is defined');
		});

		QUnit.test('combobox should be defined on jQuery object', function(assert) {
			assert.ok($().combobox, 'combobox method is defined');
		});

		QUnit.test('datepicker should be defined on the jQuery object', function(assert) {
			assert.ok($().datepicker, 'datepicker method is defined');
		});

		QUnit.test('dropdownautoflip should be defined on the jQuery object', function(assert) {
			assert.ok($().dropdownautoflip, 'dropdownautoflip method is defined');
		});

		QUnit.test('infinitescroll should be defined on the jQuery object', function(assert) {
			assert.ok($().infinitescroll, 'infinitescroll method is defined');
		});

		QUnit.test('loader should be defined on the jQuery object', function(assert) {
			assert.ok($().loader, 'loader method is defined');
		});

		QUnit.test('pillbox should be defined on jQuery object', function(assert) {
			assert.ok($().pillbox, 'pillbox method is defined');
		});

		QUnit.test('radio should be defined on jQuery object', function(assert) {
			assert.ok($().radio, 'radio method is defined');
		});

		QUnit.test('repeater should be defined on jQuery object', function(assert) {
			assert.ok($().repeater, 'repeater method is defined');
		});

		QUnit.test('repeater list should be defined on jQuery object', function(assert) {
			assert.ok($.fn.repeater.viewTypes.list, 'repeater list view is defined');
		});

		QUnit.test('repeater thumbnail should be defined on jQuery object', function(assert) {
			assert.ok($.fn.repeater.viewTypes.thumbnail, 'repeater thumbnail view is defined');
		});

		QUnit.test('scheduler should be defined on the jQuery object', function(assert) {
			assert.ok($().scheduler, 'scheduler method is defined');
		});

		QUnit.test('search should be defined on jQuery object', function(assert) {
			assert.ok($().search, 'search method is defined');
		});

		QUnit.test('selectlist should be defined on jQuery object', function(assert) {
			assert.ok($().selectlist, 'selectlist method is defined');
		});

		QUnit.test('spinbox should be defined on jQuery object', function(assert) {
			assert.ok($().spinbox, 'spinbox method is defined');
		});

		QUnit.test('tree should be defined on jQuery object', function(assert) {
			assert.ok($().tree, 'tree method is defined');
		});

		QUnit.test('wizard should be defined on jQuery object', function(assert) {
			assert.ok($().wizard, 'wizard method is defined');
		});

	});

})(QUnit);