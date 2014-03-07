/*
 * Fuel UX Search
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

	var old = $.fn.search;

	// SEARCH CONSTRUCTOR AND PROTOTYPE

	var Search = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.search.defaults, options);

		this.$button = this.$element.find('button')
			.on('click', $.proxy(this.buttonclicked, this));

		this.$input = this.$element.find('input')
			.on('keydown', $.proxy(this.keypress, this))
			.on('keyup', $.proxy(this.keypressed, this));

		this.$icon = this.$element.find('i');
		this.activeSearch = '';
	};

	Search.prototype = {

		constructor: Search,

		search: function (searchText) {
			this.$icon.attr('class', 'icon-remove');
			this.activeSearch = searchText;
			this.$element.trigger('searched', searchText);
		},

		clear: function () {
			this.$icon.attr('class', 'icon-search');
			this.activeSearch = '';
			this.$input.val('');
			this.$element.trigger('cleared');
		},

		action: function () {
			var val = this.$input.val();
			var inputEmptyOrUnchanged = val === '' || val === this.activeSearch;

			if (this.activeSearch && inputEmptyOrUnchanged) {
				this.clear();
			} else if (val) {
				this.search(val);
			}
		},

		buttonclicked: function (e) {
			e.preventDefault();
			if ($(e.currentTarget).is('.disabled, :disabled')) return;
			this.action();
		},

		keypress: function (e) {
			if (e.which === 13) {
				e.preventDefault();
			}
		},

		keypressed: function (e) {
			var val, inputPresentAndUnchanged;

			if (e.which === 13) {
				e.preventDefault();
				this.action();
			} else {
				val = this.$input.val();
				inputPresentAndUnchanged = val && (val === this.activeSearch);
				this.$icon.attr('class', inputPresentAndUnchanged ? 'icon-remove' : 'icon-search');
			}
		},

		disable: function () {
			this.$input.attr('disabled', 'disabled');
			this.$button.addClass('disabled');
		},

		enable: function () {
			this.$input.removeAttr('disabled');
			this.$button.removeClass('disabled');
		}

	};


	// SEARCH PLUGIN DEFINITION

	$.fn.search = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this = $( this );
			var data = $this.data( 'search' );
			var options = typeof option === 'object' && option;

			if (!data) $this.data('search', (data = new Search(this, options)));
			if (typeof option === 'string') methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.search.defaults = {};

	$.fn.search.Constructor = Search;

	$.fn.search.noConflict = function () {
		$.fn.search = old;
		return this;
	};


	// SEARCH DATA-API

	$(function () {
		$('body').on('mousedown.search.data-api', '.search', function () {
			var $this = $(this);
			if ($this.data('search')) return;
			$this.search($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --