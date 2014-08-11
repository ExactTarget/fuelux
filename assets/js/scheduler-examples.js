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



$('#MyScheduler').on('changed.fu.scheduler', function(){
	if(window.console && window.console.log){
		window.console.log('scheduler changed.fu.scheduler: ', arguments);
	}
});

	// buttons
	$('#btnSchedulerEnable').on('click', function(){
		$('#MyScheduler').scheduler('enable');
	});

	$('#btnSchedulerDisable').on('click', function(){
		$('#MyScheduler').scheduler('disable');
	});

	$('#btnSchedulerLogValue').on('click', function(){
		var val = $('#MyScheduler').scheduler('value');
		if(window.console && window.console.log){
			window.console.log(val);
		}
	});

	$('#btnSchedulerSetValue').on('click', function(){
		var json = $.parseJSON( $('#MySchedule').val() );

		console.log(json);

		$('#MyScheduler').scheduler('value', json);
	});

	$('#btnSchedulerDestroy').on('click', function() {
		var markup = $('#MyScheduler').scheduler('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#MyScheduler').scheduler();
	});

	
});