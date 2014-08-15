/*
 * Fuel UX Repeater - Thumbnail View Plugin
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
         define(['jquery', 'fuelux/repeater'], factory);
    } else {
        // OR use browser globals if AMD is not present
        factory(jQuery);
    }
}(function ($) {
// -- END UMD WRAPPER PREFACE --

// -- BEGIN MODULE CODE HERE --

	if($.fn.repeater){

		$.fn.repeater.defaults = $.extend({}, $.fn.repeater.defaults, {
			thumbnail_infiniteScroll: false,
			thumbnail_itemRendered: null,
			thumbnail_template: '<div class="thumbnail repeater-thumbnail" style="background-color: {{color}};"><img height="75" src="{{src}}" width="65"><span>{{name}}</span></div>'
		});

		$.fn.repeater.views.thumbnail = {
			selected: function(helpers, callback){
				var infScroll = this.options.thumbnail_infiniteScroll;
				var opts;
				if(infScroll){
					opts = (typeof infScroll === 'object') ? infScroll : {};
					this.infiniteScrolling(true, opts);
				}
				callback({});
			},
			renderer: {
				render: function(helpers, callback){
					var $item = this.$element.find('.repeater-thumbnail-cont');
					var obj = {};
					var $empty;
					if($item.length>0){
						obj.action = 'none';
					}else{
						$item = $('<div class="clearfix repeater-thumbnail-cont" data-container="true" data-infinite="true" data-preserve="shallow"></div>');
					}
					obj.item = $item;
					if(helpers.data.items.length<1){
						obj.skipNested = true;
						$empty = $('<div class="empty"></div>');
						$empty.append(this.options.thumbnail_noItemsHTML);
						$item.append($empty);
					}else{
						$item.find('.empty:first').remove();
					}
					callback(obj);
				},
				nested: [
					{
						after: function(helpers, callback){
							var obj = { container: helpers.container };
							if(helpers.item!==undefined){
								obj.item = helpers.item;
							}
							if(this.options.thumbnail_itemRendered){
								this.options.thumbnail_itemRendered(obj, function(){
									callback();
								});
							}else{
								callback();
							}
						},
						render: function(helpers, callback){
							var item = helpers.subset[helpers.index];
							var template = function(str){
								var invalid = false;
								var replace = function(){
									var end, start, val;

									start = str.indexOf('{{');
									end = str.indexOf('}}', start+2);

									if(start>-1 && end>-1){
										val = $.trim(str.substring(start+2, end));
										val = (item[val]!==undefined) ? item[val] : '';
										str = str.substring(0, start) + val + str.substring(end+2);
									}else{
										invalid = true;
									}
								};

								while(!invalid && str.search('{{')>=0){
									replace(str);
								}
								return str;
							};
							callback({ item: template(this.options.thumbnail_template) });
						},
						repeat: 'data.items'
					}
				]
			}
		};

	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --