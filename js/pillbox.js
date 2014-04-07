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

		this.$element.on('click', '.pillbox-list > li', $.proxy(this.itemClicked, this));
		this.$element.on('click', '.pillbox-suggest > li', $.proxy(this.suggestionClick, this));
		this.$element.on('click', $.proxy(this.inputFocus, this));

		this.$element.on('keydown', '.pillbox-input', $.proxy(this.inputEvent, this));

		if( this.options.editPill ){
			this.$element.on('blur', '.pillbox-list-edit', $.proxy(this.cancelEdit, this));
			this.$element.on('keydown', '.pillbox-list-edit', $.proxy(this.editInputEvent, this));
		}
	};

	Pillbox.prototype = {
		constructor : Pillbox,

		items: function() {
			var self = this;

			return this.$ul.children('li').map(function() {
				return self.getItemData($(this));
			}).get();
		},

		itemClicked: function(e){
			var self = this;
			var $target = $(e.target);
			var $li = $(e.currentTarget);
			var $text = $target.prev();

			e.preventDefault();
			e.stopPropagation();
			this._closeSuggestions();


			if( $text.length && !$target.parent().hasClass('pillbox-list') ){

				if(this.options.onRemove){
					this.options.onRemove(this.getItemData($li,{el:$li}) ,$.proxy(this.removeItem, this));
				} else {
					this.removeItem(this.getItemData($li,{el:$li}));
				}
			} else if ( this.options.editPill ) {
				if( $li.find('.pillbox-list-edit').length )
				{
					return false;
				}

				this.openEdit($li);
			} else {
				this.$element.trigger( 'clicked', this.getItemData($li));
			}
		},

		suggestionClick: function(e){
			var $li = $(e.currentTarget);

			e.preventDefault();
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
				el: '<li><span></span><span>x</span></li>'
			};

			if(this.options.onAdd){
				this.options.onAdd( data, $.proxy(this.placeItem,this));
			} else {
				this.placeItem(data);
			}
		},

		placeItem: function(data){
			var $li = $(data.el);

			$li.attr('data-value',data.value);
			$li.find('span:first').html(data.text);

			if( this.$ul.children('li').length > 0 ) {
				this.$ul.children('li:last').after($li);
			} else {
				this.$ul.prepend($li);
			}

			this.$element.trigger( 'added', { text: data.text, value: data.value } );

			if( !this.options.onAdd ) {
				return $li;
			}
		},

		inputEvent: function(e){
			var self = this;
			var txt = this.$input.val();
			var val, $lastLi, $selItem;

			if( this.acceptKeyCodes[e.keyCode] ){

				if( txt.length ) {
					if( this.options.onKeyDown && this._isSuggestionsOpen() ){
						$selItem = this.$sugs.find('.pillbox-suggest-sel');

						if($selItem.length){
							txt = $selItem.html();
							val = $selItem.data('value');
						}
					}
					this._closeSuggestions();
					this.$input.hide();

					this.addItem(txt, val);

					setTimeout(function(){
						self.$input.show().val('').attr({size:10});
					},0);
				}

				return true;
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {
				if( !txt.length ) {
					this._closeSuggestions();
					$lastLi = this.$ul.children('li:last');

					if( $lastLi.hasClass('pillbox-highlight') ){
						this.removeItem(this.getItemData($lastLi,{el:$lastLi}));
					} else {
						$lastLi.addClass('pillbox-highlight');
					}

					return true;
				}
			} else if ( txt.length > 10 ) {
				if( this.$input.width() < (this.$ul.width() - 6) ){
					this.$input.attr({size:txt.length + 3});
				}
			}

			this.$ul.find('li').removeClass('pillbox-highlight');

			if( this.options.onKeyDown ){
				if( e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40){
					if( this._isSuggestionsOpen() ){
						this._keySuggestions(e);
					}
					return true;
				}
				this.options.onKeyDown({value: txt}, $.proxy(this._openSuggestions,this));
			}
		},

		openEdit: function( el ){
			var $text = el.find('span:first');

			el.prepend('<input class="pillbox-list-edit" type="text" style="width:' + $text.width() + 'px;" value="' + $text.html() + '">');
			$text.hide();
			el.find('input').focus().select();
			this.$element.trigger( 'edit', this.getItemData(el));
		},

		cancelEdit: function(e) {
			var $input = $(e.currentTarget);
			var $parent = $input.parent();

			$input.remove();
			$parent.find('span:first').show();
		},

		editInputEvent: function(e){
			var txt, $input, $li;

			if( this.acceptKeyCodes[e.keyCode] ){
				$input = $(e.currentTarget);
				$li = $input.parent();
				txt = $input.val();


				if( txt.length ){
					$li.data('value',txt);
					$li.find('span:first').html(txt).show();
				} else {
					$li.find('span:first').show();
				}

				$input.remove();
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

		removeItem: function(data){
			data.el.remove();
			delete data.el;
			this.$element.trigger('removed', data);
		},

		inputFocus: function(e) {
			this.$element.find('.pillbox-input').focus();
		},

		clear: function() {
			this.$element.children('ul').empty();
		},

		getItemData: function(el, data) {
			return $.extend({
				text: el.find('span:first').html()
			}, el.data(), data);
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
			}
		},

		_closeSuggestions: function(){
			this.$sugs.html('').hide();
		},

		_isSuggestionsOpen: function(){
			return this.$sugs.css('display') === "block";
		},

		_keySuggestions: function(e) {
			var $first = this.$sugs.find('li.pillbox-suggest-sel');
			var dir = e.keyCode === 38;
			var $next, val;

			e.preventDefault();

			if( !$first.length ){
				$first = this.$sugs.find('li:first');
				$first.addClass('pillbox-suggest-sel');
			} else {
				$next = dir ? $first.prev() : $first.next();

				if( !$next.length ){
					$next = dir ? this.$sugs.find('li:last') : this.$sugs.find('li:first');
				}

				if( $next ){
					$next.addClass('pillbox-suggest-sel');
					$first.removeClass('pillbox-suggest-sel');
				}
			}
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
		onAdd: undefined,
		onRemove: undefined,
		onKeyDown: undefined,
		editPill: false,
		acceptKeyCodes: [
			//Enter
			13,
			//Comma
			188
		]

		//example on remove
		/*onRemove: function(data,callback){
			console.log('onRemove');
			callback(data);
		}*/

		//example on key down
		/*
		onKeyDown: function(ta, callback ){
			callback({data:[
				{text: Math.random(),value:'sdfsdfsdf'},
				{text: Math.random(),value:'sdfsdfsdf'}
			]});
		}
		*/
		//example onAdd
		/*onAdd: function( data, callback ){
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

	$('body').on('mousedown.pillbox.data-api', '.pillbox', function () {
		var $this = $(this);
		if ($this.data('pillbox')) return;
		$this.pillbox($this.data());
	});

	$('body').on('click.pillbox.data-api',function(){
		$('.pillbox-suggest').hide();
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --