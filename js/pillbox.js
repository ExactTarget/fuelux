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
		this.$ul = this.$element.find('.pillbox-list');
		this.$sugs = this.$element.find('.pillbox-suggest');
		this.$inputWrap = this.$input.parent();

		this.options = $.extend({}, $.fn.pillbox.defaults, options);
		//CREATING AN OBJECT OUT OF THE KEY CODE ARRAY SO WE DONT HAVE TO LOOP THROUGH IT ON EVERY KEY STROKE
		this.acceptKeyCodes = this._generateObject(this.options.acceptKeyCodes);

		this.$element.on('click', '.pillbox-list > li', $.proxy(this.itemClicked, this));
		this.$element.on('click', '.pillbox-suggest > li', $.proxy(this.suggestionClick, this));
		this.$element.on('click', $.proxy(this.inputFocus, this));

		this.$element.on('keydown', '.pillbox-input', $.proxy(this.inputEvent, this));

		if( this.options.editPill ){
			this.$element.on('blur', '.pillbox-input', $.proxy(this.cancelEdit, this));
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
				return false;
			} else if ( this.options.editPill ) {
				if( $li.find('.pillbox-list-edit').length )
				{
					return false;
				}

				this.openEdit($li);
			}

			this.$element.trigger( 'clicked', this.getItemData($li));
		},

		suggestionClick: function(e){
			var $li = $(e.currentTarget);

			e.preventDefault();
			this.$input.val('');

			this.addItems({text:$li.html(), value:$li.data('value')});
		},

		itemCount: function() {
			return this.$ul.children('li').length;
		},

		// First parameter is 1 based index
		// Second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
		//object structure is as follows (index and value are optional): { text: '', value: '' }
		addItems: function(){
			var self = this;
			var items, index;

			if( isFinite(String(arguments[0])) && !(arguments[0] instanceof Array) ) {
				items = [].slice.call(arguments).slice(1);
				index = arguments[0];
			} else {
				items = [].slice.call(arguments).slice(0);
			}

			//Accounting for array parameter
			if(items[0] instanceof Array){
				items = items[0];
			}

			if( items.length ){
				$.each(items, function(i, value){
					var data = {
						text: value.text,
						value: value.value ? value.value : value.text,
						el: '<li><span></span><span>x</span></li>',
						index: value.index
					};

					items[i] = data;
				});

				if( this.options.editPill && this.currentEdit ){
					items[0].el = this.currentEdit.wrap('<div></div>').parent().html();
				}

				if(self.options.onAdd){
					if( this.options.editPill && this.currentEdit ){
						self.options.onAdd( items, $.proxy(self.saveEdit,this));
					} else {
						if( index ){
							self.options.onAdd( items, $.proxy(self.placeItems,this,index));
						} else {
							self.options.onAdd( items, $.proxy(self.placeItems,this));
						}
					}
				} else {
					if( this.options.editPill && this.currentEdit ){
						self.saveEdit(items);
					} else {
						if( index ){
							self.placeItems(index, items);
						} else {
							self.placeItems(items);
						}
					}
				}
			}

		},

		//First parameter is index (optional)
		//Second parameter is new arguments
		placeItems: function(){
			var items,index;
			var newHtml = '';
			var $neighbor;

			if( isFinite(String(arguments[0])) && !(arguments[0] instanceof Array) ) {
				items = [].slice.call(arguments).slice(1);
				index = arguments[0];
			} else {
				items = [].slice.call(arguments).slice(0);
			}

			if(items[0] instanceof Array){
				items = items[0];
			}

			if( items.length ){
				$.each(items, function(i, item){
					var $li = $(item.el);
					var $neighbor;

					$li.attr('data-value', item.value);
					$li.find('span:first').html( item.text );

					newHtml += $li.wrap('<div></div>').parent().html();
				});

				if( this.$ul.children('li').length > 0 ) {
					if( index ){
						$neighbor = this.$ul.find('li:nth-child(' + index + ')');

						if( $neighbor.length ){
							$neighbor.before(newHtml);
						} else {
							this.$ul.children('li:last').after(newHtml);
						}
					} else {
						this.$ul.children('li:last').after(newHtml);
					}
				} else {
					this.$ul.prepend(newHtml);
				}

				this.$element.trigger( 'added', items );
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

					this.addItems({text:txt,value:val});

					setTimeout(function(){
						self.$input.show().val('').attr({size:10});
					},0);
				}

				return true;
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {
				//this does not work as expected for an edit
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

		openEdit: function(el){
			var index = el.index() + 1;
			var $inputWrap = this.$inputWrap.detach().hide();
			var $child;

			this.$ul.find('li:nth-child(' + index + ')').before($inputWrap);
			this.currentEdit = el.detach();

			this.$input.val(el.find('span:first').html());
			$inputWrap.show();
			this.$input.focus().select();
		},

		cancelEdit: function(e) {
			var $inputWrap, $parent;
			if( !this.currentEdit ){
				return false;
			}

			this._closeSuggestions();
			this.$inputWrap.before(this.currentEdit);
			this.currentEdit = false;

			$inputWrap = this.$inputWrap.detach();
			this.$input.val('');
			this.$ul.append($inputWrap);
		},

		//Must match syntax of placeItem so addItem callback is called when an item is edited
		//expecting to receive an array back from the callback containing edited items
		saveEdit: function(){
			var item = arguments[0][0];

			this.currentEdit = $(item.el);
			this.currentEdit.data('value', item.value);
			this.currentEdit.find('span:first').html(item.text);

			this.$inputWrap.hide();
			this.$inputWrap.before(this.currentEdit);
			this.currentEdit = false;

			this.$input.val('');
			this.$ul.append(this.$inputWrap.detach().show());
			this.$element.trigger( 'edit', {value:item.value, text:item.text});
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
		editPill: true,
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