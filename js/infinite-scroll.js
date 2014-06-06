/*
 * Fuel UX Infinite Scroll
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
		define(['jquery', 'fuelux/loader'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old = $.fn.infinitescroll;

	// INFINITE SCROLL CONSTRUCTOR AND PROTOTYPE

	var InfiniteScroll = function (element, options) {
		this.$element = $(element);
		this.$element.addClass('infinitescroll');
		this.options = $.extend({}, $.fn.infinitescroll.defaults, options);

		this.curScrollTop = this.$element.scrollTop();
		this.curPercentage = this.getPercentage();
		this.fetchingData = false;

		this.$element.on('scroll.fu.infinitescroll', $.proxy(this.onScroll, this));
	};

	InfiniteScroll.prototype = {

		constructor: InfiniteScroll,

		disable: function(){
			this.$element.off('scroll.fu.infinitescroll');
		},

		enable: function(){
			this.$element.on('scroll.fu.infinitescroll', $.proxy(this.onScroll, this));
		},

		end: function(content){
			var end = $('<div class="infinitescroll-end"></div>');
			if(content){
				end.append(content);
			}else{
				end.append('---------');
			}
			this.$element.append(end);
			this.disable();
		},

		getPercentage: function(){
			var height = (this.$element.css('box-sizing')==='border-box') ? this.$element.outerHeight() : this.$element.height();
			return (height / (this.$element.get(0).scrollHeight - this.curScrollTop)) * 100;
		},

		fetchData: function(force){
			var load = $('<div class="infinitescroll-load"></div>');
			var self = this;
			var moreBtn;

			var fetch = function(){
				var helpers = { percentage: self.curPercentage, scrollTop: self.curScrollTop };
				var $loader = $('<div class="loader"></div>');
				load.append($loader);
				$loader.loader();
				if(self.options.dataSource){
					self.options.dataSource(helpers, function(resp){
						var end;
						load.remove();
						if(resp.content){
							self.$element.append(resp.content);
						}
						if(resp.end){
							end = (resp.end!==true) ? resp.end : undefined;
							self.end(end);
						}
						self.fetchingData = false;
					});
				}
			};

			this.fetchingData = true;
			this.$element.append(load);
			if(this.options.hybrid && force!==true){
				moreBtn = $('<button type="button" class="btn btn-primary"></button>');
				if(typeof this.options.hybrid === 'object'){
					moreBtn.append(this.options.hybrid.label);
				}else{
					moreBtn.append('<span class="glyphicon glyphicon-repeat"></span>');
				}
				moreBtn.on('click.fu.infinitescroll', function(){
					moreBtn.remove();
					fetch();
				});
				load.append(moreBtn);
			}else{
				fetch();
			}
		},

		onScroll: function(e){
			this.curScrollTop = this.$element.scrollTop();
			this.curPercentage = this.getPercentage();
			if(!this.fetchingData && this.curPercentage>=this.options.percentage){
				this.fetchData();
			}
		}

	};

	// INFINITE SCROLL PLUGIN DEFINITION

	$.fn.infinitescroll = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'infinitescroll' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('infinitescroll', (data = new InfiniteScroll( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.infinitescroll.defaults = {
		dataSource: null,
		hybrid: false,	//can be true or an object with structure: { 'label': (markup or jQuery obj) }
		percentage: 95	//percentage scrolled to the bottom before more is loaded
	};

	$.fn.infinitescroll.Constructor = InfiniteScroll;

	$.fn.infinitescroll.noConflict = function () {
		$.fn.infinitescroll = old;
		return this;
	};

	// NO DATA-API DUE TO NEED OF DATA-SOURCE

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --