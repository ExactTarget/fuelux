module.exports = function(grunt) {

	var commonJSBundledReferenceModule = require('../other/commonjs-reference-module.js');

	/* -------------
		BUILD
	------------- */
	// JS distribution task
	grunt.registerTask('distjs', 'concat, uglify', ['concat', 'uglify', 'jsbeautifier']);

	// CSS distribution task
	grunt.registerTask('distcss', 'Compile LESS into CSS', ['less:dist', 'less:minify', 'usebanner']);

	// CSS distribution task (dev)
	grunt.registerTask('distcssdev', 'Compile LESS into the dev CSS', [ 'less:dev']);

	// ZIP distribution task
	grunt.registerTask('distzip', 'Compress and zip "dist"', ['copy:zipsrc', 'compress', 'clean:zipsrc']);

	// create dist/js/npm.js
	grunt.registerTask('commonjs', 'Create CommonJS "bundled reference" module in `dist`', function () {
		var files = grunt.config.get('concat.fuelux.src');
		var bundledReferenceFile = 'dist/js/npm.js';

		// console.log(grunt.config.get('concat.fuelux.src'));
		commonJSBundledReferenceModule(grunt, files, bundledReferenceFile);
	});

	// Full distribution task
	grunt.registerTask('dist', 'Build "dist." Contributors: do not commit "dist."',
			['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'commonjs', 'distzip']);


};