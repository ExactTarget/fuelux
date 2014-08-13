/*!
 * JavaScript for FuelUX's docs - Tree Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');

	// TREE

	$('#myFuTree').on('loaded.fu.tree', function (e) {
		console.log('Loaded');
	});

	function myTreeInit() {

		$('#myFuTree').tree({
			dataSource: function(options, callback){
				setTimeout(function () {
					callback({ data: [
						{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
						{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
						{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'folder2' } },
						{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
						{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'folder3' } },
						{ name: 'Relativity (with custom icon)', type: 'item', dataAttributes: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
						{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'folder4' } },
						{ name: 'Convex and Concave', type: 'item', dataAttributes: { id: 'item4' } }
					]});

				}, 400);
			},
			multiSelect: true,
			cacheItems: true,
			folderSelect: false,
		});

	}

	myTreeInit();

	$('#myFuTree').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#myFuTree').tree('selectedItems'));
	});

	$('#myFuTree').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#myFuTree').tree('selectedItems'));
	});

	$('#myFuTree').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#myFuTree').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#myFuTreeSelectableFolder').tree({
		dataSource: function(options, callback){
			setTimeout(function () {
				callback({ data: [
					{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'F1' } },
					{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'F2' } },
					{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'F3' } },
					{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'F4' } },
					{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'F5' } }
				]});
			}, 400);
		},
		cacheItems: true,
		folderSelect: true,
		multiSelect: true
	});

	$('#myFuTreeDefault').tree({
		dataSource: function(options, callback){
			setTimeout(function () {
				callback({ data: [
				{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
				{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
				{ name: 'Drawing Hands', type: 'folder', dataAttributes: { id: 'folder2', 'data-children': false } },
				{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
				{ name: 'Belvedere', type: 'folder', dataAttributes: { id: 'folder3' } },
				{ name: 'Relativity (with custom icon)', type: 'item', dataAttributes: { id: 'item3', 'data-icon': 'glyphicon glyphicon-picture' } },
				{ name: 'House of Stairs', type: 'folder', dataAttributes: { id: 'folder4' } },
				{ name: 'Convex and Concave', type: 'item', dataAttributes: { id: 'item4' } }
				]});
			}, 400);
		}
	});

	$('#myFuTree').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});

	$('#myFuTreeSelectableFolder').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});


	$('#myFuTreeDefault').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#myFuTree').tree('selectedItems'));
	});

	$('#myFuTreeDefault').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#myFuTree').tree('selectedItems'));
	});

	$('#myFuTreeDefault').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#myFuTreeDefault').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#btnTreeDestroy').click(function () {
		var markup = $('#myFuTree').tree('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		myTreeInit();
	});

});