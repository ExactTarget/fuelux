/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define( function comboboxTest ( require ) {
	var QUnit = require('qunit');
	var $ = require( 'jquery' );
	var jQuery = $;
	var originalHTML = require( 'text!test/markup/combobox-markup.html!strip' );
	/* FOR DEV TESTING - uncomment to test against index.html */

	require( 'bootstrap' );
	require( 'fuelux/combobox' );

	var html;

	QUnit.module( 'Fuel UX Combobox', {
		undefined: function ifUndefined () {
			html = null;
			html = $( '<div>' + originalHTML + '</div>' ).find( '#MyComboboxContainer' );
		},
		beforeEach: function beforeEach () {
			// Html = require('text!index.html!strip');
			html = $( '<div>' + originalHTML + '</div>' ).find( '#MyComboboxContainer' );
		}
	} );

	QUnit.test( 'should be defined on jquery object', function isJQuery ( assert ) {
		assert.ok( $().combobox, 'combobox method is defined' );
	} );

	QUnit.test( 'should return element', function returnsElement ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' );
		assert.ok( $combobox.combobox() === $combobox, 'combobox should be initialized' );
	} );

	QUnit.test( 'should disable dropdown menu if no items exists', function disablesDropdown ( assert ) {
		var $combobox = $( html ).find( '#MyComboboxSingleItem' ).combobox();
		assert.equal( $combobox.find( '.btn' ).hasClass( 'disabled' ), true, 'dropdown disabled' );
	} );

	QUnit.test( 'should set disabled state', function setsDisabled ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'disable' );
		assert.equal( $combobox.find( '.btn' ).hasClass( 'disabled' ), true, 'element disabled' );
	} );

	QUnit.test( 'should set enabled state', function setsEnabled ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'disable' );
		$combobox.combobox( 'enable' );
		assert.equal( $combobox.find( '.btn' ).hasClass( 'disabled' ), false, 'element enabled' );
	} );

	QUnit.test( 'should set default selection', function setsDefaultSelection ( assert ) {
		// Should be 'Three' based on the data-selected attribute
		var $combobox = $( html ).find( '#MyComboboxWithSelected' ).combobox();
		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Three', value: 3 };
		assert.deepEqual( item, expectedItem, 'default item selected' );
	} );

	QUnit.test( 'should not autoselect when no default selection', function noAutoselect ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { notFound: true, text: '' };
		assert.deepEqual( item, expectedItem, 'no item selected' );
	} );

	QUnit.test( 'should return selectedItem', function returnsSelectedItem ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByIndex', 0 );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'One', value: 1 };
		assert.deepEqual( item, expectedItem, 'selectedItem returns expected value' );
	} );

	QUnit.test( 'getValue should alias selectedItem function', function getValueAliasFunctions ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByIndex', 0 );

		var item1 = $combobox.combobox( 'selectedItem' );
		var item2 = $combobox.combobox( 'getValue' );
		assert.deepEqual( item1, item2, 'getValue alias matches selectedItem' );
	} );

	QUnit.test( 'should select by index', function selectsByIndex ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByIndex', 0 );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'One', value: 1 };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	QUnit.test( 'should select by value', function selectsByValue ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByValue', 2 );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Two', value: 2 };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	QUnit.test( 'should select by value with whitespace', function selectsByValueWithWhitespace ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByValue', 'Item Five' );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	QUnit.test( 'should select by text', function selectsByText ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByText', 'THREE' );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Three', value: 3 };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	var userInteracts = function userInteracts( $combobox, test ) {
		var DOWN_KEY = 40;
		var DOWN_EVENT = jQuery.Event( 'keyup', { which: DOWN_KEY, keyCode: DOWN_KEY, charCode: DOWN_KEY } );
		// var UP_KEY = 38;
		// var UP_EVENT = jQuery.Event( 'keyup', { which: UP_KEY, keyCode: UP_KEY, charCode: UP_KEY } );
		var BACKSPACE_KEY = 8;
		var BACKSPACE_EVENT = jQuery.Event( 'keyup', { which: BACKSPACE_KEY, keyCode: BACKSPACE_KEY, charCode: BACKSPACE_KEY } );
		var ENTER_KEY = 13;
		var ENTER_EVENT = jQuery.Event( 'keyup', { which: ENTER_KEY, keyCode: ENTER_KEY, charCode: ENTER_KEY } );
		var T_KEY = 84;
		var T_EVENT = jQuery.Event( 'keyup', { which: T_KEY, keyCode: T_KEY, charCode: T_KEY } );

		// Due to browser security, we are unable to fire 'synthetic' events manually. Therefore, we must
		// set the input to what we want -THEN- fire the event that would have caused that change
		// http://stackoverflow.com/questions/13944835/how-to-simulate-typing-in-input-field-using-jquery
		// NOTE that if we fire the event and then set the input it won't work because the input will not
		// yet contain the value we are expecting. So, below you will see that we set the value to 'T' just
		// prior to firing the keyboard event that would have done the setting.
		$combobox.find( 'input' )
			.val( '' )
			.trigger( BACKSPACE_EVENT )
			.trigger( BACKSPACE_EVENT )
			.trigger( BACKSPACE_EVENT )
			.trigger( BACKSPACE_EVENT )
			.trigger( BACKSPACE_EVENT )
			.val( 'T' )
			.trigger( T_EVENT )
			.trigger( DOWN_EVENT )
			.trigger( ENTER_EVENT );

		test();
	};

	QUnit.test( 'should not select any menu items via keyboard navigation with filter off and showOptionsOnKeypress off', function filterOffAndShowOptionsOnKeypressOffWorks ( assert ) {
		var done = assert.async();
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();

		var test = function test () {
			var item = $combobox.combobox( 'selectedItem' );
			var expectedItem = { notFound: true, text: 'T' };
			assert.deepEqual( item, expectedItem, 'Combobox was not triggered, filter not activated' );
			done();
		};

		userInteracts( $combobox, test );
	} );

	QUnit.test( 'should respond to keypresses appropriately with filter off and showOptionsOnKeypress on', function filterOffAndShowOptionsOnKeypressOnWorks ( assert ) {
		var done = assert.async();
		var $combobox = $( html ).find( '#MyComboboxWithSelectedForOptions' ).combobox( { showOptionsOnKeypress: true } );

		var test = function test () {
			var item = $combobox.combobox( 'selectedItem' );
			var expectedItem = { text: 'Four', value: 4 };

			assert.deepEqual( item, expectedItem, 'Combobox was triggered with filter inactive but showOptionsOnKeypress active' );
			done();
		};

		userInteracts( $combobox, test );
	} );

	QUnit.test( 'should respond to keypresses appropriately with filter and showOptionsOnKeypress on', function filterOnAndShowOptionsOnKeypressOnWorks ( assert ) {
		var done = assert.async();
		var $combobox = $( html ).find( '#MyComboboxWithSelectedForFilter' ).combobox( { showOptionsOnKeypress: true, filterOnKeypress: true } );

		var test = function test () {
			var item = $combobox.combobox( 'selectedItem' );
			var expectedItem = { text: 'Two', value: 2 };
			assert.deepEqual( item, expectedItem, 'Combobox was triggered with filter active' );
			done();
		};

		userInteracts( $combobox, test );
	} );

	QUnit.test( 'should select by text with whitespace', function selectByTextWithWhitespace ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectByText', 'Item Five' );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Item Five', value: 'Item Five' };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	QUnit.test( 'should select by selector', function selectBySelector ( assert ) {
		var $combobox = $( html ).find( '#MyCombobox' ).combobox();
		$combobox.combobox( 'selectBySelector', 'li[data-fizz=buzz]' );

		var item = $combobox.combobox( 'selectedItem' );
		var expectedItem = { text: 'Six', value: 6, foo: 'bar', fizz: 'buzz' };
		assert.deepEqual( item, expectedItem, 'item selected' );
	} );

	QUnit.test( 'should fire changed event - item selected', function firesChangedEvent ( assert ) {
		var eventFireCount = 0;
		var selectedText = '';
		var selectedValue = '';

		var $combobox = $( html ).find( '#MyCombobox' ).combobox().on( 'changed.fu.combobox', function changed ( evt, data ) {
			eventFireCount++;
			selectedText = data.text;
			selectedValue = data.value;
		} );

		// Simulate changed event
		$combobox.find( 'a:first' ).click();

		assert.equal( eventFireCount, 1, 'changed event fired once' );
		assert.equal( selectedText, 'One', 'text passed in from changed event' );
		assert.equal( selectedValue, 1, 'value passed in from changed event' );
	} );

	QUnit.test( 'should fire input change event - item selected', function firesInputChangeEvent ( assert ) {
		var eventFireCount = 0;

		var $combobox = $( html ).find( '#MyCombobox' ).combobox();

		$combobox.find( 'input' ).on( 'change', function onChange () {
			eventFireCount++;
		} );

		// Simulate changed event
		$combobox.find( 'a:first' ).click();

		assert.equal( eventFireCount, 1, 'change event fired once' );
	} );

	QUnit.test( 'should fire bubble-able input change event - item selected', function firesBubbleAbleEvent ( assert ) {
		var eventFireCount = 0;

		var $combobox = $( html ).find( '#MyCombobox' ).combobox();

		$combobox.on( 'change', 'input', function changeCallback () {
			eventFireCount++;
		} );

		// Simulate changed event
		$combobox.find( 'a:first' ).click();

		assert.equal( eventFireCount, 1, 'change event bubbled once' );
	} );

	QUnit.test( 'should fire changed event once when input is changed', function firesChangedOnce ( assert ) {
		var eventFireCount = 0;
		var selectedText = '';

		var $combobox = $( html ).find( '#MyCombobox' ).combobox().on( 'changed.fu.combobox', function changed ( evt, data ) {
			eventFireCount++;
			selectedText = data.text;
		} );

		$combobox.find( 'input' ).val( 'Seven' ).change();

		assert.equal( eventFireCount, 1, 'changed event fired once' );
		assert.equal( selectedText, 'Seven', 'text passed in from changed event' );
	} );

	QUnit.test( 'should destroy control', function destorysControl ( assert ) {
		var id = '#MyCombobox';
		var $el = $( html ).find( id ).combobox();

		assert.equal( typeof $el.combobox( 'destroy' ), 'string', 'returns string (markup)' );
		assert.equal( $( html ).find( id ).length, false, 'control has been removed from DOM' );
	} );

	QUnit.test( 'should remove whitespace', function removesWhitespace ( assert ) {
		var $combobox = $( html ).find( '#MyComboboxWithWhiteSpace' ).combobox();
		$combobox.combobox( 'selectByIndex', 0 );

		var item = $combobox.combobox( 'selectedItem' );
		assert.equal( item.text, 'no whitespace', 'whitespace was removed' );
	} );
} );
