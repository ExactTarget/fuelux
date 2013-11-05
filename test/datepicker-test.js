/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/datepicker'], function ($) {

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

	module('Fuel UX datepicker');

	test( 'should be defined on the jQuery object', function() {
		ok( $(document.body).datepicker, 'datepicker method is defined' );
	});

	test( 'should return element', function() {
		ok( $(document.body).datepicker()[0] === document.body, 'document.body returned' );
	});

	test( 'should initialize with current date and restrict past dates by default', function() {
		// using default formatDate function
		var today       = new Date();
		var todaysDate  = ( today.getDate() < 10 ) ? '0' + today.getDate() : today.getDate();
		var todaysMonth = ( ( today.getMonth() + 1 ) < 10 ) ?  '0' + ( today.getMonth() + 1 ) : ( today.getMonth() + 1 );
		today           =  todaysMonth + '-' + todaysDate + '-' + today.getFullYear();

		// markup already there
		var $sample    = $( html ).find( '#datepicker1' ).datepicker();
		var pickerDate = $sample.datepicker( 'getFormattedDate' );
		equal( pickerDate, today, 'w/ markup - initialized with todays date' );

		// markup generated
		var $sample2 = $( html ).find( '#datepicker2' );

		$sample2.datepicker({
			createInput: true
		});

		var pickerDate2 = $sample2.datepicker( 'getFormattedDate' );
		equal( pickerDate2, today, 'w/ markup - initialized with todays date' );

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

		var $sample2 = $( html ).find( '#datepicker2' );

		$sample2.datepicker({
			date: futureDate,
			createInput: true
		});

		var pickerDate2 = $sample2.datepicker( 'getDate', { unix: true } );
		equal( pickerDate2, futureDate, 'no markup datepicker initialized with different date than now' );
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

		var $sample = $( html ).find( '#datepicker1' ).datepicker().on( 'changed', function( event, date ) {
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
		var $sansMarkup = $( html ).find( '#datepicker2' );
		var customWidth = 240;

		$sansMarkup.datepicker({
			createInput: true,
			dropdownWidth: customWidth
		});

		var $dropdown        = $sansMarkup.find( '.dropdown-menu' );
		var headerWidth     = $dropdown.find( '.header' ).width();
		var daysViewWidth   = $dropdown.find( '.daysView' ).width();
		var monthsViewWidth = $dropdown.find( '.monthsView' ).width();
		var yearsViewWidth  = $dropdown.find( '.yearsView' ).width();

		equal( headerWidth, daysViewWidth, 'header and days view are same width' );
		equal( headerWidth, monthsViewWidth, 'header and months view are same width' );
		equal( headerWidth, yearsViewWidth, 'header and years view are same width' );
		equal( daysViewWidth, monthsViewWidth, 'days view and months view are same width' );
		equal( daysViewWidth, yearsViewWidth, 'days view and years view are same width' );
		equal( monthsViewWidth, yearsViewWidth, 'months view and years view are same width' );

		var customWidthCheck = Boolean( headerWidth >= customWidth );

		equal( customWidthCheck, true, 'no markup - dropdown has a custom width (only via pixels)' );

		var $markup = $( html ).find( '#datepicker1' );
		var customWidth2 = 240;

		$markup.datepicker({
			createInput: true,
			dropdownWidth: customWidth
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

	test( 'should create datepicker without markup being present - basic', function() {
		var $sansMarkup = $( html ).find( '#datepicker2' );

		$sansMarkup.datepicker({
			createInput: true
		});
		var input1    = $sansMarkup.find( 'input' ).length;
		var dropdown1 = $sansMarkup.find( '.dropdown-menu' ).length;
		var button1   = $sansMarkup.find( 'button' ).length;

		equal( input1, 1, 'input was created' );
		equal( dropdown1, 1, 'dropdown for calendar was created' );
		equal( button1, 0, 'no button is added by default' );
	});

	test( 'should create datepicker without markup being present - w/ dropdown button', function() {
		var $sansMarkup = $( html ).find( '#datepicker2' );

		$sansMarkup.datepicker({
			createInput: {
				dropDownBtn: true
			}
		});

		var input1    = $sansMarkup.find( 'input' ).length;
		var dropdown1 = $sansMarkup.find( '.dropdown-menu' ).length;
		var button1   = $sansMarkup.find( 'button' ).length;

		equal( input1, 1, 'input was created' );
		equal( dropdown1, 1, 'dropdown for calendar was created' );
		equal( button1, 1, 'dropdown button is added' );
	});

	test( 'should create datepicker without markup being present - native', function() {
		var $sansMarkup = $( html ).find( '#datepicker2' );

		$sansMarkup.datepicker({
			createInput: {
				native: true
			}
		});

		var inputType = $sansMarkup.find( 'input[type="date"]' ).length;
		equal( inputType, 1, 'input was created with type date for native integration' );
	});

	test( 'should create datepicker without markup being present - w/ custom input size via CSS class', function() {
		var $sansMarkup = $( html ).find( '#datepicker2' );

		$sansMarkup.datepicker({
			createInput: {
				inputSize: 'span4'
			}
		});

		var inputClass = !!$sansMarkup.find( 'input' ).hasClass( 'span4' );
		equal( inputClass, true, 'input has custom width via class' );
	});

	test( 'should create datepicker without markup being present - w/ custom input size via pixel', function() {
		var $sansMarkup = $( html ).find( '#datepicker2' );
		var inputWidth  = 300;

		$sansMarkup.datepicker({
			createInput: {
				inputSize: inputWidth
			}
		});

		var inputWidthCheck = Boolean( $sansMarkup.find( 'input' ).width() === inputWidth );
		equal( inputWidthCheck, true, 'input has custom width via pixels' );
	});
});