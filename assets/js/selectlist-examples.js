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

	// SELECTLIST
	$('#MySelectlist').on('changed', function (evt, data) {
		console.log(data);
	});
	$('#getSelectedItem').on('click', function () {
		console.log($('#MySelectlist').selectlist('selectedItem'));
	});
	$('#selectByValue').on('click', function () {
		$('#MySelectlist').selectlist('selectByValue', '3');
	});
	$('#selectBySelector').on('click', function () {
		$('#MySelectlist').selectlist('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#selectByIndex').on('click', function () {
		$('#MySelectlist').selectlist('selectByIndex', '4');
	});
	$('#selectByText').on('click', function () {
		$('#MySelectlist').selectlist('selectByText', 'One');
	});
	$('#enableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('enable');
	});
	$('#disableSelectlist').on('click', function () {
		$('#MySelectlist').selectlist('disable');
	});

});