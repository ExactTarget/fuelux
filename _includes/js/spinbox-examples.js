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

	// SPINBOX
	$('#MySpinboxDecimal').spinbox({
		value: '1,0px',
		min: 0,
		max: 10,
		step: 0.1,
		decimalMark: ',',
		units: ['px']
		});

	$('#MySpinboxWithDefault').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	$('#MySpinboxDecimal').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	// buttons
	$('#spinboxGetValueBtn').on('click', function(){
		console.log( $('#MySpinboxDecimal').spinbox('value') );
	});

	$('#enableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('enable');
	});

	$('#enableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('enable');
	});

	$('#disableSpinbox').on('click', function () {
		$('#MySpinboxWithDefault').spinbox('disable');
	});

	$('#btnSpinboxDestroy').on('click', function () {
		var markup = $('#MySpinboxWithDefault').spinbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MySpinboxWithDefault').spinbox();
	});

});