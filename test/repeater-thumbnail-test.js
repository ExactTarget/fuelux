/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define( function repeaterThumbnailTest ( require ) {
	var QUnit = require('qunit');
	var $ = require( 'jquery' );
	var dataSource = function dataSource ( options, callback ) {
		var numItems = 200;
		var resp = {
			count: numItems,
			items: [],
			pages: ( Math.ceil( numItems / ( options.pageSize || 30 ) ) ),
			page: options.pageIndex
		};
		var i;
		var l;

		i = options.pageIndex * ( options.pageSize || 30 );
		l = i + ( options.pageSize || 30 );
		resp.start = i + 1;
		resp.end = l;

		for ( i; i < l; i++ ) {
			resp.items.push( {
				name: ( 'Thumbnail ' + ( i + 1 ) ),
				src: 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png'
			} );
		}

		callback( resp );
	};
	var html = require( 'text!test/markup/repeater-markup.html!strip' );

	require( 'bootstrap' );
	require( 'fuelux/repeater' );
	require( 'fuelux/repeater-thumbnail' );

	QUnit.module( 'Fuel UX Repeater Thumbnail', {
		beforeEach: function beforeEach () {
			this.$markup = $( html );
			this.$markup.find( '.repeater-views' ).append( '' +
				'<label class="btn btn-default active">' +
					'<input name="repeaterViews" type="radio" value="thumbnail">' +
					'<span class="glyphicon glyphicon-th"></span>' +
				'</label>' );
		}
	} );

	QUnit.test( 'should be defined on jquery object', function isJQueryObject ( assert ) {
		assert.ok( $.fn.repeater.viewTypes.thumbnail, 'repeater-thumbnail view plugin is defined' );
	} );

	QUnit.test( 'should render correctly', function renders ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var items = 0;
			var $item;

			$repeater.find( '.repeater-thumbnail-cont:first' ).find( '.thumbnail' ).each( function thumbnails () {
				items++;
			} );

			assert.equal( items, 10, 'correct number of items rendered' );

			$item = $repeater.find( '.thumbnail:first' );
			assert.equal( $item.find( 'img' ).attr( 'src' ), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'thumbnail image rendered correctly' );
			assert.equal( $item.find( 'span' ).text(), 'Thumbnail 1', 'thumbnail label rendered correctly' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource
		} );
	} );

	QUnit.test( 'should render correctly if infinite scroll enabled', function rendersWithInfiniteScroll ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var items = 0;

			$repeater.find( '.repeater-thumbnail-cont:first' ).find( '.thumbnail' ).each( function thumbnails () {
				items++;
			} );

			assert.equal( items, 30, 'correct number of items rendered' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_infiniteScroll: true
		} );
	} );

	QUnit.test( 'should call item callback correctly', function callbackTest ( assert ) {
		var ready = assert.async();
		var hasCalled = false;
		var items = 0;
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			assert.equal( items, 10, 'items callback called expected number of times' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_itemRendered: function thumbnailItemRendered ( helpers, callback ) {
				if ( !hasCalled ) {
					assert.ok( true, 'itemRendered callback called upon rendering item' );
					assert.equal( ( helpers.container.length > 0 && helpers.item.length > 0 ), true, 'itemRendered helpers object contains appropriate attributes' );
					hasCalled = true;
				}
				items++;
				callback();
			}
		} );
	} );

	QUnit.test( 'template option should work as expected', function templateOptionTest ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );
		var $item;

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			$item = $repeater.find( '.thumbnail:first' );
			assert.equal( $item.find( '.test2' ).text(), 'Thumbnail 1', 'template option working correctly - test 1' );
			assert.equal( $item.find( '.test3' ).text(), 'http://www.exacttarget.com/sites/exacttarget/themes/custom/exacttarget/logo.png', 'template option working correctly - test 2' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail"><div class="test2">{{name}}</div><div class="test3">{{src}}</div></div>'
		} );
	} );

	QUnit.test( 'should handle selectable (single) option correctly', function selectableSingleTest ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );
			var $firstItem = $cont.find( '.repeater-thumbnail:first' );
			var $lastItem = $cont.find( '.repeater-thumbnail:last' );

			assert.equal( $firstItem.hasClass( 'selectable' ), true, 'thumbnails have selectable class as expected' );
			$firstItem.click();
			assert.equal( $firstItem.hasClass( 'selected' ), true, 'thumbnail has selected class after being clicked as expected' );
			$lastItem.click();
			assert.equal( ( !$firstItem.hasClass( 'selected' ) && $lastItem.hasClass( 'selected' ) ), true, 'selected class transferred to different thumbnail when clicked' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_selectable: true
		} );
	} );

	QUnit.test( 'should handle selectable (multi) option correctly', function selectableMultiTest ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );
			var $firstItem = $cont.find( '.repeater-thumbnail:first' );
			var $lastItem = $cont.find( '.repeater-thumbnail:last' );

			assert.equal( $firstItem.hasClass( 'selectable' ), true, 'thumbnails have selectable class as expected' );
			$firstItem.click();
			assert.equal( $firstItem.hasClass( 'selected' ), true, 'thumbnail has selected class after being clicked as expected' );
			$lastItem.click();
			assert.equal( ( $firstItem.hasClass( 'selected' ) && $lastItem.hasClass( 'selected' ) ), true, 'both thumbnails have selected class after another click' );
			ready();
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		} );
	} );

	QUnit.test( 'should clear selected items', function clearsSelectedItems ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );
			var $firstItem = $cont.find( '.repeater-thumbnail:first' );
			var $lastItem = $cont.find( '.repeater-thumbnail:last' );

			$firstItem.click();
			$lastItem.click();

			setTimeout( function timeout () {
				$repeater.repeater( 'thumbnail_clearSelectedItems' );
				assert.equal( ( !$firstItem.hasClass( 'selected' ) && !$lastItem.hasClass( 'selected' ) ), true, 'selected thumbnails cleared as expected' );
				ready();
			}, 0 );
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		} );
	} );

	QUnit.test( 'should get selected items', function getSelectedItemsTest ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );
			var $firstItem = $cont.find( '.repeater-thumbnail:first' );
			var $lastItem = $cont.find( '.repeater-thumbnail:last' );
			var selected;

			$firstItem.click();
			$lastItem.click();

			setTimeout( function timeout () {
				selected = $repeater.repeater( 'thumbnail_getSelectedItems' );
				assert.equal( selected.length, 2, 'returned array contains appropriate number of items' );
				assert.equal( selected[ 0 ].length > 0, true, 'returned array items are jQuery elements as appropriate' );
				ready();
			}, 0 );
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_selectable: 'multi'
		} );
	} );

	QUnit.test( 'should set selected items', function setSelectedTest ( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$repeater.one( 'loaded.fu.repeater', function loaded () {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );

			setTimeout( function timeout () {
				var n = 0;

				$repeater.find( '.repeater-thumbnail' ).each( function eachThumbnail () {
					if ( n === 4 ) {
						$( this ).addClass( 'test' );
						return false;
					}

					n++;
					return true;
				} );

				$repeater.repeater( 'thumbnail_setSelectedItems', [ { index: 0 } ] );
				assert.equal( $repeater.repeater( 'thumbnail_getSelectedItems' ).length, 1, 'correct number of items selected' );
				assert.equal( $cont.find( '.repeater-thumbnail:first' ).hasClass( 'selected' ), true, 'correct thumbnail selected by index' );

				$repeater.repeater( 'thumbnail_setSelectedItems', [ { selector: '.test' } ] );
				assert.equal( $repeater.repeater( 'thumbnail_getSelectedItems' ).length, 1, 'correct number of items selected' );
				assert.equal( $repeater.find( '.repeater-thumbnail.test' ).hasClass( 'selected' ), true, 'correct thumbnail selected by selector' );

				$repeater.repeater( 'thumbnail_setSelectedItems', [ { index: 0 }, { index: 1 }, { index: 2 }, { selector: '.test' } ], true );
				assert.equal( $repeater.repeater( 'thumbnail_getSelectedItems' ).length, 4, 'correct number of thumbnails selected when using force' );
				ready();
			}, 0 );
		} );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_selectable: true
		} );
	} );

	QUnit.test( 'should handle alignment option properly', function alignmentTest ( assert ) {
		var ready = assert.async();
		var alignment = 'none';
		var $repeater = $( this.$markup );
		var self = this;

		function loaded() {
			var $cont = $repeater.find( '.repeater-thumbnail-cont' );

			setTimeout( function() {
				switch ( alignment ) {
				case 'center':
					assert.equal( $cont.hasClass( 'align-center' ), true, 'repeater-thumbnail-cont has align-center class when alignment option set to ' + alignment );
					assert.equal( $cont.find( 'span.spacer' ).length > 0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment );
					alignment = 'justify';
					break;
				case 'justify':
					assert.equal( $cont.hasClass( 'align-justify' ), true, 'repeater-thumbnail-cont has align-justify class when alignment option set to ' + alignment );
					assert.equal( $cont.find( 'span.spacer' ).length > 0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment );
					alignment = 'left';
					break;
				case 'left':
					assert.equal( $cont.hasClass( 'align-left' ), true, 'repeater-thumbnail-cont has align-left class when alignment option set to ' + alignment );
					assert.equal( $cont.find( 'span.spacer' ).length > 0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment );
					alignment = 'right';
					break;
				case 'right':
					assert.equal( $cont.hasClass( 'align-right' ), true, 'repeater-thumbnail-cont has align-right class when alignment option set to ' + alignment );
					assert.equal( $cont.find( 'span.spacer' ).length > 0, true, 'repeater-thumbnail-cont contains spacers when alignment option set to ' + alignment );
					alignment = false;
					break;
				default:
					assert.equal( $cont.hasClass( 'align-center align-justify align-left align-right' ), false, 'repeater-thumbnail-cont does not have alignment classes when alignment set to ' + alignment );
					assert.equal( $cont.find( 'span.spacer' ).length, 0, 'repeater-thumbnail-cont does not contain spacers when alignment option set to ' + alignment );
					if ( alignment === 'none' ) {
						alignment = 'center';
					} else {
						ready();
						return;
					}
				}

				$repeater.remove();
				$repeater = $( self.$markup );

				$repeater.one( 'loaded.fu.repeater', loaded );

				$repeater.repeater( {
					dataSource: dataSource,
					thumbnail_alignment: alignment
				} );
			}, 0 );
		}

		$repeater.one( 'loaded.fu.repeater', loaded );

		$repeater.repeater( {
			dataSource: dataSource,
			thumbnail_alignment: alignment
		} );
	} );
} );
