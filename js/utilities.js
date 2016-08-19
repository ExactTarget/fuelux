/* global someFunction jQuery:true */

/*
 * Fuel UX Utilities
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2016 ExactTarget
 * Licensed under the BSD New license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js

// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function umdFactory (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function commonJS ( root, jq ) {
			var jQuery = jq;
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				} else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function defineModule ($) {
	// -- END UMD WRAPPER PREFACE --
	// -- BEGIN MODULE CODE HERE --

	var BACKSPACE_KEYCODE = 8;
	var COMMA_KEYCODE = 188;// `,` & `<`
	var DELETE_KEYCODE = 46;
	var DOWN_ARROW_KEYCODE = 40;
	var ENTER_KEYCODE = 13;
	var TAB_KEYCODE = 9;
	var UP_ARROW_KEYCODE = 38;

	var isShiftHeld = function isShiftHeld (e) { return e.shiftKey === true; };

	var isKey = function isKey (keyCode) {
		return function compareKeycodes (e) {
			return e.keyCode === keyCode;
		};
	};

	var isBackspaceKey = isKey(BACKSPACE_KEYCODE);
	var isDeleteKey = isKey(DELETE_KEYCODE);
	var isTabKey = isKey(TAB_KEYCODE);
	var isUpArrow = isKey(UP_ARROW_KEYCODE);
	var isDownArrow = isKey(DOWN_ARROW_KEYCODE);

	// https://github.com/ExactTarget/fuelux/issues/1841
	var xssRegex = /<.*>/;
	var cleanInput = function cleanInput (questionableInput) {
		var cleanedInput = questionableInput;

		if (xssRegex.test(cleanedInput)) {
			cleanedInput = $('<i>').text(questionableInput).html();
		}

		return cleanedInput;
	};

	$.fn.utilities = {
		CONST: {
			BACKSPACE_KEYCODE: BACKSPACE_KEYCODE,
			COMMA_KEYCODE: COMMA_KEYCODE,
			DELETE_KEYCODE: DELETE_KEYCODE,
			DOWN_ARROW_KEYCODE: DOWN_ARROW_KEYCODE,
			ENTER_KEYCODE: ENTER_KEYCODE,
			TAB_KEYCODE: TAB_KEYCODE,
			UP_ARROW_KEYCODE: UP_ARROW_KEYCODE
		},
		cleanInput: cleanInput,
		isBackspaceKey: isBackspaceKey,
		isDeleteKey: isDeleteKey,
		isShiftHeld: isShiftHeld,
		isTabKey: isTabKey,
		isUpArrow: isUpArrow,
		isDownArrow: isDownArrow
	};

	// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --

