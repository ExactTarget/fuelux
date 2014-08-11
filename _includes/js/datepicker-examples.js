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

	$('#MyDatepicker').on('changed.fu.datepicker', function( event, data ) {
		console.log( 'datepicker change event fired' );
	});

	$('#MyDatepicker').on('inputParsingFailed.fu.datepicker', function() {
		console.log( 'datepicker inputParsingFailed event fired' );
	});

	$('#btnDatepickerEnable').on('click', function() {
		$('#MyDatepicker').datepicker('enable');
	});

	$('#btnDatepickerDisable').on('click', function() {
		$('#MyDatepicker').datepicker('disable');
	});

	$('#btnDatepickerLogFormattedDate').on('click', function() {
		console.log( $('#MyDatepicker').datepicker('getFormattedDate') );
	});

	$('#btnDatepickerLogDateObj').on('click', function() {
		console.log( $('#MyDatepicker').datepicker('getDate') );
	});

	$('#btnDatepickerSetDate').on('click', function() {
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) );
		$('#MyDatepicker').datepicker('setDate', futureDate );
		console.log( $('#datepicker').datepicker('getDate') );
	});

	$('#btnDatepickerDestroy').on('click', function() {
		var markup = $('#MyDatepicker').datepicker('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});

});