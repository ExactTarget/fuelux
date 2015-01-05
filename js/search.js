/*
 * Fuel UX Search
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

		this.$button = this.$element.find('button');
		this.$input = this.$element.find('input');
		this.$icon = this.$element.find('.glyphicon');

		this.$button.on('click.fu.search', $.proxy(this.buttonclicked, this));
		this.$input.on('keydown.fu.search', $.proxy(this.keypress, this));
		this.$input.on('keyup.fu.search', $.proxy(this.keypressed, this));

		this.activeSearch = '';
	};

	Search.prototype = {

		constructor: Search,

		destroy: function() {
			this.$element.remove();
			// any external bindings
			// [none]
			// set input value attrbute
			this.$element.find('input').each(function() {
				$(this).attr('value', $(this).val());
			});
			// empty elements to return to original markup
			// [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		search: function (searchText) {
			if( this.$icon.hasClass('glyphicon') ) {
				this.$icon.removeClass('glyphicon-search').addClass('glyphicon-remove');
			}
			this.activeSearch = searchText;
			this.$element.addClass('searched');
			this.$element.trigger('searched.fu.search', searchText);
		},

		clear: function () {
			if( this.$icon.hasClass('glyphicon') ) {
				this.$icon.removeClass('glyphicon-remove').addClass('glyphicon-search');
			}
			this.activeSearch = '';
			this.$input.val('');
			this.$element.removeClass('searched');
			this.$element.trigger('cleared.fu.search');
		},

		action: function () {
			var val = this.$input.val();
			var inputEmptyOrUnchanged = (val === '' || val === this.activeSearch);

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
			var remove = 'glyphicon-remove';
			var search = 'glyphicon-search';
			var val;

			if (e.which === 13) {
				e.preventDefault();
				this.action();
			}
			else if (e.which === 9) {
				e.preventDefault();
			}
			else {
				val = this.$input.val();

				if(val!==this.activeSearch || !val){
					this.$icon.removeClass(remove).addClass(search);
					if(val) {
						this.$element.removeClass('searched');
					}
					else if (this.options.clearOnEmpty){
						this.clear();
					}
				}
				else{
					this.$icon.removeClass(search).addClass(remove);
				}
			}
		},

		disable: function () {
			this.$element.addClass('disabled');
			this.$input.attr('disabled', 'disabled');
			this.$button.addClass('disabled');
		},

		enable: function () {
			this.$element.removeClass('disabled');
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
			var data = $this.data('fu.search');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('fu.search', (data = new Search(this, options)));
			if (typeof option === 'string') methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.search.defaults = {
		clearOnEmpty: false
	};

	$.fn.search.Constructor = Search;

	$.fn.search.noConflict = function () {
		$.fn.search = old;
		return this;
	};


	// DATA-API

	$(document).on('mousedown.fu.search.data-api', '[data-initialize=search]', function (e) {
		var $control = $(e.target).closest('.search');
		if ( !$control.data('fu.search') ) {
			$control.search($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=search]').each(function () {
			var $this = $(this);
			if ($this.data('fu.search')) return;
			$this.search($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --