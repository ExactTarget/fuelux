/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function helpersFactory (require) {
	var $ = require('jquery');

	var KEYMAP = {
		tab: 9,
		enter: 13,
		space: 32,
		end: 35,
		home: 36,
		left: 37,
		up: 38,
		right: 39,
		down: 40
	};

	var getKeyDown = function getKeyDown (which, target) {
		var $target = $(target);

		var eventObject = this.defaultEventObject;
		eventObject.which = KEYMAP[which];
		eventObject.keyCode = KEYMAP[which];

		if ($target) {
			eventObject.originalEvent = $.Event( 'keydown', { // eslint-disable-line new-cap
				target: $target
			});
		}

		var e = $.Event( 'keydown', eventObject); // eslint-disable-line new-cap

		return e;
	};

	return {
		getKeyDown: getKeyDown,
		KEYMAP: KEYMAP
	};
});
