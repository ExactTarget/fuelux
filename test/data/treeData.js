/* global QUnit:false, module:false, test:false, asyncTest:false, expect:false */
/* global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false */
/* global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false */
define(function treeDataFactory () {
	var guid = function guid () {
		var s4 = function s4 () {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};

		var guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

		return guid;
	};

	var callCountData = {
		data: [
			{
				'name': 'Convex and Concave',
				'type': 'item',
				'attr': {
					'id': 'item4'
				}
			}
		]
	};

	var textData = {
		data: [
			{
				text: 'node text',
				type: 'folder',
				attr: {
					id: 'folder1'
				}
			}
		]
	};

	var treeData = function generateTreeData () {
		return {
			data: [
				{
					name: 'Ascending and Descending',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Sky and Water I (with custom icon)',
					type: 'item',
					attr: {
						id: 'folder' + guid(),
						'data-icon': 'glyphicon glyphicon-file'
					}
				},
				{
					name: 'Drawing Hands',
					type: 'folder',
					attr: {
						id: 'folder' + guid(),
						'data-children': false
					}
				},
				{
					name: 'Waterfall',
					type: 'item',
					attr: {
						id: 'item2'
					}
				},
				{
					name: 'Belvedere',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Relativity (with custom icon)',
					type: 'item',
					attr: {
						id: 'item3',
						'data-icon': 'glyphicon glyphicon-picture'
					}
				},
				{
					name: 'House of Stairs',
					type: 'folder',
					attr: {
						id: 'folder' + guid()
					}
				},
				{
					name: 'Convex and Concave',
					type: 'item',
					attr: {
						id: 'item4'
					}
				},
				{
					name: 'Load More',
					type: 'overflow',
					attr: {
						id: 'overflow1'
					}
				}
			]
		};
	};

	return { treeData: treeData, callCountData: callCountData, textData: textData };
});
