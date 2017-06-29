module.exports = {
	options: {
		jshintrc: '.jshintrc', // use project defined jshint settings which can be shared with IDEs etc
		ignores: ['test/data/*.js']
	},
	sourceAndDist: ['Gruntfile.js', 'js/*.js', 'dist/fuelux.js']
};
