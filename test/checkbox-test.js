/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/checkbox'], function ($) {

	var html = '<div>' +
		'<label class="checkbox checkbox-custom" id="lbl1"><input id="chk1" type="checkbox" checked="checked"><i class="checkbox"></i>Custom: Checked Enabled<br/>Second Line</label>' +
		'<label class="checkbox checkbox-custom" id="lbl2"><input id="chk2" type="checkbox"><i class="checkbox"></i>Custom: Unchecked Enabled</label>' +
		'<label class="checkbox checkbox-custom" id="lbl3"><input id="chk3" type="checkbox" checked="checked" disabled="disabled" ><i class="checkbox"></i>Custom: Checked Disabled</label>' +
		'<label class="checkbox checkbox-custom" id="lbl4"><input id="chk4" type="checkbox" disabled="disabled"><i class="checkbox"></i>Custom: Unchecked Disabled</label>' +
		'<label class="checkbox checkbox-custom" id="lbl5"><input id="chk5" type="checkbox"><i class="checkbox"></i>Convenience Methods</label>' +
		'</div>';

	module("Fuel UX checkbox");

	test("should be defined on jquery object", function () {
		ok($(document.body).checkbox, 'checkbox method is defined');
	});

	test("should return element", function () {
		ok($(document.body).checkbox()[0] === document.body, 'document.body returned');
	});

	test("should set initial state", function () {
		var $list = $(html);
		var $chks = $list.find('input').checkbox();

		// checked/enabled
		var i1 = $list.find('#lbl1 i');
		equal(i1.hasClass('checked'), true, 'chk1 has checked class');
		equal(i1.hasClass('disabled'), false, 'chk1 does not have disabled class');

		// unchecked/enabled
		var i2 = $list.find('#lbl2 i');
		equal(i2.hasClass('checked'), false, 'chk2 does not have checked class');
		equal(i2.hasClass('disabled'), false, 'chk2 does not have disabled class');

		// checked/disabled
		var i3 = $list.find('#lbl3 i');
		equal(i3.hasClass('checked'), true, 'chk3 has checked class');
		equal(i3.hasClass('disabled'), true, 'chk3 has disabled class');

		// unchecked/disabled
		var i4 = $list.find('#lbl4 i');
		equal(i4.hasClass('checked'), false, 'chk4 does not have checked class');
		equal(i4.hasClass('disabled'), true, 'chk4 has disabled class');
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
        var $i5 = $fixture.find('#lbl5 i');

        $chk5.checkbox();

        equal($chk5.is(':checked'), false, 'unchecked - default value');

        $chk5.checkbox('check');
        equal($chk5.is(':checked'), true, 'checked - confirmation by is(:checked)');
        equal($i5.hasClass('checked'), true, 'checked - confirmation by css class');
        equal($chk5.checkbox('isChecked'), true, 'checked - confirmation by isChecked method');

        $chk5.checkbox('uncheck');
        equal($chk5.is(':checked'), false, 'unchecked - confirmation by is(:checked)');
        equal($i5.hasClass('checked'), false, 'unchecked - confirmation by css class');
        equal($chk5.checkbox('isChecked'), false, 'unchecked - confirmation by isChecked method');

        $fixture.remove();
	});
});