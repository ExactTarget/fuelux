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
		this.$parent = this.$label.parent('.checkbox');
		this.$toggleContainer = null;

		if(this.$parent.length===0){
			this.$parent = null;
		}

		var toggleSelector = this.$chk.attr('data-toggle');
		if(toggleSelector) {
			this.$toggleContainer = $(toggleSelector);
		}

		// set default state
		this.setState(this.$chk);

		// handle events
		this.$chk.on('change.fu.checkbox', $.proxy(this.itemchecked, this));
	};

	Checkbox.prototype = {

		constructor: Checkbox,

		setState: function ($chk) {
			$chk = $chk || this.$chk;

			var checked = $chk.is(':checked');
			var disabled = !!$chk.prop('disabled');

			// reset classes
			this.$label.removeClass('checked disabled');
			if(this.$parent){
				this.$parent.removeClass('checked disabled');
			}

			// set state of checkbox
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

		enable: function () {
			this.$chk.attr('disabled', false);
			this.$label.removeClass('disabled');
			if(this.$parent){
				this.$parent.removeClass('disabled');
			}
		},

		disable: function () {
			this.$chk.attr('disabled', true);
			this.$label.addClass('disabled');
			if(this.$parent){
				this.$parent.addClass('disabled');
			}
		},

		toggle: function () {
			this.$chk.click();
		},

		toggleContainer: function(){
			if(this.$toggleContainer) {
				if(this.isChecked()) {
					this.$toggleContainer.removeClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'false');
				}else {
					this.$toggleContainer.addClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'true');
				}
			}
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

			if( !data ) {
				$this.data('checkbox', (data = new Checkbox(this, options)));
			}

			if( typeof option === 'string' ) {
				methodReturn = data[ option ].apply( data, args );
			}
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.checkbox.defaults = {};

	$.fn.checkbox.Constructor = Checkbox;

	$.fn.checkbox.noConflict = function () {
		$.fn.checkbox = old;
		return this;
	};

	// DATA-API

	$(document).on('mouseover.fu.checkbox.data-api', '[data-initialize=checkbox]', function (e) {
		var $control = $(e.target).closest('.checkbox').find('[type=checkbox]');
		if ( !$control.data('checkbox') ) {
			$control.checkbox($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=checkbox] [type=checkbox]').each(function () {
			var $this = $(this);
			if (!$this.data('checkbox')) {
				$this.checkbox($this.data());
			}
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --