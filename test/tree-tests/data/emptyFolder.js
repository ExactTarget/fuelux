define(function emptyFolderModule () {
	return [
		{
			name: 'Empty Folder',
			type: 'folder',
			attr: {
				id: 'emptyFolder'
			},
			children: []
		},
		{
			name: 'Full Folder',
			type: 'folder',
			attr: {
				id: 'fullFolder'
			},
			children: [
				{
					name: 'Empty Folder 2',
					type: 'folder',
					attr: {
						id: 'emptyFolder2'
					},
					children: []
				},
				{
					name: 'Folder Sibling 2',
					type: 'item',
					attr: {
						id: 'sibling2',
						'data-icon': 'glyphicon glyphicon-file'
					}
				}
			]
		},
		{
			name: 'Folder Sibling',
			type: 'item',
			attr: {
				id: 'sibling1',
				'data-icon': 'glyphicon glyphicon-file'
			}
		}
	];
});
