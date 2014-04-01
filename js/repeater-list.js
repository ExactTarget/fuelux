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
			renderer: {
				/*after: function(helpers, callback){
					callback();
				},*/
				render: function(helpers, callback){
					callback();
				},
				nested: [
					{
						render: function(helpers, callback){
							this.listView_columns = [];
							this.listView_column_width = (100/helpers.data.columns.length) + '%';
							callback({ item: '<table class="table repeater-list-header"><tr data-container="true"></tr></table>' });
						},
						nested: [
							{
								render: function(helpers, callback){
									var index = helpers.index;
									var subset = helpers.subset;
									this.listView_columns.push(subset[index].property);
									callback({ item: '<td style="width: ' + this.listView_column_width + ';">' + subset[index].label + '</td>' });
								},
								repeat: 'columns'
							}
						]
					},
					{
						after: function(helpers, callback){
							var canvas = this.$element.find('.repeater-canvas');
							var header = this.$element.find('.repeater-list-header');
							helpers.item.height(canvas.height()-header.outerHeight());
							callback();
						},
						render: function(helpers, callback){
							callback({ item: '<div class="repeater-list-wrapper"><table class="table repeater-list-items" data-container="true"></table></div>' });
						},
						nested: [
							{
								render: function(helpers, callback){
									var cols = this.listView_columns;
									var row = $('<tr></tr>');
									var i, l;

									for(i=0, l=cols.length; i<l; i++){
										row.append('<td style="width: ' + this.listView_column_width  + ';">' + helpers.subset[helpers.index][cols[i]] + '</td>');
									}

									callback({ item: row });
								},
								repeat: 'items'
							}
						]
					}
				]
			}
		};

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --