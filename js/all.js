/*
 * Fuel UX All
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 *
 * NOTE: This file works with AMD only.
 */

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(factory);
	} else {
		// OR print to the console that this file is AMD only, if possible
		if(window && window.console && window.console.log){
			window.console.log('WARNING: The all.js file in the Fuel UX src directory is for use with AMD only.');
		}
	}
}(function (require) {

	require('jquery');
	require('bootstrap');

	require('fuelux/checkbox');
	require('fuelux/combobox');
	require('fuelux/datagrid');
	require('fuelux/datepicker');
	require('fuelux/infinite-scroll');
	require('fuelux/intelligent-dropdown');
	require('fuelux/loader');
	require('fuelux/pillbox');
	require('fuelux/radio');
	require('fuelux/scheduler');
	require('fuelux/search');
	require('fuelux/spinbox');
	require('fuelux/selectlist');
	require('fuelux/tree');
	require('fuelux/wizard');

}));
