module.exports = {
	dist: {
		options: {
			position: 'top',
			banner: '<%= banner %>'
		},
		files: {
			src: ['dist/css/<%= pkg.name %>.css',
				'dist/css/<%= pkg.name %>.min.css'
			]
		}
	}
};