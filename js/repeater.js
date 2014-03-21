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
			self.render(self.$main, $.fn.repeater.views[self.currentView], data, function(){
				//do next steps
			});
		});
	};

	Repeater.prototype = {
		constructor: Repeater,

		render: function(container, renderer, data, callback){
			var async = {};
			var self = this;
			var args, dataset, repeat, i, l;

			var callbacks = {
				before: function(){
					proceed('render', args);
				},
				render: function(item){
					item = $(item);
					if(item!==null){
						container.append(item);
					}
					args.splice(1, 0, item);
					proceed('after', args);
				},
				after: function(){
					var cont, j, k;
					if(renderer.nest){
						cont = container.find('[data-container="true"]:first');
						if(cont.length<1){
							cont = container;
						}
						for(j=0, k=renderer.nest.length; j<k; j++){
							self.render(cont, renderer.nest[j], data, function(){
								proceed('complete', args);
							});
						}
					}else{
						callbacks.complete(null);
					}
				},
				complete: function(){
					if(callback){
						callback();
					}
				}
			};

			var proceed = function(stage, argus){
				argus = $.extend([], argus);
				if(renderer[stage]){
					if(async[stage]){
						argus.push(callbacks[stage]);
						renderer[stage].apply(self, argus);
					}else{
						callbacks[stage](renderer[stage].apply(self, argus));
					}
				}else{
					callbacks[stage](null);
				}
			};

			if(renderer.async){
				if(renderer.async===true){
					async = { after: true, before: true, complete: true, render: true };
				}else{
					async = renderer.async;
				}
			}

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
				args = [data];
				if(renderer.repeat){
					args.push(dataset, i);
				}
				proceed('before', args);
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