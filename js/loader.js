/*
 * Fuel UX Loader
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

	var old = $.fn.loader;

	// LOADER CONSTRUCTOR AND PROTOTYPE

	var Loader = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.loader.defaults, options);

		this.begin = (this.$element.is('[data-begin]')) ? parseFloat(this.$element.attr('data-begin')) : 1;
		this.delay = (this.$element.is('[data-delay]')) ? parseFloat(this.$element.attr('data-delay')) : 150;
		this.end = (this.$element.is('[data-end]')) ? parseInt(this.$element.attr('data-end'), 10) : 8;
		this.frame = (this.$element.is('[data-frame]')) ? parseInt(this.$element.attr('data-frame'), 10) : 1;
		this.playing = false;
		this.timeout = {};

		var ieVer = this.msieVersion();
		if(ieVer!==false && ieVer<9){
			this.$element.className += ' iefix';
		}

		this.$element.attr('data-frame', this.frame + '');
		this.play();
	};

	Loader.prototype = {

		constructor: Loader,

		msieVersion: function(){
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			if(msie>0){
				return parseInt(ua.substring(msie+5, ua.indexOf(".", msie )), 10);
			}else{
				return false;
			}
		},

		next: function(){
			this.frame++;
			if(this.frame>this.end){
				this.frame = this.begin;
			}
			this.$element.attr('data-frame', this.frame + '');
		},

		pause: function(){
			clearTimeout(this.timeout);
			this.playing = false;
		},

		play: function(){
			var self = this;
			if(!this.playing){
				this.timeout = setTimeout(function(){
					self.next();
					self.play();
				}, this.delay);
				this.playing = true;
			}
		},

		prev: function(){
			this.frame--;
			if(this.frame<this.begin){
				this.frame = this.end;
			}
			this.$element.attr('data-frame', this.frame + '');
		},

		reset: function(){
			this.frame = this.begin;
			this.$element.attr('data-frame', this.frame + '');
		}

	};

	// LOADER PLUGIN DEFINITION

	$.fn.loader = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this = $( this );
			var data = $this.data( 'loader' );
			var options = typeof option === 'object' && option;

			if (!data) $this.data('loader', (data = new Loader(this, options)));
			if (typeof option === 'string') methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.loader.defaults = {};

	$.fn.loader.Constructor = Loader;

	$.fn.loader.noConflict = function () {
		$.fn.loader = old;
		return this;
	};

	// INIT LOADER ON DOMCONTENTLOADED

	$(function () {
		$('.loader').each(function () {
			var $this = $(this);
			if (!$this.data('loader')) {
				$this.loader($this.data());
			}
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --