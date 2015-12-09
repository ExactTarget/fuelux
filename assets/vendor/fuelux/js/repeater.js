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
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'), require('./combobox'), require('./infinite-scroll'),
			require('./search'), require('./selectlist'));
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
		var $btn, currentView;

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

		this.currentPage = 0;
		this.currentView = null;
		this.isDisabled = false;
		this.infiniteScrollingCallback = function () {};
		this.infiniteScrollingCont = null;
		this.infiniteScrollingEnabled = false;
		this.infiniteScrollingEnd = null;
		this.infiniteScrollingOptions = {};
		this.lastPageInput = 0;
		this.options = $.extend({}, $.fn.repeater.defaults, options);
		this.pageIncrement = 0;// store direction navigated
		this.resizeTimeout = {};
		this.stamp = new Date().getTime() + (Math.floor(Math.random() * 100) + 1);
		this.storedDataSourceOpts = null;
		this.syncingViewButtonState = false;
		this.viewOptions = {};
		this.viewType = null;

		this.$filters.selectlist();
		this.$pageSize.selectlist();
		this.$primaryPaging.find('.combobox').combobox();
		this.$search.search({
			searchOnKeyPress: this.options.searchOnKeyPress
		});

		this.$filters.on('changed.fu.selectlist', function (e, value) {
			self.$element.trigger('filtered.fu.repeater', value);
			self.render({
				clearInfinite: true,
				pageIncrement: null
			});
		});
		this.$nextBtn.on('click.fu.repeater', $.proxy(this.next, this));
		this.$pageSize.on('changed.fu.selectlist', function (e, value) {
			self.$element.trigger('pageSizeChanged.fu.repeater', value);
			self.render({
				pageIncrement: null
			});
		});
		this.$prevBtn.on('click.fu.repeater', $.proxy(this.previous, this));
		this.$primaryPaging.find('.combobox').on('changed.fu.combobox', function (evt, data) {
			self.$element.trigger('pageChanged.fu.repeater', [data.text, data]);
			self.pageInputChange(data.text);
		});
		this.$search.on('searched.fu.search cleared.fu.search', function (e, value) {
			self.$element.trigger('searchChanged.fu.repeater', value);
			self.render({
				clearInfinite: true,
				pageIncrement: null
			});
		});
		this.$secondaryPaging.on('blur.fu.repeater', function (e) {
			self.pageInputChange(self.$secondaryPaging.val());
		});
		this.$secondaryPaging.on('keyup', function (e) {
			if (e.keyCode === 13) {
				self.pageInputChange(self.$secondaryPaging.val());
			}
		});
		this.$views.find('input').on('change.fu.repeater', $.proxy(this.viewChanged, this));

		// ID needed since event is bound to instance
		$(window).on('resize.fu.repeater.' + this.stamp, function (event) {
			clearTimeout(self.resizeTimeout);
			self.resizeTimeout = setTimeout(function () {
				self.resize();
				self.$element.trigger('resized.fu.repeater');
			}, 75);
		});

		this.$loader.loader();
		this.$loader.loader('pause');
		if (this.options.defaultView !== -1) {
			currentView = this.options.defaultView;
		} else {
			$btn = this.$views.find('label.active input');
			currentView = ($btn.length > 0) ? $btn.val() : 'list';
		}

		this.setViewOptions(currentView);

		this.initViewTypes(function () {
			self.resize();
			self.$element.trigger('resized.fu.repeater');
			self.render({
				changeView: currentView
			});
		});
	};

	Repeater.prototype = {
		constructor: Repeater,

		clear: function (options) {
			var viewChanged, viewTypeObj;

			function scan (cont) {
				var keep = [];
				cont.children().each(function () {
					var item = $(this);
					var pres = item.attr('data-preserve');
					if (pres === 'deep') {
						item.detach();
						keep.push(item);
					} else if (pres === 'shallow') {
						scan(item);
						item.detach();
						keep.push(item);
					}
				});
				cont.empty();
				cont.append(keep);
			}

			options = options || {};

			if (!options.preserve) {
				//Just trash everything because preserve is false
				this.$canvas.empty();
			} else if (!this.infiniteScrollingEnabled || options.clearInfinite) {
				//Preserve clear only if infiniteScrolling is disabled or if specifically told to do so
				scan(this.$canvas);
			}	//Otherwise don't clear because infiniteScrolling is enabled

			//If viewChanged and current viewTypeObj has a cleared function, call it
			viewChanged = (options.viewChanged !== undefined) ? options.viewChanged : false;
			viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};
			if (!viewChanged && viewTypeObj.cleared) {
				viewTypeObj.cleared.call(this, {
					options: options
				});
			}
		},

		clearPreservedDataSourceOptions: function () {
			this.storedDataSourceOpts = null;
		},

		destroy: function () {
			var markup;
			// set input value attrbute in markup
			this.$element.find('input').each(function () {
				$(this).attr('value', $(this).val());
			});

			// empty elements to return to original markup
			this.$canvas.empty();
			markup = this.$element[0].outerHTML;

			// destroy components and remove leftover
			this.$element.find('.combobox').combobox('destroy');
			this.$element.find('.selectlist').selectlist('destroy');
			this.$element.find('.search').search('destroy');
			if (this.infiniteScrollingEnabled) {
				$(this.infiniteScrollingCont).infinitescroll('destroy');
			}

			this.$element.remove();

			// any external events
			$(window).off('resize.fu.repeater.' + this.stamp);

			return markup;
		},

		disable: function() {
			var disable = 'disable';
			var disabled = 'disabled';
			var viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};

			this.$search.search(disable);
			this.$filters.selectlist(disable);
			this.$views.find('label, input').addClass(disabled).attr(disabled, disabled);
			this.$pageSize.selectlist(disable);
			this.$primaryPaging.find('.combobox').combobox(disable);
			this.$secondaryPaging.attr(disabled, disabled);
			this.$prevBtn.attr(disabled, disabled);
			this.$nextBtn.attr(disabled, disabled);

			if (viewTypeObj.enabled) {
				viewTypeObj.enabled.call(this, {
					status: false
				});
			}

			this.isDisabled = true;
			this.$element.addClass('disabled');
			this.$element.trigger('disabled.fu.repeater');
		},

		enable: function() {
			var disabled = 'disabled';
			var enable = 'enable';
			var pageEnd = 'page-end';
			var viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};

			this.$search.search(enable);
			this.$filters.selectlist(enable);
			this.$views.find('label, input').removeClass(disabled).removeAttr(disabled);
			this.$pageSize.selectlist('enable');
			this.$primaryPaging.find('.combobox').combobox(enable);
			this.$secondaryPaging.removeAttr(disabled);

			if(!this.$prevBtn.hasClass(pageEnd)){
				this.$prevBtn.removeAttr(disabled);
			}
			if(!this.$nextBtn.hasClass(pageEnd)){
				this.$nextBtn.removeAttr(disabled);
			}

			// is 0 or 1 pages, if using $primaryPaging (combobox)
			// if using selectlist allow user to use selectlist to select 0 or 1
			if (this.$prevBtn.hasClass(pageEnd) && this.$nextBtn.hasClass(pageEnd)) {
				this.$primaryPaging.combobox('disable');
			}

			//if there are no items
			if (parseInt(this.$count.html()) !== 0) {
				this.$pageSize.selectlist('enable');
			}
			else {
				this.$pageSize.selectlist('disable');
			}

			if (viewTypeObj.enabled) {
				viewTypeObj.enabled.call(this, {
					status: true
				});
			}

			this.isDisabled = false;
			this.$element.removeClass('disabled');
			this.$element.trigger('enabled.fu.repeater');
		},

		getDataOptions: function (options) {
			var dataSourceOptions = {};
			var opts = {};
			var val, viewDataOpts;

			options = options || {};

			opts.filter = (this.$filters.length > 0) ? this.$filters.selectlist('selectedItem') : {
				text: 'All',
				value: 'all'
			};
			opts.view = this.currentView;

			if (!this.infiniteScrollingEnabled) {
				opts.pageSize = (this.$pageSize.length > 0) ? parseInt(this.$pageSize.selectlist('selectedItem').value, 10) : 25;
			}

			if (options.pageIncrement !== undefined) {
				if (options.pageIncrement === null) {
					this.currentPage = 0;
				} else {
					this.currentPage += options.pageIncrement;
				}

			}

			opts.pageIndex = this.currentPage;

			val = (this.$search.length > 0) ? this.$search.find('input').val() : '';
			if (val !== '') {
				opts.search = val;
			}

			if (options.dataSourceOptions) {
				dataSourceOptions = options.dataSourceOptions;
				if (options.preserveDataSourceOptions) {
					this.storedDataSourceOpts = (this.storedDataSourceOpts) ? $.extend(this.storedDataSourceOpts, dataSourceOptions) : dataSourceOptions;
				}
			}

			if (this.storedDataSourceOpts) {
				dataSourceOptions = $.extend(this.storedDataSourceOpts, dataSourceOptions);
			}

			viewDataOpts = $.fn.repeater.viewTypes[this.viewType] || {};
			viewDataOpts = viewDataOpts.dataOptions;
			if (viewDataOpts) {
				viewDataOpts = viewDataOpts.call(this, opts);
				opts = $.extend(viewDataOpts, dataSourceOptions);
			} else {
				opts = $.extend(opts, dataSourceOptions);
			}

			return opts;
		},

		infiniteScrolling: function (enable, options) {
			var footer = this.$element.find('.repeater-footer');
			var viewport = this.$element.find('.repeater-viewport');
			var cont, data;

			options = options || {};

			if (enable) {
				this.infiniteScrollingEnabled = true;
				this.infiniteScrollingEnd = options.end;
				delete options.dataSource;
				delete options.end;
				this.infiniteScrollingOptions = options;
				viewport.css({
					height: viewport.height() + footer.outerHeight()
				});
				footer.hide();
			} else {
				cont = this.infiniteScrollingCont;
				data = cont.data();
				delete data.infinitescroll;
				cont.off('scroll');
				cont.removeClass('infinitescroll');

				this.infiniteScrollingCont = null;
				this.infiniteScrollingEnabled = false;
				this.infiniteScrollingEnd = null;
				this.infiniteScrollingOptions = {};
				viewport.css({
					height: viewport.height() - footer.outerHeight()
				});
				footer.show();
			}
		},

		infiniteScrollPaging: function (data, options) {
			var end = (this.infiniteScrollingEnd !== true) ? this.infiniteScrollingEnd : undefined;
			var page = data.page;
			var pages = data.pages;

			this.currentPage = (page !== undefined) ? page : NaN;

			if (data.end === true || (this.currentPage + 1) >= pages) {
				this.infiniteScrollingCont.infinitescroll('end', end);
			}
		},

		initInfiniteScrolling: function () {
			var cont = this.$canvas.find('[data-infinite="true"]:first');
			var opts, self;

			cont = (cont.length < 1) ? this.$canvas : cont;
			if (cont.data('fu.infinitescroll')) {
				cont.infinitescroll('enable');
			} else {
				self = this;
				opts = $.extend({}, this.infiniteScrollingOptions);
				opts.dataSource = function (helpers, callback) {
					self.infiniteScrollingCallback = callback;
					self.render({
						pageIncrement: 1
					});
				};
				cont.infinitescroll(opts);
				this.infiniteScrollingCont = cont;
			}
		},

		initViewTypes: function (callback) {
			var self = this;
			var viewTypes = [];
			var i, viewTypesLength;

			function init (index) {
				function next () {
					index++;
					if (index < viewTypesLength) {
						init(index);
					} else {
						callback();
					}
				}

				if (viewTypes[index].initialize) {
					viewTypes[index].initialize.call(self, {}, function () {
						next();
					});
				} else {
					next();
				}
			}

			for (i in $.fn.repeater.viewTypes) {
				viewTypes.push($.fn.repeater.viewTypes[i]);
			}
			viewTypesLength = viewTypes.length;
			if (viewTypesLength > 0) {
				init(0);
			} else {
				callback();
			}
		},

		itemization: function (data) {
			this.$count.html((data.count!==undefined) ? data.count : '?');
			this.$end.html((data.end!==undefined) ? data.end : '?');
			this.$start.html((data.start!==undefined) ? data.start : '?');
		},

		next: function (e) {
			var d = 'disabled';
			this.$nextBtn.attr(d, d);
			this.$prevBtn.attr(d, d);
			this.pageIncrement = 1;
			this.$element.trigger('nextClicked.fu.repeater');
			this.render({
				pageIncrement: this.pageIncrement
			});
		},

		pageInputChange: function (val) {
			var pageInc;
			if (val !== this.lastPageInput) {
				this.lastPageInput = val;
				val = parseInt(val, 10) - 1;
				pageInc = val - this.currentPage;
				this.$element.trigger('pageChanged.fu.repeater', val);
				this.render({
					pageIncrement: pageInc
				});
			}
		},

		pagination: function (data) {
			var act = 'active';
			var dsbl = 'disabled';
			var page = data.page;
			var pageEnd = 'page-end';
			var pages = data.pages;
			var dropMenu, i, l;
			var currenPageOutput;

			this.currentPage = (page !== undefined) ? page : NaN;

			this.$primaryPaging.removeClass(act);
			this.$secondaryPaging.removeClass(act);

			// set paging to 0 if total pages is 0, otherwise use one-based index
			currenPageOutput = pages === 0 ? 0 : this.currentPage + 1;

			if (pages <= this.viewOptions.dropPagingCap) {
				this.$primaryPaging.addClass(act);
				dropMenu = this.$primaryPaging.find('.dropdown-menu');
				dropMenu.empty();
				for (i = 0; i < pages; i++) {
					l = i + 1;
					dropMenu.append('<li data-value="' + l + '"><a href="#">' + l + '</a></li>');
				}

				this.$primaryPaging.find('input.form-control').val(currenPageOutput);
			} else {
				this.$secondaryPaging.addClass(act);
				this.$secondaryPaging.val(currenPageOutput);
			}

			this.lastPageInput = this.currentPage + 1 + '';

			this.$pages.html('' + pages);

			// this is not the last page
			if ((this.currentPage + 1) < pages) {
				this.$nextBtn.removeAttr(dsbl);
				this.$nextBtn.removeClass(pageEnd);
			} else {
				this.$nextBtn.attr(dsbl, dsbl);
				this.$nextBtn.addClass(pageEnd);
			}

			// this is not the first page
			if ((this.currentPage - 1) >= 0) {
				this.$prevBtn.removeAttr(dsbl);
				this.$prevBtn.removeClass(pageEnd);
			} else {
				this.$prevBtn.attr(dsbl, dsbl);
				this.$prevBtn.addClass(pageEnd);
			}

			// return focus to next/previous buttons after navigating
			if (this.pageIncrement !== 0) {
				if (this.pageIncrement > 0) {
					if (this.$nextBtn.is(':disabled')) {
						// if you can't focus, go the other way
						this.$prevBtn.focus();
					} else {
						this.$nextBtn.focus();
					}

				} else {
					if (this.$prevBtn.is(':disabled')) {
						// if you can't focus, go the other way
						this.$nextBtn.focus();
					} else {
						this.$prevBtn.focus();
					}

				}

			}
		},

		previous: function () {
			var d = 'disabled';
			this.$nextBtn.attr(d, d);
			this.$prevBtn.attr(d, d);
			this.pageIncrement = -1;
			this.$element.trigger('previousClicked.fu.repeater');
			this.render({
				pageIncrement: this.pageIncrement
			});
		},

		render: function (options) {
			var self = this;
			var viewChanged = false;
			var viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};
			var dataOptions, prevView;

			options = options || {};
			this.disable();

			if (options.changeView && (this.currentView !== options.changeView)) {
				prevView = this.currentView;
				this.currentView = options.changeView;
				this.viewType = this.currentView.split('.')[0];
				this.setViewOptions(this.currentView);
				this.$element.attr('data-currentview', this.currentView);
				this.$element.attr('data-viewtype', this.viewType);
				viewChanged = true;
				options.viewChanged = viewChanged;

				this.$element.trigger('viewChanged.fu.repeater', this.currentView);

				if (this.infiniteScrollingEnabled) {
					self.infiniteScrolling(false);
				}

				viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};
				if (viewTypeObj.selected) {
					viewTypeObj.selected.call(this, {
						prevView: prevView
					});
				}
			}

			this.syncViewButtonState();

			options.preserve = (options.preserve !== undefined) ? options.preserve : !viewChanged;
			this.clear(options);

			if (!this.infiniteScrollingEnabled || (this.infiniteScrollingEnabled && viewChanged)) {
				this.$loader.show().loader('play');
			}

			dataOptions = this.getDataOptions(options);

			this.viewOptions.dataSource(dataOptions, function (data) {
				data = data || {};

				if (self.infiniteScrollingEnabled) {
					// pass empty object because data handled in infiniteScrollPaging method
					self.infiniteScrollingCallback({});
				} else {
					self.itemization(data);
					self.pagination(data);
				}

				self.runRenderer(viewTypeObj, data, function () {
					if (self.infiniteScrollingEnabled) {
						if (viewChanged || options.clearInfinite) {
							self.initInfiniteScrolling();
						}

						self.infiniteScrollPaging(data, options);
					}

					self.$loader.hide().loader('pause');
					self.enable();

					self.$element.trigger('rendered.fu.repeater', {
						data: data,
						options: dataOptions,
						renderOptions: options
					});
					//for maintaining support of 'loaded' event
					self.$element.trigger('loaded.fu.repeater', dataOptions);
				});
			});
		},

		resize: function () {
			var staticHeight = (this.viewOptions.staticHeight === -1) ? this.$element.attr('data-staticheight') : this.viewOptions.staticHeight;
			var viewTypeObj = {};
			var height, viewportMargins;

			if (this.viewType) {
				viewTypeObj = $.fn.repeater.viewTypes[this.viewType] || {};
			}

			if (staticHeight !== undefined && staticHeight !== false && staticHeight !== 'false') {
				this.$canvas.addClass('scrolling');
				viewportMargins = {
					bottom: this.$viewport.css('margin-bottom'),
					top: this.$viewport.css('margin-top')
				};

				var staticHeightValue = (staticHeight === 'true' || staticHeight === true) ? this.$element.height() : parseInt(staticHeight, 10);
				var headerHeight = this.$element.find('.repeater-header').outerHeight();
				var footerHeight = this.$element.find('.repeater-footer').outerHeight();
				var bottomMargin = (viewportMargins.bottom === 'auto') ? 0 : parseInt(viewportMargins.bottom, 10);
				var topMargin = (viewportMargins.top === 'auto') ? 0 : parseInt(viewportMargins.top, 10);

				height = staticHeightValue - headerHeight - footerHeight - bottomMargin - topMargin;
				this.$viewport.outerHeight(height);
			} else {
				this.$canvas.removeClass('scrolling');
			}

			if (viewTypeObj.resize) {
				viewTypeObj.resize.call(this, {
					height: this.$element.outerHeight(),
					width: this.$element.outerWidth()
				});
			}
		},

		runRenderer: function (viewTypeObj, data, callback) {
			var $container, i, l, response, repeat, subset;

			function addItem ($parent, resp) {
				var action;
				if (resp) {
					action = (resp.action) ? resp.action : 'append';
					if (action !== 'none' && resp.item !== undefined) {
						$parent = (resp.container !== undefined) ? $(resp.container) : $parent;
						$parent[action](resp.item);
					}
				}
			}

			if (!viewTypeObj.render) {
				if (viewTypeObj.before) {
					response = viewTypeObj.before.call(this, {
						container: this.$canvas,
						data: data
					});
					addItem(this.$canvas, response);
				}

				$container = this.$canvas.find('[data-container="true"]:last');
				$container = ($container.length > 0) ? $container : this.$canvas;

				if (viewTypeObj.renderItem) {
					repeat = viewTypeObj.repeat || 'data.items';
					repeat = repeat.split('.');
					if (repeat[0] === 'data' || repeat[0] === 'this') {
						subset = (repeat[0] === 'this') ? this : data;
						repeat.shift();
					} else {
						repeat = [];
						subset = [];
						if (window.console && window.console.warn) {
							window.console.warn('WARNING: Repeater plugin "repeat" value must start with either "data" or "this"');
						}
					}

					for (i = 0, l = repeat.length; i < l; i++) {
						if (subset[repeat[i]] !== undefined){
							subset = subset[repeat[i]];
						} else {
							subset = [];
							if (window.console && window.console.warn) {
								window.console.warn('WARNING: Repeater unable to find property to iterate renderItem on.');
							}
							break;
						}
					}

					for (i = 0, l = subset.length; i < l; i++) {
						response = viewTypeObj.renderItem.call(this, {
							container: $container,
							data: data,
							index: i,
							subset: subset
						});
						addItem($container, response);
					}
				}

				if (viewTypeObj.after) {
					response = viewTypeObj.after.call(this, {
						container: this.$canvas,
						data: data
					});
					addItem(this.$canvas, response);
				}

				callback();
			} else {
				viewTypeObj.render.call(this, {
					container: this.$canvas,
					data: data
				}, function(){
					callback();
				});
			}

		},

		setViewOptions: function (curView) {
			var opts = {};
			var viewName = curView.split('.')[1];

			if (this.options.views) {
				opts = this.options.views[viewName] || this.options.views[curView] || {};
			} else {
				opts = {};
			}

			this.viewOptions = $.extend({}, this.options, opts);
		},

		viewChanged: function (e) {
			var $selected = $(e.target);
			var val = $selected.val();

			if (!this.syncingViewButtonState) {
				if (this.isDisabled || $selected.parents('label:first').hasClass('disabled')) {
					this.syncViewButtonState();
				} else {
					this.render({
						changeView: val,
						pageIncrement: null
					});
				}
			}
		},

		syncViewButtonState: function () {
			var $itemToCheck = this.$views.find('input[value="' + this.currentView + '"]');

			this.syncingViewButtonState = true;
			this.$views.find('input').prop('checked', false);
			this.$views.find('label.active').removeClass('active');

			if ($itemToCheck.length > 0) {
				$itemToCheck.prop('checked', true);
				$itemToCheck.parents('label:first').addClass('active');
			}
			this.syncingViewButtonState = false;
		}
	};

	// REPEATER PLUGIN DEFINITION

	$.fn.repeater = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('fu.repeater');
			var options = typeof option === 'object' && option;

			if (!data) {
				$this.data('fu.repeater', (data = new Repeater(this, options)));
			}

			if (typeof option === 'string') {
				methodReturn = data[option].apply(data, args);
			}
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.repeater.defaults = {
		dataSource: function (options, callback) {
			callback({ count: 0, end: 0, items: [], page: 0, pages: 1, start: 0 });
		},
		defaultView: -1,	//should be a string value. -1 means it will grab the active view from the view controls
		dropPagingCap: 10,
		staticHeight: -1,	//normally true or false. -1 means it will look for data-staticheight on the element
		views: null,		//can be set to an object to configure multiple views of the same type,
		searchOnKeyPress: false
	};

	$.fn.repeater.viewTypes = {};

	$.fn.repeater.Constructor = Repeater;

	$.fn.repeater.noConflict = function () {
		$.fn.repeater = old;
		return this;
	};

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
