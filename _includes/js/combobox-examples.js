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
		console.log($('#MyComboboxWithSelected').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#MyComboboxWithSelected').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#MyComboBoxWithSelectedInput').on('changed.fu.combobox', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#MyComboboxWithSelected').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#MyComboboxWithSelected').combobox('enable');
	});
	$('#btnComboboxDestroy').on('click', function () {
		var markup = $('#MyComboboxWithSelected').combobox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});


});