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
		this.$element         = $(element);
		this.$label           = this.$element.parent();
		this.$parent          = this.$label.parent('.checkbox');
		this.$toggleContainer = this.$element.attr('data-toggle');

		if( this.$parent.length === 0 ) {
			this.$parent = null;
		}

		if( Boolean( this.$toggleContainer ) ) {
			this.$toggleContainer = $( this.$toggleContainer );
		} else {
			this.$toggleContainer = null;
		}

		// set default state
		this.setState( this.$element );

		// handle events
		this.$element.on('change.fu.checkbox', $.proxy( this.itemchecked, this ));
	};

	Checkbox.prototype = {

		constructor: Checkbox,

		setState: function( $chk ) {
			$chk = $chk || this.$element;

			var checked  = $chk.is(':checked');
			var disabled = !!$chk.prop('disabled');

			// reset classes
			this.$label.removeClass('checked disabled');

			if( this.$parent ) {
				this.$parent.removeClass('checked disabled');
			}

			// set state of checkbox
			if( checked === true ) {
				this.$label.addClass('checked');

				if( this.$parent ) {
					this.$parent.addClass('checked');
				}
			}

			if( disabled === true ) {
				this.$label.addClass('disabled');

				if( this.$parent ){
					this.$parent.addClass('disabled');
				}
			}

			//toggle container
			this.toggleContainer();
		},

		enable: function() {
			this.$element.attr('disabled', false);
			this.$label.removeClass('disabled');

			if( this.$parent ) {
				this.$parent.removeClass('disabled');
			}
		},

		disable: function() {
			this.$element.attr('disabled', true);
			this.$label.addClass('disabled');

			if( this.$parent ) {
				this.$parent.addClass( 'disabled' );
			}
		},

		toggle: function() {
			this.$element.click();
		},

		toggleContainer: function(){
			if( this.$toggleContainer ) {
				if( this.isChecked() ) {
					this.$toggleContainer.removeClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'false');
				}else {
					this.$toggleContainer.addClass('hide');
					this.$toggleContainer.attr('aria-hidden', 'true');
				}
			}
		},

		itemchecked: function (e) {
			this.setState( $( e.target ) );
		},

		check: function () {
			this.$element.prop('checked', true);
			this.setState( this.$element );
		},

		uncheck: function () {
			this.$element.prop('checked', false);
			this.setState( this.$element );
		},

		isChecked: function () {
			return this.$element.is(':checked');
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


	// SET CHECKBOX DEFAULT VALUE ON DOMCONTENTLOADED

	$(function () {
		$('.checkbox-custom > input[type=checkbox]').each(function () {
			var $this = $(this);
			if (!$this.data('checkbox')) {
				$this.checkbox($this.data());
			}
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --
