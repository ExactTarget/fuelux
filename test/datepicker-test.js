/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function( require ) {
	var $ = require( "jquery" );
	var QUnit = require('qunit');
	var html = require( "text!test/markup/datepicker-markup.html!strip" );
	/* FOR DEV TESTING - uncomment to test against index.html */
	//Html = require('text!index.html!strip');

	require( "bootstrap" );
	require( "fuelux/datepicker" );

	QUnit.module( "Fuel UX Datepicker" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().datepicker, "datepicker method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $datepicker = $( html ).find( "#MyDatepicker" );
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
		var $datepicker = $( html ).find( "#MyDatepicker" );
		var futureDate = new Date( new Date().getTime() + 604800000 ).getTime();	// 7 days in the future
		var pickerDate;

		$datepicker.datepicker( { date: futureDate } );
		pickerDate = $datepicker.datepicker( "getDate" );

		assert.equal( pickerDate.getTime(), futureDate, "markup datepicker initialized with different date than now" );
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

	QUnit.test( "should not use moment.js if not available", function( assert ) {
		var $datepicker = $( html ).datepicker();
		var momentBoolean = $datepicker.datepicker( "checkForMomentJS" );

		assert.equal( momentBoolean, false, "not utilizing moment.js because it is not available" );
	} );

	QUnit.test( "should not be able to use features that require moment.js when it is not available", function( assert ) {
		var $datepicker = $( html ).datepicker();
		var momentBoolean = $datepicker.datepicker( "checkForMomentJS" );
		var defaultErrorReturned = "moment.js is not available so you cannot use this function";
		var errors = {};

		try {
			$datepicker.datepicker( "getCulture" );
		}catch ( e ) {
			errors.getCulture = e;
		}

		try {
			$datepicker.datepicker( "setCulture", "de" );
		}catch ( e ) {
			errors.setCulture = e;
		}

		try {
			$datepicker.datepicker( "getFormat" );
		}catch ( e ) {
			errors.getFormat = e;
		}

		try {
			$datepicker.datepicker( "setFormat", "l" );
		}catch ( e ) {
			errors.setFormat = e;
		}

		assert.equal( momentBoolean, false, "not utilizing moment.js because it is not available" );
		assert.equal( errors.getCulture, defaultErrorReturned, "getCulture is not available for use" );
		assert.equal( errors.setCulture, defaultErrorReturned, "setCulture is not available for use" );
		assert.equal( errors.getFormat, defaultErrorReturned, "getFormat is not available for use" );
		assert.equal( errors.setFormat, defaultErrorReturned, "setFormat is not available for use" );
	} );

	QUnit.test( "should show datepicker", function( assert ) {
		var $datepicker = $( html ).datepicker( {
			date: new Date( 1987, 2, 31 )
		} );

		$datepicker.on( "shown.fu.datepicker", function() {
			assert.ok( 1 === 1, "shown event thrown as expected" );
			assert.equal( $datepicker.find( ".input-group-btn" ).hasClass( "open" ), true, "datepicker shown as expected" );
		} );
		$datepicker.datepicker( "show" );
	} );

	QUnit.test( "should hide datepicker", function( assert ) {
		var $datepicker = $( html ).datepicker( {
			date: new Date( 1987, 2, 31 )
		} );

		$datepicker.on( "hidden.fu.datepicker", function() {
			assert.ok( 1 === 1, "hidden event thrown as expected" );
			assert.equal( $datepicker.find( ".input-group-btn" ).hasClass( "open" ), false, "datepicker hidden as expected" );
		} );
		$datepicker.datepicker( "show" );
		$datepicker.datepicker( "hide" );
	} );

	QUnit.test( "should open with calendar showing selected date", function( assert ) {
		var attrMonth = "data-month";
		var attrYear = "data-year";
		var $datepicker = $( html ).datepicker( {
			date: new Date( 1987, 2, 31 )
		} );
		var $title = $datepicker.find( ".datepicker-calendar-header .title" );

		$datepicker.datepicker( "show" );
		assert.equal( ( $title.attr( attrMonth ) === "2" && $title.attr( attrYear ) === "1987" ), true, "selected date showing initially" );
		$datepicker.find( ".datepicker-calendar-header .next" ).click().click();
		$datepicker.datepicker( "hide" );
		$datepicker.datepicker( "show" );
		assert.equal( ( $title.attr( attrMonth ) === "2" && $title.attr( attrYear ) === "1987" ), true, "selected date showing after switching through months" );
		$title.click();
		$datepicker.datepicker( "hide" );
		$datepicker.datepicker( "show" );
		assert.equal( ( $title.attr( attrMonth ) === "2" && $title.attr( attrYear ) === "1987" ), true, "selected date showing after entering wheel view" );
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
} );
