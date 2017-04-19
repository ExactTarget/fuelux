/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */

define( function ( require ) {
	var QUnit = require('qunit');
	var $ = require( 'jquery' );
	var html = require( 'text!test/markup/repeater-markup.html!strip' );
	/* FOR DEV TESTING - uncomment to test against index.html */

	// Html = require('text!index.html!strip');
	// html = $('<div>'+html+'</div>').find('#MyRepeaterContainer');

	require( 'bootstrap' );
	require( 'fuelux/repeater' );

	QUnit.module( 'Fuel UX Repeater', {
		beforeEach: function setup( assert ) {
			this.$markup = $( html );
			this.$markup.find( '.repeater-views' ).append( '' +
			'<label class="btn btn-default active">' +
			'<input name="repeaterViews" type="radio" value="test1.view1">' +
			'<span class="glyphicon glyphicon-asterisk"></span>' +
			'</label>' +
			'<label class="btn btn-default">' +
			'<input name="repeaterViews" type="radio" value="test2.view2">' +
			'<span class="glyphicon glyphicon-asterisk"></span>' +
			'</label>' );
		},
		afterEach: function teardown( assert ) {
			delete $.fn.repeater.viewTypes.test1;
		}
	} );

	QUnit.test( 'should be defined on jquery object', function jqueryObject( assert ) {
		assert.ok( $().repeater, 'repeater method is defined' );
	} );

	QUnit.test( 'should return element', function returnElement( assert ) {
		var $repeater = $( this.$markup );
		assert.ok( $repeater.repeater() === $repeater, 'repeater should be initialized' );
	} );

	QUnit.test( 'should call dataSource correctly', function callDatasource( assert ) {
		var $repeater = $( this.$markup );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				assert.ok( true, 'dataSource function called prior to rendering' );
				assert.equal( typeof options, 'object', 'dataSource provided options object' );
				assert.equal( typeof callback, 'function', 'dataSource provided callback function' );
				callback( {} );
			}
		} );
	} );

	QUnit.test( 'should handle filtering correctly', function filtering( assert ) {
		var hasCalledDS = false;
		var $repeater = $( this.$markup );
		var $filters = $repeater.find( '.repeater-filters' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				if ( hasCalledDS ) {
					assert.ok( true, 'dataSource called again upon selecting different filter' );
					assert.equal( options.filter.text, 'Some', 'filter text property correct on change' );
					assert.equal( options.filter.value, 'some', 'filter value property correct on change' );
				} else {
					assert.equal( typeof options.filter, 'object', 'filter object passed to dataSource' );
					assert.equal( options.filter.text, 'All', 'filter text property correct initially' );
					assert.equal( options.filter.value, 'all', 'filter value property correct initially' );
					callback( {} );

					hasCalledDS = true;
					$filters.find( 'button' ).click();
					$filters.find( 'li:nth-child(2) a' ).click();
				}
			}
		} );
	} );

	QUnit.test( 'should handle itemization correctly', function itemization( assert ) {
		var hasCalledDS = false;
		var $repeater = $( this.$markup );
		var $pageSizes = $repeater.find( '.repeater-itemization .selectlist' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				if ( hasCalledDS ) {
					assert.ok( true, 'dataSource called again upon selecting different page size' );
					assert.equal( options.pageSize, 5, 'correct pageSize passed after change' );
				} else {
					assert.equal( options.pageIndex, 0, 'correct pageIndex passed to dataSource' );
					assert.equal( options.pageSize, 10, 'correct pageSize passed to dataSource' );
					callback( { count: 200, end: 10, start: 1 } );
					assert.equal( $repeater.find( '.repeater-count' ).text(), '200', 'count set correctly' );
					assert.equal( $repeater.find( '.repeater-end' ).text(), '10', 'end index set correctly' );
					assert.equal( $repeater.find( '.repeater-start' ).text(), '1', 'start index set correctly' );

					hasCalledDS = true;
					$pageSizes.find( 'button' ).click();
					$pageSizes.find( 'li:first a' ).click();
				}
			}
		} );
	} );

	QUnit.test( 'should handle pagination correctly', function pagination( assert ) {
		var count = -1;
		var $repeater = $( this.$markup );
		var $primaryPaging = $repeater.find( '.repeater-primaryPaging' );
		var $secondaryPaging = $repeater.find( '.repeater-secondaryPaging' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				count++;
				switch ( count ) {
				case 0:
					assert.equal( options.pageIndex, 0, 'correct pageIndex passed to dataSource' );
					callback( { page: 0, pages: 2 } );
					assert.equal( $primaryPaging.hasClass( 'active' ), true, 'primary paging has active class' );
					assert.equal( $primaryPaging.find( 'input' ).val(), '1', 'primary paging displaying correct page' );
					assert.equal( $primaryPaging.find( 'li' ).length, 2, 'primary paging has correct number of selectable items' );
					$repeater.find( '.repeater-next' ).click();
					break;
				case 1:
					assert.ok( true, 'dataSource called again upon clicking next button' );
					assert.equal( options.pageIndex, 1, 'correct pageIndex passed to dataSource on next click' );
					callback( { page: 1, pages: 6 } );
					assert.equal( $secondaryPaging.hasClass( 'active' ), true, 'secondary paging has active class' );
					assert.equal( $secondaryPaging.val(), '2', 'secondary paging displaying correct page' );
					$repeater.find( '.repeater-prev' ).click();
					break;
				case 2:
					assert.ok( true, 'dataSource called again upon clicking prev button' );
					assert.equal( options.pageIndex, 0, 'correct pageIndex passed to dataSource on prev click' );
					callback( {} );
					break;
				default:
					break;
				}
			},
			dropPagingCap: 3
		} );
	} );

	QUnit.test( 'should handle search correctly', function search( assert ) {
		var count = -1;
		var $repeater = $( this.$markup );
		var $search = $repeater.find( '.repeater-search' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				count++;
				switch ( count ) {
				case 0:
					assert.equal( options.search, undefined, 'search value not passed to dataSource initially as expected' );
					callback( {} );
					$search.find( 'input' ).val( 'something' );
					$search.trigger( 'searched.fu.repeater' );
					break;
				case 1:
					assert.equal( options.search, 'something', 'correct search value passed to dataSource upon searching' );
					callback( {} );
					$search.find( 'input' ).val( '' );
					$search.trigger( 'cleared.fu.repeater' );
					break;
				case 2:
					assert.equal( options.search, undefined, 'search value not passed to dataSource after clearing' );
					callback( {} );
					break;
				default:
					break;
				}
			},
			dropPagingCap: 3
		} );
	} );

	QUnit.test( 'should handle canceling search correctly', function cancelSearch( assert ) {
		var count = -1;
		var $repeater = $( this.$markup );
		var $search = $repeater.find( '.repeater-search' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				count++;
				switch ( count ) {
				case 0:
					assert.equal( options.search, undefined, 'search value not passed to dataSource initially as expected' );
					callback( {} );
					$search.find( 'input' ).val( 'something' );
					$search.trigger( 'searched.fu.repeater' );
					break;
				case 1:
					assert.equal( options.search, 'something', 'correct search value passed to dataSource upon searching' );
					callback( {} );
					$search.find( 'input' ).val( '' );
					$search.trigger( 'canceled.fu.repeater' );
					break;
				case 2:
					assert.equal( options.search, undefined, 'search value not passed to dataSource after canceling' );
					callback( {} );
					break;
				default:
					break;
				}
			},
			dropPagingCap: 3
		} );
	} );

	QUnit.test( 'should handle views correctly', function views( assert ) {
		var hasCalledDS = false;
		var $repeater = $( this.$markup );
		var $views = $repeater.find( '.repeater-views' );
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				if ( hasCalledDS ) {
					assert.equal( options.view, 'test2.view2', 'correct view value passed to dataSource upon selecting different view' );
				} else {
					assert.equal( options.view, 'test1.view1', 'correct view value passed to dataSource initially' );
					hasCalledDS = true;
					callback( {} );
					$views.find( 'label:last input' ).trigger( 'change' );
				}
			},
			dropPagingCap: 3
		} );
	} );

	QUnit.test( 'should run view plugin aspects correctly - pt 1', function viewTypes( assert ) {
		var ran = 0;
		var $repeater = $( this.$markup );
		$.fn.repeater.viewTypes.test1 = {
			initialize: function initialize( helpers, callback ) {
				assert.equal( ran, 0, 'initialize function correctly ran first' );
				assert.equal( typeof helpers, 'object', 'initialize function provided helpers object' );
				assert.equal( typeof callback, 'function', 'initialize function provided callback function' );
				ran++;
				callback( {} );
			},
			selected: function selected( helpers ) {
				assert.equal( ran, 1, 'selected function correctly ran upon view select' );
				assert.equal( typeof helpers, 'object', 'selected function provided helpers object' );
				ran++;
			},
			dataOptions: function dataOptions( options ) {
				assert.equal( ran, 2, 'dataOptions function correctly ran prior to rendering' );
				assert.equal( typeof options, 'object', 'dataOptions function provided options object' );
				ran++;
				return options;
			},
			before: function before( helpers ) {
				assert.equal( ran, 3, 'before function ran before renderItems function' );
				assert.equal( typeof helpers, 'object', 'before function provided helpers object' );
				assert.equal( ( helpers.container.length > 0 && typeof helpers.data === 'object' ), true, 'helpers object contains appropriate attributes' );
				ran++;
				return { item: '<div class="test1-wrapper" data-container="true"></div>' };
			},
			renderItem: function renderItem( helpers ) {
				assert.equal( ( ran > 3 ), true, 'renderItem function ran after before function' );
				assert.equal( typeof helpers, 'object', 'renderItem function provided helpers object' );
				assert.equal( ( helpers.container.length > 0 && typeof helpers.data === 'object' &&
				typeof helpers.index === 'number' && typeof helpers.subset === 'object' ), true, 'helpers object contains appropriate attributes' );
				assert.equal( helpers.container.hasClass( 'test1-wrapper' ), true, 'data-container="true" attribute functioning correctly' );
				ran++;
				return { item: '<div class="test1-item"></div>' };
			},
			after: function after( helpers ) {
				assert.equal( ran, 7, 'after function ran after renderItems function' );
				assert.equal( typeof helpers, 'object', 'after function provided helpers object' );
				assert.equal( ( helpers.container.length > 0 && typeof helpers.data === 'object' ), true, 'helpers object contains appropriate attributes' );
				return false;
			},
			repeat: 'data.smileys'
		};
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				callback( { smileys: [ ':)', ':)', ':)' ] } );
			}
		} );
	} );

	QUnit.test( 'should run view plugin aspects correctly - pt 2', function viewTypes2( assert ) {
		var $repeater = $( this.$markup );
		$.fn.repeater.viewTypes.test1 = {
			render: function render( helpers ) {
				assert.equal( 1, 1, 'render function ran when defined' );
				assert.equal( typeof helpers, 'object', 'render function provided helpers object' );
				assert.equal( ( helpers.container.length > 0 && typeof helpers.data === 'object' ), true, 'helpers object contains appropriate attributes' );
			},
			resize: function resize( helpers ) {
				assert.equal( 1, 1, 'resize function correctly ran when control is cleared' );
				assert.equal( typeof helpers, 'object', 'resize function provided helpers object' );
			},
			cleared: function cleared( helpers ) {
				assert.equal( 1, 1, 'cleared function correctly ran when control is cleared' );
				assert.equal( typeof helpers, 'object', 'cleared function provided helpers object' );
			}
		};
		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				callback( { smileys: [ ':)', ':)', ':)' ] } );
				$repeater.repeater( 'resize' );
				$repeater.repeater( 'clear' );
			}
		} );
	} );

	QUnit.test( 'views config option should function as expected', function configOption( assert ) {
		var $repeater = $( this.$markup );
		var $views = $repeater.find( '.repeater-views' );
		$repeater.repeater( {
			views: {
				view1: {
					dataSource: function dataSource( options, callback ) {
						assert.equal( options.view, 'test1.view1', 'view-specific configuration honored' );
						callback( {} );
						$views.find( 'label:last input' ).trigger( 'change' );
					}
				},
				'test2.view2': {
					dataSource: function dataSource( options, callback ) {
						assert.equal( options.view, 'test2.view2', 'view-specific configuration honored' );
						callback( {} );
					}
				}
			}
		} );
	} );

	QUnit.test( 'should handle disable / enable correctly', function enableDisable( assert ) {
		var $repeater = $( this.$markup );

		var $search = $repeater.find( '.repeater-header .search' );
		var $filters = $repeater.find( '.repeater-header .repeater-filters' );
		var $views = $repeater.find( '.repeater-header .repeater-views label' );
		var $pageSize = $repeater.find( '.repeater-footer .repeater-itemization .selectlist' );
		var $primaryPaging = $repeater.find( '.repeater-footer .repeater-primaryPaging .combobox' );
		var $secondaryPaging = $repeater.find( '.repeater-footer .repeater-secondaryPaging' );
		var $prevBtn = $repeater.find( '.repeater-prev' );
		var $nextBtn = $repeater.find( '.repeater-next' );

		$repeater.on( 'disabled.fu.repeater', function disabled() {
			assert.ok( true, 'disabled event called as expected' );
		} );

		$repeater.on( 'enabled.fu.repeater', function enabled() {
			assert.ok( true, 'enabled event called as expected' );
		} );

		$repeater.on( 'rendered.fu.repeater', function rendered() {
			setTimeout( function renderedTimeout() {
				$repeater.repeater( 'disable' );

				$views.click();

				assert.equal( $search.hasClass( 'disabled' ), true, 'repeater search disabled as expected' );
				assert.equal( $filters.hasClass( 'disabled' ), true, 'repeater filters disabled as expected' );
				assert.equal( $views.attr( 'disabled' ), 'disabled', 'repeater views disabled as expected' );
				assert.equal( $pageSize.hasClass( 'disabled' ), true, 'repeater pageSize disabled as expected' );
				assert.equal( $primaryPaging.hasClass( 'disabled' ), true, 'repeater primaryPaging disabled as expected' );
				assert.equal( $secondaryPaging.attr( 'disabled' ), 'disabled', 'repeater secondaryPaging disabled as expected' );
				assert.equal( $prevBtn.attr( 'disabled' ), 'disabled', 'repeater prevBtn disabled as expected' );
				assert.equal( $nextBtn.attr( 'disabled' ), 'disabled', 'repeater nextBtn disabled as expected' );
				assert.equal( $repeater.hasClass( 'disabled' ), true, 'repeater has disabled class as expected' );

				$repeater.repeater( 'enable' );

				assert.equal( $search.hasClass( 'disabled' ), false, 'repeater search enabled as expected' );
				assert.equal( $filters.hasClass( 'disabled' ), false, 'repeater filters enabled as expected' );
				assert.equal( $views.attr( 'disabled' ), undefined, 'repeater views enabled as expected' );
				assert.equal( $pageSize.hasClass( 'disabled' ), true, 'repeater pageSize disabled as expected' );
				assert.equal( $primaryPaging.hasClass( 'disabled' ), false, 'repeater primaryPaging enabled as expected' );
				assert.equal( $secondaryPaging.attr( 'disabled' ), undefined, 'repeater secondaryPaging enabled as expected' );
				assert.equal( $prevBtn.attr( 'disabled' ), 'disabled', 'repeater prevBtn still disabled as expected (no more pages)' );
				assert.equal( $nextBtn.attr( 'disabled' ), 'disabled', 'repeater nextBtn still disabled as expected (no more pages)' );

				assert.equal( $repeater.hasClass( 'disabled' ), false, 'repeater no longer has disabled class as expected' );
			}, 0 );
		} );
		$repeater.repeater();
	} );

	QUnit.test( 'rendered.fu.repeater callback should receive correct data when called by renderItems function', function dataSourceCallbackTest( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );
		$repeater.on( 'rendered.fu.repeater', function rendered ( e, state ) {
			// rendered is triggered on `this.$search` and `this.$element` in repeater.js
			if ( e.target.id === $repeater.attr('id') ) {
				assert.ok( state.data, 'data object exists' );
				assert.equal( state.data.myVar, 'passalong', 'data returned from datasource was passed along' );

				ready();
			}
		} );
		$repeater.repeater( {
			views: {
				'test1.view1': {
					dataSource: function dataSource( options, callback ) {
						callback( { myVar: 'passalong' } );
					}
				}
			}
		} );
	} );

	QUnit.test( 'custom views render function should receive correct data when called by renderItems function', function dataSourceCallbackTest( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		$.fn.repeater.viewTypes.test1 = {
			render: function render ( state, callback ) {
				assert.ok( state.data, 'data was passed to custom viewtype callback' );
				assert.equal( state.data.myVar, 'passalong', 'data returned from datasource was passed along to custom viewtype callback' );
				callback( state.data );
				ready();
			}
		};
		$repeater.repeater( {
			views: {
				'test1.view1': {
					dataSource: function dataSource( options, callback ) {
						callback( { myVar: 'passalong' } );
					}
				}
			}
		} );
	} );

	QUnit.test( 'resize should set height correctly when called inside hidden DOM object', function resize (assert) {
		var ready = assert.async();
		var $hiddenDiv = $('' +
			'<div style="display:none">' +
			'	<div class="repeaterDiv"></div>' +
			'</div>');
		$('.fuelux').append($hiddenDiv);
		$hiddenDiv.find('.repeaterDiv').append(this.$markup);
		var $repeater = $( $hiddenDiv.find('.repeater'));
		var $repeaterViewport = $( $repeater.find('.repeater-viewport'));

		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				callback( { smileys: [ ':)', ':)', ':)' ] } );
				$hiddenDiv.show();
				$repeaterViewport.css('min-height', 0);
				assert.notEqual($repeaterViewport.height(), 0, 'height set to non-zero value on resize');
				$hiddenDiv.remove();
				ready();
			},
			staticHeight:true
		} );

	} );

	QUnit.test( 'should destroy control', function destroy( assert ) {
		var ready = assert.async();
		var $repeater = $( this.$markup );

		var afterSource = function afterSource() {
			setTimeout( function afterSourceTimeout() {
				assert.equal( typeof $repeater.repeater( 'destroy' ), 'string', 'returns string (markup)' );
				assert.equal( $repeater.parent().length, false, 'control has been removed from DOM' );
				ready();
			}, 0 );
		};

		$repeater.repeater( {
			dataSource: function dataSource( options, callback ) {
				callback( { smileys: [ ':)', ':)', ':)' ] } );
				afterSource();
			}
		} );
	} );
} );
