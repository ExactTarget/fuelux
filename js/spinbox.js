/*
 * Fuel UX Spinbox
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

	var old = $.fn.spinbox;

	// SPINBOX CONSTRUCTOR AND PROTOTYPE

	var Spinbox = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.spinbox.defaults, options);
		this.$input = this.$element.find('.spinbox-input');
		this.$element.on('focusin', this.$input, $.proxy(this.changeFlag, this));
		this.$element.on('focusout', this.$input, $.proxy(this.change, this));

		if (this.options.hold) {
			this.$element.on('mousedown', '.spinbox-up', $.proxy(function() { this.startSpin(true); } , this));
			this.$element.on('mouseup', '.spinbox-up, .spinbox-down', $.proxy(this.stopSpin, this));
			this.$element.on('mouseout', '.spinbox-up, .spinbox-down', $.proxy(this.stopSpin, this));
			this.$element.on('mousedown', '.spinbox-down', $.proxy(function() {this.startSpin(false);} , this));
		} else {
			this.$element.on('click', '.spinbox-up', $.proxy(function() { this.step(true); } , this));
			this.$element.on('click', '.spinbox-down', $.proxy(function() { this.step(false); }, this));
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

		this.lastValue = null;

		this.render();

		if (this.options.disabled) {
			this.disable();
		}
	};

	Spinbox.prototype = {
		constructor: Spinbox,

		render: function () {
			var inputValue = this.$input.val();
			var maxUnitLength = '';

			if (inputValue) {
				this.value(inputValue);
			} else {
				this.$input.val(this.options.value);
			}

			if ( this.options.units.length ) {
				$.each(this.options.units, function(index, value){
					if( value.length > maxUnitLength.length) {
						maxUnitLength = value;
					}
				});
			}

			this.$input.attr('maxlength', (this.options.max + maxUnitLength).split('').length);
		},

		change: function () {
			var newVal = this.$input.val();

			if(this.options.units.length){
				this.setMixedValue(newVal);
			} else if (newVal/1){
				this.options.value = this.checkMaxMin(newVal/1);
			} else {
				newVal = this.checkMaxMin(newVal.replace(/[^0-9.-]/g,'') || '');
				this.options.value = newVal/1;
			}

			this.changeFlag = false;
			this.triggerChangedEvent();
		},

		changeFlag: function(){
			this.changeFlag = true;
		},

		stopSpin: function () {
			if(this.switches.timeout!==undefined){
				clearTimeout(this.switches.timeout);
				this.switches.count = 1;
				this.triggerChangedEvent();
			}
		},

		triggerChangedEvent: function () {
			var currentValue = this.value();
			if (currentValue === this.lastValue) return;

			this.lastValue = currentValue;

			// Primary changed event
			this.$element.trigger('changed', currentValue);

			// Undocumented, kept for backward compatibility
			this.$element.trigger('change');
		},

		startSpin: function (type) {

			if (!this.options.disabled) {
				var divisor = this.switches.count;

				if (divisor === 1) {
					this.step(type);
					divisor = 1;
				} else if (divisor < 3){
					divisor = 1.5;
				} else if (divisor < 8){
					divisor = 2.5;
				} else {
					divisor = 4;
				}

				this.switches.timeout = setTimeout($.proxy(function() {this.iterator(type);} ,this),this.switches.speed/divisor);
				this.switches.count++;
			}
		},

		iterator: function (type) {
			this.step(type);
			this.startSpin(type);
		},

		step: function (dir) {
			var digits, multiple, curValue, limValue;

			if( this.changeFlag ) this.change();

			curValue = this.options.value;
			limValue = dir ? this.options.max : this.options.min;

			if ((dir ? curValue < limValue : curValue > limValue)) {
				var newVal = curValue + (dir ? 1 : -1) * this.options.step;

				if(this.options.step % 1 !== 0){
					digits = (this.options.step + '').split('.')[1].length;
					multiple = Math.pow(10, digits);
					newVal = Math.round(newVal * multiple) / multiple;
				}

				if (dir ? newVal > limValue : newVal < limValue) {
					this.value(limValue);
				} else {
					this.value(newVal);
				}
			} else if (this.options.cycle) {
				var cycleVal = dir ? this.options.min : this.options.max;
				this.value(cycleVal);
			}
		},

		value: function (value) {

			if ( value || value === 0 ) {
				if( this.options.units.length ) {
					this.setMixedValue(value + (this.unit || ''));
					return this;
				} else if ( !isNaN(parseFloat(value)) && isFinite(value) ) {
					this.options.value = value/1;
					this.$input.val(value + (this.unit ? this.unit : ''));
					return this;
				}
			} else {
				if( this.changeFlag ) this.change();

				if( this.unit ){
					return this.options.value + this.unit;
				} else {
					return this.options.value;
				}
			}
		},

		isUnitLegal: function (unit) {
			var legalUnit;

			$.each(this.options.units, function(index, value){
				if( value.toLowerCase() === unit.toLowerCase()){
					legalUnit = unit.toLowerCase();
					return false;
				}
			});

			return legalUnit;
		},

		setMixedValue: function( value ){
			var unit = value.replace(/[^a-zA-Z]/g,'');
			var newVal = value.replace(/[^0-9.-]/g,'');

			if(unit){
				unit = this.isUnitLegal(unit);
			}

			this.options.value = this.checkMaxMin(newVal/1);
			this.unit = unit || undefined;
			this.$input.val(this.options.value + (unit || '') );
		},

		checkMaxMin: function(value){
			var limit;

			if ( isNaN(parseFloat(value)) ) {
				return value;
			}

			if ( value <= this.options.max && value >= this.options.min ){
				return value;
			} else {
				limit = value >= this.options.max ? this.options.max : this.options.min;

				this.$input.val(limit);
				return limit;
			}
		},

		disable: function () {
			this.options.disabled = true;
			this.$input.attr('disabled','');
			this.$element.find('button').addClass('disabled');
		},

		enable: function () {
			this.options.disabled = false;
			this.$input.removeAttr("disabled");
			this.$element.find('button').removeClass('disabled');
		}
	};


	// SPINBOX PLUGIN DEFINITION

	$.fn.spinbox = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'spinbox' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('spinbox', (data = new Spinbox( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.spinbox.defaults = {
		value: 1,
		min: 0,
		max: 999,
		step: 1,
		hold: true,
		speed: 'medium',
		disabled: false,
		cycle: false,
		units: []
	};

	$.fn.spinbox.Constructor = Spinbox;

	$.fn.spinbox.noConflict = function () {
		$.fn.spinbox = old;
		return this;
	};


	// SPINBOX DATA-API

	$(function () {

		$('.spinbox').each(function () {
			var $this = $(this);
			if (!$this.data('spinbox')) {
				$this.spinbox($this.data());
			}
		});

		$('body').on('mousedown.spinbox.data-api', '.spinbox', function () {
			var $this = $(this);
			if ($this.data('spinbox')) return;
			$this.spinbox($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --