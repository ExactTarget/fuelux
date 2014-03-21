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
			var async = { after: false, before: false, complete: false, render: false };
			var self = this;
			var dataset, repeat, i, l;

			var loopDataset = function(index){
				var args = [data];
				if(renderer.repeat){
					args.push(dataset, index);
				}
				start(args, function(){
					index++;
					if(index<dataset.length){
						loopDataset(index);
					}else{
						callback();
					}
				});
			};

			var start = function(args, cb){
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
						var cont;
						var loopNested = function(cont, index){
							self.render(cont, renderer.nest[index], data, function(){
								index++;
								if(index<renderer.nest.length){
									loopNested(cont, index);
								}else{
									proceed('complete', args);
								}
							});
						};

						if(renderer.nest){
							cont = container.find('[data-container="true"]:first');
							if(cont.length<1){
								cont = container;
							}
							loopNested(cont, 0);
						}else{
							callbacks.complete(null);
						}
					},
					complete: function(){
						if(cb){
							cb();
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

				proceed('before', args);
			};

			if(renderer.async){
				if(renderer.async===true){
					for(i in async){
						async[i] = true;
					}
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

			loopDataset(0);
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
			//async: { after: false, before: false, complete: false, render: false }  (passing true sets all to true)
			//render: function(data, [dataset, index]){},
			//nest: [ *array of renderer objects* ]
		//}
		//*NOTE - the dataset and index arguments appear if repeat is present
	$.fn.repeater.views = {
		list: {
			nest: [
				{
					complete: function(){
						console.log('COMPLETE');
					},
					render: function(data){
						return '<table class="list-view-header"><tr data-container="true"></tr></table>';
					},
					nest: [
						{
							async: { before: true, render: true },
							before: function(data, dataset, i, callback){
								var delay = 1000;
								if(i===1){
									delay = 3000;
								}
								setTimeout(function(){
									console.log('before');
									callback();
								}, delay);
							},
							render: function(data, dataset, i, callback){
								setTimeout(function(){
									callback('<td>' + dataset[i].label + '</td>');
								}, 2000);
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