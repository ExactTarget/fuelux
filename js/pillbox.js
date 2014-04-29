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
		this.$ul = this.$element.find('.pill-group');
		this.$sugs = this.$element.find('.suggest');
		this.$inputWrap = this.$input.parent();

		this.$pillHTML = '<li class="btn btn-default">' +
							'	<span></span>' +
							'	<span class="glyphicon glyphicon-close">' +
							'		<span class="sr-only">Remove</span>' +
							'	</span>' +
							'</li>';

		this.options = $.extend({}, $.fn.pillbox.defaults, options);
		//CREATING AN OBJECT OUT OF THE KEY CODE ARRAY SO WE DONT HAVE TO LOOP THROUGH IT ON EVERY KEY STROKE
		this.acceptKeyCodes = this._generateObject(this.options.acceptKeyCodes);

		this.$element.on('click', '.pill-group > li', $.proxy(this.itemClicked, this));
		this.$element.on('click', $.proxy(this.inputFocus, this));

		this.$element.on('keydown', '.pillbox-input', $.proxy(this.inputEvent, this));

		if( this.options.onKeyDown ){
			this.$element.on('mousedown', '.suggest > li', $.proxy(this.suggestionClick, this));
		}

		if( this.options.edit ){
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


			if( $text.length && !$target.parent().hasClass('pill-group') ){

				if(this.options.onRemove){
					this.options.onRemove(this.getItemData($li,{el:$li}) ,$.proxy(this._removeElement, this));
				} else {
					this._removeElement(this.getItemData($li,{el:$li}));
				}
				return false;
			} else if ( this.options.edit ) {
				if( $li.find('.pillbox-list-edit').length )
				{
					return false;
				}

				this.openEdit($li);
			}

			this.$element.trigger('clicked', this.getItemData($li));
		},

		suggestionClick: function(e){
			var $li = $(e.currentTarget);

			e.preventDefault();
			this.$input.val('');
			
			this.addItems({text:$li.html(), value:$li.data('value')}, true);

			// needs to be after add items for IE
			this._closeSuggestions();
		},

		itemCount: function() {
			return this.$ul.children('li').length;
		},

		// First parameter is 1 based index (optional, if index is not passed all new items will be appended)
		// Second parameter can be array of objects [{ ... }, { ... }] or you can pass n additional objects as args
		// object structure is as follows (index and value are optional): { text: '', value: '' }
		addItems: function(){
			var self = this;
			var items, index, isInternal;

			if( isFinite(String(arguments[0])) && !(arguments[0] instanceof Array) ) {
				items = [].slice.call(arguments).slice(1);
				index = arguments[0];
			} else {
				items = [].slice.call(arguments).slice(0);
				isInternal = items[1] && !items[1].text;
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
						el: self.$pillHTML
					};

					items[i] = data;
				});

				if( this.options.edit && this.currentEdit ){
					items[0].el = this.currentEdit.wrap('<div></div>').parent().html();
				}

				if( isInternal ){
					items.pop(1);
				}

				if(self.options.onAdd && isInternal){

					if( this.options.edit && this.currentEdit ){
						self.options.onAdd( items[0], $.proxy(self.saveEdit,this));
					} else {
						self.options.onAdd( items[0], $.proxy(self.placeItems,this, true));
					}
				} else {
					if( this.options.edit && this.currentEdit ){
						self.saveEdit(items);
					} else {
						if( index ){
							self.placeItems(index, items);
						} else {
							self.placeItems(items, isInternal);
						}
					}
				}
			}

		},

		//First parameter is the index (1 based) to start removing items
		//Second parameter is the number of items to be removed
		removeItems: function(index, howMany){
			var self = this;
			var count, $cur;

			if( !index ){
				this.$ul.find('li').remove();
				this._removePillTrigger( { method: 'removeAll' } );
			} else {
				howMany = howMany ? howMany : 1;

				for (count = 0; count < howMany; count++){
					$cur =  self.$ul.find('> li:nth-child('+ index +')');

					if( $cur ){
						$cur.remove();
					} else {
						break;
					}
				}
			}
		},

		//First parameter is index (optional)
		//Second parameter is new arguments
		placeItems: function(){
			var items,index;
			var newHtml = '';
			var $neighbor, isInternal;

			if( isFinite(String(arguments[0])) && !(arguments[0] instanceof Array) ) {
				items = [].slice.call(arguments).slice(1);
				index = arguments[0];
			} else {
				items = [].slice.call(arguments).slice(0);
				isInternal = items[1] && !items[1].text;
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

				if( isInternal ){
					this.$element.trigger('added', {text: items[0].text,value: items[0].value});
				}
			}
		},

		inputEvent: function(e){
			var self = this;
			var txt = this.$input.val();
			var val, $lastLi, $selItem;

			if( this.acceptKeyCodes[e.keyCode] ){

				if( this.options.onKeyDown && this._isSuggestionsOpen() ){
					$selItem = this.$sugs.find('.pillbox-suggest-sel');

					if($selItem.length){
						txt = $selItem.html();
						val = $selItem.data('value');
					}
				}

				if( txt.length ) {
					this._closeSuggestions();
					this.$input.hide();

					this.addItems({text:txt,value:val}, true);

					setTimeout(function(){
						self.$input.show().val('').attr({size:10});
					},0);
				}

				return true;
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {

				if( !txt.length ) {
					e.preventDefault();

					if( this.options.edit && this.currentEdit ) {
						this.cancelEdit();
						return true;
					}

					this._closeSuggestions();
					$lastLi = this.$ul.children('li:last');

					if( $lastLi.hasClass('pillbox-highlight') ){
						this._removeElement(this.getItemData($lastLi,{el:$lastLi}));
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

				//only allowing most recent event callback to register
				this.callbackId = e.timeStamp;
				this.options.onKeyDown(e, {value: txt}, $.proxy(this._openSuggestions,this));
			}
		},

		openEdit: function(el){
			var index = el.index() + 1;
			var $inputWrap = this.$inputWrap.detach().hide();

			this.$ul.find('li:nth-child(' + index + ')').before($inputWrap);
			this.currentEdit = el.detach();

			this.$input.val(el.find('span:first').html());
			$inputWrap.show();
			this.$input.focus().select();
		},

		cancelEdit: function(e) {
			var $inputWrap;
			if( !this.currentEdit ){
				return false;
			}

			this._closeSuggestions();
			if(e){
				this.$inputWrap.before(this.currentEdit);
			}
			this.currentEdit = false;

			$inputWrap = this.$inputWrap.detach();
			this.$input.val('');
			this.$ul.append($inputWrap);
		},

		//Must match syntax of placeItem so addItem callback is called when an item is edited
		//expecting to receive an array back from the callback containing edited items
		saveEdit: function() {
			var item = arguments[0][0];

			this.currentEdit = $(item.el);
			this.currentEdit.data('value', item.value);
			this.currentEdit.find('span:first').html(item.text);

			this.$inputWrap.hide();
			this.$inputWrap.before(this.currentEdit);
			this.currentEdit = false;

			this.$input.val('');
			this.$ul.append(this.$inputWrap.detach().show());
			this.$element.trigger( 'edited', {value:item.value, text:item.text});
		},

		removeBySelector: function() {
			var selectors = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(selectors, function(i, sel){
				self.$ul.find(sel).remove();
			});

			this._removePillTrigger( { method: 'removeBySelector', removedSelectors: selectors } );
		},

		removeByValue: function() {
			var values = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(values, function(i, val){
				self.$ul.find('> li[data-value="' + val + '"]').remove();
			});

			this._removePillTrigger( { method: 'removeByValue', removedValues: values } );
		},

		removeByText: function() {
			var text = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(text, function(i, txt){
				self.$ul.find('> li:contains("' + txt + '")').remove();
			});

			this._removePillTrigger( { method: 'removeByText', removedText: text } );
		},

		inputFocus: function(e) {
			this.$element.find('.pillbox-input').focus();
		},

		getItemData: function(el, data) {
			return $.extend({
				text: el.find('span:first').html()
			}, el.data(), data);
		},

		_removeElement: function(data){
			data.el.remove();
			delete data.el;
			this.$element.trigger('removed', data);
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

		_openSuggestions: function(e, data){
			var markup = '';

			if( this.callbackId !== e.timeStamp) {
				return false;
			}

			if(data.data && data.data.length){
				$.each(data.data, function(index, value){
					var val = value.value ? value.value : value.text;
					markup += '<li data-value="' + val + '">' + value.text + '</li>';
				});

				$(document.body).trigger('suggestions', this.$sugs);
				this.$sugs.html('').append(markup).parent().addClass('open');
			}
		},

		_closeSuggestions: function(){
			this.$sugs.html('').parent().removeClass('open');
		},

		_isSuggestionsOpen: function(){
			return this.$sugs.parent().hasClass('open');
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
		edit: true,
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
		/*onKeyDown: function(event, data, callback ){
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
		if ($this.data('pillbox')) {
			return;
		}
		$this.pillbox($this.data());
	});

	//FIX

	$('body').on('click.pillbox.data-api',function(){
		$('.pillbox-suggest').hide();
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
    // -- END UMD WRAPPER AFTERWORD --