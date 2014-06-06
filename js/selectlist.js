/*
 * Fuel UX Button Dropdown
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

	var old = $.fn.selectlist;
	// SELECT CONSTRUCTOR AND PROTOTYPE

	var Selectlist = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.selectlist.defaults, options);

		this.$button = this.$element.find('.btn.dropdown-toggle');
		this.$hiddenField = this.$element.find('.hidden-field');
		this.$label = this.$element.find('.selected-label');

		this.$element.on('click.fu.selectlist', '.dropdown-menu a', $.proxy(this.itemClicked, this));
		this.setDefaultSelection();

		if (options.resize === 'auto') {
			this.resize();
		}
	};

	Selectlist.prototype = {

		constructor: Selectlist,

		doSelect: function($item){
			this.$selectedItem = $item;
			this.$hiddenField.val(this.$selectedItem.attr('data-value'));
			this.$label.text(this.$selectedItem.text());
		},

		itemClicked: function (e) {
			this.$element.trigger('clicked.fu.selectlist', this.$selectedItem);

			e.preventDefault();

			// is clicked element different from currently selected element?
			if( !($(e.target).parent().is( this.$selectedItem) ) ) {
				this.itemChanged(e);
			}

		},

		itemChanged: function (e) {
			this.$selectedItem = $(e.target).parent();

			// store value in hidden field for form submission
			this.$hiddenField.val(this.$selectedItem.attr('data-value'));
			this.$label.text(this.$selectedItem.text());

			// pass object including text and any data-attributes
			// to onchange event
			var data = this.selectedItem();
			// trigger changed event
			this.$element.trigger('changed.fu.selectlist', data);
		},

		resize: function() {
			var newWidth = 0;
			var sizer = $('<div/>').addClass('selectlist-sizer');
			var width = 0;

			if( Boolean( $(document).find( 'html' ).hasClass( 'fuelux' ) ) ) {
				// default behavior for fuel ux setup. means fuelux was a class on the html tag
				$( document.body ).append( sizer );
			} else {
				// fuelux is not a class on the html tag. So we'll look for the first one we find so the correct styles get applied to the sizer
				$( '.fuelux:first' ).append( sizer );
			}

			// iterate through each item to find longest string
			this.$element.find('a').each(function () {
				sizer.text($(this).text());
				newWidth = sizer.outerWidth();
				if(newWidth > width) {
					width = newWidth;
				}
			});

			sizer.remove();

			//TODO: betting this is somewhat off with box-sizing: border-box
			this.$label.width(width);
		},

		selectedItem: function() {
			var txt = this.$selectedItem.text();
			return $.extend({ text: txt }, this.$selectedItem.data());
		},

		selectByText: function(text) {
			var $item = $([]);
			this.$element.find('li').each(function(){
				if((this.textContent || this.innerText || $(this).text() || '').toLowerCase() === (text || '').toLowerCase()){
					$item = $(this);
					return false;
				}
			});
			this.doSelect($item);
		},

		selectByValue: function(value) {
			var selector = 'li[data-value="' + value + '"]';
			this.selectBySelector(selector);
		},

		selectByIndex: function(index) {
			// zero-based index
			var selector = 'li:eq(' + index + ')';
			this.selectBySelector(selector);
		},

		selectBySelector: function(selector) {
			var $item = this.$element.find(selector);
			this.doSelect($item);
		},

		setDefaultSelection: function() {
			var selector = 'li[data-selected=true]:first';
			var item = this.$element.find(selector);
			if(item.length === 0) {
				// select first item
				this.selectByIndex(0);
			}
			else {
				// select by data-attribute
				this.selectBySelector(selector);
				item.removeData('selected');
				item.removeAttr('data-selected');
			}
		},

		enable: function() {
			this.$button.removeClass('disabled');
		},

		disable: function() {
			this.$button.addClass('disabled');
		}

	};


	// SELECT PLUGIN DEFINITION

	$.fn.selectlist = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('selectlist');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('selectlist', (data = new Selectlist(this, options)));
			if (typeof option === 'string') methodReturn = data[option].apply(data, args);
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.selectlist.defaults = {};

	$.fn.selectlist.Constructor = Selectlist;

	$.fn.selectlist.noConflict = function () {
		$.fn.selectlist = old;
		return this;
	};


	// DATA-API

	$(document).on('mousedown.fu.selectlist.data-api', '[data-initialize=selectlist]', function () {
		var $this = $(this);
		if ($this.data('selectlist')) {
			return;
		}
		$this.selectlist($this.data());
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=selectlist]').each(function () {
			var $this = $(this);
			if (!$this.data('selectlist')) {
				$this.selectlist($this.data());
			}
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --
