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
		var i;

		this.$element = $(element);

		this.$canvas = this.$element.find('.repeater-canvas');
		this.$count = this.$element.find('.repeater-count');
		this.$end = this.$element.find('.repeater-end');
		this.$filters = this.$element.find('.repeater-filters');
		this.$loader = this.$element.find('.repeater-loader');
		this.$pageSize = this.$element.find('.repeater-itemization .selectlist');
		this.$nextBtn = this.$element.find('.repeater-next');
		this.$pages = this.$element.find('.repeater-pages');
		this.$prevBtn = this.$element.find('.repeater-prev');
		this.$primaryPaging = this.$element.find('.repeater-primaryPaging');
		this.$search = this.$element.find('.repeater-search');
		this.$secondaryPaging = this.$element.find('.repeater-secondaryPaging');
		this.$start = this.$element.find('.repeater-start');
		this.$viewport = this.$element.find('.repeater-viewport');
		this.$views = this.$element.find('.repeater-views');

		this.options = $.extend(true, {}, $.fn.repeater.defaults);
		for(i in $.fn.repeater.views){
			if($.fn.repeater.views[i].defaults){
				this.options = $.extend(true, this.options, $.fn.repeater.views[i].defaults);
			}
		}
		this.options = $.extend(true, this.options, options);

		this.currentPage = 0;
		this.currentView = (this.options.defaultView!==-1) ? this.options.defaultView : this.$views.find('label.active input').val();
		this.skipNested = false;

		this.$filters.on('changed', $.proxy(this.render, this, { pageIncrement: null }));
		this.$nextBtn.on('click', $.proxy(this.next, this));
		this.$pageSize.on('changed', $.proxy(this.render, this, { pageIncrement: null }));
		this.$prevBtn.on('click', $.proxy(this.previous, this));
		this.$primaryPaging.find('.combobox').on('changed', function(evt, data){ self.pageInputChange(data.text); });
		this.$search.on('searched cleared', $.proxy(this.render, this, { pageIncrement: null }));
		this.$secondaryPaging.on('blur', function(){ self.pageInputChange(self.$secondaryPaging.val()); });
		this.$views.find('input').on('change', $.proxy(this.viewChanged, this));

		this.resize();
		this.render();
	};

	Repeater.prototype = {
		constructor: Repeater,

		clear: function(){
			this.$canvas.empty();
		},

		getDataOptions: function(options){
			var opts = {};
			var val;

			options = options || {};

			opts.filter = this.$filters.selectlist('selectedItem');
			opts.pageSize = parseInt(this.$pageSize.selectlist('selectedItem').value, 10);
			opts.view = this.currentView;

			if(options.pageIncrement!==undefined){
				if(options.pageIncrement===null){
					this.currentPage = 0;
				}else{
					this.currentPage += options.pageIncrement;
				}
			}
			opts.pageIndex = this.currentPage;

			val = this.$search.find('input').val();
			if(val!==''){
				opts.search = val;
			}

			if($.fn.repeater.views[this.currentView].dataOptions){
				opts = $.fn.repeater.views[this.currentView].dataOptions();
			}

			return opts;
		},

		itemization: function(data){
			this.$count.html(data.count || '');
			this.$end.html(data.end || '');
			this.$start.html(data.start || '');
		},

		next: function(){
			var d = 'disabled';
			this.$nextBtn.attr(d, d);
			this.$prevBtn.attr(d, d);
			this.render({ pageIncrement: 1 });
		},

		pageInputChange: function(val){
			val = parseInt(val, 10) - 1;
			var pageInc = val - this.currentPage;
			this.render({ pageIncrement: pageInc });
		},

		pagination: function(data){
			var act = 'active';
			var dsbl = 'disabled';
			var page = data.page;
			var pages = data.pages;
			var dropMenu, i, l;

			this.currentPage = (page!==undefined) ? page : NaN;

			this.$primaryPaging.removeClass(act);
			this.$secondaryPaging.removeClass(act);

			if(pages<=this.options.dropPagingCap){
				this.$primaryPaging.addClass(act);
				dropMenu = this.$primaryPaging.find('.dropdown-menu');
				dropMenu.empty();
				for(i=0; i<pages; i++){
					l = i + 1;
					dropMenu.append('<li data-value="' + l + '"><a href="#">' + l + '</a></li>');
				}
				this.$primaryPaging.find('input.form-control').val(this.currentPage+1);
			}else{
				this.$secondaryPaging.addClass(act);
				this.$secondaryPaging.val(this.currentPage+1);
			}

			this.$pages.html(pages);

			if((this.currentPage+1)<pages){
				this.$nextBtn.removeAttr(dsbl);
			}else{
				this.$nextBtn.attr(dsbl, dsbl);
			}
			if((this.currentPage-1)>=0){
				this.$prevBtn.removeAttr(dsbl);
			}else{
				this.$prevBtn.attr(dsbl, dsbl);
			}
		},

		previous: function(){
			var d = 'disabled';
			this.$nextBtn.attr(d, d);
			this.$prevBtn.attr(d, d);
			this.render({ pageIncrement: -1 });
		},

		render: function(options){
			var dataOptions = this.getDataOptions(options);
			var self = this;
			var viewObj = $.fn.repeater.views[self.currentView];

			var start = function(){
				self.$loader.show();
				self.options.dataSource(dataOptions, function(data){
					var renderer = viewObj.renderer;
					self.itemization(data);
					self.pagination(data);
					if(renderer){
						self.runRenderer(self.$canvas, renderer, data, function(){
							self.$loader.hide();
							//throw event
						});
					}
				});
			};

			options = options || {};
			this.clear();
			if(options.changeView && this.currentView!==options.changeView){
				this.currentView = options.changeView;
				viewObj = $.fn.repeater.views[self.currentView];
				if(viewObj.selected){
					viewObj.selected({ callback: function(){
						start();
					}});
				}else{
					start();
				}
			}else{
				start();
			}
		},

		resize: function(){
			var staticHeight = (this.options.staticHeight===-1) ? this.$element.attr('data-staticheight') : this.options.staticHeight;
			var height;

			if(staticHeight==='true' || staticHeight===true){
				this.$canvas.addClass('scrolling');
				height = this.$element.height()
					- this.$element.find('.repeater-header').outerHeight()
					- this.$element.find('.repeater-footer').outerHeight()
					- parseInt(this.$element.css('margin-bottom'), 10)
					- parseInt(this.$element.css('margin-top'), 10);
				this.$viewport.height(height);
			}else{
				this.$canvas.removeClass('scrolling');
			}
		},

		runRenderer: function(container, renderer, data, callback){
			var async = { after: false, before: false, complete: false, render: false };
			var self = this;
			var repeat, subset, i, l;

			var loopSubset = function(index){
				var args = { container: container, data: data };
				if(renderer.repeat){
					args.subset = subset;
					args.index = index;
				}
				if(subset.length<1){
					callback();
				}else{
					start(args, function(){
						index++;
						if(index<subset.length){
							loopSubset(index);
						}else{
							callback();
						}
					});
				}
			};

			var start = function(args, cb){
				var item = '';

				var callbacks = {
					before: function(){
						proceed('render', args);
					},
					render: function(resp){
						if(resp!==null){
							item = $(resp);
							if(item.length<1){
								item = resp;
							}
							container.append(item);
							args.item = item;
						}
						proceed('after', args);
					},
					after: function(){
						var cont;
						var loopNested = function(cont, index){
							self.runRenderer(cont, renderer.nested[index], data, function(){
								index++;
								if(index<renderer.nested.length){
									loopNested(cont, index);
								}else{
									proceed('complete', args);
								}
							});
						};

						if(renderer.nested && !self.skipNested){
							cont = $(item);
							cont = (cont.attr('data-container')==='true') ? cont : cont.find('[data-container="true"]:first');
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
					argus = $.extend({}, argus);
					if(renderer[stage]){
						if(async[stage]){
							argus.callback = callbacks[stage];
							renderer[stage].call(self, argus);
						}else{
							callbacks[stage](renderer[stage].call(self, argus));
						}
					}else{
						callbacks[stage](null);
					}
				};

				self.skipNested = false;
				proceed('before', args);
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
				subset = data;
				for(i=0, l=repeat.length; i<l; i++){
					subset = subset[repeat[i]];
				}
			}else{
				subset = [''];
			}

			loopSubset(0);
		},

		viewChanged: function(){
			var self = this;
			setTimeout(function(){
				self.render({ changeView: self.$views.find('label.active input').val(), pageIncrement: null });
			},0);
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
		dataSource: function(options, callback){},
		defaultView: -1,	//should be a string value. -1 means it will grab the active view from the view controls
		dropPagingCap: 10,
		staticHeight: -1	//normally true or false. -1 means it will look for data-staticheight on the element
	};

	//views object contains keyed list of view plugins.
		//renderer object contains following optional parameters:
			//{
				//before: function(helpers){},
				//after: function(helpers){},
				//complete: function(helpers){},
				//repeat: 'parameter.subparameter.etc',
				//async: { after: false, before: false, complete: false, render: false }  (passing true sets all to true)
				//render: function(helpers){},
				//nested: [ *array of renderer objects* ]
			//}

			//helpers object structure:
				//{
					//container: jQuery object,	(current renderer parent)
					//data: {...}, (data returned from dataSource)
					//index: int, (only there if repeat was set. current item index)
					//item: str or jQuery object, (only there if rendered function returned value)
					//subset: {}, (only there if repeat was set. subset of data being repeated on)
				//}
	$.fn.repeater.views = {
		list: {
			renderer: {}
		},
		thumbnail: {
			//defualts: {},
			//initialize: function(){},
			renderer: {
				render: function(helpers){
					return '<div class="clearfix thumbnailCont" data-container="true"></div>';
				},
				nested: [
					{
						render: function(helpers){
							return '<div class="thumbnail" data-container="true" style="background: ' + helpers.subset[helpers.index].color + ';"><img height="75" src="' + helpers.subset[helpers.index].src + '" width="65">' + helpers.subset[helpers.index].name + '</div>';
						},
						repeat: 'items'
					}
				]
			}
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