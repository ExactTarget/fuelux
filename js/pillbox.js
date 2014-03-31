/*
 * Fuel UX Pillbox
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
    
	var old = $.fn.pillbox;

	// PILLBOX CONSTRUCTOR AND PROTOTYPE

	var Pillbox = function (element, options) {
		this.$element = $(element);
		this.$input = this.$element.find('.pillbox-input');
		this.$ul    = this.$element.find('ul');

		this.options = $.extend({}, $.fn.pillbox.defaults, options);
		//CREATING AN OBJECT OUT OF THE KEY CODE ARRAY SO WE DONT HAVE TO LOOP THROUGH IT ON EVERY KEY STROKE
		this.acceptKeyCodes = this._generateObject(this.options.acceptKeyCodes);

		this.$element.on('click', 'li', $.proxy(this.itemclicked, this));
		this.$element.on('click', $.proxy(this.inputFocus, this));

		this.$element.on('keydown', '.pillbox-input', $.proxy(this.inputEvent, this));
	};

	Pillbox.prototype = {
		constructor : Pillbox,

		items: function() {
			return this.$element.find('li').map(function() {
				var $this = $(this);
				return $.extend({
					text : $this.text()
				}, $this.data());
			}).get();
		},

		itemclicked: function(e) {
			var $li = $(e.currentTarget);
			var data = $.extend({
				text : $li.html()
			}, $li.data());

			$li.remove();
			e.preventDefault();

			this.$element.trigger('removed', data);
		},

		itemCount: function() {
			return this.$element.find('li').length;
		},

		addItem: function(text, value) {
			var data = {
				text: text,
				value: value ? value : text,
				el: '<li></li>'
			};

			if(this.options.dataSource){
				this.options.dataSource( data, $.proxy(this.placeItem,this));
			} else {
				this.placeItem(data);
			}
		},

		placeItem: function(data){
			var $li = $(data.el);

			$li.attr('data-value',data.value);
			$li.html(data.text);

			if( this.$element.find('li').length > 0 ) {
				this.$element.find('li:last').after($li);
			} else {
				this.$ul.prepend($li);
			}

			this.$element.trigger( 'added', { text: data.text, value: data.value } );

			if( !this.options.dataSource ) {
				return $li;
			}
		},

		inputEvent: function(e){
			var self = this;
			var val = this.$input.val();

			if( this.acceptKeyCodes[e.keyCode] ){
				if( val.length ) {
					this.addItem(val);

					//this is kinda weird but prevents commas and other accepts characters from showing up in the input
					//the hide and show are to prevent character flashing
					this.$input.hide();
					setTimeout(function(){
						self.$input.show().val('').attr({size:10});
					});
				}
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {
				if( !val.length ) {
					this.$element.find('li:last').remove();
				}
			} else if ( val.length > 10 ) {
				this.$input.attr({size:val.length + 2});
			}
		},

		removeBySelector: function(selector, trigger) {
			if( typeof trigger === "undefined" ) {
				trigger = true;
			}

			this.$element.find('ul').find(selector).remove();

			if( !!trigger ) {
				this._removePillTrigger( { method: 'removeBySelector', removedSelector: selector } );
			}
		},

		removeByValue: function(value) {
			var selector = 'li[data-value="' + value + '"]';

			this.removeBySelector( selector, false );
			this._removePillTrigger( { method: 'removeByValue', removedValue: value } );
		},

		removeByText: function(text) {
			var selector = 'li:contains("' + text + '")';

			this.removeBySelector( selector, false );
			this._removePillTrigger( { method: 'removeByText', removedText: text } );
		},

		inputFocus: function(e) {
			this.$element.find('.pillbox-input').focus();
		},

		clear: function() {
			this.$element.find('ul').empty();
		},

		_removePillTrigger: function( removedBy ) {
			this.$element.trigger( 'removed', removedBy );
		},

		_generateObject: function(data){
			var obj = {};

			$.each(data, function(index,value){
				obj[value] = true;
			});

			return obj;
		}
	};

	// PILLBOX PLUGIN DEFINITION

	$.fn.pillbox = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'pillbox' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('pillbox', (data = new Pillbox( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.pillbox.defaults = {
		dataSource: undefined,
		acceptKeyCodes: [
			//Enter
			13,
			//Comma
			188
		]
		//example dataSource
		/*dataSource: function( data, callback ){
			console.log(data, callback);
			callback(data);
		}*/
	};

	$.fn.pillbox.Constructor = Pillbox;

	$.fn.pillbox.noConflict = function () {
		$.fn.pillbox = old;
		return this;
	};


	// PILLBOX DATA-API

	$(function () {
		$('body').on('mousedown.pillbox.data-api', '.pillbox', function () {
			var $this = $(this);
			if ($this.data('pillbox')) return;
			$this.pillbox($this.data());
		});
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --