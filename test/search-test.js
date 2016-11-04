/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/search-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/search" );

	QUnit.module( "Fuel UX Search" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().search, "search method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $search = $( html );
		assert.ok( $search.search() === $search, "search has been initialized" );
	} );

	QUnit.test( "should ignore empty search", function( assert ) {
		var $search = $( html );

		$search.search();
		$search.find( "button" ).click();

		assert.equal( $search.find( ".glyphicon" ).attr( "class" ), "glyphicon glyphicon-search", "search icon has not changed" );
	} );

	QUnit.test( "should ignore disabled button click", function( assert ) {
		var $search = $( html );

		$search.find( "button" ).addClass( "disabled" );
		$search.search();

		$search.find( "input" ).val( "search text" );
		$search.find( "button" ).click();

		assert.equal( $search.find( ".glyphicon" ).attr( "class" ), "glyphicon glyphicon-search", "search icon has not changed" );
	} );

	QUnit.test( "should process valid search", function( assert ) {
		var $search = $( html );
		var searchText = "";

		$search.search().on( "searched.fu.search", function( e, text ) { searchText = text; } );

		$search.find( "input" ).val( "search text" );
		$search.find( "button" ).click();

		assert.equal( $search.find( ".glyphicon" ).attr( "class" ), "glyphicon glyphicon-remove", "search icon has changed" );
		assert.equal( searchText, "search text", "search text was provided in event" );
	} );

	QUnit.test( "should allow search to be cleared", function( assert ) {
		var $search = $( html );
		var clearedEventFired = false;

		$search.search().on( "cleared.fu.search", function( e, text ) { clearedEventFired = true; } );

		$search.find( "input" ).val( "search text" );
		$search.find( "button" ).click();
		$search.find( "button" ).click();

		assert.equal( $search.find( ".glyphicon" ).attr( "class" ), "glyphicon glyphicon-search", "search icon has returned" );
		assert.equal( $search.find( "input" ).val(), "", "search text has been cleared" );
		assert.equal( clearedEventFired, true, "cleared event was fired" );
	} );

	QUnit.test( "should correctly respond to disable and enable methods", function( assert ) {
		var $search = $( html );

		$search.search();
		$search.search( "disable" );

		assert.equal( $search.find( "input" ).attr( "disabled" ), "disabled", "input was disabled" );
		assert.equal( $search.find( "button" ).hasClass( "disabled" ), true, "button was disabled" );

		$search.search( "enable" );

		assert.equal( $search.find( "input" ).attr( "disabled" ), undefined, "input was enabled" );
		assert.equal( $search.find( "button" ).hasClass( "disabled" ), false, "button was enabled" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).search();

		assert.equal( typeof( $el.search( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
