/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function treeDataFactory (require) {
	var $ = require('jquery');

	var setup = function setup () {
		var $fixture = $('#qunit-fixture');
		this.html = require('text!test/markup/checkbox-markup.html!strip');
		this.$html = $(this.html);
		$fixture.append(this.$html);
	};

	return {
		setup: setup
	};
});
