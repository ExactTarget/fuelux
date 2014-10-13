/*
 * Fuel UX Scheduler
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
		define(['jquery', 'fuelux/combobox', 'fuelux/datepicker', 'fuelux/radio', 'fuelux/selectlist', 'fuelux/spinbox'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	if(!$.fn.combobox || !$.fn.datepicker || !$.fn.radio || !$.fn.selectlist || !$.fn.spinbox){
		throw new Error('Fuel UX scheduler control requires combobox, datepicker, radio, selectlist, and spinbox.');
	}
	// -- END UMD WRAPPER PREFACE --
		
	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.scheduler;

	// SCHEDULER CONSTRUCTOR AND PROTOTYPE

	var Scheduler = function (element, options) {
		var self = this;

		this.$element = $(element);
		this.options = $.extend({}, $.fn.scheduler.defaults, options);

		// cache elements
		this.$startDate = this.$element.find('.start-datetime .start-date');
		this.$startTime = this.$element.find('.start-datetime .start-time');

		this.$timeZone = this.$element.find('.timezone-container .timezone');

		this.$repeatIntervalPanel = this.$element.find('.repeat-every-panel');
		this.$repeatIntervalSelect = this.$element.find('.repeat-options');

		this.$repeatIntervalSpinbox = this.$element.find('.repeat-every');
		this.$repeatIntervalTxt = this.$element.find('.repeat-every-text');

		this.$end = this.$element.find('.repeat-end');
		this.$endSelect= this.$end.find('.end-options');
		this.$endAfter = this.$end.find('.end-after');
		this.$endDate = this.$end.find('.end-on-date');

		// panels
		this.$recurrencePanels = this.$element.find('.repeat-panel');


		this.$repeatIntervalSelect.selectlist();

		//initialize sub-controls
		this.$element.find('.selectlist').selectlist();
		this.$startDate.datepicker();
		this.$startTime.combobox();
		// init start time
		if(this.$startTime.find('input').val()===''){
			this.$startTime.combobox('selectByIndex', 0);
		}
		// every 0 days/hours doesn't make sense, change if not set
		if( this.$repeatIntervalSpinbox.find('input').val() === '0' ) {
			this.$repeatIntervalSpinbox.spinbox({ 'value': 1, 'min': 1 });
		}
		else {
			this.$repeatIntervalSpinbox.spinbox({ 'min': 1 });
		}
		this.$endAfter.spinbox({ 'value': 1, 'min': 1 });
		this.$endDate.datepicker();
		this.$element.find('.radio-custom').radio();

		// bind events: 'change' is a Bootstrap JS fired event
		this.$repeatIntervalSelect.on('changed.fu.selectlist', $.proxy(this.repeatIntervalSelectChanged, this));
		this.$endSelect.on('changed.fu.selectlist', $.proxy(this.endSelectChanged, this));
		this.$element.find('.repeat-days-of-the-week .btn-group .btn').on('change.fu.scheduler', function(e, data){self.changed(e, data, true); });
		this.$element.find('.combobox').on('changed.fu.combobox', $.proxy(this.changed, this));
		this.$element.find('.datepicker').on('changed.fu.datepicker', $.proxy(this.changed, this));
		this.$element.find('.selectlist').on('changed.fu.selectlist', $.proxy(this.changed, this));
		this.$element.find('.spinbox').on('changed.fu.spinbox', $.proxy(this.changed, this));
		this.$element.find('.repeat-monthly .radio, .repeat-yearly .radio').on('change.fu.scheduler', $.proxy(this.changed, this));
		
	};

	Scheduler.prototype = {
		constructor: Scheduler,

		destroy: function() {

			var markup;
			// set input value attribute
			this.$element.find('input').each(function() {
				$(this).attr('value', $(this).val());
			});
			
			// empty elements to return to original markup and store
			this.$element.find('.datepicker .calendar').empty();
			
			markup = this.$element[0].outerHTML;

			// destroy components
			this.$element.find('.combobox').combobox('destroy');
			this.$element.find('.datepicker').datepicker('destroy');
			this.$element.find('.selectlist').selectlist('destroy');
			this.$element.find('.spinbox').spinbox('destroy');
			this.$element.find('[type=radio]').radio('destroy');
			this.$element.remove();

			// any external bindings
			// [none]

			return markup;
		},

		changed: function(e, data, propagate){
			if(!propagate){
				e.stopPropagation();
			}
			this.$element.trigger('changed.fu.scheduler', {
				data: (data!==undefined) ? data : $(e.currentTarget).data(),
				originalEvent: e,
				value: this.getValue()
			});
		},

		disable: function(){
			this.toggleState('disable');
		},

		enable: function(){
			this.toggleState('enable');
		},

		// called when the end range changes
		// (Never, After, On date)
		endSelectChanged: function(e, data) {
			var selectedItem, val;

			if(!data){
				selectedItem = this.$endSelect.selectlist('selectedItem');
				val = selectedItem.value;
			}else{
				val = data.value;
			}

			// hide all panels
			this.$endAfter.parent().addClass('hide');
			this.$endAfter.parent().attr('aria-hidden', 'true');

			this.$endDate.parent().addClass('hide');
			this.$endDate.parent().attr('aria-hidden', 'true');

			if(val==='after'){
				this.$endAfter.parent().removeClass('hide');
				this.$endAfter.parent().attr('aria-hidden', 'false');
			}else if(val==='date'){
				this.$endDate.parent().removeClass('hide');
				this.$endDate.parent().attr('aria-hidden', 'false');
			}
		},

		getValue: function(){
			// FREQ = frequency (hourly, daily, monthly...)
			// BYDAY = when picking days (MO,TU,WE,etc)
			// BYMONTH = when picking months (Jan,Feb,March) - note the values should be 1,2,3...
			// BYMONTHDAY = when picking days of the month (1,2,3...)
			// BYSETPOS = when picking First,Second,Third,Fourth,Last (1,2,3,4,-1)

			var interval = this.$repeatIntervalSpinbox.spinbox('value');
			var pattern = '';
			var repeat = this.$repeatIntervalSelect.selectlist('selectedItem').value;
			var startTime = this.$startTime.combobox('selectedItem').text.toLowerCase();
			var timeZone = this.$timeZone.selectlist('selectedItem');
			var getFormattedDate;

			getFormattedDate = function(dateObj, dash){
				var fdate = '';
				var item;

				fdate += dateObj.getFullYear();
				fdate += dash;
				item = dateObj.getMonth() + 1;  //because 0 indexing makes sense when dealing with months /sarcasm
				fdate += (item<10) ? '0' + item : item;
				fdate += dash;
				item = dateObj.getDate();
				fdate += (item<10) ? '0' + item : item;

				return fdate;
			};

			var day, days, hasAm, hasPm, month, pos, startDateTime, type;

			startDateTime = '' + getFormattedDate(this.$startDate.datepicker('getDate'), '-');

			startDateTime += 'T';
			hasAm = (startTime.search('am')>=0);
			hasPm = (startTime.search('pm')>=0);
			startTime = $.trim(startTime.replace(/am/g, '').replace(/pm/g, '')).split(':');
			startTime[0] = parseInt(startTime[0], 10);
			startTime[1] = parseInt(startTime[1], 10);
			if(hasAm && startTime[0]>11){
				startTime[0] = 0;
			}else if(hasPm && startTime[0]<12){
				startTime[0] += 12;
			}
			startDateTime += (startTime[0]<10) ? '0' + startTime[0] : startTime[0];
			startDateTime += ':';
			startDateTime += (startTime[1]<10) ? '0' + startTime[1] : startTime[1];

			startDateTime += (timeZone.offset==='+00:00') ? 'Z' : timeZone.offset;

			if(repeat === 'none') {
				pattern = 'FREQ=DAILY;INTERVAL=1;COUNT=1;';
			}
			else if(repeat === 'hourly') {
				pattern = 'FREQ=HOURLY;';
				pattern += 'INTERVAL=' + interval + ';';
			}
			else if(repeat === 'daily') {
				pattern += 'FREQ=DAILY;';
				pattern += 'INTERVAL=' + interval + ';';
			}
			else if(repeat === 'weekdays') {
				pattern += 'FREQ=DAILY;';
				pattern += 'BYDAY=MO,TU,WE,TH,FR;';
				pattern += 'INTERVAL=1;';
			}
			else if(repeat === 'weekly') {
				days = [];
				this.$element.find('.repeat-days-of-the-week .btn-group input:checked').each(function() {
					days.push($(this).data().value);
				});

				pattern += 'FREQ=WEEKLY;';
				pattern += 'BYDAY=' + days.join(',') + ';';
				pattern += 'INTERVAL=' + interval + ';';
			}
			else if(repeat === 'monthly') {
				pattern += 'FREQ=MONTHLY;';
				pattern += 'INTERVAL=' + interval + ';';
				type = this.$element.find('input[name=repeat-monthly]:checked').val();

				if(type === 'bymonthday') {
					day = parseInt(this.$element.find('.repeat-monthly-date .selectlist').selectlist('selectedItem').text, 10);
					pattern += 'BYMONTHDAY=' + day + ';';
				}
				else if(type === 'bysetpos') {
					days = this.$element.find('.month-days').selectlist('selectedItem').value;
					pos = this.$element.find('.month-day-pos').selectlist('selectedItem').value;
					pattern += 'BYDAY=' + days + ';';
					pattern += 'BYSETPOS=' + pos + ';';
				}

			}
			else if(repeat === 'yearly') {
				pattern += 'FREQ=YEARLY;';
				type = this.$element.find('input[name=repeat-yearly]:checked').val();

				if(type === 'bymonthday') {
					month = this.$element.find('.repeat-yearly-date .year-month').selectlist('selectedItem').value;
					day = this.$element.find('.year-month-day').selectlist('selectedItem').text;
					pattern += 'BYMONTH=' + month + ';';
					pattern += 'BYMONTHDAY=' + day + ';';
				}
				else if(type === 'bysetpos') {
					days = this.$element.find('.year-month-days').selectlist('selectedItem').value;
					pos = this.$element.find('.year-month-day-pos').selectlist('selectedItem').value;
					month = this.$element.find('.repeat-yearly-day .year-month').selectlist('selectedItem').value;

					pattern += 'BYDAY=' + days + ';';
					pattern += 'BYSETPOS=' + pos + ';';
					pattern += 'BYMONTH=' + month + ';';
				}

			}

			var end = this.$endSelect.selectlist('selectedItem').value;
			var duration = '';

			// if both UNTIL and COUNT are not specified, the recurrence will repeat forever
			// http://tools.ietf.org/html/rfc2445#section-4.3.10
			if(repeat !=='none'){
				if(end === 'after') {
					duration = 'COUNT=' + this.$endAfter.spinbox('value') + ';';
				}
				else if(end === 'date') {
					duration = 'UNTIL=' + getFormattedDate(this.$endDate.datepicker('getDate'), '') + ';';
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
		repeatIntervalSelectChanged: function(e, data) {
			var selectedItem, val, txt;

			if(!data){
				selectedItem = this.$repeatIntervalSelect.selectlist('selectedItem');
				val = selectedItem.value;
				txt = selectedItem.text;
			}else{
				val = data.value;
				txt = data.text;
			}

			// set the text
			this.$repeatIntervalTxt.text(txt);

			switch(val.toLowerCase()) {
				case 'hourly':
				case 'daily':
				case 'weekly':
				case 'monthly':
					this.$repeatIntervalPanel.removeClass('hide');
					this.$repeatIntervalPanel.attr('aria-hidden', 'false');
					break;
				default:
					this.$repeatIntervalPanel.addClass('hide');
					this.$repeatIntervalPanel.attr('aria-hidden', 'true');
					break;
			}

			// hide all panels
			this.$recurrencePanels.addClass('hide');
			this.$recurrencePanels.attr('aria-hidden', 'true');

			// show panel for current selection
			this.$element.find('.repeat-' + val).removeClass('hide');
			this.$element.find('.repeat-' + val).attr('aria-hidden', 'false');

			// the end selection should only be shown when
			// the repeat interval is not "None (run once)"
			if(val === 'none') {
				this.$end.addClass('hide');
				this.$end.attr('aria-hidden', 'true');
			}
			else {
				this.$end.removeClass('hide');
				this.$end.attr('aria-hidden', 'false');
			}
		},

		setValue: function(options){
			var hours, i, item, l, minutes, period, recur, temp;

			if(options.startDateTime){
				temp = options.startDateTime.split('T');
				this.$startDate.datepicker('setDate', temp[0]);

				if(temp[1]){
					temp[1] = temp[1].split(':');
					hours = parseInt(temp[1][0], 10);
					minutes = (temp[1][1]) ? parseInt(temp[1][1].split('+')[0].split('-')[0].split('Z')[0], 10) : 0;
					period = (hours<12) ? 'AM' : 'PM';

					if(hours===0){
						hours = 12;
					}else if(hours>12){
						hours -= 12;
					}
					minutes = (minutes<10) ? '0' + minutes : minutes;

					temp = hours + ':' + minutes + ' ' + period;
					this.$startTime.find('input').val(temp);
					this.$startTime.combobox('selectByText', temp);
				}
			}

			item = 'li[data';
			if(options.timeZone){
				if(typeof(options.timeZone)==='string'){
					item += '-name="' + options.timeZone;
				}else{
					if(options.timeZone.name){
						item += '-name="' + options.timeZone.name;
					}else{
						item += '-offset="' + options.timeZone.offset;
					}
				}
				item += '"]';
				this.$timeZone.selectlist('selectBySelector', item);
			}else if(options.startDateTime){
				temp = options.startDateTime.split('T')[1];
				if(temp){
					if(temp.search(/\+/)>-1){
						temp = '+' + $.trim(temp.split('+')[1]);
					}else if(temp.search(/\-/)>-1){
						temp = '-' + $.trim(temp.split('-')[1]);
					}else{
						temp = '+00:00';
					}
				}else{
					temp = '+00:00';
				}
				item += '-offset="' + temp + '"]';
				this.$timeZone.selectlist('selectBySelector', item);
			}

			if(options.recurrencePattern){
				recur = {};
				temp = options.recurrencePattern.toUpperCase().split(';');
				for(i=0, l=temp.length; i<l; i++){
					if(temp[i]!==''){
						item = temp[i].split('=');
						recur[item[0]] = item[1];
					}
				}

				if(recur.FREQ==='DAILY'){
					if(recur.BYDAY==='MO,TU,WE,TH,FR'){
						item = 'weekdays';
					}else{
						if(recur.INTERVAL==='1' && recur.COUNT==='1'){
							item = 'none';
						}else{
							item = 'daily';
						}
					}
				}else if(recur.FREQ==='HOURLY'){
					item = 'hourly';
				}else if(recur.FREQ==='WEEKLY'){
					if(recur.BYDAY){
						item = this.$element.find('.repeat-days-of-the-week .btn-group');
						item.find('label').removeClass('active');
						temp = recur.BYDAY.split(',');
						for(i=0,l=temp.length; i<l; i++){
							item.find('input[data-value="' + temp[i] + '"]').parent().addClass('active');
						}
					}
					item = 'weekly';
				}else if(recur.FREQ==='MONTHLY'){
					this.$element.find('.repeat-monthly input').removeAttr('checked').removeClass('checked');
					this.$element.find('.repeat-monthly label.radio-custom').removeClass('checked');
					if(recur.BYMONTHDAY){
						temp = this.$element.find('.repeat-monthly-date');
						temp.find('input').addClass('checked').attr('checked', 'checked');
						temp.find('label.radio-custom').addClass('checked');
						temp.find('.selectlist').selectlist('selectByValue', recur.BYMONTHDAY);
					}else if(recur.BYDAY){
						temp = this.$element.find('.repeat-monthly-day');
						temp.find('input').addClass('checked').attr('checked', 'checked');
						temp.find('label.radio-custom').addClass('checked');
						if(recur.BYSETPOS){
							temp.find('.month-day-pos').selectlist('selectByValue', recur.BYSETPOS);
						}
						temp.find('.month-days').selectlist('selectByValue', recur.BYDAY);
					}
					item = 'monthly';
				}else if(recur.FREQ==='YEARLY'){
					this.$element.find('.repeat-yearly input').removeAttr('checked').removeClass('checked');
					this.$element.find('.repeat-yearly label.radio-custom').removeClass('checked');
					if(recur.BYMONTHDAY){
						temp = this.$element.find('.repeat-yearly-date');
						temp.find('input').addClass('checked').attr('checked', 'checked');
						temp.find('label.radio-custom').addClass('checked');
						if(recur.BYMONTH){
							temp.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
						}
						temp.find('.year-month-day').selectlist('selectByValue', recur.BYMONTHDAY);
					}else if(recur.BYSETPOS){
						temp = this.$element.find('.repeat-yearly-day');
						temp.find('input').addClass('checked').attr('checked', 'checked');
						temp.find('label.radio-custom').addClass('checked');
						temp.find('.year-month-day-pos').selectlist('selectByValue', recur.BYSETPOS);
						if(recur.BYDAY){
							temp.find('.year-month-days').selectlist('selectByValue', recur.BYDAY);
						}
						if(recur.BYMONTH){
							temp.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
						}
					}
					item = 'yearly';
				}else{
					item = 'none';
				}

				if(recur.COUNT){
					this.$endAfter.spinbox('value', parseInt(recur.COUNT, 10));
					this.$endSelect.selectlist('selectByValue', 'after');
				}else if(recur.UNTIL){
					temp = recur.UNTIL;
					if(temp.length===8){
						temp = temp.split('');
						temp.splice(4, 0, '-');
						temp.splice(7, 0, '-');
						temp = temp.join('');
					}
					this.$endDate.datepicker('setDate', temp);
					this.$endSelect.selectlist('selectByValue', 'date');
				}
				this.endSelectChanged();

				if(recur.INTERVAL){
					this.$repeatIntervalSpinbox.spinbox('value', parseInt(recur.INTERVAL, 10));
				}
				this.$repeatIntervalSelect.selectlist('selectByValue', item);
				this.repeatIntervalSelectChanged();
			}
		},

		toggleState: function(action){
			this.$element.find('.combobox').combobox(action);
			this.$element.find('.datepicker').datepicker(action);
			this.$element.find('.selectlist').selectlist(action);
			this.$element.find('.spinbox').spinbox(action);
			this.$element.find('[type=radio]').radio(action);

			if(action==='disable'){
				action = 'addClass';
			}else{
				action = 'removeClass';
			}
			this.$element.find('.repeat-days-of-the-week .btn-group')[action]('disabled');
		},

		value: function(options) {
			if(options){
				return this.setValue(options);
			}else{
				return this.getValue();
			}
		}
	};


	// SCHEDULER PLUGIN DEFINITION

	$.fn.scheduler = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.scheduler');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('fu.scheduler', (data = new Scheduler(this, options)));
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.scheduler.defaults = {};

	$.fn.scheduler.Constructor = Scheduler;

	$.fn.scheduler.noConflict = function () {
		$.fn.scheduler = old;
		return this;
	};


	// DATA-API

	$(document).on('mousedown.fu.scheduler.data-api', '[data-initialize=scheduler]', function (e) {
		var $control = $(e.target).closest('.scheduler');
		if ( !$control.data('fu.scheduler') ) {
			$control.scheduler($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=scheduler]').each(function () {
			var $this = $(this);
			if ($this.data('scheduler')) return;
			$this.scheduler($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --
