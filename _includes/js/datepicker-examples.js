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

	$('#myFuDatepicker').on('changed.fu.datepicker', function( event, data ) {
		console.log( 'datepicker change event fired' );
	});

	$('#myFuDatepicker').on('inputParsingFailed.fu.datepicker', function() {
		console.log( 'datepicker inputParsingFailed event fired' );
	});

	$('#btnDatepickerEnable').on('click', function() {
		$('#myFuDatepicker').datepicker('enable');
	});

	$('#btnDatepickerDisable').on('click', function() {
		$('#myFuDatepicker').datepicker('disable');
	});

	$('#btnDatepickerLogFormattedDate').on('click', function() {
		console.log( $('#myFuDatepicker').datepicker('getFormattedDate') );
	});

	$('#btnDatepickerLogDateObj').on('click', function() {
		console.log( $('#myFuDatepicker').datepicker('getDate') );
	});

	$('#btnDatepickerSetDate').on('click', function() {
		var futureDate = new Date(+new Date() + ( 7 * 24 * 60 * 60 * 1000 ) );
		$('#myFuDatepicker').datepicker('setDate', futureDate );
		console.log( $('#datepicker').datepicker('getDate') );
	});

	$('#btnDatepickerDestroy').on('click', function() {
		var markup = $('#myFuDatepicker').datepicker('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});

});