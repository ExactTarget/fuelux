/*
 * Fuel UX Datepicker
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2013 ExactTarget
 * Licensed under the MIT license.
 */

define(function (require) {

	var $ = require('jquery');

	// DATEPICKER CONSTRUCTOR AND PROTOTYPE

	var Datepicker = function (element, options) {
		this.$element = $(element);

		this.options = $.extend(true, {}, $.fn.datepicker.defaults, options);

		this.date = this.options.date || new Date();
		this.date.setHours( 0,0,0,0 );

		this.viewDate   = new Date( this.date.valueOf() );
		this.stagedDate = new Date( this.date.valueOf() );
		this.viewDate.setHours( 0,0,0,0 );
		this.stagedDate.setHours( 0,0,0,0 );

		this.done      = false;
		this.callbacks = [];

		this.minDate = new Date();
		this.minDate.setUTCDate( this.minDate.getUTCDate() - 1 );
		this.minDate.setHours( 0,0,0,0 );

		this.maxDate = new Date();
		this.maxDate.setUTCFullYear( this.maxDate.getUTCFullYear() + 10 );
		this.maxDate.setHours( 23,59,59,999 );

		this.years = this.yearRange( this.viewDate );

		this.formatDate = this.options.formatDate;

		// OPTIONS
		this.options.dropdownWidth = this.options.dropdownWidth || 170;
		this.options.monthNames    = this.options.monthNames || [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		this.options.weekdays      = this.options.weekdays || [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

		this.options.showYears  = false;
		this.options.showDays   = true;
		this.options.showMonths = false;

		this.options.restrictLastMonth = false;
		this.options.restrictNextMonth = false;

		this.months = [
			{ abbreviation: this.options.monthNames[0], 'class': '', number: 0 },
			{ abbreviation: this.options.monthNames[1], 'class': '', number: 1 },
			{ abbreviation: this.options.monthNames[2], 'class': '', number: 2 },
			{ abbreviation: this.options.monthNames[3], 'class': '', number: 3 },
			{ abbreviation: this.options.monthNames[4], 'class': '', number: 4 },
			{ abbreviation: this.options.monthNames[5], 'class': '', number: 5 },
			{ abbreviation: this.options.monthNames[6], 'class': '', number: 6 },
			{ abbreviation: this.options.monthNames[7], 'class': '', number: 7 },
			{ abbreviation: this.options.monthNames[8], 'class': '', number: 8 },
			{ abbreviation: this.options.monthNames[9], 'class': '', number: 9 },
			{ abbreviation: this.options.monthNames[10], 'class': '', number: 10 },
			{ abbreviation: this.options.monthNames[11], 'class': '', number: 11 }
		];

		if( !!this.options.createInput ) {
			if( typeof this.options.createInput === "boolean" && !!this.options.createInput ) {
				this.options.createInput = {};
			}

			if( typeof this.options.createInput === 'object' && isNaN( this.options.createInput.length ) ) {
				this.options.createInput.inputSize = this.options.createInput.inputSize || 'span3';
				this.renderInput();
			} else {
				throw new Error( 'createInput option needs to be an object or boolean true' );
			}

		} else {
			this.render({
				addDateToInput: true
			});
		}
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		restrictDateSelection: function() {
			if( !!this.options && !this.options.restrictDateSelection ) {
				this.options.restrictLastMonth = false;
				this.options.restrictNextMonth = false;
			}
		},

		// functions that can be called on object
		destroy: function() {
			this.$element.remove();
		},

		disable: function() {
			this.$element.find('input, button').attr( 'disabled', true );
		},

		enable: function() {
			this.$element.find('input, button').attr( 'disabled', false );
		},

		repeat: function( head, collection, iterator, tail) {
			var value = head;
			for (var i = 0, ii = collection.length; i < ii; i++) {
				value += iterator( collection[i] );
			}
			value += tail;
			return value;
		},

		getDaysInMonth: function( month, year ) {
			return 32 - new Date(year, month, 32).getUTCDate();
		},

		range: function( start, end ) {
			var numbers = [];
			for (var i = start; i < end; i++) {
				numbers[numbers.length] = i;
			}
			return numbers;
		},

		yearRange: function( date ) {
			var start    = ( Math.floor(date.getUTCFullYear() / 10 ) * 10) - 1;
			var end      = start + 12;
			var years    = this.range(start, end);
			var interval = [];

			for (var i = 0, ii = years.length; i < ii; i++) {
				var clazz = '';
				if( i === 0 ) {
					clazz = 'previous';
				}
				if( i === years.length - 1 ) {
					clazz = 'next';
				}
				interval[i] = {
					number: years[ i ],
					'class': clazz
				};
			}
			return interval;
		},

		killEvent: function( e ) {
			if(e.stopPropagation) {
				e.stopPropagation();
			}
			if(e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
			return false;
		},

		applySize: function( elements, size ) {
			for (var i = 0; i < elements.length; i++) {
				$(elements[ i ]).css({
					'width': size,
					'height': size,
					'line-height': size
				});
			}
		},

		show: function( show ) {
			return show ? '' : 'display: none;';
		},

		hide: function(hide) {
			return this.show( !hide );
		},

		runCallbacks: function() {
			for (var i = 0; i < this.callbacks.length; i++) {
				this.callbacks[ i ]( this.date );
			}
		},

		showView: function( view ) {
			if( view === 1 ) {
				this.options.showDays   = true;
				this.options.showMonths = false;
				this.options.showYears  = false;
			} else if( view === 2 ) {
				this.options.showDays   = false;
				this.options.showMonths = true;
				this.options.showYears  = false;
			} else if( view === 3 ) {
				this.options.showDays   = false;
				this.options.showMonths = false;
				this.options.showYears  = true;
			}
		},

		updateCalendarData: function() {
			var viewedMonth            = this.viewDate.getUTCMonth();
			var viewedYear             = this.viewDate.getUTCFullYear();
			var selectedDay            = this.stagedDate.getUTCDate();
			var selectedMonth          = this.stagedDate.getUTCMonth();
			var selectedYear           = this.stagedDate.getUTCFullYear();
			var firstDayOfMonthWeekday = new Date( viewedYear, viewedMonth, 1 ).getUTCDay();
			var lastDayOfMonth         = this.getDaysInMonth( viewedMonth, viewedYear );
			var lastDayOfLastMonth     = this.getDaysInMonth( viewedMonth - 1, viewedYear );

			if( firstDayOfMonthWeekday === 0 ) {
				firstDayOfMonthWeekday = 7;
			}

			var addToEnd = ( 42 - lastDayOfMonth ) - firstDayOfMonthWeekday;

			this.daysOfLastMonth = this.range(lastDayOfLastMonth - firstDayOfMonthWeekday + 1, lastDayOfLastMonth + 1);
			this.daysOfNextMonth = this.range(1, addToEnd + 1);

			var now                  = new Date();
			var currentDay           = now.getUTCDate();
			var currentMonth         = now.getUTCMonth();
			var currentYear          = now.getUTCFullYear();
			var viewingCurrentMonth  = viewedMonth === currentMonth;
			var viewingCurrentYear   = viewedYear === currentYear;
			var viewingSelectedMonth = viewedMonth === selectedMonth;
			var viewingSelectedYear  = viewedYear === selectedYear;

			var daysOfThisMonth = this.range( 1, lastDayOfMonth + 1 );
			this.daysOfThisMonth = [];

			for( var i = 0, ii = daysOfThisMonth.length; i < ii; i++) {

				var weekDay      = new Date(viewedYear, viewedMonth, daysOfThisMonth[ i ]).getUTCDay();
				var weekDayClass = 'weekday';

				if(weekDay === 6 || weekDay === 0) {
					weekDayClass = 'weekend';
				}
				if( weekDay === 1 ) {
					weekDayClass = '';
				}
				weekDayClass += ' weekday' + weekDay;

				if( daysOfThisMonth[ i ] === selectedDay && viewingSelectedMonth && viewingSelectedYear ) {
					weekDayClass += ' selected';
				} else if( daysOfThisMonth[ i ] === currentDay && viewingCurrentMonth && viewingCurrentYear ) {
					weekDayClass += ' today';
				}

				var dt = new Date( viewedYear, viewedMonth, daysOfThisMonth[ i ], 0, 0, 0, 0 );
				if( dt <= this.minDate || dt >= this.maxDate ) {
					if( !!this.options && !!this.options.restrictDateSelection ) {
						weekDayClass += ' restrict';
					} else {
						weekDayClass += ' past';
					}
					if( daysOfThisMonth[ i ] === 1 ) {
						this.options.restrictLastMonth = true;
					}
					if( daysOfThisMonth.length - 1 === i ) {
						this.options.restrictNextMonth = true;
					}
				} else {
					if( daysOfThisMonth[i] === 1 ) {
						this.options.restrictLastMonth = false;
					}
					if( daysOfThisMonth.length - 1 === i ) {
						this.options.restrictNextMonth = false;
					}
				}

				this.daysOfThisMonth[ this.daysOfThisMonth.length ] = {
					'number': daysOfThisMonth[ i ],
					'class' : weekDayClass
				};
			}

			var daysInMonth = this.getDaysInMonth( this.minDate.getUTCFullYear(), this.minDate.getUTCMonth() );
			for( var j = 0, jj = this.months.length; j < jj; j++ ) {

				this.months[ j ][ 'class' ] = '';
				if( viewingCurrentYear && j === currentMonth ) {
					this.months[ j ][ 'class' ] += ' today';
				}
				if( i === selectedMonth && viewingSelectedYear ) {
					this.months[ j ][ 'class' ] += ' selected';
				}

				var minDt = new Date( viewedYear, j, daysInMonth, 23, 59, 59, 999 );
				var maxDt = new Date( viewedYear, j, 0, 0, 0, 0, 0 );
				if( minDt <= this.minDate || maxDt >= this.maxDate ) {
					if( !!this.options.restrictDateSelection ) {
						this.months[ j ][ 'class' ] += ' restrict';
					}
				}
			}

			this.years = this.yearRange( this.viewDate);
			daysInMonth = this.getDaysInMonth( this.minDate.getUTCFullYear(), 11 );

			for( var z = 0, zz = this.years.length; z < zz; z++ ) {
				if( this.years[ z ].number === currentYear ) {
					this.years[ z ][ 'class' ] += ' today';
				}
				if( this.years[ z ].number === selectedYear ) {
					this.years[ z ][ 'class' ] += ' selected';
				}

				var minDt2 = new Date( this.years[ z ].number, 11, daysInMonth, 23, 59, 59, 999);
				var maxDt2 = new Date( this.years[ z ].number, 0, 0, 0, 0, 0, 0);
				if( minDt2 <= this.minDate || maxDt2 >= this.maxDate ) {
					if( !!this.options.restrictDateSelection ) {
						this.years[ z ]['class'] += ' restrict';
					}
				}
			}
		},

		updateCss: function() {
			while( this.options.dropdownWidth % 7 !== 0 ) {
				this.options.dropdownWidth++;
			}

			this.$view.css('width', this.options.dropdownWidth + 'px' );
			this.$header.css('width', this.options.dropdownWidth + 'px' );
			this.$labelDiv.css('width', ( this.options.dropdownWidth - 60 ) + 'px' );
			this.$footer.css('width', this.options.dropdownWidth + 'px' );
			var labelSize     = ( this.options.dropdownWidth * 0.25 ) - 2;
			var paddingTop    = Math.round( ( this.options.dropdownWidth - ( labelSize * 3 ) ) / 2 );
			var paddingBottom = paddingTop;
			while( paddingBottom + paddingTop + ( labelSize * 3 ) < this.options.dropdownWidth ) {
				paddingBottom += 0.1;
			}
			while( paddingBottom + paddingTop + ( labelSize * 3 ) > this.options.dropdownWidth ) {
				paddingBottom -= 0.1;
			}
			
			this.$calendar.css({
				'float': 'left'
			});

			this.$monthsView.css({
				'width': this.options.dropdownWidth + 'px',
				'padding-top': paddingTop + 'px',
				'padding-bottom': paddingBottom + 'px'
			});

			this.$yearsView.css({
				'width': this.options.dropdownWidth + 'px',
				'padding-top': paddingTop + 'px',
				'padding-bottom': paddingBottom + 'px'
			});

			var cellSize = Math.round( this.options.dropdownWidth / 7.0 ) - 2 + 'px';
			var headerCellSize = Math.round( this.options.dropdownWidth / 7.0 ) + 'px';
			this.applySize( this.$yearsView.children(), labelSize + 'px' );
			this.applySize( this.$monthsView.children(), labelSize + 'px' );
			this.applySize( this.$weekdaysDiv.children(), headerCellSize );
			this.applySize( this.$lastMonthDiv.children(), cellSize );
			this.applySize( this.$thisMonthDiv.children(), cellSize );
			this.applySize( this.$nextMonthDiv.children(), cellSize );
		},

		select: function( e ) {
			if( e.target.className.indexOf( 'restrict' ) > -1 ) {
				return this.killEvent(e);
			}

			this.stagedDate = this.viewDate;
			this.stagedDate.setDate( parseInt( e.target.innerHTML, 10 ) );

			this.date.setUTCFullYear( this.stagedDate.getUTCFullYear() );
			this.date.setUTCMonth( this.stagedDate.getUTCMonth() );
			this.date.setUTCDate( this.stagedDate.getUTCDate() );
			this.insertDateIntoInput( this.date );
			this.render();
			this.done = true;
			this.runCallbacks();
		},

		pickYear: function( e ) {
			var year = parseInt( $( e.target ).data( 'yearNumber' ), 10 );
			if( e.target.className.indexOf('restrict') > -1 ) {
				return this.killEvent(e);
			}

			this.viewDate = new Date( year, this.viewDate.getUTCMonth(), 1 );
			this.showView( 2 );
			this.render();

			return this.killEvent(e);
		},

		pickMonth: function( e ) {
			var month = parseInt( $(e.target).data( 'monthNumber' ), 10 );
			if( e.target.className.indexOf( 'restrict' ) > -1 ) {
				return this.killEvent(e);
			}

			this.viewDate = new Date( this.viewDate.getUTCFullYear(), month, 1 );
			this.showView(1);
			this.render();

			return this.killEvent(e);
		},

		done: function() {
			this.date.setUTCFullYear( this.stagedDate.getUTCFullYear() );
			this.date.setUTCMonth( this.stagedDate.getUTCMonth() );
			this.date.setUTCDate( this.stagedDate.getUTCDate() );
			this.render();
			this.done = true;
			this.runCallbacks();
		},

		previousSet: function( e ) {
			this.previous( e, true );
		},

		previous: function( e, set ) {
			if( e.target.className.indexOf( 'restrict' ) > -1 ) {
				return this.killEvent(e);
			}
			
			if( this.options.showDays) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth() - 1, 1 );
			} else if( this.options.showMonths ) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear() - 1, this.viewDate.getUTCMonth(), 1 );
			} else if( this.options.showYears ) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear() - 10, this.viewDate.getUTCMonth(), 1 );
			}

			if( !!set ) {
				this.select( e );
			} else {
				this.render();
			}
			// move this below 'this.render()' if you want it to go to the previous month when you select a day from the current month
			return this.killEvent( e );
		},

		nextSet: function( e ) {
			this.next( e, true );
		},

		next: function( e, set ) {
			if( e.target.className.indexOf('restrict') > -1 ) {
				return this.killEvent(e);
			}
			
			if( this.options.showDays ) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear(), this.viewDate.getUTCMonth() + 1, 1 );
			} else if( this.options.showMonths ) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear() + 1, this.viewDate.getUTCMonth(), 1 );
			} else if( this.options.showYears ) {
				this.viewDate = new Date( this.viewDate.getUTCFullYear() + 10, this.viewDate.getUTCMonth(), 1 );
			}

			if( !!set ) {
				this.select( e );
			} else {
				this.render();
			}
			// move this below 'this.render()' if you want it to go to the next month when you select a day from the current month
			return this.killEvent(e);
		},

		today: function( e ) {
			this.viewDate = new Date();
			this.render();
			return this.killEvent(e);
		},

		emptySpace: function( e ) {
			if( !!this.done ) {
				this.done = false;
			} else {
				return this.killEvent(e);
			}
		},

		monthLabel: function() {
			return this.options.monthNames[ this.viewDate.getUTCMonth() ];
		},

		yearLabel: function() {
			return this.viewDate.getUTCFullYear();
		},

		monthYearLabel: function() {
			var label;
			if( this.options.showDays ) {
				label = this.monthLabel() + ' ' + this.yearLabel();
			} else if( this.options.showMonths ) {
				label = this.yearLabel();
			} else if( this.options.showYears ) {
				label = this.years[ 0 ].number + ' - ' + this.years[ this.years.length - 1 ].number;
			}
			return label;
		},

		toggleMonthYearPicker: function( e ) {
			if( this.options.showDays ) {
				this.showView(2);
			} else if( this.options.showMonths ) {
				this.showView(3);
			} else if( this.options.showYears ) {
				this.showView(1);
			}
			this.render();
			return this.killEvent( e );
		},

		renderCalendar: function() {
			var self = this;
			self.restrictDateSelection();

			return '<div class="calendar">' +
				'<div class="header clearfix">' +
					'<div class="left hover"><div class="leftArrow"></div></div>' +
					'<div class="right hover"><div class="rightArrow"></div></div>' +
					'<div class="center hover">' + self.monthYearLabel() + '</div>' +
				'</div>' +
				'<div class="daysView" style="' + self.show( self.options.showDays ) + '">' +

					self.repeat( '<div class="weekdays">', self.options.weekdays,
						function( weekday ) {
							return '<div >' + weekday + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="lastmonth">', self.daysOfLastMonth,
						function( day ) {
							var clazz = self.options.restrictLastMonth ? 'restrict' : '';
							return '<div class="' + clazz + '">' + day + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="thismonth">', self.daysOfThisMonth,
						function( day ) {
							return '<div class="' + day[ 'class' ] + '">' + day.number + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="nextmonth">', self.daysOfNextMonth,
						function( day ) {
							var clazz = self.options.restrictNextMonth ? 'restrict' : '';
							return '<div class="' + clazz + '">' + day + '</div>';
						}, '</div>' ) +
				'</div>' +

				self.repeat( '<div class="monthsView" style="' + self.show( self.options.showMonths ) + '">', self.months,
					function( month ) {
						return '<div data-month-number="' + month.number +
							'" class="' + month[ 'class' ] + '">' + month.abbreviation + '</div>';
					}, '</div>' ) +

				self.repeat( '<div class="yearsView" style="' + self.show( self.options.showYears ) + '">', self.years,
					function( year ) {
						return '<div data-year-number="' + year.number +
							'" class="' + year[ 'class' ] + '">' + year.number + '</div>';
					}, '</div>' ) +

				'<div class="footer">' +
					'<div class="center hover">Today</div>' +
				'</div>' +
			'</div>';
		},

		render: function( localOptions ) {
			if( !!localOptions && !!localOptions.addDateToInput ) {
				this.insertDateIntoInput();
			}
			this.updateCalendarData();
			this.$element.find('.replaceWithDatepicker').html( this.renderCalendar() );
			this.initializeCalendarElements();
			this.addBindings();
			this.updateCss();
		},

		renderInput: function() {
			var input = ( !!this.options.createInput.native ) ? this.renderInputNative() : this.renderInputHTML();
			this.$element.html( input );
			this.render();
		},

		renderInputNative: function() {
			//return '<input type="date" min="' + minRaw + '" max="' + maxRaw + '" value="' + rawDate + '" class="native form-control input-small">';
			return '<input type="date" value="' + this.formatDate( this.options.date ) + '"' + this.calculateInputSize( [ 'native' ] ) + '>';
		},

		renderInputHTML: function() {
			var inputClass = ( !!this.options.createInput.dropDownBtn ) ? 'input-append' : 'input-group';

			var dropdownHtml = '<div class="' + inputClass + '">' +
						'<div class="dropdown-menu replaceWithDatepicker"></div>' +
						'<input type="text" '+ this.calculateInputSize() +' value="'+this.formatDate( this.options.date ) +'" data-toggle="dropdown">';
			if( !!this.options.createInput.dropDownBtn ) {
				dropdownHtml = dropdownHtml + '<button type="button" class="btn" data-toggle="dropdown"><span class="caret"></span></button>';
			}
			dropdownHtml = dropdownHtml + '</div>';

			return '<div class="dropdowndatepicker dropdown">' + dropdownHtml + '</div>';
		},

		calculateInputSize: function( options ) {
			if( !!parseInt( this.options.createInput.inputSize, 10 ) ) {
				return 'style="width:'+ this.options.createInput.inputSize +'px"';
			} else {
				options = ( !!options ) ? " " + options.join(' ') : '';
				return 'class="' + this.options.createInput.inputSize + options + '"';
			}

		},

		insertDateIntoInput: function( date ) {
			var displayDate;
			if( !!date ) {
				// came from an update on the calendar
				displayDate = date;
			} else {
				// was set at initialization
				displayDate = this.options.date;
			}
			this.$element.find('input[type="text"]').val( this.formatDate( displayDate ) );
		},

		initializeCalendarElements: function() {
			this.$calendar     = this.$element.find('div.calendar');
			this.$header       = this.$calendar.children().eq(0);
			this.$labelDiv     = this.$header.children().eq(2);
			this.$view         = this.$calendar.children().eq(1);
			this.$monthsView   = this.$calendar.children().eq(2);
			this.$yearsView    = this.$calendar.children().eq(3);
			this.$weekdaysDiv  = this.$view.children().eq(0);
			this.$lastMonthDiv = this.$view.children().eq(1);
			this.$thisMonthDiv = this.$view.children().eq(2);
			this.$nextMonthDiv = this.$view.children().eq(3);
			this.$footer       = this.$calendar.children().eq(4);
		},

		addBindings: function() {
			this.$calendar.on( 'click', $.proxy( this.emptySpace, this) );

			this.$header.find( '.left' ).on( 'click', $.proxy( this.previous, this ) );
			this.$header.find( '.right' ).on( 'click', $.proxy( this.next, this ) );
			this.$header.find( '.center' ).on( 'click', $.proxy( this.toggleMonthYearPicker, this ) );

			this.$lastMonthDiv.find( 'div' ).on( 'click', $.proxy( this.previousSet , this ) );
			this.$thisMonthDiv.find( 'div' ).on( 'click', $.proxy( this.select , this ) );
			this.$nextMonthDiv.find( 'div' ).on( 'click', $.proxy( this.nextSet , this ) );

			this.$monthsView.find( 'div' ).on( 'click', $.proxy( this.pickMonth, this ) );
			this.$yearsView.find( 'div' ).on( 'click', $.proxy( this.pickYear, this ) );
			this.$footer.find( '.center' ).on( 'click', $.proxy( this.today, this ) );
		},

		padTwo: function( value ) {
			var s = '0' + value;
			return s.substr( s.length - 2 );
		}
	};


	// DATEPICKER PLUGIN DEFINITION

	$.fn.datepicker = function (option) {
		return this.each(function () {
			var $this = $( this );
			var data = $this.data( 'datepicker' );
			var options = typeof option === 'object' && option;

			if( !data ) {
				$this.data('datepicker', (data = new Datepicker( this, options ) ) );
			}
			if( typeof option === 'string' ) {
				data[ option ]();
			}
		});
	};

	$.fn.datepicker.defaults = {
		date: new Date(),
		createInput: false,
		dropdownWidth: 170,
		restrictDateSelection: true,
		formatDate: function( date ) {
			// this.pad to is function on extension
			return  this.padTwo( date.getUTCMonth() + 1 ) + '-' + this.padTwo( date.getUTCDate() ) + '-' + date.getUTCFullYear();
		}
	};

	$.fn.datepicker.Constructor = Datepicker;

	$.fn.datepicker.noConflict = function () {
		$.fn.Datepicker = old;
		return this;
	};

});
