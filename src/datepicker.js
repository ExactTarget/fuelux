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
		console.log( element );
		this.$element      = $(element);
		this.options       = $.extend(true, {}, $.fn.datepicker.defaults, options);

		this.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
		this.done = false;
		this.callbacks = [];
		this.scope = {
			date: null,
			size: 200,
			min: null,
			max: null,
			range: null,
			weekdays: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			viewDate: new Date(),
			showDays: true,
			showMonths: false,
			showYears: false,
			months: [
				{ abbreviation: this.monthNames[0], 'class': '', number: 0 },
				{ abbreviation: this.monthNames[1], 'class': '', number: 1 },
				{ abbreviation: this.monthNames[2], 'class': '', number: 2 },
				{ abbreviation: this.monthNames[3], 'class': '', number: 3 },
				{ abbreviation: this.monthNames[4], 'class': '', number: 4 },
				{ abbreviation: this.monthNames[5], 'class': '', number: 5 },
				{ abbreviation: this.monthNames[6], 'class': '', number: 6 },
				{ abbreviation: this.monthNames[7], 'class': '', number: 7 },
				{ abbreviation: this.monthNames[8], 'class': '', number: 8 },
				{ abbreviation: this.monthNames[9], 'class': '', number: 9 },
				{ abbreviation: this.monthNames[10], 'class': '', number: 10 },
				{ abbreviation: this.monthNames[11], 'class': '', number: 11 }
			],
			restrictLastMonth: false,
			restrictNextMonth: false
		};

		this.importOptions();

		if( !!this.options.createInput ) {
			this.renderInput();
		} else {
			this.render({ addDateToInput: true });
		}
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		repeat: function( head, collection, iterator, tail) {
			var value = head;
			for (var i = 0; i < collection.length; i++) {
				value += iterator(collection[i]);
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

			for (var i = 0; i < years.length; i++) {
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
				this.callbacks[ i ]( this.scope.date );
			}
		},

		showView: function( view ) {
			if( view === 1 ) {
				this.scope.showDays   = true;
				this.scope.showMonths = false;
				this.scope.showYears  = false;
			} else if( view === 2 ) {
				this.scope.showDays   = false;
				this.scope.showMonths = true;
				this.scope.showYears  = false;
			} else if( view === 3 ) {
				this.scope.showDays   = false;
				this.scope.showMonths = false;
				this.scope.showYears  = true;
			}
		},

		updateCalendarData: function() {
			var viewedMonth            = this.scope.viewDate.getUTCMonth();
			var viewedYear             = this.scope.viewDate.getUTCFullYear();
			var selectedDay            = this.scope.stagedDate.getUTCDate();
			var selectedMonth          = this.scope.stagedDate.getUTCMonth();
			var selectedYear           = this.scope.stagedDate.getUTCFullYear();
			var firstDayOfMonthWeekday = new Date( viewedYear, viewedMonth, 1 ).getUTCDay();
			var lastDayOfMonth         = this.getDaysInMonth( viewedMonth, viewedYear );
			var lastDayOfLastMonth     = this.getDaysInMonth( viewedMonth - 1, viewedYear );

			if( firstDayOfMonthWeekday === 0 ) {
				firstDayOfMonthWeekday = 7;
			}

			var addToEnd = ( 42 - lastDayOfMonth ) - firstDayOfMonthWeekday;

			this.scope.daysOfLastMonth = this.range(lastDayOfLastMonth - firstDayOfMonthWeekday + 1, lastDayOfLastMonth + 1);
			this.scope.daysOfNextMonth = this.range(1, addToEnd + 1);

			var now                  = new Date();
			var currentDay           = now.getUTCDate();
			var currentMonth         = now.getUTCMonth();
			var currentYear          = now.getUTCFullYear();
			var viewingCurrentMonth  = viewedMonth === currentMonth;
			var viewingCurrentYear   = viewedYear === currentYear;
			var viewingSelectedMonth = viewedMonth === selectedMonth;
			var viewingSelectedYear  = viewedYear === selectedYear;

			var daysOfThisMonth = this.range( 1, lastDayOfMonth + 1 );
			this.scope.daysOfThisMonth = [];

			for (var i = 0; i < daysOfThisMonth.length; i++) {

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
				if( dt <= this.scope.min || dt >= this.scope.max ) {
					weekDayClass += ' restrict';
					if( daysOfThisMonth[ i ] === 1 ) {
						this.scope.restrictLastMonth = true;
					}
					if( daysOfThisMonth.length - 1 === i ) {
						this.scope.restrictNextMonth = true;
					}
				} else {
					if( daysOfThisMonth[i] === 1 ) {
						this.scope.restrictLastMonth = false;
					}
					if( daysOfThisMonth.length - 1 === i ) {
						this.scope.restrictNextMonth = false;
					}
				}

				if( this.scope.range && ( ( dt <= this.scope.range && dt >= this.scope.date ) || ( dt >= this.scope.range && dt <= this.scope.date ) ) ) {
					weekDayClass += ' range';
				}

				this.scope.daysOfThisMonth[ this.scope.daysOfThisMonth.length ] = {
					'number': daysOfThisMonth[ i ],
					'class' : weekDayClass
				};
			}

			var daysInMonth = this.getDaysInMonth( this.scope.min.getUTCFullYear(), this.scope.min.getUTCMonth() );
			for( var j = 0; j < this.scope.months.length; j++ ) {

				this.scope.months[ j ][ 'class' ] = '';
				if( viewingCurrentYear && j === currentMonth ) {
					this.scope.months[ j ][ 'class' ] += ' today';
				}
				if( i === selectedMonth && viewingSelectedYear ) {
					this.scope.months[ j ][ 'class' ] += ' selected';
				}

				var minDt = new Date( viewedYear, j, daysInMonth, 23, 59, 59, 999 );
				var maxDt = new Date( viewedYear, j, 0, 0, 0, 0, 0 );
				if( minDt <= this.scope.min || maxDt >= this.scope.max ) {
					this.scope.months[ j ][ 'class' ] += ' restrict';
				}
			}

			this.scope.years = this.yearRange( this.scope.viewDate);
			daysInMonth = this.getDaysInMonth( this.scope.min.getUTCFullYear(), 11 );

			for( var z = 0; z < this.scope.years.length; z++ ) {
				if( this.scope.years[ z ].number === currentYear ) {
					this.scope.years[ z ][ 'class' ] += ' today';
				}
				if( this.scope.years[ z ].number === selectedYear ) {
					this.scope.years[ z ][ 'class' ] += ' selected';
				}

				var minDt2 = new Date( this.scope.years[ z ].number, 11, daysInMonth, 23, 59, 59, 999);
				var maxDt2 = new Date( this.scope.years[ z ].number, 0, 0, 0, 0, 0, 0);
				if( minDt2 <= this.scope.min || maxDt2 >= this.scope.max ) {
					this.scope.years[ z ]['class'] += ' restrict';
				}
			}
		},

		updateCss: function() {
			this.scope.size = Math.max( this.scope.size || 0, 150 );
			while( this.scope.size % 7 !== 0 ) {
				this.scope.size++;
			}

			this.$view.css('width', this.scope.size + 'px' );
			this.$header.css('width', this.scope.size + 'px' );
			this.$labelDiv.css('width', ( this.scope.size - 60 ) + 'px' );
			this.$footer.css('width', this.scope.size + 'px' );
			var labelSize     = this.scope.size * 0.25;
			var paddingTop    = Math.round( ( this.scope.size - ( labelSize * 3 ) ) / 2 );
			var paddingBottom = paddingTop;
			while( paddingBottom + paddingTop + ( labelSize * 3 ) < this.scope.size ) {
				paddingBottom += 0.1;
			}
			while( paddingBottom + paddingTop + ( labelSize * 3 ) > this.scope.size ) {
				paddingBottom -= 0.1;
			}
			
			this.$calendar.css({
				'float': 'left'
			});

			this.$monthsView.css({
				'width': this.scope.size + 'px',
				'padding-top': paddingTop + 'px',
				'padding-bottom': paddingBottom + 'px'
			});

			this.$yearsView.css({
				'width': this.scope.size + 'px',
				'padding-top': paddingTop + 'px',
				'padding-bottom': paddingBottom + 'px'
			});

			var cellSize = Math.round( this.scope.size / 7.0 ) + 'px';
			this.applySize( this.$yearsView.children(), labelSize + 'px' );
			this.applySize( this.$monthsView.children(), labelSize + 'px' );
			this.applySize( this.$weekdaysDiv.children(), cellSize );
			this.applySize( this.$lastMonthDiv.children(), cellSize );
			this.applySize( this.$thisMonthDiv.children(), cellSize );
			this.applySize( this.$nextMonthDiv.children(), cellSize );
		},

		select: function( e ) {
			if( e.target.className.indexOf( 'restrict' ) > -1 ) {
				return this.killEvent(e);
			}

			this.scope.stagedDate = this.scope.viewDate;
			this.scope.stagedDate.setDate( parseInt( e.target.innerHTML, 10 ) );

			this.scope.date.setUTCFullYear( this.scope.stagedDate.getUTCFullYear() );
			this.scope.date.setUTCMonth( this.scope.stagedDate.getUTCMonth() );
			this.scope.date.setUTCDate( this.scope.stagedDate.getUTCDate() );
			this.insertDateIntoInput( this.scope.date );
			this.render();
			this.done = true;
			this.runCallbacks();
		},

		pickYear: function( e ) {
			var year = parseInt( $( e.target ).data( 'yearNumber' ), 10 );
			if( e.target.className.indexOf('restrict') > -1 ) {
				return this.killEvent(e);
			}

			this.scope.viewDate = new Date( year, this.scope.viewDate.getUTCMonth(), 1 );
			this.showView( 2 );
			this.render();

			return this.killEvent(e);
		},

		pickMonth: function( e ) {
			var month = parseInt( $(e.target).data( 'monthNumber' ), 10 );
			if( e.target.className.indexOf( 'restrict' ) > -1 ) {
				return this.killEvent(e);
			}

			this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear(), month, 1 );
			this.showView(1);
			this.render();

			return this.killEvent(e);
		},

		done: function() {
			this.scope.date.setUTCFullYear( this.scope.stagedDate.getUTCFullYear() );
			this.scope.date.setUTCMonth( this.scope.stagedDate.getUTCMonth() );
			this.scope.date.setUTCDate( this.scope.stagedDate.getUTCDate() );
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
			
			if( this.scope.showDays) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear(), this.scope.viewDate.getUTCMonth() - 1, 1 );
			} else if( this.scope.showMonths ) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear() - 1, this.scope.viewDate.getUTCMonth(), 1 );
			} else if( this.scope.showYears ) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear() - 10, this.scope.viewDate.getUTCMonth(), 1 );
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
			
			if( this.scope.showDays ) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear(), this.scope.viewDate.getUTCMonth() + 1, 1 );
			} else if( this.scope.showMonths ) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear() + 1, this.scope.viewDate.getUTCMonth(), 1 );
			} else if( this.scope.showYears ) {
				this.scope.viewDate = new Date( this.scope.viewDate.getUTCFullYear() + 10, this.scope.viewDate.getUTCMonth(), 1 );
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
			this.scope.viewDate = new Date();
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
			return this.monthNames[ this.scope.viewDate.getUTCMonth() ];
		},

		yearLabel: function() {
			return this.scope.viewDate.getUTCFullYear();
		},

		monthYearLabel: function() {
			var label;
			if( this.scope.showDays ) {
				label = this.monthLabel() + ' ' + this.yearLabel();
			} else if( this.scope.showMonths ) {
				label = this.yearLabel();
			} else if( this.scope.showYears ) {
				label = this.scope.years[ 0 ].number + ' - ' + this.scope.years[ this.scope.years.length - 1 ].number;
			}
			return label;
		},

		toggleMonthYearPicker: function( e ) {
			if( this.scope.showDays ) {
				this.showView(2);
			} else if( this.scope.showMonths ) {
				this.showView(3);
			} else if( this.scope.showYears ) {
				this.showView(1);
			}
			this.render();
			return this.killEvent( e );
		},

		renderCalendar: function() {
			var self = this;

			return '<div class="calendar">' +
				'<div class="header clearfix">' +
					'<div class="left hover"><div class="leftArrow"></div></div>' +
					'<div class="right hover"><div class="rightArrow"></div></div>' +
					'<div class="center hover">' + self.monthYearLabel() + '</div>' +
				'</div>' +
				'<div class="daysView" style="' + self.show( self.scope.showDays ) + '">' +

					self.repeat( '<div class="weekdays">', self.scope.weekdays,
						function( weekday ) {
							return '<div >' + weekday + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="lastmonth">', self.scope.daysOfLastMonth,
						function( day ) {
							var clazz = self.scope.restrictLastMonth ? 'restrict' : '';
							return '<div class="' + clazz + '">' + day + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="thismonth">', self.scope.daysOfThisMonth,
						function( day ) {
							return '<div class="' + day[ 'class' ] + '">' + day.number + '</div>';
						}, '</div>' ) +

					self.repeat( '<div class="nextmonth">', self.scope.daysOfNextMonth,
						function( day ) {
							var clazz = self.scope.restrictNextMonth ? 'restrict' : '';
							return '<div class="' + clazz + '">' + day + '</div>';
						}, '</div>' ) +
				'</div>' +

				self.repeat( '<div class="monthsView" style="' + self.show( self.scope.showMonths ) + '">', self.scope.months,
					function( month ) {
						return '<div data-month-number="' + month.number +
							'" class="' + month[ 'class' ] + '">' + month.abbreviation + '</div>';
					}, '</div>' ) +

				self.repeat( '<div class="yearsView" style="' + self.show( self.scope.showYears ) + '">', self.scope.years,
					function( year ) {
						return '<div data-year-number="' + year.number +
							'" class="' + year['class'] + '">' + year.number + '</div>';
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
			this.$element.html( this.renderInputHTML() );
			this.render();
		},

		renderInputHTML: function() {
			var dropdownHtml = '<div class="input-group">' +
						'<span class="input-group-btn dropdown">' +
							'<input type="text" readonly value="'+ this.formatDate( this.options.date ) +'" class="form-control input-small" data-toggle="dropdown">' +
							'<button class="btn btn-small btn-default" type="button" data-toggle="dropdown"><span class="caret"></span></button>' +
							'<div class="dropdown-menu replaceWithDatepicker"></div>' +
						'</span>' +
					'</div>';
			return '<div class="dropdowndatepicker">' + dropdownHtml + '</div>';
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

		importOptions: function() {
			var options = this.options || {};

			if( options.min ) {
				this.scope.min = options.min;
			} else {
				this.scope.min = new Date();
				this.scope.min.setUTCDate( this.scope.min.getUTCDate() - 1 );
			}

			this.scope.min.setHours( 0,0,0,0 );

			if( options.max ) {
				this.scope.max = options.max;
			} else {
				this.scope.max = new Date();
				this.scope.max.setUTCFullYear( this.scope.max.getUTCFullYear() + 10 );
			}

			this.scope.max.setHours( 23,59,59,999 );

			this.scope.range = options.range;

			this.scope.size = options.size ? options.size : 150;

			this.scope.date = options.date;
			this.scope.date.setHours( 0,0,0,0 );

			this.scope.viewDate = new Date( this.scope.date.valueOf() );
			this.scope.stagedDate = new Date( this.scope.date.valueOf() );
			this.scope.viewDate.setHours( 0,0,0,0 );
			this.scope.stagedDate.setHours( 0,0,0,0 );

			this.scope.years = this.yearRange( this.scope.viewDate );
			//wrapper = element; not sure what this translates to since we already have a wrapper
		},

		formatDate: function( date ) {
			return date.getUTCFullYear() + '-' + this.padTwo( date.getUTCMonth() + 1 ) + '-' + this.padTwo( date.getUTCDate() );
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
		callbacks: [],
		native: false,
		date: new Date(),
		createInput: false,
		size: 200
	};

	$.fn.datepicker.Constructor = Datepicker;

});
