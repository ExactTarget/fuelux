/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/radio-markup.html');
	/* FOR DEV TESTING - uncomment to test against index.html */
	//html = require('text!index.html!strip');
	html = $('<div>'+html+'</div>').find('#MyRadioContainer');

	require('bootstrap');
	require('fuelux/radio');

	module("Fuel UX Radio");

	test("should be defined on jquery object", function () {
		ok($().radio, 'radio method is defined');
	});

	test("should return element", function () {
		var $radio1 = $(html).find('#radio1');
		ok($radio1.radio() === $radio1, 'radio should be initialized');
	});

	test("should set initial state", function () {

		// init radios
		$(html).find('input').radio();

		// checked/enabled
		var l1 = $(html).find('#lbl1');
		equal(l1.hasClass('checked'), true, 'radio1 has checked class');
		equal(l1.hasClass('disabled'), false, 'radio1 does not have disabled class');

		// unchecked/enabled
		var l2 = $(html).find('#lbl2');
		equal(l2.hasClass('checked'), false, 'radio2 does not have checked class');
		equal(l2.hasClass('disabled'), false, 'radio2 does not have disabled class');

		// checked/disabled
		var l3 = $(html).find('#lbl3');
		equal(l3.hasClass('checked'), true, 'radio3 has checked class');
		equal(l3.hasClass('disabled'), true, 'radio3 has disabled class');

		// unchecked/disabled
		var l4 = $(html).find('#lbl4');
		equal(l4.hasClass('checked'), false, 'radio4 does not have checked class');
		equal(l4.hasClass('disabled'), true, 'radio4 has disabled class');
	});

	test("should disable/enable radio", function () {
		var $radio1 = $(html).find('#radio1');

		equal($radio1.is(':disabled'), false, 'enabled - default state');
		$radio1.radio('disable');
		equal($radio1.is(':disabled'), true, 'disabled');
		$radio1.radio('enable');
		equal($radio1.is(':disabled'), false, 're-enabled');
	});

	test("should check/uncheck radio group", function () {
		var $fixture = $(html).appendTo('#qunit-fixture');
		var $radio1 = $fixture.find('#radio1');
		var $l1 = $fixture.find('#lbl1');
		var $radio2 = $fixture.find('#radio2');
		var $l2 = $fixture.find('#lbl2');

		$fixture.find('input').radio();

		equal($l1.hasClass('checked'), true, 'checked - default state radio 1');
		equal($l2.hasClass('checked'), false, 'unchecked - default state radio 2');

		$radio2.radio('check');

		equal($l1.hasClass('checked'), false, 'unchecked - radio 1 confirmation by css class');
		equal($radio1.is(':checked'), false, 'unchecked - radio 1 confirmation by is(:checked)');
		equal($radio1.radio('isChecked'), false, 'unchecked - radio 1 confirmation by isChecked method');
		equal($l2.hasClass('checked'), true, 'checked - radio 2 confirmation by css class');
		equal($radio2.is(':checked'), true, 'checked - radio 2 confirmation by is(:checked)');
		equal($radio2.radio('isChecked'), true, 'checked - radio 2 confirmation by isChecked method');

		$radio1.radio('check');

		$fixture.remove();
	});

	test("should destroy control", function () {
		var id = '#radio1';
		var $el = $(html).find(id);
		var $parent = $el.closest('.radio');

		equal($el.radio('destroy'), '' + $parent[0].outerHTML, 'returns markup');
		equal( $(html).find(id).length, false, 'element has been removed from DOM');
	});

});
