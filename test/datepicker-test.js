/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/datepicker-markup.html');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');

	require('bootstrap');
	require('fuelux/datepicker');


	module('Fuel UX Datepicker', {
		setup: function() {
			// need to do this because window.moment is inconsistent when it's loaded in IE9 or less. stupid IE
			$.fn.extend($.fn.datepicker.Constructor.prototype, {
				_checkForMomentJS: function () {
					return false;
				}
			});
		},
		teardown: function() {
			// need to do this because window.moment is inconsistent when it's loaded in IE9 or less. stupid IE
			$.fn.extend($.fn.datepicker.Constructor.prototype, {
				_checkForMomentJS: function () {
					if( $.isFunction( window.moment ) || ( typeof moment !== "undefined" && $.isFunction( moment ) ) ) {
						if( $.isPlainObject( this.options.momentConfig ) ) {
							if( Boolean( this.options.momentConfig.culture ) && Boolean( this.options.momentConfig.formatCode ) ) {
								return true;
							} else {
								return false;
							}
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			});
		}
	});

	test( 'should be defined on the jQuery object', function() {
		ok( $().datepicker, 'datepicker method is defined' );
	});

	test( 'should return element', function() {
		var $sample = $(html).find('#datepicker1');
		ok( $sample.datepicker() === $sample, 'datepicker should be initialized' );
	});

	test( 'should initialize with current date and restrict past dates by default', function() {
		// using default formatDate function
		var today       = new Date();
		var todaysDate  = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
		var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
		today           =  todaysMonth + '-' + todaysDate + '-' + today.getFullYear();

		// markup already there
		var $sample    = $(html).find('#datepicker1').datepicker();
		var pickerDate = $sample.datepicker( 'getFormattedDate' );
		equal( pickerDate, today, 'w/ markup - initialized with todays date' );

		// restricted past dates
		var pastRestrictionCheck = $sample.find( '.restrict' ).length > 0;
		equal( pastRestrictionCheck, true, 'restricted past dates are default' );
	});

	test( 'should initialize with date other than now', function() {
		var $sample = $(html).find('#datepicker1');
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) ).getTime(); // 7 days in the future

		$sample.datepicker({
			date: futureDate
		});

		var pickerDate = $sample.datepicker( 'getDate', { unix: true } );
		equal( pickerDate, futureDate, 'markup datepicker initialized with different date than now' );
	});

	test( 'should initialize with null date', function() {
		var $sample         = $(html).find('#datepicker1').datepicker({ date: null });
		var initializedDate = $sample.datepicker( 'getDate' );
		var inputValue      = $sample.find( 'input[type="text"]' ).val();

		equal( initializedDate, null, 'datepicker was initialized with null value' );
		equal( inputValue, '', 'datepicker does not have value in input field' );
	});

	test( 'should return date using getDate method', function() {
		var $sample       = $(html).find('#datepicker1').datepicker();
		var dateFormatted = new Date( $sample.datepicker( 'getFormattedDate' ) );
		var dateObject    = new Date( $sample.datepicker( 'getDate' ) );
		var dateUnix      = $sample.datepicker( 'getDate', { unix: true } );

		if( dateFormatted !== 'Invalid Date' ) {
			dateFormatted = true;
		}
		if( dateObject !== 'Invalid Date' ) {
			dateObject = true;
		}
		if( !!parseInt( dateUnix, 10 ) && new Date( dateUnix !== 'Invalid Date' ) ) {
			dateUnix = true;
		}
		equal( dateFormatted, true, 'returned a valid formatted date' );
		equal( dateObject, true, 'returned a valid date object' );
		equal( dateUnix, true, 'returned a valid unix timestamp' );
	});

	test( 'should set new date using setDate method', function() {
		var $sample = $(html).find('#datepicker1').datepicker();
		var newDate = new Date().getTime();

		$sample.datepicker( 'setDate', newDate );

		var datepickerNewDate = $sample.datepicker( 'getDate', { unix: true });

		equal( datepickerNewDate, newDate, 'setDate method works' );
	});

	test( 'should enable/disable datepicker', function() {
		var $sample      = $(html).find('#datepicker1').datepicker();
		var $sampleInput = $sample.find( 'input' );

		// enabled
		var defaultState = !!$sampleInput.prop( 'disabled' ) && !!$sample.find( 'button' ).prop( 'disabled' );
		equal( defaultState, false, 'datepicker1 is enabled' );

		// disabled
		$sample.datepicker( 'disable' );
		var disabledState = !!$sampleInput.prop( 'disabled' ) && !!$sample.find( 'button' ).prop( 'disabled' );
		equal( disabledState, true, 'datepicker1 is disabled' );

		// enable again
		$sample.datepicker( 'enable' );
		var enabledState = !!$sampleInput.prop( 'disabled' ) && !!$sample.find( 'button' ).prop( 'disabled' );
		equal( enabledState, false, 'datepicker1 is enabled again' );
	});

	test( 'should restrict dates when using custom blackoutDates() default', function() {
		var $sample      = $(html).find('#datepicker1');
		var blackoutDate = new Date(+new Date() + ( 1 * 24 * 60 * 60 * 1000 ) ).getTime(); // 1 day in the future;

		$sample.datepicker({
			blackoutDates: function( date ) {
				var passedDate = this.parseDate( date ).getTime();

				// setting up two day interval
				var min = new Date( blackoutDate ).setHours( 0, 0, 0, 0 );
				var max = new Date( blackoutDate +  ( 1 * 24 * 60 * 60 * 1000 ) ).setHours( 23, 59, 59, 999 );

				if( passedDate <= max && passedDate >= min ) {
					return true;
				} else {
					return false;
				}
			}
		});

		// finding blackout dates. should be 2 based on interval set above
		var renderedBlackoutDates = $sample.find( '.restrict.blackout' ).length;
		equal( renderedBlackoutDates, 2, 'blackouts dates correctly' );
	});

	test( "should not restrict past dates when overriding restrictDateSelection to false", function() {
		var $sample = $(html).find('#datepicker1');
		$sample.datepicker({
			restrictDateSelection: false
		});

		// non-restricted past dates should have .past class on them
		var pastRestrictionCheck = $sample.find( '.past' ).length > 0;
		equal( pastRestrictionCheck, true, 'restricted past dates are default' );
	});

	test( "should fire change event when new date is set", function() {
		var eventsLogged            = 0;
		var validDateOnEventTrigger = false;

		var $sample = $(html).find('#datepicker1').datepicker().on( 'changed.fu.datepicker', function( event, date ) {
			eventsLogged++;
			if( new Date( date ) !== 'Invalid Date' ) {
				validDateOnEventTrigger = true;
			}
		});

		$sample.datepicker( 'setDate', new Date() );

		equal( eventsLogged, 1, "Event was triggered when date was set" );
		equal( validDateOnEventTrigger, true, "Event trigger returned a valid date object" );
	});

	test( 'should create dropdown with custom dropdown', function() {
		var $markup = $(html).find('#datepicker1');
		var customWidth2 = 240;

		$markup.datepicker({
			dropdownWidth: customWidth2
		});

		var $dropdown2       = $markup.find( '.dropdown-menu' );
		var headerWidth2     = $dropdown2.find( '.header' ).width();
		var daysViewWidth2   = $dropdown2.find( '.daysView' ).width();
		var monthsViewWidth2 = $dropdown2.find( '.monthsView' ).width();
		var yearsViewWidth2  = $dropdown2.find( '.yearsView' ).width();

		equal( headerWidth2, daysViewWidth2, 'header and days view are same width' );
		equal( headerWidth2, monthsViewWidth2, 'header and months view are same width' );
		equal( headerWidth2, yearsViewWidth2, 'header and years view are same width' );
		equal( daysViewWidth2, monthsViewWidth2, 'days view and months view are same width' );
		equal( daysViewWidth2, yearsViewWidth2, 'days view and years view are same width' );
		equal( monthsViewWidth2, yearsViewWidth2, 'months view and years view are same width' );

		var customWidthCheck2 = Boolean( headerWidth2 >= customWidth2 );

		equal( customWidthCheck2, true, 'with markup - dropdown has a custom width (only via pixels)' );
	});

	test( 'should not use momentjs if not available', function() {
		var $sample       = $(html).find('#datepicker1').datepicker();
		var momentBoolean = $sample.datepicker( '_checkForMomentJS' );

		equal( momentBoolean, false, "not using moment if it's not there" );
	});

	test( 'should not be able to use any extra features if momentjs is not loaded', function() {
		var $sample              = $(html).find('#datepicker1').datepicker();
		var momentBoolean        = $sample.datepicker( '_checkForMomentJS' );
		var defaultErrorReturned = "moment.js is not available so you cannot use this function";
		var getCultureError, setCultureError, getFormatCodeError, setFormatCodeError;

		// trying to get culture
		try {
			$sample.datepicker( 'getCulture' );
		} catch( e ) {
			getCultureError = e;
		}

		// trying to set culture
		try {
			$sample.datepicker( 'setCulture', 'de' );
		} catch( e ) {
			setCultureError = e;
		}

		// trying to get formatCode
		try {
			$sample.datepicker( 'getFormatCode' );
		} catch( e ) {
			getFormatCodeError = e;
		}

		// trying to set formatCode
		try {
			$sample.datepicker( 'setFormatCode', 'l' );
		} catch( e ) {
			setFormatCodeError = e;
		}

		equal( momentBoolean, false, "not using moment if it's not there" );
		equal( getCultureError, defaultErrorReturned, "getCulture is not available for use" );
		equal( setCultureError, defaultErrorReturned, "setCulture is not available for use" );
		equal( getFormatCodeError, defaultErrorReturned, "getFormatCode is not available for use" );
		equal( setFormatCodeError, defaultErrorReturned, "setFormatCode is not available for use" );
	});

	test( 'should restrict navigation to the previous year if option restrictToYear is set to the current year', function() {
		var currentYear = new Date().getFullYear();
		var options = {
			date: new Date( currentYear, 0, 10 ), // January 10th
			restrictToYear: currentYear
		};
		var $sample = $(html).find('#datepicker1').datepicker( options );
		var disabledLeftArrow = $sample.find('.left.disabled').length;
		var previousMonthDaysVisible = $sample.find('.lastmonth button').length;
		var disabledDaysVisible = $sample.find('.lastmonth .restrict').length;
		equal( disabledLeftArrow, 1, 'navigation left is disabled' );
		equal( disabledDaysVisible, previousMonthDaysVisible, 'visible previous month days are disabled' );
	});

	test( 'should restrict navigation to the next year if option restrictToYear is set to the current year', function() {
		var currentYear = new Date().getFullYear();
		var options = {
			date: new Date( currentYear, 11, 10 ), // December 10th
			restrictToYear: currentYear
		};
		var $sample = $(html).find('#datepicker1').datepicker( options );
		var disabledLeftArrow = $sample.find('.right.disabled').length;
		var nextMonthDaysVisible = $sample.find('.nextmonth button').length;
		var disabledDaysVisible = $sample.find('.nextmonth .restrict').length;
		equal( disabledLeftArrow, 1, 'navigation right is disabled' );
		equal( disabledDaysVisible, nextMonthDaysVisible, 'visible next month days are disabled' );
	});

	test( 'should disable dates not in the restrictToYear year', function() {
		var options = {
			date: new Date( 2010, 11, 10 ),
			restrictToYear: 2014
		};
		var $sample = $(html).find('#datepicker1').datepicker( options );
		var daysDisplayed = $sample.find( '.thismonth .weekday' ).length;
		var daysDisplayedDisabled = $sample.find( '.thismonth .weekday.restrict' ).length;
		ok( daysDisplayedDisabled > 0, 'some days are disabled' );
		equal( daysDisplayedDisabled, daysDisplayed, 'all days are disabled' );
	});
});
