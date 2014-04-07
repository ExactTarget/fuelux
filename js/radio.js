/*
 * Fuel UX Radio
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

	var old = $.fn.radio;

	// RADIO CONSTRUCTOR AND PROTOTYPE

	var Radio = function (element, options) {
		this.options = $.extend({}, $.fn.radio.defaults, options);

		// cache elements
		this.$radio = $(element);
		this.$label = this.$radio.parent();
		this.groupName = this.$radio.attr('name');
		this.$parent = this.$label.parent('.radio');
		this.$toggleContainer = null;

		if(this.$parent.length===0){
			this.$parent = null;
		}

		var toggleSelector = this.$radio.attr('data-toggle');
		if(toggleSelector) {
			this.$toggleContainer = $(toggleSelector);
		}

		// set default state
		this.setState(this.$radio);

		// handle events
		this.$radio.on('change', $.proxy(this.itemchecked, this));
	};

	Radio.prototype = {

		constructor: Radio,

		setState: function ($radio) {
			$radio = $radio || this.$radio;

			var checked = $radio.is(':checked');
			var disabled = !!$radio.prop('disabled');

			this.$label.removeClass('checked');
			if(this.$parent){
				this.$parent.removeClass('checked disabled');
			}

			// set state of radio
			if (checked === true) {
				this.$label.addClass('checked');
				if(this.$parent){
					this.$parent.addClass('checked');
				}
			}
			if (disabled === true) {
				this.$label.addClass('disabled');
				if(this.$parent){
					this.$parent.addClass('disabled');
				}
			}

			//toggle container
			this.toggleContainer();
		},

		resetGroup: function () {
			var group = $('input[name="' + this.groupName + '"]');

			group.each(function(){
				var lbl = $(this).parent('label');
				lbl.removeClass('checked');
				lbl.parent('.radio').removeClass('checked');
			});
		},

		enable: function () {
			this.$radio.attr('disabled', false);
			this.$label.removeClass('disabled');
			if(this.$parent){
				this.$parent.removeClass('disabled');
			}
		},

		disable: function () {
			this.$radio.attr('disabled', true);
			this.$label.addClass('disabled');
			if(this.$parent){
				this.$parent.addClass('disabled');
			}
		},

		itemchecked: function (e) {
			var radio = $(e.target);

			this.resetGroup();
			this.setState(radio);
		},

		check: function () {
			this.resetGroup();
			this.$radio.prop('checked', true);
			this.setState(this.$radio);
		},

		toggleContainer: function() {
			var group;
			if(this.$toggleContainer) {
				// show corresponding container for currently selected radio
				if(this.isChecked()) {
					// hide containers for each item in group
					group = $('input[name="' + this.groupName + '"]');
					group.each(function(){
						var selector = $(this).attr('data-toggle');
						$(selector).hide();
					});
					this.$toggleContainer.show();
				}else {
					this.$toggleContainer.hide();
				}

			}
		},

		uncheck: function () {
			this.$radio.prop('checked', false);
			this.setState(this.$radio);
		},

		isChecked: function () {
			return this.$radio.is(':checked');
		}
	};


	// RADIO PLUGIN DEFINITION

	$.fn.radio = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'radio' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('radio', (data = new Radio( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.radio.defaults = {};

	$.fn.radio.Constructor = Radio;

	$.fn.radio.noConflict = function () {
		$.fn.radio = old;
		return this;
	};


	// SET RADIO DEFAULT VALUE ON DOMCONTENTLOADED

	$(function () {
		$('.radio-custom > input[type=radio]').each(function () {
			var $this = $(this);
			if ($this.data('radio')) return;
			$this.radio($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --