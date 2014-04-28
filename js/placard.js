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

		this.$footer = this.$element.find('.placard-footer');
		this.$formEl = this.$element.find('input, textarea').first();
		this.$header = this.$element.find('.placard-header');
		this.$overlay = this.$element.find('.placard-overlay');

		this.previousValue = '';

		this.$formEl.on('click', $.proxy(this.show, this));
		this.$element.find('.placard-accept').on('click', $.proxy(this.complete, this, 'accept'));
		this.$element.find('.placard-cancel').on('click', $.proxy(this.complete, this, 'cancel'));
	};

	Placard.prototype = {
		constructor : Placard,

		complete: function(action){
			var func = this.options['on' + action[0].toUpperCase() + action.substring(1)];
			if(func){
				func.call(this, {
					previousValue: this.previousValue,
					value: this.$formEl.val()
				});
			}else{
				if(action==='cancel' && this.options.revertOnCancel){
					this.$formEl.val(this.previousValue);
				}
				this.hide();
			}
		},

		hide: function(){
			if(!this.$element.hasClass('showing')){ return; }
			this.$element.removeClass('showing');
			$(document).off('click.placard.externalClick', this.externalClickListener);
			this.$element.trigger('hide');
		},

		externalClickListener: function(e){
			if(this.isExternalClick(e)){
				this.complete(this.options.externalClickAction);
			}
		},

		isExternalClick: function(e){
			var exceptions = this.options.externalClickExceptions || [];
			var originEl = $(e.target);
			var i, l;

			for(i=0, l=exceptions.length; i<l; i++){
				if(originEl.is(exceptions[i]) || originEl.parents(exceptions[i]).length>0){
					return false;
				}
			}

			return true;
		},

		show: function(e){
			if(this.$element.hasClass('showing')){ return; }

			this.previousValue = this.$element.find('input, textarea').first().val();

			this.$element.addClass('showing');
			if(this.$header.length>0){
				this.$overlay.css('top', '-' + this.$header.outerHeight(true) + 'px');
			}
			if(this.$footer.length>0){
				this.$overlay.css('bottom', '-' + this.$footer.outerHeight(true) + 'px');
			}

			this.$element.trigger('show');

			if(!this.options.requireExplicitAction){
				$(document).on('click.placard.externalClick', $.proxy(this.externalClickListener, this));
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
		externalClickExceptions: ['.placard'],
		requireExplicitAction: false,
		revertOnCancel: true
	};

	$.fn.placard.Constructor = Placard;

	$.fn.placard.noConflict = function () {
		$.fn.placard = old;
		return this;
	};


	// PLACARD DATA-API

	$('body').on('mousedown.placard.data-api', '.placard', function () {
		var $this = $(this);
		if ($this.data('placard')) return;
		$this.placard($this.data());
	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
