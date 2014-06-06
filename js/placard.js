/*
 * Fuel UX Placard
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
    
	var old = $.fn.placard;

	// PLACARD CONSTRUCTOR AND PROTOTYPE

	var Placard = function (element, options) {
		var self = this;
		this.$element = $(element);
		this.options = $.extend({}, $.fn.placard.defaults, options);

		this.$accept = this.$element.find('.placard-accept');
		this.$cancel = this.$element.find('.placard-cancel');
		this.$field = this.$element.find('.placard-field');
		this.$footer = this.$element.find('.placard-footer');
		this.$header = this.$element.find('.placard-header');
		this.$popup = this.$element.find('.placard-popup');

		this.actualValue = null;
		this.clickStamp = '_';
		this.previousValue = '';
		if(this.options.revertOnCancel===-1){
			this.options.revertOnCancel = (this.$accept.length>0) ? true : false;
		}

		this.$field.on('focus.fu.placard', $.proxy(this.show, this));
		this.$accept.on('click.fu.placard', $.proxy(this.complete, this, 'accept'));
		this.$cancel.on('click.fu.placard', function(e){ e.preventDefault(); self.complete('cancel'); });

		this.ellipsis();
	};

	Placard.prototype = {
		constructor : Placard,

		complete: function(action){
			var func = this.options['on' + action[0].toUpperCase() + action.substring(1)];
			var obj = { previousValue: this.previousValue, value: this.$field.val() };
			if(func){
				func(obj);
				this.$element.trigger(action, obj);
			}else{
				if(action==='cancel' && this.options.revertOnCancel){
					this.$field.val(this.previousValue);
				}
				this.$element.trigger(action, obj);
				this.hide();
			}
		},

		ellipsis: function(){
			var field, i, str;
			if(this.$element.attr('data-ellipsis')==='true'){
				field = this.$field.get(0);
				if(this.$field.is('input')){
					field.scrollLeft = 0;
				}else{
					field.scrollTop = 0;
					if(field.clientHeight < field.scrollHeight){
						this.actualValue = this.$field.val();
						this.$field.val('');
						str = '';
						i = 0;
						while(field.clientHeight>=field.scrollHeight){
							str += this.actualValue[i];
							this.$field.val(str + '...');
							i++;
						}
						str = (str.length>0) ? str.substring(0, str.length-1) : '';
						this.$field.val(str + '...');
					}
				}
			}
		},

		getValue: function(){
			if(this.actualValue!==null){
				return this.actualValue;
			}else{
				return this.$field.val();
			}
		},

		hide: function(){
			if(!this.$element.hasClass('showing')){ return; }
			this.$element.removeClass('showing');
			this.ellipsis();
			$(document).off('click.fu.placard.externalClick.' + this.clickStamp);
			this.$element.trigger('hidden.fu.placard');
		},

		externalClickListener: function(e, force){
			if(force===true || this.isExternalClick(e)){
				this.complete(this.options.externalClickAction);
			}
		},

		isExternalClick: function(e){
			var el = this.$element.get(0);
			var exceptions = this.options.externalClickExceptions || [];
			var $originEl = $(e.target);
			var i, l;

			if(e.target===el || $originEl.parents('.placard:first').get(0)===el){
				return false;
			}else{
				for(i=0, l=exceptions.length; i<l; i++){
					if($originEl.is(exceptions[i]) || $originEl.parents(exceptions[i]).length>0){
						return false;
					}
				}
			}
			return true;
		},

		setValue: function(val){
			this.$field.val(val);
			if(!this.$element.hasClass('showing')){
				this.ellipsis();
			}
		},

		show: function(){
			var other;

			if(this.$element.hasClass('showing')){ return; }
			other = $(document).find('.placard.showing');
			if(other.length>0){
				if(other.data('placard') && other.data('placard').options.explicit){
					return;
				}
				other.placard('externalClickListener', {}, true);
			}
			this.previousValue = this.$field.val();

			this.$element.addClass('showing');
			if(this.actualValue!==null){
				this.$field.val(this.actualValue);
				this.actualValue = null;
			}
			if(this.$header.length>0){
				this.$popup.css('top', '-' + this.$header.outerHeight(true) + 'px');
			}
			if(this.$footer.length>0){
				this.$popup.css('bottom', '-' + this.$footer.outerHeight(true) + 'px');
			}

			this.$element.trigger('shown.fu.placard');
			this.clickStamp = new Date().getTime() + (Math.floor(Math.random() * 100) + 1);
			if(!this.options.explicit){
				$(document).on('click.fu.placard.externalClick.' + this.clickStamp, $.proxy(this.externalClickListener, this));
			}
		}
	};

	// PLACARD PLUGIN DEFINITION

	$.fn.placard = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'placard' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('placard', (data = new Placard( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.placard.defaults = {
		onAccept: undefined,
		onCancel: undefined,
		externalClickAction: 'cancel',
		externalClickExceptions: [],
		explicit: false,
		revertOnCancel: -1	//negative 1 will check for an '.placard-accept' button. Also can be set to true or false
	};

	$.fn.placard.Constructor = Placard;

	$.fn.placard.noConflict = function () {
		$.fn.placard = old;
		return this;
	};

	// DATA-API

	$(document).on('focus.fu.placard.data-api', '[data-initialize=placard]', function () {
		var $this = $(this);
		if ($this.data('placard')) return;
		$this.placard($this.data());
	});

	// Must be domReady for AMD compatibility
	$(function () {
		$('[data-initialize=placard]').each(function () {
			var $this = $(this);
			if ($this.data('placard')) return;
			$this.placard($this.data());
		});
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
