/*! Fuel UX - v3.0.0 - 2014-03-20
 * https://github.com/ExactTarget/fuelux
 * Copyright (c) 2014 ExactTarget; Licensed MIT */

// For more information on UMD visit: https://github.com/umdjs/umd/
( function( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery' ], factory );
	} else {
		factory( jQuery );
	}
}( function( jQuery ) {

	( function( $ ) {

		/*
		 * Fuel UX Utilities
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		// custom case-insensitive match expression
		function fuelTextExactCI( elem, text ) {
			return ( elem.textContent || elem.innerText || $( elem ).text() || '' ).toLowerCase() === ( text || '' ).toLowerCase();
		}

		$.expr[ ':' ].fuelTextExactCI = $.expr.createPseudo ?
			$.expr.createPseudo( function( text ) {
				return function( elem ) {
					return fuelTextExactCI( elem, text );
				};
			} ) :
			function( elem, i, match ) {
				return fuelTextExactCI( elem, match[ 3 ] );
		};


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Checkbox
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.checkbox;

		// CHECKBOX CONSTRUCTOR AND PROTOTYPE

		var Checkbox = function( element, options ) {
			this.options = $.extend( {}, $.fn.checkbox.defaults, options );

			// cache elements
			this.$chk = $( element );
			this.$label = this.$chk.parent();
			this.$parent = this.$label.parent( '.checkbox' );

			if ( this.$parent.length === 0 ) {
				this.$parent = null;
			}

			// set default state
			this.setState( this.$chk );

			// handle events
			this.$chk.on( 'change', $.proxy( this.itemchecked, this ) );
		};

		Checkbox.prototype = {

			constructor: Checkbox,

			setState: function( $chk ) {
				$chk = $chk || this.$chk;

				var checked = $chk.is( ':checked' );
				var disabled = !! $chk.prop( 'disabled' );

				// reset classes
				this.$label.removeClass( 'checked disabled' );
				if ( this.$parent ) {
					this.$parent.removeClass( 'checked disabled' );
				}

				// set state of checkbox
				if ( checked === true ) {
					this.$label.addClass( 'checked' );
					if ( this.$parent ) {
						this.$parent.addClass( 'checked' );
					}
				}
				if ( disabled === true ) {
					this.$label.addClass( 'disabled' );
					if ( this.$parent ) {
						this.$parent.addClass( 'disabled' );
					}
				}
			},

			enable: function() {
				this.$chk.attr( 'disabled', false );
				this.$label.removeClass( 'disabled' );
				if ( this.$parent ) {
					this.$parent.removeClass( 'disabled' );
				}
			},

			disable: function() {
				this.$chk.attr( 'disabled', true );
				this.$label.addClass( 'disabled' );
				if ( this.$parent ) {
					this.$parent.addClass( 'disabled' );
				}
			},

			toggle: function() {
				this.$chk.click();
			},

			itemchecked: function( e ) {
				var chk = $( e.target );
				this.setState( chk );
			},

			check: function() {
				this.$chk.prop( 'checked', true );
				this.setState( this.$chk );
			},

			uncheck: function() {
				this.$chk.prop( 'checked', false );
				this.setState( this.$chk );
			},

			isChecked: function() {
				return this.$chk.is( ':checked' );
			}
		};


		// CHECKBOX PLUGIN DEFINITION

		$.fn.checkbox = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'checkbox' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'checkbox', ( data = new Checkbox( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.checkbox.defaults = {};

		$.fn.checkbox.Constructor = Checkbox;

		$.fn.checkbox.noConflict = function() {
			$.fn.checkbox = old;
			return this;
		};


		// CHECKBOX DATA-API

		$( function() {
			$( window ).on( 'load', function() {
				//$('i.checkbox').each(function () {
				$( '.checkbox-custom > input[type=checkbox]' ).each( function() {
					var $this = $( this );
					if ( $this.data( 'checkbox' ) ) return;
					$this.checkbox( $this.data() );
				} );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Combobox
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.combobox;

		// COMBOBOX CONSTRUCTOR AND PROTOTYPE

		var Combobox = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.combobox.defaults, options );
			this.$element.on( 'click', 'a', $.proxy( this.itemclicked, this ) );
			this.$element.on( 'change', 'input', $.proxy( this.inputchanged, this ) );
			this.$input = this.$element.find( 'input' );
			this.$button = this.$element.find( '.btn' );

			// set default selection
			this.setDefaultSelection();
		};

		Combobox.prototype = {

			constructor: Combobox,

			selectedItem: function() {
				var item = this.$selectedItem;
				var data = {};

				if ( item ) {
					var txt = this.$selectedItem.text();
					data = $.extend( {
						text: txt
					}, this.$selectedItem.data() );
				} else {
					data = {
						text: this.$input.val()
					};
				}

				return data;
			},

			selectByText: function( text ) {
				var selector = 'li:fuelTextExactCI(' + text + ')';
				this.selectBySelector( selector );
			},

			selectByValue: function( value ) {
				var selector = 'li[data-value="' + value + '"]';
				this.selectBySelector( selector );
			},

			selectByIndex: function( index ) {
				// zero-based index
				var selector = 'li:eq(' + index + ')';
				this.selectBySelector( selector );
			},

			selectBySelector: function( selector ) {
				var $item = this.$element.find( selector );

				if ( typeof $item[ 0 ] !== 'undefined' ) {
					this.$selectedItem = $item;
					this.$input.val( this.$selectedItem.text() );
				} else {
					this.$selectedItem = null;
				}
			},

			setDefaultSelection: function() {
				var selector = 'li[data-selected=true]:first';
				var item = this.$element.find( selector );

				if ( item.length > 0 ) {
					// select by data-attribute
					this.selectBySelector( selector );
					item.removeData( 'selected' );
					item.removeAttr( 'data-selected' );
				}
			},

			enable: function() {
				this.$input.removeAttr( 'disabled' );
				this.$button.removeClass( 'disabled' );
			},

			disable: function() {
				this.$input.attr( 'disabled', true );
				this.$button.addClass( 'disabled' );
			},

			itemclicked: function( e ) {
				this.$selectedItem = $( e.target ).parent();

				// set input text and trigger input change event marked as synthetic
				this.$input.val( this.$selectedItem.text() ).trigger( 'change', {
					synthetic: true
				} );

				// pass object including text and any data-attributes
				// to onchange event
				var data = this.selectedItem();

				// trigger changed event
				this.$element.trigger( 'changed', data );

				e.preventDefault();
			},

			inputchanged: function( e, extra ) {

				// skip processing for internally-generated synthetic event
				// to avoid double processing
				if ( extra && extra.synthetic ) return;

				var val = $( e.target ).val();
				this.selectByText( val );

				// find match based on input
				// if no match, pass the input value
				var data = this.selectedItem();
				if ( data.text.length === 0 ) {
					data = {
						text: val
					};
				}

				// trigger changed event
				this.$element.trigger( 'changed', data );

			}

		};


		// COMBOBOX PLUGIN DEFINITION

		$.fn.combobox = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'combobox' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'combobox', ( data = new Combobox( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.combobox.defaults = {};

		$.fn.combobox.Constructor = Combobox;

		$.fn.combobox.noConflict = function() {
			$.fn.combobox = old;
			return this;
		};


		// COMBOBOX DATA-API

		$( function() {
			$( window ).on( 'load', function() {
				$( '.combobox' ).each( function() {
					var $this = $( this );
					if ( $this.data( 'combobox' ) ) return;
					$this.combobox( $this.data() );
				} );
			} );

			$( 'body' ).on( 'mousedown.combobox.data-api', '.combobox', function() {
				var $this = $( this );
				if ( $this.data( 'combobox' ) ) return;
				$this.combobox( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Datagrid
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.datagrid;

		// Relates to thead .sorted styles in datagrid.less
		var SORTED_HEADER_OFFSET = 22;


		// DATAGRID CONSTRUCTOR AND PROTOTYPE

		var Datagrid = function( element, options ) {
			this.$element = $( element );
			this.$thead = this.$element.find( 'thead' );
			this.$tfoot = this.$element.find( 'tfoot' );
			this.$footer = this.$element.find( 'tfoot th' );
			this.$footerchildren = this.$footer.children().show().css( 'visibility', 'hidden' );
			this.$topheader = this.$element.find( 'thead th' );
			this.$searchcontrol = this.$element.find( '.datagrid-search' );
			this.$filtercontrol = this.$element.find( '.filter' );
			this.$pagesize = this.$element.find( '.grid-pagesize' );
			this.$pageinput = this.$element.find( '.grid-pager input' );
			this.$pagedropdown = this.$element.find( '.grid-pager .dropdown-menu' );
			this.$prevpagebtn = this.$element.find( '.grid-prevpage' );
			this.$nextpagebtn = this.$element.find( '.grid-nextpage' );
			this.$pageslabel = this.$element.find( '.grid-pages' );
			this.$countlabel = this.$element.find( '.grid-count' );
			this.$startlabel = this.$element.find( '.grid-start' );
			this.$endlabel = this.$element.find( '.grid-end' );

			this.$tbody = $( '<tbody>' ).insertAfter( this.$thead );
			this.$colheader = $( '<tr>' ).appendTo( this.$thead );

			this.options = $.extend( true, {}, $.fn.datagrid.defaults, options );
			this.selectedItems = {};

			// Shim until v3 -- account for FuelUX select or native select for page size:
			if ( this.$pagesize.hasClass( 'select' ) ) {
				this.$pagesize.select( 'selectByValue', this.options.dataOptions.pageSize );
				this.options.dataOptions.pageSize = parseInt( this.$pagesize.select( 'selectedItem' ).value, 10 );
			} else {
				var pageSize = this.options.dataOptions.pageSize;
				this.$pagesize.find( 'option' ).filter( function() {
					return $( this ).text() === pageSize.toString();
				} ).attr( 'selected', true );
				this.options.dataOptions.pageSize = parseInt( this.$pagesize.val(), 10 );
			}

			// Shim until v3 -- account for older search class:
			if ( this.$searchcontrol.length <= 0 ) {
				this.$searchcontrol = this.$element.find( '.search' );
			}

			this.columns = this.options.dataSource.columns();

			this.$nextpagebtn.on( 'click', $.proxy( this.next, this ) );
			this.$prevpagebtn.on( 'click', $.proxy( this.previous, this ) );
			this.$searchcontrol.on( 'searched cleared', $.proxy( this.searchChanged, this ) );
			this.$filtercontrol.on( 'changed', $.proxy( this.filterChanged, this ) );
			this.$colheader.on( 'click', 'th', $.proxy( this.headerClicked, this ) );

			if ( this.$pagesize.hasClass( 'select' ) ) {
				this.$pagesize.on( 'changed', $.proxy( this.pagesizeChanged, this ) );
			} else {
				this.$pagesize.on( 'change', $.proxy( this.pagesizeChanged, this ) );
			}

			this.$pageinput.on( 'change', $.proxy( this.pageChanged, this ) );

			this.renderColumns();

			if ( this.options.stretchHeight ) this.initStretchHeight();

			this.renderData();
		};

		Datagrid.prototype = {

			constructor: Datagrid,

			renderColumns: function() {
				var $target;

				this.$footer.attr( 'colspan', this.columns.length );
				this.$topheader.attr( 'colspan', this.columns.length );

				var colHTML = '';

				$.each( this.columns, function( index, column ) {
					colHTML += '<th data-property="' + column.property + '"';
					if ( column.sortable ) colHTML += ' class="sortable"';
					colHTML += '>' + column.label + '</th>';
				} );

				this.$colheader.append( colHTML );

				if ( this.options.dataOptions.sortProperty ) {
					$target = this.$colheader.children( 'th[data-property="' + this.options.dataOptions.sortProperty + '"]' );
					this.updateColumns( $target, this.options.dataOptions.sortDirection );
				}
			},

			updateColumns: function( $target, direction ) {
				this._updateColumns( this.$colheader, $target, direction );

				if ( this.$sizingHeader ) {
					this._updateColumns( this.$sizingHeader, this.$sizingHeader.find( 'th' ).eq( $target.index() ), direction );
				}
			},

			_updateColumns: function( $header, $target, direction ) {
				var className = ( direction === 'asc' ) ? 'icon-chevron-up' : 'icon-chevron-down';
				$header.find( 'i.datagrid-sort' ).remove();
				$header.find( 'th' ).removeClass( 'sorted' );
				$( '<i>' ).addClass( className + ' datagrid-sort' ).appendTo( $target );
				$target.addClass( 'sorted' );
			},

			getSelectedItems: function() {
				return this.selectedItems;
			},

			setSelectedItems: function( selectItems ) {
				// Here, selectItems contains the keys (strings) of items to be selected.
				// Copy those in to itemsToSelect; that array may be modified later based
				// on selection rules.
				var itemsToSelect = [];
				$.extend( true, itemsToSelect, selectItems );

				// If multiSelect is not enabled for this table and the user is
				// attempting to select more than one row, reset the selected
				// rows and then limit itemsToSelect to only its first entry.
				if ( ( this.options.multiSelect === false ) && ( itemsToSelect.length > 1 ) ) {
					this.clearSelectedItems();
					itemsToSelect.splice( 1 );
				}

				// Next, search through the data set to find those objects which
				// match any of the keys in itemsToSelect.  This will prevent
				// this.selectedItems from being loaded with faulty data.
				$.each( itemsToSelect, $.proxy( function( index, selectedItemKey ) {
					$.each( this.options.dataSource._data, $.proxy( function( index, data ) {
						if ( data[ this.options.primaryKey ].toString() === selectedItemKey.toString() ) {
							this.selectedItems[ data[ this.options.primaryKey ] ] = data;
						}
					}, this ) );
				}, this ) );

				// Finally, highlight rows based upon their "selected" status.
				$.each( this.$tbody.find( 'tr' ), $.proxy( function( index, row ) {
					if ( this.selectedItems.hasOwnProperty( $( row ).attr( 'data-id' ) ) ) {
						$( row ).addClass( 'selected' );
					}
				}, this ) );
			},

			clearSelectedItems: function() {
				// Remove highlight from any selected rows.
				$.each( this.$tbody.find( 'tr' ), function( index, row ) {
					$( row ).removeClass( 'selected' );
				} );

				this.selectedItems = {};
			},

			updatePageDropdown: function( data ) {
				var pageHTML = '';

				for ( var i = 1; i <= data.pages; i++ ) {
					pageHTML += '<li><a>' + i + '</a></li>';
				}

				this.$pagedropdown.html( pageHTML );
			},

			updatePageButtons: function( data ) {
				if ( data.page === 1 ) {
					this.$prevpagebtn.attr( 'disabled', 'disabled' );
				} else {
					this.$prevpagebtn.removeAttr( 'disabled' );
				}

				if ( data.page === data.pages ) {
					this.$nextpagebtn.attr( 'disabled', 'disabled' );
				} else {
					this.$nextpagebtn.removeAttr( 'disabled' );
				}
			},

			renderData: function() {
				var self = this;

				this.$tbody.html( this.placeholderRowHTML( this.options.loadingHTML ) );

				this.options.dataSource.data( this.options.dataOptions, function( data ) {
					if ( typeof data === 'string' ) {
						// Error-handling

						self.$footerchildren.css( 'visibility', 'hidden' );

						self.$tbody.html( self.errorRowHTML( data ) );
						self.stretchHeight();

						self.$element.trigger( 'loaded' );
						return;
					}

					var itemdesc = ( data.count === 1 ) ? self.options.itemText : self.options.itemsText;

					self.$footerchildren.css( 'visibility', function() {
						return ( data.count > 0 ) ? 'visible' : 'hidden';
					} );

					self.$pageinput.val( data.page );
					self.$pageslabel.text( data.pages );
					self.$countlabel.text( data.count + ' ' + itemdesc );
					self.$startlabel.text( data.start );
					self.$endlabel.text( data.end );

					self.updatePageDropdown( data );
					self.updatePageButtons( data );

					var multiSelect = !! self.options.multiSelect;
					var enableSelect = !! self.options.enableSelect;
					var selectedItemsKeys = [];

					if ( data.data.length === 0 ) {
						self.$tbody.html( self.placeholderRowHTML( self.options.noDataFoundHTML ) );
					} else {

						// These are the keys in the selectedItems object
						selectedItemsKeys = $.map( self.selectedItems, function( element, index ) {
							return index.toString();
						} );

						$.each( data.data, function( index, row ) {

							var $tr = $( '<tr/>' );
							$.each( self.columns, function( index, column ) {
								var $td = $( '<td/>' );
								if ( column.cssClass ) {
									$td.addClass( column.cssClass );
								}

								// The content for this first <td> is being placed
								// in a div to better control the left offset needed
								// to show the checkmark.  This div will be moved to
								// the right by 22px when the row is selected.
								if ( enableSelect && ( index === 0 ) ) {
									var $md = $( '<div/>' );
									$md.append( $( '<i/>' ).addClass( 'checked' ) );
									$md.append( row[ column.property ] );
									$td.html( $md );
								} else {
									$td.html( row[ column.property ] );
								}

								$tr.append( $td );
							} );

							if ( enableSelect ) {
								$tr.addClass( 'selectable' );
								$tr.attr( 'data-id', row[ self.options.primaryKey ] );

								if ( $.inArray( row[ self.options.primaryKey ].toString(), selectedItemsKeys ) > -1 ) {
									$tr.addClass( 'selected' );
								}
							}

							if ( index === 0 ) {
								self.$tbody.empty();
							}

							self.$tbody.append( $tr );
						} );

						if ( enableSelect ) {
							self.$tbody.find( 'tr' ).bind( 'click', function( e ) {
								var id = $( e.currentTarget ).data( 'id' );
								var currentRow;

								$.each( data.data, function( index, row ) {
									if ( id === row[ self.options.primaryKey ] ) {
										currentRow = row;
									}
								} );

								var isSelected = self.selectedItems.hasOwnProperty( id );
								if ( !multiSelect ) {
									self.clearSelectedItems();
								}

								if ( isSelected && !multiSelect ) {
									self.$element.trigger( 'itemDeselected', currentRow );
								} else if ( isSelected && multiSelect ) {
									delete self.selectedItems[ id ];
									$( e.currentTarget ).removeClass( 'selected' );
								} else {
									self.selectedItems[ id ] = currentRow;
									$( e.currentTarget ).addClass( 'selected' );
									self.$element.trigger( 'itemSelected', currentRow );
								}
							} );
						}
					}

					if ( $.trim( self.$tbody.html() ) === '' ) {
						self.$tbody.html( self.placeholderRowHTML( self.options.noDataFoundHTML ) );
					}

					self.stretchHeight();

					self.$element.trigger( 'loaded' );
				} );

			},

			errorRowHTML: function( content ) {
				return '<tr><td style="text-align:center;padding:20px 20px 0 20px;border-bottom:none;" colspan="' +
					this.columns.length + '"><div class="alert alert-error">' + content + '</div></td></tr>';
			},

			placeholderRowHTML: function( content ) {
				return '<tr><td style="text-align:center;padding:20px;border-bottom:none;" colspan="' +
					this.columns.length + '">' + content + '</td></tr>';
			},

			headerClicked: function( e ) {
				var $target = $( e.target );
				if ( !$target.hasClass( 'sortable' ) ) return;

				var direction = this.options.dataOptions.sortDirection;
				var sort = this.options.dataOptions.sortProperty;
				var property = $target.data( 'property' );

				if ( sort === property ) {
					this.options.dataOptions.sortDirection = ( direction === 'asc' ) ? 'desc' : 'asc';
				} else {
					this.options.dataOptions.sortDirection = 'asc';
					this.options.dataOptions.sortProperty = property;
				}

				this.options.dataOptions.pageIndex = 0;
				this.updateColumns( $target, this.options.dataOptions.sortDirection );
				this.renderData();
			},

			pagesizeChanged: function( e, pageSize ) {
				if ( pageSize ) {
					this.options.dataOptions.pageSize = parseInt( pageSize.value, 10 );
				} else {
					this.options.dataOptions.pageSize = parseInt( $( e.target ).val(), 10 );
				}

				this.options.dataOptions.pageIndex = 0;
				this.renderData();
			},

			pageChanged: function( e ) {
				var pageRequested = parseInt( $( e.target ).val(), 10 );
				pageRequested = ( isNaN( pageRequested ) ) ? 1 : pageRequested;
				var maxPages = this.$pageslabel.text();

				this.options.dataOptions.pageIndex =
					( pageRequested > maxPages ) ? maxPages - 1 : pageRequested - 1;

				this.renderData();
			},

			searchChanged: function( e, search ) {
				this.options.dataOptions.search = search;
				this.options.dataOptions.pageIndex = 0;
				this.renderData();
			},

			filterChanged: function( e, filter ) {
				this.options.dataOptions.filter = filter;
				this.options.dataOptions.pageIndex = 0;
				this.renderData();
			},

			previous: function() {
				this.$nextpagebtn.attr( 'disabled', 'disabled' );
				this.$prevpagebtn.attr( 'disabled', 'disabled' );
				this.options.dataOptions.pageIndex--;
				this.renderData();
			},

			next: function() {
				this.$nextpagebtn.attr( 'disabled', 'disabled' );
				this.$prevpagebtn.attr( 'disabled', 'disabled' );
				this.options.dataOptions.pageIndex++;
				this.renderData();
			},

			reload: function() {
				this.options.dataOptions.pageIndex = 0;
				this.renderData();
			},

			initStretchHeight: function() {
				this.$gridContainer = this.$element.parent();

				this.$element.wrap( '<div class="datagrid-stretch-wrapper">' );
				this.$stretchWrapper = this.$element.parent();

				this.$headerTable = $( '<table>' ).attr( 'class', this.$element.attr( 'class' ) );
				this.$footerTable = this.$headerTable.clone();

				this.$headerTable.prependTo( this.$gridContainer ).addClass( 'datagrid-stretch-header' );
				this.$thead.detach().appendTo( this.$headerTable );

				this.$sizingHeader = this.$thead.clone();
				this.$sizingHeader.find( 'tr:first' ).remove();

				this.$footerTable.appendTo( this.$gridContainer ).addClass( 'datagrid-stretch-footer' );
				this.$tfoot.detach().appendTo( this.$footerTable );
			},

			stretchHeight: function() {
				if ( !this.$gridContainer ) return;

				this.setColumnWidths();

				var targetHeight = this.$gridContainer.height();
				var headerHeight = this.$headerTable.outerHeight();
				var footerHeight = this.$footerTable.outerHeight();
				var overhead = headerHeight + footerHeight;

				this.$stretchWrapper.height( targetHeight - overhead );
			},

			setColumnWidths: function() {
				if ( !this.$sizingHeader ) return;

				this.$element.prepend( this.$sizingHeader );

				var $sizingCells = this.$sizingHeader.find( 'th' );
				var columnCount = $sizingCells.length;

				function matchSizingCellWidth( i, el ) {
					if ( i === columnCount - 1 ) return;

					var $el = $( el );
					var $sourceCell = $sizingCells.eq( i );
					var width = $sourceCell.width();

					// TD needs extra width to match sorted column header
					if ( $sourceCell.hasClass( 'sorted' ) && $el.prop( 'tagName' ) === 'TD' ) width = width + SORTED_HEADER_OFFSET;

					$el.width( width );
				}

				this.$colheader.find( 'th' ).each( matchSizingCellWidth );
				this.$tbody.find( 'tr:first > td' ).each( matchSizingCellWidth );

				this.$sizingHeader.detach();
			}
		};


		// DATAGRID PLUGIN DEFINITION

		$.fn.datagrid = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'datagrid' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'datagrid', ( data = new Datagrid( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.datagrid.defaults = {
			dataOptions: {
				pageIndex: 0,
				pageSize: 10
			},
			loadingHTML: '<div class="progress progress-striped active" style="width:50%;margin:auto;"><div class="bar" style="width:100%;"></div></div>',
			itemsText: 'items',
			itemText: 'item',
			noDataFoundHTML: '0 items'
		};

		$.fn.datagrid.Constructor = Datagrid;

		$.fn.datagrid.noConflict = function() {
			$.fn.datagrid = old;
			return this;
		};

	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Datepicker
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */

		// Should we be using Moment.JS?



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.datepicker;
		var moment = false;

		// only load moment if it's there. otherwise we'll look for it in window.moment
		// you need to make sure moment is loaded before the rest of this module

		// check if AMD is available
		if ( typeof define === 'function' && define.amd ) {
			require( [ 'moment' ], function( amdMoment ) {
				moment = amdMoment;
			}, function( err ) {
				var failedId = err.requireModules && err.requireModules[ 0 ];
				if ( failedId === 'moment' ) {
					// do nothing cause that's the point of progressive enhancement
					if ( typeof window.console !== 'undefined' ) {
						if ( window.navigator.userAgent.search( 'PhantomJS' ) < 0 ) {
							// don't show this in phantomjs tests
							window.console.log( "Don't worry if you're seeing a 404 that's looking for moment.js. The Fuel UX Datepicker is trying to use moment.js to give you extra features." );
							window.console.log( "Checkout the Fuel UX docs (http://exacttarget.github.io/fuelux/#datepicker) to see how to integrate moment.js for more features" );
						}
					}
				}
			} );
		}

		// DATEPICKER CONSTRUCTOR AND PROTOTYPE

		var Datepicker = function( element, options ) {
			this.$element = $( element );

			this.options = $.extend( true, {}, $.fn.datepicker.defaults, options );

			this.formatDate = this.options.formatDate || this.formatDate;
			this.parseDate = this.options.parseDate || this.parseDate;
			this.blackoutDates = this.options.blackoutDates || this.blackoutDates;

			// moment set up for parsing input dates
			if ( this._checkForMomentJS() ) {
				moment = moment || window.moment; // need to pull in the global moment if they didn't do it via require
				this.moment = true;
				this.momentFormat = this.options.momentConfig.formatCode;
				this.setCulture( this.options.momentConfig.culture );
			}

			if ( this.options.date !== null ) {
				this.date = this.options.date || new Date();
				this.date = this.parseDate( this.date, false );
				this.viewDate = new Date( this.date.valueOf() );
				this.stagedDate = new Date( this.date.valueOf() );
			} else {
				this.date = null;
				this.viewDate = new Date();
				this.stagedDate = new Date();
			}

			this.inputParsingTarget = null;

			this.viewDate.setHours( 0, 0, 0, 0 );
			this.stagedDate.setHours( 0, 0, 0, 0 );

			this.done = false;

			this.minDate = new Date();
			this.minDate.setDate( this.minDate.getDate() - 1 );
			this.minDate.setHours( 0, 0, 0, 0 );

			this.maxDate = new Date();
			this.maxDate.setFullYear( this.maxDate.getFullYear() + 10 );
			this.maxDate.setHours( 23, 59, 59, 999 );

			this.years = this._yearRange( this.viewDate );

			this.bindingsAdded = false;

			// OPTIONS
			this.options.dropdownWidth = this.options.dropdownWidth || 170;
			this.options.monthNames = this.options.monthNames || [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			this.options.weekdays = this.options.weekdays || [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ];

			this.options.showYears = false;
			this.options.showDays = true;
			this.options.showMonths = false;

			this.options.restrictLastMonth = Boolean( this.options.restrictDateSelection );
			this.options.restrictNextMonth = false;

			this.options.restrictToYear = this.options.restrictToYear || null;

			this.months = [ {
				abbreviation: this.options.monthNames[ 0 ],
				'class': '',
				number: 0
			}, {
				abbreviation: this.options.monthNames[ 1 ],
				'class': '',
				number: 1
			}, {
				abbreviation: this.options.monthNames[ 2 ],
				'class': '',
				number: 2
			}, {
				abbreviation: this.options.monthNames[ 3 ],
				'class': '',
				number: 3
			}, {
				abbreviation: this.options.monthNames[ 4 ],
				'class': '',
				number: 4
			}, {
				abbreviation: this.options.monthNames[ 5 ],
				'class': '',
				number: 5
			}, {
				abbreviation: this.options.monthNames[ 6 ],
				'class': '',
				number: 6
			}, {
				abbreviation: this.options.monthNames[ 7 ],
				'class': '',
				number: 7
			}, {
				abbreviation: this.options.monthNames[ 8 ],
				'class': '',
				number: 8
			}, {
				abbreviation: this.options.monthNames[ 9 ],
				'class': '',
				number: 9
			}, {
				abbreviation: this.options.monthNames[ 10 ],
				'class': '',
				number: 10
			}, {
				abbreviation: this.options.monthNames[ 11 ],
				'class': '',
				number: 11
			} ];

			// rendering the calendar
			this._render();
		};

		Datepicker.prototype = {

			constructor: Datepicker,

			// functions that can be called on object
			disable: function() {
				this.$element.find( 'input, button' ).attr( 'disabled', true );
				this._showDropdow( false );
			},

			enable: function() {
				this.$element.find( 'input, button' ).attr( 'disabled', false );
				this._showDropdow( true );
			},

			_showDropdow: function( disable ) {
				if ( !Boolean( disable ) ) {
					this.$element.on( 'show.bs.dropdown', function( event ) {
						event.preventDefault();
					} );
				} else {
					this.$element.off( 'show.bs.dropdown' );
				}
			},

			getFormattedDate: function() {
				return this.formatDate( this.date );
			},

			getDate: function( options ) {
				if ( Boolean( options ) && Boolean( options.unix ) ) {
					return this.date.getTime();
				} else {
					return this.date;
				}
			},

			setDate: function( date ) {
				this.date = this.parseDate( date, false );
				this.stagedDate = this.date;
				this.viewDate = this.date;
				this._render();
				this.$element.trigger( 'changed', this.date );
				return this.date;
			},

			getCulture: function() {
				if ( Boolean( this.moment ) ) {
					return moment.lang();
				} else {
					throw "moment.js is not available so you cannot use this function";
				}
			},

			setCulture: function( cultureCode ) {
				if ( !Boolean( cultureCode ) ) {
					return false;
				}
				if ( Boolean( this.moment ) ) {
					moment.lang( cultureCode );
				} else {
					throw "moment.js is not available so you cannot use this function";
				}
			},

			getFormatCode: function() {
				if ( Boolean( this.moment ) ) {
					return this.momentFormat;
				} else {
					throw "moment.js is not available so you cannot use this function";
				}
			},

			setFormatCode: function( formatCode ) {
				if ( !Boolean( formatCode ) ) {
					return false;
				}
				if ( Boolean( this.moment ) ) {
					this.momentFormat = formatCode;
				} else {
					throw "moment.js is not available so you cannot use this function";
				}
			},

			formatDate: function( date ) {
				// if we have moment available use it to format dates. otherwise use default
				if ( Boolean( this.moment ) ) {
					return moment( date ).format( this.momentFormat );
				} else {
					// this.pad to is function on extension
					return this.padTwo( date.getMonth() + 1 ) + '-' + this.padTwo( date.getDate() ) + '-' + date.getFullYear();
				}
			},

			//some code ripped from http://stackoverflow.com/questions/2182246/javascript-dates-in-ie-nan-firefox-chrome-ok
			parseDate: function( date, silent ) {
				// if we have moment, use that to parse the dates
				if ( this.moment ) {
					silent = silent || false;
					// if silent is requested (direct user input parsing) return true or false not a date object, otherwise return a date object
					if ( silent ) {
						if ( moment( date ).toDate().toString() === "Invalid Date" ) {
							return false;
						} else {
							return true;
						}
					} else {
						return moment( date ).toDate(); //example of using moment for parsing
					}
				} else {
					// if moment isn't present, use previous date parsing strategry
					var dt, isoExp, month, parts;

					if ( Boolean( date ) && new Date( date ).toString() !== 'Invalid Date' ) {
						if ( typeof( date ) === 'string' ) {
							date = date.split( 'T' )[ 0 ];
							isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/;
							dt = new Date( NaN );
							parts = isoExp.exec( date );

							if ( parts ) {
								month = +parts[ 2 ];
								dt.setFullYear( parts[ 1 ], month - 1, parts[ 3 ] );
								if ( month !== dt.getMonth() + 1 ) {
									dt.setTime( NaN );
								}
							}
							return dt;
						}
						return new Date( date );
					} else {
						throw new Error( 'could not parse date' );
					}
				}
			},

			blackoutDates: function( date ) {
				date = date;
				return false;
			},

			padTwo: function( value ) {
				var s = '0' + value;
				return s.substr( s.length - 2 );
			},

			_setNullDate: function( showStagedDate ) {
				this.date = null;
				this.viewDate = new Date();
				this.stagedDate = new Date();
				this._insertDateIntoInput( showStagedDate || "" );
				this._renderWithoutInputManipulation();
			},

			_restrictDateSelectionSetup: function() {
				var scopedLastMonth, scopedNextMonth;
				if ( Boolean( this.options ) ) {
					if ( !this.options.restrictDateSelection ) {
						scopedLastMonth = false;
						scopedNextMonth = false;
					} else {
						scopedNextMonth = ( this.viewDate.getMonth() < new Date().getMonth() ) ? true : false;
						scopedLastMonth = ( this.viewDate.getMonth() > new Date().getMonth() ) ? false : true;
					}
				}
				this.options.restrictLastMonth = scopedLastMonth;
				this.options.restrictNextMonth = scopedNextMonth;
			},

			_processDateRestriction: function( date, returnClasses ) {
				var classes = '';
				var restrictBoolean = false;
				returnClasses = returnClasses || false;

				if ( this.options.restrictToYear && this.options.restrictToYear !== date.getFullYear() ) {
					classes += ' restrict';
					restrictBoolean = true;
				} else if ( date <= this.minDate || date >= this.maxDate ) {
					if ( Boolean( this.blackoutDates( date ) ) ) {
						classes += ' restrict blackout';
						restrictBoolean = true;
					} else if ( Boolean( this.options ) && Boolean( this.options.restrictDateSelection ) ) {
						classes += ' restrict';
						restrictBoolean = true;
					} else {
						classes += ' past';
					}
				} else if ( Boolean( this.blackoutDates( date ) ) ) {
					classes += ' restrict blackout';
					restrictBoolean = true;
				}
				if ( Boolean( returnClasses ) ) {
					return classes;
				} else {
					return restrictBoolean;
				}
			},

			_repeat: function( head, collection, iterator, tail ) {
				var value = head;
				for ( var i = 0, ii = collection.length; i < ii; i++ ) {
					value += iterator( collection[ i ] );
				}
				value += tail;
				return value;
			},

			_getDaysInMonth: function( month, year ) {
				return 32 - new Date( year, month, 32 ).getDate();
			},

			_range: function( start, end ) {
				var numbers = [];
				for ( var i = start; i < end; i++ ) {
					numbers[ numbers.length ] = i;
				}
				return numbers;
			},

			_yearRange: function( date ) {
				var start = ( Math.floor( date.getFullYear() / 10 ) * 10 ) - 1;
				var end = start + 12;
				var years = this._range( start, end );
				var interval = [];

				for ( var i = 0, ii = years.length; i < ii; i++ ) {
					var clazz = '';
					if ( i === 0 ) {
						clazz = 'previous';
					}
					if ( i === years.length - 1 ) {
						clazz = 'next';
					}
					interval[ i ] = {
						number: years[ i ],
						'class': clazz
					};
				}
				return interval;
			},

			_killEvent: function( e ) {
				e.stopPropagation();
				e.preventDefault();
				return false;
			},

			_applySize: function( elements, size ) {
				for ( var i = 0; i < elements.length; i++ ) {
					$( elements[ i ] ).css( {
						'width': size,
						'height': size,
						'line-height': size
					} );
				}
			},

			_show: function( show ) {
				return show ? '' : 'display: none;';
			},

			_hide: function( hide ) {
				return this._show( !hide );
			},

			_showView: function( view ) {
				if ( view === 1 ) {
					this.options.showDays = true;
					this.options.showMonths = false;
					this.options.showYears = false;
				} else if ( view === 2 ) {
					this.options.showDays = false;
					this.options.showMonths = true;
					this.options.showYears = false;
				} else if ( view === 3 ) {
					this.options.showDays = false;
					this.options.showMonths = false;
					this.options.showYears = true;
				}
			},

			_updateCalendarData: function() {
				var viewedMonth = this.viewDate.getMonth();
				var viewedYear = this.viewDate.getFullYear();
				var selectedDay = this.stagedDate.getDate();
				var selectedMonth = this.stagedDate.getMonth();
				var selectedYear = this.stagedDate.getFullYear();
				var firstDayOfMonthWeekday = new Date( viewedYear, viewedMonth, 1 ).getDay();
				var lastDayOfMonth = this._getDaysInMonth( viewedMonth, viewedYear );
				var lastDayOfLastMonth = this._getDaysInMonth( viewedMonth - 1, viewedYear );

				if ( firstDayOfMonthWeekday === 0 ) {
					firstDayOfMonthWeekday = 7;
				}

				var addToEnd = ( 42 - lastDayOfMonth ) - firstDayOfMonthWeekday;

				this.daysOfLastMonth = this._range( lastDayOfLastMonth - firstDayOfMonthWeekday + 1, lastDayOfLastMonth + 1 );
				this.daysOfNextMonth = this._range( 1, addToEnd + 1 );

				// blackout functionality for dates of last month on current calendar view
				for ( var x = 0, xx = this.daysOfLastMonth.length; x < xx; x++ ) {
					var tmpLastMonthDaysObj = {};
					tmpLastMonthDaysObj.number = this.daysOfLastMonth[ x ];
					tmpLastMonthDaysObj[ 'class' ] = '';
					tmpLastMonthDaysObj[ 'class' ] = this._processDateRestriction( new Date( viewedYear, viewedMonth + 1, this.daysOfLastMonth[ x ], 0, 0, 0, 0 ), true );
					tmpLastMonthDaysObj[ 'class' ] += ' past';
					this.daysOfLastMonth[ x ] = tmpLastMonthDaysObj;
				}

				// blackout functionality for dates of next month on current calendar view
				for ( var b = 0, bb = this.daysOfNextMonth.length; b < bb; b++ ) {
					var tmpNextMonthDaysObj = {};
					tmpNextMonthDaysObj.number = this.daysOfNextMonth[ b ];
					tmpNextMonthDaysObj[ 'class' ] = '';
					tmpNextMonthDaysObj[ 'class' ] = this._processDateRestriction( new Date( viewedYear, viewedMonth + 1, this.daysOfNextMonth[ b ], 0, 0, 0, 0 ), true );
					this.daysOfNextMonth[ b ] = tmpNextMonthDaysObj;
				}

				var now = new Date();
				var currentDay = now.getDate();
				var currentMonth = now.getMonth();
				var currentYear = now.getFullYear();
				var viewingCurrentMonth = viewedMonth === currentMonth;
				var viewingCurrentYear = viewedYear === currentYear;
				var viewingSelectedMonth = viewedMonth === selectedMonth;
				var viewingSelectedYear = viewedYear === selectedYear;

				var daysOfThisMonth = this._range( 1, lastDayOfMonth + 1 );
				this.daysOfThisMonth = [];

				for ( var i = 0, ii = daysOfThisMonth.length; i < ii; i++ ) {

					var weekDay = new Date( viewedYear, viewedMonth, daysOfThisMonth[ i ] ).getDay();
					var weekDayClass = 'weekday';

					if ( weekDay === 6 || weekDay === 0 ) {
						weekDayClass = 'weekend';
					}
					if ( weekDay === 1 ) {
						weekDayClass = '';
					}
					weekDayClass += ' weekday' + weekDay;

					if ( daysOfThisMonth[ i ] === selectedDay && viewingSelectedMonth && viewingSelectedYear ) {
						weekDayClass += ' selected';
					} else if ( daysOfThisMonth[ i ] === currentDay && viewingCurrentMonth && viewingCurrentYear ) {
						weekDayClass += ' today';
					}

					var dt = new Date( viewedYear, viewedMonth, daysOfThisMonth[ i ], 0, 0, 0, 0 );
					weekDayClass += this._processDateRestriction( dt, true );

					this.daysOfThisMonth[ this.daysOfThisMonth.length ] = {
						'number': daysOfThisMonth[ i ],
						'class': weekDayClass
					};
				}

				var daysInMonth = this._getDaysInMonth( this.minDate.getFullYear(), this.minDate.getMonth() );
				for ( var j = 0, jj = this.months.length; j < jj; j++ ) {

					this.months[ j ][ 'class' ] = '';
					if ( viewingCurrentYear && j === currentMonth ) {
						this.months[ j ][ 'class' ] += ' today';
					}
					if ( j === selectedMonth && viewingSelectedYear ) {
						this.months[ j ][ 'class' ] += ' selected';
					}

					var minDt = new Date( viewedYear, j, daysInMonth, 23, 59, 59, 999 );
					var maxDt = new Date( viewedYear, j, 0, 0, 0, 0, 0 );
					if ( minDt <= this.minDate || maxDt >= this.maxDate ) {
						if ( Boolean( this.options.restrictDateSelection ) ) {
							this.months[ j ][ 'class' ] += ' restrict';
						}
					}
				}

				this.years = this._yearRange( this.viewDate );
				daysInMonth = this._getDaysInMonth( this.minDate.getFullYear(), 11 );

				for ( var z = 0, zz = this.years.length; z < zz; z++ ) {
					if ( this.years[ z ].number === currentYear ) {
						this.years[ z ][ 'class' ] += ' today';
					}
					if ( this.years[ z ].number === selectedYear ) {
						this.years[ z ][ 'class' ] += ' selected';
					}

					var minDt2 = new Date( this.years[ z ].number, 11, daysInMonth, 23, 59, 59, 999 );
					var maxDt2 = new Date( this.years[ z ].number, 0, 0, 0, 0, 0, 0 );
					if ( minDt2 <= this.minDate || maxDt2 >= this.maxDate ) {
						if ( Boolean( this.options.restrictDateSelection ) ) {
							this.years[ z ][ 'class' ] += ' restrict';
						}
					}
				}
			},

			_updateCss: function() {
				while ( this.options.dropdownWidth % 7 !== 0 ) {
					this.options.dropdownWidth++;
				}

				this.$view.css( 'width', this.options.dropdownWidth + 'px' );
				this.$header.css( 'width', this.options.dropdownWidth + 'px' );
				this.$labelDiv.css( 'width', ( this.options.dropdownWidth - 60 ) + 'px' );
				this.$footer.css( 'width', this.options.dropdownWidth + 'px' );
				var labelSize = ( this.options.dropdownWidth * 0.25 );
				var paddingTop = Math.round( ( this.options.dropdownWidth - ( labelSize * 3 ) ) / 2 );
				var paddingBottom = paddingTop;
				while ( paddingBottom + paddingTop + ( labelSize * 3 ) < this.options.dropdownWidth ) {
					paddingBottom += 0.1;
				}
				while ( paddingBottom + paddingTop + ( labelSize * 3 ) > this.options.dropdownWidth ) {
					paddingBottom -= 0.1;
				}

				paddingTop = parseInt( paddingTop / 2, 10 );
				paddingBottom = parseInt( paddingBottom / 2, 10 );

				this.$calendar.css( {
					'float': 'left'
				} );

				this.$monthsView.css( {
					'width': this.options.dropdownWidth + 'px',
					'padding-top': paddingTop + 'px',
					'padding-bottom': paddingBottom + 'px'
				} );

				this.$yearsView.css( {
					'width': this.options.dropdownWidth + 'px',
					'padding-top': paddingTop + 'px',
					'padding-bottom': paddingBottom + 'px'
				} );

				var cellSize = Math.round( this.options.dropdownWidth / 7.0 ) + 'px';
				var headerCellSize = Math.round( this.options.dropdownWidth / 7.0 ) + 'px';
				this._applySize( this.$yearsView.children(), labelSize + 'px' );
				this._applySize( this.$monthsView.children(), labelSize + 'px' );
				this._applySize( this.$weekdaysDiv.children(), headerCellSize );
				this._applySize( this.$lastMonthDiv.children(), cellSize );
				this._applySize( this.$thisMonthDiv.children(), cellSize );
				this._applySize( this.$nextMonthDiv.children(), cellSize );
			},

			_close: function() {
				this.$input.dropdown( 'toggle' );
			},

			_select: function( e ) {
				this.inputParsingTarget = null;
				if ( e.target.className.indexOf( 'restrict' ) > -1 ) {
					return this._killEvent( e );
				} else {
					this._killEvent( e );
					this._close();
				}

				this.stagedDate = this.viewDate;
				this.stagedDate.setDate( parseInt( e.target.innerHTML, 10 ) );

				this.setDate( this.stagedDate );
				this.done = true;
			},

			_pickYear: function( e ) {
				var year = parseInt( $( e.target ).data( 'yearNumber' ), 10 );
				if ( e.target.className.indexOf( 'restrict' ) > -1 ) {
					return this._killEvent( e );
				}

				this.viewDate = new Date( year, this.viewDate.getMonth(), 1 );
				this._showView( 2 );
				this._render();

				return this._killEvent( e );
			},

			_pickMonth: function( e ) {
				var month = parseInt( $( e.target ).data( 'monthNumber' ), 10 );
				if ( e.target.className.indexOf( 'restrict' ) > -1 ) {
					return this._killEvent( e );
				}

				this.viewDate = new Date( this.viewDate.getFullYear(), month, 1 );
				this._showView( 1 );
				this._render();

				return this._killEvent( e );
			},

			_previousSet: function( e ) {
				this._previous( e, true );
			},

			_previous: function( e, set ) {
				if ( e.target.className.indexOf( 'restrict' ) > -1 ) {
					return this._killEvent( e );
				}

				if ( this.options.showDays ) {
					this.viewDate = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1 );
				} else if ( this.options.showMonths ) {
					this.viewDate = new Date( this.viewDate.getFullYear() - 1, this.viewDate.getMonth(), 1 );
				} else if ( this.options.showYears ) {
					this.viewDate = new Date( this.viewDate.getFullYear() - 10, this.viewDate.getMonth(), 1 );
				}

				if ( Boolean( set ) ) {
					this._select( e );
				} else {
					this._render();
				}
				// move this below 'this._render()' if you want it to go to the previous month when you select a day from the current month
				return this._killEvent( e );
			},

			_nextSet: function( e ) {
				this._next( e, true );
			},

			_next: function( e, set ) {
				if ( e.target.className.indexOf( 'restrict' ) > -1 ) {
					return this._killEvent( e );
				}

				if ( this.options.showDays ) {
					this.viewDate = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1 );
				} else if ( this.options.showMonths ) {
					this.viewDate = new Date( this.viewDate.getFullYear() + 1, this.viewDate.getMonth(), 1 );
				} else if ( this.options.showYears ) {
					this.viewDate = new Date( this.viewDate.getFullYear() + 10, this.viewDate.getMonth(), 1 );
				}

				if ( Boolean( set ) ) {
					this._select( e );
				} else {
					this._render();
				}
				// move this below 'this._render()' if you want it to go to the next month when you select a day from the current month
				return this._killEvent( e );
			},

			_today: function( e ) {
				this.viewDate = new Date();
				this._showView( 1 );
				this._render();
				return this._killEvent( e );
			},

			_emptySpace: function( e ) {
				if ( Boolean( this.done ) ) {
					this.done = false;
				}
				return this._killEvent( e );
			},

			_monthLabel: function() {
				return this.options.monthNames[ this.viewDate.getMonth() ];
			},

			_yearLabel: function() {
				return this.viewDate.getFullYear();
			},

			_monthYearLabel: function() {
				var label;
				if ( this.options.showDays ) {
					label = this._monthLabel() + ' ' + this._yearLabel();
				} else if ( this.options.showMonths ) {
					label = this._yearLabel();
				} else if ( this.options.showYears ) {
					label = this.years[ 0 ].number + ' - ' + this.years[ this.years.length - 1 ].number;
				}
				return label;
			},

			_toggleMonthYearPicker: function( e ) {
				if ( this.options.showDays ) {
					this._showView( 2 );
				} else if ( this.options.showMonths && !this.options.restrictToYear ) {
					this._showView( 3 );
				} else if ( this.options.showYears ) {
					this._showView( 1 );
				}
				this._render();
				return this._killEvent( e );
			},

			_renderCalendar: function() {
				var self = this;
				self._restrictDateSelectionSetup();

				return '<div class="calendar">' +
					'<div class="header clearfix">' +
					'<div class="left hover"><div class="leftArrow"></div></div>' +
					'<div class="right hover"><div class="rightArrow"></div></div>' +
					'<div class="center hover">' + self._monthYearLabel() + '</div>' +
					'</div>' +
					'<div class="daysView" style="' + self._show( self.options.showDays ) + '">' +

				self._repeat( '<div class="weekdays">', self.options.weekdays,
					function( weekday ) {
						return '<div >' + weekday + '</div>';
					}, '</div>' ) +

				self._repeat( '<div class="lastmonth">', self.daysOfLastMonth,
					function( day ) {
						if ( self.options.restrictLastMonth ) {
							day[ 'class' ] = day[ 'class' ].replace( 'restrict', '' ) + " restrict";
						}
						return '<div class="' + day[ 'class' ] + '">' + day.number + '</div>';
					}, '</div>' ) +

				self._repeat( '<div class="thismonth">', self.daysOfThisMonth,
					function( day ) {
						return '<div class="' + day[ 'class' ] + '">' + day.number + '</div>';
					}, '</div>' ) +

				self._repeat( '<div class="nextmonth">', self.daysOfNextMonth,
					function( day ) {
						if ( self.options.restrictNextMonth ) {
							day[ 'class' ] = day[ 'class' ].replace( 'restrict', '' ) + " restrict";
						}
						return '<div class="' + day[ 'class' ] + '">' + day.number + '</div>';
					}, '</div>' ) +
					'</div>' +

				self._repeat( '<div class="monthsView" style="' + self._show( self.options.showMonths ) + '">', self.months,
					function( month ) {
						return '<div data-month-number="' + month.number +
							'" class="' + month[ 'class' ] + '">' + month.abbreviation + '</div>';
					}, '</div>' ) +

				self._repeat( '<div class="yearsView" style="' + self._show( self.options.showYears ) + '">', self.years,
					function( year ) {
						return '<div data-year-number="' + year.number +
							'" class="' + year[ 'class' ] + '">' + year.number + '</div>';
					}, '</div>' ) +

				'<div class="footer">' +
					'<div class="center hover">Today</div>' +
					'</div>' +
					'</div>';
			},

			_render: function() {
				this._insertDateIntoInput();
				this._updateCalendarData();
				if ( Boolean( this.bindingsAdded ) ) this._removeBindings();
				this.$element.find( '.dropdown-menu' ).html( this._renderCalendar() );
				this._initializeCalendarElements();
				this._addBindings();
				this._updateCss();
			},

			_renderWithoutInputManipulation: function() {
				this._updateCalendarData();
				if ( Boolean( this.bindingsAdded ) ) this._removeBindings();
				this.$element.find( '.dropdown-menu' ).html( this._renderCalendar() );
				this._initializeCalendarElements();
				this._addBindings();
				this._updateCss();
			},

			_calculateInputSize: function( options ) {
				if ( Boolean( parseInt( this.options.createInput.inputSize, 10 ) ) ) {
					return 'style="width:' + this.options.createInput.inputSize + 'px"';
				} else {
					options = ( Boolean( options ) ) ? " " + options.join( ' ' ) : '';
					return 'class="' + this.options.createInput.inputSize + options + '"';
				}

			},

			_insertDateIntoInput: function( showStagedDate ) {
				var displayDate;
				if ( Boolean( showStagedDate ) ) {
					displayDate = this.formatDate( this.stagedDate );
				} else if ( this.date !== null ) {
					displayDate = this.formatDate( this.date );
				} else {
					displayDate = '';
				}
				this.$element.find( 'input[type="text"]' ).val( displayDate );
			},

			_inputDateParsing: function() {
				// the formats we support when using moment.js are either "L" or "l"
				// these can be found here http://momentjs.com/docs/#/customization/long-date-formats/
				var inputValue = this.$input.val();
				var triggerError = true;
				var validLengthMax = 10; // since the length of the longest date format we are going to parse is 10 ("L" format code) we will set this here.
				var validLengthMin = validLengthMax - 2; // since the shortest date format we are going to parse is 8 ("l" format code) we will subtract the difference from the max

				if ( inputValue.length >= validLengthMin && inputValue.length <= validLengthMax ) {
					if ( Boolean( this.parseDate( inputValue, true ) ) ) {
						if ( !this._processDateRestriction( this.parseDate( inputValue ) ) ) {
							triggerError = false;
							this.setDate( inputValue );
						}
					}
				} else {
					triggerError = false; // don't want to trigger an error because they don't have the correct length
				}

				if ( !! triggerError ) {
					// we will insert the staged date into the input
					this._setNullDate( true );
					this.$element.trigger( 'inputParsingFailed' );
				}
			},

			_checkForMomentJS: function() {
				// this function get's run on initialization to determin if momentjs is available
				if ( $.isFunction( window.moment ) || ( typeof moment !== "undefined" && $.isFunction( moment ) ) ) {
					if ( $.isPlainObject( this.options.momentConfig ) ) {
						if ( Boolean( this.options.momentConfig.culture ) && Boolean( this.options.momentConfig.formatCode ) ) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					return false;
				}
			},

			_initializeCalendarElements: function() {
				this.$input = this.$element.find( 'input[type="text"]' );
				this.$calendar = this.$element.find( 'div.calendar' );
				this.$header = this.$calendar.children().eq( 0 );
				this.$labelDiv = this.$header.children().eq( 2 );
				this.$view = this.$calendar.children().eq( 1 );
				this.$monthsView = this.$calendar.children().eq( 2 );
				this.$yearsView = this.$calendar.children().eq( 3 );
				this.$weekdaysDiv = this.$view.children().eq( 0 );
				this.$lastMonthDiv = this.$view.children().eq( 1 );
				this.$thisMonthDiv = this.$view.children().eq( 2 );
				this.$nextMonthDiv = this.$view.children().eq( 3 );
				this.$footer = this.$calendar.children().eq( 4 );
			},

			_addBindings: function() {
				var self = this;

				// parsing dates on user input is only available when momentjs is used
				if ( Boolean( this.moment ) ) {
					this.$calendar.on( 'mouseover', function() {
						self.inputParsingTarget = 'calendar';
					} );
					this.$calendar.on( 'mouseout', function() {
						self.inputParsingTarget = null;
					} );

					this.$input.on( 'blur', function() {
						if ( self.inputParsingTarget === null ) {
							self._inputDateParsing();
						}
					} );
				}

				this.$calendar.on( 'click', $.proxy( this._emptySpace, this ) );

				if ( this.options.restrictToYear !== this.viewDate.getFullYear() || this.viewDate.getMonth() > 0 ) {
					this.$header.find( '.left' ).on( 'click', $.proxy( this._previous, this ) );
				} else {
					this.$header.find( '.left' ).addClass( 'disabled' );
				}

				if ( this.options.restrictToYear !== this.viewDate.getFullYear() || this.viewDate.getMonth() < 11 ) {
					this.$header.find( '.right' ).on( 'click', $.proxy( this._next, this ) );
				} else {
					this.$header.find( '.right' ).addClass( 'disabled' );
				}

				this.$header.find( '.center' ).on( 'click', $.proxy( this._toggleMonthYearPicker, this ) );

				this.$lastMonthDiv.find( 'div' ).on( 'click', $.proxy( this._previousSet, this ) );
				this.$thisMonthDiv.find( 'div' ).on( 'click', $.proxy( this._select, this ) );
				this.$nextMonthDiv.find( 'div' ).on( 'click', $.proxy( this._nextSet, this ) );

				this.$monthsView.find( 'div' ).on( 'click', $.proxy( this._pickMonth, this ) );
				this.$yearsView.find( 'div' ).on( 'click', $.proxy( this._pickYear, this ) );
				this.$footer.find( '.center' ).on( 'click', $.proxy( this._today, this ) );

				this.bindingsAdded = true;
			},

			_removeBindings: function() {
				// remove event only if moment is available (meaning it was initialized in the first place)
				if ( Boolean( this.moment ) ) {
					this.$calendar.off( 'mouseover' );
					this.$calendar.off( 'mouseout' );
					this.$input.off( 'blur' );
				}

				this.$calendar.off( 'click' );

				this.$header.find( '.left' ).off( 'click' );
				this.$header.find( '.right' ).off( 'click' );
				this.$header.find( '.center' ).off( 'click' );

				this.$lastMonthDiv.find( 'div' ).off( 'click' );
				this.$thisMonthDiv.find( 'div' ).off( 'click' );
				this.$nextMonthDiv.find( 'div' ).off( 'click' );

				this.$monthsView.find( 'div' ).off( 'click' );
				this.$yearsView.find( 'div' ).off( 'click' );
				this.$footer.find( '.center' ).off( 'click' );

				this.bindingsAdded = false;
			}
		};


		// DATEPICKER PLUGIN DEFINITION

		$.fn.datepicker = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'datepicker' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'datepicker', ( data = new Datepicker( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.datepicker.defaults = {
			date: new Date(),
			momentConfig: {
				culture: 'en',
				formatCode: 'L' // more formats can be found here http://momentjs.com/docs/#/customization/long-date-formats/. We only support "L" or "l"
			},
			dropdownWidth: 170,
			restrictDateSelection: true
		};

		$.fn.datepicker.Constructor = Datepicker;

		$.fn.datepicker.noConflict = function() {
			$.fn.datepicker = old;
			return this;
		};


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Loader
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		if ( window && !window.fuelux_loader ) {
			var Loader = function() {
				var count = 0;
				var start = function( id, loader ) {
					var bTag, cycle;

					cycle = function( i, item ) {
						item.innerHTML = '&#992' + i + ';';
						i++;
						if ( i === 9 ) {
							i = 1;
						}
						setTimeout( function() {
							cycle( i, item );
						}, 125 );
					};

					loader.className += " iefix";

					bTag = "loader_" + id;
					loader.innerHTML = '<span>&#9920;</span><b id="' + bTag + '"></b>' + loader.innerHTML;

					bTag = document.getElementById( bTag );
					cycle( 1, bTag );
					loader.setAttribute( 'data-initialized', 'true' );
				};

				this.scan = function() {
					var loaders = document.querySelectorAll( '.loader' );
					var i, l;

					for ( i = 0, l = loaders.length; i < l; i++ ) {
						if ( loaders[ i ].getAttribute( 'data-initialized' ) !== 'true' ) {
							count++;
							start( count, loaders[ i ] );
						}
					}
				};
			};

			window.fuelux_loader = new Loader();
		}


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Pillbox
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.pillbox;

		// PILLBOX CONSTRUCTOR AND PROTOTYPE

		var Pillbox = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.pillbox.defaults, options );
			this.$element.on( 'click', 'li', $.proxy( this.itemclicked, this ) );
		};

		Pillbox.prototype = {
			constructor: Pillbox,

			items: function() {
				return this.$element.find( 'li' ).map( function() {
					var $this = $( this );
					return $.extend( {
						text: $this.text()
					}, $this.data() );
				} ).get();
			},

			itemclicked: function( e ) {
				var $li = $( e.currentTarget );
				var data = $.extend( {
					text: $li.html()
				}, $li.data() );

				$li.remove();
				e.preventDefault();

				this.$element.trigger( 'removed', data );
			},

			itemCount: function() {
				return this.$element.find( 'li' ).length;
			},

			addItem: function( text, value ) {
				value = value || text;
				var $li = $( '<li data-value="' + value + '">' + text + '</li>' );

				if ( this.$element.find( 'ul' ).length > 0 ) {
					this.$element.find( 'ul' ).append( $li );
				} else {
					this.$element.append( $li );
				}

				this.$element.trigger( 'added', {
					text: text,
					value: value
				} );

				return $li;
			},

			removeBySelector: function( selector, trigger ) {
				if ( typeof trigger === "undefined" ) {
					trigger = true;
				}

				this.$element.find( 'ul' ).find( selector ).remove();

				if ( !! trigger ) {
					this._removePillTrigger( {
						method: 'removeBySelector',
						removedSelector: selector
					} );
				}
			},

			removeByValue: function( value ) {
				var selector = 'li[data-value="' + value + '"]';

				this.removeBySelector( selector, false );
				this._removePillTrigger( {
					method: 'removeByValue',
					removedValue: value
				} );
			},

			removeByText: function( text ) {
				var selector = 'li:contains("' + text + '")';

				this.removeBySelector( selector, false );
				this._removePillTrigger( {
					method: 'removeByText',
					removedText: text
				} );
			},

			clear: function() {
				this.$element.find( 'ul' ).empty();
			},

			_removePillTrigger: function( removedBy ) {
				this.$element.trigger( 'removed', removedBy );
			}
		};

		// PILLBOX PLUGIN DEFINITION

		$.fn.pillbox = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'pillbox' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'pillbox', ( data = new Pillbox( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.pillbox.defaults = {};

		$.fn.pillbox.Constructor = Pillbox;

		$.fn.pillbox.noConflict = function() {
			$.fn.pillbox = old;
			return this;
		};


		// PILLBOX DATA-API

		$( function() {
			$( 'body' ).on( 'mousedown.pillbox.data-api', '.pillbox', function() {
				var $this = $( this );
				if ( $this.data( 'pillbox' ) ) return;
				$this.pillbox( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Radio
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.radio;

		// RADIO CONSTRUCTOR AND PROTOTYPE

		var Radio = function( element, options ) {
			this.options = $.extend( {}, $.fn.radio.defaults, options );

			// cache elements
			this.$radio = $( element );
			this.$label = this.$radio.parent();
			this.groupName = this.$radio.attr( 'name' );
			this.$parent = this.$label.parent( '.radio' );

			if ( this.$parent.length === 0 ) {
				this.$parent = null;
			}

			// set default state
			this.setState( this.$radio );

			// handle events
			this.$radio.on( 'change', $.proxy( this.itemchecked, this ) );
		};

		Radio.prototype = {

			constructor: Radio,

			setState: function( $radio ) {
				$radio = $radio || this.$radio;

				var checked = $radio.is( ':checked' );
				var disabled = !! $radio.prop( 'disabled' );

				this.$label.removeClass( 'checked' );
				if ( this.$parent ) {
					this.$parent.removeClass( 'checked disabled' );
				}

				// set state of radio
				if ( checked === true ) {
					this.$label.addClass( 'checked' );
					if ( this.$parent ) {
						this.$parent.addClass( 'checked' );
					}
				}
				if ( disabled === true ) {
					this.$label.addClass( 'disabled' );
					if ( this.$parent ) {
						this.$parent.addClass( 'disabled' );
					}
				}
			},

			resetGroup: function() {
				var group = $( 'input[name="' + this.groupName + '"]' );

				group.each( function() {
					var lbl = $( this ).parent( 'label' );
					lbl.removeClass( 'checked' );
					lbl.parent( '.radio' ).removeClass( 'checked' );
				} );
			},

			enable: function() {
				this.$radio.attr( 'disabled', false );
				this.$label.removeClass( 'disabled' );
				if ( this.$parent ) {
					this.$parent.removeClass( 'disabled' );
				}
			},

			disable: function() {
				this.$radio.attr( 'disabled', true );
				this.$label.addClass( 'disabled' );
				if ( this.$parent ) {
					this.$parent.addClass( 'disabled' );
				}
			},

			itemchecked: function( e ) {
				var radio = $( e.target );

				this.resetGroup();
				this.setState( radio );
			},

			check: function() {
				this.resetGroup();
				this.$radio.prop( 'checked', true );
				this.setState( this.$radio );
			},

			uncheck: function() {
				this.$radio.prop( 'checked', false );
				this.setState( this.$radio );
			},

			isChecked: function() {
				return this.$radio.is( ':checked' );
			}
		};


		// RADIO PLUGIN DEFINITION

		$.fn.radio = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'radio' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'radio', ( data = new Radio( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.radio.defaults = {};

		$.fn.radio.Constructor = Radio;

		$.fn.radio.noConflict = function() {
			$.fn.radio = old;
			return this;
		};


		// RADIO DATA-API

		$( function() {
			$( window ).on( 'load', function() {
				$( '.radio-custom > input[type=radio]' ).each( function() {
					var $this = $( this );
					if ( $this.data( 'radio' ) ) return;
					$this.radio( $this.data() );
				} );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Search
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.search;

		// SEARCH CONSTRUCTOR AND PROTOTYPE

		var Search = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.search.defaults, options );

			this.$button = this.$element.find( 'button' )
				.on( 'click', $.proxy( this.buttonclicked, this ) );

			this.$input = this.$element.find( 'input' )
				.on( 'keydown', $.proxy( this.keypress, this ) )
				.on( 'keyup', $.proxy( this.keypressed, this ) );

			this.$icon = this.$element.find( '.glyphicon' );
			this.activeSearch = '';
		};

		Search.prototype = {

			constructor: Search,

			search: function( searchText ) {
				this.$icon.attr( 'class', 'glyphicon glyphicon-remove' );
				this.activeSearch = searchText;
				this.$element.trigger( 'searched', searchText );
			},

			clear: function() {
				this.$icon.attr( 'class', 'glyphicon glyphicon-search' );
				this.activeSearch = '';
				this.$input.val( '' );
				this.$element.trigger( 'cleared' );
			},

			action: function() {
				var val = this.$input.val();
				var inputEmptyOrUnchanged = val === '' || val === this.activeSearch;

				if ( this.activeSearch && inputEmptyOrUnchanged ) {
					this.clear();
				} else if ( val ) {
					this.search( val );
				}
			},

			buttonclicked: function( e ) {
				e.preventDefault();
				if ( $( e.currentTarget ).is( '.disabled, :disabled' ) ) return;
				this.action();
			},

			keypress: function( e ) {
				if ( e.which === 13 ) {
					e.preventDefault();
				}
			},

			keypressed: function( e ) {
				var val, inputPresentAndUnchanged;

				if ( e.which === 13 ) {
					e.preventDefault();
					this.action();
				} else {
					val = this.$input.val();
					inputPresentAndUnchanged = val && ( val === this.activeSearch );
					this.$icon.attr( 'class', inputPresentAndUnchanged ? 'glyphicon glyphicon-remove' : 'glyphicon glyphicon-search' );
				}
			},

			disable: function() {
				this.$input.attr( 'disabled', 'disabled' );
				this.$button.addClass( 'disabled' );
			},

			enable: function() {
				this.$input.removeAttr( 'disabled' );
				this.$button.removeClass( 'disabled' );
			}

		};


		// SEARCH PLUGIN DEFINITION

		$.fn.search = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'search' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'search', ( data = new Search( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.search.defaults = {};

		$.fn.search.Constructor = Search;

		$.fn.search.noConflict = function() {
			$.fn.search = old;
			return this;
		};


		// SEARCH DATA-API

		$( function() {
			$( 'body' ).on( 'mousedown.search.data-api', '.search', function() {
				var $this = $( this );
				if ( $this.data( 'search' ) ) return;
				$this.search( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Spinner
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.spinner;

		// SPINNER CONSTRUCTOR AND PROTOTYPE

		var Spinner = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.spinner.defaults, options );
			this.$input = this.$element.find( '.spinner-input' );
			this.$element.on( 'focusin', this.$input, $.proxy( this.changeFlag, this ) );
			this.$element.on( 'focusout', this.$input, $.proxy( this.change, this ) );

			if ( this.options.hold ) {
				this.$element.on( 'mousedown', '.spinner-up', $.proxy( function() {
					this.startSpin( true );
				}, this ) );
				this.$element.on( 'mouseup', '.spinner-up, .spinner-down', $.proxy( this.stopSpin, this ) );
				this.$element.on( 'mouseout', '.spinner-up, .spinner-down', $.proxy( this.stopSpin, this ) );
				this.$element.on( 'mousedown', '.spinner-down', $.proxy( function() {
					this.startSpin( false );
				}, this ) );
			} else {
				this.$element.on( 'click', '.spinner-up', $.proxy( function() {
					this.step( true );
				}, this ) );
				this.$element.on( 'click', '.spinner-down', $.proxy( function() {
					this.step( false );
				}, this ) );
			}

			this.switches = {
				count: 1,
				enabled: true
			};

			if ( this.options.speed === 'medium' ) {
				this.switches.speed = 300;
			} else if ( this.options.speed === 'fast' ) {
				this.switches.speed = 100;
			} else {
				this.switches.speed = 500;
			}

			this.lastValue = null;

			this.render();

			if ( this.options.disabled ) {
				this.disable();
			}
		};

		Spinner.prototype = {
			constructor: Spinner,

			render: function() {
				var inputValue = this.$input.val();
				var maxUnitLength = '';

				if ( inputValue ) {
					this.value( inputValue );
				} else {
					this.$input.val( this.options.value );
				}

				if ( this.options.units.length ) {
					$.each( this.options.units, function( index, value ) {
						if ( value.length > maxUnitLength.length ) {
							maxUnitLength = value;
						}
					} );
				}

				this.$input.attr( 'maxlength', ( this.options.max + maxUnitLength ).split( '' ).length );
			},

			change: function() {
				var newVal = this.$input.val();

				if ( this.options.units.length ) {
					this.setMixedValue( newVal );
				} else if ( newVal / 1 ) {
					this.options.value = this.checkMaxMin( newVal / 1 );
				} else {
					newVal = this.checkMaxMin( newVal.replace( /[^0-9.-]/g, '' ) || '' );
					this.options.value = newVal / 1;
				}

				this.changeFlag = false;
				this.triggerChangedEvent();
			},

			changeFlag: function() {
				this.changeFlag = true;
			},

			stopSpin: function() {
				if ( this.switches.timeout !== undefined ) {
					clearTimeout( this.switches.timeout );
					this.switches.count = 1;
					this.triggerChangedEvent();
				}
			},

			triggerChangedEvent: function() {
				var currentValue = this.value();
				if ( currentValue === this.lastValue ) return;

				this.lastValue = currentValue;

				// Primary changed event
				this.$element.trigger( 'changed', currentValue );

				// Undocumented, kept for backward compatibility
				this.$element.trigger( 'change' );
			},

			startSpin: function( type ) {

				if ( !this.options.disabled ) {
					var divisor = this.switches.count;

					if ( divisor === 1 ) {
						this.step( type );
						divisor = 1;
					} else if ( divisor < 3 ) {
						divisor = 1.5;
					} else if ( divisor < 8 ) {
						divisor = 2.5;
					} else {
						divisor = 4;
					}

					this.switches.timeout = setTimeout( $.proxy( function() {
						this.iterator( type );
					}, this ), this.switches.speed / divisor );
					this.switches.count++;
				}
			},

			iterator: function( type ) {
				this.step( type );
				this.startSpin( type );
			},

			step: function( dir ) {
				var digits, multiple, curValue, limValue;

				if ( this.changeFlag ) this.change();

				curValue = this.options.value;
				limValue = dir ? this.options.max : this.options.min;

				if ( ( dir ? curValue < limValue : curValue > limValue ) ) {
					var newVal = curValue + ( dir ? 1 : -1 ) * this.options.step;

					if ( this.options.step % 1 !== 0 ) {
						digits = ( this.options.step + '' ).split( '.' )[ 1 ].length;
						multiple = Math.pow( 10, digits );
						newVal = Math.round( newVal * multiple ) / multiple;
					}

					if ( dir ? newVal > limValue : newVal < limValue ) {
						this.value( limValue );
					} else {
						this.value( newVal );
					}
				} else if ( this.options.cycle ) {
					var cycleVal = dir ? this.options.min : this.options.max;
					this.value( cycleVal );
				}
			},

			value: function( value ) {

				if ( value || value === 0 ) {
					if ( this.options.units.length ) {
						this.setMixedValue( value + ( this.unit || '' ) );
						return this;
					} else if ( !isNaN( parseFloat( value ) ) && isFinite( value ) ) {
						this.options.value = value / 1;
						this.$input.val( value + ( this.unit ? this.unit : '' ) );
						return this;
					}
				} else {
					if ( this.changeFlag ) this.change();

					if ( this.unit ) {
						return this.options.value + this.unit;
					} else {
						return this.options.value;
					}
				}
			},

			isUnitLegal: function( unit ) {
				var legalUnit;

				$.each( this.options.units, function( index, value ) {
					if ( value.toLowerCase() === unit.toLowerCase() ) {
						legalUnit = unit.toLowerCase();
						return false;
					}
				} );

				return legalUnit;
			},

			setMixedValue: function( value ) {
				var unit = value.replace( /[^a-zA-Z]/g, '' );
				var newVal = value.replace( /[^0-9.-]/g, '' );

				if ( unit ) {
					unit = this.isUnitLegal( unit );
				}

				this.options.value = newVal / 1;
				this.unit = unit || undefined;
				this.$input.val( newVal + ( unit || '' ) );
			},

			checkMaxMin: function( value ) {
				var limit;

				if ( isNaN( parseFloat( value ) ) ) {
					return value;
				}

				if ( value < this.options.max && value > this.options.min ) {
					return value;
				} else {
					limit = value > this.options.max ? this.options.max : this.options.min;

					this.$input.val( limit );
					return limit;
				}
			},

			disable: function() {
				this.options.disabled = true;
				this.$input.attr( 'disabled', '' );
				this.$element.find( 'button' ).addClass( 'disabled' );
			},

			enable: function() {
				this.options.disabled = false;
				this.$input.removeAttr( "disabled" );
				this.$element.find( 'button' ).removeClass( 'disabled' );
			}
		};


		// SPINNER PLUGIN DEFINITION

		$.fn.spinner = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'spinner' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'spinner', ( data = new Spinner( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.spinner.defaults = {
			value: 1,
			min: 0,
			max: 500,
			step: 1,
			hold: true,
			speed: 'medium',
			disabled: false,
			cycle: false,
			units: []
		};

		$.fn.spinner.Constructor = Spinner;

		$.fn.spinner.noConflict = function() {
			$.fn.spinner = old;
			return this;
		};


		// SPINNER DATA-API

		$( function() {
			$( 'body' ).on( 'mousedown.spinner.data-api', '.spinner', function() {
				var $this = $( this );
				if ( $this.data( 'spinner' ) ) return;
				$this.spinner( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Tree
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.tree;

		// TREE CONSTRUCTOR AND PROTOTYPE

		var Tree = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.tree.defaults, options );

			this.$element.on( 'click', '.tree-item', $.proxy( function( ev ) {
				this.selectItem( ev.currentTarget );
			}, this ) );
			this.$element.on( 'click', '.tree-folder-header', $.proxy( function( ev ) {
				this.selectFolder( ev.currentTarget );
			}, this ) );

			this.render();
		};

		Tree.prototype = {
			constructor: Tree,

			render: function() {
				this.populate( this.$element );
			},

			populate: function( $el ) {
				var self = this;
				var $parent = $el.parent();
				var loader = $parent.find( '.tree-loader:eq(0)' );

				loader.show();
				this.options.dataSource.data( $el.data(), function( items ) {
					loader.hide();

					$.each( items.data, function( index, value ) {
						var $entity;

						if ( value.type === "folder" ) {
							$entity = self.$element.find( '.tree-folder:eq(0)' ).clone().show();
							$entity.find( '.tree-folder-name' ).html( value.name );
							$entity.find( '.tree-loader' ).html( self.options.loadingHTML );
							$entity.find( '.tree-folder-header' ).data( value );
						} else if ( value.type === "item" ) {
							$entity = self.$element.find( '.tree-item:eq(0)' ).clone().show();
							$entity.find( '.tree-item-name' ).html( value.name );
							$entity.data( value );
						}

						// Decorate $entity with data making the element
						// easily accessable with libraries like jQuery.
						//
						// Values are contained within the object returned
						// for folders and items as dataAttributes:
						//
						// {
						//     name: "An Item",
						//     type: 'item',
						//     dataAttributes = {
						//         'classes': 'required-item red-text',
						//         'data-parent': parentId,
						//         'guid': guid
						//     }
						// };

						var dataAttributes = value.dataAttributes || [];
						$.each( dataAttributes, function( key, value ) {
							switch ( key ) {
								case 'class':
								case 'classes':
								case 'className':
									$entity.addClass( value );
									break;

									// id, style, data-*
								default:
									$entity.attr( key, value );
									break;
							}
						} );

						if ( $el.hasClass( 'tree-folder-header' ) ) {
							$parent.find( '.tree-folder-content:eq(0)' ).append( $entity );
						} else {
							$el.append( $entity );
						}
					} );

					// return newly populated folder
					self.$element.trigger( 'loaded', $parent );
				} );
			},

			selectItem: function( el ) {
				var $el = $( el );
				var $all = this.$element.find( '.tree-selected' );
				var data = [];

				if ( this.options.multiSelect ) {
					$.each( $all, function( index, value ) {
						var $val = $( value );
						if ( $val[ 0 ] !== $el[ 0 ] ) {
							data.push( $( value ).data() );
						}
					} );
				} else if ( $all[ 0 ] !== $el[ 0 ] ) {
					$all.removeClass( 'tree-selected' )
						.find( 'i' ).removeClass( 'glyphicon-ok' ).addClass( 'tree-dot' );
					data.push( $el.data() );
				}

				var eventType = 'selected';
				if ( $el.hasClass( 'tree-selected' ) ) {
					eventType = 'unselected';
					$el.removeClass( 'tree-selected' );
					$el.find( 'i' ).removeClass( 'glyphicon-ok' ).addClass( 'tree-dot' );
				} else {
					$el.addClass( 'tree-selected' );
					$el.find( 'i' ).removeClass( 'tree-dot' ).addClass( 'glyphicon-ok' );
					if ( this.options.multiSelect ) {
						data.push( $el.data() );
					}
				}

				if ( data.length ) {
					this.$element.trigger( 'selected', {
						info: data
					} );
				}

				// Return new list of selected items, the item
				// clicked, and the type of event:
				$el.trigger( 'updated', {
					info: data,
					item: $el,
					eventType: eventType
				} );
			},

			selectFolder: function( el ) {
				var $el = $( el );
				var $parent = $el.parent();
				var $treeFolderContent = $parent.find( '.tree-folder-content' );
				var $treeFolderContentFirstChild = $treeFolderContent.eq( 0 );

				var eventType, classToTarget, classToAdd;
				if ( $el.find( '.glyphicon-folder-close' ).length ) {
					eventType = 'opened';
					classToTarget = '.glyphicon-folder-close';
					classToAdd = 'glyphicon-folder-open';

					$treeFolderContentFirstChild.show();
					if ( !$treeFolderContent.children().length ) {
						this.populate( $el );
					}
				} else {
					eventType = 'closed';
					classToTarget = '.glyphicon-folder-open';
					classToAdd = 'glyphicon-folder-close';

					$treeFolderContentFirstChild.hide();
					if ( !this.options.cacheItems ) {
						$treeFolderContentFirstChild.empty();
					}
				}

				$parent.find( classToTarget ).eq( 0 )
					.removeClass( 'glyphicon-folder-close glyphicon-folder-open' )
					.addClass( classToAdd );

				this.$element.trigger( eventType, $el.data() );
			},

			selectedItems: function() {
				var $sel = this.$element.find( '.tree-selected' );
				var data = [];

				$.each( $sel, function( index, value ) {
					data.push( $( value ).data() );
				} );
				return data;
			},

			// collapses open folders
			collapse: function() {
				var cacheItems = this.options.cacheItems;

				// find open folders
				this.$element.find( '.icon-folder-open' ).each( function() {
					// update icon class
					var $this = $( this )
						.removeClass( 'icon-folder-close icon-folder-open' )
						.addClass( 'icon-folder-close' );

					// "close" or empty folder contents
					var $parent = $this.parent().parent();
					var $folder = $parent.children( '.tree-folder-content' );

					$folder.hide();
					if ( !cacheItems ) {
						$folder.empty();
					}
				} );
			}
		};


		// TREE PLUGIN DEFINITION

		$.fn.tree = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'tree' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'tree', ( data = new Tree( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.tree.defaults = {
			multiSelect: false,
			loadingHTML: '<div>Loading...</div>',
			cacheItems: true
		};

		$.fn.tree.Constructor = Tree;

		$.fn.tree.noConflict = function() {
			$.fn.tree = old;
			return this;
		};


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Wizard
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.wizard;

		// WIZARD CONSTRUCTOR AND PROTOTYPE

		var Wizard = function( element, options ) {
			var kids;

			this.$element = $( element );
			this.options = $.extend( {}, $.fn.wizard.defaults, options );
			this.options.disablePreviousStep = ( this.$element.data().restrict === "previous" ) ? true : false;
			this.currentStep = this.options.selectedItem.step;
			this.numSteps = this.$element.find( '.steps li' ).length;
			this.$prevBtn = this.$element.find( 'button.btn-prev' );
			this.$nextBtn = this.$element.find( 'button.btn-next' );

			kids = this.$nextBtn.children().detach();
			this.nextText = $.trim( this.$nextBtn.text() );
			this.$nextBtn.append( kids );

			// handle events
			this.$prevBtn.on( 'click', $.proxy( this.previous, this ) );
			this.$nextBtn.on( 'click', $.proxy( this.next, this ) );
			this.$element.on( 'click', 'li.complete', $.proxy( this.stepclicked, this ) );

			if ( this.currentStep > 1 ) {
				this.selectedItem( this.options.selectedItem );
			}

			if ( this.options.disablePreviousStep ) {
				this.$prevBtn.attr( 'disabled', true );
				this.$element.find( '.steps' ).addClass( 'previous-disabled' );
			}
		};

		Wizard.prototype = {

			constructor: Wizard,

			setState: function() {
				var canMovePrev = ( this.currentStep > 1 );
				var firstStep = ( this.currentStep === 1 );
				var lastStep = ( this.currentStep === this.numSteps );

				// disable buttons based on current step
				if ( !this.options.disablePreviousStep ) {
					this.$prevBtn.attr( 'disabled', ( firstStep === true || canMovePrev === false ) );
				}

				// change button text of last step, if specified
				var data = this.$nextBtn.data();
				if ( data && data.last ) {
					this.lastText = data.last;
					if ( typeof this.lastText !== 'undefined' ) {
						// replace text
						var text = ( lastStep !== true ) ? this.nextText : this.lastText;
						var kids = this.$nextBtn.children().detach();
						this.$nextBtn.text( text ).append( kids );
					}
				}

				// reset classes for all steps
				var $steps = this.$element.find( '.steps li' );
				$steps.removeClass( 'active' ).removeClass( 'complete' );
				$steps.find( 'span.badge' ).removeClass( 'badge-info' ).removeClass( 'badge-success' );

				// set class for all previous steps
				var prevSelector = '.steps li:lt(' + ( this.currentStep - 1 ) + ')';
				var $prevSteps = this.$element.find( prevSelector );
				$prevSteps.addClass( 'complete' );
				$prevSteps.find( 'span.badge' ).addClass( 'badge-success' );

				// set class for current step
				var currentSelector = '.steps li:eq(' + ( this.currentStep - 1 ) + ')';
				var $currentStep = this.$element.find( currentSelector );
				$currentStep.addClass( 'active' );
				$currentStep.find( 'span.badge' ).addClass( 'badge-info' );

				// set display of target element
				var target = $currentStep.data().target;
				this.$element.find( '.step-content' ).find( '.step-pane' ).removeClass( 'active' );
				$( target ).addClass( 'active' );

				// reset the wizard position to the left
				this.$element.find( '.steps' ).first().attr( 'style', 'margin-left: 0' );

				// check if the steps are wider than the container div
				var totalWidth = 0;
				this.$element.find( '.steps > li' ).each( function() {
					totalWidth += $( this ).outerWidth();
				} );
				var containerWidth = 0;
				if ( this.$element.find( '.actions' ).length ) {
					containerWidth = this.$element.width() - this.$element.find( '.actions' ).first().outerWidth();
				} else {
					containerWidth = this.$element.width();
				}
				if ( totalWidth > containerWidth ) {

					// set the position so that the last step is on the right
					var newMargin = totalWidth - containerWidth;
					this.$element.find( '.steps' ).first().attr( 'style', 'margin-left: -' + newMargin + 'px' );

					// set the position so that the active step is in a good
					// position if it has been moved out of view
					if ( this.$element.find( 'li.active' ).first().position().left < 200 ) {
						newMargin += this.$element.find( 'li.active' ).first().position().left - 200;
						if ( newMargin < 1 ) {
							this.$element.find( '.steps' ).first().attr( 'style', 'margin-left: 0' );
						} else {
							this.$element.find( '.steps' ).first().attr( 'style', 'margin-left: -' + newMargin + 'px' );
						}
					}
				}

				this.$element.trigger( 'changed' );
			},

			stepclicked: function( e ) {
				var li = $( e.currentTarget );
				var index = this.$element.find( '.steps li' ).index( li );
				var canMovePrev = true;

				if ( this.options.disablePreviousStep ) {
					if ( index < this.currentStep ) {
						canMovePrev = false;
					}
				}

				if ( canMovePrev ) {
					var evt = $.Event( 'stepclick' );
					this.$element.trigger( evt, {
						step: index + 1
					} );
					if ( evt.isDefaultPrevented() ) return;

					this.currentStep = ( index + 1 );
					this.setState();
				}
			},

			previous: function() {
				var canMovePrev = ( this.currentStep > 1 );
				if ( this.options.disablePreviousStep ) {
					canMovePrev = false;
				}
				if ( canMovePrev ) {
					var e = $.Event( 'change' );
					this.$element.trigger( e, {
						step: this.currentStep,
						direction: 'previous'
					} );
					if ( e.isDefaultPrevented() ) return;

					this.currentStep -= 1;
					this.setState();
				}
			},

			next: function() {
				var canMoveNext = ( this.currentStep + 1 <= this.numSteps );
				var lastStep = ( this.currentStep === this.numSteps );

				if ( canMoveNext ) {
					var e = $.Event( 'change' );
					this.$element.trigger( e, {
						step: this.currentStep,
						direction: 'next'
					} );

					if ( e.isDefaultPrevented() ) return;

					this.currentStep += 1;
					this.setState();
				} else if ( lastStep ) {
					this.$element.trigger( 'finished' );
				}
			},

			selectedItem: function( selectedItem ) {
				var retVal, step;

				if ( selectedItem ) {

					step = selectedItem.step || -1;

					if ( step >= 1 && step <= this.numSteps ) {
						this.currentStep = step;
						this.setState();
					}

					retVal = this;
				} else {
					retVal = {
						step: this.currentStep
					};
				}

				return retVal;
			}
		};


		// WIZARD PLUGIN DEFINITION

		$.fn.wizard = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'wizard' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'wizard', ( data = new Wizard( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.wizard.defaults = {
			selectedItem: {
				step: 1
			}
		};

		$.fn.wizard.Constructor = Wizard;

		$.fn.wizard.noConflict = function() {
			$.fn.wizard = old;
			return this;
		};


		// WIZARD DATA-API

		$( function() {
			$( 'body' ).on( 'mouseover.wizard.data-api', '.wizard', function() {
				var $this = $( this );
				if ( $this.data( 'wizard' ) ) return;
				$this.wizard( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Intelligent Bootstrap Dropdowns
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		$( function() {
			$( document.body ).on( "click", "[data-toggle=dropdown][data-direction]", function( event ) {

				var dataDirection = $( this ).data().direction;

				// if data-direction is not auto or up, default to bootstraps dropdown
				if ( dataDirection === "auto" || dataDirection === "up" ) {
					// only changing css positioning if position is set to static
					// if this doesn"t happen, dropUp will not be correct
					// works correctly for absolute, relative, and fixed positioning
					if ( $( this ).parent().css( "position" ) === "static" ) {
						$( this ).parent().css( {
							position: "relative"
						} );
					}

					// only continue into this function if the click came from a user
					if ( event.hasOwnProperty( "originalEvent" ) ) {
						// stopping bootstrap event propagation
						event.stopPropagation();

						// deciding what to do based on data-direction attribute
						if ( dataDirection === "auto" ) {
							// have the drop down intelligently decide where to place itself
							forceAutoDropDown( $( this ) );
						} else if ( dataDirection === "up" ) {
							forceDropUp( $( this ) );
						}
					}
				}

			} );

			function forceDropUp( element ) {
				var dropDown = element.next();
				var dropUpPadding = 5;
				var topPosition;

				$( dropDown ).addClass( "dropUp" );
				topPosition = ( ( dropDown.outerHeight() + dropUpPadding ) * -1 ) + "px";

				dropDown.css( {
					visibility: "visible",
					top: topPosition
				} );
				element.click();
			}

			function forceAutoDropDown( element ) {
				var dropDown = element.next();
				var dropUpPadding = 5;
				var topPosition;

				// setting this so I can get height of dropDown without it being shown
				dropDown.css( {
					visibility: "hidden"
				} );

				// deciding where to put menu
				if ( dropUpCheck( dropDown ) ) {
					$( dropDown ).addClass( "dropUp" );
					topPosition = ( ( dropDown.outerHeight() + dropUpPadding ) * -1 ) + "px";
				} else {
					$( dropDown ).removeClass( "dropUp" );
					topPosition = "auto";
				}

				dropDown.css( {
					visibility: "visible",
					top: topPosition
				} );
				element.click();
			}

			function dropUpCheck( element ) {
				// caching container
				var $container = getContainer( element );

				// building object with measurementsances for later use
				var measurements = {};
				measurements.parentHeight = element.parent().outerHeight();
				measurements.parentOffsetTop = element.parent().offset().top;
				measurements.dropdownHeight = element.outerHeight();
				measurements.containerHeight = $container.overflowElement.outerHeight();

				// this needs to be different if the window is the container or another element is
				measurements.containerOffsetTop = ( !! $container.isWindow ) ? $container.overflowElement.scrollTop() : $container.overflowElement.offset().top;

				// doing the calculations
				measurements.fromTop = measurements.parentOffsetTop - measurements.containerOffsetTop;
				measurements.fromBottom = measurements.containerHeight - measurements.parentHeight - ( measurements.parentOffsetTop - measurements.containerOffsetTop );

				// actual determination of where to put menu
				// false = drop down
				// true = drop up
				if ( measurements.dropdownHeight < measurements.fromBottom ) {
					return false;
				} else if ( measurements.dropdownHeight < measurements.fromTop ) {
					return true;
				} else if ( measurements.dropdownHeight >= measurements.fromTop && measurements.dropdownHeight >= measurements.fromBottom ) {
					// decide which one is bigger and put it there
					if ( measurements.fromTop >= measurements.fromBottom ) {
						return true;
					} else {
						return false;
					}
				}
			}

			function getContainer( element ) {
				var containerElement = window;
				var isWindow = true;
				$.each( element.parents(), function( index, value ) {
					if ( $( value ).css( 'overflow' ) !== 'visible' ) {
						containerElement = value;
						isWindow = false;
						return false;
					}
				} );
				return {
					overflowElement: $( containerElement ),
					isWindow: isWindow
				};
			}
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Scheduler
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.scheduler;

		// SCHEDULER CONSTRUCTOR AND PROTOTYPE

		var Scheduler = function( element, options ) {
			var self = this;

			this.$element = $( element );
			this.options = $.extend( {}, $.fn.scheduler.defaults, options );

			// cache elements
			this.$startDate = this.$element.find( '.scheduler-start .datepicker' );
			this.$startTime = this.$element.find( '.scheduler-start .combobox' );

			this.$timeZone = this.$element.find( '.scheduler-timezone .select' );

			this.$repeatIntervalPanel = this.$element.find( '.repeat-interval-panel' );
			this.$repeatIntervalSelect = this.$element.find( '.repeat-interval .select' );
			this.$repeatIntervalSpinner = this.$element.find( '.repeat-interval-panel .spinner' );
			this.$repeatIntervalTxt = this.$element.find( '.repeat-interval-text' );

			this.$end = this.$element.find( '.scheduler-end' );
			this.$endAfter = this.$end.find( '.spinner' );
			this.$endSelect = this.$end.find( '.select' );
			this.$endDate = this.$end.find( '.datepicker' );

			// panels
			this.$recurrencePanels = this.$element.find( '.recurrence-panel' );

			// bind events
			this.$element.find( '.scheduler-weekly .btn-group .btn' ).on( 'click', function( e, data ) {
				self.changed( e, data, true );
			} );
			this.$element.find( '.combobox' ).on( 'changed', $.proxy( this.changed, this ) );
			this.$element.find( '.datepicker' ).on( 'changed', $.proxy( this.changed, this ) );
			this.$element.find( '.select' ).on( 'changed', $.proxy( this.changed, this ) );
			this.$element.find( '.spinner' ).on( 'changed', $.proxy( this.changed, this ) );
			this.$element.find( '.scheduler-monthly label.radio, .scheduler-yearly label.radio' ).on( 'mouseup', $.proxy( this.changed, this ) );

			this.$repeatIntervalSelect.on( 'changed', $.proxy( this.repeatIntervalSelectChanged, this ) );
			this.$endSelect.on( 'changed', $.proxy( this.endSelectChanged, this ) );

			//initialize sub-controls
			this.$startDate.datepicker();
			this.$startTime.combobox();
			if ( this.$startTime.find( 'input' ).val() === '' ) {
				this.$startTime.combobox( 'selectByIndex', 0 );
			}
			this.$repeatIntervalSpinner.spinner();
			this.$endAfter.spinner();
			this.$endDate.datepicker();
		};

		Scheduler.prototype = {
			constructor: Scheduler,

			changed: function( e, data, propagate ) {
				if ( !propagate ) {
					e.stopPropagation();
				}
				this.$element.trigger( 'changed', {
					data: ( data !== undefined ) ? data : $( e.currentTarget ).data(),
					originalEvent: e,
					value: this.getValue()
				} );
			},

			disable: function() {
				this.toggleState( 'disable' );
			},

			enable: function() {
				this.toggleState( 'enable' );
			},

			// called when the end range changes
			// (Never, After, On date)
			endSelectChanged: function( e, data ) {
				var selectedItem, val;

				if ( !data ) {
					selectedItem = this.$endSelect.select( 'selectedItem' );
					val = selectedItem.value;
				} else {
					val = data.value;
				}

				// hide all panels
				this.$endAfter.hide();
				this.$endDate.hide();

				if ( val === 'after' ) {
					this.$endAfter.show();
				} else if ( val === 'date' ) {
					this.$endDate.show();
				}
			},

			getValue: function() {
				// FREQ = frequency (hourly, daily, monthly...)
				// BYDAY = when picking days (MO,TU,WE,etc)
				// BYMONTH = when picking months (Jan,Feb,March) - note the values should be 1,2,3...
				// BYMONTHDAY = when picking days of the month (1,2,3...)
				// BYSETPOS = when picking First,Second,Third,Fourth,Last (1,2,3,4,-1)

				var interval = this.$repeatIntervalSpinner.spinner( 'value' );
				var pattern = '';
				var repeat = this.$repeatIntervalSelect.select( 'selectedItem' ).value;
				var startTime = this.$startTime.combobox( 'selectedItem' ).text.toLowerCase();
				var timeZone = this.$timeZone.select( 'selectedItem' );
				var getFormattedDate = function( dateObj, dash ) {
					var fdate = '';
					var item;

					fdate += dateObj.getFullYear();
					fdate += dash;
					item = dateObj.getMonth() + 1; //because 0 indexing makes sense when dealing with months /sarcasm
					fdate += ( item < 10 ) ? '0' + item : item;
					fdate += dash;
					item = dateObj.getDate();
					fdate += ( item < 10 ) ? '0' + item : item;

					return fdate;
				};
				var day, days, hasAm, hasPm, month, pos, startDateTime, type;

				startDateTime = '' + getFormattedDate( this.$startDate.datepicker( 'getDate' ), '-' );

				startDateTime += 'T';
				hasAm = ( startTime.search( 'am' ) >= 0 );
				hasPm = ( startTime.search( 'pm' ) >= 0 );
				startTime = $.trim( startTime.replace( /am/g, '' ).replace( /pm/g, '' ) ).split( ':' );
				startTime[ 0 ] = parseInt( startTime[ 0 ], 10 );
				startTime[ 1 ] = parseInt( startTime[ 1 ], 10 );
				if ( hasAm && startTime[ 0 ] > 11 ) {
					startTime[ 0 ] = 0;
				} else if ( hasPm && startTime[ 0 ] < 12 ) {
					startTime[ 0 ] += 12;
				}
				startDateTime += ( startTime[ 0 ] < 10 ) ? '0' + startTime[ 0 ] : startTime[ 0 ];
				startDateTime += ':';
				startDateTime += ( startTime[ 1 ] < 10 ) ? '0' + startTime[ 1 ] : startTime[ 1 ];

				startDateTime += ( timeZone.offset === '+00:00' ) ? 'Z' : timeZone.offset;

				if ( repeat === 'none' ) {
					pattern = 'FREQ=DAILY;INTERVAL=1;COUNT=1;';
				} else if ( repeat === 'hourly' ) {
					pattern = 'FREQ=HOURLY;';
					pattern += 'INTERVAL=' + interval + ';';
				} else if ( repeat === 'daily' ) {
					pattern += 'FREQ=DAILY;';
					pattern += 'INTERVAL=' + interval + ';';
				} else if ( repeat === 'weekdays' ) {
					pattern += 'FREQ=DAILY;';
					pattern += 'BYDAY=MO,TU,WE,TH,FR;';
					pattern += 'INTERVAL=1;';
				} else if ( repeat === 'weekly' ) {
					days = [];
					this.$element.find( '.scheduler-weekly .btn-group button.active' ).each( function() {
						days.push( $( this ).data().value );
					} );

					pattern += 'FREQ=WEEKLY;';
					pattern += 'BYDAY=' + days.join( ',' ) + ';';
					pattern += 'INTERVAL=' + interval + ';';
				} else if ( repeat === 'monthly' ) {
					pattern += 'FREQ=MONTHLY;';
					pattern += 'INTERVAL=' + interval + ';';

					type = parseInt( this.$element.find( 'input[name=scheduler-month]:checked' ).val(), 10 );
					if ( type === 1 ) {
						day = parseInt( this.$element.find( '.scheduler-monthly-date .select' ).select( 'selectedItem' ).text, 10 );
						pattern += 'BYMONTHDAY=' + day + ';';
					} else if ( type === 2 ) {
						days = this.$element.find( '.month-days' ).select( 'selectedItem' ).value;
						pos = this.$element.find( '.month-day-pos' ).select( 'selectedItem' ).value;

						pattern += 'BYDAY=' + days + ';';
						pattern += 'BYSETPOS=' + pos + ';';
					}
				} else if ( repeat === 'yearly' ) {
					pattern += 'FREQ=YEARLY;';

					type = parseInt( this.$element.find( 'input[name=scheduler-year]:checked' ).val(), 10 );
					if ( type === 1 ) {
						month = this.$element.find( '.scheduler-yearly-date .year-month' ).select( 'selectedItem' ).value;
						day = this.$element.find( '.year-month-day' ).select( 'selectedItem' ).text;

						pattern += 'BYMONTH=' + month + ';';
						pattern += 'BYMONTHDAY=' + day + ';';
					} else if ( type === 2 ) {
						days = this.$element.find( '.year-month-days' ).select( 'selectedItem' ).value;
						pos = this.$element.find( '.year-month-day-pos' ).select( 'selectedItem' ).value;
						month = this.$element.find( '.scheduler-yearly-day .year-month' ).select( 'selectedItem' ).value;

						pattern += 'BYDAY=' + days + ';';
						pattern += 'BYSETPOS=' + pos + ';';
						pattern += 'BYMONTH=' + month + ';';
					}
				}

				var end = this.$endSelect.select( 'selectedItem' ).value;
				var duration = '';

				// if both UNTIL and COUNT are not specified, the recurrence will repeat forever
				// http://tools.ietf.org/html/rfc2445#section-4.3.10
				if ( repeat !== 'none' ) {
					if ( end === 'after' ) {
						duration = 'COUNT=' + this.$endAfter.spinner( 'value' ) + ';';
					} else if ( end === 'date' ) {
						duration = 'UNTIL=' + getFormattedDate( this.$endDate.datepicker( 'getDate' ), '' ) + ';';
					}
				}

				pattern += duration;

				var data = {
					startDateTime: startDateTime,
					timeZone: {
						name: timeZone.name,
						offset: timeZone.offset
					},
					recurrencePattern: pattern
				};

				return data;
			},

			// called when the repeat interval changes
			// (None, Hourly, Daily, Weekdays, Weekly, Monthly, Yearly
			repeatIntervalSelectChanged: function( e, data ) {
				var selectedItem, val, txt;

				if ( !data ) {
					selectedItem = this.$repeatIntervalSelect.select( 'selectedItem' );
					val = selectedItem.value;
					txt = selectedItem.text;
				} else {
					val = data.value;
					txt = data.text;
				}

				// set the text
				this.$repeatIntervalTxt.text( txt );

				switch ( val.toLowerCase() ) {
					case 'hourly':
					case 'daily':
					case 'weekly':
					case 'monthly':
						this.$repeatIntervalPanel.show();
						break;
					default:
						this.$repeatIntervalPanel.hide();
						break;
				}

				// hide all panels
				this.$recurrencePanels.hide();

				// show panel for current selection
				this.$element.find( '.scheduler-' + val ).show();

				// the end selection should only be shown when
				// the repeat interval is not "None (run once)"
				if ( val === 'none' ) {
					this.$end.hide();
				} else {
					this.$end.show();
				}
			},

			setValue: function( options ) {
				var hours, i, item, l, minutes, period, recur, temp;

				if ( options.startDateTime ) {
					temp = options.startDateTime.split( 'T' );
					this.$startDate.datepicker( 'setDate', temp[ 0 ] );

					if ( temp[ 1 ] ) {
						temp[ 1 ] = temp[ 1 ].split( ':' );
						hours = parseInt( temp[ 1 ][ 0 ], 10 );
						minutes = ( temp[ 1 ][ 1 ] ) ? parseInt( temp[ 1 ][ 1 ].split( '+' )[ 0 ].split( '-' )[ 0 ].split( 'Z' )[ 0 ], 10 ) : 0;
						period = ( hours < 12 ) ? 'AM' : 'PM';

						if ( hours === 0 ) {
							hours = 12;
						} else if ( hours > 12 ) {
							hours -= 12;
						}
						minutes = ( minutes < 10 ) ? '0' + minutes : minutes;

						temp = hours + ':' + minutes + ' ' + period;
						this.$startTime.find( 'input' ).val( temp );
						this.$startTime.combobox( 'selectByText', temp );
					}
				}

				item = 'li[data';
				if ( options.timeZone ) {
					if ( typeof( options.timeZone ) === 'string' ) {
						item += '-name="' + options.timeZone;
					} else {
						if ( options.timeZone.name ) {
							item += '-name="' + options.timeZone.name;
						} else {
							item += '-offset="' + options.timeZone.offset;
						}
					}
					item += '"]';
					this.$timeZone.select( 'selectBySelector', item );
				} else if ( options.startDateTime ) {
					temp = options.startDateTime.split( 'T' )[ 1 ];
					if ( temp ) {
						if ( temp.search( /\+/ ) > -1 ) {
							temp = '+' + $.trim( temp.split( '+' )[ 1 ] );
						} else if ( temp.search( /\-/ ) > -1 ) {
							temp = '-' + $.trim( temp.split( '-' )[ 1 ] );
						} else {
							temp = '+00:00';
						}
					} else {
						temp = '+00:00';
					}
					item += '-offset="' + temp + '"]';
					this.$timeZone.select( 'selectBySelector', item );
				}

				if ( options.recurrencePattern ) {
					recur = {};
					temp = options.recurrencePattern.toUpperCase().split( ';' );
					for ( i = 0, l = temp.length; i < l; i++ ) {
						if ( temp[ i ] !== '' ) {
							item = temp[ i ].split( '=' );
							recur[ item[ 0 ] ] = item[ 1 ];
						}
					}

					if ( recur.FREQ === 'DAILY' ) {
						if ( recur.BYDAY === 'MO,TU,WE,TH,FR' ) {
							item = 'weekdays';
						} else {
							if ( recur.INTERVAL === '1' && recur.COUNT === '1' ) {
								item = 'none';
							} else {
								item = 'daily';
							}
						}
					} else if ( recur.FREQ === 'HOURLY' ) {
						item = 'hourly';
					} else if ( recur.FREQ === 'WEEKLY' ) {
						if ( recur.BYDAY ) {
							item = this.$element.find( '.scheduler-weekly .btn-group' );
							item.find( 'button' ).removeClass( 'active' );
							temp = recur.BYDAY.split( ',' );
							for ( i = 0, l = temp.length; i < l; i++ ) {
								item.find( 'button[data-value="' + temp[ i ] + '"]' ).addClass( 'active' );
							}
						}
						item = 'weekly';
					} else if ( recur.FREQ === 'MONTHLY' ) {
						this.$element.find( '.scheduler-monthly input' ).removeClass( 'checked' );
						if ( recur.BYMONTHDAY ) {
							temp = this.$element.find( '.scheduler-monthly-date' );
							temp.find( 'input' ).addClass( 'checked' );
							temp.find( '.select' ).select( 'selectByValue', recur.BYMONTHDAY );
						} else if ( recur.BYDAY ) {
							temp = this.$element.find( '.scheduler-monthly-day' );
							temp.find( 'input' ).addClass( 'checked' );
							if ( recur.BYSETPOS ) {
								temp.find( '.month-day-pos' ).select( 'selectByValue', recur.BYSETPOS );
							}
							temp.find( '.month-days' ).select( 'selectByValue', recur.BYDAY );
						}
						item = 'monthly';
					} else if ( recur.FREQ === 'YEARLY' ) {
						this.$element.find( '.scheduler-yearly input' ).removeClass( 'checked' );
						if ( recur.BYMONTHDAY ) {
							temp = this.$element.find( '.scheduler-yearly-date' );
							temp.find( 'input' ).addClass( 'checked' );
							if ( recur.BYMONTH ) {
								temp.find( '.year-month' ).select( 'selectByValue', recur.BYMONTH );
							}
							temp.find( '.year-month-day' ).select( 'selectByValue', recur.BYMONTHDAY );
						} else if ( recur.BYSETPOS ) {
							temp = this.$element.find( '.scheduler-yearly-day' );
							temp.find( 'input' ).addClass( 'checked' );
							temp.find( '.year-month-day-pos' ).select( 'selectByValue', recur.BYSETPOS );
							if ( recur.BYDAY ) {
								temp.find( '.year-month-days' ).select( 'selectByValue', recur.BYDAY );
							}
							if ( recur.BYMONTH ) {
								temp.find( '.year-month' ).select( 'selectByValue', recur.BYMONTH );
							}
						}
						item = 'yearly';
					} else {
						item = 'none';
					}

					if ( recur.COUNT ) {
						this.$endAfter.spinner( 'value', parseInt( recur.COUNT, 10 ) );
						this.$endSelect.select( 'selectByValue', 'after' );
					} else if ( recur.UNTIL ) {
						temp = recur.UNTIL;
						if ( temp.length === 8 ) {
							temp = temp.split( '' );
							temp.splice( 4, 0, '-' );
							temp.splice( 7, 0, '-' );
							temp = temp.join( '' );
						}
						this.$endDate.datepicker( 'setDate', temp );
						this.$endSelect.select( 'selectByValue', 'date' );
					}
					this.endSelectChanged();

					if ( recur.INTERVAL ) {
						this.$repeatIntervalSpinner.spinner( 'value', parseInt( recur.INTERVAL, 10 ) );
					}
					this.$repeatIntervalSelect.select( 'selectByValue', item );
					this.repeatIntervalSelectChanged();
				}
			},

			toggleState: function( action ) {
				this.$element.find( '.combobox' ).combobox( action );
				this.$element.find( '.datepicker' ).datepicker( action );
				this.$element.find( '.select' ).select( action );
				this.$element.find( '.spinner' ).spinner( action );
				this.$element.find( '.radio' ).radio( action );

				if ( action === 'disable' ) {
					action = 'addClass';
				} else {
					action = 'removeClass';
				}
				this.$element.find( '.scheduler-weekly .btn-group' )[ action ]( 'disabled' );
			},

			value: function( options ) {
				if ( options ) {
					return this.setValue( options );
				} else {
					return this.getValue();
				}
			}
		};


		// SCHEDULER PLUGIN DEFINITION

		$.fn.scheduler = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'scheduler' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'scheduler', ( data = new Scheduler( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.scheduler.defaults = {};

		$.fn.scheduler.Constructor = Scheduler;

		$.fn.scheduler.noConflict = function() {
			$.fn.scheduler = old;
			return this;
		};

		// SCHEDULER DATA-API

		$( function() {
			$( 'body' ).on( 'mousedown.scheduler.data-api', '.scheduler', function() {
				var $this = $( this );
				if ( $this.data( 'scheduler' ) ) return;
				$this.scheduler( $this.data() );
			} );
		} );


	} )( jQuery );


} ) );
