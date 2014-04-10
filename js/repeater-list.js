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
				self.listView_sortProperty = null;
				callback();
			},
			selected: function(helpers, callback){
				this.listView_firstRender = true;
				this.$loader.addClass('noHeader');
				callback();
			},
			renderer: {
				nested: [
					{
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
								this.listView_columnProperties = [];
								this.listView_column_width = 'width: ' + (100/helpers.data.columns.length) + '%;';
								this.listView_firstRender = false;
								this.$loader.removeClass('noHeader');
								callback({ item: '<table class="table repeater-list-header" data-preserve="deep"><tr data-container="true"></tr></table>' });
							}else{
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
									var $item, $span;

									this.listView_columnProperties.push(subset[index].property);
									$item = $('<td style="' + this.listView_column_width + '">' + subset[index].label + '<span class="glyphicon"></span></td>');
									$span = $item.find('span.glyphicon:first');
									if(subset[index].sortable){
										$item.addClass('sortable');
										$item.on('click', function(){
											self.listView_sortProperty = subset[index].property;
											if($item.hasClass('sorted')){
												if($span.hasClass(chevUp)){
													$span.removeClass(chevUp).addClass(chevDown);
													self.listView_sortDirection = 'down';
												}else{
													$item.removeClass('sorted');
													$span.removeClass(chevDown);
													self.listView_sortDirection = null;
													self.listView_sortProperty = null;
												}
											}else{
												self.$element.find('.repeater-list-header td').removeClass('sorted');
												$span.removeClass(chevDown).addClass(chevUp);
												self.listView_sortDirection = 'asc';
												$item.addClass('sorted');
											}
											self.render();
										});
									}
									if(subset[index].sortASC){
										$item.addClass('sortable sorted');
										$span.removeClass(chevDown).addClass(chevUp);
										this.listView_sortDirection = 'asc';
										self.listView_sortProperty = subset[index].property;
									}else if(subset[index].sortDESC){
										$item.addClass('sortable sorted');
										$span.removeClass(chevUp).addClass(chevDown);
										this.listView_sortDirection = 'desc';
										self.listView_sortProperty = subset[index].property;
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
							helpers.item.height(canvas.height()-header.outerHeight());
							callback();
						},
						render: function(helpers, callback){
							callback({ item: '<div class="repeater-list-wrapper"><table class="table repeater-list-items" data-container="true"></table></div>' });
						},
						nested: [
							{
								after: function(helpers, callback){
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
											var items = helpers.data.items;
											var content = items[this.listView_curRowIndex][helpers.subset[helpers.index]];
											callback({ item: '<td style="' + this.listView_column_width  + '">' + content + '</td>' });
										},
										repeat: 'this.listView_columnProperties'
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
			listView_rowRendered: null
		});

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --