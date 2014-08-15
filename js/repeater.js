/*
 * Fuel UX Repeater
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
         define(['jquery', 'fuelux/combobox', 'fuelux/infinite-scroll', 'fuelux/search', 'fuelux/selectlist'], factory);
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
		var currentView;

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
		this.$search = this.$element.find('.repeater-search').find('.search');
		this.$secondaryPaging = this.$element.find('.repeater-secondaryPaging');
		this.$start = this.$element.find('.repeater-start');
		this.$viewport = this.$element.find('.repeater-viewport');
		this.$views = this.$element.find('.repeater-views');

		this.eventStamp = new Date().getTime() + (Math.floor(Math.random() * 100) + 1);
		this.currentPage = 0;
		this.currentView = null;
		this.infiniteScrollingCallback = function(){};
		this.infiniteScrollingCont = null;
		this.infiniteScrollingEnabled = false;
		this.infiniteScrollingEnd = null;
		this.infiniteScrollingOptions = {};
		this.lastPageInput = 0;
		this.options = $.extend({}, $.fn.repeater.defaults, options);
		this.pageIncrement = 0;	// store direction navigated
		this.resizeTimeout = {};
		this.staticHeight = (this.options.staticHeight===-1) ? this.$element.attr('data-staticheight') : this.options.staticHeight;

		this.$filters.selectlist();
		this.$pageSize.selectlist();
		this.$primaryPaging.find('.combobox').combobox();
		this.$search.search();

		this.$filters.on('changed.fu.selectlist', $.proxy(this.render, this, { clearInfinite: true, pageIncrement: null }));
		this.$nextBtn.on('click.fu.repeater', $.proxy(this.next, this));
		this.$pageSize.on('changed.fu.selectlist', $.proxy(this.render, this, { pageIncrement: null }));
		this.$prevBtn.on('click.fu.repeater', $.proxy(this.previous, this));
		this.$primaryPaging.find('.combobox').on('changed.fu.combobox', function(evt, data){ self.pageInputChange(data.text); });
		this.$search.on('searched.fu.search cleared.fu.search', $.proxy(this.render, this, { clearInfinite: true, pageIncrement: null }));
		this.$secondaryPaging.on('blur.fu.repeater', function(){ self.pageInputChange(self.$secondaryPaging.val()); });
		this.$secondaryPaging.on('change.fu.repeater', function(){ self.pageInputChange(self.$secondaryPaging.val()); });
		this.$views.find('input').on('change.fu.repeater', $.proxy(this.viewChanged, this));

		// ID needed since event is bound to instance
		$(window).on('resize.fu.repeater.'+this.eventStamp, function(event){
			clearTimeout(self.resizeTimeout);
			self.resizeTimeout = setTimeout(function(){
				self.resize();
				self.$element.trigger('resized.fu.repeater');
			}, 75);
		});

		this.$loader.loader();
		this.$loader.loader('pause');
		currentView = (this.options.defaultView!==-1) ? this.options.defaultView : this.$views.find('label.active input').val();

		this.initViews(function(){
			self.resize();
			self.$element.trigger('resized.fu.repeater');
			self.render({ changeView: currentView });
		});
	};

	Repeater.prototype = {
		constructor: Repeater,

		clear: function(options){
			var scan = function(cont){
				var keep = [];
				cont.children().each(function(){
					var item = $(this);
					var pres = item.attr('data-preserve');
					if(pres==='deep'){
						item.detach();
						keep.push(item);
					}else if(pres==='shallow'){
						scan(item);
						item.detach();
						keep.push(item);
					}
				});
				cont.empty();
				cont.append(keep);
			};

			options = options || {};

			if(!options.preserve){
				this.$canvas.empty();
			}else if(!this.infiniteScrollingEnabled || options.clearInfinite){
				scan(this.$canvas);
			}
		},

		destroy: function() {
			var markup;
			// set input value attrbute in markup
			this.$element.find('input').each(function() {
				$(this).attr('value', $(this).val());
			});
			
			// empty elements to return to original markup
			this.$canvas.empty();
			markup = this.$element[0].outerHTML;

			// destroy components and remove leftover
			this.$element.find('.combobox').combobox('destroy');
			this.$element.find('.selectlist').selectlist('destroy');
			this.$element.find('.search').search('destroy');
			if(this.infiniteScrollingEnabled) {
				$(this.infiniteScrollingCont).infinitescroll('destroy');
			}
			this.$element.remove();

			// any external events
			$(window).off('resize.fu.repeater.'+this.eventStamp);

			return markup;
		},

		getDataOptions: function(options, callback){
			var opts = {};
			var val, viewDataOpts;

			options = options || {};

			opts.filter = this.$filters.selectlist('selectedItem');
			opts.view = this.currentView;

			if(!this.infiniteScrollingEnabled){
				opts.pageSize = parseInt(this.$pageSize.selectlist('selectedItem').value, 10);
			}
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

			viewDataOpts = $.fn.repeater.views[this.currentView] || {};
			viewDataOpts = viewDataOpts.dataOptions;
			if(viewDataOpts){
				viewDataOpts.call(this, opts, function(obj){
					callback(obj);
				});
			}else{
				callback(opts);
			}
		},

		infiniteScrolling: function(enable, options){
			var itemization = this.$element.find('.repeater-itemization');
			var pagination = this.$element.find('.repeater-pagination');
			var cont, data;

			options = options || {};

			if(enable){
				this.infiniteScrollingEnabled = true;
				this.infiniteScrollingEnd = options.end;
				delete options.dataSource;
				delete options.end;
				this.infiniteScrollingOptions = options;
				itemization.hide();
				pagination.hide();
			}else{
				cont = this.infiniteScrollingCont;
				data = cont.data();
				delete data.infinitescroll;
				cont.off('scroll');
				cont.removeClass('infinitescroll');

				this.infiniteScrollingCont = null;
				this.infiniteScrollingEnabled = false;
				this.infiniteScrollingEnd = null;
				this.infiniteScrollingOptions = {};
				itemization.show();
				pagination.show();
			}
		},

		infiniteScrollPaging: function(data, options){
			var end = (this.infiniteScrollingEnd!==true) ? this.infiniteScrollingEnd : undefined;
			var page = data.page;
			var pages = data.pages;

			this.currentPage = (page!==undefined) ? page : NaN;

			if((this.currentPage+1)>=pages){
				this.infiniteScrollingCont.infinitescroll('end', end);
			}
		},

		initInfiniteScrolling: function(){
			var cont = this.$canvas.find('[data-infinite="true"]:first');
			var opts, self;

			cont = (cont.length<1) ? this.$canvas : cont;
			if(cont.data('fu.infinitescroll')){
				cont.infinitescroll('enable');
			}else{
				self = this;
				opts = $.extend({}, this.infiniteScrollingOptions);
				opts.dataSource = function(helpers, callback){
					self.infiniteScrollingCallback = callback;
					self.render({ pageIncrement: 1 });
				};
				cont.infinitescroll(opts);
				this.infiniteScrollingCont = cont;
			}
		},

		initViews: function(callback){
			var views = [];
			var i, viewsLength;

			var init = function(index){
				var next = function(){
					index++;
					if(index<viewsLength){
						init(index);
					}else{
						callback();
					}
				};

				if(views[index].initialize){
					views[index].initialize.call(this, {}, function(){
						next();
					});
				}else{
					next();
				}
			};

			for(i in $.fn.repeater.views){
				views.push($.fn.repeater.views[i]);
			}
			viewsLength = views.length;
			if(viewsLength>0){
				init(0);
			}else{
				callback();
			}
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
			this.pageIncrement = 1;
			this.render({ pageIncrement: this.pageIncrement });
		},

		pageInputChange: function(val){
			var pageInc;
			if(val!==this.lastPageInput){
				this.lastPageInput = val;
				val = parseInt(val, 10) - 1;
				pageInc = val - this.currentPage;
				this.render({ pageIncrement: pageInc });
			}
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
			this.lastPageInput = this.currentPage + 1 + '';

			this.$pages.html(pages);

			// this is not the last page
			if((this.currentPage+1) < pages){
				this.$nextBtn.removeAttr(dsbl);
			}else{
				this.$nextBtn.attr(dsbl, dsbl);
			}
			// this is not the first page
			if((this.currentPage-1) >= 0){
				this.$prevBtn.removeAttr(dsbl);
			}else{
				this.$prevBtn.attr(dsbl, dsbl);
			}

			// return focus to next/previous buttons after navigating
			if(this.pageIncrement !== 0) {
				if(this.pageIncrement > 0 ) {
					if( this.$nextBtn.is(':disabled') ) {
						// if you can't focus, go the other way
						this.$prevBtn.focus();
					}
					else {
						this.$nextBtn.focus();
					}
				}
				else {
					if( this.$prevBtn.is(':disabled') ) {
						// if you can't focus, go the other way
						this.$nextBtn.focus();
					}
					else {
						this.$prevBtn.focus();
					}
				}
			}
		},

		previous: function(){
			var d = 'disabled';
			this.$nextBtn.attr(d, d);
			this.$prevBtn.attr(d, d);
			this.pageIncrement = -1;
			this.render({ pageIncrement: this.pageIncrement });
		},

		render: function(options){
			var self = this;
			var viewChanged = false;
			var viewObj = $.fn.repeater.views[self.currentView] || {};
			var prevView;

			var start = function(){
				options.preserve = (options.preserve!==undefined) ? options.preserve : !viewChanged;
				self.clear(options);
				if(!self.infiniteScrollingEnabled || (self.infiniteScrollingEnabled && viewChanged)){
					self.$loader.show().loader('play');
				}
				self.getDataOptions(options, function(opts){
					self.options.dataSource(opts, function(data){
						var renderer = viewObj.renderer;
						if(self.infiniteScrollingEnabled){
							self.infiniteScrollingCallback({});
						}else{
							self.itemization(data);
							self.pagination(data);
						}
						if(renderer){
							self.runRenderer(self.$canvas, renderer, data, function(){
								if(self.infiniteScrollingEnabled){
									if(viewChanged || options.clearInfinite){
										self.initInfiniteScrolling();
									}
									self.infiniteScrollPaging(data, options);
								}
								self.$loader.hide().loader('pause');
								self.$element.trigger('loaded.fu.repeater');
							});
						}
					});
				});
			};

			options = options || {};

			if(options.changeView && this.currentView!==options.changeView){
				prevView = this.currentView;
				this.currentView = options.changeView;
				this.$element.attr('data-currentview', this.currentView);
				viewChanged = true;
				if(this.infiniteScrollingEnabled){
					self.infiniteScrolling(false);
				}
				viewObj = $.fn.repeater.views[self.currentView] || {};
				if(viewObj.selected){
					viewObj.selected.call(this, { prevView: prevView }, function(){
						start();
					});
				}else{
					start();
				}
			}else{
				start();
			}
		},

		resize: function(){
			var staticHeight = this.staticHeight;
			var viewObj = $.fn.repeater.views[this.currentView] || {};
			var height, viewportMargins;

			if(staticHeight!==undefined){
				this.$canvas.addClass('scrolling');
				viewportMargins = {
					bottom: this.$viewport.css('margin-bottom'),
					top: this.$viewport.css('margin-top')
				};
				height = ((staticHeight==='true' || staticHeight===true) ? this.$element.height() : parseInt(staticHeight, 10)) -
					this.$element.find('.repeater-header').outerHeight() -
					this.$element.find('.repeater-footer').outerHeight() -
					((viewportMargins.bottom==='auto') ? 0 : parseInt(viewportMargins.bottom, 10)) -
					((viewportMargins.top==='auto') ? 0 : parseInt(viewportMargins.top, 10));
				this.$viewport.outerHeight(height);
			}else{
				this.$canvas.removeClass('scrolling');
			}

			if(viewObj.resize){
				viewObj.resize.call(this, {
					height: this.$element.outerHeight(),
					width: this.$element.outerWidth()
				}, function(){});
			}
		},

		runRenderer: function(container, renderer, data, callback){
			var self = this;
			var skipNested = false;
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
					before: function(resp){
						if(resp && resp.skipNested===true){
							skipNested = true;
						}
						proceed('render', args);
					},
					render: function(resp){
						var action = (resp && resp.action) ? resp.action : 'append';
						if(resp && resp.item!==undefined){
							item = $(resp.item);
							if(item.length<1){
								item = resp.item;
							}
							if(action!=='none'){
								container[action](item);
							}
							args.item = item;
						}
						if(resp && resp.skipNested===true){
							skipNested = true;
						}
						proceed('after', args);
					},
					after: function(resp){
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

						if(resp && resp.skipNested===true){
							skipNested = true;
						}

						if(renderer.nested && !skipNested){
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
					complete: function(resp){
						if(cb){
							cb();
						}
					}
				};

				var proceed = function(stage, argus){
					argus = $.extend({}, argus);
					if(renderer[stage]){
						renderer[stage].call(self, argus, callbacks[stage]);
					}else{
						callbacks[stage](null);
					}
				};

				proceed('before', args);
			};

			if(renderer.repeat){
				repeat = renderer.repeat.split('.');
				if(repeat[0]==='data' || repeat[0]==='this'){
					subset = (repeat[0]==='this') ? this : data;
					repeat.shift();
				}else{
					repeat = [];
					subset = [''];
				}

				for(i=0, l=repeat.length; i<l; i++){
					subset = subset[repeat[i]];
				}
			}else{
				subset = [''];
			}

			loopSubset(0);
		},

		viewChanged: function(e){
			var $selected = $(e.target);
			this.render({ changeView: $selected.val(), pageIncrement: null });
		}
	};

	// REPEATER PLUGIN DEFINITION

	$.fn.repeater = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data('fu.repeater');
			var options = typeof option === 'object' && option;

			if ( !data ) $this.data('fu.repeater', (data = new Repeater( this, options ) ) );
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

	//views object contains keyed list of view plugins, each an object with following optional parameters:
		//{
			//initialize: function(){},
			//selected: function(){},
			//renderer: {}
		//}
			//renderer object contains following optional parameters:
				//{
					//before: function(helpers){},
					//after: function(helpers){},
					//complete: function(helpers){},
					//repeat: 'parameter.subparameter.etc',
					//render: function(helpers){},
					//nested: [ *array of renderer objects* ]
				//}

				//helpers object structure:
					//{
						//container: jQuery object,	(current renderer parent)
						//data: {...}, (data returned from dataSource)
						//index: int, (only there if repeat was set. current item index)
						//item: str or jQuery object, (only there if rendered function returned item)
						//subset: {}, (only there if repeat was set. subset of data being repeated on)
					//}
	$.fn.repeater.views = {};

	$.fn.repeater.Constructor = Repeater;

	$.fn.repeater.noConflict = function () {
		$.fn.repeater = old;
		return this;
	};

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --