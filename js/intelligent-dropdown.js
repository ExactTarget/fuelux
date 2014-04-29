/*
 * Fuel UX Intelligent Bootstrap Dropdowns
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
	
	$(function() {
		$(document.body).on("click", "[data-toggle=dropdown][data-direction]", function( event ) {

			var direction = $(this).data().direction;

			// if data-direction is not auto or up, default to bootstraps dropdown
			if( direction === "auto" || direction === "up" ) {
				// only changing css positioning if position is set to static
				// if this doesn"t happen, dropUp will not be correct
				// works correctly for absolute, relative, and fixed positioning
				// if( $(this).parent().css("position") === "static" ) {
				//	$(this).parent().css({ position: "relative"});
				// }

				// only continue into this function if the click came from a user
				if( event.hasOwnProperty("originalEvent") ) {
					// stopping bootstrap event propagation
					//event.stopPropagation();

					// deciding what to do based on data-direction attribute
					if( direction === "auto" ) {
						// have the drop down intelligently decide where to place itself
						autoDropDown( $(this) );
					} else if ( direction === "up" ) {
						forceDropUp( $(this) );
					}
				}
			}

		});

		//Intelligent suggestions dropdown
		$(document.body).on("suggestions", function(event, element) {
			autoDropDown( $(element) );
		});

		function forceDropUp( toggleElement ) {
			var dropDown = toggleElement;
			var dropUpPadding = 5;
			var topPosition;

			$(dropDown.parent()).addClass("dropup");

		}

		function autoDropDown( toggleElement ) {
			//console.log(element.parent());
			var dropDown = toggleElement;

			console.log(dropDown);
			var dropUpPadding = 5;
			var topPosition;

			// setting this so I can get height of dropDown without it being shown
			// dropDown.css({ visibility: "hidden" });

			// deciding where to put menu
			if( dropUpCheck( dropDown ) ) {
				dropDown.parent().addClass("dropup");
				// topPosition = ( ( dropDown.outerHeight() + dropUpPadding ) * -1 ) + "px";
			} else {
				dropDown.parent().removeClass("dropup");
			}
		}

		function dropUpCheck( element ) {
			// caching container
			var $container = getContainer( element );

			// building object with measurementsances for later use
			var measurements                = {};
			measurements.parentHeight       = element.parent().outerHeight();
			measurements.parentOffsetTop    = element.parent().offset().top;
			measurements.dropdownHeight     = element.outerHeight();
			measurements.containerHeight    = $container.overflowElement.outerHeight();

			// this needs to be different if the window is the container or another element is
			measurements.containerOffsetTop = ( !! $container.isWindow ) ? $container.overflowElement.scrollTop() : $container.overflowElement.offset().top;

			// doing the calculations
			measurements.fromTop    = measurements.parentOffsetTop - measurements.containerOffsetTop;
			measurements.fromBottom = measurements.containerHeight - measurements.parentHeight - ( measurements.parentOffsetTop - measurements.containerOffsetTop );

			// actual determination of where to put menu
			// false = drop down
			// true = drop up
			if( measurements.dropdownHeight < measurements.fromBottom ) {
				return false;
			} else if ( measurements.dropdownHeight < measurements.fromTop ) {
				return true;
			} else if ( measurements.dropdownHeight >= measurements.fromTop && measurements.dropdownHeight >= measurements.fromBottom ) {
				// decide which one is bigger and put it there
				if( measurements.fromTop >= measurements.fromBottom ) {
					return true;
				} else {
					return false;
				}
			}
		}

		function getContainer( element ) {
			var containerElement = window;
			var isWindow = true;

			$.each( element.parents(), function(index, value) {
				if( $(value).css('overflow') !== 'visible' ) {
					containerElement = value;
					isWindow = false;
					return false;
				}
			});
			return {
				overflowElement: $( containerElement ),
				isWindow: isWindow
			};
		}
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
	// -- END UMD WRAPPER AFTERWORD --