/*!
 * FuelUX v3.0.0
 * Copyright 2012-2014 ExactTarget
 * Licensed under MIT (https://github.com/ExactTarget/fuelux/blob/master/COPYING)
 */


// For more information on UMD visit: https://github.com/umdjs/umd/
( function( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery' ], factory );
	} else {
		factory( jQuery );
	}
}( function( jQuery ) {

	if ( typeof jQuery === 'undefined' ) {
		throw new Error( 'FuelUX\'s JavaScript requires jQuery' )
	}

	if ( typeof $.fn.dropdown === 'undefined' || typeof $.fn.collapse === 'undefined' ) {
		throw new Error( 'FuelUX\'s JavaScript requires Bootstrap' )
	}

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
			this.$element = $( element );
			this.$label = this.$element.parent();
			this.$parent = this.$label.parent( '.checkbox' );
			this.$toggleContainer = this.$element.attr( 'data-toggle' );
			this.state = {
				disabled: false,
				checked: false
			};

			if ( this.$parent.length === 0 ) {
				this.$parent = null;
			}

			if ( Boolean( this.$toggleContainer ) ) {
				this.$toggleContainer = $( this.$toggleContainer );
			} else {
				this.$toggleContainer = null;
			}

			// handle events
			this.$element.on( 'change.fu.checkbox', $.proxy( this.itemchecked, this ) );

			// set default state
			this.setState();
		};

		Checkbox.prototype = {

			constructor: Checkbox,

			setState: function( $chk ) {
				$chk = $chk || this.$element;

				this.state.disabled = Boolean( $chk.prop( 'disabled' ) );
				this.state.checked = Boolean( $chk.is( ':checked' ) );

				this._resetClasses();

				// set state of checkbox
				this._toggleCheckedState();
				this._toggleDisabledState();

				//toggle container
				this.toggleContainer();
			},

			enable: function() {
				this.state.disabled = false;
				this.$element.attr( 'disabled', false );
				this._resetClasses();
				this.$element.trigger( 'enabled.fu.checkbox' );
			},

			disable: function() {
				this.state.disabled = true;
				this.$element.attr( 'disabled', true );
				this._setDisabledClass();
				this.$element.trigger( 'disabled.fu.checkbox' );
			},

			check: function() {
				this.state.checked = true;
				this.$element.prop( 'checked', true );
				this._setCheckedClass();
				this.$element.trigger( 'checked.fu.checkbox' );
			},

			uncheck: function() {
				this.state.checked = false;
				this.$element.prop( 'checked', false );
				this._resetClasses();
				this.$element.trigger( 'unchecked.fu.checkbox' );
			},

			isChecked: function() {
				return this.state.checked;
			},

			toggle: function() {
				this.state.checked = !this.state.checked;

				this._toggleCheckedState();
			},

			toggleContainer: function() {
				if ( Boolean( this.$toggleContainer ) ) {
					if ( this.state.checked ) {
						this.$toggleContainer.removeClass( 'hide' );
						this.$toggleContainer.attr( 'aria-hidden', 'false' );
					} else {
						this.$toggleContainer.addClass( 'hide' );
						this.$toggleContainer.attr( 'aria-hidden', 'true' );
					}
				}
			},

			itemchecked: function( element ) {
				this.setState( $( element.target ) );
			},

			_resetClasses: function() {
				var classesToRemove = [];

				if ( !this.state.checked ) {
					classesToRemove.push( 'checked' );
				}

				if ( !this.state.disabled ) {
					classesToRemove.push( 'disabled' );
				}

				classesToRemove = classesToRemove.join( ' ' );

				this.$label.removeClass( classesToRemove );

				if ( this.$parent ) {
					this.$parent.removeClass( classesToRemove );
				}
			},

			_toggleCheckedState: function() {
				if ( this.state.checked ) {
					this.check();
				} else {
					this.uncheck();
				}
			},

			_toggleDisabledState: function() {
				if ( this.state.disabled ) {
					this.disable();
				} else {
					this.enable();
				}
			},

			_setCheckedClass: function() {
				this.$label.addClass( 'checked' );

				if ( this.$parent ) {
					this.$parent.addClass( 'checked' );
				}
			},

			_setDisabledClass: function() {
				this.$label.addClass( 'disabled' );

				if ( this.$parent ) {
					this.$parent.addClass( 'disabled' );
				}
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

				if ( !data ) {
					$this.data( 'checkbox', ( data = new Checkbox( this, options ) ) );
				}

				if ( typeof option === 'string' ) {
					methodReturn = data[ option ].apply( data, args );
				}
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.checkbox.defaults = {};

		$.fn.checkbox.Constructor = Checkbox;

		$.fn.checkbox.noConflict = function() {
			$.fn.checkbox = old;
			return this;
		};

		// DATA-API

		$( document ).on( 'mouseover.fu.checkbox.data-api', '[data-initialize=checkbox]', function( e ) {
			var $control = $( e.target ).closest( '.checkbox' ).find( '[type=checkbox]' );
			if ( !$control.data( 'checkbox' ) ) {
				$control.checkbox( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=checkbox] [type=checkbox]' ).each( function() {
				var $this = $( this );
				if ( !$this.data( 'checkbox' ) ) {
					$this.checkbox( $this.data() );
				}
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
			this.$element.on( 'click.fu.combobox', 'a', $.proxy( this.itemclicked, this ) );
			this.$element.on( 'change.fu.combobox', 'input', $.proxy( this.inputchanged, this ) );
			this.$input = this.$element.find( 'input' );
			this.$button = this.$element.find( '.btn' );

			// set default selection
			this.setDefaultSelection();
		};

		Combobox.prototype = {

			constructor: Combobox,

			doSelect: function( $item ) {
				if ( typeof $item[ 0 ] !== 'undefined' ) {
					this.$selectedItem = $item;
					this.$input.val( this.$selectedItem.text() );
				} else {
					this.$selectedItem = null;
				}
			},

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
				var $item = $( [] );
				this.$element.find( 'li' ).each( function() {
					if ( ( this.textContent || this.innerText || $( this ).text() || '' ).toLowerCase() === ( text || '' ).toLowerCase() ) {
						$item = $( this );
						return false;
					}
				} );
				this.doSelect( $item );
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
				this.doSelect( $item );
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
				this.$element.removeClass( 'disabled' );
				this.$input.removeAttr( 'disabled' );
				this.$button.removeClass( 'disabled' );
			},

			disable: function() {
				this.$element.addClass( 'disabled' );
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
				this.$element.trigger( 'changed.fu.combobox', data );

				e.preventDefault();

				// return focus to control after selecting an option
				this.$element.find( '.dropdown-toggle' ).focus();
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
				this.$element.trigger( 'changed.fu.combobox', data );

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


		// DATA-API

		$( document ).on( 'mousedown.fu.combobox.data-api', '[data-initialize=combobox]', function( e ) {
			var $control = $( e.target ).closest( '.combobox' );
			if ( !$control.data( 'combobox' ) ) {
				$control.combobox( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=combobox]' ).each( function() {
				var $this = $( this );
				if ( !$this.data( 'combobox' ) ) {
					$this.combobox( $this.data() );
				}
			} );
		} );


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
				this.$element.addClass( 'disabled' );
				this.$element.find( 'input, button' ).attr( 'disabled', 'disabled' );
				this._close();
				this.$element.find( '.input-group-btn' ).removeClass( 'open' );
			},

			enable: function() {
				this.$element.removeClass( 'disabled' );
				this.$element.find( 'input, button' ).removeAttr( 'disabled' );
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
				this.$element.trigger( 'changed.fu.datepicker', this.date );
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

				// return focus to previous button to support keybaord navigation
				this.$element.find( '.left' ).focus();
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

				// return focus to next button to support keybaord navigation
				this.$element.find( '.right' ).focus();
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
					'<button class="left hover"><span class="leftArrow"></span></button>' +
					'<button class="right hover"><span class="rightArrow"></span></button>' +
					'<div class="center hover">' + self._monthYearLabel() + '</div>' +
					'</div>' +
					'<div class="daysView" style="' + self._show( self.options.showDays ) + '">' +

				self._repeat( '<div class="weekdays">', self.options.weekdays,
					function( weekday ) {
						return '<div>' + weekday + '</div>';
					}, '</div>' ) +

				self._repeat( '<div class="lastmonth">', self.daysOfLastMonth,
					function( day ) {
						if ( self.options.restrictLastMonth ) {
							day[ 'class' ] = day[ 'class' ].replace( 'restrict', '' ) + " restrict";
						}
						return '<button class="' + day[ 'class' ] + '">' + day.number + '</button>';
					}, '</div>' ) +

				self._repeat( '<div class="thismonth">', self.daysOfThisMonth,
					function( day ) {
						return '<button class="' + day[ 'class' ] + '">' + day.number + '</button>';
					}, '</div>' ) +

				self._repeat( '<div class="nextmonth">', self.daysOfNextMonth,
					function( day ) {
						if ( self.options.restrictNextMonth ) {
							day[ 'class' ] = day[ 'class' ].replace( 'restrict', '' ) + " restrict";
						}
						return '<button class="' + day[ 'class' ] + '">' + day.number + '</button>';
					}, '</div>' ) +
					'</div>' +

				self._repeat( '<div class="monthsView" style="' + self._show( self.options.showMonths ) + '">', self.months,
					function( month ) {
						return '<button data-month-number="' + month.number +
							'" class="' + month[ 'class' ] + '">' + month.abbreviation + '</button>';
					}, '</div>' ) +

				self._repeat( '<div class="yearsView" style="' + self._show( self.options.showYears ) + '">', self.years,
					function( year ) {
						return '<button data-year-number="' + year.number +
							'" class="' + year[ 'class' ] + '">' + year.number + '</button>';
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
				this.$element.find( '.calendar-menu' ).html( this._renderCalendar() );
				this._initializeCalendarElements();
				this._addBindings();
				this._updateCss();
			},

			_renderWithoutInputManipulation: function() {
				this._updateCalendarData();
				if ( Boolean( this.bindingsAdded ) ) this._removeBindings();
				this.$element.find( '.calendar-menu' ).html( this._renderCalendar() );
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
					this.$element.trigger( 'inputParsingFailed.fu.datepicker' );
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
					this.$calendar.on( 'mouseover.fu.datepicker', function() {
						self.inputParsingTarget = 'calendar';
					} );
					this.$calendar.on( 'mouseout.fu.datepicker', function() {
						self.inputParsingTarget = null;
					} );

					this.$input.on( 'blur.fu.datepicker', function() {
						if ( self.inputParsingTarget === null ) {
							self._inputDateParsing();
						}
					} );
				}

				this.$calendar.on( 'click.fu.datepicker', $.proxy( this._emptySpace, this ) );

				if ( this.options.restrictToYear !== this.viewDate.getFullYear() || this.viewDate.getMonth() > 0 ) {
					this.$header.find( '.left' ).on( 'click.fu.datepicker', $.proxy( this._previous, this ) );
				} else {
					this.$header.find( '.left' ).addClass( 'disabled' );
				}

				if ( this.options.restrictToYear !== this.viewDate.getFullYear() || this.viewDate.getMonth() < 11 ) {
					this.$header.find( '.right' ).on( 'click.fu.datepicker', $.proxy( this._next, this ) );
				} else {
					this.$header.find( '.right' ).addClass( 'disabled' );
				}

				this.$header.find( '.center' ).on( 'click.fu.datepicker', $.proxy( this._toggleMonthYearPicker, this ) );

				this.$lastMonthDiv.find( 'button' ).on( 'click.fu.datepicker', $.proxy( this._previousSet, this ) );
				this.$thisMonthDiv.find( 'button' ).on( 'click.fu.datepicker', $.proxy( this._select, this ) );
				this.$nextMonthDiv.find( 'button' ).on( 'click.fu.datepicker', $.proxy( this._nextSet, this ) );

				this.$monthsView.find( 'button' ).on( 'click.fu.datepicker', $.proxy( this._pickMonth, this ) );
				this.$yearsView.find( 'button' ).on( 'click.fu.datepicker', $.proxy( this._pickYear, this ) );
				this.$footer.find( '.center' ).on( 'click.fu.datepicker', $.proxy( this._today, this ) );

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

				this.$lastMonthDiv.find( 'button' ).off( 'click' );
				this.$thisMonthDiv.find( 'button' ).off( 'click' );
				this.$nextMonthDiv.find( 'button' ).off( 'click' );

				this.$monthsView.find( 'button' ).off( 'click' );
				this.$yearsView.find( 'button' ).off( 'click' );
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

		// DATA-API
		// 
		// 

		$( document ).on( 'mousedown.fu.datepicker.data-api', '[data-initialize=datepicker]', function( e ) {
			var $control = $( e.target ).closest( '.datepicker' );
			if ( !$control.data( 'datepicker' ) ) {
				$control.datepicker( $control.data() );
			}
		} );

		$( function() {
			$( '[data-initialize=datepicker]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'datepicker' ) ) return;
				$this.datepicker( $this.data() );
			} );
		} );




	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Dropdown Auto Flip
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		$( document.body ).on( "click.fu.dropdown-autoflip", "[data-toggle=dropdown][data-flip]", function( event ) {

			if ( $( this ).data().flip === "auto" ) {
				// have the drop down decide where to place itself
				_autoFlip( $( this ).next( '.dropdown-menu' ) );
			}
		} );

		//Intelligent suggestions dropdown from pillbox
		$( document.body ).on( "suggested.fu.pillbox", function( event, element ) {
			_autoFlip( $( element ) );
			$( element ).parent().addClass( 'open' );
		} );

		function _autoFlip( menu ) {
			// hide while the browser thinks
			$( menu ).css( {
				visibility: "hidden"
			} );

			// decide where to put menu
			if ( dropUpCheck( menu ) ) {
				menu.parent().addClass( "dropup" );
			} else {
				menu.parent().removeClass( "dropup" );
			}

			// show again
			$( menu ).css( {
				visibility: "visible"
			} );
		}

		function dropUpCheck( element ) {
			// caching container
			var $container = _getContainer( element );

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

		function _getContainer( element ) {
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

		// register empty plugin
		$.fn.dropdownautoflip = function() { /* empty */ };


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

		var old = $.fn.loader;

		// LOADER CONSTRUCTOR AND PROTOTYPE

		var Loader = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.loader.defaults, options );

			this.begin = ( this.$element.is( '[data-begin]' ) ) ? parseInt( this.$element.attr( 'data-begin' ), 10 ) : 1;
			this.delay = ( this.$element.is( '[data-delay]' ) ) ? parseFloat( this.$element.attr( 'data-delay' ) ) : 150;
			this.end = ( this.$element.is( '[data-end]' ) ) ? parseInt( this.$element.attr( 'data-end' ), 10 ) : 8;
			this.frame = ( this.$element.is( '[data-frame]' ) ) ? parseInt( this.$element.attr( 'data-frame' ), 10 ) : this.begin;
			this.isIElt9 = false;
			this.timeout = {};

			var ieVer = this.msieVersion();
			if ( ieVer !== false && ieVer < 9 ) {
				this.$element.addClass( 'iefix' );
				this.isIElt9 = true;
			}

			this.$element.attr( 'data-frame', this.frame + '' );
			this.play();
		};

		Loader.prototype = {

			constructor: Loader,

			ieRepaint: function() {
				if ( this.isIElt9 ) {
					this.$element.addClass( 'iefix_repaint' ).removeClass( 'iefix_repaint' );
				}
			},

			msieVersion: function() {
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf( 'MSIE ' );
				if ( msie > 0 ) {
					return parseInt( ua.substring( msie + 5, ua.indexOf( ".", msie ) ), 10 );
				} else {
					return false;
				}
			},

			next: function() {
				this.frame++;
				if ( this.frame > this.end ) {
					this.frame = this.begin;
				}
				this.$element.attr( 'data-frame', this.frame + '' );
				this.ieRepaint();
			},

			pause: function() {
				clearTimeout( this.timeout );
			},

			play: function() {
				var self = this;
				clearTimeout( this.timeout );
				this.timeout = setTimeout( function() {
					self.next();
					self.play();
				}, this.delay );
			},

			prev: function() {
				this.frame--;
				if ( this.frame < this.begin ) {
					this.frame = this.end;
				}
				this.$element.attr( 'data-frame', this.frame + '' );
				this.ieRepaint();
			},

			reset: function() {
				this.frame = this.begin;
				this.$element.attr( 'data-frame', this.frame + '' );
				this.ieRepaint();
			}

		};

		// LOADER PLUGIN DEFINITION

		$.fn.loader = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'loader' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'loader', ( data = new Loader( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.loader.defaults = {};

		$.fn.loader.Constructor = Loader;

		$.fn.loader.noConflict = function() {
			$.fn.loader = old;
			return this;
		};

		// INIT LOADER ON DOMCONTENTLOADED

		$( function() {
			$( '[data-initialize=loader]' ).each( function() {
				var $this = $( this );
				if ( !$this.data( 'loader' ) ) {
					$this.loader( $this.data() );
				}
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Placard
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.placard;

		// PLACARD CONSTRUCTOR AND PROTOTYPE

		var Placard = function( element, options ) {
			var self = this;
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.placard.defaults, options );

			this.$accept = this.$element.find( '.placard-accept' );
			this.$cancel = this.$element.find( '.placard-cancel' );
			this.$field = this.$element.find( '.placard-field' );
			this.$footer = this.$element.find( '.placard-footer' );
			this.$header = this.$element.find( '.placard-header' );
			this.$popup = this.$element.find( '.placard-popup' );

			this.actualValue = null;
			this.clickStamp = '_';
			this.previousValue = '';
			if ( this.options.revertOnCancel === -1 ) {
				this.options.revertOnCancel = ( this.$accept.length > 0 ) ? true : false;
			}

			this.$field.on( 'focus.fu.placard', $.proxy( this.show, this ) );
			this.$accept.on( 'click.fu.placard', $.proxy( this.complete, this, 'accept' ) );
			this.$cancel.on( 'click.fu.placard', function( e ) {
				e.preventDefault();
				self.complete( 'cancel' );
			} );

			this.ellipsis();
		};

		Placard.prototype = {
			constructor: Placard,

			complete: function( action ) {
				var func = this.options[ 'on' + action[ 0 ].toUpperCase() + action.substring( 1 ) ];
				var obj = {
					previousValue: this.previousValue,
					value: this.$field.val()
				};
				if ( func ) {
					func( obj );
					this.$element.trigger( action, obj );
				} else {
					if ( action === 'cancel' && this.options.revertOnCancel ) {
						this.$field.val( this.previousValue );
					}
					this.$element.trigger( action, obj );
					this.hide();
				}
			},

			ellipsis: function() {
				var field, i, str;
				if ( this.$element.attr( 'data-ellipsis' ) === 'true' ) {
					field = this.$field.get( 0 );
					if ( this.$field.is( 'input' ) ) {
						field.scrollLeft = 0;
					} else {
						field.scrollTop = 0;
						if ( field.clientHeight < field.scrollHeight ) {
							this.actualValue = this.$field.val();
							this.$field.val( '' );
							str = '';
							i = 0;
							while ( field.clientHeight >= field.scrollHeight ) {
								str += this.actualValue[ i ];
								this.$field.val( str + '...' );
								i++;
							}
							str = ( str.length > 0 ) ? str.substring( 0, str.length - 1 ) : '';
							this.$field.val( str + '...' );
						}
					}
				}
			},

			getValue: function() {
				if ( this.actualValue !== null ) {
					return this.actualValue;
				} else {
					return this.$field.val();
				}
			},

			hide: function() {
				if ( !this.$element.hasClass( 'showing' ) ) {
					return;
				}
				this.$element.removeClass( 'showing' );
				this.ellipsis();
				$( document ).off( 'click.fu.placard.externalClick.' + this.clickStamp );
				this.$element.trigger( 'hidden.fu.placard' );
			},

			externalClickListener: function( e, force ) {
				if ( force === true || this.isExternalClick( e ) ) {
					this.complete( this.options.externalClickAction );
				}
			},

			isExternalClick: function( e ) {
				var el = this.$element.get( 0 );
				var exceptions = this.options.externalClickExceptions || [];
				var $originEl = $( e.target );
				var i, l;

				if ( e.target === el || $originEl.parents( '.placard:first' ).get( 0 ) === el ) {
					return false;
				} else {
					for ( i = 0, l = exceptions.length; i < l; i++ ) {
						if ( $originEl.is( exceptions[ i ] ) || $originEl.parents( exceptions[ i ] ).length > 0 ) {
							return false;
						}
					}
				}
				return true;
			},

			setValue: function( val ) {
				this.$field.val( val );
				if ( !this.$element.hasClass( 'showing' ) ) {
					this.ellipsis();
				}
			},

			show: function() {
				var other;

				if ( this.$element.hasClass( 'showing' ) ) {
					return;
				}
				other = $( document ).find( '.placard.showing' );
				if ( other.length > 0 ) {
					if ( other.data( 'placard' ) && other.data( 'placard' ).options.explicit ) {
						return;
					}
					other.placard( 'externalClickListener', {}, true );
				}
				this.previousValue = this.$field.val();

				this.$element.addClass( 'showing' );
				if ( this.actualValue !== null ) {
					this.$field.val( this.actualValue );
					this.actualValue = null;
				}
				if ( this.$header.length > 0 ) {
					this.$popup.css( 'top', '-' + this.$header.outerHeight( true ) + 'px' );
				}
				if ( this.$footer.length > 0 ) {
					this.$popup.css( 'bottom', '-' + this.$footer.outerHeight( true ) + 'px' );
				}

				this.$element.trigger( 'shown.fu.placard' );
				this.clickStamp = new Date().getTime() + ( Math.floor( Math.random() * 100 ) + 1 );
				if ( !this.options.explicit ) {
					$( document ).on( 'click.fu.placard.externalClick.' + this.clickStamp, $.proxy( this.externalClickListener, this ) );
				}
			}
		};

		// PLACARD PLUGIN DEFINITION

		$.fn.placard = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'placard' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'placard', ( data = new Placard( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.placard.defaults = {
			onAccept: undefined,
			onCancel: undefined,
			externalClickAction: 'cancel',
			externalClickExceptions: [],
			explicit: false,
			revertOnCancel: -1 //negative 1 will check for an '.placard-accept' button. Also can be set to true or false
		};

		$.fn.placard.Constructor = Placard;

		$.fn.placard.noConflict = function() {
			$.fn.placard = old;
			return this;
		};

		// DATA-API

		$( document ).on( 'focus.fu.placard.data-api', '[data-initialize=placard]', function( e ) {
			var $control = $( e.target ).closest( '.placard' );
			if ( !$control.data( 'placard' ) ) {
				$control.placard( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=placard]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'placard' ) ) return;
				$this.placard( $this.data() );
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
			this.$toggleContainer = null;

			if ( this.$parent.length === 0 ) {
				this.$parent = null;
			}

			var toggleSelector = this.$radio.attr( 'data-toggle' );
			if ( toggleSelector ) {
				this.$toggleContainer = $( toggleSelector );
			}

			// set default state
			this.setState( this.$radio );

			// handle events
			this.$radio.on( 'change.fu.radio', $.proxy( this.itemchecked, this ) );
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

				//toggle container
				this.toggleContainer();
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

			toggleContainer: function() {
				var group;
				if ( this.$toggleContainer ) {
					// show corresponding container for currently selected radio
					if ( this.isChecked() ) {
						// hide containers for each item in group
						group = $( 'input[name="' + this.groupName + '"]' );
						group.each( function() {
							var selector = $( this ).attr( 'data-toggle' );
							$( selector ).addClass( 'hide' );
							$( selector ).attr( 'aria-hidden', 'true' );
						} );
						this.$toggleContainer.removeClass( 'hide' );
						this.$toggleContainer.attr( 'aria-hidden', 'false' );
					} else {
						this.$toggleContainer.addClass( 'hide' );
						this.$toggleContainer.attr( 'aria-hidden', 'true' );
					}

				}
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


		// DATA-API

		$( document ).on( 'mouseover.fu.checkbox.data-api', '[data-initialize=radio]', function( e ) {
			var $control = $( e.target ).closest( '.radio' ).find( '[type=radio]' );
			if ( !$control.data( 'radio' ) ) {
				$control.radio( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=radio] [type=radio]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'radio' ) ) return;
				$this.radio( $this.data() );
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

			this.$button = this.$element.find( 'button' );
			this.$input = this.$element.find( 'input' );
			this.$icon = this.$element.find( '.glyphicon' );

			this.$button.on( 'click.fu.search', $.proxy( this.buttonclicked, this ) );
			this.$input.on( 'keydown.fu.search', $.proxy( this.keypress, this ) );
			this.$input.on( 'keyup.fu.search', $.proxy( this.keypressed, this ) );

			this.activeSearch = '';
		};

		Search.prototype = {

			constructor: Search,

			search: function( searchText ) {
				this.$icon.attr( 'class', 'glyphicon glyphicon-remove' );
				this.activeSearch = searchText;
				this.$element.trigger( 'searched.fu.search', searchText );
			},

			clear: function() {
				this.$icon.attr( 'class', 'glyphicon glyphicon-search' );
				this.activeSearch = '';
				this.$input.val( '' );
				this.$element.trigger( 'cleared.fu.search' );
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
				this.$element.addClass( 'disabled' );
				this.$input.attr( 'disabled', 'disabled' );
				this.$button.addClass( 'disabled' );
			},

			enable: function() {
				this.$element.removeClass( 'disabled' );
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


		// DATA-API

		$( document ).on( 'mousedown.fu.search.data-api', '[data-initialize=search]', function( e ) {
			var $control = $( e.target ).closest( '.search' );
			if ( !$control.data( 'search' ) ) {
				$control.search( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=search]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'search' ) ) return;
				$this.search( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Button Dropdown
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.selectlist;
		// SELECT CONSTRUCTOR AND PROTOTYPE

		var Selectlist = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.selectlist.defaults, options );

			this.$button = this.$element.find( '.btn.dropdown-toggle' );
			this.$hiddenField = this.$element.find( '.hidden-field' );
			this.$label = this.$element.find( '.selected-label' );

			this.$element.on( 'click.fu.selectlist', '.dropdown-menu a', $.proxy( this.itemClicked, this ) );
			this.setDefaultSelection();

			if ( options.resize === 'auto' ) {
				this.resize();
			}
		};

		Selectlist.prototype = {

			constructor: Selectlist,

			doSelect: function( $item ) {
				this.$selectedItem = $item;
				this.$hiddenField.val( this.$selectedItem.attr( 'data-value' ) );
				this.$label.text( this.$selectedItem.text() );
			},

			itemClicked: function( e ) {
				this.$element.trigger( 'clicked.fu.selectlist', this.$selectedItem );

				e.preventDefault();

				// is clicked element different from currently selected element?
				if ( !( $( e.target ).parent().is( this.$selectedItem ) ) ) {
					this.itemChanged( e );
				}

				// return focus to control after selecting an option
				this.$element.find( '.dropdown-toggle' ).focus();

			},

			itemChanged: function( e ) {
				this.$selectedItem = $( e.target ).parent();

				// store value in hidden field for form submission
				this.$hiddenField.val( this.$selectedItem.attr( 'data-value' ) );
				this.$label.text( this.$selectedItem.text() );

				// pass object including text and any data-attributes
				// to onchange event
				var data = this.selectedItem();
				// trigger changed event
				this.$element.trigger( 'changed.fu.selectlist', data );
			},

			resize: function() {
				var newWidth = 0;
				var sizer = $( '<div/>' ).addClass( 'selectlist-sizer' );
				var width = 0;

				if ( Boolean( $( document ).find( 'html' ).hasClass( 'fuelux' ) ) ) {
					// default behavior for fuel ux setup. means fuelux was a class on the html tag
					$( document.body ).append( sizer );
				} else {
					// fuelux is not a class on the html tag. So we'll look for the first one we find so the correct styles get applied to the sizer
					$( '.fuelux:first' ).append( sizer );
				}

				// iterate through each item to find longest string
				this.$element.find( 'a' ).each( function() {
					sizer.text( $( this ).text() );
					newWidth = sizer.outerWidth();
					if ( newWidth > width ) {
						width = newWidth;
					}
				} );

				sizer.remove();

				//TODO: betting this is somewhat off with box-sizing: border-box
				this.$label.width( width );
			},

			selectedItem: function() {
				var txt = this.$selectedItem.text();
				return $.extend( {
					text: txt
				}, this.$selectedItem.data() );
			},

			selectByText: function( text ) {
				var $item = $( [] );
				this.$element.find( 'li' ).each( function() {
					if ( ( this.textContent || this.innerText || $( this ).text() || '' ).toLowerCase() === ( text || '' ).toLowerCase() ) {
						$item = $( this );
						return false;
					}
				} );
				this.doSelect( $item );
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
				this.doSelect( $item );
			},

			setDefaultSelection: function() {
				var selector = 'li[data-selected=true]:first';
				var item = this.$element.find( selector );
				if ( item.length === 0 ) {
					// select first item
					this.selectByIndex( 0 );
				} else {
					// select by data-attribute
					this.selectBySelector( selector );
					item.removeData( 'selected' );
					item.removeAttr( 'data-selected' );
				}
			},

			enable: function() {
				this.$element.removeClass( 'disabled' );
				this.$button.removeClass( 'disabled' );
			},

			disable: function() {
				this.$element.addClass( 'disabled' );
				this.$button.addClass( 'disabled' );
			}

		};


		// SELECT PLUGIN DEFINITION

		$.fn.selectlist = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'selectlist' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'selectlist', ( data = new Selectlist( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.selectlist.defaults = {};

		$.fn.selectlist.Constructor = Selectlist;

		$.fn.selectlist.noConflict = function() {
			$.fn.selectlist = old;
			return this;
		};


		// DATA-API

		$( document ).on( 'mousedown.fu.selectlist.data-api', '[data-initialize=selectlist]', function( e ) {
			var $control = $( e.target ).closest( '.selectlist' );
			if ( !$control.data( 'selectlist' ) ) {
				$control.selectlist( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=selectlist]' ).each( function() {
				var $this = $( this );
				if ( !$this.data( 'selectlist' ) ) {
					$this.selectlist( $this.data() );
				}
			} );
		} );



	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Spinbox
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.spinbox;

		// SPINBOX CONSTRUCTOR AND PROTOTYPE

		var Spinbox = function( element, options ) {
			this.$element = $( element );
			this.options = $.extend( {}, $.fn.spinbox.defaults, options );
			this.$input = this.$element.find( '.spinbox-input' );
			this.$element.on( 'focusin.fu.spinbox', this.$input, $.proxy( this.changeFlag, this ) );
			this.$element.on( 'focusout.fu.spinbox', this.$input, $.proxy( this.change, this ) );
			this.$element.on( 'keydown.fu.spinbox', this.$input, $.proxy( this.keydown, this ) );
			this.$element.on( 'keyup.fu.spinbox', this.$input, $.proxy( this.keyup, this ) );

			this.bindMousewheelListeners();
			this.mousewheelTimeout = {};

			if ( this.options.hold ) {
				this.$element.on( 'mousedown.fu.spinbox', '.spinbox-up', $.proxy( function() {
					this.startSpin( true );
				}, this ) );
				this.$element.on( 'mouseup.fu.spinbox', '.spinbox-up, .spinbox-down', $.proxy( this.stopSpin, this ) );
				this.$element.on( 'mouseout.fu.spinbox', '.spinbox-up, .spinbox-down', $.proxy( this.stopSpin, this ) );
				this.$element.on( 'mousedown.fu.spinbox', '.spinbox-down', $.proxy( function() {
					this.startSpin( false );
				}, this ) );
			} else {
				this.$element.on( 'click.fu.spinbox', '.spinbox-up', $.proxy( function() {
					this.step( true );
				}, this ) );
				this.$element.on( 'click.fu.spinbox', '.spinbox-down', $.proxy( function() {
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

			this.lastValue = this.options.value;

			this.render();

			if ( this.options.disabled ) {
				this.disable();
			}
		};

		Spinbox.prototype = {
			constructor: Spinbox,

			render: function() {
				var inputValue = this.parseInput( this.$input.val() );
				var maxUnitLength = '';

				// if input is empty and option value is default, 0
				if ( inputValue !== '' && this.options.value === 0 ) {
					this.value( inputValue );
				} else {
					this.output( this.options.value );
				}

				if ( this.options.units.length ) {
					$.each( this.options.units, function( index, value ) {
						if ( value.length > maxUnitLength.length ) {
							maxUnitLength = value;
						}
					} );
				}

			},

			output: function( value, updateField ) {
				value = ( value + '' ).split( '.' ).join( this.options.decimalMark );
				updateField = ( updateField || true );
				if ( updateField ) {
					this.$input.val( value );
				}

				return value;
			},

			parseInput: function( value ) {
				value = ( value + '' ).split( this.options.decimalMark ).join( '.' );

				return value;
			},

			change: function() {
				var newVal = this.parseInput( this.$input.val() ) || '';

				if ( this.options.units.length || this.options.decimalMark !== '.' ) {
					newVal = this.parseValueWithUnit( newVal );
				} else if ( newVal / 1 ) {
					newVal = this.options.value = this.checkMaxMin( newVal / 1 );
				} else {
					newVal = this.checkMaxMin( newVal.replace( /[^0-9.-]/g, '' ) || '' );
					this.options.value = newVal / 1;
				}
				this.output( newVal );

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
				this.$element.trigger( 'changed.fu.spinbox', this.output( currentValue, false ) ); // no DOM update
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
						this.iterate( type );
					}, this ), this.switches.speed / divisor );
					this.switches.count++;
				}
			},

			iterate: function( type ) {
				this.step( type );
				this.startSpin( type );
			},

			step: function( isIncrease ) {
				// isIncrease: true is up, false is down

				var digits, multiple, currentValue, limitValue;

				// trigger change event
				if ( this.changeFlag ) {
					this.change();
				}

				// get current value and min/max options
				currentValue = this.options.value;
				limitValue = isIncrease ? this.options.max : this.options.min;

				if ( ( isIncrease ? currentValue < limitValue : currentValue > limitValue ) ) {
					var newVal = currentValue + ( isIncrease ? 1 : -1 ) * this.options.step;

					// raise to power of 10 x number of decimal places, then round
					if ( this.options.step % 1 !== 0 ) {
						digits = ( this.options.step + '' ).split( '.' )[ 1 ].length;
						multiple = Math.pow( 10, digits );
						newVal = Math.round( newVal * multiple ) / multiple;
					}

					// if outside limits, set to limit value
					if ( isIncrease ? newVal > limitValue : newVal < limitValue ) {
						this.value( limitValue );
					} else {
						this.value( newVal );
					}

				} else if ( this.options.cycle ) {
					var cycleVal = isIncrease ? this.options.min : this.options.max;
					this.value( cycleVal );
				}
			},

			value: function( value ) {

				if ( value || value === 0 ) {
					if ( this.options.units.length || this.options.decimalMark !== '.' ) {
						this.output( this.parseValueWithUnit( value + ( this.unit || '' ) ) );
						return this;

					} else if ( !isNaN( parseFloat( value ) ) && isFinite( value ) ) {
						this.options.value = value / 1;
						this.output( value + ( this.unit ? this.unit : '' ) );
						return this;

					}
				} else {
					if ( this.changeFlag ) {
						this.change();
					}

					if ( this.unit ) {
						return this.options.value + this.unit;
					} else {
						return this.output( this.options.value, false ); // no DOM update
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

			// strips units and add them back
			parseValueWithUnit: function( value ) {
				var unit = value.replace( /[^a-zA-Z]/g, '' );
				var number = value.replace( /[^0-9.-]/g, '' );

				if ( unit ) {
					unit = this.isUnitLegal( unit );
				}

				this.options.value = this.checkMaxMin( number / 1 );
				this.unit = unit || undefined;
				return this.options.value + ( unit || '' );
			},

			checkMaxMin: function( value ) {
				// if unreadable
				if ( isNaN( parseFloat( value ) ) ) {
					return value;
				}
				// if not within range return the limit
				if ( !( value <= this.options.max && value >= this.options.min ) ) {
					value = value >= this.options.max ? this.options.max : this.options.min;
				}
				return value;
			},

			disable: function() {
				this.options.disabled = true;
				this.$element.addClass( 'disabled' );
				this.$input.attr( 'disabled', '' );
				this.$element.find( 'button' ).addClass( 'disabled' );
			},

			enable: function() {
				this.options.disabled = false;
				this.$element.removeClass( 'disabled' );
				this.$input.removeAttr( "disabled" );
				this.$element.find( 'button' ).removeClass( 'disabled' );
			},

			keydown: function( event ) {
				var keyCode = event.keyCode;
				if ( keyCode === 38 ) {
					this.step( true );
				} else if ( keyCode === 40 ) {
					this.step( false );
				}
			},

			keyup: function( event ) {
				var keyCode = event.keyCode;

				if ( keyCode === 38 || keyCode === 40 ) {
					this.triggerChangedEvent();
				}
			},

			bindMousewheelListeners: function() {
				var inputEl = this.$input.get( 0 );
				if ( inputEl.addEventListener ) {
					//IE 9, Chrome, Safari, Opera
					inputEl.addEventListener( 'mousewheel', $.proxy( this.mousewheelHandler, this ), false );
					// Firefox
					inputEl.addEventListener( 'DOMMouseScroll', $.proxy( this.mousewheelHandler, this ), false );
				} else {
					// IE <9
					inputEl.attachEvent( 'onmousewheel', $.proxy( this.mousewheelHandler, this ) );
				}
			},

			mousewheelHandler: function( event ) {
				var e = window.event || event; // old IE support
				var delta = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
				var self = this;

				clearTimeout( this.mousewheelTimeout );
				this.mousewheelTimeout = setTimeout( function() {
					self.triggerChangedEvent();
				}, 300 );

				if ( delta < 0 ) {
					this.step( true );
				} else {
					this.step( false );
				}

				if ( e.preventDefault ) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				return false;
			}
		};


		// SPINBOX PLUGIN DEFINITION

		$.fn.spinbox = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'spinbox' );
				var options = typeof option === 'object' && option;

				if ( !data ) {
					$this.data( 'spinbox', ( data = new Spinbox( this, options ) ) );
				}
				if ( typeof option === 'string' ) {
					methodReturn = data[ option ].apply( data, args );
				}
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		// value needs to be 0 for this.render();
		$.fn.spinbox.defaults = {
			value: 0,
			min: 0,
			max: 999,
			step: 1,
			hold: true,
			speed: 'medium',
			disabled: false,
			cycle: false,
			units: [],
			decimalMark: '.'
		};

		$.fn.spinbox.Constructor = Spinbox;

		$.fn.spinbox.noConflict = function() {
			$.fn.spinbox = old;
			return this;
		};


		// DATA-API

		$( document ).on( 'mousedown.fu.spinbox.data-api', '[data-initialize=spinbox]', function( e ) {
			var $control = $( e.target ).closest( '.spinbox' );
			if ( !$control.data( 'spinbox' ) ) {
				$control.spinbox( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=spinbox]' ).each( function() {
				var $this = $( this );
				if ( !$this.data( 'spinbox' ) ) {
					$this.spinbox( $this.data() );
				}
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

			this.$element.on( 'click.fu.tree', '.tree-item', $.proxy( function( ev ) {
				this.selectItem( ev.currentTarget );
			}, this ) );
			this.$element.on( 'click.fu.tree', '.tree-branch-name', $.proxy( function( ev ) {
				this.openFolder( ev.currentTarget );
			}, this ) );

			if ( this.options.folderSelect ) {
				this.$element.off( 'click.fu.tree', '.tree-branch-name' );
				this.$element.on( 'click.fu.tree', '.icon-caret', $.proxy( function( ev ) {
					this.openFolder( $( ev.currentTarget ).parent() );
				}, this ) );
				this.$element.on( 'click.fu.tree', '.tree-branch-name', $.proxy( function( ev ) {
					this.selectFolder( $( ev.currentTarget ) );
				}, this ) );
			}

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

				loader.removeClass( 'hide' );
				this.options.dataSource( $el.data(), function( items ) {
					loader.addClass( 'hide' );

					$.each( items.data, function( index, value ) {
						var $entity;

						if ( value.type === 'folder' ) {
							$entity = self.$element.find( '.tree-branch:eq(0)' ).clone().removeClass( 'hide' );
							$entity.data( value );
							$entity.find( '.tree-branch-name > .tree-label' ).html( value.name );
						} else if ( value.type === 'item' ) {
							$entity = self.$element.find( '.tree-item:eq(0)' ).clone().removeClass( 'hide' );
							$entity.find( '.tree-item-name > .tree-label' ).html( value.name );
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
						//         'guid': guid,
						//         'id': guid
						//     }
						// };

						// add attributes to tree-branch or tree-item
						var dataAttributes = value.dataAttributes || [];
						$.each( dataAttributes, function( key, value ) {
							switch ( key ) {
								case 'class':
								case 'classes':
								case 'className':
									$entity.addClass( value );
									break;

									// allow custom icons
								case 'data-icon':
									$entity.find( '.icon-item' ).removeClass().addClass( 'icon-item ' + value );
									$entity.attr( key, value );
									break;

									// ARIA support
								case 'id':
									$entity.attr( key, value );
									$entity.attr( 'aria-labelledby', value + '-label' );
									$entity.find( '.tree-branch-name > .tree-label' ).attr( 'id', value + '-label' );
									break;

									// id, style, data-*
								default:
									$entity.attr( key, value );
									break;
							}
						} );

						// add child nodes
						if ( $el.hasClass( 'tree-branch-header' ) ) {
							$parent.find( '.tree-branch-children:eq(0)' ).append( $entity );
						} else {
							$el.append( $entity );
						}
					} );

					// return newly populated folder
					self.$element.trigger( 'loaded.fu.tree', $parent );
				} );
			},

			selectItem: function( el ) {
				var $el = $( el );
				var $all = this.$element.find( '.tree-selected' );
				var data = [];
				var $icon = $el.find( '.icon-item' );

				if ( this.options.multiSelect ) {
					$.each( $all, function( index, value ) {
						var $val = $( value );
						if ( $val[ 0 ] !== $el[ 0 ] ) {
							data.push( $( value ).data() );
						}
					} );
				} else if ( $all[ 0 ] !== $el[ 0 ] ) {
					$all.removeClass( 'tree-selected' )
						.find( '.glyphicon' ).removeClass( 'glyphicon-ok' ).addClass( 'tree-dot' );
					data.push( $el.data() );
				}

				var eventType = 'selected';
				if ( $el.hasClass( 'tree-selected' ) ) {
					eventType = 'unselected';
					$el.removeClass( 'tree-selected' );
					if ( $icon.hasClass( 'glyphicon-ok' ) || $icon.hasClass( 'fueluxicon-bullet' ) ) {
						$icon.removeClass( 'glyphicon-ok' ).addClass( 'fueluxicon-bullet' );
					}
				} else {
					$el.addClass( 'tree-selected' );
					// add tree dot back in
					if ( $icon.hasClass( 'glyphicon-ok' ) || $icon.hasClass( 'fueluxicon-bullet' ) ) {
						$icon.removeClass( 'fueluxicon-bullet' ).addClass( 'glyphicon-ok' );
					}
					if ( this.options.multiSelect ) {
						data.push( $el.data() );
					}
				}

				if ( data.length ) {
					this.$element.trigger( 'selected', {
						selected: data
					} );
				}

				// Return new list of selected items, the item
				// clicked, and the type of event:
				$el.trigger( 'updated.fu.tree', {
					selected: data,
					item: $el,
					eventType: eventType
				} );
			},

			openFolder: function( el ) {
				var $el = $( el ); // tree-branch-name
				var $branch;
				var $treeFolderContent;
				var $treeFolderContentFirstChild;

				// if item select only
				if ( !this.options.folderSelect ) {
					$el = $( el ).parent(); // tree-branch, if tree-branch-name clicked
				}

				$branch = $el.closest( '.tree-branch' ); // tree branch
				$treeFolderContent = $branch.find( '.tree-branch-children' );
				$treeFolderContentFirstChild = $treeFolderContent.eq( 0 );

				// manipulate branch/folder
				var eventType, classToTarget, classToAdd;
				if ( $el.find( '.glyphicon-folder-close' ).length ) {
					eventType = 'opened';
					classToTarget = '.glyphicon-folder-close';
					classToAdd = 'glyphicon-folder-open';

					$branch.addClass( 'tree-open' );
					$branch.attr( 'aria-expanded', 'true' );

					$treeFolderContentFirstChild.removeClass( 'hide' );
					if ( !$treeFolderContent.children().length ) {
						this.populate( $treeFolderContent );
					}

				} else if ( $el.find( '.glyphicon-folder-open' ) ) {
					eventType = 'closed';
					classToTarget = '.glyphicon-folder-open';
					classToAdd = 'glyphicon-folder-close';

					$branch.removeClass( 'tree-open' );
					$branch.attr( 'aria-expanded', 'false' );
					$treeFolderContentFirstChild.addClass( 'hide' );

					// remove if no cache
					if ( !this.options.cacheItems ) {
						$treeFolderContentFirstChild.empty();
					}

				}

				$branch.find( '> .tree-branch-header .icon-folder' ).eq( 0 )
					.removeClass( 'glyphicon-folder-close glyphicon-folder-open' )
					.addClass( classToAdd );

				this.$element.trigger( eventType, $branch.data() );
			},

			selectFolder: function( clickedElement ) {
				var $clickedElement = $( clickedElement );
				var $clickedBranch = $clickedElement.closest( '.tree-branch' );
				var $selectedBranch = this.$element.find( '.tree-branch.tree-selected' );
				var selectedData = [];
				var eventType = 'selected';

				// select clicked item
				if ( $clickedBranch.hasClass( 'tree-selected' ) ) {
					eventType = 'unselected';
					$clickedBranch.removeClass( 'tree-selected' );
				} else {
					$clickedBranch.addClass( 'tree-selected' );
				}

				if ( this.options.multiSelect ) {

					// get currently selected
					$selectedBranch = this.$element.find( '.tree-branch.tree-selected' );

					$.each( $selectedBranch, function( index, value ) {
						var $value = $( value );
						if ( $value[ 0 ] !== $clickedElement[ 0 ] ) {
							selectedData.push( $( value ).data() );
						}
					} );

				} else if ( $selectedBranch[ 0 ] !== $clickedElement[ 0 ] ) {
					$selectedBranch.removeClass( 'tree-selected' );

					selectedData.push( $clickedBranch.data() );
				}

				if ( selectedData.length ) {
					this.$element.trigger( 'selected.fu.tree', {
						selected: selectedData
					} );
				}

				// Return new list of selected items, the item
				// clicked, and the type of event:
				$clickedElement.trigger( 'updated.fu.tree', {
					selected: selectedData,
					item: $clickedElement,
					eventType: eventType
				} );
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
					var $folder = $parent.children( '.tree-branch-children' );

					$folder.addClass( 'hide' );
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
			dataSource: function( options, callback ) {},
			multiSelect: false,
			cacheItems: true,
			folderSelect: true
		};

		$.fn.tree.Constructor = Tree;

		$.fn.tree.noConflict = function() {
			$.fn.tree = old;
			return this;
		};


		// NO DATA-API DUE TO NEED OF DATA-SOURCE



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
			this.options.disablePreviousStep = ( this.$element.attr( 'data-restrict' ) === "previous" ) ? true : this.options.disablePreviousStep;
			this.currentStep = this.options.selectedItem.step;
			this.numSteps = this.$element.find( '.steps li' ).length;
			this.$prevBtn = this.$element.find( 'button.btn-prev' );
			this.$nextBtn = this.$element.find( 'button.btn-next' );

			kids = this.$nextBtn.children().detach();
			this.nextText = $.trim( this.$nextBtn.text() );
			this.$nextBtn.append( kids );

			// handle events
			this.$prevBtn.on( 'click.fu.wizard', $.proxy( this.previous, this ) );
			this.$nextBtn.on( 'click.fu.wizard', $.proxy( this.next, this ) );
			this.$element.on( 'click.fu.wizard', 'li.complete', $.proxy( this.stepclicked, this ) );

			this.selectedItem( this.options.selectedItem );

			if ( this.options.disablePreviousStep ) {
				this.$prevBtn.attr( 'disabled', true );
				this.$element.find( '.steps' ).addClass( 'previous-disabled' );
			}
		};

		Wizard.prototype = {

			constructor: Wizard,

			//index is 1 based
			//second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
			//object structure is as follows (all params are optional): { badge: '', label: '', pane: '' }
			addSteps: function( index ) {
				var items = [].slice.call( arguments ).slice( 1 );
				var $steps = this.$element.find( '.steps' );
				var $stepContent = this.$element.find( '.step-content' );
				var i, l, $pane, $startPane, $startStep, $step;

				index = ( index === -1 || ( index > ( this.numSteps + 1 ) ) ) ? this.numSteps + 1 : index;
				if ( items[ 0 ] instanceof Array ) {
					items = items[ 0 ];
				}

				$startStep = $steps.find( 'li:nth-child(' + index + ')' );
				$startPane = $stepContent.find( '.step-pane:nth-child(' + index + ')' );
				if ( $startStep.length < 1 ) {
					$startStep = null;
				}

				for ( i = 0, l = items.length; i < l; i++ ) {
					$step = $( '<li data-step="' + index + '"><span class="badge badge-info"></span></li>' );
					$step.append( items[ i ].label || '' ).append( '<span class="chevron"></span>' );
					$step.find( '.badge' ).append( items[ i ].badge || index );

					$pane = $( '<div class="step-pane" data-step="' + index + '"></div>' );
					$pane.append( items[ i ].pane || '' );

					if ( !$startStep ) {
						$steps.append( $step );
						$stepContent.append( $pane );
					} else {
						$startStep.before( $step );
						$startPane.before( $pane );
					}
					index++;
				}

				this.syncSteps();
				this.numSteps = $steps.find( 'li' ).length;
				this.setState();
			},

			//index is 1 based, howMany is number to remove
			removeSteps: function( index, howMany ) {
				var action = 'nextAll';
				var i = 0;
				var $steps = this.$element.find( '.steps' );
				var $stepContent = this.$element.find( '.step-content' );
				var $start;

				howMany = ( howMany !== undefined ) ? howMany : 1;

				if ( index > $steps.find( 'li' ).length ) {
					$start = $steps.find( 'li:last' );
				} else {
					$start = $steps.find( 'li:nth-child(' + index + ')' ).prev();
					if ( $start.length < 1 ) {
						action = 'children';
						$start = $steps;
					}
				}

				$start[ action ]().each( function() {
					var item = $( this );
					var step = item.attr( 'data-step' );
					if ( i < howMany ) {
						item.remove();
						$stepContent.find( '.step-pane[data-step="' + step + '"]:first' ).remove();
					} else {
						return false;
					}
					i++;
				} );

				this.syncSteps();
				this.numSteps = $steps.find( 'li' ).length;
				this.setState();
			},

			setState: function() {
				var canMovePrev = ( this.currentStep > 1 );
				var firstStep = ( this.currentStep === 1 );
				var lastStep = ( this.currentStep === this.numSteps );

				// disable buttons based on current step
				if ( !this.options.disablePreviousStep ) {
					this.$prevBtn.attr( 'disabled', ( firstStep === true || canMovePrev === false ) );
				}

				// change button text of last step, if specified
				var last = this.$nextBtn.attr( 'data-last' );
				if ( last ) {
					this.lastText = last;
					// replace text
					var text = this.nextText;
					if ( lastStep === true ) {
						text = this.lastText;
						// add status class to wizard
						this.$element.addClass( 'complete' );
					} else {
						this.$element.removeClass( 'complete' );
					}
					var kids = this.$nextBtn.children().detach();
					this.$nextBtn.text( text ).append( kids );
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
				var $stepContent = this.$element.find( '.step-content' );
				var target = $currentStep.attr( 'data-step' );
				$stepContent.find( '.step-pane' ).removeClass( 'active' );
				$stepContent.find( '.step-pane[data-step="' + target + '"]:first' ).addClass( 'active' );

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

				// only fire changed event after initializing
				if ( typeof( this.initialized ) !== 'undefined' ) {
					var e = $.Event( 'changed.fu.wizard' );
					this.$element.trigger( e, {
						step: this.currentStep
					} );
				}

				this.initialized = true;
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
					var evt = $.Event( 'stepclicked.fu.wizard' );
					this.$element.trigger( evt, {
						step: index + 1
					} );
					if ( evt.isDefaultPrevented() ) {
						return;
					}

					this.currentStep = ( index + 1 );
					this.setState();
				}
			},

			syncSteps: function() {
				var i = 1;
				var $steps = this.$element.find( '.steps' );
				var $stepContent = this.$element.find( '.step-content' );

				$steps.children().each( function() {
					var item = $( this );
					var badge = item.find( '.badge' );
					var step = item.attr( 'data-step' );

					if ( !isNaN( parseInt( badge.html(), 10 ) ) ) {
						badge.html( i );
					}
					item.attr( 'data-step', i );
					$stepContent.find( '.step-pane[data-step="' + step + '"]:last' ).attr( 'data-step', i );
					i++;
				} );
			},

			previous: function() {
				var canMovePrev = ( this.currentStep > 1 );
				if ( this.options.disablePreviousStep ) {
					canMovePrev = false;
				}
				if ( canMovePrev ) {
					var e = $.Event( 'actionclicked.fu.wizard' );
					this.$element.trigger( e, {
						step: this.currentStep,
						direction: 'previous'
					} );
					if ( e.isDefaultPrevented() ) {
						return;
					} // don't increment

					this.currentStep -= 1;
					this.setState();
				}

				// return focus to control after selecting an option
				if ( this.$prevBtn.is( ':disabled' ) ) {
					this.$nextBtn.focus();
				} else {
					this.$prevBtn.focus();
				}

			},

			next: function() {
				var canMoveNext = ( this.currentStep + 1 <= this.numSteps );
				var lastStep = ( this.currentStep === this.numSteps );

				if ( canMoveNext ) {
					var e = $.Event( 'actionclicked.fu.wizard' );
					this.$element.trigger( e, {
						step: this.currentStep,
						direction: 'next'
					} );
					if ( e.isDefaultPrevented() ) {
						return;
					} // don't increment

					this.currentStep += 1;
					this.setState();
				} else if ( lastStep ) {
					this.$element.trigger( 'finished.fu.wizard' );
				}

				// return focus to control after selecting an option
				if ( this.$nextBtn.is( ':disabled' ) ) {
					this.$prevBtn.focus();
				} else {
					this.$nextBtn.focus();
				}
			},

			selectedItem: function( selectedItem ) {
				var retVal, step;

				if ( selectedItem ) {

					step = selectedItem.step || -1;

					if ( step >= 1 && step <= this.numSteps ) {
						this.currentStep = step;
						this.setState();
					} else {
						step = this.$element.find( '.steps li.active:first' ).attr( 'data-step' );
						if ( !isNaN( step ) ) {
							this.currentStep = parseInt( step, 10 );
							this.setState();
						}
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
			disablePreviousStep: false,
			selectedItem: {
				step: -1
			} //-1 means it will attempt to look for "active" class in order to set the step
		};

		$.fn.wizard.Constructor = Wizard;

		$.fn.wizard.noConflict = function() {
			$.fn.wizard = old;
			return this;
		};


		// DATA-API

		$( document ).on( 'mouseover.fu.wizard.data-api', '[data-initialize=wizard]', function( e ) {
			var $control = $( e.target ).closest( '.wizard' );
			if ( !$control.data( 'wizard' ) ) {
				$control.wizard( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=wizard]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'wizard' ) ) return;
				$this.wizard( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Infinite Scroll
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.infinitescroll;

		// INFINITE SCROLL CONSTRUCTOR AND PROTOTYPE

		var InfiniteScroll = function( element, options ) {
			this.$element = $( element );
			this.$element.addClass( 'infinitescroll' );
			this.options = $.extend( {}, $.fn.infinitescroll.defaults, options );

			this.curScrollTop = this.$element.scrollTop();
			this.curPercentage = this.getPercentage();
			this.fetchingData = false;

			this.$element.on( 'scroll.fu.infinitescroll', $.proxy( this.onScroll, this ) );
		};

		InfiniteScroll.prototype = {

			constructor: InfiniteScroll,

			disable: function() {
				this.$element.off( 'scroll.fu.infinitescroll' );
			},

			enable: function() {
				this.$element.on( 'scroll.fu.infinitescroll', $.proxy( this.onScroll, this ) );
			},

			end: function( content ) {
				var end = $( '<div class="infinitescroll-end"></div>' );
				if ( content ) {
					end.append( content );
				} else {
					end.append( '---------' );
				}
				this.$element.append( end );
				this.disable();
			},

			getPercentage: function() {
				var height = ( this.$element.css( 'box-sizing' ) === 'border-box' ) ? this.$element.outerHeight() : this.$element.height();
				return ( height / ( this.$element.get( 0 ).scrollHeight - this.curScrollTop ) ) * 100;
			},

			fetchData: function( force ) {
				var load = $( '<div class="infinitescroll-load"></div>' );
				var self = this;
				var moreBtn;

				var fetch = function() {
					var helpers = {
						percentage: self.curPercentage,
						scrollTop: self.curScrollTop
					};
					var $loader = $( '<div class="loader"></div>' );
					load.append( $loader );
					$loader.loader();
					if ( self.options.dataSource ) {
						self.options.dataSource( helpers, function( resp ) {
							var end;
							load.remove();
							if ( resp.content ) {
								self.$element.append( resp.content );
							}
							if ( resp.end ) {
								end = ( resp.end !== true ) ? resp.end : undefined;
								self.end( end );
							}
							self.fetchingData = false;
						} );
					}
				};

				this.fetchingData = true;
				this.$element.append( load );
				if ( this.options.hybrid && force !== true ) {
					moreBtn = $( '<button type="button" class="btn btn-primary"></button>' );
					if ( typeof this.options.hybrid === 'object' ) {
						moreBtn.append( this.options.hybrid.label );
					} else {
						moreBtn.append( '<span class="glyphicon glyphicon-repeat"></span>' );
					}
					moreBtn.on( 'click.fu.infinitescroll', function() {
						moreBtn.remove();
						fetch();
					} );
					load.append( moreBtn );
				} else {
					fetch();
				}
			},

			onScroll: function( e ) {
				this.curScrollTop = this.$element.scrollTop();
				this.curPercentage = this.getPercentage();
				if ( !this.fetchingData && this.curPercentage >= this.options.percentage ) {
					this.fetchData();
				}
			}

		};

		// INFINITE SCROLL PLUGIN DEFINITION

		$.fn.infinitescroll = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'infinitescroll' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'infinitescroll', ( data = new InfiniteScroll( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.infinitescroll.defaults = {
			dataSource: null,
			hybrid: false, //can be true or an object with structure: { 'label': (markup or jQuery obj) }
			percentage: 95 //percentage scrolled to the bottom before more is loaded
		};

		$.fn.infinitescroll.Constructor = InfiniteScroll;

		$.fn.infinitescroll.noConflict = function() {
			$.fn.infinitescroll = old;
			return this;
		};

		// NO DATA-API DUE TO NEED OF DATA-SOURCE


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
			this.$moreCount = this.$element.find( '.pillbox-more-count' );
			this.$pillGroup = this.$element.find( '.pill-group' );
			this.$addItem = this.$element.find( '.pillbox-add-item' );
			this.$addItemWrap = this.$addItem.parent();
			this.$suggest = this.$element.find( '.suggest' );
			this.$pillHTML = '<li class="btn btn-default pill">' +
				'	<span></span>' +
				'	<span class="glyphicon glyphicon-close">' +
				'		<span class="sr-only">Remove</span>' +
				'	</span>' +
				'</li>';

			this.options = $.extend( {}, $.fn.pillbox.defaults, options );

			if ( this.options.readonly === -1 ) {
				if ( this.$element.attr( 'data-readonly' ) !== undefined ) {
					this.readonly( true );
				}
			} else if ( this.options.readonly ) {
				this.readonly( true );
			}

			// EVENTS
			this.acceptKeyCodes = this._generateObject( this.options.acceptKeyCodes );
			// Creatie an object out of the key code array, so we dont have to loop through it on every key stroke

			this.$element.on( 'click.fu.pillbox', '.pill-group > .pill', $.proxy( this.itemClicked, this ) );
			this.$element.on( 'click.fu.pillbox', $.proxy( this.inputFocus, this ) );
			this.$element.on( 'keydown.fu.pillbox', '.pillbox-add-item', $.proxy( this.inputEvent, this ) );
			if ( this.options.onKeyDown ) {
				this.$element.on( 'mousedown.fu.pillbox', '.suggest > li', $.proxy( this.suggestionClick, this ) );
			}
			if ( this.options.edit ) {
				this.$element.addClass( 'pills-editable' );
				this.$element.on( 'blur.fu.pillbox', '.pillbox-add-item', $.proxy( this.cancelEdit, this ) );
			}
		};

		Pillbox.prototype = {
			constructor: Pillbox,

			items: function() {
				var self = this;

				return this.$pillGroup.children( '.pill' ).map( function() {
					return self.getItemData( $( this ) );
				} ).get();
			},

			itemClicked: function( e ) {
				var self = this;
				var $target = $( e.target );
				var $item;

				e.preventDefault();
				e.stopPropagation();
				this._closeSuggestions();

				if ( !$target.hasClass( 'pill' ) ) {
					$item = $target.parent();
					if ( this.$element.attr( 'data-readonly' ) === undefined ) {
						if ( $target.hasClass( 'glyphicon-close' ) ) {
							if ( this.options.onRemove ) {
								this.options.onRemove( this.getItemData( $item, {
									el: $item
								} ), $.proxy( this._removeElement, this ) );
							} else {
								this._removeElement( this.getItemData( $item, {
									el: $item
								} ) );
							}
							return false;
						} else if ( this.options.edit ) {
							if ( $item.find( '.pillbox-list-edit' ).length ) {
								return false;
							}
							this.openEdit( $item );
						}
					}
				} else {
					$item = $target;
				}

				this.$element.trigger( 'clicked.fu.pillbox', this.getItemData( $item ) );
			},

			readonly: function( enable ) {
				if ( enable ) {
					this.$element.attr( 'data-readonly', 'readonly' );
				} else {
					this.$element.removeAttr( 'data-readonly' );
				}
				if ( this.options.truncate ) {
					this.truncate( enable );
				}
			},

			suggestionClick: function( e ) {
				var $item = $( e.currentTarget );

				e.preventDefault();
				this.$addItem.val( '' );

				this.addItems( {
					text: $item.html(),
					value: $item.data( 'value' )
				}, true );

				// needs to be after addItems for IE
				this._closeSuggestions();
			},

			itemCount: function() {
				return this.$pillGroup.children( '.pill' ).length;
			},

			// First parameter is 1 based index (optional, if index is not passed all new items will be appended)
			// Second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
			// object structure is as follows (index and value are optional): { text: '', value: '' }
			addItems: function() {
				var self = this;
				var items, index, isInternal;

				if ( isFinite( String( arguments[ 0 ] ) ) && !( arguments[ 0 ] instanceof Array ) ) {
					items = [].slice.call( arguments ).slice( 1 );
					index = arguments[ 0 ];
				} else {
					items = [].slice.call( arguments ).slice( 0 );
					isInternal = items[ 1 ] && !items[ 1 ].text;
				}

				//Accounting for array parameter
				if ( items[ 0 ] instanceof Array ) {
					items = items[ 0 ];
				}

				if ( items.length ) {
					$.each( items, function( i, value ) {
						var data = {
							text: value.text,
							value: ( value.value ? value.value : value.text ),
							el: self.$pillHTML
						};

						items[ i ] = data;
					} );

					if ( this.options.edit && this.currentEdit ) {
						items[ 0 ].el = this.currentEdit.wrap( '<div></div>' ).parent().html();
					}

					if ( isInternal ) {
						items.pop( 1 );
					}

					if ( self.options.onAdd && isInternal ) {

						if ( this.options.edit && this.currentEdit ) {
							self.options.onAdd( items[ 0 ], $.proxy( self.saveEdit, this ) );
						} else {
							self.options.onAdd( items[ 0 ], $.proxy( self.placeItems, this, true ) );
						}
					} else {
						if ( this.options.edit && this.currentEdit ) {
							self.saveEdit( items );
						} else {
							if ( index ) {
								self.placeItems( index, items );
							} else {
								self.placeItems( items, isInternal );
							}
						}
					}
				}

			},

			//First parameter is the index (1 based) to start removing items
			//Second parameter is the number of items to be removed
			removeItems: function( index, howMany ) {
				var self = this;
				var count;
				var $currentItem;

				if ( !index ) {
					this.$pillGroup.find( '.pill' ).remove();
					this._removePillTrigger( {
						method: 'removeAll'
					} );
				} else {
					howMany = howMany ? howMany : 1;

					for ( count = 0; count < howMany; count++ ) {
						$currentItem = self.$pillGroup.find( '> .pill:nth-child(' + index + ')' );

						if ( $currentItem ) {
							$currentItem.remove();
						} else {
							break;
						}
					}
				}
			},

			//First parameter is index (optional)
			//Second parameter is new arguments
			placeItems: function() {
				var newHtml = '';
				var items;
				var index;
				var $neighbor;
				var isInternal;

				if ( isFinite( String( arguments[ 0 ] ) ) && !( arguments[ 0 ] instanceof Array ) ) {
					items = [].slice.call( arguments ).slice( 1 );
					index = arguments[ 0 ];
				} else {
					items = [].slice.call( arguments ).slice( 0 );
					isInternal = items[ 1 ] && !items[ 1 ].text;
				}

				if ( items[ 0 ] instanceof Array ) {
					items = items[ 0 ];
				}

				if ( items.length ) {
					$.each( items, function( i, item ) {
						var $item = $( item.el );
						var $neighbor;

						$item.attr( 'data-value', item.value );
						$item.find( 'span:first' ).html( item.text );

						newHtml += $item.wrap( '<div></div>' ).parent().html();
					} );

					if ( this.$pillGroup.children( '.pill' ).length > 0 ) {
						if ( index ) {
							$neighbor = this.$pillGroup.find( '.pill:nth-child(' + index + ')' );

							if ( $neighbor.length ) {
								$neighbor.before( newHtml );
							} else {
								this.$pillGroup.children( '.pill:last' ).after( newHtml );
							}
						} else {
							this.$pillGroup.children( '.pill:last' ).after( newHtml );
						}
					} else {
						this.$pillGroup.prepend( newHtml );
					}

					if ( isInternal ) {
						this.$element.trigger( 'added.fu.pillbox', {
							text: items[ 0 ].text,
							value: items[ 0 ].value
						} );
					}
				}
			},

			inputEvent: function( e ) {
				var self = this;
				var text = this.$addItem.val();
				var value;
				var $lastItem;
				var $selection;

				if ( this.acceptKeyCodes[ e.keyCode ] ) {

					if ( this.options.onKeyDown && this._isSuggestionsOpen() ) {
						$selection = this.$suggest.find( '.pillbox-suggest-sel' );

						if ( $selection.length ) {
							text = $selection.html();
							value = $selection.data( 'value' );
						}
					}

					if ( text.length ) {
						this._closeSuggestions();
						this.$addItem.hide();

						this.addItems( {
							text: text,
							value: value
						}, true );

						setTimeout( function() {
							self.$addItem.show().val( '' ).attr( {
								size: 10
							} );
						}, 0 );
					}

					return true;
				} else if ( e.keyCode === 8 || e.keyCode === 46 ) {
					// backspace: 8
					// delete: 46

					if ( !text.length ) {
						e.preventDefault();

						if ( this.options.edit && this.currentEdit ) {
							this.cancelEdit();
							return true;
						}

						this._closeSuggestions();
						$lastItem = this.$pillGroup.children( '.pill:last' );

						if ( $lastItem.hasClass( 'pillbox-highlight' ) ) {
							this._removeElement( this.getItemData( $lastItem, {
								el: $lastItem
							} ) );
						} else {
							$lastItem.addClass( 'pillbox-highlight' );
						}

						return true;
					}
				} else if ( text.length > 10 ) {
					if ( this.$addItem.width() < ( this.$pillGroup.width() - 6 ) ) {
						this.$addItem.attr( {
							size: text.length + 3
						} );
					}
				}

				this.$pillGroup.find( '.pill' ).removeClass( 'pillbox-highlight' );

				if ( this.options.onKeyDown ) {
					if ( e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40 ) {
						// tab: 9
						// up arrow: 38
						// down arrow: 40

						if ( this._isSuggestionsOpen() ) {
							this._keySuggestions( e );
						}
						return true;
					}

					//only allowing most recent event callback to register
					this.callbackId = e.timeStamp;
					this.options.onKeyDown( {
						event: e,
						value: text
					}, function( data ) {
						self._openSuggestions( e, data );
					} );
				}
			},

			openEdit: function( el ) {
				var index = el.index() + 1;
				var $addItemWrap = this.$addItemWrap.detach().hide();

				this.$pillGroup.find( '.pill:nth-child(' + index + ')' ).before( $addItemWrap );
				this.currentEdit = el.detach();

				$addItemWrap.addClass( 'editing' );
				this.$addItem.val( el.find( 'span:first' ).html() );
				$addItemWrap.show();
				this.$addItem.focus().select();
			},

			cancelEdit: function( e ) {
				var $addItemWrap;
				if ( !this.currentEdit ) {
					return false;
				}

				this._closeSuggestions();
				if ( e ) {
					this.$addItemWrap.before( this.currentEdit );
				}
				this.currentEdit = false;

				$addItemWrap = this.$addItemWrap.detach();
				$addItemWrap.removeClass( 'editing' );
				this.$addItem.val( '' );
				this.$pillGroup.append( $addItemWrap );
			},

			//Must match syntax of placeItem so addItem callback is called when an item is edited
			//expecting to receive an array back from the callback containing edited items
			saveEdit: function() {
				var item = arguments[ 0 ][ 0 ];

				this.currentEdit = $( item.el );
				this.currentEdit.data( 'value', item.value );
				this.currentEdit.find( 'span:first' ).html( item.text );

				this.$addItemWrap.hide();
				this.$addItemWrap.before( this.currentEdit );
				this.currentEdit = false;

				this.$addItem.val( '' );
				this.$addItemWrap.removeClass( 'editing' );
				this.$pillGroup.append( this.$addItemWrap.detach().show() );
				this.$element.trigger( 'edited.fu.pillbox', {
					value: item.value,
					text: item.text
				} );
			},

			removeBySelector: function() {
				var selectors = [].slice.call( arguments ).slice( 0 );
				var self = this;

				$.each( selectors, function( i, sel ) {
					self.$pillGroup.find( sel ).remove();
				} );

				this._removePillTrigger( {
					method: 'removeBySelector',
					removedSelectors: selectors
				} );
			},

			removeByValue: function() {
				var values = [].slice.call( arguments ).slice( 0 );
				var self = this;

				$.each( values, function( i, val ) {
					self.$pillGroup.find( '> .pill[data-value="' + val + '"]' ).remove();
				} );

				this._removePillTrigger( {
					method: 'removeByValue',
					removedValues: values
				} );
			},

			removeByText: function() {
				var text = [].slice.call( arguments ).slice( 0 );
				var self = this;

				$.each( text, function( i, text ) {
					self.$pillGroup.find( '> .pill:contains("' + text + '")' ).remove();
				} );

				this._removePillTrigger( {
					method: 'removeByText',
					removedText: text
				} );
			},

			truncate: function( enable ) {
				var self = this;
				var available, full, i, pills, used;

				this.$element.removeClass( 'truncate' );
				this.$addItemWrap.removeClass( 'truncated' );
				this.$pillGroup.find( '.pill' ).removeClass( 'truncated' );

				if ( enable ) {
					this.$element.addClass( 'truncate' );

					available = this.$element.width();
					full = false;
					i = 0;
					pills = this.$pillGroup.find( '.pill' ).length;
					used = 0;

					this.$pillGroup.find( '.pill' ).each( function() {
						var pill = $( this );
						if ( !full ) {
							i++;
							self.$moreCount.text( pills - i );
							if ( ( used + pill.outerWidth( true ) + self.$addItemWrap.outerWidth( true ) ) <= available ) {
								used += pill.outerWidth( true );
							} else {
								self.$moreCount.text( ( pills - i ) + 1 );
								pill.addClass( 'truncated' );
								full = true;
							}
						} else {
							pill.addClass( 'truncated' );
						}
					} );
					if ( i === pills ) {
						this.$addItemWrap.addClass( 'truncated' );
					}
				}
			},

			inputFocus: function( e ) {
				this.$element.find( '.pillbox-add-item' ).focus();
			},

			getItemData: function( el, data ) {
				return $.extend( {
					text: el.find( 'span:first' ).html()
				}, el.data(), data );
			},

			_removeElement: function( data ) {
				data.el.remove();
				delete data.el;
				this.$element.trigger( 'removed.fu.pillbox', data );
			},

			_removePillTrigger: function( removedBy ) {
				this.$element.trigger( 'removed.fu.pillbox', removedBy );
			},

			_generateObject: function( data ) {
				var obj = {};

				$.each( data, function( index, value ) {
					obj[ value ] = true;
				} );

				return obj;
			},

			_openSuggestions: function( e, data ) {
				var markup = '';

				if ( this.callbackId !== e.timeStamp ) {
					return false;
				}

				if ( data.data && data.data.length ) {
					$.each( data.data, function( index, value ) {
						var val = value.value ? value.value : value.text;
						markup += '<li data-value="' + val + '">' + value.text + '</li>';
					} );

					// suggestion dropdown

					this.$suggest.html( '' ).append( markup );
					$( document.body ).trigger( 'suggested.fu.pillbox', this.$suggest );
				}
			},

			_closeSuggestions: function() {
				this.$suggest.html( '' ).parent().removeClass( 'open' );
			},

			_isSuggestionsOpen: function() {
				return this.$suggest.parent().hasClass( 'open' );
			},

			_keySuggestions: function( e ) {
				var $first = this.$suggest.find( 'li.pillbox-suggest-sel' );
				var dir = e.keyCode === 38; // up arrow
				var $next, val;

				e.preventDefault();

				if ( !$first.length ) {
					$first = this.$suggest.find( 'li:first' );
					$first.addClass( 'pillbox-suggest-sel' );
				} else {
					$next = dir ? $first.prev() : $first.next();

					if ( !$next.length ) {
						$next = dir ? this.$suggest.find( 'li:last' ) : this.$suggest.find( 'li:first' );
					}

					if ( $next ) {
						$next.addClass( 'pillbox-suggest-sel' );
						$first.removeClass( 'pillbox-suggest-sel' );
					}
				}
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

		$.fn.pillbox.defaults = {
			onAdd: undefined,
			onRemove: undefined,
			onKeyDown: undefined,
			edit: false,
			readonly: -1, //can be true or false. -1 means it will check for data-readonly="readonly"
			truncate: false,
			acceptKeyCodes: [
				13, //Enter
				188 //Comma
			]

			//example on remove
			/*onRemove: function(data,callback){
			console.log('onRemove');
			callback(data);
		}*/

			//example on key down
			/*onKeyDown: function(event, data, callback ){
			callback({data:[
				{text: Math.random(),value:'sdfsdfsdf'},
				{text: Math.random(),value:'sdfsdfsdf'}
			]});
		}
		*/
			//example onAdd
			/*onAdd: function( data, callback ){
			console.log(data, callback);
			callback(data);
		}*/
		};

		$.fn.pillbox.Constructor = Pillbox;

		$.fn.pillbox.noConflict = function() {
			$.fn.pillbox = old;
			return this;
		};


		// DATA-API

		$( document ).on( 'mousedown.fu.pillbox.data-api', '[data-initialize=pillbox]', function( e ) {
			var $control = $( e.target ).closest( '.pillbox' );
			if ( !$control.data( 'pillbox' ) ) {
				$control.pillbox( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=pillbox]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'pillbox' ) ) return;
				$this.pillbox( $this.data() );
			} );
		} );


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Repeater
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		var old = $.fn.repeater;

		// REPEATER CONSTRUCTOR AND PROTOTYPE

		var Repeater = function( element, options ) {
			var self = this;
			var currentView;

			this.$element = $( element );

			this.$canvas = this.$element.find( '.repeater-canvas' );
			this.$count = this.$element.find( '.repeater-count' );
			this.$end = this.$element.find( '.repeater-end' );
			this.$filters = this.$element.find( '.repeater-filters' );
			this.$loader = this.$element.find( '.repeater-loader' );
			this.$pageSize = this.$element.find( '.repeater-itemization .selectlist' );
			this.$nextBtn = this.$element.find( '.repeater-next' );
			this.$pages = this.$element.find( '.repeater-pages' );
			this.$prevBtn = this.$element.find( '.repeater-prev' );
			this.$primaryPaging = this.$element.find( '.repeater-primaryPaging' );
			this.$search = this.$element.find( '.repeater-search' ).find( '.search' );
			this.$secondaryPaging = this.$element.find( '.repeater-secondaryPaging' );
			this.$start = this.$element.find( '.repeater-start' );
			this.$viewport = this.$element.find( '.repeater-viewport' );
			this.$views = this.$element.find( '.repeater-views' );

			this.currentPage = 0;
			this.currentView = null;
			this.infiniteScrollingCallback = function() {};
			this.infiniteScrollingCont = null;
			this.infiniteScrollingEnabled = false;
			this.infiniteScrollingEnd = null;
			this.infiniteScrollingOptions = {};
			this.lastPageInput = 0;
			this.options = $.extend( {}, $.fn.repeater.defaults, options );
			this.pageIncrement = 0; // store direction navigated
			this.resizeTimeout = {};
			this.staticHeight = ( this.options.staticHeight === -1 ) ? this.$element.attr( 'data-staticheight' ) : this.options.staticHeight;

			this.$filters.selectlist();
			this.$pageSize.selectlist();
			this.$primaryPaging.find( '.combobox' ).combobox();
			this.$search.search();

			this.$filters.on( 'changed.fu.selectlist', $.proxy( this.render, this, {
				clearInfinite: true,
				pageIncrement: null
			} ) );
			this.$nextBtn.on( 'click.fu.repeater', $.proxy( this.next, this ) );
			this.$pageSize.on( 'changed.fu.selectlist', $.proxy( this.render, this, {
				pageIncrement: null
			} ) );
			this.$prevBtn.on( 'click.fu.repeater', $.proxy( this.previous, this ) );
			this.$primaryPaging.find( '.combobox' ).on( 'changed.fu.combobox', function( evt, data ) {
				self.pageInputChange( data.text );
			} );
			this.$search.on( 'searched.fu.search cleared.fu.search', $.proxy( this.render, this, {
				clearInfinite: true,
				pageIncrement: null
			} ) );
			this.$secondaryPaging.on( 'blur.fu.repeater', function() {
				self.pageInputChange( self.$secondaryPaging.val() );
			} );
			this.$secondaryPaging.on( 'change.fu.repeater', function() {
				self.pageInputChange( self.$secondaryPaging.val() );
			} );
			this.$views.find( 'input' ).on( 'change.fu.repeater', $.proxy( this.viewChanged, this ) );

			$( window ).on( 'resize.fu.repeater.window', function() {
				clearTimeout( self.resizeTimeout );
				self.resizeTimeout = setTimeout( function() {
					self.resize();
					self.$element.trigger( 'resized.fu.repeater' );
				}, 75 );
			} );

			this.$loader.loader();
			this.$loader.loader( 'pause' );
			currentView = ( this.options.defaultView !== -1 ) ? this.options.defaultView : this.$views.find( 'label.active input' ).val();

			this.initViews( function() {
				self.resize();
				self.$element.trigger( 'resized.fu.repeater' );
				self.render( {
					changeView: currentView
				} );
			} );
		};

		Repeater.prototype = {
			constructor: Repeater,

			clear: function( options ) {
				var scan = function( cont ) {
					var keep = [];
					cont.children().each( function() {
						var item = $( this );
						var pres = item.attr( 'data-preserve' );
						if ( pres === 'deep' ) {
							item.detach();
							keep.push( item );
						} else if ( pres === 'shallow' ) {
							scan( item );
							item.detach();
							keep.push( item );
						}
					} );
					cont.empty();
					cont.append( keep );
				};

				options = options || {};

				if ( !options.preserve ) {
					this.$canvas.empty();
				} else if ( !this.infiniteScrollingEnabled || options.clearInfinite ) {
					scan( this.$canvas );
				}
			},

			getDataOptions: function( options, callback ) {
				var opts = {};
				var val, viewDataOpts;

				options = options || {};

				opts.filter = this.$filters.selectlist( 'selectedItem' );
				opts.view = this.currentView;

				if ( !this.infiniteScrollingEnabled ) {
					opts.pageSize = parseInt( this.$pageSize.selectlist( 'selectedItem' ).value, 10 );
				}
				if ( options.pageIncrement !== undefined ) {
					if ( options.pageIncrement === null ) {
						this.currentPage = 0;
					} else {
						this.currentPage += options.pageIncrement;
					}
				}
				opts.pageIndex = this.currentPage;

				val = this.$search.find( 'input' ).val();
				if ( val !== '' ) {
					opts.search = val;
				}

				viewDataOpts = $.fn.repeater.views[ this.currentView ] || {};
				viewDataOpts = viewDataOpts.dataOptions;
				if ( viewDataOpts ) {
					viewDataOpts.call( this, opts, function( obj ) {
						callback( obj );
					} );
				} else {
					callback( opts );
				}
			},

			infiniteScrolling: function( enable, options ) {
				var itemization = this.$element.find( '.repeater-itemization' );
				var pagination = this.$element.find( '.repeater-pagination' );
				var cont, data;

				options = options || {};

				if ( enable ) {
					this.infiniteScrollingEnabled = true;
					this.infiniteScrollingEnd = options.end;
					delete options.dataSource;
					delete options.end;
					this.infiniteScrollingOptions = options;
					itemization.hide();
					pagination.hide();
				} else {
					cont = this.infiniteScrollingCont;
					data = cont.data();
					delete data.infinitescroll;
					cont.off( 'scroll' );
					cont.removeClass( 'infinitescroll' );

					this.infiniteScrollingCont = null;
					this.infiniteScrollingEnabled = false;
					this.infiniteScrollingEnd = null;
					this.infiniteScrollingOptions = {};
					itemization.show();
					pagination.show();
				}
			},

			infiniteScrollPaging: function( data, options ) {
				var end = ( this.infiniteScrollingEnd !== true ) ? this.infiniteScrollingEnd : undefined;
				var page = data.page;
				var pages = data.pages;

				this.currentPage = ( page !== undefined ) ? page : NaN;

				if ( ( this.currentPage + 1 ) >= pages ) {
					this.infiniteScrollingCont.infinitescroll( 'end', end );
				}
			},

			initInfiniteScrolling: function() {
				var cont = this.$canvas.find( '[data-infinite="true"]:first' );
				var opts, self;

				cont = ( cont.length < 1 ) ? this.$canvas : cont;
				if ( cont.data( 'infinitescroll' ) ) {
					cont.infinitescroll( 'enable' );
				} else {
					self = this;
					opts = $.extend( {}, this.infiniteScrollingOptions );
					opts.dataSource = function( helpers, callback ) {
						self.infiniteScrollingCallback = callback;
						self.render( {
							pageIncrement: 1
						} );
					};
					cont.infinitescroll( opts );
					this.infiniteScrollingCont = cont;
				}
			},

			initViews: function( callback ) {
				var views = [];
				var i, viewsLength;

				var init = function( index ) {
					var next = function() {
						index++;
						if ( index < viewsLength ) {
							init( index );
						} else {
							callback();
						}
					};

					if ( views[ index ].initialize ) {
						views[ index ].initialize.call( this, {}, function() {
							next();
						} );
					} else {
						next();
					}
				};

				for ( i in $.fn.repeater.views ) {
					views.push( $.fn.repeater.views[ i ] );
				}
				viewsLength = views.length;
				if ( viewsLength > 0 ) {
					init( 0 );
				} else {
					callback();
				}
			},

			itemization: function( data ) {
				this.$count.html( data.count || '' );
				this.$end.html( data.end || '' );
				this.$start.html( data.start || '' );
			},

			next: function() {
				var d = 'disabled';
				this.$nextBtn.attr( d, d );
				this.$prevBtn.attr( d, d );
				this.pageIncrement = 1;
				this.render( {
					pageIncrement: this.pageIncrement
				} );
			},

			pageInputChange: function( val ) {
				var pageInc;
				if ( val !== this.lastPageInput ) {
					this.lastPageInput = val;
					val = parseInt( val, 10 ) - 1;
					pageInc = val - this.currentPage;
					this.render( {
						pageIncrement: pageInc
					} );
				}
			},

			pagination: function( data ) {
				var act = 'active';
				var dsbl = 'disabled';
				var page = data.page;
				var pages = data.pages;
				var dropMenu, i, l;

				this.currentPage = ( page !== undefined ) ? page : NaN;

				this.$primaryPaging.removeClass( act );
				this.$secondaryPaging.removeClass( act );

				if ( pages <= this.options.dropPagingCap ) {
					this.$primaryPaging.addClass( act );
					dropMenu = this.$primaryPaging.find( '.dropdown-menu' );
					dropMenu.empty();
					for ( i = 0; i < pages; i++ ) {
						l = i + 1;
						dropMenu.append( '<li data-value="' + l + '"><a href="#">' + l + '</a></li>' );
					}
					this.$primaryPaging.find( 'input.form-control' ).val( this.currentPage + 1 );
				} else {
					this.$secondaryPaging.addClass( act );
					this.$secondaryPaging.val( this.currentPage + 1 );
				}
				this.lastPageInput = this.currentPage + 1 + '';

				this.$pages.html( pages );

				// this is not the last page
				if ( ( this.currentPage + 1 ) < pages ) {
					this.$nextBtn.removeAttr( dsbl );
				} else {
					this.$nextBtn.attr( dsbl, dsbl );
				}
				// this is not the first page
				if ( ( this.currentPage - 1 ) >= 0 ) {
					this.$prevBtn.removeAttr( dsbl );
				} else {
					this.$prevBtn.attr( dsbl, dsbl );
				}

				// return focus to next/previous buttons after navigating
				if ( this.pageIncrement !== 0 ) {
					if ( this.pageIncrement > 0 ) {
						if ( this.$nextBtn.is( ':disabled' ) ) {
							// if you can't focus, go the other way
							this.$prevBtn.focus();
						} else {
							this.$nextBtn.focus();
						}
					} else {
						if ( this.$prevBtn.is( ':disabled' ) ) {
							// if you can't focus, go the other way
							this.$nextBtn.focus();
						} else {
							this.$prevBtn.focus();
						}
					}
				}
			},

			previous: function() {
				var d = 'disabled';
				this.$nextBtn.attr( d, d );
				this.$prevBtn.attr( d, d );
				this.pageIncrement = -1;
				this.render( {
					pageIncrement: this.pageIncrement
				} );
			},

			render: function( options ) {
				var self = this;
				var viewChanged = false;
				var viewObj = $.fn.repeater.views[ self.currentView ] || {};
				var prevView;

				var start = function() {
					options.preserve = ( options.preserve !== undefined ) ? options.preserve : !viewChanged;
					self.clear( options );
					if ( !self.infiniteScrollingEnabled || ( self.infiniteScrollingEnabled && viewChanged ) ) {
						self.$loader.show().loader( 'play' );
					}
					self.getDataOptions( options, function( opts ) {
						self.options.dataSource( opts, function( data ) {
							var renderer = viewObj.renderer;
							if ( self.infiniteScrollingEnabled ) {
								self.infiniteScrollingCallback( {} );
							} else {
								self.itemization( data );
								self.pagination( data );
							}
							if ( renderer ) {
								self.runRenderer( self.$canvas, renderer, data, function() {
									if ( self.infiniteScrollingEnabled ) {
										if ( viewChanged || options.clearInfinite ) {
											self.initInfiniteScrolling();
										}
										self.infiniteScrollPaging( data, options );
									}
									self.$loader.hide().loader( 'pause' );
									self.$element.trigger( 'loaded.fu.repeater' );
								} );
							}
						} );
					} );
				};

				options = options || {};

				if ( options.changeView && this.currentView !== options.changeView ) {
					prevView = this.currentView;
					this.currentView = options.changeView;
					this.$element.attr( 'data-currentview', this.currentView );
					viewChanged = true;
					if ( this.infiniteScrollingEnabled ) {
						self.infiniteScrolling( false );
					}
					viewObj = $.fn.repeater.views[ self.currentView ] || {};
					if ( viewObj.selected ) {
						viewObj.selected.call( this, {
							prevView: prevView
						}, function() {
							start();
						} );
					} else {
						start();
					}
				} else {
					start();
				}
			},

			resize: function() {
				var staticHeight = this.staticHeight;
				var viewObj = $.fn.repeater.views[ this.currentView ] || {};
				var height, viewportMargins;

				if ( staticHeight !== undefined ) {
					this.$canvas.addClass( 'scrolling' );
					viewportMargins = {
						bottom: this.$viewport.css( 'margin-bottom' ),
						top: this.$viewport.css( 'margin-top' )
					};
					height = ( ( staticHeight === 'true' || staticHeight === true ) ? this.$element.height() : parseInt( staticHeight, 10 ) ) -
						this.$element.find( '.repeater-header' ).outerHeight() -
						this.$element.find( '.repeater-footer' ).outerHeight() -
						( ( viewportMargins.bottom === 'auto' ) ? 0 : parseInt( viewportMargins.bottom, 10 ) ) -
						( ( viewportMargins.top === 'auto' ) ? 0 : parseInt( viewportMargins.top, 10 ) );
					this.$viewport.outerHeight( height );
				} else {
					this.$canvas.removeClass( 'scrolling' );
				}

				if ( viewObj.resize ) {
					viewObj.resize.call( this, {
						height: this.$element.outerHeight(),
						width: this.$element.outerWidth()
					}, function() {} );
				}
			},

			runRenderer: function( container, renderer, data, callback ) {
				var self = this;
				var skipNested = false;
				var repeat, subset, i, l;

				var loopSubset = function( index ) {
					var args = {
						container: container,
						data: data
					};
					if ( renderer.repeat ) {
						args.subset = subset;
						args.index = index;
					}
					if ( subset.length < 1 ) {
						callback();
					} else {
						start( args, function() {
							index++;
							if ( index < subset.length ) {
								loopSubset( index );
							} else {
								callback();
							}
						} );
					}
				};

				var start = function( args, cb ) {
					var item = '';

					var callbacks = {
						before: function( resp ) {
							if ( resp && resp.skipNested === true ) {
								skipNested = true;
							}
							proceed( 'render', args );
						},
						render: function( resp ) {
							var action = ( resp && resp.action ) ? resp.action : 'append';
							if ( resp && resp.item !== undefined ) {
								item = $( resp.item );
								if ( item.length < 1 ) {
									item = resp.item;
								}
								if ( action !== 'none' ) {
									container[ action ]( item );
								}
								args.item = item;
							}
							if ( resp && resp.skipNested === true ) {
								skipNested = true;
							}
							proceed( 'after', args );
						},
						after: function( resp ) {
							var cont;
							var loopNested = function( cont, index ) {
								self.runRenderer( cont, renderer.nested[ index ], data, function() {
									index++;
									if ( index < renderer.nested.length ) {
										loopNested( cont, index );
									} else {
										proceed( 'complete', args );
									}
								} );
							};

							if ( resp && resp.skipNested === true ) {
								skipNested = true;
							}

							if ( renderer.nested && !skipNested ) {
								cont = $( item );
								cont = ( cont.attr( 'data-container' ) === 'true' ) ? cont : cont.find( '[data-container="true"]:first' );
								if ( cont.length < 1 ) {
									cont = container;
								}
								loopNested( cont, 0 );
							} else {
								callbacks.complete( null );
							}
						},
						complete: function( resp ) {
							if ( cb ) {
								cb();
							}
						}
					};

					var proceed = function( stage, argus ) {
						argus = $.extend( {}, argus );
						if ( renderer[ stage ] ) {
							renderer[ stage ].call( self, argus, callbacks[ stage ] );
						} else {
							callbacks[ stage ]( null );
						}
					};

					proceed( 'before', args );
				};

				if ( renderer.repeat ) {
					repeat = renderer.repeat.split( '.' );
					if ( repeat[ 0 ] === 'data' || repeat[ 0 ] === 'this' ) {
						subset = ( repeat[ 0 ] === 'this' ) ? this : data;
						repeat.shift();
					} else {
						repeat = [];
						subset = [ '' ];
					}

					for ( i = 0, l = repeat.length; i < l; i++ ) {
						subset = subset[ repeat[ i ] ];
					}
				} else {
					subset = [ '' ];
				}

				loopSubset( 0 );
			},

			viewChanged: function( e ) {
				var $selected = $( e.target );
				this.render( {
					changeView: $selected.val(),
					pageIncrement: null
				} );
			}
		};

		// REPEATER PLUGIN DEFINITION

		$.fn.repeater = function( option ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			var methodReturn;

			var $set = this.each( function() {
				var $this = $( this );
				var data = $this.data( 'repeater' );
				var options = typeof option === 'object' && option;

				if ( !data ) $this.data( 'repeater', ( data = new Repeater( this, options ) ) );
				if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
			} );

			return ( methodReturn === undefined ) ? $set : methodReturn;
		};

		$.fn.repeater.defaults = {
			dataSource: function( options, callback ) {},
			defaultView: -1, //should be a string value. -1 means it will grab the active view from the view controls
			dropPagingCap: 10,
			staticHeight: -1 //normally true or false. -1 means it will look for data-staticheight on the element
		};

		//views object contains keyed list of view plugins, each an object with following optional parameters:
		//{
		//initialize: function(){},
		//selected: function(){},
		//renderer: {}
		//}
		//renderer object contains following optional parameters:
		//{
		//before: function(helpers){},
		//after: function(helpers){},
		//complete: function(helpers){},
		//repeat: 'parameter.subparameter.etc',
		//render: function(helpers){},
		//nested: [ *array of renderer objects* ]
		//}

		//helpers object structure:
		//{
		//container: jQuery object,	(current renderer parent)
		//data: {...}, (data returned from dataSource)
		//index: int, (only there if repeat was set. current item index)
		//item: str or jQuery object, (only there if rendered function returned item)
		//subset: {}, (only there if repeat was set. subset of data being repeated on)
		//}
		$.fn.repeater.views = {};

		$.fn.repeater.Constructor = Repeater;

		$.fn.repeater.noConflict = function() {
			$.fn.repeater = old;
			return this;
		};


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Repeater - List View Plugin
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		if ( $.fn.repeater ) {

			$.fn.repeater.Constructor.prototype.clearSelectedItems = function() {
				this.$canvas.find( '.repeater-list-check' ).remove();
				this.$canvas.find( '.repeater-list-items tr.selected' ).removeClass( 'selected' );
			};

			$.fn.repeater.Constructor.prototype.getSelectedItems = function() {
				var selected = [];
				this.$canvas.find( '.repeater-list-items tr.selected' ).each( function() {
					var $item = $( this );
					selected.push( {
						data: $item.data( 'item_data' ),
						element: $item
					} );
				} );
				return selected;
			};

			$.fn.repeater.Constructor.prototype.setSelectedItems = function( items, force ) {
				var selectable = this.options.list_selectable;
				var self = this;
				var data, i, $item, l;

				var eachFunc = function() {
					$item = $( this );
					data = $item.data( 'item_data' ) || {};
					if ( data[ items[ i ].property ] === items[ i ].value ) {
						selectItem( $item, items[ i ].selected );
					}
				};

				var selectItem = function( $itm, select ) {
					select = ( select !== undefined ) ? select : true;
					if ( select ) {
						if ( !force && selectable !== 'multi' ) {
							self.clearSelectedItems();
						}
						if ( !$itm.hasClass( 'selected' ) ) {
							$itm.addClass( 'selected' );
							$itm.find( 'td:first' ).prepend( '<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>' );
						}
					} else {
						$itm.find( '.repeater-list-check' ).remove();
						$itm.removeClass( 'selected' );
					}
				};

				if ( !$.isArray( items ) ) {
					items = [ items ];
				}
				if ( force === true || selectable === 'multi' ) {
					l = items.length;
				} else if ( selectable ) {
					l = ( items.length > 0 ) ? 1 : 0;
				} else {
					l = 0;
				}
				for ( i = 0; i < l; i++ ) {
					if ( items[ i ].index !== undefined ) {
						$item = this.$canvas.find( '.repeater-list-items tr:nth-child(' + ( items[ i ].index + 1 ) + ')' );
						if ( $item.length > 0 ) {
							selectItem( $item, items[ i ].selected );
						}
					} else if ( items[ i ].property !== undefined && items[ i ].value !== undefined ) {
						//lint demanded this function not be within this loop
						this.$canvas.find( '.repeater-list-items tr' ).each( eachFunc );
					}
				}
			};

			$.fn.repeater.defaults = $.extend( {}, $.fn.repeater.defaults, {
				list_columnRendered: null,
				list_columnSizing: true,
				list_columnSyncing: true,
				list_infiniteScroll: false,
				list_noItemsHTML: '',
				list_selectable: false,
				list_sortClearing: false,
				list_rowRendered: null
			} );

			$.fn.repeater.views.list = {
				dataOptions: function( opts, callback ) {
					if ( this.list_sortDirection ) {
						opts.sortDirection = this.list_sortDirection;
					}
					if ( this.list_sortProperty ) {
						opts.sortProperty = this.list_sortProperty;
					}
					callback( opts );
				},
				initialize: function( helpers, callback ) {
					this.list_sortDirection = null;
					this.list_sortProperty = null;
					callback();
				},
				selected: function( helpers, callback ) {
					var infScroll = this.options.list_infiniteScroll;
					var opts;

					this.list_firstRender = true;
					this.$loader.addClass( 'noHeader' );

					if ( infScroll ) {
						opts = ( typeof infScroll === 'object' ) ? infScroll : {};
						this.infiniteScrolling( true, opts );
					}

					callback( {} );
				},
				renderer: {
					complete: function( helpers, callback ) {
						columnSyncing.call( this, helpers, callback );
					},
					nested: [ {
						complete: function( helpers, callback ) {
							var auto = [];
							var self = this;
							var i, l, newWidth, taken;

							if ( !this.options.list_columnSizing || this.list_columnsSame ) {
								callback();
							} else {
								i = 0;
								taken = 0;
								helpers.item.find( 'td' ).each( function() {
									var $col = $( this );
									var isLast = ( $col.next( 'td' ).length === 0 ) ? true : false;
									var width;
									if ( self.list_columns[ i ].width !== undefined ) {
										width = self.list_columns[ i ].width;
										$col.outerWidth( width );
										taken += $col.outerWidth();
										if ( !isLast ) {
											self.list_columns[ i ]._auto_width = width;
										} else {
											$col.outerWidth( '' );
										}
									} else {
										auto.push( {
											col: $col,
											index: i,
											last: isLast
										} );
									}
									i++;
								} );

								l = auto.length;
								if ( l > 0 ) {
									newWidth = Math.floor( ( this.$canvas.width() - taken ) / l );
									for ( i = 0; i < l; i++ ) {
										if ( !auto[ i ].last ) {
											auto[ i ].col.outerWidth( newWidth );
											this.list_columns[ auto[ i ].index ]._auto_width = newWidth;
										}
									}
								}
								callback();
							}
						},
						render: function( helpers, callback ) {
							var differentColumns = function( oldCols, newCols ) {
								var i, j, l;
								if ( !oldCols ) {
									return true;
								}
								if ( !newCols ) {
									return false;
								}
								for ( i = 0, l = newCols.length; i < l; i++ ) {
									if ( !oldCols[ i ] ) {
										return true;
									} else {
										for ( j in newCols[ i ] ) {
											if ( oldCols[ i ][ j ] !== newCols[ i ][ j ] ) {
												return true;
											}
										}
									}
								}
								return false;
							};

							if ( this.list_firstRender || differentColumns( this.list_columns, helpers.data.columns ) ) {
								this.$element.find( '.repeater-list-header' ).remove();
								this.list_columns = helpers.data.columns;
								this.list_columnsSame = false;
								this.list_firstRender = false;
								this.$loader.removeClass( 'noHeader' );
								callback( {
									action: 'prepend',
									item: '<table class="table repeater-list-header" data-preserve="deep" role="grid" aria-readonly="true"><tr data-container="true"></tr></table>'
								} );
							} else {
								this.list_columnsSame = true;
								callback( {
									skipNested: true
								} );
							}
						},
						nested: [ {
							render: function( helpers, callback ) {
								var chev = 'glyphicon-chevron';
								var chevDown = chev + '-down';
								var chevUp = chev + '-up';
								var index = helpers.index;
								var self = this;
								var subset = helpers.subset;
								var cssClass, $item, sortable, $span;

								cssClass = subset[ index ].cssClass;
								$item = $( '<td><span class="glyphicon"></span></td>' );
								$item.addClass( ( ( cssClass !== undefined ) ? cssClass : '' ) ).prepend( subset[ index ].label );
								$span = $item.find( 'span.glyphicon:first' );

								sortable = subset[ index ].sortable;
								if ( sortable ) {
									$item.addClass( 'sortable' );
									$item.on( 'click.fu.repeater-list', function() {
										self.list_sortProperty = ( typeof sortable === 'string' ) ? sortable : subset[ index ].property;
										if ( $item.hasClass( 'sorted' ) ) {
											if ( $span.hasClass( chevUp ) ) {
												$span.removeClass( chevUp ).addClass( chevDown );
												self.list_sortDirection = 'desc';
											} else {
												if ( !self.options.list_sortClearing ) {
													$span.removeClass( chevDown ).addClass( chevUp );
													self.list_sortDirection = 'asc';
												} else {
													$item.removeClass( 'sorted' );
													$span.removeClass( chevDown );
													self.list_sortDirection = null;
													self.list_sortProperty = null;
												}
											}
										} else {
											helpers.container.find( 'td' ).removeClass( 'sorted' );
											$span.removeClass( chevDown ).addClass( chevUp );
											self.list_sortDirection = 'asc';
											$item.addClass( 'sorted' );
										}
										self.render( {
											clearInfinite: true,
											pageIncrement: null
										} );
									} );
								}
								if ( subset[ index ].sortDirection === 'asc' || subset[ index ].sortDirection === 'desc' ) {
									helpers.container.find( 'td' ).removeClass( 'sorted' );
									$item.addClass( 'sortable sorted' );
									if ( subset[ index ].sortDirection === 'asc' ) {
										$span.addClass( chevUp );
										this.list_sortDirection = 'asc';
									} else {
										$span.addClass( chevDown );
										this.list_sortDirection = 'desc';
									}
									this.list_sortProperty = ( typeof sortable === 'string' ) ? sortable : subset[ index ].property;
								}

								callback( {
									item: $item
								} );
							},
							repeat: 'data.columns'
						} ]
					}, {
						after: function( helpers, callback ) {
							var canvas = this.$canvas;
							var header = canvas.find( '.repeater-list-header' );
							if ( this.staticHeight ) {
								helpers.item.height( canvas.height() - header.outerHeight() );
							}
							callback();
						},
						render: function( helpers, callback ) {
							var $item = this.$canvas.find( '.repeater-list-wrapper' );
							var obj = {};
							var $empty;
							if ( $item.length > 0 ) {
								obj.action = 'none';
							} else {
								$item = $( '<div class="repeater-list-wrapper" data-infinite="true"><table class="table repeater-list-items" data-container="true" role="grid" aria-readonly="true"></table></div>' );
							}
							obj.item = $item;
							if ( helpers.data.items.length < 1 ) {
								obj.skipNested = true;
								$empty = $( '<tr class="empty"><td></td></tr>' );
								$empty.find( 'td' ).append( this.options.list_noItemsHTML );
								$item.find( '.repeater-list-items' ).append( $empty );
							} else {
								$item.find( '.repeater-list-items tr.empty:first' ).remove();
							}
							callback( obj );
						},
						nested: [ {
							complete: function( helpers, callback ) {
								var obj = {
									container: helpers.container
								};
								if ( helpers.item !== undefined ) {
									obj.item = helpers.item;
								}
								if ( this.options.list_rowRendered ) {
									this.options.list_rowRendered( obj, function() {
										callback();
									} );
								} else {
									callback();
								}
							},
							render: function( helpers, callback ) {
								var $item = $( '<tr data-container="true"></tr>' );
								var self = this;

								if ( this.options.list_selectable ) {
									$item.addClass( 'selectable' );
									$item.attr( 'tabindex', 0 ); // allow items to be tabbed to / focused on
									$item.data( 'item_data', helpers.subset[ helpers.index ] );
									$item.on( 'click.fu.repeater-list', function() {
										var $row = $( this );
										if ( $row.hasClass( 'selected' ) ) {
											$row.removeClass( 'selected' );
											$row.find( '.repeater-list-check' ).remove();
											self.$element.trigger( 'itemDeselected.fu.repeater', $row );
										} else {
											if ( self.options.list_selectable !== 'multi' ) {
												self.$canvas.find( '.repeater-list-check' ).remove();
												self.$canvas.find( '.repeater-list-items tr.selected' ).each( function() {
													$( this ).removeClass( 'selected' );
													self.$element.trigger( 'itemDeselected.fu.repeater', $( this ) );
												} );
											}
											$row.addClass( 'selected' );
											$row.find( 'td:first' ).prepend( '<div class="repeater-list-check"><span class="glyphicon glyphicon-ok"></span></div>' );
											self.$element.trigger( 'itemSelected.fu.repeater', $row );
										}
									} );
									// allow selection via enter key
									$item.keyup( function( e ) {
										if ( e.keyCode === 13 ) {
											$item.trigger( 'click.fu.repeater-list' );
										}
									} );
								}



								this.list_curRowIndex = helpers.index;
								callback( {
									item: $item
								} );
							},
							repeat: 'data.items',
							nested: [ {
								after: function( helpers, callback ) {
									var obj = {
										container: helpers.container
									};
									if ( helpers.item !== undefined ) {
										obj.item = helpers.item;
									}
									if ( this.options.list_columnRendered ) {
										this.options.list_columnRendered( obj, function() {
											callback();
										} );
									} else {
										callback();
									}
								},
								render: function( helpers, callback ) {
									var cssClass = helpers.subset[ helpers.index ].cssClass;
									var content = helpers.data.items[ this.list_curRowIndex ][ helpers.subset[ helpers.index ].property ];
									var $item = $( '<td></td>' );
									var width = helpers.subset[ helpers.index ]._auto_width;

									$item.addClass( ( ( cssClass !== undefined ) ? cssClass : '' ) ).append( content );
									if ( width !== undefined ) {
										$item.outerWidth( width );
									}
									callback( {
										item: $item
									} );
								},
								repeat: 'this.list_columns'
							} ]
						} ]
					} ]
				},
				resize: function( helpers, callback ) {
					columnSyncing.call( this, {
						data: {
							items: [ '' ]
						}
					}, callback );
				}
			};

			var columnSyncing = function( helpers, callback ) {
				var i = 0;
				var widths = [];
				var $header, $items;

				if ( !this.options.list_columnSyncing || ( helpers.data.items.length < 1 ) ) {
					callback();
				} else {
					$header = this.$element.find( '.repeater-list-header:first' );
					$items = this.$element.find( '.repeater-list-items:first' );
					$items.find( 'tr:first td' ).each( function() {
						widths.push( $( this ).outerWidth() );
					} );
					widths.pop();
					$header.find( 'td' ).each( function() {
						if ( widths[ i ] !== undefined ) {
							$( this ).outerWidth( widths[ i ] );
						}
						i++;
					} );
					callback();
				}
			};
		}


	} )( jQuery );


	( function( $ ) {

		/*
		 * Fuel UX Repeater - Thumbnail View Plugin
		 * https://github.com/ExactTarget/fuelux
		 *
		 * Copyright (c) 2014 ExactTarget
		 * Licensed under the MIT license.
		 */



		// -- BEGIN MODULE CODE HERE --

		if ( $.fn.repeater ) {

			$.fn.repeater.defaults = $.extend( {}, $.fn.repeater.defaults, {
				thumbnail_infiniteScroll: false,
				thumbnail_itemRendered: null,
				thumbnail_template: '<div class="thumbnail repeater-thumbnail" style="background-color: {{color}};"><img height="75" src="{{src}}" width="65"><span>{{name}}</span></div>'
			} );

			$.fn.repeater.views.thumbnail = {
				selected: function( helpers, callback ) {
					var infScroll = this.options.thumbnail_infiniteScroll;
					var opts;
					if ( infScroll ) {
						opts = ( typeof infScroll === 'object' ) ? infScroll : {};
						this.infiniteScrolling( true, opts );
					}
					callback( {} );
				},
				renderer: {
					render: function( helpers, callback ) {
						var $item = this.$element.find( '.repeater-thumbnail-cont' );
						var obj = {};
						var $empty;
						if ( $item.length > 0 ) {
							obj.action = 'none';
						} else {
							$item = $( '<div class="clearfix repeater-thumbnail-cont" data-container="true" data-infinite="true" data-preserve="shallow"></div>' );
						}
						obj.item = $item;
						if ( helpers.data.items.length < 1 ) {
							obj.skipNested = true;
							$empty = $( '<div class="empty"></div>' );
							$empty.append( this.options.thumbnail_noItemsHTML );
							$item.append( $empty );
						} else {
							$item.find( '.empty:first' ).remove();
						}
						callback( obj );
					},
					nested: [ {
						after: function( helpers, callback ) {
							var obj = {
								container: helpers.container
							};
							if ( helpers.item !== undefined ) {
								obj.item = helpers.item;
							}
							if ( this.options.thumbnail_itemRendered ) {
								this.options.thumbnail_itemRendered( obj, function() {
									callback();
								} );
							} else {
								callback();
							}
						},
						render: function( helpers, callback ) {
							var item = helpers.subset[ helpers.index ];
							var template = function( str ) {
								var invalid = false;
								var replace = function() {
									var end, start, val;

									start = str.indexOf( '{{' );
									end = str.indexOf( '}}', start + 2 );

									if ( start > -1 && end > -1 ) {
										val = $.trim( str.substring( start + 2, end ) );
										val = ( item[ val ] !== undefined ) ? item[ val ] : '';
										str = str.substring( 0, start ) + val + str.substring( end + 2 );
									} else {
										invalid = true;
									}
								};

								while ( !invalid && str.search( '{{' ) >= 0 ) {
									replace( str );
								}
								return str;
							};
							callback( {
								item: template( this.options.thumbnail_template )
							} );
						},
						repeat: 'data.items'
					} ]
				}
			};

		}


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
			this.$startDate = this.$element.find( '.start-datetime .start-date' );
			this.$startTime = this.$element.find( '.start-datetime .start-time' );

			this.$timeZone = this.$element.find( '.timezone-container .timezone' );

			this.$repeatIntervalPanel = this.$element.find( '.repeat-every-panel' );
			this.$repeatIntervalSelect = this.$element.find( '.repeat-options' );

			this.$repeatIntervalSpinbox = this.$element.find( '.repeat-every' );
			this.$repeatIntervalTxt = this.$element.find( '.repeat-every-text' );

			this.$end = this.$element.find( '.repeat-end' );
			this.$endSelect = this.$end.find( '.end-options' );
			this.$endAfter = this.$end.find( '.end-after' );
			this.$endDate = this.$end.find( '.end-on-date' );

			// panels
			this.$recurrencePanels = this.$element.find( '.repeat-panel' );

			//initialize sub-controls
			this.$element.find( '.selectlist' ).selectlist();
			this.$startDate.datepicker();
			this.$startTime.combobox();
			// init start time
			if ( this.$startTime.find( 'input' ).val() === '' ) {
				this.$startTime.combobox( 'selectByIndex', 0 );
			}
			// every 0 days/hours doesn't make sense
			this.$repeatIntervalSpinbox.spinbox( {
				'value': 1,
				'min': 1
			} );
			this.$endAfter.spinbox();
			this.$endDate.datepicker();

			// bind events: 'change' is a Bootstrap JS fired event
			this.$repeatIntervalSelect.on( 'changed.fu.selectlist', $.proxy( this.repeatIntervalSelectChanged, this ) );
			this.$endSelect.on( 'changed.fu.selectlist', $.proxy( this.endSelectChanged, this ) );
			this.$element.find( '.repeat-days-of-the-week .btn-group .btn' ).on( 'change.fu.scheduler', function( e, data ) {
				self.changed( e, data, true );
			} );
			this.$element.find( '.combobox' ).on( 'changed.fu.combobox', $.proxy( this.changed, this ) );
			this.$element.find( '.datepicker' ).on( 'changed.fu.datepicker', $.proxy( this.changed, this ) );
			this.$element.find( '.selectlist' ).on( 'changed.fu.selectlist', $.proxy( this.changed, this ) );
			this.$element.find( '.spinbox' ).on( 'changed.fu.spinbox', $.proxy( this.changed, this ) );
			this.$element.find( '.repeat-monthly .radio, .repeat-yearly .radio' ).on( 'change.fu.scheduler', $.proxy( this.changed, this ) );

		};

		Scheduler.prototype = {
			constructor: Scheduler,

			changed: function( e, data, propagate ) {
				if ( !propagate ) {
					e.stopPropagation();
				}
				this.$element.trigger( 'changed.fu.scheduler', {
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
					selectedItem = this.$endSelect.selectlist( 'selectedItem' );
					val = selectedItem.value;
				} else {
					val = data.value;
				}

				// hide all panels
				this.$endAfter.parent().addClass( 'hide' );
				this.$endAfter.parent().attr( 'aria-hidden', 'true' );

				this.$endDate.parent().addClass( 'hide' );
				this.$endDate.parent().attr( 'aria-hidden', 'true' );

				if ( val === 'after' ) {
					this.$endAfter.parent().removeClass( 'hide' );
					this.$endAfter.parent().attr( 'aria-hidden', 'false' );
				} else if ( val === 'date' ) {
					this.$endDate.parent().removeClass( 'hide' );
					this.$endDate.parent().attr( 'aria-hidden', 'false' );
				}
			},

			getValue: function() {
				// FREQ = frequency (hourly, daily, monthly...)
				// BYDAY = when picking days (MO,TU,WE,etc)
				// BYMONTH = when picking months (Jan,Feb,March) - note the values should be 1,2,3...
				// BYMONTHDAY = when picking days of the month (1,2,3...)
				// BYSETPOS = when picking First,Second,Third,Fourth,Last (1,2,3,4,-1)

				var interval = this.$repeatIntervalSpinbox.spinbox( 'value' );
				var pattern = '';
				var repeat = this.$repeatIntervalSelect.selectlist( 'selectedItem' ).value;
				var startTime = this.$startTime.combobox( 'selectedItem' ).text.toLowerCase();
				var timeZone = this.$timeZone.selectlist( 'selectedItem' );
				var getFormattedDate;

				getFormattedDate = function( dateObj, dash ) {
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
					this.$element.find( '.repeat-days-of-the-week .btn-group input:checked' ).each( function() {
						days.push( $( this ).data().value );
					} );

					pattern += 'FREQ=WEEKLY;';
					pattern += 'BYDAY=' + days.join( ',' ) + ';';
					pattern += 'INTERVAL=' + interval + ';';
				} else if ( repeat === 'monthly' ) {
					pattern += 'FREQ=MONTHLY;';
					pattern += 'INTERVAL=' + interval + ';';
					type = this.$element.find( 'input[name=repeat-monthly]:checked' ).val();

					if ( type === 'bymonthday' ) {
						day = parseInt( this.$element.find( '.repeat-monthly-date .selectlist' ).selectlist( 'selectedItem' ).text, 10 );
						pattern += 'BYMONTHDAY=' + day + ';';
					} else if ( type === 'bysetpos' ) {
						days = this.$element.find( '.month-days' ).selectlist( 'selectedItem' ).value;
						pos = this.$element.find( '.month-day-pos' ).selectlist( 'selectedItem' ).value;
						pattern += 'BYDAY=' + days + ';';
						pattern += 'BYSETPOS=' + pos + ';';
					}

				} else if ( repeat === 'yearly' ) {
					pattern += 'FREQ=YEARLY;';
					type = this.$element.find( 'input[name=repeat-yearly]:checked' ).val();

					if ( type === 'bymonthday' ) {
						month = this.$element.find( '.repeat-yearly-date .year-month' ).selectlist( 'selectedItem' ).value;
						day = this.$element.find( '.year-month-day' ).selectlist( 'selectedItem' ).text;
						pattern += 'BYMONTH=' + month + ';';
						pattern += 'BYMONTHDAY=' + day + ';';
					} else if ( type === 'bysetpos' ) {
						days = this.$element.find( '.year-month-days' ).selectlist( 'selectedItem' ).value;
						pos = this.$element.find( '.year-month-day-pos' ).selectlist( 'selectedItem' ).value;
						month = this.$element.find( '.repeat-yearly-day .year-month' ).selectlist( 'selectedItem' ).value;

						pattern += 'BYDAY=' + days + ';';
						pattern += 'BYSETPOS=' + pos + ';';
						pattern += 'BYMONTH=' + month + ';';
					}

				}

				var end = this.$endSelect.selectlist( 'selectedItem' ).value;
				var duration = '';

				// if both UNTIL and COUNT are not specified, the recurrence will repeat forever
				// http://tools.ietf.org/html/rfc2445#section-4.3.10
				if ( repeat !== 'none' ) {
					if ( end === 'after' ) {
						duration = 'COUNT=' + this.$endAfter.spinbox( 'value' ) + ';';
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
					selectedItem = this.$repeatIntervalSelect.selectlist( 'selectedItem' );
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
						this.$repeatIntervalPanel.removeClass( 'hide' );
						this.$repeatIntervalPanel.attr( 'aria-hidden', 'false' );
						break;
					default:
						this.$repeatIntervalPanel.addClass( 'hide' );
						this.$repeatIntervalPanel.attr( 'aria-hidden', 'true' );
						break;
				}

				// hide all panels
				this.$recurrencePanels.addClass( 'hide' );
				this.$recurrencePanels.attr( 'aria-hidden', 'true' );

				// show panel for current selection
				this.$element.find( '.repeat-' + val ).removeClass( 'hide' );
				this.$element.find( '.repeat-' + val ).attr( 'aria-hidden', 'false' );

				// the end selection should only be shown when
				// the repeat interval is not "None (run once)"
				if ( val === 'none' ) {
					this.$end.addClass( 'hide' );
					this.$end.attr( 'aria-hidden', 'true' );
				} else {
					this.$end.removeClass( 'hide' );
					this.$end.attr( 'aria-hidden', 'false' );
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
					this.$timeZone.selectlist( 'selectBySelector', item );
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
					this.$timeZone.selectlist( 'selectBySelector', item );
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
							item = this.$element.find( '.repeat-days-of-the-week .btn-group' );
							item.find( 'label' ).removeClass( 'active' );
							temp = recur.BYDAY.split( ',' );
							for ( i = 0, l = temp.length; i < l; i++ ) {
								item.find( 'input[data-value="' + temp[ i ] + '"]' ).parent().addClass( 'active' );
							}
						}
						item = 'weekly';
					} else if ( recur.FREQ === 'MONTHLY' ) {
						this.$element.find( '.repeat-monthly input' ).removeClass( 'checked' );
						if ( recur.BYMONTHDAY ) {
							temp = this.$element.find( '.repeat-monthly-date' );
							temp.find( 'input' ).addClass( 'checked' );
							temp.find( '.select' ).selectlist( 'selectByValue', recur.BYMONTHDAY );
						} else if ( recur.BYDAY ) {
							temp = this.$element.find( '.repeat-monthly-day' );
							temp.find( 'input' ).addClass( 'checked' );
							if ( recur.BYSETPOS ) {
								temp.find( '.month-day-pos' ).selectlist( 'selectByValue', recur.BYSETPOS );
							}
							temp.find( '.month-days' ).selectlist( 'selectByValue', recur.BYDAY );
						}
						item = 'monthly';
					} else if ( recur.FREQ === 'YEARLY' ) {
						this.$element.find( '.repeat-yearly input' ).removeClass( 'checked' );
						if ( recur.BYMONTHDAY ) {
							temp = this.$element.find( '.repeat-yearly-date' );
							temp.find( 'input' ).addClass( 'checked' );
							if ( recur.BYMONTH ) {
								temp.find( '.year-month' ).selectlist( 'selectByValue', recur.BYMONTH );
							}
							temp.find( '.year-month-day' ).selectlist( 'selectByValue', recur.BYMONTHDAY );
						} else if ( recur.BYSETPOS ) {
							temp = this.$element.find( '.repeat-yearly-day' );
							temp.find( 'input' ).addClass( 'checked' );
							temp.find( '.year-month-day-pos' ).selectlist( 'selectByValue', recur.BYSETPOS );
							if ( recur.BYDAY ) {
								temp.find( '.year-month-days' ).selectlist( 'selectByValue', recur.BYDAY );
							}
							if ( recur.BYMONTH ) {
								temp.find( '.year-month' ).selectlist( 'selectByValue', recur.BYMONTH );
							}
						}
						item = 'yearly';
					} else {
						item = 'none';
					}

					if ( recur.COUNT ) {
						this.$endAfter.spinbox( 'value', parseInt( recur.COUNT, 10 ) );
						this.$endSelect.selectlist( 'selectByValue', 'after' );
					} else if ( recur.UNTIL ) {
						temp = recur.UNTIL;
						if ( temp.length === 8 ) {
							temp = temp.split( '' );
							temp.splice( 4, 0, '-' );
							temp.splice( 7, 0, '-' );
							temp = temp.join( '' );
						}
						this.$endDate.datepicker( 'setDate', temp );
						this.$endSelect.selectlist( 'selectByValue', 'date' );
					}
					this.endSelectChanged();

					if ( recur.INTERVAL ) {
						this.$repeatIntervalSpinbox.spinbox( 'value', parseInt( recur.INTERVAL, 10 ) );
					}
					this.$repeatIntervalSelect.selectlist( 'selectByValue', item );
					this.repeatIntervalSelectChanged();
				}
			},

			toggleState: function( action ) {
				this.$element.find( '.combobox' ).combobox( action );
				this.$element.find( '.datepicker' ).datepicker( action );
				this.$element.find( '.selectlist' ).selectlist( action );
				this.$element.find( '.spinbox' ).spinbox( action );
				this.$element.find( '[type=radio]' ).radio( action );

				if ( action === 'disable' ) {
					action = 'addClass';
				} else {
					action = 'removeClass';
				}
				this.$element.find( '.repeat-days-of-the-week .btn-group' )[ action ]( 'disabled' );
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


		// DATA-API

		$( document ).on( 'mousedown.fu.scheduler.data-api', '[data-initialize=scheduler]', function( e ) {
			var $control = $( e.target ).closest( '.scheduler' );
			if ( !$control.data( 'scheduler' ) ) {
				$control.scheduler( $control.data() );
			}
		} );

		// Must be domReady for AMD compatibility
		$( function() {
			$( '[data-initialize=scheduler]' ).each( function() {
				var $this = $( this );
				if ( $this.data( 'scheduler' ) ) return;
				$this.scheduler( $this.data() );
			} );
		} );



	} )( jQuery );


} ) );
