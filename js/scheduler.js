/* global jQuery:true */

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

(function umdFactory (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery', 'fuelux/combobox', 'fuelux/datepicker', 'fuelux/radio', 'fuelux/selectlist', 'fuelux/spinbox'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'), require('./combobox'), require('./datepicker'),
			require('./radio'), require('./selectlist'), require('./spinbox') );
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function SchedulerWrapper ($) {
	if (!$.fn.combobox || !$.fn.datepicker || !$.fn.radio || !$.fn.selectlist || !$.fn.spinbox) {
		throw new Error('Fuel UX scheduler control requires combobox, datepicker, radio, selectlist, and spinbox.');
	}

	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.scheduler;

	// SCHEDULER CONSTRUCTOR AND PROTOTYPE

	var Scheduler = function Scheduler(element, options) {
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
		this.$endSelect = this.$end.find('.end-options');
		this.$endAfter = this.$end.find('.end-after');
		this.$endDate = this.$end.find('.end-on-date');

		// panels
		this.$recurrencePanels = this.$element.find('.repeat-panel');


		this.$repeatIntervalSelect.selectlist();

		//initialize sub-controls
		this.$element.find('.selectlist').selectlist();
		this.$startDate.datepicker(this.options.startDateOptions);

		var startDateResponse = (typeof this.options.startDateChanged === "function") ? this.options.startDateChanged : this._guessEndDate;
		this.$startDate.on('change changed.fu.datepicker dateClicked.fu.datepicker', $.proxy(startDateResponse, this));

		this.$startTime.combobox();
		// init start time
		if (this.$startTime.find('input').val() === '') {
			this.$startTime.combobox('selectByIndex', 0);
		}

		// every 0 days/hours doesn't make sense, change if not set
		if (this.$repeatIntervalSpinbox.find('input').val() === '0') {
			this.$repeatIntervalSpinbox.spinbox({
				'value': 1,
				'min': 1,
				'limitToStep': true
			});
		} else {
			this.$repeatIntervalSpinbox.spinbox({
				'min': 1,
				'limitToStep': true
			});
		}

		this.$endAfter.spinbox({
			'value': 1,
			'min': 1,
			'limitToStep': true
		});
		this.$endDate.datepicker(this.options.endDateOptions);
		this.$element.find('.radio-custom').radio();

		// bind events: 'change' is a Bootstrap JS fired event
		this.$repeatIntervalSelect.on('changed.fu.selectlist', $.proxy(this.repeatIntervalSelectChanged, this));
		this.$endSelect.on('changed.fu.selectlist', $.proxy(this.endSelectChanged, this));
		this.$element.find('.repeat-days-of-the-week .btn-group .btn').on('change.fu.scheduler', function (e, data) {
			self.changed(e, data, true);
		});
		this.$element.find('.combobox').on('changed.fu.combobox', $.proxy(this.changed, this));
		this.$element.find('.datepicker').on('changed.fu.datepicker', $.proxy(this.changed, this));
		this.$element.find('.datepicker').on('dateClicked.fu.datepicker', $.proxy(this.changed, this));
		this.$element.find('.selectlist').on('changed.fu.selectlist', $.proxy(this.changed, this));
		this.$element.find('.spinbox').on('changed.fu.spinbox', $.proxy(this.changed, this));
		this.$element.find('.repeat-monthly .radio-custom, .repeat-yearly .radio-custom').on('change.fu.scheduler', $.proxy(this.changed, this));
	};

	var _getFormattedDate = function _getFormattedDate(dateObj, dash) {
		var fdate = '';
		var item;

		fdate += dateObj.getFullYear();
		fdate += dash;
		item = dateObj.getMonth() + 1;//because 0 indexing makes sense when dealing with months /sarcasm
		fdate += (item < 10) ? '0' + item : item;
		fdate += dash;
		item = dateObj.getDate();
		fdate += (item < 10) ? '0' + item : item;

		return fdate;
	};

	var ONE_SECOND = 1000;
	var ONE_MINUTE = ONE_SECOND * 60;
	var ONE_HOUR = ONE_MINUTE * 60;
	var ONE_DAY = ONE_HOUR * 24;
	var ONE_WEEK = ONE_DAY * 7;
	var ONE_MONTH = ONE_WEEK * 5;// No good way to increment by one month using vanilla JS. Since this is an end date, we only need to ensure that this date occurs after at least one or more repeat increments, but there is no reason for it to be exact.
	var ONE_YEAR = ONE_WEEK * 52;
	var INTERVALS = {
		secondly: ONE_SECOND,
		minutely: ONE_MINUTE,
		hourly: ONE_HOUR,
		daily: ONE_DAY,
		weekly: ONE_WEEK,
		monthly: ONE_MONTH,
		yearly: ONE_YEAR
	};

	var _incrementDate = function _incrementDate(start, end, interval, increment) {
		return new Date(start.getTime() + (INTERVALS[interval] * increment));
	};

	Scheduler.prototype = {
		constructor: Scheduler,

		destroy: function destroy() {
			var markup;
			// set input value attribute
			this.$element.find('input').each(function () {
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
			this.$element.find('.radio-custom').radio('destroy');
			this.$element.remove();

			// any external bindings
			// [none]

			return markup;
		},

		changed: function changed(e, data, propagate) {
			if (!propagate) {
				e.stopPropagation();
			}

			this.$element.trigger('changed.fu.scheduler', {
				data: (data !== undefined) ? data : $(e.currentTarget).data(),
				originalEvent: e,
				value: this.getValue()
			});
		},

		disable: function disable() {
			this.toggleState('disable');
		},

		enable: function enable() {
			this.toggleState('enable');
		},

		setUtcTime: function setUtcTime(day, time, offset) {
			var dateSplit = day.split('-');
			var timeSplit = time.split(':');
			function z(n) {
				return (n < 10 ? '0' : '') + n;
			}

			var utcDate = new Date(Date.UTC(dateSplit[0], (dateSplit[1] - 1), dateSplit[2], timeSplit[0], timeSplit[1], (timeSplit[2] ? timeSplit[2] : 0)));

			if (offset === 'Z') {
				utcDate.setUTCHours(utcDate.getUTCHours() + 0);
			} else {
				var expression = [];
				expression[0] = '(.)'; // Any Single Character 1
				expression[1] = '.*?'; // Non-greedy match on filler
				expression[2] = '\\d'; // Uninteresting and ignored: d
				expression[3] = '.*?'; // Non-greedy match on filler
				expression[4] = '(\\d)'; // Any Single Digit 1

				var p = new RegExp(expression.join(''), ["i"]);
				var offsetMatch = p.exec(offset);
				if (offsetMatch !== null) {
					var offsetDirection = offsetMatch[1];
					var offsetInteger = offsetMatch[2];
					var modifier = (offsetDirection === '+') ? 1 : -1;

					utcDate.setUTCHours(utcDate.getUTCHours() + (modifier * parseInt(offsetInteger, 10)));
				}

			}

			var localDifference = utcDate.getTimezoneOffset();
			utcDate.setMinutes(localDifference);
			return utcDate;
		},

		// called when the end range changes
		// (Never, After, On date)
		endSelectChanged: function endSelectChanged(e, data) {
			var selectedItem, val;

			if (!data) {
				selectedItem = this.$endSelect.selectlist('selectedItem');
				val = selectedItem.value;
			} else {
				val = data.value;
			}

			// hide all panels
			this.$endAfter.parent().addClass('hidden');
			this.$endAfter.parent().attr('aria-hidden', 'true');

			this.$endDate.parent().addClass('hidden');
			this.$endDate.parent().attr('aria-hidden', 'true');

			if (val === 'after') {
				this.$endAfter.parent().removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
				this.$endAfter.parent().attr('aria-hidden', 'false');
			} else if (val === 'date') {
				this.$endDate.parent().removeClass('hide hidden');	// jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
				this.$endDate.parent().attr('aria-hidden', 'false');
			}
		},

		_guessEndDate: function _guessEndDate() {
			var interval = this.$repeatIntervalSelect.selectlist('selectedItem').value;
			var end = new Date(this.$endDate.datepicker('getDate'));
			var start = new Date(this.$startDate.datepicker('getDate'));
			var increment = this.$repeatIntervalSpinbox.find('input').val();

			if(interval !== "none" && end <= start){
				// if increment spinbox is hidden, user has no idea what it is set to and it is probably not set to
				// something they intended. Safest option is to set date forward by an increment of 1.
				// this will keep monthly & yearly from auto-incrementing by more than a single interval
				if(!this.$repeatIntervalSpinbox.is(':visible')){
					increment = 1;
				}

				// treat weekdays as weekly. This treats all "weekdays" as a single set, of which a single increment
				// is one week.
				if(interval === "weekdays"){
					increment = 1;
					interval = "weekly";
				}

				end = _incrementDate(start, end, interval, increment);

				this.$endDate.datepicker('setDate', end);
			}
		},

		getValue: function getValue() {
			// FREQ = frequency (secondly, minutely, hourly, daily, weekdays, weekly, monthly, yearly)
			// BYDAY = when picking days (MO,TU,WE,etc)
			// BYMONTH = when picking months (Jan,Feb,March) - note the values should be 1,2,3...
			// BYMONTHDAY = when picking days of the month (1,2,3...)
			// BYSETPOS = when picking First,Second,Third,Fourth,Last (1,2,3,4,-1)

			var interval = this.$repeatIntervalSpinbox.spinbox('value');
			var pattern = '';
			var repeat = this.$repeatIntervalSelect.selectlist('selectedItem').value;
			var startTime;

			if (this.$startTime.combobox('selectedItem').value) {
				startTime = this.$startTime.combobox('selectedItem').value;
				startTime = startTime.toLowerCase();

			} else {
				startTime = this.$startTime.combobox('selectedItem').text.toLowerCase();
			}

			var timeZone = this.$timeZone.selectlist('selectedItem');
			var day, days, hasAm, hasPm, month, pos, startDateTime, type;

			startDateTime = '' + _getFormattedDate(this.$startDate.datepicker('getDate'), '-');

			startDateTime += 'T';
			hasAm = (startTime.search('am') >= 0);
			hasPm = (startTime.search('pm') >= 0);
			startTime = $.trim(startTime.replace(/am/g, '').replace(/pm/g, '')).split(':');
			startTime[0] = parseInt(startTime[0], 10);
			startTime[1] = parseInt(startTime[1], 10);
			if (hasAm && startTime[0] > 11) {
				startTime[0] = 0;
			} else if (hasPm && startTime[0] < 12) {
				startTime[0] += 12;
			}

			startDateTime += (startTime[0] < 10) ? '0' + startTime[0] : startTime[0];
			startDateTime += ':';
			startDateTime += (startTime[1] < 10) ? '0' + startTime[1] : startTime[1];

			startDateTime += (timeZone.offset === '+00:00') ? 'Z' : timeZone.offset;

			if (repeat === 'none') {
				pattern = 'FREQ=DAILY;INTERVAL=1;COUNT=1;';
			} else if (repeat === 'secondly') {
				pattern = 'FREQ=SECONDLY;';
				pattern += 'INTERVAL=' + interval + ';';
			} else if (repeat === 'minutely') {
				pattern = 'FREQ=MINUTELY;';
				pattern += 'INTERVAL=' + interval + ';';
			} else if (repeat === 'hourly') {
				pattern = 'FREQ=HOURLY;';
				pattern += 'INTERVAL=' + interval + ';';
			} else if (repeat === 'daily') {
				pattern += 'FREQ=DAILY;';
				pattern += 'INTERVAL=' + interval + ';';
			} else if (repeat === 'weekdays') {
				pattern += 'FREQ=WEEKLY;';
				pattern += 'BYDAY=MO,TU,WE,TH,FR;';
				pattern += 'INTERVAL=1;';
			} else if (repeat === 'weekly') {
				days = [];
				this.$element.find('.repeat-days-of-the-week .btn-group input:checked').each(function () {
					days.push($(this).data().value);
				});

				pattern += 'FREQ=WEEKLY;';
				pattern += 'BYDAY=' + days.join(',') + ';';
				pattern += 'INTERVAL=' + interval + ';';
			} else if (repeat === 'monthly') {
				pattern += 'FREQ=MONTHLY;';
				pattern += 'INTERVAL=' + interval + ';';
				type = this.$element.find('input[name=repeat-monthly]:checked').val();

				if (type === 'bymonthday') {
					day = parseInt(this.$element.find('.repeat-monthly-date .selectlist').selectlist('selectedItem').text, 10);
					pattern += 'BYMONTHDAY=' + day + ';';
				} else if (type === 'bysetpos') {
					days = this.$element.find('.repeat-monthly-day .month-days').selectlist('selectedItem').value;
					pos = this.$element.find('.repeat-monthly-day .month-day-pos').selectlist('selectedItem').value;
					pattern += 'BYDAY=' + days + ';';
					pattern += 'BYSETPOS=' + pos + ';';
				}

			} else if (repeat === 'yearly') {
				pattern += 'FREQ=YEARLY;';
				type = this.$element.find('input[name=repeat-yearly]:checked').val();

				if (type === 'bymonthday') {
					// there are multiple .year-month classed elements in scheduler markup
					month = this.$element.find('.repeat-yearly-date .year-month').selectlist('selectedItem').value;
					day = this.$element.find('.repeat-yearly-date .year-month-day').selectlist('selectedItem').text;
					pattern += 'BYMONTH=' + month + ';';
					pattern += 'BYMONTHDAY=' + day + ';';
				} else if (type === 'bysetpos') {
					days = this.$element.find('.repeat-yearly-day .year-month-days').selectlist('selectedItem').value;
					pos = this.$element.find('.repeat-yearly-day .year-month-day-pos').selectlist('selectedItem').value;
					// there are multiple .year-month classed elements in scheduler markup
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
			if (repeat !== 'none') {
				if (end === 'after') {
					duration = 'COUNT=' + this.$endAfter.spinbox('value') + ';';
				} else if (end === 'date') {
					duration = 'UNTIL=' + _getFormattedDate(this.$endDate.datepicker('getDate'), '') + ';';
				}

			}

			pattern += duration;
			// remove trailing semicolon
			pattern = pattern.substring(pattern.length - 1) === ';' ? pattern.substring(0, pattern.length - 1) : pattern;

			var data = {
				startDateTime: startDateTime,
				timeZone: timeZone,
				recurrencePattern: pattern
			};

			return data;
		},

		// called when the repeat interval changes
		// (None, Hourly, Daily, Weekdays, Weekly, Monthly, Yearly
		repeatIntervalSelectChanged: function repeatIntervalSelectChanged(e, data) {
			var selectedItem, val, txt;

			if (!data) {
				selectedItem = this.$repeatIntervalSelect.selectlist('selectedItem');
				val = selectedItem.value || "";
				txt = selectedItem.text || "";
			} else {
				val = data.value;
				txt = data.text;
			}

			// set the text
			this.$repeatIntervalTxt.text(txt);

			switch (val.toLowerCase()) {
				case 'hourly':
				case 'daily':
				case 'weekly':
				case 'monthly':
					this.$repeatIntervalPanel.removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
					this.$repeatIntervalPanel.attr('aria-hidden', 'false');
					break;
				default:
					this.$repeatIntervalPanel.addClass('hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
					this.$repeatIntervalPanel.attr('aria-hidden', 'true');
					break;
			}

			// hide all panels
			this.$recurrencePanels.addClass('hidden');
			this.$recurrencePanels.attr('aria-hidden', 'true');

			// show panel for current selection
			this.$element.find('.repeat-' + val).removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
			this.$element.find('.repeat-' + val).attr('aria-hidden', 'false');

			// the end selection should only be shown when
			// the repeat interval is not "None (run once)"
			if (val === 'none') {
				this.$end.addClass('hidden');
				this.$end.attr('aria-hidden', 'true');
			} else {
				this.$end.removeClass('hide hidden'); // jQuery deprecated hide in 3.0. Use hidden instead. Leaving hide here to support previous markup
				this.$end.attr('aria-hidden', 'false');
			}

			this._guessEndDate();
		},

		_parseAndSetRecurrencePattern: function(recurrencePattern, startTime) {
			var recur = {};
			var i = 0;
			var item = '';
			var commaPatternSplit;

			var $repeatMonthlyDate, $repeatYearlyDate, $repeatYearlyDay;

			var semiColonPatternSplit = recurrencePattern.toUpperCase().split(';');
			for (i = 0; i < semiColonPatternSplit.length; i++) {
				if (semiColonPatternSplit[i] !== '') {
					item = semiColonPatternSplit[i].split('=');
					recur[item[0]] = item[1];
				}
			}

			if (recur.FREQ === 'DAILY') {
				if (recur.BYDAY === 'MO,TU,WE,TH,FR') {
					item = 'weekdays';
				} else {
					if (recur.INTERVAL === '1' && recur.COUNT === '1') {
						item = 'none';
					} else {
						item = 'daily';
					}
				}
			} else if (recur.FREQ === 'SECONDLY') {
				item = 'secondly';
			} else if (recur.FREQ === 'MINUTELY') {
				item = 'minutely';
			} else if (recur.FREQ === 'HOURLY') {
				item = 'hourly';
			} else if (recur.FREQ === 'WEEKLY') {
				item = 'weekly';

				if (recur.BYDAY) {
					if (recur.BYDAY === 'MO,TU,WE,TH,FR') {
						item = 'weekdays';
					} else {
						var el = this.$element.find('.repeat-days-of-the-week .btn-group');
						el.find('label').removeClass('active');
						commaPatternSplit = recur.BYDAY.split(',');
						for (i = 0; i < commaPatternSplit.length; i++) {
							el.find('input[data-value="' + commaPatternSplit[i] + '"]').prop('checked',true).parent().addClass('active');
						}
					}
				}
			} else if (recur.FREQ === 'MONTHLY') {
				this.$element.find('.repeat-monthly input').removeAttr('checked').removeClass('checked');
				this.$element.find('.repeat-monthly label.radio-custom').removeClass('checked');
				if (recur.BYMONTHDAY) {
					$repeatMonthlyDate = this.$element.find('.repeat-monthly-date');
					$repeatMonthlyDate.find('input').addClass('checked').prop('checked', true);
					$repeatMonthlyDate.find('label.radio-custom').addClass('checked');
					$repeatMonthlyDate.find('.selectlist').selectlist('selectByValue', recur.BYMONTHDAY);
				} else if (recur.BYDAY) {
					var $repeatMonthlyDay = this.$element.find('.repeat-monthly-day');
					$repeatMonthlyDay.find('input').addClass('checked').prop('checked', true);
					$repeatMonthlyDay.find('label.radio-custom').addClass('checked');
					if (recur.BYSETPOS) {
						$repeatMonthlyDay.find('.month-day-pos').selectlist('selectByValue', recur.BYSETPOS);
					}

					$repeatMonthlyDay.find('.month-days').selectlist('selectByValue', recur.BYDAY);
				}

				item = 'monthly';
			} else if (recur.FREQ === 'YEARLY') {
				this.$element.find('.repeat-yearly input').removeAttr('checked').removeClass('checked');
				this.$element.find('.repeat-yearly label.radio-custom').removeClass('checked');
				if (recur.BYMONTHDAY) {
					$repeatYearlyDate = this.$element.find('.repeat-yearly-date');
					$repeatYearlyDate.find('input').addClass('checked').prop('checked', true);
					$repeatYearlyDate.find('label.radio-custom').addClass('checked');
					if (recur.BYMONTH) {
						$repeatYearlyDate.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
					}

					$repeatYearlyDate.find('.year-month-day').selectlist('selectByValue', recur.BYMONTHDAY);
				} else if (recur.BYSETPOS) {
					$repeatYearlyDay = this.$element.find('.repeat-yearly-day');
					$repeatYearlyDay.find('input').addClass('checked').prop('checked', true);
					$repeatYearlyDay.find('label.radio-custom').addClass('checked');
					$repeatYearlyDay.find('.year-month-day-pos').selectlist('selectByValue', recur.BYSETPOS);

					if (recur.BYDAY) {
						$repeatYearlyDay.find('.year-month-days').selectlist('selectByValue', recur.BYDAY);
					}

					if (recur.BYMONTH) {
						$repeatYearlyDay.find('.year-month').selectlist('selectByValue', recur.BYMONTH);
					}
				}

				item = 'yearly';
			} else {
				item = 'none';
			}

			if (recur.COUNT) {
				this.$endAfter.spinbox('value', parseInt(recur.COUNT, 10));
				this.$endSelect.selectlist('selectByValue', 'after');
			} else if (recur.UNTIL) {
				var untilSplit, untilDate;

				if (recur.UNTIL.length === 8) {
					untilSplit = recur.UNTIL.split('');
					untilSplit.splice(4, 0, '-');
					untilSplit.splice(7, 0, '-');
					untilDate = untilSplit.join('');
				}

				var timeZone = this.$timeZone.selectlist('selectedItem');
				var timezoneOffset = (timeZone.offset === '+00:00') ? 'Z' : timeZone.offset;

				var utcEndHours = this.setUtcTime(untilDate, startTime.time24HourFormat, timezoneOffset);
				this.$endDate.datepicker('setDate', utcEndHours);

				this.$endSelect.selectlist('selectByValue', 'date');
			} else {
				this.$endSelect.selectlist('selectByValue', 'never');
			}

			this.endSelectChanged();

			if (recur.INTERVAL) {
				this.$repeatIntervalSpinbox.spinbox('value', parseInt(recur.INTERVAL, 10));
			}

			this.$repeatIntervalSelect.selectlist('selectByValue', item);
			this.repeatIntervalSelectChanged();
		},

		_parseStartDateTime: function(startTimeISO8601) {
			var startTime = {};
			var startDate, startDateTimeISO8601FormatSplit, hours, minutes, period;

			startTime.time24HourFormat = startTimeISO8601.split('+')[0].split('-')[0];

			if (startTimeISO8601.search(/\+/) > -1) {
				startTime.timeZoneOffset = '+' + $.trim(startTimeISO8601.split('+')[1]);
			} else if (startTimeISO8601.search(/\-/) > -1) {
				startTime.timeZoneOffset = '-' + $.trim(startTimeISO8601.split('-')[1]);
			} else {
				startTime.timeZoneOffset = '+00:00';
			}

			startTime.time24HourFormatSplit = startTime.time24HourFormat.split(':');
			hours = parseInt(startTime.time24HourFormatSplit[0], 10);
			minutes = (startTime.time24HourFormatSplit[1]) ? parseInt(startTime.time24HourFormatSplit[1].split('+')[0].split('-')[0].split('Z')[0], 10) : 0;
			period = (hours < 12) ? 'AM' : 'PM';

			if (hours === 0) {
				hours = 12;
			} else if (hours > 12) {
				hours -= 12;
			}

			minutes = (minutes < 10) ? '0' + minutes : minutes;
			startTime.time12HourFormat = hours + ':' + minutes;
			startTime.time12HourFormatWithPeriod = hours + ':' + minutes + ' ' + period;

			return startTime;
		},

		_parseTimeZone: function(options, startTime) {
			startTime.timeZoneQuerySelector = '';
			if (options.timeZone) {
				if (typeof (options.timeZone) === 'string') {
					startTime.timeZoneQuerySelector += 'li[data-name="' + options.timeZone + '"]';
				} else {
					$.each(options.timeZone, function(key, value) {
						startTime.timeZoneQuerySelector += 'li[data-' + key + '="' + value + '"]';
					});
				}
				startTime.timeZoneOffset = options.timeZone.offset;
			} else if (options.startDateTime) {
				// Time zone has not been specified via options object, therefore use the timeZoneOffset from _parseAndSetStartDateTime
				startTime.timeZoneOffset = (startTime.timeZoneOffset === '+00:00') ? 'Z' : startTime.timeZoneOffset;
				startTime.timeZoneQuerySelector += 'li[data-offset="' + startTime.timeZoneOffset + '"]';
			} else {
				startTime.timeZoneOffset = 'Z';
			}

			return startTime.timeZoneOffset;
		},

		_setTimeUI: function(time12HourFormatWithPeriod) {
			this.$startTime.find('input').val(time12HourFormatWithPeriod);
			this.$startTime.combobox('selectByText', time12HourFormatWithPeriod);
		},

		_setTimeZoneUI: function(querySelector) {
			this.$timeZone.selectlist('selectBySelector', querySelector);
		},

		setValue: function setValue(options) {
			var startTime = {};
			var startDateTime, startDate, startTimeISO8601, timeOffset, utcStartHours;

			// TIME
			if (options.startDateTime) {
				startDateTime = options.startDateTime.split('T');
				startDate = startDateTime[0];
				startTimeISO8601 = startDateTime[1];

				if(startTimeISO8601) {
					startTime = this._parseStartDateTime(startTimeISO8601);
					this._setTimeUI(startTime.time12HourFormatWithPeriod);
				}
				else {
					startTime.time12HourFormat = '00:00';
					startTime.time24HourFormat = '00:00';
				}
			} else {
				startTime.time12HourFormat = '00:00';
				startTime.time24HourFormat = '00:00';
				var currentDate = this.$startDate.datepicker('getDate');
				startDate = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDate();
			}

			// TIMEZONE
			this._parseTimeZone(options, startTime);
			if (startTime.timeZoneQuerySelector) {
				this._setTimeZoneUI(startTime.timeZoneQuerySelector);
			}

			// RECURRENCE PATTERN
			if(options.recurrencePattern) {
				this._parseAndSetRecurrencePattern(options.recurrencePattern, startTime);
			}

			utcStartHours = this.setUtcTime(startDate, startTime.time24HourFormat, startTime.timeZoneOffset);
			this.$startDate.datepicker('setDate', utcStartHours);
		},

		toggleState: function toggleState(action) {
			this.$element.find('.combobox').combobox(action);
			this.$element.find('.datepicker').datepicker(action);
			this.$element.find('.selectlist').selectlist(action);
			this.$element.find('.spinbox').spinbox(action);
			this.$element.find('.radio-custom').radio(action);

			if (action === 'disable') {
				action = 'addClass';
			} else {
				action = 'removeClass';
			}

			this.$element.find('.repeat-days-of-the-week .btn-group')[action]('disabled');
		},

		value: function value(options) {
			if (options) {
				return this.setValue(options);
			} else {
				return this.getValue();
			}
		}
	};


	// SCHEDULER PLUGIN DEFINITION

	$.fn.scheduler = function scheduler(option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.scheduler');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.scheduler', (data = new Scheduler(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.scheduler.defaults = {};

	$.fn.scheduler.Constructor = Scheduler;

	$.fn.scheduler.noConflict = function noConflict() {
		$.fn.scheduler = old;
		return this;
	};


	// DATA-API

	$(document).on('mousedown.fu.scheduler.data-api', '[data-initialize=scheduler]', function (e) {
		var $control = $(e.target).closest('.scheduler');
		if (!$control.data('fu.scheduler')) {
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
