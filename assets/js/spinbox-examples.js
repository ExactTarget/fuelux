/*!
 * JavaScript for Fuel UX's docs - Examples
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

	$('#mySpinboxWithDefault').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	$('#mySpinboxWithDefault').on('changed.fu.spinbox', function (e, value) {
		console.log('Spinbox changed: ', value);
	});

	// buttons

	$('#btnSpinboxSetValue').on('click', function(){
		console.log( $('#mySpinboxWithDefault').spinbox('value', 4) );
	});

	$('#btnSpinboxGetValue').on('click', function(){
		console.log( $('#mySpinboxWithDefault').spinbox('value') );
	});

	$('#btnEnableSpinbox').on('click', function () {
		$('#mySpinboxWithDefault').spinbox('enable');
	});

	$('#btnDisableSpinbox').on('click', function () {
		$('#mySpinboxWithDefault').spinbox('disable');
	});

	$('#btnSpinboxDestroy').on('click', function () {
		var markup = $('#mySpinboxWithDefault').spinbox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#mySpinboxWithDefault').spinbox();
	});


});