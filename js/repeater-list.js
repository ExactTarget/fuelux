/*
 * Fuel UX Repeater - List View Plugin
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
         define(['jquery', 'fuelux/repeater'], factory);
    } else {
        // OR use browser globals if AMD is not present
        factory(jQuery);
    }
}(function ($) {
// -- END UMD WRAPPER PREFACE --

// -- BEGIN MODULE CODE HERE --

	if($.fn.repeater){

		$.fn.repeater.views.list = {
			dataOptions: function(opts, callback){
				if(this.listView_sortDirection){
					opts.sortDirection = this.listView_sortDirection;
				}
				if(this.listView_sortProperty){
					opts.sortProperty = this.listView_sortProperty;
				}
				callback(opts);
			},
			initialize: function(helpers, callback){
				this.listView_sortDirection = null;
				this.listView_sortProperty = null;
				callback();
			},
			selected: function(helpers, callback){
				this.listView_firstRender = true;
				this.$loader.addClass('noHeader');
				callback();
			},
			renderer: {
				complete: function(helpers, callback){
					var i = 0;
					var widths = [];
					var $header, $items;

					if(!this.options.listView_columnSyncing){
						callback();
					}else{
						$header = this.$element.find('.repeater-list-header:first');
						$items = this.$element.find('.repeater-list-items:first');
						$items.find('tr:first td').each(function(){
							widths.push($(this).outerWidth());
						});
						$header.find('td').each(function(){
							$(this).outerWidth(widths[i]);
							i++;
						});
						callback();
					}
				},
				nested: [
					{
						complete: function(helpers, callback){
							var auto = [];
							var self = this;
							var i, l, newWidth, taken;

							if(!this.options.listView_columnSizing || this.listView_columnsSame){
								callback();
							}else{
								i = 0;
								taken = 0;
								helpers.item.find('td').each(function(){
									var $col = $(this);
									var isLast = ($col.next('td').length===0) ? true : false;
									var width;
									if(self.listView_columns[i].width!==undefined){
										width = self.listView_columns[i].width;
										$col.outerWidth(width);
										taken +=  $col.outerWidth();
										if(!isLast){
											self.listView_columns[i]._auto_width = width;
										}else{
											$col.outerWidth('');
										}
									}else{
										auto.push({ col: $col, index: i, last: isLast });
									}
									i++;
								});

								l=auto.length;
								if(l>0){
									newWidth = (this.$canvas.width() - taken) / l;
									for(i=0; i<l; i++){
										if(!auto[i].last){
											auto[i].col.outerWidth(newWidth);
											this.listView_columns[auto[i].index]._auto_width = newWidth;
										}
									}
								}
								callback();
							}
						},
						render: function(helpers, callback){
							var differentColumns = function(oldCols, newCols){
								var i, j, l;
								if(!oldCols){ return true; }
								if(!newCols){ return false; }
								for(i=0, l=newCols.length; i<l; i++){
									if(!oldCols[i]){
										return true;
									}else{
										for(j in newCols[i]){
											if(oldCols[i][j]!==newCols[i][j]){
												return true;
											}
										}
									}
								}
								return false;
							};

							if(this.listView_firstRender || differentColumns(this.listView_columns, helpers.data.columns)){
								this.$element.find('.repeater-list-header').remove();
								this.listView_columns = helpers.data.columns;
								this.listView_columnsSame = false;
								this.listView_firstRender = false;
								this.$loader.removeClass('noHeader');
								callback({ item: '<table class="table repeater-list-header" data-preserve="deep"><tr data-container="true"></tr></table>' });
							}else{
								this.listView_columnsSame = true;
								callback({ skipNested: true });
							}
						},
						nested: [
							{
								render: function(helpers, callback){
									var chev = 'glyphicon-chevron';
									var chevDown = chev + '-down';
									var chevUp = chev + '-up';
									var index = helpers.index;
									var self = this;
									var subset = helpers.subset;
									var cssClass, $item, sortable, $span;

									cssClass = subset[index].cssClass;
									$item = $('<td><span class="glyphicon"></span></td>');
									$item.addClass(((cssClass!==undefined) ? cssClass : '')).prepend(subset[index].label);
									$span = $item.find('span.glyphicon:first');

									sortable = subset[index].sortable;
									if(sortable){
										$item.addClass('sortable');
										$item.on('click', function(){
											self.listView_sortProperty = (typeof sortable === 'string') ? sortable : subset[index].property;
											if($item.hasClass('sorted')){
												if($span.hasClass(chevUp)){
													$span.removeClass(chevUp).addClass(chevDown);
													self.listView_sortDirection = 'down';
												}else{
													if(!self.options.listView_sortClearing){
														$span.removeClass(chevDown).addClass(chevUp);
														self.listView_sortDirection = 'up';
													}else{
														$item.removeClass('sorted');
														$span.removeClass(chevDown);
														self.listView_sortDirection = null;
														self.listView_sortProperty = null;
													}
												}
											}else{
												helpers.container.find('td').removeClass('sorted');
												$span.removeClass(chevDown).addClass(chevUp);
												self.listView_sortDirection = 'asc';
												$item.addClass('sorted');
											}
											self.render();
										});
									}
									if(subset[index].sortDirection==='asc' || subset[index].sortDirection==='desc'){
										helpers.container.find('td').removeClass('sorted');
										$item.addClass('sortable sorted');
										if(subset[index].sortDirection==='asc'){
											$span.addClass(chevUp);
											this.listView_sortDirection = 'asc';
										}else{
											$span.addClass(chevDown);
											this.listView_sortDirection = 'desc';
										}
										this.listView_sortProperty = (typeof sortable === 'string') ? sortable : subset[index].property;
									}

									callback({ item: $item });
								},
								repeat: 'data.columns'
							}
						]
					},
					{
						after: function(helpers, callback){
							var canvas = this.$canvas;
							var header = canvas.find('.repeater-list-header');
							if(this.staticHeight){
								helpers.item.height(canvas.height()-header.outerHeight());
							}
							callback();
						},
						render: function(helpers, callback){
							callback({ item: '<div class="repeater-list-wrapper"><table class="table repeater-list-items" data-container="true"></table></div>' });
						},
						nested: [
							{
								complete: function(helpers, callback){
									var obj = { container: helpers.container };
									if(helpers.item!==undefined){
										obj.item = helpers.item;
									}
									if(this.options.listView_rowRendered){
										this.options.listView_rowRendered(obj, function(){
											callback();
										});
									}else{
										callback();
									}
								},
								render: function(helpers, callback){
									this.listView_curRowIndex = helpers.index;
									callback({ item: '<tr data-container="true"></tr>' });
								},
								repeat: 'data.items',
								nested: [
									{
										after: function(helpers, callback){
											var obj = { container: helpers.container };
											if(helpers.item!==undefined){
												obj.item = helpers.item;
											}
											if(this.options.listView_columnRendered){
												this.options.listView_columnRendered(obj, function(){
													callback();
												});
											}else{
												callback();
											}
										},
										render: function(helpers, callback){
											var cssClass = helpers.subset[helpers.index].cssClass;
											var content = helpers.data.items[this.listView_curRowIndex][helpers.subset[helpers.index].property];
											var $item = $('<td></td>');
											var width = helpers.subset[helpers.index]._auto_width;

											$item.addClass(((cssClass!==undefined) ? cssClass : '')).append(content);
											if(width!==undefined){
												$item.outerWidth(width);
											}
											callback({ item: $item });
										},
										repeat: 'this.listView_columns'
									}
								]
							}
						]
					}
				]
			}
		};

		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			listView_columnRendered: null,
			listView_columnSizing: true,
			listView_columnSyncing: true,
			listView_sortClearing: false,
			listView_rowRendered: null
		});

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --