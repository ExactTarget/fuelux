/*!
 * JavaScript for FuelUX's docs - Comobox Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// SEARCH
	$('#MySearch').on('searched', function (e, text) {
		alert('Searched: ' + text);
	});
	$('#btnSearchDisable').on('click', function () {
		$('#MySearch').search('disable');
	});
	$('#btnSearchEnable').on('click', function () {
		$('#MySearch').search('enable');
	});

});