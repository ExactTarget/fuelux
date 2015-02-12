/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/scheduler-markup.html');
	var templateHtml = html;

	/* FOR DEV TESTING */
	// html = require('text!index.html!strip');
	html = $('<div>'+html+'</div>').find('#MyScheduler');

	var uninitializedHtmlStartDate = html.clone();
	uninitializedHtmlStartDate.removeAttr('data-initialize');

	var uninitializedHtmlEndDate = html.clone();
	uninitializedHtmlEndDate.removeAttr('data-initialize');

	require('bootstrap');
	require('fuelux/scheduler');

	// TODO: Test 'changed.fu.scheduler' event

	module('Fuel UX Scheduler');

	test('should be defined on the jQuery object', function(){
		ok( $().scheduler, 'scheduler method is defined' );
	});

	test('should return element', function (){
		var $scheduler = $(html);
		ok($scheduler.scheduler() === $scheduler, 'scheduler has been initialized');
	});

	test('should disable control (all inputs)', function (){
		var disabled = true;
		var $scheduler = $(html).scheduler();

		$scheduler.scheduler('disable');

		$scheduler.find('.combobox .btn').each(function(){
			if(!$(this).hasClass('disabled')){
				disabled = false;
			}
		});
		equal(disabled, true, 'all combobox controls disabled');

		$scheduler.find('.datepicker input').each(function(){
			if(!$(this).prop('disabled')){
				disabled = false;
			}
		});
		equal(disabled, true, 'all datepicker controls disabled');

		$scheduler.find('.radio input').each(function(){
			if(!$(this).is(':disabled')){
				disabled = false;
			}
		});
		equal(disabled, true, 'all radio button controls disabled');

		$scheduler.find('.selectlist .btn').each(function(){
			if(!$(this).hasClass('disabled')){
				disabled = false;
			}
		});
		equal(disabled, true, 'all select controls disabled');

		$scheduler.find('.spinbox .spinbox-input').each(function(){
			if(!$(this).prop('disabled')){
				disabled = false;
			}
		});
		equal(disabled, true, 'all spinbox controls disabled');

		disabled = $scheduler.find('.repeat-days-of-the-week .btn-group').hasClass('disabled');
		equal(disabled, true, 'scheduler weekly btn-group disabled');
	});

	test('should enable control (all inputs)', function () {
		var enabled = true;
		var $scheduler = $(html).scheduler();

		$scheduler.scheduler('disable');
		$scheduler.scheduler('enable');

		$scheduler.find('.combobox .btn').each(function(){
			if($(this).hasClass('disabled')){
				enabled = false;
			}
		});
		equal(enabled, true, 'all combobox controls enabled');

		$scheduler.find('.datepicker input').each(function(){
			if($(this).prop('disabled')){
				enabled = false;
			}
		});
		equal(enabled, true, 'all datepicker controls enabled');

		$scheduler.find('.radio input').each(function(){
			if($(this).is(':disabled')){
				enabled = false;
			}
		});
		equal(enabled, true, 'all radio button controls enabled');

		$scheduler.find('.selectlist .btn').each(function(){
			if($(this).hasClass('disabled')){
				enabled = false;
			}
		});
		equal(enabled, true, 'all select controls enabled');

		$scheduler.find('.spinbox .spinbox-input').each(function(){
			if($(this).prop('disabled')){
				enabled = false;
			}
		});
		equal(enabled, true, 'all spinbox controls enabled');

		enabled = ($scheduler.find('.repeat-days-of-the-week .btn-group').hasClass('disabled')) ? false : true;
		equal(enabled, true, 'scheduler weekly btn-group enabled');
	});

	test('should return proper value object', function (){
		var $scheduler = $(html).scheduler();
		var obj = 'object';
		var str = 'string';
		var val = $scheduler.scheduler('value');

		ok(typeof(val)===obj, 'return value is object');
		ok(typeof(val.recurrencePattern)===str, 'return value contains recurrencePattern string');
		ok(typeof(val.startDateTime)===str, 'return value contains startDateTime string');
		ok(typeof(val.timeZone)===obj, 'return value contains timeZone object');
		ok(typeof(val.timeZone.name)===str, 'timeZone contains name string');
		ok(typeof(val.timeZone.offset)===str, 'timeZone contains offset string');
	});

	test('should set value properly', function (){
		//needed due to PhantomJS bug: https://github.com/ariya/phantomjs/issues/11151
		var isPhantomJS = (window.navigator.userAgent.search('PhantomJS')>=0);
		var $scheduler = $(html).scheduler();
		var $repIntSelDrop = $scheduler.find('.repeat-options .selected-label');
		var $repPanSpinbox = $scheduler.find('.repeat-every');
		var test;
		var tmpDatepickerVal;
		var tmpValBool = false;

		$scheduler.scheduler('value', { startDateTime: '2050-03-31T05:00' });
		//make this test always present once PhantomJS fixes their bug
		if(!isPhantomJS){
			tmpDatepickerVal = $scheduler.find('.start-datetime .datepicker input').val();
			if( tmpDatepickerVal === '03-31-2050' || tmpDatepickerVal === '03/31/2050' ) {
				tmpValBool = true;
			}
			equal( tmpValBool, true, 'startDate set correctly');
		}
		equal($scheduler.find('.start-datetime .combobox input').val(), '5:00 AM', 'startTime set correctly');

		$scheduler.scheduler('value', { timeZone: { name: 'Namibia Standard Time', offset: '+02:00' }});
		equal($scheduler.find('.timezone-container .selected-label').html(), '(GMT+02:00) Windhoek *', 'timeZone set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=DAILY;INTERVAL=1;COUNT=1;' });
		equal($repIntSelDrop.html(), 'None (run once)', 'no recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=HOURLY;INTERVAL=3;' });
		ok(($repIntSelDrop.html()==='Hourly' && $repPanSpinbox.spinbox('value')==='3'), 'hourly recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=DAILY;INTERVAL=4;' });
		ok(($repIntSelDrop.html()==='Daily' && $repPanSpinbox.spinbox('value')==='4'), 'daily recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;' });
		equal($repIntSelDrop.html(), 'Weekdays', 'weekday recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=WEEKLY;BYDAY=MO,TH;INTERVAL=7;' });
		test = $scheduler.find('.repeat-days-of-the-week .btn-group');
		test = (test.find('[data-value="MO"]').parent().hasClass('active') && test.find('[data-value="TH"]').parent().hasClass('active')) ? true : false;
		ok(($repIntSelDrop.html()==='Weekly' && $repPanSpinbox.spinbox('value')==='7' && test), 'weekly recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=WEEKLY;BYDAY=MO,TH;' });
		test = $scheduler.find('.repeat-days-of-the-week .btn-group');
		ok(test.find('[data-value="MO"]').is(':checked'), 'weekly recurrence option set correctly with "checked" attribute');
		ok(test.find('[data-value="TH"]').is(':checked'), 'weekly recurrence option set correctly with "checked" attribute');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=MONTHLY;INTERVAL=9;BYDAY=SA;BYSETPOS=4;' });
		test = $scheduler.find('.repeat-monthly-day');
		ok(($repIntSelDrop.html()==='Monthly' && $repPanSpinbox.spinbox('value')==='9' && test.find('div.radio input').hasClass('checked') &&
			test.find('.month-day-pos .selected-label').html()==='Fourth' && test.find('.month-days .selected-label').html()==='Saturday'),
			'monthly recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=YEARLY;BYDAY=WE;BYSETPOS=3;BYMONTH=10;' });
		test = $scheduler.find('.repeat-yearly-day');
		ok(($repIntSelDrop.html()==='Yearly' && test.find('div.radio input').hasClass('checked') &&
			test.find('.year-month-day-pos .selected-label').html()==='Third' && test.find('.year-month-days .selected-label').html()==='Wednesday' &&
			test.find('.year-month .selected-label').html()==='October'), 'yearly recurrence set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=DAILY;INTERVAL=9;COUNT=4;' });
		ok(($scheduler.find('.repeat-end .selectlist .selected-label').html()==='After' && $scheduler.find('.repeat-end .spinbox').spinbox('value')==='4'),
			'end after occurence(s) set correctly');

		$scheduler.scheduler('value', { recurrencePattern: 'FREQ=DAILY;INTERVAL=9;UNTIL=20510331;' });
		//make this test always present once PhantomJS fixes their bug
		test = (!isPhantomJS) ? ($scheduler.find('.repeat-end .datepicker input').val() ==='03-31-2051' || $scheduler.find('.repeat-end .datepicker input').val() ==='03/31/2051' ) : true;
		ok(($scheduler.find('.repeat-end .selectlist .selected-label').html()==='On date' && test), 'end on date set correctly');
	});

	test('should initialize with start date provided', function() {
		//needed due to PhantomJS bug: https://github.com/ariya/phantomjs/issues/11151
		// var isPhantomJS = (window.navigator.userAgent.search('PhantomJS')>=0);
		var $scheduler = $(uninitializedHtmlStartDate).scheduler({
			startDateOptions: { date: '03/31/2050' }
		});
		//make this test always present once PhantomJS fixes their bug
		// if(!isPhantomJS){
			var tmpDatepickerVal = $scheduler.find('.start-date input').val();
			equal( tmpDatepickerVal, '03/31/2050', 'startDate set correctly');
		// }
	});

	test('should set/get recurrence pattern properly', function() {
		var schedule = {
			startDateTime: '2014-03-31T03:23+02:00',
			timeZone: {
				offset: '+02:00'
			},
			recurrencePattern: 'FREQ=WEEKLY;BYDAY=WE;INTERVAL=1;'
		};

		// note: currently, the scheduler doesn't reset it's markup/state
		// when setValue is called.  so ensure we're starting with initial template markup
		// that hasn't been altered by another unit test
		var $scheduler = $('<div>'+templateHtml+'</div>').find('#MyScheduler').scheduler();
		$scheduler.scheduler('value', schedule);

		equal($scheduler.scheduler('value').recurrencePattern, schedule.recurrencePattern, 'schedule set correctly');
	});

	// TODO: need more end date test or dry out code where start and end use same methods
	
	test('should initialize with end date provided', function() {
		//needed due to PhantomJS bug: https://github.com/ariya/phantomjs/issues/11151
		// var isPhantomJS = (window.navigator.userAgent.search('PhantomJS')>=0);
		var $scheduler = $(uninitializedHtmlEndDate).scheduler({
			endDateOptions: { date: '04/01/2050' }
		});
		//make this test always present once PhantomJS fixes their bug
		// if(!isPhantomJS){
			var tmpDatepickerVal = $scheduler.find('.end-on-date input').val();
			equal( tmpDatepickerVal, '04/01/2050', 'endDate set correctly');
		// }
	});
	

	test("should destroy control", function () {
		var $el = $(html).scheduler();

		equal(typeof( $el.scheduler('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});
