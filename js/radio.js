/*
 * Fuel UX Radio
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

	var old = $.fn.radio;

	// RADIO CONSTRUCTOR AND PROTOTYPE

	var Radio = function (element, options) {
		this.options = $.extend({}, $.fn.radio.defaults, options);

		if(element.tagName.toLowerCase() !== 'label') {
			//console.log('initialize radio on the label that wraps the radio');
			return;
		}

		// cache elements
		this.$label = $(element);
		this.$radio = this.$label.find('input[type="radio"]');
		this.groupName = this.$radio.attr('name'); // don't cache group itself since items can be added programmatically

		// determine if a toggle container is specified
		var containerSelector = this.$radio.attr('data-toggle');
		this.$toggleContainer = $(containerSelector);

		// handle internal events
		this.$radio.on('change', $.proxy(this.itemchecked, this));

		// set default state
		this.setInitialState();
	};

	Radio.prototype = {

		constructor: Radio,

		setInitialState: function() {
			var $radio = this.$radio;
			var $lbl = this.$label;

			// get current state of input
			var checked = $radio.prop('checked');
			var disabled = $radio.prop('disabled');

			// sync label class with input state
			this.setCheckedState($radio, checked);
			this.setDisabledState($radio, disabled);
		},

		resetGroup: function() {
			var $radios = $('input[name="' + this.groupName + '"]');
			$radios.each(function(index, item) {
				var $radio = $(item);
				var $lbl = $radio.parent();
				var containerSelector = $radio.attr('data-toggle');
				var $containerToggle = $(containerSelector);


				$lbl.removeClass('checked');
				$containerToggle.addClass('hidden');
			});
		},

		setCheckedState: function(element, checked) {
			var $radio = element;
			var $lbl = $radio.parent();
			var containerSelector = $radio.attr('data-toggle');
			var $containerToggle = $(containerSelector);

			if(checked) {
				// reset all items in group
				this.resetGroup();

				$radio.prop('checked', true);
				$lbl.addClass('checked');
				$containerToggle.removeClass('hide hidden');
				$lbl.trigger('checked.fu.radio');
			}
			else {
				$radio.prop('checked', false);
				$lbl.removeClass('checked');
				$containerToggle.addClass('hidden');
				$lbl.trigger('unchecked.fu.radio');
			}

			$lbl.trigger('changed.fu.radio', checked);
		},

		setDisabledState: function(element, disabled) {
			var $radio = element;
			var $lbl = this.$label;

			if(disabled) {
				this.$radio.prop('disabled', true);
				$lbl.addClass('disabled');
				$lbl.trigger('disabled.fu.radio');
			}
			else {
				this.$radio.prop('disabled', false);
				$lbl.removeClass('disabled');
				$lbl.trigger('enabled.fu.radio');
			}
		},

		itemchecked: function (evt) {
			var $radio = $(evt.target);
			this.setCheckedState($radio, true);
		},

		check: function () {
			this.setCheckedState(this.$radio, true);
		},

		uncheck: function () {
			this.setCheckedState(this.$radio, false);
		},

		isChecked: function () {
			var checked = this.$radio.prop('checked');
			return checked;
		},

		enable: function () {
			this.setDisabledState(this.$radio, false);
		},

		disable: function () {
			this.setDisabledState(this.$radio, true);
		},

		destroy: function () {
			this.$label.remove();
			// remove any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			return this.$label[0].outerHTML;
		}
	};

	Radio.prototype.getValue = Radio.prototype.isChecked;

	// RADIO PLUGIN DEFINITION

	$.fn.radio = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.radio');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.radio', (data = new Radio(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.radio.defaults = {};

	$.fn.radio.Constructor = Radio;

	$.fn.radio.noConflict = function () {
		$.fn.radio = old;
		return this;
	};


	// DATA-API

	$(document).on('mouseover.fu.radio.data-api', '[data-initialize=radio]', function (e) {
		var $control = $(e.target);
		if (!$control.data('fu.radio')) {
			$control.radio($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=radio]').each(function () {
			var $this = $(this);
			if (!$this.data('fu.radio')) {
				$this.radio($this.data());
			}
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --