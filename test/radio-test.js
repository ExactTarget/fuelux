/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/radio-markup.html!strip" );
	/* FOR DEV TESTING - uncomment to test against index.html */

	//Html = require('text!index.html!strip');
	html = $( "<div>" + html + "</div>" ).find( "#MyRadioContainer" );

	require( "bootstrap" );
	require( "fuelux/radio" );

	QUnit.module( "Fuel UX Radio" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().radio, "radio method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $radio1 = $( html ).find( "#Radio1" );
		assert.ok( $radio1.radio() === $radio1, "radio should be initialized" );
	} );

	QUnit.test( "should set initial state for checked/enabled", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();

		// Initialize radio
		$element.find( "label" ).radio();

		// Ensure label has checked class
		var checked = $element.find( "label" ).hasClass( "checked" );
		assert.equal( checked, true, 'label has "checked" class when input is checked' );

		// Ensure label does not have disabled class
		var disabled = $element.find( "label" ).hasClass( "disabled" );
		assert.equal( disabled, false, 'label does not have "disabled" class when input is enabled' );
	} );

	QUnit.test( "should set initial state to checked for first item in group", function( assert ) {
		var $element = $( html ).find( "#RadioGroup" ).clone();

		$element.find( "input" ).eq( 0 ).prop( "checked", "checked" );

		// Initialize radio
		$element.find( "label" ).radio();

		var item0 = $element.find( "label" ).eq( 0 );
		assert.equal( item0.hasClass( "checked" ), true, 'index 0 label has "checked" class when input is checked' );

		var item1 = $element.find( "label" ).eq( 1 );
		assert.equal( item1.hasClass( "checked" ), false, 'index 1 label does not have "checked" class' );

		var item2 = $element.find( "label" ).eq( 2 );
		assert.equal( item2.hasClass( "checked" ), false, 'index 2 label does not have "checked" class' );
	} );

	QUnit.test( "should set 2nd item checked and 1st item unchecked after selecting 2nd item in group", function( assert ) {
		var $element = $( html ).find( "#RadioGroup" ).clone();
		$element.appendTo( document.body ); // Append to body to capture clicks

		$element.find( "input" ).eq( 0 ).prop( "checked", "checked" );

		// Initialize radio
		$element.find( "label" ).radio();

		var $input = $element.find( "input" ).eq( 1 );
		$input.click();

		// Ensure item 0 (1st) label has checked class
		var item0 = $element.find( "label" ).eq( 0 );
		assert.equal( item0.hasClass( "checked" ), false, 'index 0 label does not have "checked" class when input is checked' );

		var item1 = $element.find( "label" ).eq( 1 );
		assert.equal( item1.hasClass( "checked" ), true, 'index 1 label has "checked" class' );

		var item2 = $element.find( "label" ).eq( 2 );
		assert.equal( item2.hasClass( "checked" ), false, 'index 2 label does not have "checked" class' );

		$element.remove();
	} );

	QUnit.test( "should set initial state to checked for middle item in group", function( assert ) {
		var $element = $( html ).find( "#RadioGroup" ).clone();

		$element.find( "input" ).eq( 1 ).prop( "checked", "checked" );

		// Initialize radio
		$element.find( "label" ).radio();

		var item0 = $element.find( "label" ).eq( 0 );
		assert.equal( item0.hasClass( "checked" ), false, 'index 0 label does not have "checked" class when input is checked' );

		var item1 = $element.find( "label" ).eq( 1 );
		assert.equal( item1.hasClass( "checked" ), true, 'index 1 label has "checked" class' );

		var item2 = $element.find( "label" ).eq( 2 );
		assert.equal( item2.hasClass( "checked" ), false, 'index 2 label does not have "checked" class' );
	} );

	QUnit.test( "should set initial state to checked for last item in group", function( assert ) {
		var $element = $( html ).find( "#RadioGroup" ).clone();

		$element.find( "input" ).eq( 2 ).prop( "checked", "checked" );

		// Initialize radio
		$element.find( "label" ).radio();

		var item0 = $element.find( "label" ).eq( 0 );
		assert.equal( item0.hasClass( "checked" ), false, 'index 0 label does not have "checked" class when input is checked' );

		var item1 = $element.find( "label" ).eq( 1 );
		assert.equal( item1.hasClass( "checked" ), false, 'index 1 label does not have "checked" class' );

		var item2 = $element.find( "label" ).eq( 2 );
		assert.equal( item2.hasClass( "checked" ), true, 'index 2 label has "checked" class' );
	} );

	QUnit.test( "should set initial state for checked/disabled", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedDisabled" ).clone();

		// Initialize radio
		$element.find( "label" ).radio();

		// Ensure label has checked class
		var checked = $element.find( "label" ).hasClass( "checked" );
		assert.equal( checked, true, 'label has "checked" class when input is checked' );

		// Ensure label has disabled class
		var disabled = $element.find( "label" ).hasClass( "disabled" );
		assert.equal( disabled, true, 'label has "disabled" class when input is disabled' );
	} );

	QUnit.test( "should set initial state for unchecked/enabled", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();

		// Initialize radio
		$element.find( "label" ).radio();

		// Ensure label does not have checked class
		var checked = $element.find( "label" ).hasClass( "checked" );
		assert.equal( checked, false, 'label does not have "checked" class when input is unchecked' );

		// Ensure label does not have disabled class
		var disabled = $element.find( "label" ).hasClass( "disabled" );
		assert.equal( disabled, false, 'label does not have "disabled" class when input is enabled' );
	} );

	QUnit.test( "should set initial state for unchecked/disabled", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedDisabled" ).clone();

		// Initialize radio
		$element.find( "label" ).radio();

		// Ensure label does not have checked class
		var checked = $element.find( "label" ).hasClass( "checked" );
		assert.equal( checked, false, 'label does not have "checked" class when input is unchecked' );

		// Ensure label has disabled class
		var disabled = $element.find( "label" ).hasClass( "disabled" );
		assert.equal( disabled, true, 'label has "disabled" class when input is disabled' );
	} );

	QUnit.test( "should disable radio", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		// Set disabled state
		assert.equal( $input.prop( "disabled" ), false, "radio enabled initially" );
		$radio.radio( "disable" );
		assert.equal( $input.prop( "disabled" ), true, "radio disabled after calling disable method" );
	} );

	QUnit.test( "should enable radio", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedDisabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		// Set enabled state
		assert.equal( $input.prop( "disabled" ), true, "radio disabled initially" );
		$radio.radio( "enable" );
		assert.equal( $input.prop( "disabled" ), false, "radio enabled after calling enable method" );
	} );

	QUnit.test( "should check radio", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		// Set checked state
		assert.equal( $input.prop( "checked" ), false, "radio unchecked initially" );
		$radio.radio( "check" );
		assert.equal( $input.prop( "checked" ), true, "radio checked after calling check method" );
	} );

	QUnit.test( "should uncheck radio", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		// Set checked state
		assert.equal( $input.prop( "checked" ), true, "radio checked initially" );
		$radio.radio( "uncheck" );
		assert.equal( $input.prop( "checked" ), false, "radio unchecked after calling uncheck method" );
	} );

	QUnit.test( "should return checked state", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		// Verify checked state changes with uncheck method
		$radio.radio( "uncheck" );
		assert.equal( $radio.radio( "isChecked" ), false, "radio state is unchecked" );

		// Verify checked state changes with check method
		$radio.radio( "check" );
		assert.equal( $radio.radio( "isChecked" ), true, "radio state is checked" );
	} );

	QUnit.test( "should support getValue alias", function( assert ) {
		var $element = $( html ).find( "#CheckboxCheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="checkbox"]' );

		// Initialize checkbox
		var $radio = $element.find( "label" ).radio();

		// Verify alias aliases
		assert.equal( $radio.radio( "isChecked" ), $radio.radio( "getValue" ), "getValue alias matches isChecked" );
		$radio.radio( "toggle" );
		assert.equal( $radio.radio( "isChecked" ), $radio.radio( "getValue" ), "getValue alias matches isChecked" );
		$radio.checkbox( "toggle" );
		assert.equal( $radio.radio( "isChecked" ), $radio.radio( "getValue" ), "getValue alias matches isChecked" );
	} );

	QUnit.test( "should trigger checked event when calling check method", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		var triggered = false;
		$radio.on( "checked.fu.radio", function() {
			triggered = true;
		} );

		$radio.radio( "check" );

		assert.equal( triggered, true, "checked event triggered" );
	} );

	QUnit.test( "should trigger unchecked event when calling uncheck method", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		var triggered = false;
		$radio.on( "unchecked.fu.radio", function() {
			triggered = true;
		} );

		$radio.radio( "uncheck" );

		assert.equal( triggered, true, "unchecked event triggered" );
	} );

	QUnit.test( "should trigger changed event when calling checked/unchecked method", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		var triggered = false;
		var state = false;
		$radio.on( "changed.fu.radio", function( evt, data ) {
			triggered = true;
			state = data;
		} );

		$radio.radio( "uncheck" );

		assert.equal( triggered, true, "changed event triggered" );
		assert.equal( state, false, "changed event triggered passing correct state" );
	} );

	QUnit.test( "should trigger changed event when clicking on input element", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );
		$element.appendTo( document.body ); // Append to body to capture clicks

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		var triggered = false;
		$element.on( "changed.fu.radio", function() {
			triggered = true;
		} );

		$input.click();
		assert.equal( triggered, true, "changed event triggered" );

		$element.remove();
	} );

	QUnit.test( "should trigger changed event when clicking on input element", function( assert ) {
		var $element = $( html ).find( "#RadioUncheckedEnabled" ).clone();
		var $input = $element.find( 'input[type="radio"]' );
		$element.appendTo( document.body ); // Append to body to capture clicks

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		var triggered = false;
		$element.on( "changed.fu.radio", function() {
			triggered = true;
		} );

		$input.click();
		assert.equal( triggered, true, "changed event triggered" );

		$element.remove();
	} );

	QUnit.test( "should toggle radio container visibility", function( assert ) {
		var $element = $( html ).find( "#RadioToggle" ).clone();
		var $container = $element.find( ".radioToggle" );
		$element.appendTo( document.body ); // Append to body to check visibility

		// Initialize radio
		var $radio = $element.find( "label" ).radio();

		assert.equal( $container.is( ":visible" ), false, "toggle container hidden by default" );
		$radio.radio( "check" );
		assert.equal( $container.is( ":visible" ), true, "toggle container visible after check" );
		$radio.radio( "uncheck" );
		assert.equal( $container.is( ":visible" ), false, "toggle container hidden after uncheck" );

		$element.remove();
	} );

	QUnit.test( "should destroy radio", function( assert ) {
		var $element = $( html ).find( "#RadioCheckedEnabled" ).clone();

		// Initialize radio
		var $radio = $element.find( "label" ).radio();
		var originalMarkup = $element.find( "label" )[ 0 ].outerHTML;

		assert.equal( $element.find( "#Radio1" ).length, 1, "radio exists in DOM by default" );

		var markup = $radio.radio( "destroy" );

		assert.equal( originalMarkup, markup, "returned original markup" );
		assert.equal( $element.find( "#Radio1" ).length, 0, "radio removed from DOM" );
	} );
} );
