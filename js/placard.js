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
		this.$element = $(element);

		this.options = $.extend({}, $.fn.placard.defaults, options);
	};

	Placard.prototype = {
		constructor : Placard,

		isExternalClick: function(e){
			var exceptions = this.options.externalClickExceptions || [];
			var originEl = $(e.target);
			var i, l;

			for(i=0, l=exceptions.length; i<l; i++){
				if(originEl.hasClass($.trim(exceptions[i]).replace('.', '')) || originEl.parents(exceptions[i]).length>0){
					return false;
				}
			}

			return true;
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
		externalClickExceptions: ['.placard']
	};

	$.fn.placard.Constructor = Placard;

	$.fn.placard.noConflict = function () {
		$.fn.placard = old;
		return this;
	};


	// PLACARD DATA-API

//	$('body').on('mousedown.pillbox.data-api', '.pillbox', function () {
//		var $this = $(this);
//		if ($this.data('pillbox')) return;
//		$this.pillbox($this.data());
//	});
//
//	$('body').on('click.pillbox.data-api',function(){
//		$('.pillbox-suggest').hide();
//	});
	
// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
