/*
 * Fuel UX Datepicker
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old    = $.fn.datepicker;
	var moment = false;

	// only load moment if it's there. otherwise we'll look for it in window.moment
	// you need to make sure moment is loaded before the rest of this module

	// check if AMD is available
	if(typeof define === 'function' && define.amd) {
		require(['moment'], function( amdMoment ) {
			moment = amdMoment;
		}, function( err ) {
			var failedId = err.requireModules && err.requireModules[0];
			if (failedId === 'moment') {
				// do nothing cause that's the point of progressive enhancement
				if( typeof window.console !== 'undefined' ) {
					if( window.navigator.userAgent.search( 'PhantomJS' ) < 0 ) {
						// don't show this in phantomjs tests
						//window.console.log( "Don't worry if you're seeing a 404 that's looking for moment.js. The Fuel UX Datepicker is trying to use moment.js to give you extra features." );
						//window.console.log( "Checkout the Fuel UX docs (http://exacttarget.github.io/fuelux/#datepicker) to see how to integrate moment.js for more features" );
					}
				}
			}
		});
	}

	// DATEPICKER CONSTRUCTOR AND PROTOTYPE

	var Datepicker = function (element, options) {
		this.$element = $(element);

		this.options = $.extend(true, {}, $.fn.datepicker.defaults, options);

		this.$days = this.$element.find('.datepicker-calendar-days');
		this.$header = this.$element.find('.datepicker-calendar-header');
		this.$headerTitle = this.$header.find('.title');

		this.$header.find('.next').on('click', $.proxy(this.next, this));
		this.$header.find('.prev').on('click', $.proxy(this.prev, this))

		this.renderMonth(this.options.date);
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		next: function(){
			var $a = this.$headerTitle.find('a');
			var month = $a.attr('data-month');
			var year = $a.attr('data-year');
			month++;
			if(month>11){
				month = 0;
				year++;
			}
			this.renderMonth(new Date(year, month, 1));
		},

		prev: function(){
			var $a = this.$headerTitle.find('a');
			var month = $a.attr('data-month');
			var year = $a.attr('data-year');
			month--;
			if(month<0){
				month = 11;
				year--;
			}
			this.renderMonth(new Date(year, month, 1));
		},

		renderMonth: function(date){
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
			var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			var lastMonthDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
			var $month = this.$headerTitle.find('.month');
			var month = date.getMonth();
			var now = new Date();
			var nowDate = now.getDate();
			var nowMonth = now.getMonth();
			var nowYear = now.getFullYear();
			var $tbody = this.$days.find('tbody');
			var year = date.getFullYear();
			var curDate, curMonth, curYear, i, j, rows, stage, $td, $tr;

			$month.find('.current').removeClass('current');
			$month.find('li[data-month="' + month + '"]').addClass('current');
			this.$headerTitle.find('.year').text(year);
			this.$headerTitle.find('a').attr({
				'data-month': month,
				'data-year': year
			});

			$tbody.empty();
			if(firstDay!==0){
				curDate = lastMonthDate - firstDay + 1;
				stage = -1;
			}else{
				curDate = 1;
				stage = 0;
			}
			rows = (lastDate<=(35-firstDay)) ? 5 : 6;	//TODO: this seems jarring. ask about it
			for(i=0; i<rows; i++){
				$tr = $('<tr></tr>');
				for(j=0; j<7; j++){
					$td = $('<td><span><a href="#">' + curDate + '</a></span></td>');
					if(stage===-1){
						$td.addClass('last-month');
					}else if(stage===1){
						$td.addClass('next-month');
					}

					curMonth = month + stage;
					curYear = year;
					if(curMonth<0){
						curMonth = 11;
						curYear--;
					}else if(curMonth>11){
						curMonth = 0;
						curYear++;
					}

					$td.attr('data-date', curYear + '-' + curMonth + '-' + curDate);
					if(curYear===nowYear && curMonth===nowMonth && curDate===nowDate){
						$td.addClass('current-day');
					}else if(curYear<nowYear || (curYear===nowYear && curMonth<nowMonth) ||
						(curYear===nowYear && curMonth===nowMonth && curDate<nowDate)){
						$td.addClass('past');
					}

					curDate++;
					if(stage===-1 && curDate>lastMonthDate){
						curDate = 1;
						stage = 0;
					}else if(stage===0 && curDate>lastDate){
						curDate = 1;
						stage = 1;
					}

					$tr.append($td);
				}
				$tbody.append($tr);
			}
		}
	};


	// DATEPICKER PLUGIN DEFINITION

	$.fn.datepicker = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'datepicker' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('datepicker', (data = new Datepicker( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.datepicker.defaults = {
		date: new Date()
	};

	$.fn.datepicker.Constructor = Datepicker;

	$.fn.datepicker.noConflict = function () {
		$.fn.datepicker = old;
		return this;
	};

	// DATA-API

	$(document).on('mousedown.fu.datepicker.data-api', '[data-initialize=datepicker]', function (e) {
		var $control = $(e.target).closest('.datepicker');
		if(!$control.data('datepicker')) {
			$control.datepicker($control.data());
		}
	});

	//this is used to prevent the dropdown from closing when clicking within the calendar
	$(document).on('click.fu.datepicker.data-api', '.datepicker-calendar', function (e) { e.stopPropagation() });

	$(function () {
		$('[data-initialize=datepicker]').each(function () {
			var $this = $(this);
			if($this.data('datepicker')){ return; }
			$this.datepicker($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
