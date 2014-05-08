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

	// COMBOBOX
	$('#btnComboboxGetSelectedItem').on('click', function () {
		console.log($('#MyCombobox').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#MyCombobox').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#MyCombobox').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#MyCombobox').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#MyCombobox').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#MyCombobox').on('changed', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#MyCombobox').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#MyCombobox').combobox('enable');
	});

});