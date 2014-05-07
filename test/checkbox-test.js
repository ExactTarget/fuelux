/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/checkbox-markup.html');

	require('bootstrap');
	require('fuelux/checkbox');

	module("Fuel UX Checkbox");

	test("should be defined on jquery object", function () {
		ok($(document.body).checkbox, 'checkbox method is defined');
	});

	test("should return element", function () {
		ok($(document.body).checkbox()[0] === document.body, 'document.body returned');
	});

	test("should set initial state", function () {
		var $list = $(html);

		$list.find('input').checkbox();

		// checked/enabled
		var lbl1 = $list.find('#lbl1');
		equal(lbl1.hasClass('checked'), true, 'lbl1 has checked class');
		equal(lbl1.hasClass('disabled'), false, 'lbl1 does not have disabled class');

		// unchecked/enabled
		var lbl3 = $list.find('#lbl3');
		equal(lbl3.hasClass('checked'), false, 'lbl3 does not have checked class');
		equal(lbl3.hasClass('disabled'), false, 'lbl3 does not have disabled class');

		// checked/disabled
		var lbl4 = $list.find('#lbl4');
		equal(lbl4.hasClass('checked'), true, 'lbl4 has checked class');
		equal(lbl4.hasClass('disabled'), true, 'lbl4 has disabled class');

		// checked/disabled
		var lbl5 = $list.find('#lbl5');
		equal(lbl5.hasClass('checked'), false, 'lbl5 does not have checked class');
		equal(lbl5.hasClass('disabled'), true, 'lbl5 has disabled class');
	});

	test("should disable/enable checkbox", function () {
		var $chk1 = $(html).find('#chk1');

		equal($chk1.is(':disabled'), false, 'enabled - default state');
		$chk1.checkbox('disable');
		equal($chk1.is(':disabled'), true, 'disabled');
		$chk1.checkbox('enable');
		equal($chk1.is(':disabled'), false, 're-enabled');
	});

	test("should check/uncheck checkbox", function () {
		var $fixture = $(html).appendTo('#qunit-fixture');
		var $chk1 = $fixture.find('#chk1');

		equal($chk1.is(':checked'), true, 'checked');
		$chk1.checkbox('toggle');
		equal($chk1.is(':checked'), false, 'unchecked');
		$chk1.checkbox('toggle');
		equal($chk1.is(':checked'), true, 'checked');

		$fixture.remove();
	});
	
	test("test check/uncheck/isChecked convenience methods", function () {
        var $fixture = $(html).appendTo('#qunit-fixture');
        var $chk5 = $fixture.find('#chk5');
        var $l5 = $fixture.find('#lbl5');

        $chk5.checkbox();

        equal($chk5.is(':checked'), false, 'unchecked - default value');

        $chk5.checkbox('check');
        equal($chk5.is(':checked'), true, 'checked - confirmation by is(:checked)');
        equal($l5.hasClass('checked'), true, 'checked - confirmation by css class');
        equal($chk5.checkbox('isChecked'), true, 'checked - confirmation by isChecked method');

        $chk5.checkbox('uncheck');
        equal($chk5.is(':checked'), false, 'unchecked - confirmation by is(:checked)');
        equal($l5.hasClass('checked'), false, 'unchecked - confirmation by css class');
        equal($chk5.checkbox('isChecked'), false, 'unchecked - confirmation by isChecked method');

        $fixture.remove();
	});
});