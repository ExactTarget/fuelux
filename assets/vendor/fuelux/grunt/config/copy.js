module.exports = {
	fonts: {
		cwd: 'fonts/',
		dest: 'dist/fonts/',
		expand: true,
		filter: 'isFile',
		src: ['*']
	},
	zipsrc: {
		cwd: 'dist/',
		dest: 'dist/fuelux/',
		expand: true,
		src: ['**']
	},
	templates: {
		cwd: 'templates/',
		dest: 'dist/templates/',
		expand: true,
		src: ['**']
	}
};