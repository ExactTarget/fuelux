/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {
	'use strict';

	// use --no-livereload to disable livereload. Helpful to 'serve' multiple projects
	var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;

	var semver = require('semver');
	var currentVersion = require('./package.json').version;

	// Project configuration.
	grunt.initConfig({
		// Metadata
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
		bump: {
			options: {
				files: ['bower.json', 'package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				createTag: false,
				tagName: '%VERSION%',
				tagMessage: '%VERSION%',
				push: false,
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},
		jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Fuel UX\\\'s JavaScript requires jQuery\') }\n\n',
		bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' +
		'{ throw new Error(\'Fuel UX\\\'s JavaScript requires Bootstrap\') }\n\n',
		pkg: grunt.file.readJSON('package.json'),
		// Try ENV variables (export SAUCE_ACCESS_KEY=XXXX), if key doesn't exist, try key file
		sauceLoginFile: grunt.file.exists('SAUCE_API_KEY.yml') ? grunt.file.readYAML('SAUCE_API_KEY.yml') : undefined,
		sauceUser: process.env.SAUCE_USERNAME || 'fuelux',
		sauceKey: process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : '<%= sauceLoginFile.key %>',
		allTestUrls: ['2.1.0', '1.11.0', '1.9.1', 'browserGlobals'].map(function (ver) {
			if (ver === 'browserGlobals') {
				return 'http://localhost:<%= connect.testServer.options.port %>/test/fuelux-browser-globals.html';
			}

			return 'http://localhost:<%= connect.testServer.options.port %>/test/fuelux.html?jquery=' + ver + '&testdist=true';
		}),
		testUrl: ['http://localhost:<%= connect.testServer.options.port %>/test/fuelux.html?jquery=' + '1.9.1&testdist=true'],

		//Tasks configuration
		clean: {
			dist: ['dist'],
			zipsrc: ['dist/fuelux'],// temp folder
			screenshots: ['page-at-timeout-*.jpg']
		},
		compress: {
			zip: {
				files: [
					{
						cwd: 'dist/',
						expand: true,
						src: ['fuelux/**']
					}
				],
				options: {
					archive: 'dist/fuelux.zip',
					mode: 'zip'
				}
			}
		},
		concat: {
			dist: {
				files: {
					// manually concatenate JS files (due to dependency management)
					'dist/js/fuelux.js': [
						'js/checkbox.js',
						'js/combobox.js',
						'js/datepicker.js',
						'js/dropdown-autoflip.js',
						'js/loader.js',
						'js/placard.js',
						'js/radio.js',
						'js/search.js',
						'js/selectlist.js',
						'js/spinbox.js',
						'js/tree.js',
						'js/wizard.js',

						//items with dependencies on other controls
						'js/infinite-scroll.js',
						'js/pillbox.js',
						'js/repeater.js',
						'js/repeater-list.js',
						'js/repeater-thumbnail.js',
						'js/scheduler.js'
					]
				},
				options: {
					banner: '<%= banner %>' + '\n\n' +
					'// For more information on UMD visit: https://github.com/umdjs/umd/' + '\n' +
					'(function (factory) {' + '\n' +
					'\tif (typeof define === \'function\' && define.amd) {' + '\n' +
					'\t\tdefine([\'jquery\', \'bootstrap\'], factory);' + '\n' +
					'\t} else {' + '\n' +
					'\t\tfactory(jQuery);' + '\n' +
					'\t}' + '\n' +
					'}(function (jQuery) {\n\n' +
					'<%= jqueryCheck %>' +
					'<%= bootstrapCheck %>',
					footer: '\n}));',
					process: function (source) {
						source = '(function ($) {\n\n' +
							source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '');
						source = source.replace(/\/\/ -- BEGIN UMD WRAPPER AFTERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
						return source;
					}
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: '*',
					port: process.env.PORT || 8000,
					useAvailablePort: true// increment port number, if unavailable...
				}
			},
			testServer: {
				options: {
					hostname: '*',
					port: 9000,// allows main server to be run simultaneously
					useAvailablePort: true// increment port number, if unavailable...
				}
			}
		},
		copy: {
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
			}
		},
		jsbeautifier: {
			files: ['dist/js/fuelux.js'],
			options: {
				js: {
					braceStyle: 'collapse',
					breakChainedMethods: false,
					e4x: false,
					evalCode: false,
					indentLevel: 0,
					indentSize: 4,
					indentWithTabs: true,
					jslintHappy: false,
					keepArrayIndentation: false,
					keepFunctionIndentation: false,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: true,
					unescapeStrings: false,
					wrapLineLength: 0
				}
			}
		},
		jshint: {
			options: {
				boss: true,
				browser: true,
				curly: false,
				eqeqeq: true,
				eqnull: true,
				globals: {
					jQuery: true,
					define: true,
					require: true
				},
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: false// changed
			},
			source: ['Gruntfile.js', 'js/*.js', 'dist/fuelux.js'],
			tests: {
				options: {
					latedef: false,
					undef: false,
					unused: false
				},
				files: {
					src: ['test/**/*.js']
				}
			}
		},
		qunit: {
			//run with `grunt releasetest` or `grunt travisci`. Requires connect server to be running.
			full: {
				options: {
					urls: '<%= allTestUrls %>',
					screenshot: true,
					page: {
						viewportSize: {
							width: 1280,
							height: 1024
						}
					}
				}
			},
			//can be run with `grunt qunit:simple`
			simple: ['test/*.html'],
			dist: {
				options: {
					urls: ['http://localhost:<%= connect.server.options.port %>/test/fuelux.html?testdist=true']
				}
			}
		},
		less: {
			dist: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>.css.map',
					sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
				},
				files: {
					'less/fuelux-no-namespace.less': 'less/fuelux.less',
					'dist/css/fuelux.css': 'less/fuelux-namespace.less'
				}
			},
			minify: {
				options: {
					cleancss: true,
					compress: true,
					report: 'min'
				},
				files: {
					'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
				}
			},
		},
		prompt: {
			bump: {
				options: {
					questions: [
						{
							config: 'bump.increment',
							type: 'list',
							message: 'Bump version from ' + '<%= pkg.version %>' + ' to:',
							choices: [
								// {
								// 	value: 'build',
								// 	name:  'Build:  '+ (currentVersion + '-?') + ' Unstable, betas, and release candidates.'
								// },
								{
									value: 'patch',
									name: 'Patch:  ' + semver.inc(currentVersion, 'patch') + ' Backwards-compatible bug fixes.'
								},
								{
									value: 'minor',
									name: 'Minor:  ' + semver.inc(currentVersion, 'minor') + ' Add functionality in a backwards-compatible manner.'
								},
								{
									value: 'major',
									name: 'Major:  ' + semver.inc(currentVersion, 'major') + ' Incompatible API changes.'
								},
								{
									value: 'custom',
									name: 'Custom: ?.?.? Specify version...'
								}
							]
						},
						{
							config: 'bump.version',
							type: 'input',
							message: 'What specific version would you like',
							when: function (answers) {
								return answers['bump.increment'] === 'custom';
							},
							validate: function (value) {
								var valid = semver.valid(value);
								return valid || 'Must be a valid semver, such as 1.2.3-rc1. See http://semver.org/ for more details.';
							}
						}//,
						// {
						// 	config:  'bump.files',
						// 	type:    'checkbox',
						// 	message: 'What should get the new version:',
						// 	choices: [
						// 		{
						// 			value:   'package',
						// 			name:    'package.json' + (!grunt.file.isFile('package.json') ? ' not found, will create one' : ''),
						// 			checked: grunt.file.isFile('package.json')
						// 		},
						// 		{
						// 			value:   'bower',
						// 			name:    'bower.json' + (!grunt.file.isFile('bower.json') ? ' not found, will create one' : ''),
						// 			checked: grunt.file.isFile('bower.json')
						// 		},
						// {
						// 	value:   'git',
						// 	name:    'git tag',
						// 	checked: grunt.file.isDir('.git')
						// }
						// 	]
						// }
					]
				}
			}
		},
		replace: {
			readme: {
				src: ['DETAILS.md', 'README.md'],
				overwrite: true,// overwrite matched source files
				replacements: [{
					from: /fuelux\/\d\.\d\.\d/g,
					to: "fuelux/<%= pkg.version %>"
				}]
			}
		},
		'saucelabs-qunit': {
			trickyBrowsers: {
				options: {
					username: '<%= sauceUser %>',
					key: '<%= sauceKey %>',
					tunnelTimeout: 45,
					testInterval: 3000,
					tags: ['<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>' + '@local'],
					browsers: grunt.file.readYAML('sauce_browsers_tricky.yml'),
					build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
					testname: process.env.TRAVIS_JOB_ID || Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
					urls: '<%= testUrl %>'
				}
			},
			defaultBrowsers: {
				options: {
					username: '<%= sauceUser %>',
					key: '<%= sauceKey %>',
					tunnelTimeout: 45,
					testInterval: 3000,
					tags: ['<%= pkg.version %>', '<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>@local'],
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
					build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
					testname: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
					urls: '<%= testUrl %>',
					maxPollRetries: 4,
					throttled: 3,
					maxRetries: 3
				}
			},
			all: {
				options: {
					username: '<%= sauceUser %>',
					key: '<%= sauceKey %>',
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
					build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
					testname: 'grunt-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
					urls: '<%= allTestUrls %>'
				}
			}
		},
		uglify: {
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
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [
						'dist/css/<%= pkg.name %>.css',
						'dist/css/<%= pkg.name %>.min.css'
					]
				}
			}
		},
		validation: {
			// if many errors are found, this may log to console while other tasks are running
			options: {
				reset: function () {
					grunt.option('reset') || false ;
				},
				stoponerror: true,
				relaxerror: [//ignores these errors
					'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
					'Element head is missing a required instance of child element title.'
				],
				doctype: 'HTML5',
				reportpath: false
			},
			files: {
				src: ['index.html', 'test/markup/*.html']
			}
		},
		watch: {
			//watch everything and test everything (test dist)
			full: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['jshint', 'dist', 'qunit:dist', 'validation']
			},
			//watch everything but only perform simple qunit tests (don't test dist)
			simple: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['jshint', 'qunit:simple', 'validation']
			},
			//only watch and dist less, useful when doing LESS/CSS work
			less: {
				files: ['fonts/**', 'less/**'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['distcss']
			},
			//watch things that need compiled, useful for debugging/developing against dist
			dist: {
				files: ['fonts/**', 'js/**', 'less/**'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['dist']
			},
			//just keep the server running, best for when you are just in the zone slinging code and don't want to be interrupted with tests
			lite: {
				files: [],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: []
			}
		}
	});

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
	grunt.registerTask('distcss', 'Compile LESS into CSS', ['less', 'usebanner', 'delete-temp-less-file']);

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
	grunt.registerTask('default', 'Run simple tests. Pass --no-resetdist to keep dist changes from being wiped out', ['test', 'clean:screenshots', 'resetdist']);

	// to be run prior to submitting a PR
	grunt.registerTask('test', 'run jshint, qunit:simple, and validate HTML', ['jshint', 'qunit:simple', 'validation']);

	//If qunit:simple is working but qunit:full is breaking, check to see if the dist broke the code. This would be especially useful if we start mangling our code, but, is 99.99% unlikely right now
	grunt.registerTask('validate-dist', 'run qunit:simple, dist, and then qunit:full', ['connect:testServer', 'qunit:simple', 'dist', 'qunit:full']);

	// multiple jquery versions, then run SauceLabs VMs
	grunt.registerTask('releasetest', 'run jshint, dist, qunit:full, validation, and qunit on saucelabs', ['connect:testServer', 'jshint', 'qunit:simple', 'dist', 'qunit:full', 'validation', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the Fuel UX Saucelabs API key file which is not public at this time.
	grunt.registerTask('saucelabs', 'run jshint, and qunit on saucelabs', ['connect:testServer', 'jshint', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the FuelUX Saucelabs API key file which is not public at this time.
	grunt.registerTask('trickysauce', 'run tests, jshint, and qunit for "tricky browsers" (IE8-11)', ['connect:testServer', 'jshint', 'saucelabs-qunit:trickyBrowsers']);

	// Travis CI task. This task no longer uses SauceLabs. Please run 'grunt saucelabs' manually.
	grunt.registerTask('travisci', 'Tests to run when in Travis CI environment', ['connect:testServer', 'jshint', 'qunit:simple', 'dist', 'qunit:full']);

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
			grunt.task.run(['releasetest']);
			//delete any screenshots that may have happened if it got this far. This isn't foolproof because it relies on the phantomjs server/page timeout, which can take longer than this grunt task depending on how long saucelabs takes to run...
			grunt.task.run('clean:screenshots');
		}

		grunt.config('banner', '<%= bannerRelease %>');
		//make sure we run dist again to grab the latest version numbers. Yeah, we're running it twice... ¯\_(ツ)_/¯
		grunt.task.run(['bump-only:' + grunt.config('bump.increment'), 'replace:readme', 'dist']);
	});


	/* -------------
		SERVE
	------------- */
	//most basic serve task, it's the safest, but also the slowest.
	grunt.registerTask('serve', 'Serve the files. --no-test to skip tests', function () {
		//default --test=true
		if (typeof grunt.option('test') === "undefined") {
			grunt.option('test', true);
		}

		grunt.task.run(['servedist']);
	});

	//Fastest serve command for freely slinging code (you won't get interrupted by tests, etc).
	grunt.registerTask('servefast', 'Serve the files. pass --test to run tests.', function () {
		grunt.task.run(['connect:server']);

		if (grunt.option('test')) {
			grunt.task.run(['qunit:simple', 'watch:simple']);
		} else {
			grunt.task.run(['watch:lite']);
		}
	});

	//Fastest serve command when you're working on LESS
	grunt.registerTask('serveless', 'Compile LESS and serve the files. pass --tests to run test.', function () {
		grunt.task.run(['distcss']);

		if (grunt.option('test')) {
			//add qunit:simple as a watch task for watch:less since they want tests
			grunt.config.merge({
				watch: {
					less: {
						tasks: ['qunit:simple']
					}
				}
			});
			grunt.task.run(['qunit:simple']);
		}

		grunt.task.run(['connect:server', 'watch:less']);
	});

	//basically just `grunt serve` but tests default to being off
	grunt.registerTask('servedist', 'Compile and serve everything, pass --test to run tests.', function () {
		grunt.task.run(['dist']);

		//start up the server here so we can run tests if appropriate
		grunt.task.run(['connect:server']);

		if (grunt.option('test')) {
			grunt.task.run(['qunit:dist', 'watch:full']);
		} else {
			grunt.task.run(['watch:dist']);
		}
	});
};
