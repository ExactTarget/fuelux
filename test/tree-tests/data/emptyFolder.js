define(function emptyFolderModule () {
	return {
		data: [
			{
				name: 'Empty Folder',
				type: 'folder',
				attr: {
					id: 'folder1'
				}
			},
			{
				name: 'Folder Sibling',
				type: 'item',
				attr: {
					id: 'sibling1',
					'data-icon': 'glyphicon glyphicon-file'
				}
			}
		]
	};
});
