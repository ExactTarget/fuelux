module.exports = {
	zip: {
		files: [{
			cwd: 'dist/',
			expand: true,
			src: ['fuelux/**']
		}],
		options: {
			archive: 'dist/fuelux.zip',
			mode: 'zip'
		}
	}
};
