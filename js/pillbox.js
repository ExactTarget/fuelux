/*
 * Fuel UX Pillbox
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
		define(['jquery', 'fuelux/dropdown-autoflip'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {

	if( !$.fn.dropdownautoflip ){
		throw new Error('Fuel UX pillbox control requires dropdown-autoflip.');
	}
	// -- END UMD WRAPPER PREFACE --
		
	// -- BEGIN MODULE CODE HERE --
	
	var old = $.fn.pillbox;

	// PILLBOX CONSTRUCTOR AND PROTOTYPE

	var Pillbox = function (element, options) {
		this.$element = $(element);
		this.$moreCount = this.$element.find('.pillbox-more-count');
		this.$pillGroup = this.$element.find('.pill-group');
		this.$addItem = this.$element.find('.pillbox-add-item');
		this.$addItemWrap = this.$addItem.parent();
		this.$suggest = this.$element.find('.suggest');
		this.$pillHTML = '<li class="btn btn-default pill">' +
							'	<span></span>' +
							'	<span class="glyphicon glyphicon-close">' +
							'		<span class="sr-only">Remove</span>' +
							'	</span>' +
							'</li>';

		this.options = $.extend({}, $.fn.pillbox.defaults, options);

		if(this.options.readonly===-1){
			if(this.$element.attr('data-readonly')!==undefined){
				this.readonly(true);
			}
		}else if(this.options.readonly){
			this.readonly(true);
		}

		// EVENTS
		this.acceptKeyCodes = this._generateObject(this.options.acceptKeyCodes);
		// Creatie an object out of the key code array, so we dont have to loop through it on every key stroke

		this.$element.on('click.fu.pillbox', '.pill-group > .pill', $.proxy(this.itemClicked, this));
		this.$element.on('click.fu.pillbox', $.proxy(this.inputFocus, this));
		this.$element.on('keydown.fu.pillbox', '.pillbox-add-item', $.proxy(this.inputEvent, this));
		if( this.options.onKeyDown ){
			this.$element.on('mousedown.fu.pillbox', '.suggest > li', $.proxy(this.suggestionClick, this));
		}
		if( this.options.edit ){
			this.$element.addClass('pills-editable');
			this.$element.on('blur.fu.pillbox', '.pillbox-add-item', $.proxy(this.cancelEdit, this));
		}
	};

	Pillbox.prototype = {
		constructor : Pillbox,

		destroy: function() {
			this.$element.remove();
			// any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		items: function() {
			var self = this;

			return this.$pillGroup.children('.pill').map(function() {
				return self.getItemData($(this));
			}).get();
		},

		itemClicked: function(e){
			var self = this;
			var $target = $(e.target);
			var $item;

			e.preventDefault();
			e.stopPropagation();
			this._closeSuggestions();

			if(!$target.hasClass('pill')){
				$item = $target.parent();
				if(this.$element.attr('data-readonly')===undefined){
					if($target.hasClass('glyphicon-close')){
						if(this.options.onRemove){
							this.options.onRemove(this.getItemData($item, { el: $item }), $.proxy(this._removeElement, this));
						} else {
							this._removeElement(this.getItemData($item, { el: $item }));
						}
						return false;
					}else if(this.options.edit){
						if($item.find('.pillbox-list-edit').length){
							return false;
						}
						this.openEdit($item);
					}
				}
			}else{
				$item = $target;
			}

			this.$element.trigger('clicked.fu.pillbox', this.getItemData($item));
		},

		readonly: function(enable){
			if(enable){
				this.$element.attr('data-readonly', 'readonly');
			}else{
				this.$element.removeAttr('data-readonly');
			}
			if(this.options.truncate){
				this.truncate(enable);
			}
		},

		suggestionClick: function(e){
			var $item = $(e.currentTarget);

			e.preventDefault();
			this.$addItem.val('');
			
			this.addItems({
				text: $item.html(),
				value: $item.data('value')
			}, true);

			// needs to be after addItems for IE
			this._closeSuggestions();
		},

		itemCount: function() {
			return this.$pillGroup.children('.pill').length;
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
						value: (value.value ? value.value : value.text),
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
			var count;
			var $currentItem;

			if( !index ){
				this.$pillGroup.find('.pill').remove();
				this._removePillTrigger( { method: 'removeAll' } );
			} else {
				howMany = howMany ? howMany : 1;

				for (count = 0; count < howMany; count++){
					$currentItem =  self.$pillGroup.find('> .pill:nth-child('+ index +')');

					if( $currentItem ){
						$currentItem.remove();
					} else {
						break;
					}
				}
			}
		},

		//First parameter is index (optional)
		//Second parameter is new arguments
		placeItems: function(){
			var newHtml = '';
			var items;
			var index;
			var $neighbor;
			var isInternal;

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
					var $item = $(item.el);
					var $neighbor;

					$item.attr('data-value', item.value);
					$item.find('span:first').html( item.text );

					newHtml += $item.wrap('<div></div>').parent().html();
				});

				if( this.$pillGroup.children('.pill').length > 0 ) {
					if( index ){
						$neighbor = this.$pillGroup.find('.pill:nth-child(' + index + ')');

						if( $neighbor.length ){
							$neighbor.before(newHtml);
						} else {
							this.$pillGroup.children('.pill:last').after(newHtml);
						}
					} else {
						this.$pillGroup.children('.pill:last').after(newHtml);
					}
				} else {
					this.$pillGroup.prepend(newHtml);
				}

				if( isInternal ){
					this.$element.trigger('added.fu.pillbox', {
						text: items[0].text, 
						value: items[0].value
					});
				}
			}
		},

		inputEvent: function(e){
			var self = this;
			var text = this.$addItem.val();
			var value;
			var $lastItem;
			var $selection;

			if( this.acceptKeyCodes[e.keyCode] ){

				if( this.options.onKeyDown && this._isSuggestionsOpen() ){
					$selection = this.$suggest.find('.pillbox-suggest-sel');

					if($selection.length){
						text = $selection.html();
						value = $selection.data('value');
					}
				}

				if( text.length ) {
					this._closeSuggestions();
					this.$addItem.hide();

					this.addItems({
						text: text,
						value: value
					}, true);

					setTimeout(function(){
						self.$addItem.show().val('').attr({ size: 10 });
					},0);
				}

				e.preventDefault();
				return true;
			} else if( e.keyCode === 8 || e.keyCode === 46 ) {
				// backspace: 8
				// delete: 46

				if( !text.length ) {
					e.preventDefault();

					if( this.options.edit && this.currentEdit ) {
						this.cancelEdit();
						return true;
					}

					this._closeSuggestions();
					$lastItem = this.$pillGroup.children('.pill:last');

					if( $lastItem.hasClass('pillbox-highlight') ){
						this._removeElement(this.getItemData($lastItem, { el: $lastItem }));
					} else {
						$lastItem.addClass('pillbox-highlight');
					}

					return true;
				}
			} else if ( text.length > 10 ) {
				if( this.$addItem.width() < (this.$pillGroup.width() - 6) ){
					this.$addItem.attr({ size:text.length + 3 });
				}
			}

			this.$pillGroup.find('.pill').removeClass('pillbox-highlight');

			if( this.options.onKeyDown ){
				if( e.keyCode === 9 || e.keyCode === 38 || e.keyCode === 40){
					// tab: 9
					// up arrow: 38
					// down arrow: 40

					if( this._isSuggestionsOpen() ){
						this._keySuggestions(e);
					}
					return true;
				}

				//only allowing most recent event callback to register
				this.callbackId = e.timeStamp;
				this.options.onKeyDown({ event: e, value: text }, function(data){
					self._openSuggestions(e, data);
				});
			}
		},

		openEdit: function(el){
			var index = el.index() + 1;
			var $addItemWrap = this.$addItemWrap.detach().hide();

			this.$pillGroup.find('.pill:nth-child(' + index + ')').before($addItemWrap);
			this.currentEdit = el.detach();

			$addItemWrap.addClass('editing');
			this.$addItem.val(el.find('span:first').html());
			$addItemWrap.show();
			this.$addItem.focus().select();
		},

		cancelEdit: function(e) {
			var $addItemWrap;
			if( !this.currentEdit ){
				return false;
			}

			this._closeSuggestions();
			if(e){
				this.$addItemWrap.before(this.currentEdit);
			}
			this.currentEdit = false;

			$addItemWrap = this.$addItemWrap.detach();
			$addItemWrap.removeClass('editing');
			this.$addItem.val('');
			this.$pillGroup.append($addItemWrap);
		},

		//Must match syntax of placeItem so addItem callback is called when an item is edited
		//expecting to receive an array back from the callback containing edited items
		saveEdit: function() {
			var item = arguments[0][0];

			this.currentEdit = $(item.el);
			this.currentEdit.data('value', item.value);
			this.currentEdit.find('span:first').html(item.text);

			this.$addItemWrap.hide();
			this.$addItemWrap.before(this.currentEdit);
			this.currentEdit = false;

			this.$addItem.val('');
			this.$addItemWrap.removeClass('editing');
			this.$pillGroup.append(this.$addItemWrap.detach().show());
			this.$element.trigger( 'edited.fu.pillbox', { value: item.value, text: item.text });
		},

		removeBySelector: function() {
			var selectors = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(selectors, function(i, sel){
				self.$pillGroup.find(sel).remove();
			});

			this._removePillTrigger( { method: 'removeBySelector', removedSelectors: selectors } );
		},

		removeByValue: function() {
			var values = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(values, function(i, val){
				self.$pillGroup.find('> .pill[data-value="' + val + '"]').remove();
			});

			this._removePillTrigger( { method: 'removeByValue', removedValues: values } );
		},

		removeByText: function() {
			var text = [].slice.call(arguments).slice(0);
			var self = this;

			$.each(text, function(i, text){
				self.$pillGroup.find('> .pill:contains("' + text + '")').remove();
			});

			this._removePillTrigger( { method: 'removeByText', removedText: text } );
		},

		truncate: function(enable){
			var self = this;
			var available, full, i, pills, used;

			this.$element.removeClass('truncate');
			this.$addItemWrap.removeClass('truncated');
			this.$pillGroup.find('.pill').removeClass('truncated');

			if(enable) {
				this.$element.addClass('truncate');

				available = this.$element.width();
				full = false;
				i = 0;
				pills = this.$pillGroup.find('.pill').length;
				used = 0;

				this.$pillGroup.find('.pill').each(function () {
					var pill = $(this);
					if (!full) {
						i++;
						self.$moreCount.text(pills - i);
						if ((used + pill.outerWidth(true) + self.$addItemWrap.outerWidth(true)) <= available) {
							used += pill.outerWidth(true);
						} else {
							self.$moreCount.text((pills - i) + 1);
							pill.addClass('truncated');
							full = true;
						}
					} else {
						pill.addClass('truncated');
					}
				});
				if (i === pills) {
					this.$addItemWrap.addClass('truncated');
				}
			}
		},

		inputFocus: function(e) {
			this.$element.find('.pillbox-add-item').focus();
		},

		getItemData: function(el, data) {
			return $.extend({
				text: el.find('span:first').html()
			}, el.data(), data);
		},

		_removeElement: function(data){
			data.el.remove();
			delete data.el;
			this.$element.trigger('removed.fu.pillbox', data);
		},

		_removePillTrigger: function( removedBy ) {
			this.$element.trigger( 'removed.fu.pillbox', removedBy );
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

				// suggestion dropdown
				
				this.$suggest.html('').append(markup);
				$(document.body).trigger('suggested.fu.pillbox', this.$suggest);
			}
		},

		_closeSuggestions: function(){
			this.$suggest.html('').parent().removeClass('open');
		},

		_isSuggestionsOpen: function(){
			return this.$suggest.parent().hasClass('open');
		},

		_keySuggestions: function(e) {
			var $first = this.$suggest.find('li.pillbox-suggest-sel');
			var dir = e.keyCode === 38; // up arrow
			var $next, val;

			e.preventDefault();

			if( !$first.length ){
				$first = this.$suggest.find('li:first');
				$first.addClass('pillbox-suggest-sel');
			} else {
				$next = dir ? $first.prev() : $first.next();

				if( !$next.length ){
					$next = dir ? this.$suggest.find('li:last') : this.$suggest.find('li:first');
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
			var data    = $this.data('fu.pillbox');
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('fu.pillbox', (data = new Pillbox( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.pillbox.defaults = {
		onAdd: undefined,
		onRemove: undefined,
		onKeyDown: undefined,
		edit: false,
		readonly: -1,	//can be true or false. -1 means it will check for data-readonly="readonly"
		truncate: false,
		acceptKeyCodes: [
			13, //Enter
			188 //Comma
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


	// DATA-API

	$(document).on('mousedown.fu.pillbox.data-api', '[data-initialize=pillbox]', function (e) {
		var $control = $(e.target).closest('.pillbox');
		if ( !$control.data('fu.pillbox') ) {
			$control.pillbox($control.data());
		}
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=pillbox]').each(function () {
			var $this = $(this);
			if ($this.data('fu.pillbox')) return;
			$this.pillbox($this.data());
		});
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --