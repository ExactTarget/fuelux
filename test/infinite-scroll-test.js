/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define( function infiniteScrollTest ( require ) {
	var QUnit = require('qunit');
	var $ = require( 'jquery' );
	var data = require( 'data' );
	var html = require( 'text!test/markup/infinite-scroll-markup.html!strip' );

	require( 'bootstrap' );
	require( 'fuelux/infinite-scroll' );

	QUnit.module( 'Fuel UX Infinite Scroll' );

	QUnit.test( 'should be defined on jquery object', function jqueryObject ( assert ) {
		assert.ok( $().infinitescroll, 'infinitescroll method is defined' );
	} );

	QUnit.test( 'should return element', function returnsElement ( assert ) {
		var $infiniteScroll = $( html );
		assert.ok( $infiniteScroll.infinitescroll() === $infiniteScroll, 'infinitescroll should be initialized' );
	} );

	QUnit.test( 'default behavior should function as expected', function defaultTest ( assert ) {
		var ready = assert.async();
		var $infiniteScroll = $( html );
		var scrollHeight;

		$( 'body' ).append( $infiniteScroll );
		$infiniteScroll.append( data.infiniteScroll.content );
		$infiniteScroll.infinitescroll( {
			dataSource: function dataSource ( helpers, callback ) {
				assert.ok( true, 'dataSource function called upon scrolling' );
				assert.ok( ( helpers.percentage && helpers.scrollTop ), 'appropriate helpers passed to dataSource function' );
				assert.ok( typeof callback === 'function', 'appropriate callback passed to dataSource function' );

				callback( { content: data.infiniteScroll.content } );

				assert.ok( $infiniteScroll.get( 0 ).scrollHeight > scrollHeight, 'content appended correctly upon return of data' );

				$infiniteScroll.remove();
				ready();
			}
		} );

		scrollHeight = $infiniteScroll.get( 0 ).scrollHeight;
		$infiniteScroll.scrollTop( 999999 );
	} );

	QUnit.test( 'percentage option should function as expected', function percentageTest ( assert ) {
		var ready = assert.async();
		var $infiniteScroll = $( html );
		var percent = 85;

		$( 'body' ).append( $infiniteScroll );
		$infiniteScroll.append( data.infiniteScroll.content );
		$infiniteScroll.infinitescroll( {
			dataSource: function dataSource ( helpers, callback ) {
				assert.ok( true, 'dataSource function called upon scrolling to specified percentage' );

				callback( { content: data.infiniteScroll.content } );
				$infiniteScroll.remove();
				ready();
			},
			percentage: percent
		} );

		$infiniteScroll.scrollTop( ( $infiniteScroll.get( 0 ).scrollHeight - ( $infiniteScroll.height() / ( percent / 100 ) ) ) + 1 );
	} );

	QUnit.test( 'destroy control', function destroyControl ( assert ) {
		var ready = assert.async();
		var $infiniteScroll = $( html );

		$( 'body' ).append( $infiniteScroll );
		$infiniteScroll.append( data.infiniteScroll.content );
		$infiniteScroll.infinitescroll( {
			dataSource: function dataSource ( helpers, callback ) {
				callback( { content: data.infiniteScroll.content } );

				assert.equal( typeof $infiniteScroll.infinitescroll( 'destroy' ), 'string', 'returns string (markup)' );
				assert.equal( $infiniteScroll.parent().length, false, 'control has been removed from DOM' );
				ready();
			}
		} );

		$infiniteScroll.scrollTop( 999999 );
	} );
} );
