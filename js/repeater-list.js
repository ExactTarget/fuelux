/*
 * Fuel UX Repeater - Thumbnail View Plugin
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
				render: function(helpers, callback){
					callback();
				},
				nested: [
					{
						render: function(helpers, callback){
							console.log('RENDER');
							callback({ item: '<table class="table repeater-list-header"><tr data-container="true"></tr></table>' });
						},
						nested: [
							{
								render: function(helpers, callback){
									callback({ item: '<td>' + helpers.subset[helpers.index].label + '</td>' });
								},
								repeat: 'columns'
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