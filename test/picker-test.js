/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/picker-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/picker" );

	QUnit.module( "Fuel UX Picker" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().find( "#picker1" ).picker(), "picker method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $picker = $( html ).find( "#picker1" );
		assert.ok( $picker.picker() === $picker, "picker should be initialized" );
	} );

	QUnit.test( "should show and hide as expected - input", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		$( "body" ).append( $picker );
		$picker.picker();

		var cancelledDone = assert.async();
		var allDone = assert.async();

		var $textInputTrigger = $( $picker.find( ".picker-trigger" )[ 0 ] );
		var $otherTrigger = $( $picker.find( ".picker-trigger" )[ 1 ] );
		$textInputTrigger.focus().focus();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );

		$picker.one( "exited.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "default action event (exited) triggered upon external click" );
			cancelledDone();
		} );

		$( "body" ).click();

		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );

		$textInputTrigger.click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );

		$textInputTrigger.click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker continues showing when text input clicked and picker is already showing" );

		$otherTrigger.click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when non-text input clicked and picker is already showing" );

		$picker.remove();
		allDone();
	} );

	QUnit.test( "should behave as expected - button", function( assert ) {
		var $picker = $( html ).find( "#picker2" );
		$( "body" ).append( $picker );
		$picker.picker();

		var cancelledDone = assert.async();
		var allDone = assert.async();
		$picker.one( "exited.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "default action event (exited) triggered upon external click" );
			cancelledDone();
		} );

		$( $picker.find( ".picker-trigger" )[ 1 ] ).click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );

		$( "body" ).click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );
		$picker.remove();

		allDone();
	} );

	QUnit.test( "show/hide functions should behave as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );
		$( "body" ).append( $picker );
		$picker.picker();

		var shownDone = assert.async();
		var hiddenDone = assert.async();
		var allDone = assert.async();

		$picker.one( "shown.fu.picker", function( e ) {
			assert.ok( 1 === 1, "shown event triggers on show" );
			assert.equal( typeof e, "object", "event object passed in shown event" );
			shownDone();
		} );
		$picker.one( "hidden.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "hidden event triggers on hide" );
			assert.equal( typeof e, "object", "event object passed in hidden event" );
			hiddenDone();
		} );

		$picker.picker( "show" );
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );

		$picker.picker( "hide" );
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );

		allDone();

		$picker.remove();
	} );

	QUnit.test( "trigger events should fire as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		$( "body" ).append( $picker );
		$picker.picker();

		var acceptedDone = assert.async();
		var cancelledDone = assert.async();
		var exitedDone = assert.async();
		var allDone = assert.async();

		$picker.one( "accepted.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "accept event triggers on accept" );
			assert.equal( typeof e, "object", "event object passed in accept event" );
			assert.equal( typeof helpers, "object", "helpers object passed in accept event" );
			assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
			acceptedDone();
		} );
		$picker.one( "cancelled.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "cancel event triggers on cancel" );
			assert.equal( typeof e, "object", "event object passed in cancel event" );
			assert.equal( typeof helpers, "object", "helpers object passed in cancel event" );
			assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
			cancelledDone();
		} );
		$picker.on( "exited.fu.picker", function( e, helpers ) {
			assert.ok( 1 === 1, "exit event triggers on exit" );
			assert.equal( typeof e, "object", "event object passed in exit event" );
			assert.equal( typeof helpers, "object", "helpers object passed in exit event" );
			assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
			exitedDone();
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );
		$picker.find( ".picker-cancel" ).click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );
		$picker.find( ".picker-trigger" )[ 0 ].click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );
		$picker.find( ".picker-accept" ).click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );
		$picker.find( ".picker-trigger" )[ 0 ].click();
		assert.equal( $picker.hasClass( "showing" ), true, "picker shows when appropriate" );
		$( "body" ).click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker hides when appropriate" );
		allDone();

		$picker.remove();
	} );

	QUnit.test( "onAccept function should be called as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		var acceptedDone = assert.async();
		$picker.picker( {
			onAccept: function( helpers ) {
				assert.ok( 1 === 1, "onAccept function called on accept" );
				assert.equal( typeof helpers, "object", "helpers object passed to onAccept function" );
				assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
				$picker.picker( "hide" );
				acceptedDone();
			}
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		$picker.find( ".picker-accept" ).click();
	} );

	QUnit.test( "onCancel function should be called as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		var cancelledDone = assert.async();
		$picker.picker( {
			onCancel: function( helpers ) {
				assert.ok( 1 === 1, "onCancel function called on cancel" );
				assert.equal( typeof helpers, "object", "helpers object passed to onCancel function" );
				assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
				$picker.picker( "hide" );
				cancelledDone();
			}
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		$picker.find( ".picker-cancel" ).click();
	} );

	QUnit.test( "onExit function should be called as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );
		$( "body" ).append( $picker );

		var exitedDone = assert.async();
		$picker.picker( {
			onExit: function( helpers ) {
				assert.ok( 1 === 1, "onExit function called on exit" );
				assert.equal( typeof helpers, "object", "helpers object passed to onExit function" );
				assert.equal( ( helpers.contents !== undefined ), true, "helpers object contains correct attributes" );
				$picker.picker( "hide" );
				exitedDone();
			}
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		$( "body" ).click();
	} );

	QUnit.test( "Enter and exit keys should trigger appropriate response", function( assert ) {
		var $picker = $( html ).find( "#picker1" );
		$( "body" ).append( $picker );

		var $input  = $( $picker.find( "input" )[ 0 ] );
		var e = $.Event( "keydown" );

		var acceptedDone = assert.async();
		var exitedDone = assert.async();
		$picker.picker( {
			onAccept: function( e ) {
				assert.ok( 1 === 1, "onAccept function called when enter keypress" );
				acceptedDone();
			},
			onExit: function() {
				assert.ok( 1 === 1, "onExit function called when exit keypress" );
				exitedDone();
			}
		} );

		e.keyCode = 13;
		$input.trigger( e );
		e.keyCode = 27;
		$input.trigger( e );

		$picker.remove();
	} );

	QUnit.test( "externalClickExceptions option should work as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		$( "body" ).append( '<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>' );
		$( "body" ).append( $picker );
		$picker.picker( {
			externalClickExceptions: [ ".test", "#test" ]
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		$( "#test" ).click();
		assert.equal( $picker.hasClass( "showing" ), true, "externalClick ignored for specified id" );
		$( ".test" ).click();
		assert.equal( $picker.hasClass( "showing" ), true, "externalClick ignored for specified class" );
		$( ".innerTest" ).click();
		assert.equal( $picker.hasClass( "showing" ), true, "externalClick ignored for child of specified selector" );

		$picker.remove();
		$( ".test,#test" ).remove();
	} );

	QUnit.test( "explicit option should work as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );

		$( "body" ).append( $picker );
		$picker.picker( {
			explicit: true
		} );

		$picker.find( ".picker-trigger" )[ 0 ].click();
		$( "body" ).click();
		assert.equal( $picker.hasClass( "showing" ), true, "externalClick ignored due to not being an explicit accept/cancel action" );
		$picker.find( ".picker-accept" ).click();
		assert.equal( $picker.hasClass( "showing" ), false, "picker not showing after explicit action" );

		$picker.remove();
	} );

	QUnit.test( "should disable/enable as expected", function( assert ) {
		var $picker = $( html ).find( "#picker1" );
		var $trigger = $picker.find( ".picker-trigger" );

		$picker.picker( "disable" );
		assert.equal( $picker.hasClass( "disabled" ), true, "disabled class properly added to element" );
		assert.equal( $trigger.attr( "disabled" ), "disabled", "disabled attribute properly added to trigger" );

		$picker.picker( "enable" );
		assert.equal( $picker.hasClass( "disabled" ), false, "disabled class properly removed from element" );
		assert.equal( $trigger.attr( "disabled" ), undefined, "disabled attribute properly removed from trigger" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#picker1" );

		assert.equal( typeof( $el.picker( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
