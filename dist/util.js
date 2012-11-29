/*
 * Fuel UX Utilities
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(['require','jquery'],function (require) {

	var $ = require('jquery');

	// custom case-insensitive match expression
	$.expr.pseudos.fuelTextExactCI = $.expr.createPseudo(function (arg) {
		return function (elem) {
			return (elem.textContent || elem.innerText || $(elem).text() || '').toLowerCase() === arg.toLowerCase();
		};
	});
});