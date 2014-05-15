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

	var DataSourceTree, dataSourceTree, dataSourceTreeFolders;


	//Data source for tree
	DataSourceTree = function (options) {
		this._data 	= options.data;
		this._delay = options.delay;
	};

	DataSourceTree.prototype = {

		data: function (options, callback) {
			var self = this;

			setTimeout(function () {
				var data = $.extend(true, [], self._data);

				callback({ data: data });

			}, this._delay)
		}

	};

	// Item Tree
	dataSourceTree = new DataSourceTree({
		data: [
			{ name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F1' } },
			{ name: 'Test Folder 2', type: 'folder', additionalParameters: { id: 'F2' } },
			{ name: 'Test Item 1', type: 'item', additionalParameters: { id: 'I1' } },
			{ name: 'Test Item 2', type: 'item', additionalParameters: { id: 'I2' } }
		],
		delay: 400
	});

	$('#ex-tree').on('loaded', function (e) {
		console.log('Loaded');
	});

	$('#ex-tree').tree({
		dataSource: dataSourceTree,
		multiSelect: true,
		cacheItems: true
	});

	$('#ex-tree').on('selected', function (e, info) {
		console.log('Select Event: ', info);
	});

	$('#ex-tree').on('opened', function (e, info) {
		console.log('Open Event: ', info);
	});

	$('#ex-tree').on('closed', function (e, info) {
		console.log('Close Event: ', info);
	});

	//Folder select tree
	dataSourceTreeFolders = new DataSourceTree({
		data: [
			{ name: 'Test Folder 1', type: 'folder', additionalParameters: { id: 'F1' } },
			{ name: 'Test Folder 2', type: 'folder', additionalParameters: { id: 'F2' } },
			{ name: 'Test Folder 3', type: 'folder', additionalParameters: { id: 'F3' } }
		],
		delay: 400
	});

	$('#ex-tree-folder').tree({
		dataSource: dataSourceTreeFolders,
		multiSelect: false,
		cacheItems: true
	});

	$('#ex-tree-folder').on('selected', function (e, info) {
		console.log('Select Event: ', info);
	});
});