/*
 * Fuel UX Datepicker
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the BSD New license.
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

	var INVALID_DATE = 'Invalid Date';
	var MOMENT_NOT_AVAILABLE = 'moment.js is not available so you cannot use this function';

	var datepickerStack = [];
	var moment = false;
	var old = $.fn.datepicker;
	var requestedMoment = false;

	var runStack = function(){
		var i, l;
		requestedMoment = true;
		for(i=0,l=datepickerStack.length; i<l; i++){
			datepickerStack[i].init.call(datepickerStack[i].scope);
		}
		datepickerStack = [];
	};

	//only load moment if it's there. otherwise we'll look for it in window.moment
	if(typeof define==='function' && define.amd){	//check if AMD is available
		require(['moment'], function(amdMoment){
			moment = amdMoment;
			runStack();
		}, function(err){
			var failedId = err.requireModules && err.requireModules[0];
			if(failedId==='moment'){
				runStack();
			}
		});
	}else{
		runStack();
	}

	// DATEPICKER CONSTRUCTOR AND PROTOTYPE

	var Datepicker = function (element, options) {
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
		this.formatDate = this.options.formatDate || this.formatDate;
		this.inputValue = null;
		this.moment = false;
		this.momentFormat = null;
		this.parseDate = this.options.parseDate || this.parseDate;
		this.preventBlurHide = false;
		this.restricted = this.options.restricted || [];
		this.restrictedParsed = [];
		this.restrictedText = this.options.restrictedText;
		this.sameYearOnly = this.options.sameYearOnly;
		this.selectedDate = null;
		this.yearRestriction = null;

		this.$calendar.find('.datepicker-today').on('click.fu.datepicker', $.proxy(this.todayClicked, this));
		this.$days.on('click.fu.datepicker', 'tr td button', $.proxy(this.dateClicked, this));
		this.$element.find('.dropdown-menu').on('mousedown.fu.datepicker', $.proxy(this.dropdownMousedown, this));
		this.$header.find('.next').on('click.fu.datepicker', $.proxy(this.next, this));
		this.$header.find('.prev').on('click.fu.datepicker', $.proxy(this.prev, this));
		this.$headerTitle.on('click.fu.datepicker', $.proxy(this.titleClicked, this));
		this.$input.on('blur.fu.datepicker', $.proxy(this.inputBlurred, this));
		this.$input.on('focus.fu.datepicker', $.proxy(this.inputFocused, this));
		this.$wheels.find('.datepicker-wheels-back').on('click.fu.datepicker', $.proxy(this.backClicked, this));
		this.$wheels.find('.datepicker-wheels-select').on('click.fu.datepicker', $.proxy(this.selectClicked, this));
		this.$wheelsMonth.on('click.fu.datepicker', 'ul button', $.proxy(this.monthClicked, this));
		this.$wheelsYear.on('click.fu.datepicker', 'ul button', $.proxy(this.yearClicked, this));
		this.$wheelsYear.find('ul').on('scroll.fu.datepicker', $.proxy(this.onYearScroll, this));

		var init = function(){
			if(this.checkForMomentJS()){
				moment = moment || window.moment; // need to pull in the global moment if they didn't do it via require
				this.moment = true;
				this.momentFormat = this.options.momentConfig.format;
				this.setCulture(this.options.momentConfig.culture);
			}

			this.setRestrictedDates(this.restricted);
			if(!this.setDate(this.options.date)){
				this.$input.val('');
				this.inputValue = this.$input.val();
			}
			if(this.sameYearOnly){
				this.yearRestriction = (this.selectedDate) ? this.selectedDate.getFullYear() : new Date().getFullYear();
			}
		};

		if(requestedMoment){
			init.call(this);
		}else{
			datepickerStack.push({ init: init, scope: this });
		}
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		backClicked: function(){
			this.changeView('calendar');
		},

		changeView: function(view, date){
			if(view==='wheels'){
				this.$calendar.hide().attr('aria-hidden', 'true');
				this.$wheels.show().removeAttr('aria-hidden', '');
				if(date){
					this.renderWheel(date);
				}
			}else{
				this.$wheels.hide().attr('aria-hidden', 'true');
				this.$calendar.show().removeAttr('aria-hidden', '');
				if(date){
					this.renderMonth(date);
				}
			}
		},

		checkForMomentJS: function(){
			if(
				($.isFunction(window.moment) || (typeof moment!=='undefined' && $.isFunction(moment))) &&
				$.isPlainObject(this.options.momentConfig) &&
				this.options.momentConfig.culture && this.options.momentConfig.format
			){
				return true;
			}else{
				return false;
			}
		},

		dateClicked: function(e){
			var $td = $(e.currentTarget).parents('td:first');
			var date;

			if($td.hasClass('restricted')) {
				return;
			}

			this.$days.find('td.selected').removeClass('selected');
			$td.addClass('selected');

			date = new Date($td.attr('data-year'), $td.attr('data-month'), $td.attr('data-date'));
			this.selectedDate = date;
			this.$input.val(this.formatDate(date));
			this.inputValue = this.$input.val();
			this.$input.focus();
		},

		destroy: function(){
			this.$element.remove();
			// any external bindings
			// [none]

			// empty elements to return to original markup
			this.$days.find('tbody').empty();
			this.$wheelsYear.find('ul').empty();

			return this.$element[0].outerHTML;
		},

		disable: function(){
			this.$element.addClass('disabled');
			this.$element.find('input, button').attr( 'disabled', 'disabled' );
			this.$element.find('.input-group-btn').removeClass('open');
		},

		dropdownMousedown: function(){
			var self = this;
			this.preventBlurHide = true;
			setTimeout(function(){ self.preventBlurHide = false; },0);
		},

		enable: function() {
			this.$element.removeClass('disabled');
			this.$element.find('input, button').removeAttr('disabled');
		},

		formatDate: function(date){
			var padTwo = function(value){
				var s = '0' + value;
				return s.substr(s.length-2);
			};

			if(this.moment){
				return moment(date).format(this.momentFormat);
			}else{
				return padTwo(date.getMonth()+1) + '/' + padTwo(date.getDate()) + '/' + date.getFullYear();
			}
		},

		getCulture: function(){
			if(this.moment){
				return moment.lang();
			}else{
				throw MOMENT_NOT_AVAILABLE;
			}
		},

		getDate: function(){
			return (!this.selectedDate) ? new Date(NaN) : this.selectedDate;
		},

		getFormat: function(){
			if(this.moment){
				return this.momentFormat;
			}else{
				throw MOMENT_NOT_AVAILABLE;
			}
		},

		getFormattedDate: function(){
			return (!this.selectedDate) ? INVALID_DATE : this.formatDate(this.selectedDate);
		},

		getRestrictedDates: function(){
			return this.restricted;
		},

		inputBlurred: function(e){
			var inputVal = this.$input.val();
			var date;
			if(inputVal!==this.inputValue){
				date = this.setDate(inputVal);
				if(date===null){
					this.$element.trigger('inputParsingFailed.fu.datepicker', inputVal);
				}else if(date===false){
					this.$element.trigger('inputRestrictedDate.fu.datepicker', date);
				}else{
					this.$element.trigger('changed.fu.datepicker', date);
				}
			}
			if(!this.preventBlurHide){
				this.$element.find('.input-group-btn').removeClass('open');
			}
		},

		inputFocused: function(e){
			this.$element.find('.input-group-btn').addClass('open');
		},

		isInvalidDate: function(date){
			var dateString = date.toString();
			if(dateString===INVALID_DATE || dateString==='NaN'){
				return true;
			}
			return false;
		},

		isRestricted: function(date, month, year){
			var restricted = this.restrictedParsed;
			var i, from, l, to;

			if(this.sameYearOnly && this.yearRestriction!==null && year!==this.yearRestriction){
				return true;
			}
			for(i=0,l=restricted.length; i<l; i++){
				from = restricted[i].from;
				to = restricted[i].to;
				if(
					(year>from.year || (year===from.year && month>from.month) || (year===from.year && month===from.month && date>=from.date)) &&
					(year<to.year || (year===to.year && month<to.month) || (year===to.year && month===to.month && date<=to.date))
				){
					return true;
				}
			}

			return false;
		},

		monthClicked: function(e){
			this.$wheelsMonth.find('.selected').removeClass('selected');
			$(e.currentTarget).parent().addClass('selected');
		},

		next: function(){
			var month = this.$headerTitle.attr('data-month');
			var year = this.$headerTitle.attr('data-year');
			month++;
			if(month>11){
				if(this.sameYearOnly){
					return;
				}
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
					$yearUl.prepend('<li data-year="' + i + '"><button type="button">' + i + '</button></li>');
				}
				this.artificialScrolling = true;
				$yearUl.scrollTop(($yearUl.get(0).scrollHeight-scrollHeight) + scrollTop);
				this.artificialScrolling = false;
			}else if(bottomPercentage>90){
				start = parseInt($yearUl.find('li:last').attr('data-year'), 10);
				for(i=(start+1); i<(start+11); i++){
					$yearUl.append('<li data-year="' + i + '"><button type="button">' + i + '</button></li>');
				}
			}
		},

		//some code ripped from http://stackoverflow.com/questions/2182246/javascript-dates-in-ie-nan-firefox-chrome-ok
		parseDate: function(date) {
			var self = this;
			var dt, isoExp, momentParse, month, parts, use;

			if(date){
				if(this.moment){	//if we have moment, use that to parse the dates
					momentParse = function(type, d){
						d = (type==='b') ? moment(d, self.momentFormat) : moment(d);
						return (d.isValid()===true) ? d.toDate() : new Date(NaN);
					};
					use = (typeof(date)==='string') ? ['b', 'a'] : ['a', 'b'];
					dt = momentParse(use[0], date);
					if(!this.isInvalidDate(dt)){
						return dt;
					}else{
						dt = momentParse(use[1], date);
						if(!this.isInvalidDate(dt)){
							return dt;
						}
					}
				}else{	//if moment isn't present, use previous date parsing strategy
					if(typeof(date)==='string'){
						dt = new Date(Date.parse(date));
						if(!this.isInvalidDate(dt)){
							return dt;
						}else{
							date = date.split('T')[0];
							isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/;
							parts = isoExp.exec(date);
							if(parts){
								month = parseInt(parts[2],10);
								dt = new Date(parts[1], month - 1, parts[3]);
								if(month===(dt.getMonth() + 1)){
									return dt;
								}
							}
						}
					}else{
						dt = new Date(date);
						if(!this.isInvalidDate(dt)){
							return dt;
						}
					}
				}
			}
			return new Date(NaN);
		},

		prev: function(){
			var month = this.$headerTitle.attr('data-month');
			var year = this.$headerTitle.attr('data-year');
			month--;
			if(month<0){
				if(this.sameYearOnly){
					return;
				}
				month = 11;
				year--;
			}
			this.renderMonth(new Date(year, month, 1));
		},

		renderMonth: function(date){
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
			var selected = this.selectedDate;
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
			$month.find('span[data-month="' + month + '"]').addClass('current');
			this.$headerTitle.find('.year').text(year);
			this.$headerTitle.attr({
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
					$td = $('<td><span><button type="button" class="datepicker-date">' + curDate + '</button></span></td>');
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

					$td.attr({ 'data-date': curDate, 'data-month': curMonth, 'data-year': curYear });
					if(curYear===nowYear && curMonth===nowMonth && curDate===nowDate){
						$td.addClass('current-day');
					}else if(curYear<nowYear || (curYear===nowYear && curMonth<nowMonth) ||
						(curYear===nowYear && curMonth===nowMonth && curDate<nowDate)){
						$td.addClass('past');
						if(!this.options.allowPastDates){
							$td.addClass('restricted').attr('title', this.restrictedText);
						}
					}
					if(this.isRestricted(curDate, curMonth, curYear)){
						$td.addClass('restricted').attr('title', this.restrictedText);
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

			if(this.sameYearOnly){
				this.$wheelsMonth.addClass('full');
				this.$wheelsYear.addClass('hide');
			}else{
				this.$wheelsMonth.removeClass('full');
				this.$wheelsYear.removeClass('hide');
			}

			$monthUl.find('.selected').removeClass('selected');
			$monthSelected = $monthUl.find('li[data-month="' + month + '"]');
			$monthSelected.addClass('selected');
			$monthUl.scrollTop($monthUl.scrollTop() + ($monthSelected.position().top - $monthUl.outerHeight()/2 - $monthSelected.outerHeight(true)/2));

			$yearUl.empty();
			for(i=(year-10); i<(year+11); i++){
				$yearUl.append('<li data-year="' + i + '"><button type="button">' + i + '</button></li>');
			}
			$yearSelected = $yearUl.find('li[data-year="' + year + '"]');
			$yearSelected.addClass('selected');
			this.artificialScrolling = true;
			$yearUl.scrollTop($yearUl.scrollTop() + ($yearSelected.position().top - $yearUl.outerHeight()/2 - $yearSelected.outerHeight(true)/2));
			this.artificialScrolling = false;
			$monthSelected.find('button').focus();
		},

		selectClicked: function(){
			var month = this.$wheelsMonth.find('.selected').attr('data-month');
			var year = this.$wheelsYear.find('.selected').attr('data-year');
			this.changeView('calendar', new Date(year, month, 1));
		},

		setCulture: function(cultureCode){
			if(!cultureCode){ return false; }
			if(this.moment){
				moment.lang(cultureCode);
			}else{
				throw MOMENT_NOT_AVAILABLE;
			}
		},

		setDate: function(date){
			var parsed = this.parseDate(date);
			if(!this.isInvalidDate(parsed)){
				if(!this.isRestricted(parsed.getDate(), parsed.getMonth(), parsed.getFullYear())){
					this.selectedDate = parsed;
					this.renderMonth(parsed);
					this.$input.val(this.formatDate(parsed));
				}else{
					this.selectedDate = false;
					this.renderMonth();
				}
			}else{
				this.selectedDate = null;
				this.renderMonth();
			}
			this.inputValue = this.$input.val();
			return this.selectedDate;
		},

		setFormat: function(format){
			if(!format){ return false; }
			if(this.moment){
				this.momentFormat = format;
			}else{
				throw MOMENT_NOT_AVAILABLE;
			}
		},

		setRestrictedDates: function(restricted){
			var parsed = [];
			var self = this;
			var i, l;

			var parseItem = function(val){
				if(val===-Infinity){
					return { date: -Infinity, month: -Infinity, year: -Infinity };
				}else if(val===Infinity){
					return { date: Infinity, month: Infinity, year: Infinity };
				}else{
					val = self.parseDate(val);
					return { date: val.getDate(), month: val.getMonth(), year: val.getFullYear() };
				}
			};

			this.restricted = restricted;
			for(i=0,l=restricted.length; i<l; i++){
				parsed.push({ from: parseItem(restricted[i].from), to: parseItem(restricted[i].to) });
			}
			this.restrictedParsed = parsed;
		},

		titleClicked: function(e){
			this.changeView('wheels', new Date(this.$headerTitle.attr('data-year'), this.$headerTitle.attr('data-month'), 1));
		},

		todayClicked: function(e){
			var date = new Date();

			if((date.getMonth()+'')!==this.$headerTitle.attr('data-month') || (date.getFullYear()+'')!==this.$headerTitle.attr('data-year')){
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
			var data    = $this.data( 'fu.datepicker' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('fu.datepicker', (data = new Datepicker( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.datepicker.defaults = {
		allowPastDates: false,
		date: new Date(),
		formatDate: null,
		momentConfig: {
			culture: 'en',
			format: 'L'	// more formats can be found here http://momentjs.com/docs/#/customization/long-date-formats/.
		},
		parseDate: null,
		restricted: [],	//accepts an array of objects formatted as so: { from: {{date}}, to: {{date}} }  (ex: [ { from: new Date('12/11/2014'), to: new Date('03/31/2015') } ])
		restrictedText: 'Restricted',
		sameYearOnly: false
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

	//used to prevent the dropdown from closing when clicking within it's bounds
	$(document).on('click.fu.datepicker.data-api', '.datepicker .dropdown-menu', function (e) {
		var $target = $(e.target);
		if(!$target.is('.datepicker-date') || $target.closest('.restricted').length){
			e.stopPropagation();
		}
	});

	//used to prevent the dropdown from closing when clicking on the input
	$(document).on('click.fu.datepicker.data-api', '.datepicker input', function(e){
		e.stopPropagation();
	});

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
