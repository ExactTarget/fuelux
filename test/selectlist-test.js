/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/selectlist-markup.html!strip" );
	/* FOR DEV TESTING */

	//Var html = require('text!dev.html!strip');
	html = $( "<div>" + html + "</div>" );

	$( "body" ).append( html );

	require( "bootstrap" );
	require( "fuelux/selectlist" );

	QUnit.module( "Fuel UX Selectlist" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().selectlist, "selectlist method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist();
		assert.ok( $selectlist.selectlist() === $selectlist, "selectlist should be initialized" );
	} );

	QUnit.test( "should autosize correctly", function( assert ) {
		var $selectlist8 = $( "body" ).find( "#MySelectlist8" ).selectlist();
		var $selectlist9 = $( "body" ).find( "#MySelectlist9" ).selectlist();
		var $btn, minWidth;

		//Measure all children of selectlist to be tested (add them all to a span and see how wide the span is) and make sure the selectlist is actually big enough to fit that
		$btn = $selectlist8.find( "button.dropdown-toggle" );
		var $textLengthTester = $( '<span id="textLengthTester" style="display:inline-block;"></span>' ).appendTo( "body" );
		$selectlist8.find( "li" ).each( function( index, element ) {

			//Set the p tag right/left padding to that of the selectlist button right/left padding
			$( '<p style="padding: 0 ' + $btn.css( "padding-right" ) + " 0 " + $btn.css( "padding-left" ) + ';">' + $( element ).text() + "</p>" ).appendTo( $textLengthTester );
		} );
		minWidth = $textLengthTester.width();
		assert.ok( ( $selectlist8.width() >= minWidth ), "selectlist autoresized to " + $selectlist8.width() + " should be greater than " + minWidth );

		//Hidden selectlists have no size
		assert.ok( $selectlist9.width() === 0, "selectlist hidden, sized 0" );

		//Remove hidden to prepare to measure its new size
		$selectlist9.removeClass( "hidden" );

		//Measure all children of selectlist to be tested (add them all to a span and see how wide the span is) and make sure the selectlist is actually big enough to fit that
		$btn = $selectlist9.find( "button.dropdown-toggle" );
		$textLengthTester = $( '<span id="textLengthTester" style="display:inline-block;"></span>' ).appendTo( "body" );
		$selectlist9.find( "li" ).each( function( index, element ) {

			//Set the p tag right/left padding to that of the selectlist button right/left padding
			$( '<p style="padding: 0 ' + $btn.css( "padding-right" ) + " 0 " + $btn.css( "padding-left" ) + ';">' + $( element ).text() + "</p>" ).appendTo( $textLengthTester );
		} );
		minWidth = $textLengthTester.width();
		assert.ok( ( $selectlist9.width() >= minWidth ), "selectlist was hidden, now shown, sized " + $selectlist9.width() + " should be greater than " + minWidth );
	} );

	QUnit.test( "should disable itself if empty", function( assert ) {
		var $selectlist = $( html ).find( "#selectlistEmpty" ).selectlist( {
			emptyLabelHTML: '<li data-value=""><a href="#">I am feeling so empty</a></li>'
		} );
		assert.equal( $selectlist.find( ".btn" ).hasClass( "disabled" ), true, "element disabled" );
		assert.equal( $selectlist.find( ".selected-label" ).html(), "I am feeling so empty", "custom emptyLabelHTML set as label" );
		assert.equal( $selectlist.selectlist( "selectedItem" ).text, "I am feeling so empty", "selectedItem returns correct text" );
		assert.equal( $selectlist.selectlist( "selectedItem" ).value, "", "selectedItem returns correct value" );
	} );

	QUnit.test( "should set disabled state", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist();
		$selectlist.selectlist( "disable" );
		assert.equal( $selectlist.find( ".btn" ).hasClass( "disabled" ), true, "element disabled" );
	} );

	QUnit.test( "should set enabled state", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist();
		$selectlist.selectlist( "disable" );
		$selectlist.selectlist( "enable" );
		assert.equal( $selectlist.find( ".btn" ).hasClass( "disabled" ), false, "element enabled" );
	} );

	QUnit.test( "should set default selection", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist2" ).selectlist(); //.selectlist();
		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Two", value: 2 };
		assert.deepEqual( item, expectedItem, "default item selected" );
	} );

	QUnit.test( "should select by index", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist3" ).selectlist();
		$selectlist.selectlist( "selectByIndex", 0 );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "One", value: 1 };
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should select by value", function( assert ) {
		var $selectlist = $( html.find( "#MySelectlist4" ).selectlist() ); //.selectlist();
		$selectlist.selectlist( "selectByValue", 2 );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Two", value: 2 }; //Weird
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should alias getValue", function( assert ) {
		var $selectlist = $( html.find( "#MySelectlist4" ).selectlist() ); //.selectlist();
		$selectlist.selectlist( "selectByValue", 2 );

		var item1 = $selectlist.selectlist( "selectedItem" );
		var item2 = $selectlist.selectlist( "getValue" );
		assert.deepEqual( item1, item2, "getValue aliases selectedItem" );
	} );

	QUnit.test( "should select by value with whitespace", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist5" ).selectlist();
		$selectlist.selectlist( "selectByValue", "Item Five" );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Item Five", value: "Item Five" }; //Weird
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should select by text", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist6" ).selectlist();
		$selectlist.selectlist( "selectByText", "THREE" );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Three", value: 3 };
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should select by text with whitespace", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist();
		$selectlist.selectlist( "selectByText", "Item Five" );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Item Five", value: "Item Five" };
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should select by selector", function( assert ) {
		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist();
		$selectlist.selectlist( "selectBySelector", "li[data-fizz=buzz]" );

		var item = $selectlist.selectlist( "selectedItem" );
		var expectedItem = { selected: true, text: "Buzz", value: 4, foo: "bar", fizz: "buzz" };
		assert.deepEqual( item, expectedItem, "item selected" );
	} );

	QUnit.test( "should fire change event", function( assert ) {
		var eventFired = false;
		var selectedText = "";
		var selectedValue = "";

		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist().on( "changed.fu.selectlist", function( evt, data ) {
			eventFired = true;
			selectedText = data.text;
			selectedValue = data.value;
		} );

		// Simulate changed event
		$selectlist.find( ".dropdown-menu a:first" ).click();

		assert.equal( eventFired, true, "change event fired" );
		assert.equal( selectedText, "One", "text passed in from change event" );
		assert.equal( selectedValue, 1, "value passed in from change event" );
	} );

	QUnit.test( "should not fire changed event on disabled items", function( assert ) {
		var eventFired = false;
		var selectedText = "";
		var selectedValue = "";

		var $selectlist = $( html ).find( "#MySelectlist" ).selectlist().on( "changed.fu.selectlist", function( evt, data ) {
			eventFired = true;
			selectedText = data.text;
			selectedValue = data.value;
		} );

		// Disable menu item then simulate changed event
		$selectlist.find( "li:first" ).addClass( "disabled" )
			.find( "a" ).click();

		assert.equal( eventFired, false, "changed event not fired" );
		assert.equal( selectedText, "", "text not changed" );
		assert.equal( selectedValue, "", "value not changed" );
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#MySelectlist" ).selectlist();

		assert.equal( typeof( $el.selectlist( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

} );
