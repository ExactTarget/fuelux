/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( "jquery" );
	var html = require( "text!test/markup/pillbox-markup.html!strip" );

	require( "bootstrap" );
	require( "fuelux/pillbox" );

	QUnit.module( "Fuel UX Pillbox" );

	QUnit.test( "should be defined on jquery object", function( assert ) {
		assert.ok( $().find( "#MyPillbox" ).pillbox, "pillbox method is defined" );
	} );

	QUnit.test( "should return element", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" );
		assert.ok( $pillbox.pillbox() === $pillbox, "pillbox is initialized" );
	} );

	QUnit.test( "should behave as designed", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();

		assert.equal( $pillbox.pillbox( "items" ).length, 5, "pillbox returns both items" );

		$pillbox.find( "li > span:last" ).click();

		assert.equal( $pillbox.pillbox( "items" ).length, 4, "pillbox removed an item" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "Item 1",
			value: "foo"
		}, "pillbox returns item data" );
	} );

	QUnit.test( "getValue alias should function", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();

		assert.deepEqual( $pillbox.pillbox( "items" ), $pillbox.pillbox( "getValue" ), "getValue aliases items" );
	} );

	QUnit.test( "Input functionality should behave as designed", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.val( "three-value" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );

		assert.deepEqual( $pillbox.pillbox( "items" )[ 5 ], {
			text: "three-value",
			value: "three-value"
		}, "pillbox returns added item" );
	} );

	QUnit.test( "Input functionality should, by default, not allow empty pills", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.val( "," );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );

		assert.equal( $pillbox.pillbox( "items" ).length, 5, "no item added" );
	} );

	QUnit.test( "Input functionality should allow empty pills if allowEmptyPills is set to true", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox( {
			allowEmptyPills: true
		} );
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.val( "," );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );

		assert.equal( $pillbox.pillbox( "items" ).length, 6, "item added" );
	} );

	QUnit.test( "Input functionality should encode < character", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.val( "<" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );

		assert.equal( $pillbox.pillbox( "items" ).pop().text, "&lt;", "converted to &lt;" );
	} );

	QUnit.test( "Input functionality should protect against XSS", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.val( '<video/src="x"onloadstart="prompt()"> ' );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );

		assert.equal( $pillbox.pillbox( "items" ).pop().text, '&lt;video/src="x"onloadstart="prompt()"&gt; ', 'converted to &lt;video/src="x"onloadstart="prompt()"&gt; ' );
	} );

	QUnit.test( "itemCount function", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillboxEmpty" ).pillbox();

		assert.equal( $pillbox.pillbox( "itemCount" ), 0, "itemCount on empty pillbox" );

		$pillbox = $( html ).find( "#MyPillbox" ).pillbox();

		assert.equal( $pillbox.pillbox( "itemCount" ), 5, "itemCount on pillbox with 5 items" );
	} );

	QUnit.test( "addItems/removeItems functions", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillboxEmpty" ).pillbox();

		assert.equal( $pillbox.pillbox( "itemCount" ), 0, "pillbox is initially empty" );

		$pillbox.pillbox( "addItems",
			{
				text: "Item 1",
				value: 1,
				attr: {
					"cssClass": "example-pill-class",
					"style": "background-color: #0000FF",
					"data-example-attribute": true
				}
			} );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ],
			{
				text: "Item 1",
				value: 1,
				"exampleAttribute": true
			},
			"single item added has correct text, value, and data" );

		$pillbox.pillbox( "addItems", {
			text: "Item 2",
			value: 2
		} );
		$pillbox.pillbox( "removeItems" );
		assert.equal( $pillbox.pillbox( "items" ).length, 0, "removedItems removed all items" );

		$pillbox.pillbox( "addItems", {
			text: "Item 1",
			value: 1
		}, {
				text: "Item 2",
				value: 2
			} );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 1 ], {
			text: "Item 2",
			value: 2
		}, "multiple items have been added correctly" );

		$pillbox.pillbox( "removeItems" );

		$pillbox.pillbox( "addItems", [ {
			text: "Item 1",
			value: 1
			}, {
			text: "Item 2",
			value: 2
			}, {
			text: "Item 3",
			value: 3
		} ] );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 2 ], {
			text: "Item 3",
			value: 3
		}, "multiple items have been added correctly by array" );

		$pillbox.pillbox( "removeItems", 2, 1 );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 1 ], {
			text: "Item 3",
			value: 3
		}, "single item has been removed at the correct index" );
		$pillbox.pillbox( "removeItems", 1 );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "Item 3",
			value: 3
		}, "single item has been removed at the correct index" );
	} );

	QUnit.test( "removeByValue function", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();

		assert.equal( $pillbox.pillbox( "itemCount" ), 5, "pillbox has 7 items initially" );

		$pillbox.pillbox( "removeByValue", "foo" );

		assert.equal( $pillbox.pillbox( "itemCount" ), 4, "pillbox has 1 item after removeByValue" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "Item 2"
		}, "item not removed has correct text and value" );
	} );

	QUnit.test( "removeByText function", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox();

		assert.equal( $pillbox.pillbox( "itemCount" ), 5, "pillbox has 7 items initially" );

		$pillbox.pillbox( "removeByText", "Item 2" );

		assert.equal( $pillbox.pillbox( "itemCount" ), 4, "pillbox has 1 item after removeByText" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "Item 1",
			value: "foo"
		}, "item not removed has correct text and value" );
	} );

	QUnit.test( "all user defined methods work as expected", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox( {
			onAdd: function( data, callback ) {
				callbackTriggers++;
				callback( data );
			},
			onKeyDown: function( data, callback ) {
				callbackTriggers++;
				callback( {
					data: [
						{
							text: "Item 3",
							value: "three-value"
						}
					]
				} );
			},
			onRemove: function( data, callback ) {
				callbackTriggers++;
				callback( data );
			}
		} );
		var $input = $pillbox.find( ".pillbox-add-item" );
		var callbackTriggers = 0;

		$input.val( "anything" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) ); //Enter
		assert.equal( callbackTriggers, 1, "onAdd triggered correctly" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 2 ], {
			text: "Item 3",
			value: "three-value"
		}, "item correctly added after onAdd user callback" );

		$input.trigger( $.Event( "keydown", {
			keyCode: 97
		} ) ); // Number 1
		assert.equal( callbackTriggers, 2, "onKeyDown triggered correctly" );

		$pillbox.find( "> li > .glyphicon-close" ).click();
		assert.equal( callbackTriggers, 2, "onRemove triggered correctly" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 2 ], {
			text: "Item 3",
			value: "three-value"
		}, "item correctly added after onAdd user callback" );

	} );

	QUnit.test( "Suggestions functionality should behave as designed", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillboxEmpty" ).pillbox( {
			onKeyDown: function( data, callback ) {
				callback( {
					data: [
						{
							text: "Acai",
							value: "acai"
						},
						{
							text: "African cherry orange",
							value: "african cherry orange"
						},
						{
							text: "Banana",
							value: "banana"
						},
						{
							text: "Bilberry",
							value: "bilberry"
						},
						{
							text: "Cantaloupe",
							value: "cantaloupe"
						},
						{
							text: "Ceylon gooseberry",
							value: "ceylon gooseberry"
						},
						{
							text: "Dragonfruit",
							value: "dragonfruit"
						},
						{
							text: "Dead Man's Fingers",
							value: "dead man's fingers"
						},
						{
							text: "Fig",
							value: "fig"
						},
						{
							text: "Forest strawberries",
							value: "forest strawberries"
						},
						{
							text: "Governor’s Plum",
							value: "governor’s plum"
						},
						{
							text: "Grapefruit",
							value: "grapefruit"
						},
						{
							text: "Guava",
							value: "guava"
						},
						{
							text: "Honeysuckle",
							value: "honeysuckle"
						},
						{
							text: "Huckleberry",
							value: "huckleberry"
						},
						{
							text: "Jackfruit",
							value: "jackfruit"
						},
						{
							text: "Japanese Persimmon",
							value: "japanese persimmon"
						},
						{
							text: "Key Lime",
							value: "key lime"
						},
						{
							text: "Kiwi",
							value: "kiwi"
						},
						{
							text: "Lemon",
							value: "lemon"
						},
						{
							text: "Lillypilly",
							value: "lillypilly"
						},
						{
							text: "Mandarin",
							value: "mandarin"
						},
						{
							text: "Miracle Fruit",
							value: "miracle fruit"
						},
						{
							text: "Orange",
							value: "orange"
						},
						{
							text: "Oregon grape",
							value: "oregon grape"
						},
						{
							text: "Persimmon",
							value: "persimmon"
						},
						{
							text: "Pomegranate",
							value: "pomegranate"
						},
						{
							text: "Rhubarb",
							value: "rhubarb"
						},
						{
							text: "Rose hip",
							value: "rose hip"
						},
						{
							text: "Soursop",
							value: "soursop"
						},
						{
							text: "Starfruit",
							value: "starfruit"
						},
						{
							text: "Tamarind",
							value: "tamarind"
						},
						{
							text: "Thimbleberry",
							value: "thimbleberry"
						},
						{
							text: "Wineberry",
							value: "wineberry"
						},
						{
							text: "Wongi",
							value: "wongi"
						},
						{
							text: "Youngberry",
							value: "youngberry"
						}
					]
				} );
			}
		} );
		var $input = $pillbox.find( ".pillbox-add-item" );

		$input.trigger( $.Event( "keydown", {
			keyCode: 97
		} ) ); // Numpad 1
		$pillbox.find( ".suggest > li" ).trigger( "mousedown" );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "Acai",
			value: "acai"
		}, "pillbox returns item added after user clicks suggestion" );

		$input.val( "" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 97
		} ) ); // Numpad 1
		$input.trigger( $.Event( "keydown", {
			keyCode: 40
		} ) ); // Down
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) ); // Enter
		assert.deepEqual( $pillbox.pillbox( "items" )[ 1 ], {
			text: "Acai",
			value: "acai"
		}, "pillbox returns item added after user keys down to suggestions" );

		$input.val( "" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 97
		} ) ); // Numpad 1
		$input.trigger( $.Event( "keydown", {
			keyCode: 38
		} ) ); // Up
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) ); // Enter

		assert.deepEqual( $pillbox.pillbox( "items" )[ 2 ], {
			text: "Acai",
			value: "acai"
		}, "pillbox returns item added after user keys up to suggestion" );

		$input.val( "" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 97
		} ) ); // Numpad 1
		$input.trigger( $.Event( "keydown", {
			keyCode: 9
		} ) ); // Tab
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) ); // Enter
		assert.deepEqual( $pillbox.pillbox( "items" )[ 3 ], {
			text: "Acai",
			value: "acai"
		}, "pillbox returns item added after user tabs down to suggestion" );

		assert.equal( $pillbox.pillbox( "items" ).length, 4, "pillbox removed an item" );
	} );

	QUnit.test( "Edit functionality should behave as designed", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox( {
			edit: true
		} );
		var $ul = $pillbox.find( ".pill-group" );
		var $input = $pillbox.find( ".pillbox-add-item" );

		$pillbox.find( ".pill-group > li:first span:first" ).click();
		assert.equal( $ul.children().eq( 0 ).hasClass( "pillbox-input-wrap" ), true, "pillbox item enters edit mode" );

		$input.trigger( "blur" );
		assert.equal( $ul.children().eq( 0 ).hasClass( "pillbox-input-wrap" ), false, "pillbox item exits edit mode" );

		$pillbox.find( ".pill-group > li:first span:first" ).click();
		$input.val( "test edit" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );
		assert.deepEqual( $pillbox.pillbox( "items" )[ 0 ], {
			text: "test edit",
			value: "test edit"
		}, "pillbox item was able to be edited" );
	} );

	QUnit.test( "Triggers behave as designed", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillbox" ).pillbox( {
			edit: true
		} );
		var $input = $pillbox.find( ".pillbox-add-item" );

		$pillbox.on( "clicked.fu.pillbox", function( ev, item ) {
			assert.deepEqual( item, {
				text: "Item 1",
				value: "foo"
			}, "clicked event is triggered" );
		} );
		$pillbox.find( "> ul > li:first span:first" ).click();
		$pillbox.off( "clicked.fu.pillbox" );

		$pillbox.on( "added.fu.pillbox", function( ev, item ) {
			assert.deepEqual( item, {
				text: "added test",
				value: "added test"
			}, "added event is triggered" );
		} );
		$input.val( "added test" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );
		$pillbox.off( "added.fu.pillbox" );

		$pillbox.on( "removed.fu.pillbox", function( ev, item ) {
			assert.deepEqual( item, {
				text: "added test",
				value: "added test"
			}, "removed event is triggered" );
		} );
		$pillbox.find( "> ul > li:first > span:last" ).click();
		$pillbox.off( "removed.fu.pillbox" );

		$pillbox = $( html ).pillbox( {
			edit: true
		} );
		$pillbox.on( "edited.fu.pillbox", function( ev, item ) {
			assert.deepEqual( item, {
				text: "edit test",
				value: "edit test"
			}, "edit event is triggered" );
		} );
		$pillbox.find( "> ul > li:first" ).click();
		$input.val( "edit test" );
		$input.trigger( $.Event( "keydown", {
			keyCode: 13
		} ) );
	} );

	QUnit.test( "Readonly behaves as designed", function( assert ) {
		var $pillbox;

		$pillbox = $( html ).find( "#MyPillbox" );
		$pillbox.attr( "data-readonly", "readonly" );
		$pillbox.pillbox();
		$pillbox.find( ".pill:last > span:last" ).click();
		assert.equal( $pillbox.pillbox( "items" ).length, 5, "pillbox correctly in readonly mode via data api" );

		$pillbox = $( html ).find( "#MyPillbox" );
		$pillbox.pillbox( {
			readonly: true
		} );
		$pillbox.find( ".pill:last > span:last" ).click();
		assert.equal( $pillbox.pillbox( "items" ).length, 5, "pillbox correctly in readonly mode via init option" );

		$pillbox.pillbox( "readonly", false );
		$pillbox.find( ".pill:last > span:last" ).click();
		assert.equal( $pillbox.pillbox( "items" ).length, 4, "pillbox readonly mode disabled via method as appropriate" );

		$pillbox.pillbox( "readonly", true );
		$pillbox.find( ".pill:last > span:last" ).click();
		assert.equal( $pillbox.pillbox( "items" ).length, 4, "pillbox readonly mode enabled via method as appropriate" );
	} );

	//TODO: how can I test this one properly? O.o
	QUnit.test( "Truncate behaves as designed", function( assert ) {
		var $pillbox;

		$pillbox = $( html ).find( "#MyPillbox" );
		$pillbox.width( 100 );
		$( "body" ).append( $pillbox );
		$pillbox.pillbox( {
			readonly: true,
			truncate: true
		} );
		assert.equal( $pillbox.find( ".pill.truncated" ).length, 5, "pillbox truncate functioning correctly while in readonly" );

		$pillbox.pillbox( "readonly", false );
		assert.equal( $pillbox.find( ".pill.truncated" ).length, 0, "pillbox truncate not enabled while not readonly" );
		$pillbox.remove();
	} );

	QUnit.test( "should destroy control", function( assert ) {
		var $el = $( html ).find( "#MyPillbox" );

		assert.equal( typeof ( $el.pillbox( "destroy" ) ), "string", "returns string (markup)" );
		assert.equal( $el.parent().length, false, "control has been removed from DOM" );
	} );

	QUnit.test( "should add a pill on blur event if input is not empty", function( assert ) {
		var $pillbox = $( html ).find( "#MyPillboxEmpty" ).pillbox();
		var $input = $pillbox.find( ".pillbox-add-item" );

		assert.equal( $pillbox.pillbox( "itemCount" ), 0, "pillbox is empty to start" );

		$input.val('');
		$input.blur();
		assert.equal( $pillbox.pillbox( "itemCount" ), 0, "pillbox remains empty" );

		$input.val('testing');
		$input.blur();
		assert.equal( $pillbox.pillbox( "itemCount" ), 1, "pillbox has one item" );
	} );
	
} );

