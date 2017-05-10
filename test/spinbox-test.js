/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/spinbox-markup.html!strip" );
	/* FOR DEV TESTING - uncomment to test against index.html */

	//Html = require('text!index.html!strip');

	require( "bootstrap" );
	require( "fuelux/spinbox" );

	QUnit.module( "Fuel UX Spinbox" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().spinbox, "spinbox method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" );
		assert.ok( $spinbox.spinbox() === $spinbox, "spinbox should be initialized" );
	} );

	QUnit.test( "should behave as designed", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox();

		//Returning default value
		assert.equal( $spinbox.spinbox( "value" ), 0, "spinbox returns selected item" );

		assert.equal( $spinbox.spinbox( "value" ), $spinbox.spinbox( "getValue" ), "getValue aliases value" );

		//Set number value
		$spinbox.spinbox( "value", 2 );
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox sets number value" );

		//Set numeric string value
		$spinbox.spinbox( "value", "2.1" );
		assert.equal( $spinbox.spinbox( "value" ), 2.1, "spinbox sets floating point numeric string value" );

		$spinbox.spinbox( "value", "2" );
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox sets integer numeric string value" );

		//Disable
		$spinbox.spinbox( "disable" );
		assert.equal( $spinbox.find( ".spinbox-input" ).attr( "disabled" ), "disabled", "spinbox sets disabled" );

		//Enable
		$spinbox.spinbox( "enable" );
		assert.equal( $spinbox.find( ".spinbox-input" ).attr( "disabled" ) ? false : true, true, "spinbox sets enabled" );

		//Change
		$spinbox.spinbox( "value", "b2" );
		$spinbox.spinbox( "change" );
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox change not working for alpha strings" );

		//Increment positive
		$spinbox.spinbox( "step", true );
		assert.equal( $spinbox.spinbox( "value" ), 3, "spinbox increments positive" );

		//Increment nagative
		$spinbox.spinbox( "step", false );
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox increments negative" );

		//Spinbox should upadate value on focusout
		$spinbox.find( ".spinbox-input" ).val( 4 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 4, "spinbox updates value on focus out" );

		//Spinbox should update value before initiating increment
		$spinbox.find( ".spinbox-input" ).val( 5 );
		$spinbox.find( ".spinbox-input" ).focusin();
		$spinbox.spinbox( "step", true );
		assert.equal( $spinbox.spinbox( "value" ), 6, "spinbox updates value before initiating increment" );
	} );

	QUnit.test( "should allow setting value to zero", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox();
		$spinbox.spinbox( "value", 0 );
		assert.equal( $spinbox.spinbox( "value" ), 0, "spinbox value was set to zero" );
	} );

	QUnit.test( "should keep existing value", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinboxWithDefault" ).spinbox();
		assert.equal( $spinbox.spinbox( "value" ), 3, "spinbox kept existing value" );
	} );

	QUnit.test( "spinbox should not allow maximum/minimum values to be surpassed by manual input", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			min: -10,
			max: 10
		} );

		//Spinbox does not allow max value to be surpassed
		$spinbox.find( ".spinbox-input" ).val( 15 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 10, "spinbox resets to max value when max value is surpassed" );

		//Spinbox does not allow min value to be surpassed
		$spinbox.find( ".spinbox-input" ).val( -15 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), -10, "spinbox resets to min value when min value is surpassed" );
	} );

	QUnit.test( "spinbox should not allow maximum/minimum values to be surpassed by default values", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			min: 1,
			value: 0
		} );

		assert.equal( $spinbox.spinbox( "value" ), 1, "spinbox inits to min when default value is less than min" );

		$spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			max: 1,
			value: 2
		} );

		assert.equal( $spinbox.spinbox( "value" ), 1, "spinbox inits to max when default value is more than min" );
	} );

	QUnit.test( "spinbox should not allow non-step values to be surpassed by manual input when increments are limited to step", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			step: 3,
			limitToStep: true,
			min: 1,
			max: 7
		} );

		$spinbox.find( ".spinbox-input" ).val( 1 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 3, "spinbox sets to step value when min value is less than step value and value is set by hand" );

		$spinbox.find( ".spinbox-input" ).val( 4 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 3, "spinbox rounds down to step when appropriate" );

		$spinbox.find( ".spinbox-input" ).val( 5 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 6, "spinbox rounds up to step when appropriate" );

		$spinbox.find( ".spinbox-input" ).val( 7 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 6, "spinbox sets to step value when value is max value and is not multiple of step value and value is set by hand" );

		$spinbox.find( ".spinbox-input" ).val( -10000000000 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 3, "spinbox sets to step value when min value is less than step value and value is set by hand" );

		$spinbox.find( ".spinbox-input" ).val( 9999999999999 );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), 6, "spinbox sets to step value when value is max value and is not multiple of step value and value is set by hand" );

	} );

	QUnit.test( "should cycle when min or max values are reached", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			min: 1,
			max: 3,
			cycle: true
		} );

		$spinbox.spinbox( "step", true ); // 2
		$spinbox.spinbox( "step", true ); // 3
		$spinbox.spinbox( "step", true ); // 1
		$spinbox.spinbox( "step", true ); // 2
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox value cycled at max" );
		$spinbox.spinbox( "step", false ); // 1
		$spinbox.spinbox( "step", false ); // 3
		$spinbox.spinbox( "step", false ); // 2
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox value cycled at min" );
	} );

	QUnit.test( "spinbox should behave correctly when units are included", function testForUnits( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			min: -10,
			units: [ "px" ]
		} );

		$spinbox.spinbox( "value", 1 );
		assert.ok( $spinbox.spinbox( "value" ) === "1", "spinbox does not add units when units are enabled but not present in input; 1 === " + $spinbox.spinbox( "value" ) );

		$spinbox.spinbox( "value", "1px" );
		assert.ok( $spinbox.spinbox( "value" ) === "1px", "spinbox handles string with allowed unit; 1px === " + $spinbox.spinbox( "value" ) );

		$spinbox.spinbox( "step", true );
		assert.equal( $spinbox.spinbox( "value" ), "2px", "spinbox increments; " + $spinbox.spinbox( "value" ) + " === 2px" );

		$spinbox.spinbox( "step", false );
		assert.equal( $spinbox.spinbox( "value" ), "1px", "spinbox decrements; " + $spinbox.spinbox( "value" ) + " === 1px" );

		$spinbox.spinbox( "value", "2pp" );
		assert.equal( $spinbox.spinbox( "value" ), 2, "spinbox does not allow unsupported units; 2 === " + $spinbox.spinbox( "value" ) );

		$spinbox.find( ".spinbox-input" ).val( "4px" );
		$spinbox.find( ".spinbox-input" ).focusout();
		assert.equal( $spinbox.spinbox( "value" ), "4px", "spinbox updates string value on focus out with units present; 4px === " + $spinbox.spinbox( "value" ) );

	} );

	QUnit.test( "spinbox should add default unit if none is specified", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			units: [ "px" ],
			defaultUnit: "px"
		} );

		$spinbox.spinbox( "value", 1 );
		assert.ok( $spinbox.spinbox( "value" ) === "1px", "spinbox returned value with default unit" );

	} );

	QUnit.test( "spinbox should NOT add default unit if it is not an allowed unit", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			units: [ "px" ],
			defaultUnit: "ouch"
		} );

		$spinbox.spinbox( "value", 1 );
		assert.ok( $spinbox.spinbox( "value" ) === "1", "spinbox returned value WITHOUT default unit; " + $spinbox.spinbox( "value" ) + " === 1" );

	} );

	QUnit.test( "spinbox should keep 3 character default unit when incremented", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinbox" ).spinbox( {
			units: [ "rem", "px", "%" ],
			step: 1, // Default, but explicit
			defaultUnit: "rem"
		} );

		$spinbox.spinbox( "value", 1 );
		$spinbox.spinbox( "step", true );
		assert.ok( $spinbox.spinbox( "value" ) === "2rem", "spinbox returned value with default unit" );

	} );

	QUnit.test( "spinbox should behave correctly when custom decimalMark is used", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinboxDecimal" ).spinbox( {
			value: "1,1",
			min: 0,
			max: 10,
			step: 0.1,
			decimalMark: ","
		} );

		$spinbox.spinbox( "value", "1" );
		assert.equal( $spinbox.spinbox( "value" ), "1", "spinbox returned expected number when there is was custom decimal mark; " + $spinbox.spinbox( "value" ) + " === 1" );

		$spinbox.spinbox( "step", true );
		assert.equal( $spinbox.spinbox( "value" ), "1,1", "spinbox increments; " + $spinbox.spinbox( "value" ) + " === 1,1" );

		$spinbox.spinbox( "step", false );
		assert.equal( $spinbox.spinbox( "value" ), "1", "spinbox decrements; " + $spinbox.spinbox( "value" ) + " === 1" );

	} );

	QUnit.test( "spinbox should allow retrieval of unadulterated number", function( assert ) {
		var $spinbox = $( html ).find( "#MySpinboxDecimal" ).spinbox( {
			value: "1,1",
			min: 0,
			max: 10,
			step: 0.1,
			decimalMark: ","
		} );

		$spinbox.spinbox( "value", "1" );
		assert.equal( $spinbox.spinbox( "getIntValue" ), 1, "spinbox returns expected integer; " + $spinbox.spinbox( "getIntValue" ) + " === 1" );

		$spinbox.spinbox( "value", "1,1" );
		assert.equal( $spinbox.spinbox( "getIntValue" ), 1.1, "spinbox returns expected float; " + $spinbox.spinbox( "value" ) + " === 1.1" );

		var $spinbox2 = $( html ).find( "#MySpinboxDecimal" ).spinbox( {
			value: "1.1",
			min: 0,
			max: 10,
			step: 0.1,
			decimalMark: "."
		} );

		$spinbox.spinbox( "value", "1" );
		assert.equal( $spinbox.spinbox( "getIntValue" ), 1, "spinbox returns expected integer; " + $spinbox.spinbox( "getIntValue" ) + " === 1" );

		$spinbox.spinbox( "value", "1.1" );
		assert.equal( $spinbox.spinbox( "getIntValue" ), 1.1, "spinbox returns expected float; " + $spinbox.spinbox( "value" ) + " === 1.1" );

	} );

	QUnit.test('spinbox should trigger change after using setValue', function (assert) {
		var ready = assert.async();
		var $spinbox = $(html).find('#MySpinboxDecimal').spinbox({
			value: '1'
		});

		$spinbox.spinbox('setValue', '2');

		$spinbox.on('changed.fu.spinbox', function () {
			assert.ok(true, 'spinbox triggers changed after input' );
			ready();
		});

		$spinbox.find('.spinbox-input').val(1);
		$spinbox.find('.spinbox-input').focusout();
	});

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#MySpinbox" );

		assert.equal( typeof( $el.spinbox( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
