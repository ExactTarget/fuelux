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

	if($.fn.repeater && $.fn.repeater.views){

		$.fn.repeater.views.list = {
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
								this.listView_columns = helpers.data.columns;
								this.listView_columnProperties = [];
								this.listView_column_width = (100/helpers.data.columns.length) + '%';
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
									var index = helpers.index;
									var subset = helpers.subset;
									this.listView_columnProperties.push(subset[index].property);
									callback({ item: '<td style="width: ' + this.listView_column_width + ';">' + subset[index].label + '</td>' });
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
											callback({ item: '<td style="width: ' + this.listView_column_width  + ';">' + content + '</td>' });
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