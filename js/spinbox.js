/*
 * Fuel UX Spinbox
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
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.spinbox;

	// SPINBOX CONSTRUCTOR AND PROTOTYPE

	var Spinbox = function Spinbox(element, options) {
		this.$element = $(element);
		this.$element.find('.btn').on('click', function (e) {
			//keep spinbox from submitting if they forgot to say type="button" on their spinner buttons
			e.preventDefault();
		});
		this.options = $.extend({}, $.fn.spinbox.defaults, options);
		this.options.step = this.$element.data('step') || this.options.step;

		this.$input = this.$element.find('.spinbox-input');
		this.$element.on('focusin.fu.spinbox', this.$input, $.proxy(this.changeFlag, this));
		this.$element.on('focusout.fu.spinbox', this.$input, $.proxy(this.change, this));
		this.$element.on('keydown.fu.spinbox', this.$input, $.proxy(this.keydown, this));
		this.$element.on('keyup.fu.spinbox', this.$input, $.proxy(this.keyup, this));

		this.bindMousewheelListeners();
		this.mousewheelTimeout = {};

		if (this.options.hold) {
			this.$element.on('mousedown.fu.spinbox', '.spinbox-up', $.proxy(function () {
				this.startSpin(true);
			}, this));
			this.$element.on('mouseup.fu.spinbox', '.spinbox-up, .spinbox-down', $.proxy(this.stopSpin, this));
			this.$element.on('mouseout.fu.spinbox', '.spinbox-up, .spinbox-down', $.proxy(this.stopSpin, this));
			this.$element.on('mousedown.fu.spinbox', '.spinbox-down', $.proxy(function () {
				this.startSpin(false);
			}, this));
		} else {
			this.$element.on('click.fu.spinbox', '.spinbox-up', $.proxy(function () {
				this.step(true);
			}, this));
			this.$element.on('click.fu.spinbox', '.spinbox-down', $.proxy(function () {
				this.step(false);
			}, this));
		}

		this.switches = {
			count: 1,
			enabled: true
		};

		if (this.options.speed === 'medium') {
			this.switches.speed = 300;
		} else if (this.options.speed === 'fast') {
			this.switches.speed = 100;
		} else {
			this.switches.speed = 500;
		}

		this.options.defaultUnit = _isUnitLegal(this.options.defaultUnit, this.options.units) ? this.options.defaultUnit : '';
		this.unit = this.options.defaultUnit;

		this.lastValue = this.options.value;

		this.render();

		if (this.options.disabled) {
			this.disable();
		}
	};

	var _limitToStep = function _limitToStep(number, step, roundDirection) {
		var limitedNumber = number;

		var remainder = number % step;
		if(remainder > 0){
			if(remainder > step/2 || typeof roundDirection !== 'undefined' && roundDirection > 0){
				limitedNumber = number - remainder + step;
			}else{
				limitedNumber = number - remainder;
			}
		}

		return limitedNumber;
	};

	_isUnitLegal = function _isUnitLegal(unit, validUnits) {
		var legalUnit = false;
		var suspectUnit = unit.toLowerCase();

		$.each(validUnits, function (i, validUnit) {
			validUnit = validUnit.toLowerCase();
			if (suspectUnit === validUnit) {
				legalUnit = true;
				return false;//break out of the loop
			}
		});

		return legalUnit;
	};

	Spinbox.prototype = {
		constructor: Spinbox,

		destroy: function destroy() {
			this.$element.remove();
			// any external bindings
			// [none]
			// set input value attrbute
			this.$element.find('input').each(function () {
				$(this).attr('value', $(this).val());
			});
			// empty elements to return to original markup
			// [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		render: function render() {
			var inputValue = this.parseInput(this.$input.val());
			var value = (inputValue !== '' && this.options.value === 0) ? inputValue : this.options.value;

			this.setValue(value);
		},

		output: function output(value, updateField) {
			updateField = (typeof updateField === 'boolean') ? updateField : true;

			if (updateField) {
				this.$input.val(value);
			}

			return value;
		},

		change: function change() {
			var newVal = this.$input.val() || '';

			this.setValue(newVal);

			this.changeFlag = false;
			this.triggerChangedEvent();
		},

		changeFlag: function changeFlag() {
			this.changeFlag = true;
		},

		stopSpin: function stopSpin() {
			if (this.switches.timeout !== undefined) {
				clearTimeout(this.switches.timeout);
				this.switches.count = 1;
				this.triggerChangedEvent();
			}
		},

		triggerChangedEvent: function triggerChangedEvent() {
			var currentValue = this.getValue();
			if (currentValue === this.lastValue) return;
			this.lastValue = currentValue;

			// Primary changed event
			this.$element.trigger('changed.fu.spinbox', this.output(currentValue, false));// no DOM update
		},

		startSpin: function startSpin(type) {
			if (!this.options.disabled) {
				var divisor = this.switches.count;

				if (divisor === 1) {
					this.step(type);
					divisor = 1;
				} else if (divisor < 3) {
					divisor = 1.5;
				} else if (divisor < 8) {
					divisor = 2.5;
				} else {
					divisor = 4;
				}

				this.switches.timeout = setTimeout($.proxy(function () {
					this.iterate(type);
				}, this), this.switches.speed / divisor);
				this.switches.count++;
			}
		},

		iterate: function iterate(type) {
			this.step(type);
			this.startSpin(type);
		},

		step: function step(isIncrease) {
			// isIncrease: true is up, false is down

			var digits, multiple, currentValue, limitValue;

			// trigger change event
			if (this.changeFlag) {
				this.change();
			}

			// get current value and min/max options
			currentValue = this.options.value;
			limitValue = isIncrease ? this.options.max : this.options.min;

			if ( (isIncrease ? currentValue < limitValue : currentValue > limitValue) ) {
				var newVal = currentValue + (isIncrease ? 1 : -1) * this.options.step;

				// raise to power of 10 x number of decimal places, then round
				if (this.options.step % 1 !== 0) {
					digits = (this.options.step + '').split('.')[1].length;
					multiple = Math.pow(10, digits);
					newVal = Math.round(newVal * multiple) / multiple;
				}

				// if outside limits, set to limit value
				if (isIncrease ? newVal > limitValue : newVal < limitValue) {
					this.setValue(limitValue);
				} else {
					this.setValue(newVal);
				}

			} else if (this.options.cycle) {
				var cycleVal = isIncrease ? this.options.min : this.options.max;
				this.setValue(cycleVal);
			}
		},

		getValue: function getValue() {
			var val = this.options.value
			if (this.options.decimalMark !== '.'){
				val = (val + '').split('.').join(this.options.decimalMark);
			}
			return val + this.unit;
		},

		setValue: function setValue(val) {
			//remove any i18n on the number
			if (this.options.decimalMark !== '.') {
				val = this.parseInput(val);
			}

			//are we dealing with united numbers?
			if(typeof val !== "number"){
				var potentialUnit = val.replace(/[0-9.-]/g, '');
				//make sure unit is valid, or else drop it in favor of current unit, or default unit (potentially nothing)
				this.unit = _isUnitLegal(potentialUnit, this.options.units) ? potentialUnit : this.options.defaultUnit;
			}

			var intVal = this.getIntValue(val);

			//make sure we are dealing with a number
			if (isNaN(parseFloat(intVal)) && !isFinite(intVal)) {
				return;
			}

			//conform
			intVal = this.checkMaxMin(intVal / 1);

			if(this.options.limitToStep){
				intVal = _limitToStep(intVal, this.options.step);
			}

			//cache the pure int value
			this.options.value = intVal;

			//prepare number for display
			val = intVal + this.unit;

			if (this.options.decimalMark !== '.'){
				val = (val + '').split('.').join(this.options.decimalMark);
			}

			//display number
			this.output(val);

			return this;
		},

		value: function value(val) {

			if (val || val === 0) {
				return this.setValue(val);
			} else {
				return this.getValue();
			}
		},

		parseInput: function parseInput(value) {
			value = (value + '').split(this.options.decimalMark).join('.');

			return value;
		},

		getIntValue: function getIntValue(value) {
			//if they didn't pass in a number, try and get the number
			value = (typeof value === "undefined") ? this.getValue() : value;
			// if there still isn't a number, abort
			if(typeof value === "undefined"){return;}

			if (typeof value === 'string'){
				value = this.parseInput(value);
			}

			value = parseFloat(value, 10);

			return value;
		},

		checkMaxMin: function checkMaxMin(value) {
			// if unreadable
			if (isNaN(parseFloat(value))) {
				return value;
			}

			// if not within range return the limit
			if (!(value <= this.options.max && value >= this.options.min)) {
				if(value >= this.options.max){
					value = this.options.max;
				}else{
					value = this.options.min;
				}
			}

			if(this.options.limitToStep && value % this.options.step > 0){
				//force round direction so that it stays within bounds
				value = _limitToStep(value, this.options.step, (value === this.options.min) ? 1 : -1);
			}

			return value;
		},

		disable: function disable() {
			this.options.disabled = true;
			this.$element.addClass('disabled');
			this.$input.attr('disabled', '');
			this.$element.find('button').addClass('disabled');
		},

		enable: function enable() {
			this.options.disabled = false;
			this.$element.removeClass('disabled');
			this.$input.removeAttr('disabled');
			this.$element.find('button').removeClass('disabled');
		},

		keydown: function keydown(event) {
			var keyCode = event.keyCode;
			if (keyCode === 38) {
				this.step(true);
			} else if (keyCode === 40) {
				this.step(false);
			}
		},

		keyup: function keyup(event) {
			var keyCode = event.keyCode;

			if (keyCode === 38 || keyCode === 40) {
				this.triggerChangedEvent();
			}
		},

		bindMousewheelListeners: function bindMousewheelListeners() {
			var inputEl = this.$input.get(0);
			if (inputEl.addEventListener) {
				//IE 9, Chrome, Safari, Opera
				inputEl.addEventListener('mousewheel', $.proxy(this.mousewheelHandler, this), false);
				// Firefox
				inputEl.addEventListener('DOMMouseScroll', $.proxy(this.mousewheelHandler, this), false);
			} else {
				// IE <9
				inputEl.attachEvent('onmousewheel', $.proxy(this.mousewheelHandler, this));
			}
		},

		mousewheelHandler: function mousewheelHandler(event) {
			if (!this.options.disabled) {
				var e = window.event || event;// old IE support
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				var self = this;

				clearTimeout(this.mousewheelTimeout);
				this.mousewheelTimeout = setTimeout(function () {
					self.triggerChangedEvent();
				}, 300);

				if (delta < 0) {
					this.step(true);
				} else {
					this.step(false);
				}

				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}

				return false;
			}
		}
	};


	// SPINBOX PLUGIN DEFINITION

	$.fn.spinbox = function spinbox(option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.spinbox');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.spinbox', (data = new Spinbox(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
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
		decimalMark: '.',
		defaultUnit: '',
		limitToStep: false
	};

	$.fn.spinbox.Constructor = Spinbox;

	$.fn.spinbox.noConflict = function noConflict() {
		$.fn.spinbox = old;
		return this;
	};


	// DATA-API

	$(document).on('mousedown.fu.spinbox.data-api', '[data-initialize=spinbox]', function (e) {
		var $control = $(e.target).closest('.spinbox');
		if (!$control.data('fu.spinbox')) {
			$control.spinbox($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=spinbox]').each(function () {
			var $this = $(this);
			if (!$this.data('fu.spinbox')) {
				$this.spinbox($this.data());
			}
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
