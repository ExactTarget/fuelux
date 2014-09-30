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

	// SELECTLIST
	$('#mySelectlist').on('clicked.fu.selectlist', function (evt, target) {
		console.log('clicked');
		console.log(target);
	});

	$('#mySelectlist').on('changed.fu.selectlist', function (evt, data) {
		console.log('changed');
		console.log(data);
	});

	$('#btnSelectlistSelectedItem').on('click', function () {
		console.log($('#mySelectlist').selectlist('selectedItem'));
	});

	$('#btnSelectlistSelectByValue').on('click', function () {
		$('#mySelectlist').selectlist('selectByValue', '3');
	});

	$('#btnSelectlistSelectBySelector').on('click', function () {
		$('#mySelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});

	$('#btnSelectlistSelectByIndex').on('click', function () {
		$('#mySelectlist').selectlist('selectByIndex', '4');
	});

	$('#btnSelectlistSelectByText').on('click', function () {
		$('#mySelectlist').selectlist('selectByText', 'One');
	});

	$('#btnSelectlistEnableSelectlist').on('click', function () {
		$('#mySelectlist').selectlist('enable');
	});

	$('#btnSelectlistDisableSelectlist').on('click', function () {
		$('#mySelectlist').selectlist('disable');
	});

	$('#btnSelectlistDestroy').on('click', function () {
		var markup = $('#mySelectlist').selectlist('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#mySelectlist').selectlist();
	});

});