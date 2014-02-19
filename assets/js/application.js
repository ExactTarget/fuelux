// NOTICE!! DO NOT USE ANY OF THIS JAVASCRIPT
// IT'S ALL JUST JUNK FOR OUR DOCS!
// ++++++++++++++++++++++++++++++++++++++++++

/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */


(function ($) {

	$(function () {
		var $window = $(window);
		var $body   = $(document.body);

		$body.scrollspy({
			target: '.fu-sidebar'
		});

		// back to top
		setTimeout(function () {
			var $sideBar = $('.fu-sidebar');

			$sideBar.affix({
				offset: {
					top: function () {
						var offsetTop = $sideBar.offset().top;
						var sideBarMargin = parseInt($sideBar.children(0).css('margin-top'), 10);
						var navOuterHeight = $('.bs-docs-nav').height();

						this.top = offsetTop - navOuterHeight - sideBarMargin;
						return this.top;
					},
					bottom: function () {
						this.bottom = $('.bs-footer').outerHeight(true);
						return this.bottom;
					}
				}
			})
		}, 100);

		setTimeout(function () {
			$('.fu-top').affix();
		}, 100);
	});

})(jQuery);
