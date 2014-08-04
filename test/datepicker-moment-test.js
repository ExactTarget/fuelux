/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/datepicker-markup.html');

	require('bootstrap');
	require('fuelux/datepicker');

	function uaMatch(ua){
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	}

	var UA = uaMatch(navigator.userAgent);
	var runTestsBoolean = true;

	if(UA.browser === 'msie'){
		if(parseInt(UA.version, 10)<=9){
			runTestsBoolean = false;
		}
	}

	if(runTestsBoolean){
		module('Fuel UX Datepicker with moment.js', {
			setup: function(){
				window.moment = window.tmpMoment;
			},
			teardown: function(){
				window.moment = undefined;
			}
		});

		test("should be defined on jquery object", function () {
			ok($().datepicker, 'datepicker method is defined');
		});

		test("should return element", function () {
			var $datepicker = $(html);
			ok($datepicker.datepicker()===$datepicker, 'datepicker should be initialized');
		});

		test('should initialize with current date and restrict past dates by default', function(){
			var today = new Date();
			var todaysDate = (today.getDate()<10) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ((today.getMonth()+1)<10) ? '0' + (today.getMonth()+1) : (today.getMonth()+1);
			today = todaysMonth + '/' + todaysDate + '/' + today.getFullYear();

			var $datepicker = $(html).datepicker();
			var pickerDate = $datepicker.datepicker('getFormattedDate');
			equal(pickerDate, today, 'w/ markup - initialized with todays date');

			var pastRestrictionCheck = $datepicker.find('.restricted').length > 0;
			equal(pastRestrictionCheck, true, 'restricted past dates are default');
		});

		test('should initialize with date other than now', function(){
			var $datepicker = $(html);
			var futureDate = new Date(new Date().getTime() + 604800000).getTime();	// 7 days in the future
			var pickerDate;

			$datepicker.datepicker({ date: futureDate });
			pickerDate = $datepicker.datepicker('getDate');

			equal(pickerDate.getTime(), futureDate, 'markup datepicker initialized with different date than now');
		});

		test('should initialize with null date', function(){
			var $datepicker = $(html).datepicker({ date: null });
			var initializedDate = $datepicker.datepicker('getDate');
			var inputValue = $datepicker.find('input[type="text"]').val();

			equal(initializedDate.toString(), 'Invalid Date', 'datepicker was initialized with null value');
			equal(inputValue, '', 'datepicker does not have value in input field');
		});

		test('should return date using getDate method', function(){
			var $datepicker = $(html).datepicker({ date: '03/31/1987' });
			var date = $datepicker.datepicker('getDate');
			var dateFormatted = $datepicker.datepicker('getFormattedDate');

			equal(date instanceof Date, true, 'returned a valid date object');
			equal(date.getTime(), 544165200000, 'returned correct date');
			equal(dateFormatted, '03/31/1987', 'returned correct formatted date');
		});

		test('should set new date using setDate method', function(){
			var $datepicker = $(html).datepicker();
			var newDate = new Date('03/31/1987');
			var datepickerDate;

			$datepicker.datepicker('setDate', newDate);
			datepickerDate = $datepicker.datepicker('getDate');

			equal(datepickerDate.getTime(), newDate.getTime(), 'setDate method works');
		});

		test('should enable/disable datepicker', function(){
			var $datepicker = $(html).datepicker();
			var $datepickerInput = $datepicker.find('input');

			var defaultState = !!$datepicker.find('button').prop('disabled') && !!$datepickerInput.prop('disabled');
			equal(defaultState, false, 'datepicker is enabled');

			$datepicker.datepicker('disable');
			var disabledState = !!$datepicker.find('button').prop('disabled') && !!$datepickerInput.prop('disabled');
			equal(disabledState, true, 'datepicker is disabled');

			$datepicker.datepicker('enable');
			var enabledState = !!$datepicker.find('button').prop('disabled') && !!$datepickerInput.prop('disabled');
			equal(enabledState, false, 'datepicker is enabled again');
		});

		test('should not restrict past dates when allowPastDates option set to true', function(){
			var $datepicker = $(html);
			var $pastDate;

			$datepicker.datepicker({ allowPastDates: true });
			$pastDate = $datepicker.find('.past:first');

			equal($pastDate.hasClass('restricted'), false, 'past dates are not restricted as expected');
		});

		test('should fire changed event when new date is input', function(){
			var called = 0;
			var $datepicker = $(html).datepicker();
			var $datepickerInput = $datepicker.find('input');
			var date = new Date(NaN);
			var event = false;

			$datepicker.on('changed.fu.datepicker', function(e, dt){
				called++;
				date = dt;
				event = e;
			});

			$datepickerInput.val('03/31/1987');
			$datepickerInput.trigger('blur');

			equal(called, 1, 'Event was triggered as expected');
			equal(typeof event, 'object', 'Appropriate event object passed back as argument');
			equal(date.getTime(), 544165200000, 'Appropriate date object passed back as argument');
		});

		test('should restrict navigation and selection of dates within other years if option sameYearOnly is set to true', function() {
			var $datepicker = $(html).datepicker({
				date: new Date('03/31/1987'),
				sameYearOnly: true
			});
			var $datepickerInput = $datepicker.find('input');
			var $header = $datepicker.find('.datepicker-calendar-header');
			var $titleLink = $header.find('.title a');
			var $titleYear = $titleLink.find('span.year');

			$datepicker.datepicker('setDate', '12/01/1987');
			$header.find('.next').trigger('click');
			equal($titleYear.text(), '1987', 'user can\'t next click outside current year');

			$datepicker.datepicker('setDate', '01/01/1987');
			$header.find('.prev').trigger('click');
			equal($titleYear.text(), '1987', 'user can\'t prev click outside current year');

			$titleLink.trigger('click');
			equal($datepicker.find('.datepicker-wheels-year').hasClass('hide'), true, 'years wheel hidden');

			$datepickerInput.val('03/31/1988');
			$datepickerInput.trigger('blur');
			equal($datepicker.datepicker('getDate').toString(), 'Invalid Date', 'user can\t input date outside current year');
		});

		test('should destroy control', function (){
			var $datepicker = $(html).datepicker();

			equal(typeof($datepicker.datepicker('destroy')), 'string', 'returns string (markup)');
			equal($datepicker.parent().length, false, 'control has been removed from DOM');
		});

		//MOMENT TESTS


	}
});
