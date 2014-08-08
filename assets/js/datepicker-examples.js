/*!
 * JavaScript for FuelUX's docs - Datepicker Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// DATEPICKER
	$('#btnDatepickerEnable').on('click', function() {
		$('#MyDatepicker1').datepicker('enable');
	});

	$('#btnDatepickerDisable').on('click', function() {
		$('#MyDatepicker1').datepicker('disable');
	});

	$('#btnDatepickerLogFormattedDate').on('click', function() {
		console.log($('#MyDatepicker1').datepicker('getFormattedDate'));
	});

	$('#btnDatepickerLogDateObj').on('click', function() {
		console.log($('#MyDatepicker1').datepicker('getDate'));
	});

	$('#btnDatepickerSetDate').on('click', function() {
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) );
		$('#MyDatepicker1').datepicker('setDate', futureDate);
		console.log($('#datepicker1').datepicker('getDate'));
	});

	$('#btnDatepickerDestroy').on('click', function() {
		var markup = $('#MyDatepicker1').datepicker('destroy');
		console.log(markup);
		$(this).closest('.section').append(markup);
	});
});