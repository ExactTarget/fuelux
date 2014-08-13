/*!
 * JavaScript for FuelUX's docs - Examples
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
	$('#myFuSchedulerStatic').scheduler();

	$('#myFuScheduler').on('changed.fu.scheduler', function(){
		if(window.console && window.console.log){
			window.console.log('scheduler changed.fu.scheduler: ', arguments);
		}
	});

	// buttons
	$('#btnSchedulerEnable').on('click', function(){
		$('#myFuScheduler').scheduler('enable');
	});

	$('#btnSchedulerDisable').on('click', function(){
		$('#myFuScheduler').scheduler('disable');
	});

	$('#btnSchedulerLogValue').on('click', function(){
		var val = $('#myFuScheduler').scheduler('value');
		if(window.console && window.console.log){
			window.console.log(val);
		}
	});

	$('#btnSchedulerSetValue').on('click', function(){
		var json = $.parseJSON( $('#myFuSchedule').val() );
		console.log(json);
		$('#myFuScheduler').scheduler('value', json);
	});

	$('#btnSchedulerDestroy').on('click', function() {
		var markup = $('#myFuScheduler').scheduler('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		$('#myFuScheduler').scheduler();
	});

	
});