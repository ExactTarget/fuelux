module.exports = {
	options: {
		boss: true,
		browser: true,
		curly: false,
		eqeqeq: true,
		eqnull: true,
		globals: {
			jQuery: true,
			define: true,
			require: true,
			module: true
		},
		immed: true,
		latedef: true,
		newcap: true,
		noarg: true,
		sub: true,
		undef: true,
		unused: false
	},
	sourceAndDist: ['Gruntfile.js', 'js/*.js', 'dist/fuelux.js'],
	tests: {
		options: {
			latedef: false,
			undef: false,
			unused: false
		},
		files: {
			src: ['test/**/*.js', '!test/commonjs-bundle.js']
		}
	}
};