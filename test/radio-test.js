/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery', 'fuelux/radio'], function ($) {

	var html = '<div>' +
		'<label class="radio radio-custom" id="lbl1"><input id="radio1" type="radio" name="radio1" checked="checked"><i class="radio"></i>Custom: Checked Enabled</label>' +
		'<label class="radio radio-custom" id="lbl2"><input id="radio2" type="radio" name="radio1"><i class="radio"></i>Custom: Unchecked Enabled</label>' +
		'<label class="radio radio-custom" id="lbl3"><input id="radio3" type="radio" name="radio2" checked="checked" disabled="disabled"><i class="radio"></i>Custom: Checked Disabled</label>' +
		'<label class="radio radio-custom" id="lbl4"><input id="radio4" type="radio" name="radio2" disabled="disabled"><i class="radio"></i>Custom: Unchecked Disabled</label>' +
		'</div>';

	module("Fuel UX radio");

	test("should be defined on jquery object", function () {
		ok($(document.body).radio, 'radio method is defined');
	});

	test("should return element", function () {
		ok($(document.body).radio()[0] === document.body, 'document.body returned');
	});

	test("should set initial state", function () {
		var $list = $(html);
		var $radios = $list.find('input').radio();

		// checked/enabled
		var i1 = $list.find('#lbl1 i');
		equal(i1.hasClass('checked'), true, 'radio1 has checked class');
		equal(i1.hasClass('disabled'), false, 'radio1 does not have disabled class');

		// unchecked/enabled
		var i2 = $list.find('#lbl2 i');
		equal(i2.hasClass('checked'), false, 'radio2 does not have checked class');
		equal(i2.hasClass('disabled'), false, 'radio2 does not have disabled class');

		// checked/disabled
		var i3 = $list.find('#lbl3 i');
		equal(i3.hasClass('checked'), true, 'radio3 has checked class');
		equal(i3.hasClass('disabled'), true, 'radio3 has disabled class');

		// unchecked/disabled
		var i4 = $list.find('#lbl4 i');
		equal(i4.hasClass('checked'), false, 'radio4 does not have checked class');
		equal(i4.hasClass('disabled'), true, 'radio4 has disabled class');
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
        var $i1 = $fixture.find('#lbl1 i');
        var $radio2 = $fixture.find('#radio2');
        var $i2 = $fixture.find('#lbl2 i');
        
        $fixture.find('input').radio();
        
        equal($i1.hasClass('checked'), true, 'checked - default state radio 1');
        equal($i2.hasClass('checked'), false, 'unchecked - default state radio 2');
        
        $radio2.radio('check');
        
        equal($i1.hasClass('checked'), false, 'unchecked - radio 1 confirmation by css class');
        equal($radio1.is(':checked'), false, 'unchecked - radio 1 confirmation by is(:checked)');
        equal($radio1.radio('isChecked'), false, 'unchecked - radio 1 confirmation by isChecked method');
        equal($i2.hasClass('checked'), true, 'checked - radio 2 confirmation by css class');
        equal($radio2.is(':checked'), true, 'checked - radio 2 confirmation by is(:checked)');
        equal($radio2.radio('isChecked'), true, 'checked - radio 2 confirmation by isChecked method');

        $radio1.radio('check');

        $fixture.remove();
    });
});