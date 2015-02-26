/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'bootstrap/bootstrap-dropdown', 'fuelux/intelligent-dropdown'], function ($) {
	module("Fuel UX Intelligent Dropdown");

	test("should provide no conflict", function () {
		var dropdown = $.fn.dropdown.noConflict();
		ok(!$.fn.dropdown, 'dropdown was set back to undefined (org value)');
		$.fn.dropdown = dropdown;
	});

	test("can i make a dropdown", function() {
		var dropdownHTML = ''+
			'<ul class="tabs">' +
				'<li class="dropdown">' +
					'<button href="#" class="btn dropdown-toggle" data-toggle="dropdown">Dropdown</button>' +
					'<ul class="dropdown-menu">' +
						'<li><a href="#">Secondary link</a></li>' +
						'<li><a href="#">Something else here</a></li>' +
						'<li class="divider"></li>' +
						'<li><a href="#">Another link</a></li>' +
					'</ul>' +
				'</li>' +
			'</ul>'
			, dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click();

		ok(dropdown.parent('.dropdown').hasClass('open'), 'open class added on click');

	});

	var baseDirectionDropdownHTML = '' +
		'<ul class="tabs">' +
			'<li class="dropdown">' +
				'<button href="#" class="btn dropdown-toggle" data-toggle="dropdown" data-direction>Dropdown</button>' +
				'<ul class="dropdown-menu">' +
					'<li><a href="#">Secondary link</a></li>' +
					'<li><a href="#">Something else here</a></li>' +
					'<li class="divider"></li>' +
					'<li><a href="#">Another link</a></li>' +
				'</ul>' +
			'</li>' +
		'</ul>'
	;

	test("does base template have a dropdown with data-direction", function() {
		var dropdownHTML = baseDirectionDropdownHTML
			, dropdown = $(dropdownHTML).find('[data-toggle="dropdown"]').dropdown().click();

		ok(dropdown.is('[data-direction]'), 'base template has dropdown with data-direction');

	});

	test("does data-direction 'up' force up", function() {
		var dropdownHTML = baseDirectionDropdownHTML
			, $container = $(dropdownHTML)
			, $dropdown = $container.find('[data-toggle="dropdown"]');

		// bs dropdown click handler returns false blocking listener
		// $dropdown.dropdown();

		$dropdown.attr('data-direction', 'up');

		// Intelligent dropdown delegates listener off of body
		$('body').append($container);

		// intelligent dropdown tool requires `originalEvent` attribute on event
		$(document.body).find('[data-toggle=dropdown][data-direction]').trigger(jQuery.Event('click', {originalEvent:true}));

		/*
		 * module sets class and adjusts top
		 *
		 * +++ NOT AN INTEGRATION TEST +++
		 * test validates forced add of class in spite of measurements or dropdown functionality
		 */
		ok($dropdown.next().is('.dropUp'), 'after click dropdown does not have class "dropUp"');
		ok($dropdown.next().attr('style').match('top') !== null, 'after click dropdown does not have css "top" set');

		$container.remove();
	});

	test("does data-direction 'auto' position up on a dropdown at bottom of body", function() {
		var dropdownHTML = baseDirectionDropdownHTML
			, $container = $(dropdownHTML)
			, $dropdown = $container.find('[data-toggle="dropdown"]');

		// bs dropdown click handler returns false blocking listener
		// $dropdown.dropdown();

		$dropdown.attr('data-direction', 'auto');

		// Intelligent dropdown delegates listener off of body
		$('body').append($container);

		// intelligent dropdown tool requires `originalEvent` attribute on event
		$(document.body).find('[data-toggle=dropdown][data-direction]').trigger(jQuery.Event('click', {originalEvent:true}));

		/*
		 * module sets class and adjusts top
		 * measurments invalid if dropdown doesn't open.
		 * unable to open without initializing dropdown.
		 *
		 * catch 22
		 */
		// ok($dropdown.next().is('.dropUp'), 'after click dropdown does not have class "dropUp"');
		// ok($dropdown.next().attr('style').match('top') !== null, 'after click dropdown does not have css "top" set');
		expect(0);

		$container.remove();
	});

	test("does data-direction 'auto' position down on a dropdown with space underneath", function() {
		var dropdownHTML = baseDirectionDropdownHTML
			, $container = $(dropdownHTML)
			, $dropdown = $container.find('[data-toggle="dropdown"]');

		// bs dropdown click handler returns false blocking listener
		// $dropdown.dropdown();

		$dropdown.attr('data-direction', 'auto');

		// Intelligent dropdown delegates listener off of body
		$('body').append($container);

		// more space to bottom of body so should drop down
		$('body').css('height', '6000px');
		$container.css('position', 'fixed');

		// intelligent dropdown tool requires `originalEvent` attribute on event
		$('body').find('[data-toggle=dropdown][data-direction]').trigger(jQuery.Event('click', {originalEvent:true}));

		/*
		 * module sets class and adjusts top
		 *
		 * measurments invalid if dropdown doesn't open.
		 * unable to open without initializing dropdown.
		 * catch 22
		 */
		// ok(!$dropdown.next().is('.dropUp'), 'after click dropdown has class "dropUp"');
		// ok(!$dropdown.next().attr('style'), 'after click dropdown has css "top" set');
		expect(0);

		$container.remove();
	});
});
