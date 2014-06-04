/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');

	require('bootstrap');
	require('fuelux/datepicker');

	function uaMatch( ua ) {
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

	var UA              = uaMatch( navigator.userAgent );
	var runTestsBoolean = true;

	if( UA.browser === "msie" ) {
		if( parseInt( UA.version, 10 ) <= 9) {
			runTestsBoolean = false;
		}
	}

	if( runTestsBoolean ) {

		var html = '<div>' +
			'<div class="datepicker dropdown" id="datepicker1">' +
				'<div class="input-append">' +
					'<div class="dropdown-menu"></div>' +
					'<input type="text" class="span2" value="" data-toggle="dropdown">' +
					'<button type="button" class="btn" data-toggle="dropdown"><i class="icon-calendar"></i></button>' +
				'</div>' +
			'</div>' +
			'<div id="datepicker2"></div>' +
		'</div>';

		module('Fuel UX Datepicker with Moment.js', {
			setup: function(){
				window.moment = window.tmpMoment;
			},
			teardown: function(){
				window.moment = undefined;
			}
		});

		test( 'should be defined on the jQuery object', function() {
			ok( $().datepicker, 'datepicker method is defined' );
		});

		test( 'should return element', function() {
			var $sample = $( html ).find( '#datepicker1' );
			ok( $sample.datepicker() === $sample, 'datepicker should be initialized' );
		});

		test( 'should initialize with current date and restrict past dates by default', function() {
			// using default formatDate function
			var today       = new Date();
			var todaysDate  = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today           =  todaysMonth + '/' + todaysDate + '/' + today.getFullYear();

			// markup already there
			var $sample    = $( html ).find( '#datepicker1' ).datepicker();
			var pickerDate = $sample.datepicker( 'getFormattedDate' );
			equal( pickerDate, today, 'w/ markup - initialized with todays date' );

			// restricted past dates
			var pastRestrictionCheck = $sample.find( '.restrict' ).length > 0;
			equal( pastRestrictionCheck, true, 'restricted past dates are default' );
		});

		test( 'should initialize with date other than now', function() {
			var $sample = $( html ).find( '#datepicker1' );
			var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) ).getTime(); // 7 days in the future

			$sample.datepicker({
				date: futureDate
			});

			var pickerDate = $sample.datepicker( 'getDate', { unix: true } );
			equal( pickerDate, futureDate, 'markup datepicker initialized with different date than now' );
		});

		test( 'should initialize with null date', function() {
			var $sample         = $( html ).find( '#datepicker1' ).datepicker({ date: null });
			var initializedDate = $sample.datepicker( 'getDate' );
			var inputValue      = $sample.find( 'input[type="text"]' ).val();

			equal( initializedDate, null, 'datepicker was initialized with null value' );
			equal( inputValue, '', 'datepicker does not have value in input field' );
		});

		test( 'should return date using getDate method', function() {
			var $sample       = $( html ).find( '#datepicker1' ).datepicker();
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
			var $sample = $( html ).find( '#datepicker1' ).datepicker();
			var newDate = new Date().getTime();

			$sample.datepicker( 'setDate', newDate );

			var datepickerNewDate = $sample.datepicker( 'getDate', { unix: true });

			equal( datepickerNewDate, newDate, 'setDate method works' );
		});

		test( 'should enable/disable datepicker', function() {
			var $sample      = $( html ).find( '#datepicker1' ).datepicker();
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
			var $sample      = $( html ).find( '#datepicker1' );
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
			var $sample = $( html ).find( '#datepicker1' );
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

			var $sample = $( html ).find( '#datepicker1' ).datepicker().on( 'changed.fu.datepicker', function( event, date ) {
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
			var $markup = $( html ).find( '#datepicker1' );
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

		test( "should have moment js doing the date parsing", function() {
			var $sample       = $( html ).datepicker();
			var momentBoolean = $sample.datepicker( '_checkForMomentJS' );
			var today         = new Date();
			var todaysDate    = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
			var todaysMonth   = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today             =  todaysMonth + '/' + todaysDate + '/' + today.getFullYear();

			equal( momentBoolean, true, "Moment JS is being used" );
			equal( $sample.datepicker( 'getFormattedDate'), today, "Moment JS parsed date correctly for default implementation (en culture)" );
		});

		test( "should not use moment if either formatCode or culture is missing ", function() {
			// checking if moment is used when culture is null
			var $sample = $( html ).datepicker({
				momentConfig: {
					culture: null
				}
			});
			var momentBoolean1 = $sample.datepicker( '_checkForMomentJS' );

			// checking if moment is used when formatCode is null
			var $sample2 = $( html ).datepicker({
				momentConfig: {
					formatCode: null
				}
			});
			var momentBoolean2 = $sample2.datepicker( '_checkForMomentJS' );

			// checking if moment is used when culture and formatCode are null.
			var $sample3 = $( html ).datepicker({
				momentConfig: {
					culture: null,
					formatCode: null
				}
			});
			var momentBoolean3 = $sample3.datepicker( '_checkForMomentJS' );

			var $sample4 = $( html ).datepicker({
				momentConfig: {
					culture: 'en',
					formatCode: 'L'
				}
			});
			var momentBoolean4 = $sample4.datepicker( '_checkForMomentJS' );

			// since the defaults are initilized, we don't need to check any other configs
			equal( momentBoolean1, false, "moment is not used because the option momentConfig.culture is null" );
			equal( momentBoolean2, false, "moment is not used because the option momentConfig.formatCode is null" );
			equal( momentBoolean3, false, "moment is not used because the options momentConfig.culture is null and momentConfig.formatCode is null" );
			equal( momentBoolean4, true, "moment is used because both momentConfig options are set" );
		});

		test( "should be initialized with different culture", function() {
			var culture = "de";
			var $sample = $( html ).datepicker({
				momentConfig: {
					culture: culture
				}
			});
			var today       = new Date();
			var todaysDate  = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today           = todaysDate + '.' + todaysMonth + '.' + today.getFullYear();

			equal( $sample.datepicker( 'getFormattedDate'), today, "Moment JS parsed date correctly for default implementation (en culture)" );
		});

		test( "should be initialized with different culture and different format", function() {
			// testing for german culture and l as a format code
			// more formats can be found here http://momentjs.com/docs/#/customization/long-date-formats/. You should use "L" or "l"
			var culture    = "de";
			var formatCode = "l";
			var $sample = $( html ).datepicker({
				momentConfig: {
					culture: culture,
					formatCode: formatCode
				}
			});
			var today = new Date();
			today     = today.getDate() + '.' + ( today.getMonth() + 1 ) + '.' + today.getFullYear();

			equal( $sample.datepicker( 'getFormattedDate'), today, "Moment JS parsed date correctly for default implementation (en culture)" );
		});

		test( "should get current culture", function() {
			// initialized with en
			var $sample = $( html ).datepicker();
			equal( $sample.datepicker( 'getCulture' ), 'en', 'returned correct culture from initialization' );

			// changing to de to make sure it's not cached
			$sample.datepicker( 'setCulture', 'de' );
			equal( $sample.datepicker( 'getCulture' ), 'de', 'returned correct culture after being changed' );
		});

		test( "should set new culture", function() {
			var $sample = $( html ).datepicker();
			var today       = new Date();
			var todaysDate  = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today           = todaysDate + '.' + todaysMonth + '.' + today.getFullYear();
			$sample.datepicker( 'setCulture', 'de' );

			equal( $sample.datepicker( 'getCulture' ), 'de', 'returned correct culture after being changed' );
			equal( $sample.datepicker( 'getFormattedDate'), today, 'did correct formatting after dynamic update' );
		});

		test( "should get formatCode", function() {
			// initialized with L
			var $sample = $( html ).datepicker();
			equal( $sample.datepicker( 'getFormatCode' ), 'L', 'returned correct formatCode from initialization' );

			// changing to de to make sure it's not cached
			$sample.datepicker( 'setFormatCode', 'l' );
			equal( $sample.datepicker( 'getFormatCode' ), 'l', 'returned correct culture after being changed' );
		});

		test( "should set new formatCode", function() {
			var $sample = $( html ).datepicker();
			var today   = new Date();
			today       = ( today.getMonth() + 1 ) + '/' +  today.getDate() + '/' + today.getFullYear();

			$sample.datepicker( 'setFormatCode', 'l' );
			equal( $sample.datepicker( 'getFormattedDate' ), today, 'returned correct culture after being changed' );
		});
	}
});
