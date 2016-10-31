/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require) {
	var $ = require('jquery');
	var QUnit = require('qunit');

	QUnit.start(); // starting qunit, or phantom js will have a problem

	// Needed for saucelab testing
	var log = [];
	var testName;

	QUnit.done(function (test_results) {
		var tests = [];
		for(var i = 0, len = log.length; i < len; i++) {
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

	// hide passed tests, helps with VM testing screencasts
	if (!$('#qunit-filter-pass').is(':checked')) {
		$('#qunit-filter-pass').click();
	}

	});
	QUnit.testStart(function(testDetails){
		QUnit.log = function(details){
			if (!details.result) {
				details.name = testDetails.name;
				log.push(details);
			}
		};
	});

	require('test/datepicker-test');

});
