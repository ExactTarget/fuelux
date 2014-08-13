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
		console.log($('#myFuComboboxWithSelected').combobox('selectedItem'));
	});
	$('#btnComboboxSelectByValue').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('selectByValue', '1');
	});
	$('#btnComboboxSelectByIndex').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('selectByIndex', '1');
	});
	$('#btnComboboxSelectByText').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('selectByText', 'Four');
	});
	$('#btnComboboxSelectBySelector').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('selectBySelector', 'li[data-fizz=buzz]');
	});
	$('#myFuComboBoxWithSelectedInput').on('changed.fu.combobox', function (evt, data) {
		console.log(data);
	});
	$('#btnComboboxDisable').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('disable');
	});
	$('#btnComboboxEnable').on('click', function () {
		$('#myFuComboboxWithSelected').combobox('enable');
	});
	$('#btnComboboxDestroy').on('click', function () {
		var markup = $('#myFuComboboxWithSelected').combobox('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
	});


});