/* global QUnit:true, $:true */

window.$ = window.jQuery = require( 'jquery' );
// These are here so that browserify knows to compile them into commonjs-bundle.js
var bootstrap = require( 'bootstrap' );
var moment = require( 'moment' );
var fuelux = require( '../dist/js/npm' );
require( '../bower_components/qunit/qunit/qunit' );

// In order to be be UMD compliant, modules must work with
// CommonJS. The following tests check to see if the plugin
// is on the jQuery namespace and nothing else.

QUnit.test( 'combobox should be defined on jQuery object', function ( assert ) {
	assert.ok( $().combobox, 'combobox method is defined' );
} );

QUnit.test( 'datepicker should be defined on the jQuery object', function ( assert ) {
	assert.ok( $().datepicker, 'datepicker method is defined' );
} );

QUnit.test( 'dropdownautoflip should be defined on the jQuery object', function ( assert ) {
	assert.ok( $().dropdownautoflip, 'dropdownautoflip method is defined' );
} );

QUnit.test( 'infinitescroll should be defined on the jQuery object', function ( assert ) {
	assert.ok( $().infinitescroll, 'infinitescroll method is defined' );
} );

QUnit.test( 'loader should be defined on the jQuery object', function ( assert ) {
	assert.ok( $().loader, 'loader method is defined' );
} );

QUnit.test( 'pillbox should be defined on jQuery object', function ( assert ) {
	assert.ok( $().pillbox, 'pillbox method is defined' );
} );

QUnit.test( 'radio should be defined on jQuery object', function ( assert ) {
	assert.ok( $().radio, 'radio method is defined' );
} );

QUnit.test( 'repeater should be defined on jQuery object', function ( assert ) {
	assert.ok( $().repeater, 'repeater method is defined' );
} );

QUnit.test( 'repeater list should be defined on jQuery object', function ( assert ) {
	assert.ok( $.fn.repeater.viewTypes.list, 'repeater list view is defined' );
} );

QUnit.test( 'repeater thumbnail should be defined on jQuery object', function ( assert ) {
	assert.ok( $.fn.repeater.viewTypes.thumbnail, 'repeater thumbnail view is defined' );
} );

QUnit.test( 'scheduler should be defined on the jQuery object', function ( assert ) {
	assert.ok( $().scheduler, 'scheduler method is defined' );
} );

QUnit.test( 'search should be defined on jQuery object', function ( assert ) {
	assert.ok( $().search, 'search method is defined' );
} );

QUnit.test( 'selectlist should be defined on jQuery object', function ( assert ) {
	assert.ok( $().selectlist, 'selectlist method is defined' );
} );

QUnit.test( 'spinbox should be defined on jQuery object', function ( assert ) {
	assert.ok( $().spinbox, 'spinbox method is defined' );
} );

QUnit.test( 'tree should be defined on jQuery object', function ( assert ) {
	assert.ok( $().tree, 'tree method is defined' );
} );

QUnit.test( 'wizard should be defined on jQuery object', function ( assert ) {
	assert.ok( $().wizard, 'wizard method is defined' );
} );
