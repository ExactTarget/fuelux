/* global jQuery:true */

/*
 * Fuel UX Loader
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
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function LoaderWrapper ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.loader;

	// LOADER CONSTRUCTOR AND PROTOTYPE

	var Loader = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.loader.defaults, options);
	};

	Loader.prototype = {

		constructor: Loader,

		destroy: function () {
			this.$element.remove();
			// any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		ieRepaint: function () {},

		msieVersion: function () {},

		next: function () {},

		pause: function () {},

		play: function () {},

		previous: function () {},

		reset: function () {}
	};

	// LOADER PLUGIN DEFINITION

	$.fn.loader = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.loader');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.loader', (data = new Loader(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.loader.defaults = {};

	$.fn.loader.Constructor = Loader;

	$.fn.loader.noConflict = function () {
		$.fn.loader = old;
		return this;
	};

	// INIT LOADER ON DOMCONTENTLOADED

	$(function () {
		$('[data-initialize=loader]').each(function () {
			var $this = $(this);
			if (!$this.data('fu.loader')) {
				$this.loader($this.data());
			}
		});
	});

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
