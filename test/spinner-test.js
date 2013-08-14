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

	var spinnerHTML = '<div id="ex-spinner" class="spinner">' +
		'<input type="text" class="input-mini spinner-input">' +
		'<button class="btn  spinner-up">' +
		'<i class="icon-chevron-up"></i>' +
		'</button>' +
		'<button class="btn spinner-down">' +
		'<i class="icon-chevron-down"></i>' +
		'</button>' +
		'</div>';

	var spinnerHTMLWithDefault = '<div id="ex-spinner" class="spinner">' +
		'<input type="text" value="3" class="input-mini spinner-input">' +
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

		//set number value
		$spinner.spinner('value',2);
		equal($spinner.spinner('value'), 2, 'spinner sets number value');

		//set numeric string value
		$spinner.spinner('value','2.1');
		equal($spinner.spinner('value'), 2.1, 'spinner sets floating point numeric string value');

		$spinner.spinner('value','2');
		equal($spinner.spinner('value'), 2, 'spinner sets integer numeric string value');

		//disable
		$spinner.spinner('disable');
		equal($spinner.find('.spinner-input').attr('disabled'), "disabled", 'spinner sets disabled');

		//enable
		$spinner.spinner('enable');
		equal($spinner.find('.spinner-input').attr('disabled') ? false : true, true, 'spinner sets enabled');

		//change
		$spinner.spinner('value','b2');
		$spinner.spinner('change');
		equal($spinner.spinner('value'), 2, 'spinner change not working for alpha strings');

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

	test("should keep existing value", function () {
		var $spinner = $(spinnerHTMLWithDefault).spinner();
		equal($spinner.spinner('value'), 3, 'spinner kept existing value');
	});

	test("should cycle when min or max values are reached", function () {
		var $spinner = $(spinnerHTML).spinner({
			min: 1,
			max: 3,
			cycle: true
			});
		$spinner.spinner('step',true); // 2
		$spinner.spinner('step',true); // 3
		$spinner.spinner('step',true); // 1
		$spinner.spinner('step',true); // 2
		equal($spinner.spinner('value'), 2, 'spinner value cycled at max');
		$spinner.spinner('step',false); // 1
		$spinner.spinner('step',false); // 3
		$spinner.spinner('step',false); // 2
		equal($spinner.spinner('value'), 2, 'spinner value cycled at min');
	});

});
