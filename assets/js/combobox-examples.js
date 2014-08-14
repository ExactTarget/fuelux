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

	// COMBOBOX
	$('#btnComboboxGetSelectedItem').on('click', function () {
		console.log($('#myComboboxWithSelected').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#myComboboxWithSelected').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#myComboboxWithSelected').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#myComboboxWithSelected').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#myComboboxWithSelected').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#myComboBoxWithSelectedInput').on('changed.fu.combobox', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#myComboboxWithSelected').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#myComboboxWithSelected').combobox('enable');
	});
	$('#btnComboboxDestroy').on('click', function () {
		var markup = $('#myComboboxWithSelected').combobox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});


});