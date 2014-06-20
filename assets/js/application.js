/*!
 * JavaScript for FuelUX's docs
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var $body = $(document.body);
	var $window = $(window);

	require('assets/js/combobox-examples');
	require('assets/js/infinite-scroll-examples');
	require('assets/js/repeater-examples');
	require('assets/js/pillbox-examples');
	require('assets/js/scheduler-examples');
	require('assets/js/search-examples');
	require('assets/js/selectlist-examples');
	require('assets/js/tree-examples');
	require('assets/js/wizard-examples');

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
		});
	}, 100);

	setTimeout(function () {
		$('.fu-top').affix();
	}, 100);
});
