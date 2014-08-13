/*!
 * JavaScript for FuelUX's docs - Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// SPINBOX
	$('#myFuSpinboxDecimal').spinbox({
		value: '1,0px',
		min: 0,
		max: 10,
		step: 0.1,
		decimalMark: ',',
		units: ['px']
		});

	$('#myFuSpinboxWithDefault').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	$('#myFuSpinboxDecimal').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	// buttons
	$('#btnSpinboxGetValue').on('click', function(){
		console.log( $('#myFuSpinboxDecimal').spinbox('value') );
	});

	$('#btnEnableSpinbox').on('click', function () {
		$('#myFuSpinboxWithDefault').spinbox('enable');
	});

	$('#btnEnableSpinbox').on('click', function () {
		$('#myFuSpinboxWithDefault').spinbox('enable');
	});

	$('#btnDisableSpinbox').on('click', function () {
		$('#myFuSpinboxWithDefault').spinbox('disable');
	});

	$('#btnSpinboxDestroy').on('click', function () {
		var markup = $('#myFuSpinboxWithDefault').spinbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#myFuSpinboxWithDefault').spinbox();
	});

});