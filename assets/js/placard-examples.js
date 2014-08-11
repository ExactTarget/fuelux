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
	$('#btnPlacardDestroy').click(function () {
		var markup = $('#MyPlacard1').placard('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyPlacard1').placard( { edit: true } );
	});

});