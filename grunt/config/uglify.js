module.exports = function (grunt) {

	return {
		options: {
			report: 'min'
		},
		fuelux: {
			options: {
				banner: '<%= banner %>'
			},
			src: 'dist/js/<%= pkg.name %>.js',
			dest: 'dist/js/<%= pkg.name %>.min.js'
		}
	}

};