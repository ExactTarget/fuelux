/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function(grunt) {
	'use strict';

	// use --no-livereload to disable livereload. Helpful to 'serve' multiple projects
	var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;

	// Project configuration.
	grunt.initConfig({
		// Metadata
		banner: '/*!\n' +
		' * Fuel UX v<%= pkg.version %> \n' +
		' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
		' */\n',
		bump: {
			options: {
				files: [ 'bower.json', 'package.json' ],
				updateConfigs: [ 'pkg' ],
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
		allTestUrls: ['2.1.0', '1.11.0', '1.9.1', 'browserGlobals'].map(function(ver) {
			if (ver === 'browserGlobals') {
				return 'http://localhost:<%= connect.testServer.options.port %>/test/fuelux-browser-globals.html';
			}
			return 'http://localhost:<%= connect.testServer.options.port %>/test/fuelux.html?jquery=' + ver;
		}),
		trickyTestUrl: 'http://localhost:<%= connect.testServer.options.port %>/test/fuelux.html?jquery=' + '1.9.1',
		travisCITestUrls: ['http://localhost:<%= connect.testServer.options.port %>/test/fuelux.html?jquery=' + '1.9.1'],

		//Tasks configuration
		clean: {
			dist: ['dist'],
			zipsrc: ['dist/fuelux'] // temp folder
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
					process: function(source) {
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
					port: 8000,
					useAvailablePort: true	// increment port number, if unavailable...
				}
			},
			testServer: {
				options: {
					hostname: '*',
					port: 9000, // allows main server to be run simultaneously
					useAvailablePort: true	// increment port number, if unavailable...
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
				unused: false // changed
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
			full: {
				options: {
					urls: '<%= allTestUrls %>'
				}
			},
			simple: ['test/*.html']
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
					'dist/css/fuelux.css': 'less/fuelux.less'
				}
			},
			minify: {
				options: {
					cleancss: true,
					report: 'min'
				},
				files: {
					'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
				}
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
					build: process.env.TRAVIS_BUILD_NUMBER || '',
					testname: process.env.TRAVIS_JOB_ID || Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
					urls: '<%= trickyTestUrl %>'
				}
			},
			travisCIBrowsers: {
				options: {
					username: '<%= sauceUser %>',
					key: '<%= sauceKey %>',
					tunnelTimeout: 45,
					testInterval: 3000,
					tags: ['<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>@local'],
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
					build: process.env.TRAVIS_BUILD_NUMBER || '',
					testname: process.env.TRAVIS_JOB_ID || 'grunt-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
					urls: '<%= travisCITestUrls %>'
				}
			},
			all: {
				options: {
					username: '<%= sauceUser %>',
					key: '<%= sauceKey %>',
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
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
				reset: function() {
					grunt.option('reset') || false ;
				},
				stoponerror: true,
				relaxerror: [ //ignores these errors
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
			full: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['test', 'dist']
			},
			css: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['distcss']
			},
			contrib: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['test']
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
	grunt.registerTask('distjs', 'concat, uglify, and beautifying JS', ['concat', 'uglify', 'jsbeautifier']);

	// CSS distribution task
	grunt.registerTask('distcss', 'less compile CSS', ['less', 'usebanner']);

	// ZIP distribution task
	grunt.registerTask('distzip', 'compress and zip dist', ['copy:zipsrc', 'compress', 'clean:zipsrc']);

	// Full distribution task
	grunt.registerTask('dist', 'build and zip dist --contributors should do this!!!', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'distzip']);

	// The default build task
	grunt.registerTask('default', 'run release tests. Does not build dist.', ['releasetest']);

	// This task should be run to build dist directory. This is mostly for maintainers prior to a release.
	// Contributors who run this will need to revert changes to dist afterwards (there shouldn't be a reason for a contributor to run this)
	grunt.registerTask('release', 'run release tests and build dist directory', ['releasetest', 'dist']);

	/* -------------
		TESTS
	------------- */
	// minimal tests for developmeent
	grunt.registerTask('test', 'run jshint, qunit, and validation', ['jshint', 'qunit:simple', 'validation']);

	// multiple jquery versions, but still no VMs
	grunt.registerTask('releasetest', 'run testServer, jshint, and qunit', ['connect:testServer', 'jshint', 'qunit:full']);


	// can be run locally instead of through TravisCI, but requires the FuelUX Saucelabs API key file which is not public at this time.
	// multiple jquery versions, sent to VMs
	grunt.registerTask('saucelabs', 'run testServer, jshint, and qunity on saucelabs', ['connect:testServer', 'jshint', 'saucelabs-qunit:all']);

	// can be run locally instead of through TravisCI, but requires the FuelUX Saucelabs API key file which is not public at this time.
	// multiple jquery versions, sent to VMs including IE8-11, etc.
	grunt.registerTask('trickysauce', 'run testServer, jshint, and qunit for "tricky browsers" (IE8-11)', ['connect:testServer', 'jshint', 'saucelabs-qunit:trickyBrowsers']);

	//command line travisci / saucelabs
	grunt.registerTask('traviscisauce', 'run testServer, jshint, and saucelabs with TravisCI', ['connect:testServer', 'jshint', 'saucelabs-qunit:travisCIBrowsers']);

	//Travis CI task
	grunt.registerTask('travisci', 'Run appropriate test strategy for Travis CI', function() {
		(process.env.TRAVIS_SECURE_ENV_VARS === 'true') ? grunt.task.run('traviscisauce') : grunt.task.run('releasetest');
	});

	/* -------------
		SERVE
	------------- */
	grunt.registerTask('serve', 'serve files without compilation', ['test', 'connect:server', 'watch:contrib']);
	grunt.registerTask('servefast', 'serve files without compilation or testing (tests take time...)', ['connect:server', 'watch:contrib']);
	grunt.registerTask('servedist', 'build dist directory and serve files with compilation', ['test', 'dist', 'connect:server', 'watch:full']);


};
