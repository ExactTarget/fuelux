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

	// SELECTLIST
	$('#myFuSelectlist').on('clicked.fu.selectlist', function (evt, target) {
		console.log('clicked');
		console.log(target);
	});

	$('#myFuSelectlist').on('changed.fu.selectlist', function (evt, data) {
		console.log('changed');
		console.log(data);
	});

	$('#btnSelectlistSelectedItem').on('click', function () {
		console.log($('#myFuSelectlist2').selectlist('selectedItem'));
	});

	$('#btnSelectlistSelectByValue').on('click', function () {
		$('#myFuSelectlist').selectlist('selectByValue', '3');
	});

	$('#btnSelectlistSelectBySelector').on('click', function () {
		$('#myFuSelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});

	$('#btnSelectlistSelectByIndex').on('click', function () {
		$('#myFuSelectlist').selectlist('selectByIndex', '4');
	});

	$('#btnSelectlistSelectByText').on('click', function () {
		$('#myFuSelectlist').selectlist('selectByText', 'One');
	});

	$('#btnSelectlistEnableSelectlist').on('click', function () {
		$('#myFuSelectlist').selectlist('enable');
	});

	$('#btnSelectlistDisableSelectlist').on('click', function () {
		$('#myFuSelectlist').selectlist('disable');
	});

	$('#btnSelectlistDestroy').on('click', function () {
		var markup = $('#myFuSelectlist').selectlist('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#myFuSelectlist').selectlist();
	});

});