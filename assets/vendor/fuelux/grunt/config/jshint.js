module.exports = {
	options: {
		jshintrc: '.jshintrc' // use project defined jshint settings which can be shared with IDEs etc
	},
	sourceAndDist: ['Gruntfile.js', 'js/*.js', 'dist/fuelux.js'],
	tests: ['test/**/*.js', '!test/commonjs-bundle.js']
};