/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {
	'use strict';

	// use --no-livereload to disable livereload. Helpful to 'serve' multiple projects
	var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;

	var semver = require('semver');
	var currentVersion = require('./package.json').version;

	var loadGruntConfigOptions = {
			config : {
					src: "grunt/*.json"
			}
	};

	// Look pa! All the config settings are in JSON files within the 
	// grunt directory. The high level task is defined by its filename. 
	// See http://creynders.github.io/load-grunt-configs/
	var configs = require('load-grunt-configs')(grunt, loadGruntConfigOptions);
	grunt.initConfig(configs);

	// Look ma! Load all grunt plugins in one line from package.json
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});


	/* -------------
		BUILD
	------------- */
	// JS distribution task
	grunt.registerTask('distjs', 'concat, uglify', ['concat', 'uglify', 'jsbeautifier']);

	// CSS distribution task
	grunt.registerTask('distcss', 'Compile LESS into CSS', ['less:dist', 'less:minify', 'usebanner']);

	// CSS distribution task (dev)
	grunt.registerTask('distcssdev', 'Compile LESS into the dev CSS', [ 'less:dev', 'delete-temp-less-file']);

	// Temporary LESS file deletion task
	grunt.registerTask('delete-temp-less-file', 'Delete the temporary LESS file created during the build process', function () {
		var options = {
			force: true
		};
		grunt.file.delete('less/fuelux-no-namespace.less', options);
	});

	// ZIP distribution task
	grunt.registerTask('distzip', 'Compress and zip "dist"', ['copy:zipsrc', 'compress', 'clean:zipsrc']);

	// Full distribution task
	grunt.registerTask('dist', 'Build "dist." Contributors: do not commit "dist."', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'distzip']);


	/* -------------
		TESTS
	------------- */
	// The default build task
	grunt.registerTask('default', 'Run source file tests. Pass --no-resetdist to keep "dist" changes from being wiped out',
		['test', 'clean:screenshots', 'resetdist']);

	// to be run prior to submitting a PR
	grunt.registerTask('test', 'run jshint, qunit source w/ coverage, and validate HTML',
		['jshint', 'connect:testServer', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'validation']);

	//If qunit:source is working but qunit:full is breaking, check to see if the dist broke the code. This would be especially useful if we start mangling our code, but, is 99.99% unlikely right now
	grunt.registerTask('validate-dist', 'run qunit:source, dist, and then qunit:full',
		['connect:testServer', 'qunit:source', 'dist', 'qunit:dist']);

	// multiple jQuery versions, then run SauceLabs VMs
	grunt.registerTask('releasetest', 'run jshint, build dist, all source tests, validation, and qunit on SauceLabs',
		['test', 'dist', 'qunit:dist', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the Fuel UX Saucelabs API key file which is not public at this time.
	grunt.registerTask('saucelabs', 'run jshint, and qunit on saucelabs',
		['connect:testServer', 'jshint', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the FuelUX Saucelabs API key file which is not public at this time.
	grunt.registerTask('trickysauce', 'run tests, jshint, and qunit for "tricky browsers" (IE8-11)',
		['connect:testServer', 'jshint', 'saucelabs-qunit:trickyBrowsers']);

	// Travis CI task. This task no longer uses SauceLabs. Please run 'grunt saucelabs' manually.
	grunt.registerTask('travisci', 'Tests to run when in Travis CI environment',
		['test', 'dist', 'qunit:dist']);

	//if you've already accidentally added your files for commit, this will at least unstage them. If you haven't, this will wipe them out.
	grunt.registerTask('resetdist', 'resets changes to dist to keep them from being checked in', function () {
		//default resetdist to true... basically.
		if (typeof grunt.option('resetdist') === "undefined" || grunt.option('resetdist')) {
			var exec = require('child_process').exec;
			exec('git reset HEAD dist/*');
			exec('git checkout -- dist/*');
		}
	});

	/* -------------
		RELEASE
	------------- */
	// Maintainers: Run prior to a release. Includes SauceLabs VM tests.
	grunt.registerTask('release', 'Release a new version, push it and publish it', ['prompt:bump', 'dorelease']);
	grunt.registerTask('dorelease', '', function () {
		if (typeof grunt.config('bump.increment') === 'undefined') {
			grunt.fail.fatal('you must choose a version to bump to');
		}

		grunt.log.writeln('');
		grunt.log.oklns('releasing: ', grunt.config('bump.increment'));

		if (!grunt.option('no-tests')) {
			grunt.task.run(['releasetest']); //If phantom timeouts happening because of long-running qunit tests, look into setting `resourceTimeout` in phantom: http://phantomjs.org/api/webpage/property/settings.html
			// Delete any screenshots that may have happened if it got this far. This isn't foolproof
			// because it relies on the phantomjs server/page timeout, which can take longer than this
			// grunt task depending on how long saucelabs takes to run...
			grunt.task.run('clean:screenshots');
		}

		grunt.config('banner', '<%= bannerRelease %>');
		// Run dist again to grab the latest version numbers. Yeah, we're running it twice... ¯\_(ツ)_/¯
		grunt.task.run(['bump-only:' + grunt.config('bump.increment'), 'replace:readme', 'dist']);
	});


	/* -------------
		SERVE
	------------- */
	// default serve task that runs tests and builds and tests dist by default.
	grunt.registerTask('serve', 'Test, build, serve files. (~20s)', function () {
		var tasks = ['test', 'servedist'];
		grunt.task.run(tasks);
	});

	// serve task that runs tests and builds and tests dist by default (~20s).
	grunt.registerTask('serveslow', 'Serve files. Run all tests. Does not build. (~20s)', function () {
		var tasks = ['connect:server', 'test', 'watch:source'];
		grunt.task.run(tasks);
	});

	//Fastest serve command for freely slinging code (no tests will run by default).
	grunt.registerTask('servefast', 'Serve the files (no watch), --test to run minimal tests. (~0s)', function () {
		grunt.task.run(['connect:server']);

		if (grunt.option('test')) {
			grunt.task.run(['connect:testServer', 'qunit:source', 'watch:source']);
		} else {
			grunt.task.run(['watch:lite']);
		}
	});

	// Fastest serve command when you're working on LESS
	grunt.registerTask('serveless', 'Compile LESS and serve the files. pass --tests to run test. (~3s)', function () {
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
	grunt.registerTask('servedev', 'Serve the files with no "dist" build or tests. Optional --no-less to also disable compiling less into css.', function() {
		if (! grunt.option('no-less') ) {
			grunt.task.run(['distcssdev']);
		}
		grunt.task.run(['connect:server', 'watch:cssdev']);
	});

	// same as `grunt serve` but tests default to being off
	grunt.registerTask('servedist', 'Compile and serve everything, pass --test to run tests. (~7s)', function () {
		grunt.task.run(['dist']);

		//start up the servers here so we can run tests if appropriate
		grunt.task.run(['connect:server']);
		grunt.task.run(['connect:testServer']);

		if (grunt.option('test')) {
			grunt.task.run(['qunit:dist', 'watch:full']);
		} else {
			grunt.task.run(['watch:dist']);
		}
	});
};
