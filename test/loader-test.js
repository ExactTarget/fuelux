/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/loader-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/loader" );

	QUnit.module( "Fuel UX Loader" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().loader(), "loader method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $loader = $( html );
		assert.ok( $loader.loader() === $loader, "loader is initialized" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html );

		assert.equal( typeof( $el.loader( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
