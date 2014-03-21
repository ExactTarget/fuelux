/*
 * Fuel UX Repeater
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
    
	var old = $.fn.repeater;

	// REPEATER CONSTRUCTOR AND PROTOTYPE

	var Repeater = function (element, options) {
		var self = this;

		this.$element = $(element);
		this.$main = this.$element.find('.repeater-main');


		this.options = $.extend(true, {}, $.fn.repeater.defaults, options);

		this.currentView = 'list';

		this.options.dataSource({}, function(data){
			self.render(self.$main, $.fn.repeater.views[self.currentView], data);
		});
	};

	Repeater.prototype = {
		constructor: Repeater,

		render: function(container, renderer, data){
			var args1, args2, cont, dataset, i, item, j, l, len, repeat;

			if(renderer.repeat){
				repeat = renderer.repeat.split('.');
				dataset = data;
				for(i=0, l=repeat.length; i<l; i++){
					dataset = dataset[repeat[i]];
				}
			}else{
				dataset = [''];
			}

			for(i=0, l=dataset.length; i<l; i++){
				args1 = [data];
				if(renderer.repeat){
					args1.push(dataset, i);
				}

				if(renderer.before){
					renderer.before.apply(this, args1);
				}

				if(renderer.render){
					item = $(renderer.render.apply(this, args1));
					container.append(item);
				}else{
					item = null;
				}

				args2 = $.extend([], args1);
				args2.splice(1, 0, item);

				if(renderer.after){
					renderer.after.apply(this, args2);
				}

				if(renderer.nest){
					cont = container.find('[data-container="true"]:first');
					if(cont.length<1){
						cont = container;
					}
					for(j=0, len=renderer.nest.length; j<len; j++){
						this.render(cont, renderer.nest[j], data);
					}
				}

				if(renderer.complete){
					renderer.complete.apply(this, args2);
				}
			}
		}
	};

	// REPEATER PLUGIN DEFINITION

	$.fn.repeater = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'repeater' );
			var options = typeof option === 'object' && option;

			if ( !data ) $this.data('repeater', (data = new Repeater( this, options ) ) );
			if ( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.repeater.defaults = {
		dataSource: function(options, callback){}
	};

	//views object contains keyed list of renderer objects.
	//renderer object contains following optional parameters:
		//{
			//before: function(data, [dataset, index]){},
			//after: function(data, item, [dataset, index]){},
			//complete: function(data, item, [dataset, index]){},
			//repeat: 'parameter.subparameter.etc',
			//render: function(data, [dataset, index]){},
			//nest: [ *array of renderer objects* ]
		//}
		//*NOTE - the dataset and index arguments appear if repeat is present
	$.fn.repeater.views = {
		list: {
			nest: [
				{
					render: function(data){
						return '<table class="list-view-header"><tr data-container="true"></tr></table>';
					},
					nest: [
						{
							render: function(data, dataset, i){
								return '<td>' + dataset[i].label + '</td>';
							},
							repeat: 'columns'
						}
					]
				}
			]
		},
		thumbnail: {
			render: function(data, dataset, i){
				return '<div class="thumbnail">' + dataset[i].name + '</div>';
			},
			repeat: 'thumbnails'
		}
	};

	$.fn.repeater.Constructor = Repeater;

	$.fn.repeater.noConflict = function () {
		$.fn.repeater = old;
		return this;
	};

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --