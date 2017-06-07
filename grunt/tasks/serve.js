module.exports = function serveTasks (grunt) {
	// runs tests and builds and tests dist by default.
	grunt.registerTask('serve', 'Test, build, serve files. (~20s)', function serve () {
		var tasks = ['test', 'servedist'];
		grunt.task.run(tasks);
	});

	// serve task that runs tests and builds and tests dist by default (~20s).
	grunt.registerTask('serveslow', 'Serve files. Run all tests. Does not build. (~20s)', function serveslow () {
		var tasks = ['connect:server', 'test', 'watch:source'];
		grunt.task.run(tasks);
	});

	// Fastest serve command for freely slinging code (no tests will run by default).
	grunt.registerTask('servefast', 'Serve the files (no watch), --test to run minimal tests. (~0s)', function servefast () {
		grunt.task.run(['connect:server']);

		if (grunt.option('test')) {
			grunt.task.run(['connect:testServer', 'qunit:source', 'watch:source']);
		} else {
			grunt.task.run(['watch:lite']);
		}
	});

	// Fastest serve command when you're working on LESS
	grunt.registerTask('serveless', 'Compile LESS and serve the files. pass --tests to run test. (~3s)', function serveless () {
		grunt.task.run(['distcss']);

		if (grunt.option('test')) {
			// add qunit:source as a watch task for watch:less since they want tests
			grunt.config.merge({
				watch: {
					less: {
						tasks: ['qunit:source']
					}
				}
			});
			grunt.task.run(['qunit:source']);
		}

		grunt.task.run(['connect:server', 'watch:less']);
	});

	// Complies the less files into the -dev versions, does not overwrite the main css files.
	grunt.registerTask('servedev', 'Serve the files with no "dist" build or tests. Optional --no-less to also disable compiling less into css.', function servedev () {
		if ( !grunt.option('no-less') ) {
			grunt.task.run(['distcssdev']);
		}
		grunt.task.run(['connect:server', 'watch:cssdev']);
	});

	// same as `grunt serve` but tests default to being off
	grunt.registerTask('servedist', 'Compile and serve everything, pass --test to run tests. (~7s)', function servedist () {
		grunt.task.run(['dist']);

		// start up the servers here so we can run tests if appropriate
		grunt.task.run(['connect:server']);
		grunt.task.run(['connect:testServer']);

		if (grunt.option('test')) {
			grunt.task.run(['browserify:commonjs', 'qunit:dist', 'watch:full']);
		} else {
			grunt.task.run(['watch:dist']);
		}
	});
};
