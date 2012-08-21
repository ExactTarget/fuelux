/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/spinner'], function($) {

	module("FuelUX pillbox");

	test("should be defined on jquery object", function () {
		ok($(document.body).spinner, 'pillbox method is defined');
	});

	test("should return element", function () {
		ok($(document.body).spinner()[0] === document.body, 'document.body returned');
	});

	test("should behave as designed", function () {
		var spinnerHTML = ' <div id="ex-spinner" class="spinner">' +
			'<input type="text" class="input-mini spinner-input">' +
			'<button class="btn  spinner-up">' +
			'<i class="icon-chevron-up"></i>' +
			'</button>' +
			'<button class="btn spinner-down">' +
			'<i class="icon-chevron-down"></i>' +
			'</button>' +
			'</div>';

		var $spinner = $( spinnerHTML).spinner();

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

		//increment positive
		$spinner.spinner('increment',true);
		equal($spinner.spinner('value'), 3, 'spinner increments positive');

		//increment nagative
		$spinner.spinner('increment',false);
		equal($spinner.spinner('value'), 2, 'spinner increments negative');

	});

});