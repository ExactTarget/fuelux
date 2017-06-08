/* jshint expr:true*/
/* global module:false, process:false*/
module.exports = function gruntFile (grunt) {
	'use strict';

	/*
	 *	Welcome to our GruntFile.js!
	 *	Configuration tasks (initConfig) are external JS modules that can be found in
	 *	`./grunt/config`. Additional custom tasks can be found in `./grunt/task`.
	 *	The "shared variables" belowcannot use grunt.config(),
	 *	since it has not been initialized yet, until grunt.initConfig() is executed.
	 */

	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	// use --no-livereload to disable livereload. Helpful to 'serve' multiple projects
	// var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;

	// external libraries
	// var semver = require('semver');
	// var packageVersion = getPackage().version;
	// var fs = require('fs');
	var path = require('path');
	// var commonJSBundledReferenceModule = require('./grunt/other/commonjs-reference-module.js');

	// variables used in shared variables below
	var connectTestServerOptionsPort = 9000;

	// load and initialize configuration tasks, including package.json's devDependencies
	require('load-grunt-config')(grunt, {
		configPath: path.join(process.cwd(), 'grunt/config'),
		loadGruntTasks: {
			pattern: 'grunt-*',
			config: require('./package.json'),
			scope: 'devDependencies'
		},
		data: {
			// Variables shared across configuration tasks, use templates, <%= %>, to access
			// within configuration tasks
			bannerRelease: '/*!\n' +
			' * Fuel UX v<%= pkg.version %> \n' +
			' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
			' */\n',
			banner: '/*!\n' +
			' * Fuel UX EDGE - Built <%= grunt.template.today("yyyy/mm/dd, h:MM:ss TT") %> \n' +
			' * Previous release: v<%= pkg.version %> \n' +
			' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
			' */\n',
			jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Fuel UX\\\'s JavaScript requires jQuery\') }\n\n',
			bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' +
			'{ throw new Error(\'Fuel UX\\\'s JavaScript requires Bootstrap\') }\n\n',
			pkg: getPackage(),
			cdnLoginFile: grunt.file.exists('FUEL_CDN.yml') ? grunt.file.readYAML('FUEL_CDN.yml') : undefined,
			sauceUser: process.env.SAUCE_USERNAME || 'fuelux',
			// TEST URLS
			allTestUrls: ['2.1.0', '1.11.0', '1.9.1', 'browserGlobals', 'noMoment', 'codeCoverage' ].map(function allTestUrls (type) {
				if (type === 'browserGlobals') {
					return 'http://localhost:' + connectTestServerOptionsPort + '/test/browser-globals.html';
				} else if (type === 'codeCoverage') {
					return 'http://localhost:' + connectTestServerOptionsPort + '/test/?coverage=true';
				} else if (type === 'noMoment') {
					return 'http://localhost:' + connectTestServerOptionsPort + '/test/?no-moment=true';
				}

				// test dist with multiple jQuery versions
				return 'http://localhost:' + connectTestServerOptionsPort + '/test/?testdist=true';
			}),
			connectTestServerOptionsPort: connectTestServerOptionsPort
		}
	});

	grunt.registerTask('default', 'Run source file tests. Pass --no-resetdist to keep "dist" changes from being wiped out',
		['test', 'clean:screenshots', 'resetdist']);

	// load custom build, release, serve, and test tasks from the folder specified
	grunt.loadTasks('./grunt/tasks');
};
