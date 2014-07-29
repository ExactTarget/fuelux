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
		var parsed;

		this.$element = $(element);
		this.options = $.extend(true, {}, $.fn.datepicker.defaults, options);

		this.$calendar = this.$element.find('.datepicker-calendar');
		this.$days = this.$calendar.find('.datepicker-calendar-days');
		this.$header = this.$calendar.find('.datepicker-calendar-header');
		this.$headerTitle = this.$header.find('.title');
		this.$input = this.$element.find('input');
		this.$wheels = this.$element.find('.datepicker-wheels');
		this.$wheelsMonth = this.$element.find('.datepicker-wheels-month');
		this.$wheelsYear = this.$element.find('.datepicker-wheels-year');

		this.artificialScrolling = false;
		this.formatDate    = this.options.formatDate || this.formatDate;
		this.parseDate     = this.options.parseDate || this.parseDate;

		// moment set up for parsing input dates
		if(this.checkForMomentJS()){
			moment = moment || window.moment; // need to pull in the global moment if they didn't do it via require
			this.moment = true;
			this.momentFormat = this.options.momentConfig.formatCode;
			//this.setCulture(this.options.momentConfig.culture);
		}

		this.$calendar.find('.datepicker-today').on('click', $.proxy(this.todayClicked, this));
		this.$header.find('.next').on('click', $.proxy(this.next, this));
		this.$header.find('.prev').on('click', $.proxy(this.prev, this));
		this.$headerTitle.find('a').on('click', $.proxy(this.titleClicked, this));
		this.$wheels.find('.datepicker-wheels-back').on('click', $.proxy(this.backClicked, this));
		this.$wheels.find('.datepicker-wheels-select').on('click', $.proxy(this.selectClicked, this));
		this.$wheelsMonth.on('click', 'ul a', $.proxy(this.monthClicked, this));
		this.$wheelsYear.on('click', 'ul a', $.proxy(this.yearClicked, this));
		this.$wheelsYear.find('ul').on('scroll', $.proxy(this.onYearScroll, this));

		parsed = this.parseDate(this.options.date);
		if(this.options.date && parsed){
			this.renderMonth(parsed, parsed);
			this.$input.val(this.formatDate(parsed));
		}else{
			this.renderMonth();
		}
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		backClicked: function(){
			this.changeView('calendar');
		},

		changeView: function(view, date){
			if(view==='wheels'){
				this.$calendar.hide();
				this.$wheels.show();
				if(date){
					this.renderWheel(date);
				}
			}else{
				this.$wheels.hide();
				this.$calendar.show();
				if(date){
					this.renderMonth(date);
				}
			}

		},

		checkForMomentJS: function(){
			// this function is ran on initialization to determine if moment.js is available
			if(
				($.isFunction(window.moment) || (typeof moment!=='undefined' && $.isFunction(moment))) &&
				$.isPlainObject(this.options.momentConfig) &&
				this.options.momentConfig.culture && this.options.momentConfig.formatCode
			){
				return true;
			}else{
				return false;
			}
		},

		formatDate: function(date){
			var padTwo = function(value){
				var s = '0' + value;
				return s.substr(s.length-2);
			};

			// if we have moment available use it to format dates. otherwise use default
			if(this.moment){
				return moment(date).format(this.momentFormat);
			}else{
				return padTwo(date.getMonth()+1) + '-' + padTwo(date.getDate()) + '-' + date.getFullYear();
			}
		},

		monthClicked: function(e){
			this.$wheelsMonth.find('.selected').removeClass('selected');
			$(e.currentTarget).parent().addClass('selected');
		},

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

		onYearScroll: function(e){
			if(this.artificialScrolling){ return; }

			var $yearUl = $(e.currentTarget);
			var height = ($yearUl.css('box-sizing')==='border-box') ? $yearUl.outerHeight() : $yearUl.height();
			var scrollHeight = $yearUl.get(0).scrollHeight;
			var scrollTop = $yearUl.scrollTop();
			var bottomPercentage = (height / (scrollHeight - scrollTop)) * 100;
			var topPercentage = (scrollTop / scrollHeight) * 100;
			var i, start;

			if(topPercentage<5) {
				start = parseInt($yearUl.find('li:first').attr('data-year'), 10);
				for (i=(start-1); i >(start-11); i--) {
					$yearUl.prepend('<li data-year="' + i + '"><a href="#">' + i + '</a></li>');
				}
				this.artificialScrolling = true;
				$yearUl.scrollTop(($yearUl.get(0).scrollHeight-scrollHeight) + scrollTop);
				this.artificialScrolling = false;
			}else if(bottomPercentage>90){
				start = parseInt($yearUl.find('li:last').attr('data-year'), 10);
				for(i=(start+1); i<(start+11); i++){
					$yearUl.append('<li data-year="' + i + '"><a href="#">' + i + '</a></li>');
				}
			}
		},

		//some code ripped from http://stackoverflow.com/questions/2182246/javascript-dates-in-ie-nan-firefox-chrome-ok
		parseDate: function(date) {
			var invalid = 'Invalid Date';
			var dt, isoExp, month, parts;
			// if we have moment, use that to parse the dates
			if(this.moment){
				dt = moment(date).toDate();
				if(dt.toString()!==invalid){
					return dt;
				}
			}else{	// if moment isn't present, use previous date parsing strategy
				if(date && typeof(date)==='string'){
					dt = new Date(Date.parse(date));
					if(dt.toString() !== invalid){
						return dt;
					}else{
						date = date.split('T')[0];
						isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/;
						parts = isoExp.exec(date);

						if(parts){
							month = ~~parts[2];
							dt = new Date(parts[1], month - 1, parts[3]);
							if(month===(dt.getMonth() + 1)){
								return dt;
							}
						}
					}
				}else{
					dt = new Date(date);
					if(dt.toString()!==invalid){
						return dt;
					}
				}
			}
			return false;
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

		renderMonth: function(date, selected){
			date = date || new Date();

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

			if(selected){
				selected = {
					date: selected.getDate(),
					month: selected.getMonth(),
					year: selected.getFullYear()
				};
			}

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
			rows = (lastDate<=(35-firstDay)) ? 5 : 6;
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
					if(selected && curYear===selected.year && curMonth===selected.month && curDate===selected.date){
						$td.addClass('selected');
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
		},

		renderWheel: function(date){
			var month = date.getMonth();
			var $monthUl = this.$wheelsMonth.find('ul');
			var year = date.getFullYear();
			var $yearUl = this.$wheelsYear.find('ul');
			var i, $monthSelected, $yearSelected;

			$monthUl.find('.selected').removeClass('selected');
			$monthSelected = $monthUl.find('li[data-month="' + month + '"]');
			$monthSelected.addClass('selected');
			$monthUl.scrollTop($monthUl.scrollTop() + ($monthSelected.position().top - $monthUl.outerHeight()/2 - $monthSelected.outerHeight(true)/2));

			$yearUl.empty();
			for(i=(year-10); i<(year+11); i++){
				$yearUl.append('<li data-year="' + i + '"><a href="#">' + i + '</a></li>');
			}
			$yearSelected = $yearUl.find('li[data-year="' + year + '"]');
			$yearSelected.addClass('selected');
			this.artificialScrolling = true;
			$yearUl.scrollTop($yearUl.scrollTop() + ($yearSelected.position().top - $yearUl.outerHeight()/2 - $yearSelected.outerHeight(true)/2));
			this.artificialScrolling = false;
		},

		selectClicked: function(){
			var month = this.$wheelsMonth.find('.selected').attr('data-month');
			var year = this.$wheelsYear.find('.selected').attr('data-year');
			this.changeView('calendar', new Date(year, month, 1));
		},

		titleClicked: function(e){
			var $a = $(e.currentTarget);
			e.preventDefault();
			this.changeView('wheels', new Date($a.attr('data-year'), $a.attr('data-month'), 1));
		},

		todayClicked: function(){
			var $a = this.$headerTitle.find('a');
			var date = new Date();

			if((date.getMonth()+'')!==$a.attr('data-month') || (date.getFullYear()+'')!==$a.attr('data-year')){
				this.renderMonth(date);
			}
		},

		yearClicked: function(e){
			this.$wheelsYear.find('.selected').removeClass('selected');
			$(e.currentTarget).parent().addClass('selected');
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
		date: new Date(),
		formatDate: null,
		parseDate: null
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

	//this is used to prevent the dropdown from closing when clicking within it's bounds
	$(document).on('click.fu.datepicker.data-api', '.datepicker-dropdown', function (e) { e.stopPropagation() });

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
