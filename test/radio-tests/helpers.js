/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function radioHelpers (require) {
	var $ = require('jquery');
	var $fixture = $('#qunit-fixture');
	var html = require('text!test/markup/radio-markup.html!strip');

	var initializeGroup = function initializeGroup (checkedIndex) {
		var radioGroup = [];
		this.$radioGroup.find('.radio-custom').each(function initializeRadio (i) {
			radioGroup[i] = $(this);
			if (i === checkedIndex) {
				radioGroup[i].find('> input').prop('checked', true);
			}
			radioGroup[i].radio();
		});
		this.radioGroup = radioGroup;
	};

	var setup = function setup () {
		this.$html = $(html);
		$fixture.append(this.$html);
		this.$fixture = $fixture;
		this.$checkedEnabled = $fixture.find('#RadioCheckedEnabled').radio();
		this.$radioGroup = $fixture.find('#RadioGroup');
		this.$checkedDisabled = $fixture.find('#RadioCheckedDisabled').radio();
		this.$uncheckedEnabled = $fixture.find('#RadioUncheckedEnabled').radio();
		this.$uncheckedDisabled = $fixture.find('#RadioUncheckedDisabled').radio();
		this.$radioToggleOn = $fixture.find('#RadioToggleOn').radio();
		this.$radioToggleOff = $fixture.find('#RadioToggleOff').radio();
		this.initializeGroup = initializeGroup;
	};

	return {
		setup: setup
	};
});
