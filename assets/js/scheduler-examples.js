/*!
 * JavaScript for FuelUX's docs - Comobox Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('moment');
	require('fuelux');

	// SCHEDULER

	// static example, showing all options
	$('#MySchedulerStatic').scheduler();



	// set custom format with moment.js
	$('#MyScheduler').find('.scheduler-start .datepicker').datepicker({ momentConfig: {
		culture: 'en',
		formatCode: 'dddd, MMMM D, YYYY'
	}});

	$('#schedulerEnableBtn').on('click', function(){
		$('#MyScheduler').scheduler('enable');
	});

	$('#schedulerDisableBtn').on('click', function(){
		$('#MyScheduler').scheduler('disable');
	});

	$('#schedulerLogValueBtn').on('click', function(){
		var val = $('#MyScheduler').scheduler('value');
		if(window.console && window.console.log){
			window.console.log(val);
		}
	});

	$('#schedulerSetValueBtn').on('click', function(){
		$('#MyScheduler').scheduler('value', {
			startDateTime: '2014-03-31T03:23+02:00',
			timeZone: {
				name: 'Namibia Standard Time',
				offset: '+02:00'
			},
			recurrencePattern: 'FREQ=MONTHLY;INTERVAL=6;BYDAY=WE;BYSETPOS=3;UNTIL=20140919;'
		});
	});

	$('#MyScheduler').on('changed', function(){
		if(window.console && window.console.log){
			window.console.log('scheduler changed: ', arguments);
		}
	});

	$('#MyScheduler').scheduler();
	
});