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
		this.$ul    = this.$element.find('.pillbox-list');
		this.$sugs  = this.$element.find('.pillbox-suggest');

		this.options = $.extend({}, $.fn.pillbox.defaults, options);
		//CREATING AN OBJECT OUT OF THE KEY CODE ARRAY SO WE DONT HAVE TO LOOP THROUGH IT ON EVERY KEY STROKE
		this.acceptKeyCodes = this._generateObject(this.options.acceptKeyCodes);

		this.$element.on('click', '.pillbox-list > li', $.proxy(this.itemclicked, this));
		this.$element.on('click', '.pillbox-suggest > li', $.proxy(this.suggestionClick, this));
		this.$element.on('click', $.proxy(this.inputFocus, this));

		this.$element.on('keydown', '.pillbox-input', $.proxy(this.inputEvent, this));
	};

	Pillbox.prototype = {
		constructor : Pillbox,

		items: function() {
			return this.$ul.children('li').map(function() {
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

		suggestionClick: function(e){
			var $li = $(e.currentTarget);

			e.preventDefault();
			this._closeSuggestions();
			this.$input.val('');
			this.addItem($li.html(), $li.data('value'));
		},

		itemCount: function() {
			return this.$ul.children('li').length;
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

			if( this.$ul.children('li').length > 0 ) {
				this.$ul.children('li:last').after($li);
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
				this._closeSuggestions();

				if( val.length ) {
					this.$input.hide();
					this.addItem(val);

					setTimeout(function(){
						self.$input.show().val('').attr({size:10});
					},0);
				}

				return true;
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {
				if( !val.length ) {
					this._closeSuggestions();
					this.$ul.children('li:last').remove();

					return true;
				}
			} else if ( val.length > 10 ) {
				if( this.$input.width() < (this.$ul.width() - 6) ){
					this.$input.attr({size:val.length + 3});
				}
			}

			if( this.options.onKeyDown ){
				this.options.onKeyDown({value: val}, $.proxy(this._openSuggestions,this));
			}
		},

		removeBySelector: function(selector, trigger) {
			if( typeof trigger === "undefined" ) {
				trigger = true;
			}

			this.$element.children('ul').find(selector).remove();

			if( !!trigger ) {
				this._removePillTrigger( { method: 'removeBySelector', removedSelector: selector } );
			}
		},

		removeByValue: function(value) {
			var selector = '> li[data-value="' + value + '"]';

			this.removeBySelector( selector, false );
			this._removePillTrigger( { method: 'removeByValue', removedValue: value } );
		},

		removeByText: function(text) {
			var selector = '> li:contains("' + text + '")';

			this.removeBySelector( selector, false );
			this._removePillTrigger( { method: 'removeByText', removedText: text } );
		},

		inputFocus: function(e) {
			this.$element.find('.pillbox-input').focus();
		},

		clear: function() {
			this.$element.children('ul').empty();
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
		},

		_openSuggestions: function(data){
			var markup = '';

			if(data.data && data.data.length){
				$.each(data.data, function(index, value){
					var val = value.value ? value.value : value.text;
					markup += '<li data-value="' + val + '">' + value.text + '</li>';
				});

				this.$sugs.html('').append(markup).show();
				$(document.body).trigger('suggestions',this.$sugs);
			} else {
				this._closeSuggestions();
			}
		},

		_closeSuggestions: function(){
			this.$sugs.html('').hide();
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

		//example on key down
		/*
		onKeyDown: function( data, callback ){
			callback({data:[
				{text: Math.random(),value:'sdfsdfsdf'},
				{text: Math.random(),value:'sdfsdfsdf'}
			]});
		}
		*/
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