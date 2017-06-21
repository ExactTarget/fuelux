/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function checkboxHelpers (require) {
	var $ = require('jquery');
	var $fixture = $('#qunit-fixture');
	var html = require('text!test/markup/checkbox-markup.html!strip');

	var setup = function setup () {
		this.$html = $(html);
		$fixture.append(this.$html);
		this.$checkedEnabled = $fixture.find('#CheckboxCheckedEnabled').checkbox();
		this.$checkedDisabled = $fixture.find('#CheckboxCheckedDisabled').checkbox();
		this.$uncheckedEnabled = $fixture.find('#CheckboxUncheckedEnabled').checkbox();
		this.$uncheckedDisabled = $fixture.find('#CheckboxUncheckedDisabled').checkbox();
		this.$checkboxToggle = $fixture.find('#CheckboxToggle').checkbox();
		this.$fixture = $fixture;
	};

	return {
		setup: setup
	};
});
