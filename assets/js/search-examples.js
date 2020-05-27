/*!
 * JavaScript for Fuel UX's docs - Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */

define(function (require) {
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// SEARCH
	$('#mySearch').on('searched', function (e, text) {
		alert('Searched: ' + text);
	});
	$('#btnSearchDisable').on('click', function () {
		$('#mySearch').search('disable');
	});
	$('#btnSearchEnable').on('click', function () {
		$('#mySearch').search('enable');
	});
});
