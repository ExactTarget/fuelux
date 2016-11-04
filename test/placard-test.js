/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/placard-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/placard" );

	QUnit.module( "Fuel UX Placard" );

	// TODO: add shown/hidden event test

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().find( "#placard1" ).placard(), "placard method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $placard = $( html ).find( "#placard1" );
		assert.ok( $placard.placard() === $placard, "placard should be initialized" );
	} );

	QUnit.test( "should behave as expected - input", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$( "body" ).append( $placard );
		$placard.placard();
		$placard.on( "cancelled.fu.placard", function( e, helpers ) {
			assert.ok( 1 === 1, "default action event (cancel) triggered upon external click" );
		} );

		$placard.find( "input" ).focus().focus();
		assert.equal( $placard.hasClass( "showing" ), true, "placard shows when appropriate" );

		$( "body" ).click();
		assert.equal( $placard.hasClass( "showing" ), false, "placard hides when appropriate" );
		$placard.remove();
	} );

	QUnit.test( "should behave as expected - textarea", function( assert ) {
		var $placard = $( html ).find( "#placard2" );

		$placard.placard();
		$placard.on( "cancelled.fu.placard", function( e, helpers ) {
			assert.ok( 1 === 1, "default action event (cancel) triggered upon external click" );
		} );
		$( "body" ).append( $placard );

		$placard.find( "textarea" ).focus().focus();
		assert.equal( $placard.hasClass( "showing" ), true, "placard shows when appropriate" );

		$( "body" ).click();
		assert.equal( $placard.hasClass( "showing" ), false, "placard hides when appropriate" );
		$placard.remove();
	} );

	QUnit.test( "should behave as expected - contenteditable div", function( assert ) {
		var $placard = $( html ).find( "#placard3" );

		$placard.placard();
		$placard.on( "cancelled.fu.placard", function( e, helpers ) {
			assert.ok( 1 === 1, "default action event (cancel) triggered upon external click" );
		} );
		$( "body" ).append( $placard );

		$placard.find( ".placard-field" ).focus().focus();
		assert.equal( $placard.hasClass( "showing" ), true, "placard shows when appropriate" );

		$( "body" ).click();
		assert.equal( $placard.hasClass( "showing" ), false, "placard hides when appropriate" );
		$placard.remove();
	} );

	QUnit.test( "show/hide functions should behave as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );
		$placard.placard();

		$placard.placard( "show" );
		assert.equal( $placard.hasClass( "showing" ), true, "placard shows when appropriate" );

		$placard.placard( "hide" );
		assert.equal( $placard.hasClass( "showing" ), false, "placard hides when appropriate" );
	} );

	QUnit.test( "trigger events should fire as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.placard();
		$placard.on( "accepted.fu.placard", function( e, helpers ) {
			assert.ok( 1 === 1, "accept event triggers on accept" );
			assert.equal( typeof e, "object", "event object passed in accept event" );
			assert.equal( typeof helpers, "object", "helpers object passed in accept event" );
			assert.equal( ( helpers.previousValue !== undefined && helpers.value !== undefined ), true, "helpers object contains correct attributes" );
		} );
		$placard.on( "cancelled.fu.placard", function( e, helpers ) {
			assert.ok( 1 === 1, "cancel event triggers on cancel" );
			assert.equal( typeof e, "object", "event object passed in cancel event" );
			assert.equal( typeof helpers, "object", "helpers object passed in cancel event" );
			assert.equal( ( helpers.previousValue !== undefined && helpers.value !== undefined ), true, "helpers object contains correct attributes" );
		} );

		$placard.find( "input" ).focus().focus();
		$placard.find( ".placard-cancel" ).click();
		$placard.find( "input" ).focus().focus();
		$placard.find( ".placard-accept" ).click();
	} );

	QUnit.test( "onAccept function should be called as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.placard( {
			onAccept: function( helpers ) {
				assert.ok( 1 === 1, "onAccept function called on accept" );
				assert.equal( typeof helpers, "object", "helpers object passed to onAccept function" );
				assert.equal( ( helpers.previousValue !== undefined && helpers.value !== undefined ), true, "helpers object contains correct attributes" );
				$placard.placard( "hide" );
			}
		} );

		$placard.find( "input" ).focus().focus();
		$placard.find( ".placard-accept" ).click();
	} );

	QUnit.test( "onCancel function should be called as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.placard( {
			onCancel: function( helpers ) {
				assert.ok( 1 === 1, "onCancel function called on cancel" );
				assert.equal( typeof helpers, "object", "helpers object passed to onCancel function" );
				assert.equal( ( helpers.previousValue !== undefined && helpers.value !== undefined ), true, "helpers object contains correct attributes" );
				$placard.placard( "hide" );
			}
		} );

		$placard.find( "input" ).focus().focus();
		$placard.find( ".placard-cancel" ).click();
	} );

	QUnit.test( "Enter and exit keys should trigger appropriate response", function( assert ) {
		var $placard = $( html ).find( "#placard1" );
		var $input  = $placard.find( "input" );
		var e = $.Event( "keydown" );

		$placard.placard( {
			onAccept: function() {
				assert.ok( 1 === 1, "onAccept function called when enter keypress" );
			},
			onCancel: function() {
				assert.ok( 1 === 1, "onCancel function called when exit keypress" );
			}
		} );

		e.keyCode = 13;
		$input.trigger( e );
		e.keyCode = 27;
		$input.trigger( e );
	} );

	QUnit.test( "externalClickAction option should work as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.placard( {
			externalClickAction: "accepted"
		} );

		$placard.find( "input" ).focus().focus().val( "test" );
		$( "body" ).click();
		assert.equal( $placard.find( "input" ).val(), "test", "desired externalClickAction triggered on external click" );
	} );

	QUnit.test( "externalClickExceptions option should work as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$( "body" ).append( '<div class=".test"><div class=".innerTest"></div></div><div id="test"></div>' );
		$( "body" ).append( $placard );
		$placard.placard( {
			externalClickExceptions: [ ".test", "#test" ]
		} );

		$placard.find( "input" ).focus().focus();
		$( "#test" ).click();
		assert.equal( $placard.hasClass( "showing" ), true, "externalClick ignored for specified id" );
		$( ".test" ).click();
		assert.equal( $placard.hasClass( "showing" ), true, "externalClick ignored for specified class" );
		$( ".innerTest" ).click();
		assert.equal( $placard.hasClass( "showing" ), true, "externalClick ignored for child of specified selector" );

		$placard.remove();
		$( ".test,#test" ).remove();
	} );

	QUnit.test( "explicit option should work as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$( "body" ).append( $placard );
		$placard.placard( {
			explicit: true
		} );

		$placard.find( "input" ).focus().focus();
		$( "body" ).click();
		assert.equal( $placard.hasClass( "showing" ), true, "externalClick ignored due to not being an explicit accept/cancel action" );
		$placard.find( ".placard-accept" ).click();
		assert.equal( $placard.hasClass( "showing" ), false, "placard not showing after explicit action" );

		$placard.remove();
	} );

	QUnit.test( "revertOnCancel option should work as expected", function( assert ) {
		var $placard;

		var setup = function( revert ) {
			$placard = $( html ).find( "#placard1" );
			$( "body" ).append( $placard );
			$placard.find( "input" ).val( "test" );
			$placard.placard( {
				revertOnCancel: revert
			} );
			$placard.find( "input" ).focus().focus().val( "blah blah blah" );
			$placard.find( ".placard-cancel" ).click();
		};

		setup( true );
		assert.equal( $placard.find( "input" ).val(), "test", "value reverted when set to true" );
		$placard.remove();

		setup( false );
		assert.equal( $placard.find( "input" ).val(), "blah blah blah", "value not reverted when set to false" );
		$placard.remove();
	} );

	QUnit.test( "getValue method should function as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.find( "input" ).val( "test" );
		$placard.placard();

		assert.equal( $placard.placard( "getValue" ), "test", "getValue working as expected" );
	} );

	QUnit.test( "setValue method should function as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );

		$placard.find( "input" ).val( "test" );
		$placard.placard();

		$placard.placard( "setValue", "bloop" );
		assert.equal( $placard.placard( "getValue" ), "bloop", "setValue working as expected" );
	} );

	QUnit.test( "should disable/enable as expected", function( assert ) {
		var $placard = $( html ).find( "#placard1" );
		var $field = $placard.find( ".placard-field" );

		$placard.placard( "disable" );
		assert.equal( $placard.hasClass( "disabled" ), true, "disabled class properly added to element" );
		assert.equal( $field.attr( "disabled" ), "disabled", "disabled attribute properly added to field" );

		$placard.placard( "enable" );
		assert.equal( $placard.hasClass( "disabled" ), false, "disabled class properly removed from element" );
		assert.equal( $field.attr( "disabled" ), undefined, "disabled attribute properly removed from field" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#placard1" );

		assert.equal( typeof( $el.placard( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
