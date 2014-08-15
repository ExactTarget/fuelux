/*!
 * JavaScript for FuelUX's docs - Placard Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// PLACARD
	$('#btnPlacardEnable').click(function () {
		$('#myPlacard1').placard('enable');
	});

	$('#btnPlacardDisable').click(function () {
		$('#myPlacard1').placard('disable');
	});

	$('#btnPlacardDestroy').click(function () {
		var markup = $('#myPlacard1').placard('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#myPlacard1').placard( { edit: true } );
	});

});