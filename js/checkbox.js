/*
 * Fuel UX Checkbox
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

	var old = $.fn.checkbox;

	// CHECKBOX CONSTRUCTOR AND PROTOTYPE

	var Checkbox = function (element, options) {
		this.options = $.extend({}, $.fn.checkbox.defaults, options);

		// cache elements
		this.$chk = $(element);
		this.$label = this.$chk.parent();


		// set default state
		this.setState(this.$chk);

		// handle events
		this.$chk.on('change', $.proxy(this.itemchecked, this));
	};

	Checkbox.prototype = {

		constructor: Checkbox,

		setState: function ($chk) {
			$chk = $chk || this.$chk;

			var checked = $chk.is(':checked');
			var disabled = !!$chk.prop('disabled');

			// reset classes
			this.$label.removeClass('checked disabled');

			// set state of checkbox
			if (checked === true) {
				this.$label.addClass('checked');
			}
			if (disabled === true) {
				this.$label.addClass('disabled');
			}
		},

		enable: function () {
			this.$chk.attr('disabled', false);
			this.$label.removeClass('disabled');
		},

		disable: function () {
			this.$chk.attr('disabled', true);
			this.$label.addClass('disabled');
		},

		toggle: function () {
			this.$chk.click();
		},

		itemchecked: function (e) {
			var chk = $(e.target);
			this.setState(chk);
		},

		check: function () {
			this.$chk.prop('checked', true);
			this.setState(this.$chk);
		},

		uncheck: function () {
			this.$chk.prop('checked', false);
			this.setState(this.$chk);
		},

		isChecked: function () {
			return this.$chk.is(':checked');
		}
	};


	// CHECKBOX PLUGIN DEFINITION

	$.fn.checkbox = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data('checkbox');
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('checkbox', (data = new Checkbox(this, options)));
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.checkbox.defaults = {};

	$.fn.checkbox.Constructor = Checkbox;

	$.fn.checkbox.noConflict = function () {
		$.fn.checkbox = old;
		return this;
	};


	// CHECKBOX DATA-API

	$(function () {
		$(window).on('load', function () {
			//$('i.checkbox').each(function () {
			$('.checkbox-custom > input[type=checkbox]').each(function () {
				var $this = $(this);
				if ($this.data('checkbox')) return;
				$this.checkbox($this.data());
			});
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --