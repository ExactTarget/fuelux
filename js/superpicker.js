/*
 * Fuel UX Superpicker
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

	var old = $.fn.superpicker;
	var EVENT_CALLBACK_MAP = { 'accepted': 'onAccept', 'cancelled': 'onCancel' };
	var DEFAULT_HEIGHT = 234;
	var DEFAULT_WIDTH = 350;

	// PLACARD CONSTRUCTOR AND PROTOTYPE

	var Superpicker = function (element, options) {
		var self = this;
		this.$element = $(element);
		this.options = $.extend({}, $.fn.superpicker.defaults, options);

		this.$accept = this.$element.find('.superpicker-accept');
		this.$cancel = this.$element.find('.superpicker-cancel');
		this.$field = this.$element.find('.superpicker-field');
		this.$footer = this.$element.find('.superpicker-footer');
		this.$header = this.$element.find('.superpicker-header');
		this.$popup = this.$element.find('.superpicker-popup');

		this.actualValue = null;
		this.clickStamp = '_';
		this.previousValue = '';
		if (this.options.revertOnCancel === -1) {
			this.options.revertOnCancel = (this.$accept.length > 0) ? true : false;
		}

		this.isInput = this.$field.is('input');

		this.$field.on('focus.fu.superpicker', $.proxy(this.show, this));
		this.$field.on('keydown.fu.superpicker', $.proxy(this.keyComplete, this));
		this.$accept.on('click.fu.superpicker', $.proxy(this.complete, this, 'accepted'));
		this.$cancel.on('click.fu.superpicker', function (e) {
			e.preventDefault(); self.complete('cancelled');
		});


	};

	Superpicker.prototype = {
		constructor: Superpicker,

		complete: function (action) {
			var func = this.options[ EVENT_CALLBACK_MAP[action] ];

			var obj = {
				previousValue: this.previousValue,
				value: this.$field.val()
			};
			if (func) {
				func(obj);
				this.$element.trigger(action + '.fu.superpicker', obj);
			} else {
				if (action === 'cancelled' && this.options.revertOnCancel) {
					this.$field.val(this.previousValue);
				}

				this.$element.trigger(action + '.fu.superpicker', obj);
				this.hide();
			}
		},

		keyComplete: function (e) {
			if (this.isInput && e.keyCode === 13) {
				this.complete('accepted');
				this.$field.blur();
			} else if (e.keyCode === 27) {
				this.complete('cancelled');
				this.$field.blur();
			}
		},

		destroy: function () {
			this.$element.remove();
			// remove any external bindings
			$(document).off('click.fu.superpicker.externalClick.' + this.clickStamp);
			// set input value attrbute
			this.$element.find('input').each(function () {
				$(this).attr('value', $(this).val());
			});
			// empty elements to return to original markup
			// [none]
			// return string of markup
			return this.$element[0].outerHTML;
		},

		disable: function () {
			this.$element.addClass('disabled');
			this.$field.attr('disabled', 'disabled');
			this.hide();
		},

		enable: function () {
			this.$element.removeClass('disabled');
			this.$field.removeAttr('disabled');
		},

		externalClickListener: function (e, force) {
			if (force === true || this.isExternalClick(e)) {
				this.complete(this.options.externalClickAction);
			}
		},

		hide: function () {
			if (!this.$element.hasClass('showing')) {
				return;
			}

			this.$element.removeClass('showing');
			$(document).off('click.fu.superpicker.externalClick.' + this.clickStamp);
			this.$element.trigger('hidden.fu.superpicker');
		},

		isExternalClick: function (e) {
			var el = this.$element.get(0);
			var exceptions = this.options.externalClickExceptions || [];
			var $originEl = $(e.target);
			var i, l;

			if (e.target === el || $originEl.parents('.superpicker:first').get(0) === el) {
				return false;
			} else {
				for (i = 0, l = exceptions.length; i < l; i++) {
					if ($originEl.is(exceptions[i]) || $originEl.parents(exceptions[i]).length > 0) {
						return false;
					}

				}
			}

			return true;
		},

		show: function () {
			var other;

			if (this.$element.hasClass('showing')) {
				return;
			}

			other = $(document).find('.superpicker.showing');
			if (other.length > 0) {
				if (other.data('fu.superpicker') && other.data('fu.superpicker').options.explicit) {
					return;
				}

				other.superpicker('externalClickListener', {}, true);
			}

			this.previousValue = this.$field.val();

			this.$element.addClass('showing');

			this.$popup.css('top', (this.$field.outerHeight(true)+4) + 'px');

			this.$popup.css('height', (this.options.height)?this.options.height : DEFAULT_HEIGHT + 'px');
			this.$popup.css('width', (this.options.width)?this.options.height : DEFAULT_WIDTH + 'px');

			this.$element.trigger('shown.fu.superpicker', this.actualValue);
			if (this.actualValue !== null) {
				this.actualValue = null;
			}

			this.clickStamp = new Date().getTime() + (Math.floor(Math.random() * 100) + 1);
			if (!this.options.explicit) {
				$(document).on('click.fu.superpicker.externalClick.' + this.clickStamp, $.proxy(this.externalClickListener, this));
			}
		}
	};

	// PLACARD PLUGIN DEFINITION

	$.fn.superpicker = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.superpicker');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.superpicker', (data = new Superpicker(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.superpicker.defaults = {
		onAccept: undefined,
		onCancel: undefined,
		externalClickAction: 'cancelled',
		externalClickExceptions: [],
		explicit: false,
		revertOnCancel: -1//negative 1 will check for an '.placard-accept' button. Also can be set to true or false
	};

	$.fn.superpicker.Constructor = Superpicker;

	$.fn.superpicker.noConflict = function () {
		$.fn.superpicker = old;
		return this;
	};

	// DATA-API

	$(document).on('focus.fu.superpicker.data-api', '[data-initialize=superpicker]', function (e) {
		var $control = $(e.target).closest('.superpicker');
		if (!$control.data('fu.superpicker')) {
			$control.superpicker($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=superpicker]').each(function () {
			var $this = $(this);
			if ($this.data('fu.superpicker')) return;
			$this.superpicker($this.data());
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
