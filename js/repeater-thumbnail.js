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
		$.fn.repeater.views.thumbnail = {
			renderer: {
				render: function(helpers){
					helpers.callback({ item: '<div class="clearfix repeater-thumbnail-cont" data-container="true"></div>' });
				},
				nested: [
					{
						render: function(helpers){
							helpers.callback({ item: '<div class="thumbnail repeater-thumbnail" data-container="true" style="background: ' + helpers.subset[helpers.index].color + ';"><img height="75" src="' + helpers.subset[helpers.index].src + '" width="65">' + helpers.subset[helpers.index].name + '</div>' });
						},
						repeat: 'items'
					}
				]
			}
		};
	}

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --