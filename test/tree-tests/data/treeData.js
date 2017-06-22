define(function treeDataModule (require) {
	var guid = require('./guid');

	// make sure this returns a function so that new guids will be generated each time you use this data, otherwise
	// trees using this data to populate nested folders will not work because you will have duplicate IDs. ie: you
	// can't just return a static object here. You must return a function, and you must call that function again for
	// each use, you can't just cache and reuse the output.
	return function generateFreshData () {
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
});
