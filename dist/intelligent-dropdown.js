/*
 * Fuel UX Intelligent Bootstrap Dropdowns
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2013 ExactTarget
 * Licensed under the MIT license.
 */

define([ "jquery", "fuelux/all"], function($) {

	$(function() {
		$(document.body).on("click", "[data-toggle=dropdown][data-direction=auto]", function( event ) {

			// only changing css positioning if position is set to static
			// if this doesn"t happen, dropUp will not be correct
			// works correctly for absolute, relative, and fixed positioning
			if( $(this).parent().css("position") === "static" ) {
				$(this).parent().css({"position": "relative"});
			}

			// only continue into this function if the click came from a user
			if( event.hasOwnProperty("originalEvent") ) {
				event.stopPropagation();
				dropDownClicked( $(this) );
			}
		});

		function dropDownClicked( element ) {

			var dropDown      = element.next();
			var dropUpPadding = 5;
			var topPosition;

			// setting this so I can get height of dropDown without it being shown
			dropDown.css({ visibility: "hidden" });

			// deciding where to put menu
			if( dropUpCheck( dropDown ) ) {
				$(dropDown).addClass("dropUp");
				topPosition = ( ( dropDown.outerHeight() + dropUpPadding ) * -1 ) + "px";
			} else {
				$(dropDown).removeClass("dropUp");
				topPosition = "auto";
			}

			dropDown.css({ visibility: "visible", top: topPosition });
			element.click();
		}

		function dropUpCheck( element ) {
			// caching $(window)
			var $window = $(window);

			// building object with distances for later use
			var dist = {
				fromTop: element.parent().offset().top - $window.scrollTop(),
				fromBottom: $window.height() - element.parent().outerHeight() - ( element.parent().offset().top - $window.scrollTop() ),
				dropdownHeight: element.outerHeight(),
				parentHeight: element.parent().outerHeight()
			};

			// actual determination of where to put menu
			// false = drop down
			// true = drop up
			if( dist.dropdownHeight < dist.fromBottom ) {
				return false;
			} else if ( dist.dropdownHeight < dist.fromTop ) {
				return true;
			} else if ( dist.dropdownHeight >= dist.fromTop && dist.dropdownHeight >= dist.fromBottom ) {
				// decide which one is bigger and put it there
				if( dist.fromTop >= dist.fromBottom ) {
					return true;
				} else {
					return false;
				}
			}
		}
	});
});