/*!
 * JavaScript for Fuel UX's docs - Tree Examples
 * Copyright 2011-2014 ExactTarget, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

define(function(require){
	var jquery = require('jquery');

	require('bootstrap');
	require('fuelux');


	$('#treeIllustration').tree({
		dataSource: function(options, callback){
			setTimeout(function () {
				callback({ data: [
					{ name: 'Waterfall', type: 'item', dataAttributes: { id: 'item2' } },
					{ name: 'Ascending and Descending', type: 'folder', dataAttributes: { id: 'folder1' } },
					{ name: 'Sky and Water I (with custom icon)', type: 'item', dataAttributes: { id: 'item1', 'data-icon': 'glyphicon glyphicon-file' } },
				]});

			}, 400);
		},
		multiSelect: true,
		cacheItems: true,
		folderSelect: false,
	});


	// TREE

	$('#myTree').on('loaded.fu.tree', function (e) {
		console.log('Loaded');
	});

	function myTreeInit() {

		$('#myTree').tree({
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

	$('#myTree').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#myTree').tree('selectedItems'));
	});

	$('#myTree').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#myTree').tree('selectedItems'));
	});

	$('#myTree').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#myTree').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#myTreeSelectableFolder').tree({
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

	$('#myTreeDefault').tree({
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

	$('#myTree').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});

	$('#myTreeSelectableFolder').on('selected.fu.tree', function (e, info) {
		console.log('Select Event: ', info);
	});


	$('#myTreeDefault').on('selected.fu.tree', function (e, selected) {
		console.log('Select Event: ', selected);
		console.log($('#myTree').tree('selectedItems'));
	});

	$('#myTreeDefault').on('updated.fu.tree', function (e, selected) {
		console.log('Updated Event: ', selected);
		console.log($('#myTree').tree('selectedItems'));
	});

	$('#myTreeDefault').on('opened.fu.tree', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#myTreeDefault').on('closed.fu.tree', function (e, info) {
		console.log('Close Event: ', info);
	});

	$('#btnTreeDestroy').click(function () {
		var markup = $('#myTree').tree('destroy');
		console.log( markup );
		$(this).closest('.section').append(markup);
		myTreeInit();
	});

});