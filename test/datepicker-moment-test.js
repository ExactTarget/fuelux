/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/datepicker-markup.html!strip" );

	require( "bootstrap" );
	require( "moment" );
	require( "fuelux/datepicker" );

	// Require('test/datepicker-test');	//this ensures the non-moment tests run before the moment tests

	function uaMatch( ua ) {
		ua = ua.toLowerCase();
		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf( "compatible" ) < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	}

	var UA = uaMatch( navigator.userAgent );
	var runTestsBoolean = true;

	if ( UA.browser === "msie" ) {
		if ( parseInt( UA.version, 10 ) <= 9 ) {
			runTestsBoolean = false;
		}
	}

	//IE 8 & 9 have problems with the moment switching. Figure a way around this later, if possible. Otherwise, just
	//test manually by commenting this if statement out and refreshing over and over again.
	if ( runTestsBoolean ) {
		QUnit.module( "Fuel UX Datepicker with moment.js" );

		QUnit.test( "should be defined on jquery object", function( assert ) {
			assert.ok( $().datepicker, "datepicker method is defined" );
		} );

		QUnit.test( "should return element", function( assert ) {
			var $datepicker = $( html );
			assert.ok( $datepicker.datepicker() === $datepicker, "datepicker should be initialized" );
		} );

		QUnit.test( "should initialize with current date and restrict past dates by default", function( assert ) {
			var today = new Date();
			var todaysDate = ( today.getDate() < 10 ) ? "0" + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ? "0" + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today = todaysMonth + "/" + todaysDate + "/" + today.getFullYear();

			var $datepicker = $( html ).datepicker();
			var pickerDate = $datepicker.datepicker( "getFormattedDate" );
			assert.equal( pickerDate, today, "w/ markup - initialized with todays date" );

			var pastRestrictionCheck = $datepicker.find( ".restricted" ).length > 0;
			assert.equal( pastRestrictionCheck, true, "restricted past dates are default" );
		} );

		QUnit.test( "should initialize with date other than now", function( assert ) {
			var $datepicker = $( html );
			var futureDate = new Date( new Date().getTime() + 604800000 ).getTime();	// 7 days in the future
			var pickerDate;

			$datepicker.datepicker( { date: futureDate } );
			pickerDate = $datepicker.datepicker( "getDate" );

			assert.equal( pickerDate.getTime(), futureDate, "markup datepicker initialized with different date than now" );
		} );

		QUnit.test( "should handle 2 digit year", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var $datepickerInput = $datepicker.find( "input" );
			var parsedAs;

			$datepickerInput.val( "01/01/68" );
			$datepickerInput.trigger( "change" );
			parsedAs = $datepicker.datepicker( "getFormattedDate" );
			assert.equal( parsedAs, "01/01/2068", "01/01/68 parsed correctly" );

			$datepickerInput.val( "1/1/68" );
			$datepickerInput.trigger( "change" );
			parsedAs = $datepicker.datepicker( "getFormattedDate" );
			assert.equal( parsedAs, "01/01/2068", "1/1/68 parsed correctly" );

			$datepickerInput.val( "1/1/69" );
			$datepickerInput.trigger( "change" );
			parsedAs = $datepicker.datepicker( "getFormattedDate" );
			assert.equal( parsedAs, "01/01/1969", "1/1/69 parsed correctly" );

			$datepickerInput.val( "01/01/69" );
			$datepickerInput.trigger( "change" );
			parsedAs = $datepicker.datepicker( "getFormattedDate" );
			assert.equal( parsedAs, "01/01/1969", "01/01/69 parsed correctly" );
		} );

		QUnit.test( "should initialize with null date", function( assert ) {
			var $datepicker = $( html ).datepicker( { date: null } );
			var initializedDate = $datepicker.datepicker( "getDate" ).toString();
			var inputValue = $datepicker.find( 'input[type="text"]' ).val();

			assert.equal( ( initializedDate === "Invalid Date" || initializedDate === "NaN" ), true, "datepicker was initialized with null value" );
			assert.equal( inputValue, "", "datepicker does not have value in input field" );
		} );

		QUnit.test( "should return date using getDate method", function( assert ) {
			var $datepicker = $( html ).datepicker( { date: new Date( 1987, 2, 31 ) } );
			var date = $datepicker.datepicker( "getDate" );
			var dateFormatted = $datepicker.datepicker( "getFormattedDate" );

			assert.equal( date instanceof Date, true, "returned a valid date object" );
			assert.equal( ( date.getDate() === 31 && date.getMonth() === 2 && date.getFullYear() === 1987 ), true, "returned correct date" );
			assert.equal( dateFormatted, "03/31/1987", "returned correct formatted date" );
		} );

		QUnit.test( "should return date using getValue alias", function( assert ) {
			var $datepicker = $( html ).datepicker( { date: new Date( 1987, 2, 31 ) } );
			var date1 = $datepicker.datepicker( "getDate" );
			var date2 = $datepicker.datepicker( "getValue" );

			assert.equal( date1, date2, "getValue alias matches getDate" );
		} );

		QUnit.test( "should set new date using setDate method passing a Date object", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var newDate = new Date( 1987, 2, 31 );
			var datepickerDate;

			$datepicker.datepicker( "setDate", newDate );
			datepickerDate = $datepicker.datepicker( "getDate" );

			assert.equal( datepickerDate.getTime(), newDate.getTime(), "setDate method works" );
		} );

		QUnit.test( "should set new date using setDate method passing a ISO string", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var dateString = '2015-05-29T04:00:00.000Z';
			var newDate = new Date(dateString);
			var datepickerDate;

			$datepicker.datepicker( "setDate", dateString);
			datepickerDate = $datepicker.datepicker( "getDate" );

			assert.equal( datepickerDate.getTime(), newDate.getTime(), "setDate method works" );
		} );

		QUnit.test( "should enable/disable datepicker", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var $datepickerInput = $datepicker.find( "input" );

			var defaultState = !!$datepicker.find( "button" ).prop( "disabled" ) && !!$datepickerInput.prop( "disabled" );
			assert.equal( defaultState, false, "datepicker is enabled" );

			$datepicker.datepicker( "disable" );
			var disabledState = !!$datepicker.find( "button" ).prop( "disabled" ) && !!$datepickerInput.prop( "disabled" );
			assert.equal( disabledState, true, "datepicker is disabled" );

			$datepicker.datepicker( "enable" );
			var enabledState = !!$datepicker.find( "button" ).prop( "disabled" ) && !!$datepickerInput.prop( "disabled" );
			assert.equal( enabledState, false, "datepicker is enabled again" );
		} );

		QUnit.test( "should not restrict past dates when allowPastDates option set to true", function( assert ) {
			var $datepicker = $( html );
			var $pastDate;

			$datepicker.datepicker( { allowPastDates: true } );
			$pastDate = $datepicker.find( ".past:first" );

			assert.equal( $pastDate.hasClass( "restricted" ), false, "past dates are not restricted as expected" );
		} );

		QUnit.test( "should fire changed event when new date is input", function( assert ) {
			var called = 0;
			var $datepicker = $( html ).datepicker();
			var $datepickerInput = $datepicker.find( "input" );
			var date = new Date( NaN );
			var event = false;

			$datepicker.on( "changed.fu.datepicker", function( e, dt ) {
				called++;
				date = dt;
				event = e;
			} );

			$datepickerInput.val( "03/31/1987" );
			$datepickerInput.trigger( "change" );

			assert.equal( called, 1, "Event was triggered as expected" );
			assert.equal( typeof event, "object", "Appropriate event object passed back as argument" );
			assert.equal( ( date.getDate() === 31 && date.getMonth() === 2 && date.getFullYear() === 1987 ), true, "Appropriate date object passed back as argument" );
		} );

		QUnit.test( "should restrict navigation and selection of dates within other years if option sameYearOnly is set to true", function( assert ) {
			var $datepicker = $( html ).datepicker( {
				date: new Date( 1987, 2, 31 ),
				sameYearOnly: true
			} );
			var $datepickerInput = $datepicker.find( "input" );
			var $header = $datepicker.find( ".datepicker-calendar-header" );
			var $titleButton = $header.find( ".title" );
			var $titleYear = $titleButton.find( "span.year" );
			var dateString;

			$datepicker.datepicker( "setDate", "12/01/1987" );
			$header.find( ".next" ).trigger( "click" );
			assert.equal( $titleYear.text(), "1987", "user can't next click outside current year" );

			$datepicker.datepicker( "setDate", "01/01/1987" );
			$header.find( ".prev" ).trigger( "click" );
			assert.equal( $titleYear.text(), "1987", "user can't prev click outside current year" );

			$titleButton.trigger( "click" );
			assert.equal( $datepicker.find( ".datepicker-wheels-year" ).hasClass( "hidden" ), true, "years wheel hidden" );

			$datepickerInput.val( "03/31/1988" );
			$datepickerInput.trigger( "change" );
			dateString = $datepicker.datepicker( "getDate" ).toString();
			assert.equal( ( dateString === "Invalid Date" || dateString === "NaN" ), true, "user can\t input date outside current year" );
		} );

		QUnit.test( "should restrict days if restricted option is set", function( assert ) {
			var $datepicker = $( html ).datepicker( {
				allowPastDates: true,
				date: new Date( 1987, 2, 5 ),
				restricted: [ { from: new Date( 1987, 2, 1 ), to: new Date( 1987, 2, 4 ) }, { from: new Date( 1987, 2, 28 ), to: new Date( 1987, 3, 1 ) } ]
			} );
			var dates = [ "1", "2", "3", "4", "28", "29", "30", "31", "1" ];
			var i = 0;
			var month = "2";

			$datepicker.find( ".restricted" ).each( function() {
				var $item = $( this );
				if ( i > 7 ) {
					month = "3";
				}
				assert.equal( ( $item.attr( "data-date" ) === dates[ i ] && $item.attr( "data-month" ) === month && $item.attr( "data-year" ) === "1987" ), true,
					"correct date restricted as expected" );
				i++;
			} );

			assert.equal( dates.length === i, true, "correct number of dates restricted" );
		} );

		QUnit.test( "should destroy control", function( assert ) {
			var $datepicker = $( html ).datepicker();

			assert.equal( typeof( $datepicker.datepicker( "destroy" ) ), "string", "returns string (markup)" );
			assert.equal( $datepicker.parent().length, false, "control has been removed from DOM" );
		} );

		//MOMENT TESTS

		QUnit.test( "should have moment.js doing the date parsing", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var momentBoolean = $datepicker.datepicker( "checkForMomentJS" );
			var today = new Date();
			var todaysDate = ( today.getDate() < 10 ) ? "0" + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ? "0" + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );

			today = todaysMonth + "/" + todaysDate + "/" + today.getFullYear();

			assert.equal( momentBoolean, true, "moment.js is being used" );
			assert.equal( $datepicker.datepicker( "getFormattedDate" ), today, "moment.js parsed date correctly for default implementation (en culture)" );
		} );

		QUnit.test( "should not use moment if either formatCode or culture is missing", function( assert ) {
			var $datepicker1 = $( html ).datepicker( {
				momentConfig: {
					culture: null
				}
			} );
			var result1 = $datepicker1.datepicker( "checkForMomentJS" );

			var $datepicker2 = $( html ).datepicker( {
				momentConfig: {
					format: null
				}
			} );
			var result2 = $datepicker2.datepicker( "checkForMomentJS" );

			var $datepicker3 = $( html ).datepicker( {
				momentConfig: {
					culture: null,
					formatCode: null
				}
			} );
			var result3 = $datepicker3.datepicker( "checkForMomentJS" );

			var $datepicker4 = $( html ).datepicker( {
				momentConfig: {
					culture: "en",
					formatCode: "L"
				}
			} );
			var result4 = $datepicker4.datepicker( "checkForMomentJS" );

			var $datepicker5 = $( html ).datepicker( {
				momentConfig: {
					culture: "en",
					formatCode: ""
				}
			} );
			var result5 = $datepicker5.datepicker( "checkForMomentJS" );

			assert.equal( result1, false, "moment is not used because the option momentConfig.culture is null" );
			assert.equal( result2, false, "moment is not used because the option momentConfig.format is null" );
			assert.equal( result3, false, "moment is not used because the options momentConfig.culture and momentConfig.format are null" );
			assert.equal( result4, true, "moment is used because both momentConfig options are set" );
			assert.equal( result5, true, "moment is used because both momentConfig options are set, formatCode is empty" );
		} );

		QUnit.test( "should be initialized with different culture", function( assert ) {
			var culture = "de";
			var $datepicker = $( html ).datepicker( {
				momentConfig: {
					culture: culture
				}
			} );
			var today = new Date();
			var todaysDate = ( today.getDate() < 10 ) ? "0" + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ? "0" + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );

			today = todaysDate + "." + todaysMonth + "." + today.getFullYear();

			assert.equal( $datepicker.datepicker( "getFormattedDate" ), today, "moment js parsed date correctly using different culture (de)" );
		} );

		QUnit.test( "should be initialized with different culture and different format", function( assert ) {
			var $datepicker = $( html ).datepicker( {
				momentConfig: {
					culture: "de",
					format: "l"
				}
			} );
			var today = new Date();
			today = today.getDate() + "." + ( today.getMonth() + 1 ) + "." + today.getFullYear();

			assert.equal( $datepicker.datepicker( "getFormattedDate" ), today, "moment.js parsed date correctly for different culture and format (de, l)" );
		} );

		QUnit.test( "should get current culture", function( assert ) {
			var $datepicker = $( html ).datepicker();
			assert.equal( $datepicker.datepicker( "getCulture" ), "en", "returned correct culture from initialization" );

			$datepicker.datepicker( "setCulture", "de" );
			assert.equal( $datepicker.datepicker( "getCulture" ), "de", "returned correct culture after being changed" );
		} );

		QUnit.test( "should set new culture", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var today = new Date();
			var todaysDate = ( today.getDate() < 10 ) ? "0" + today.getDate() : today.getDate();
			var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  "0" + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
			today = todaysDate + "." + todaysMonth + "." + today.getFullYear();
			$datepicker.datepicker( "setCulture", "de" );

			assert.equal( $datepicker.datepicker( "getCulture" ), "de", "returned correct culture after being changed" );
			assert.equal( $datepicker.datepicker( "getFormattedDate" ), today, "did correct formatting after dynamic update" );
		} );

		QUnit.test( "should get format", function( assert ) {
			var $datepicker = $( html ).datepicker();
			assert.equal( $datepicker.datepicker( "getFormat" ), "L", "returned correct format from initialization" );

			$datepicker.datepicker( "setFormat", "l" );
			assert.equal( $datepicker.datepicker( "getFormat" ), "l", "returned correct format after being changed" );
		} );

		QUnit.test( "should set new format", function( assert ) {
			var $datepicker = $( html ).datepicker();
			var today = new Date();
			today = ( today.getMonth() + 1 ) + "/" +  today.getDate() + "/" + today.getFullYear();

			$datepicker.datepicker( "setFormat", "l" );
			assert.equal( $datepicker.datepicker( "getFormattedDate" ), today, "returned correct culture after being changed" );
		} );

		QUnit.test( "input parsing should take culture into account", function( assert ) {
			var $datepicker = $( html ).datepicker( {
				momentConfig: {
					culture: "fr",
					format: "L"
				}
			} );
			var $datepickerInput = $datepicker.find( "input" );
			var dateString = "30/10/2014";
			var formatted;

			$datepickerInput.val( dateString );
			$datepickerInput.trigger( "change" );
			formatted = $datepicker.datepicker( "getFormattedDate" );

			assert.equal( formatted, dateString, "moment.js formatted date should be equal to input" );
		} );

		QUnit.test( "when input is blurred, culture is german, and no date changes, input value should not change", function( assert ) {
			var date = "03.07.2014"; // July 3rd, 2014
			var $datepicker = $( html ).datepicker( {
				allowPastDates: true,
				date: new Date( 2014, 6, 3 ),
				momentConfig: {
					culture: "de"
				}
			} );
			var $input = $datepicker.find( "input" );

			assert.equal( $datepicker.datepicker( "getFormattedDate" ), date, "moment.js parsed date correctly after initialization with de culture" );

			$input.trigger( "blur" );
			assert.equal( $datepicker.datepicker( "getFormattedDate" ), date, "moment.js parsed date correctly after input blurred" );
		} );

		QUnit.test( "when bad data is input, don't fail with bad date", function( assert ) {
			var date = "07/03/2014"; // July 3rd, 2014
			var $datepicker = $( html ).datepicker( {
				allowPastDates: true,
				date: new Date( 2014, 6, 3 )
			} );
			var $input = $datepicker.find( "input" );
			var dateString;

			assert.equal( $datepicker.datepicker( "getFormattedDate" ), date, "moment.js parsed date correctly after initialization with de culture" );

			$input.val( "aa.bb.cccc" );
			$input.trigger( "change" );
			dateString = $datepicker.datepicker( "getDate" ).toString();
			assert.equal( ( dateString === "Invalid Date" || dateString === "NaN" ), true, "datepicker should return 'Invalid Date' or 'NaN' when bad data is entered" );
		} );
	}
} );
