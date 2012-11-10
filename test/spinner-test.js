/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/spinner'], function($) {

	module("Fuel UX spinner");

	test("should be defined on jquery object", function () {
		ok($(document.body).spinner, 'spinner method is defined');
	});

	test("should return element", function () {
		ok($(document.body).spinner()[0] === document.body, 'document.body returned');
	});

	var spinnerHTML = ' <div id="ex-spinner" class="spinner">' +
		'<input type="text" class="input-mini spinner-input">' +
		'<button class="btn  spinner-up">' +
		'<i class="icon-chevron-up"></i>' +
		'</button>' +
		'<button class="btn spinner-down">' +
		'<i class="icon-chevron-down"></i>' +
		'</button>' +
		'</div>';

	test("should behave as designed", function () {
		var $spinner = $(spinnerHTML).spinner();

		//returning default value
		equal($spinner.spinner('value'), 1, 'spinner returns selected item');

		//set value
		$spinner.spinner('value',2);
		equal($spinner.spinner('value'), 2, 'spinner sets value');

		//disable
		$spinner.spinner('disable');
		equal($spinner.find('.spinner-input').attr('disabled'), "disabled", 'spinner sets disabled');

		//enable
		$spinner.spinner('enable');
		equal($spinner.find('.spinner-input').attr('disabled') ? false : true, true, 'spinner sets enabled');

		//change
		$spinner.spinner('value','b2');
		$spinner.spinner('change');
		equal($spinner.spinner('value'), 2, 'spinner change working for numbers only');

		//increment positive
		$spinner.spinner('step',true);
		equal($spinner.spinner('value'), 3, 'spinner increments positive');

		//increment nagative
		$spinner.spinner('step',false);
		equal($spinner.spinner('value'), 2, 'spinner increments negative');

	});

	test("should allow setting value to zero", function () {
		var $spinner = $(spinnerHTML).spinner();
		$spinner.spinner('value', 0);
		equal($spinner.spinner('value'), 0, 'spinner value was set to zero');
	});

});