/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/datepicker-markup.html');

	require('bootstrap');
	require('fuelux/datepicker');

	require('test/datepicker-test');	//this ensures the non-moment tests run before the moment tests

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

	//IE 8 & 9 have problems with the moment switching. Figure a way around this later, if possible. Otherwise, just
	//test manually by commenting this if statement out and refreshing over and over again.
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
			var initializedDate = $datepicker.datepicker('getDate').toString();
			var inputValue = $datepicker.find('input[type="text"]').val();

			equal((initializedDate==='Invalid Date' || initializedDate==='NaN'), true, 'datepicker was initialized with null value');
			equal(inputValue, '', 'datepicker does not have value in input field');
		});

		test('should return date using getDate method', function(){
			var $datepicker = $(html).datepicker({ date: new Date(1987, 2, 31) });
			var date = $datepicker.datepicker('getDate');
			var dateFormatted = $datepicker.datepicker('getFormattedDate');

			equal(date instanceof Date, true, 'returned a valid date object');
			equal((date.getDate()===31 && date.getMonth()===2 && date.getFullYear()===1987), true, 'returned correct date');
			equal(dateFormatted, '03/31/1987', 'returned correct formatted date');
		});

		test('should set new date using setDate method', function(){
			var $datepicker = $(html).datepicker();
			var newDate = new Date(1987, 2, 31);
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
			equal((date.getDate()===31 && date.getMonth()===2 && date.getFullYear()===1987), true, 'Appropriate date object passed back as argument');
		});

		test('should restrict navigation and selection of dates within other years if option sameYearOnly is set to true', function() {
			var $datepicker = $(html).datepicker({
				date: new Date(1987, 2, 31),
				sameYearOnly: true
			});
			var $datepickerInput = $datepicker.find('input');
			var $header = $datepicker.find('.datepicker-calendar-header');
			var $titleLink = $header.find('.title a');
			var $titleYear = $titleLink.find('span.year');
			var dateString;

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
			dateString = $datepicker.datepicker('getDate').toString();
			equal((dateString==='Invalid Date' || dateString==='NaN'), true, 'user can\t input date outside current year');
		});

		test('should restrict days if restricted option is set', function(){
			var $datepicker = $(html).datepicker({
				allowPastDates: true,
				date: new Date(1987, 3, 5),
				restricted: [{ from: new Date(1987, 3, 1), to: new Date(1987, 3, 4) }, { from: new Date(1987, 3, 13), to: new Date(1987, 3, 17) }]
			});
			var dates = ['1', '2', '3', '4', '13', '14', '15', '16', '17'];
			var i=0;
			var self = this;

			$datepicker.find('.restricted').each(function(){
				var $item = $(this);
				equal(($item.attr('data-date')===dates[i] && $item.attr('data-month')==='3' && $item.attr('data-year')==='1987'), true,
					'correct date restricted as expected');
				i++;
			});

			equal(dates.length===i, true, 'correct number of dates restricted');
		});

		test('should destroy control', function (){
			var $datepicker = $(html).datepicker();

			equal(typeof($datepicker.datepicker('destroy')), 'string', 'returns string (markup)');
			equal($datepicker.parent().length, false, 'control has been removed from DOM');
		});

		//MOMENT TESTS

		test('should have moment.js doing the date parsing', function(){
			var $datepicker = $(html).datepicker();
			var momentBoolean = $datepicker.datepicker('checkForMomentJS');
			var today = new Date();
			var todaysDate = (today.getDate()<10) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ((today.getMonth()+1)<10) ? '0' + (today.getMonth()+1) : (today.getMonth()+1);

			today = todaysMonth + '/' + todaysDate + '/' + today.getFullYear();

			equal(momentBoolean, true, 'moment.js is being used');
			equal($datepicker.datepicker('getFormattedDate'), today, 'moment.js parsed date correctly for default implementation (en culture)');
		});

		test('should not use moment if either formatCode or culture is missing', function(){
			var $datepicker1 = $(html).datepicker({
				momentConfig: {
					culture: null
				}
			});
			var result1 = $datepicker1.datepicker('checkForMomentJS');

			var $datepicker2 = $(html).datepicker({
				momentConfig: {
					format: null
				}
			});
			var result2 = $datepicker2.datepicker('checkForMomentJS');

			var $datepicker3 = $(html).datepicker({
				momentConfig: {
					culture: null,
					formatCode: null
				}
			});
			var result3 = $datepicker3.datepicker('checkForMomentJS');

			var $datepicker4 = $(html).datepicker({
				momentConfig: {
					culture: 'en',
					formatCode: 'L'
				}
			});
			var result4 = $datepicker4.datepicker('checkForMomentJS');

			equal(result1, false, 'moment is not used because the option momentConfig.culture is null');
			equal(result2, false, 'moment is not used because the option momentConfig.format is null');
			equal(result3, false, 'moment is not used because the options momentConfig.culture and momentConfig.format are null');
			equal(result4, true, 'moment is used because both momentConfig options are set');
		});

		test('should be initialized with different culture', function(){
			var culture = "de";
			var $datepicker = $(html).datepicker({
				momentConfig: {
					culture: culture
				}
			});
			var today = new Date();
			var todaysDate = (today.getDate()<10) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ((today.getMonth()+1)<10) ? '0' + (today.getMonth()+1) : (today.getMonth()+1);

			today = todaysDate + '.' + todaysMonth + '.' + today.getFullYear();

			equal($datepicker.datepicker('getFormattedDate'), today, 'moment js parsed date correctly using different culture (de)');
		});

		test('should be initialized with different culture and different format', function(){
			var $datepicker = $(html).datepicker({
				momentConfig: {
					culture: 'de',
					format: 'l'
				}
			});
			var today = new Date();
			today = today.getDate() + '.' + (today.getMonth()+1) + '.' + today.getFullYear();

			equal($datepicker.datepicker('getFormattedDate'), today, 'moment.js parsed date correctly for different culture and format (de, l)');
		});

		test('should get current culture', function(){
			var $datepicker = $(html).datepicker();
			equal($datepicker.datepicker('getCulture'), 'en', 'returned correct culture from initialization');

			$datepicker.datepicker('setCulture', 'de');
			equal($datepicker.datepicker('getCulture'), 'de', 'returned correct culture after being changed');
		});

		test('should set new culture', function(){
			var $datepicker = $(html).datepicker();
			var today = new Date();
			var todaysDate = (today.getDate()<10) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ((today.getMonth()+1)<10) ?  '0' + (today.getMonth()+1) : (today.getMonth()+1);
			today = todaysDate + '.' + todaysMonth + '.' + today.getFullYear();
			$datepicker.datepicker('setCulture', 'de');

			equal($datepicker.datepicker('getCulture'), 'de', 'returned correct culture after being changed');
			equal($datepicker.datepicker('getFormattedDate'), today, 'did correct formatting after dynamic update');
		});

		test('should get format', function(){
			var $datepicker = $(html).datepicker();
			equal($datepicker.datepicker('getFormat'), 'L', 'returned correct format from initialization');

			$datepicker.datepicker('setFormat', 'l');
			equal($datepicker.datepicker('getFormat'), 'l', 'returned correct format after being changed');
		});

		test('should set new format', function(){
			var $datepicker = $(html).datepicker();
			var today = new Date();
			today = (today.getMonth()+1) + '/' +  today.getDate() + '/' + today.getFullYear();

			$datepicker.datepicker('setFormat', 'l');
			equal($datepicker.datepicker('getFormattedDate'), today, 'returned correct culture after being changed');
		});

		test('input parsing should take culture into account', function(){
			var $datepicker = $(html).datepicker({
				momentConfig: {
					culture: 'fr',
					format: 'L'
				}
			});
			var $datepickerInput = $datepicker.find('input');
			var dateString = '30/10/2014';
			var formatted;

			$datepickerInput.val(dateString);
			$datepickerInput.trigger('blur');
			formatted = $datepicker.datepicker('getFormattedDate');

			equal( formatted, dateString, 'moment.js formatted date should be equal to input');
		});

		test('when input is blurred, culture is german, and no date changes, input value should not change', function() {
			var date = '03.07.2014'; // July 3rd, 2014
			var $datepicker = $( html ).datepicker({
				allowPastDates: true,
				date: new Date(2014, 6, 3),
				momentConfig: {
					culture: 'de'
				}
			});
			var $input = $datepicker.find('input');

			equal($datepicker.datepicker('getFormattedDate'), date, 'moment.js parsed date correctly after initialization with de culture');

			$input.trigger('blur');
			equal($datepicker.datepicker('getFormattedDate'), date, 'moment.js parsed date correctly after input blurred');
		});

		test('when bad data is input, don\'t fail with bad date', function(){
			var date = '07/03/2014'; // July 3rd, 2014
			var $datepicker = $(html).datepicker({
				allowPastDates: true,
				date: new Date( 2014, 6, 3 )
			});
			var $input = $datepicker.find('input');
			var dateString;

			equal($datepicker.datepicker('getFormattedDate'), date, 'moment.js parsed date correctly after initialization with de culture');

			$input.val('aa.bb.cccc');
			$input.trigger('blur');
			dateString = $datepicker.datepicker('getDate').toString();
			equal((dateString==='Invalid Date' || dateString==='NaN'), true, 'datepicker should return \'Invalid Date\' or \'NaN\' when bad data is entered');
		});
	}
});
