/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata
		banner: '/*!\n' +
			' * FuelUX v<%= pkg.version %> \n' +
			' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
			' */\n',
		pkg: grunt.file.readJSON('package.json'),
		// Try ENV variables (export SAUCE_ACCESS_KEY=XXXX), if key doesn't exist, try key file 
		sauceLoginFile: grunt.file.exists('SAUCE_API_KEY.yml') ? grunt.file.readYAML('SAUCE_API_KEY.yml') : undefined,
		sauceKey: process.env['SAUCE_ACCESS_KEY'] ? process.env['SAUCE_ACCESS_KEY'] : '<%= sauceLoginFile.key %>',
		testUrls: ['2.1.0', '1.9.1', 'browserGlobals'].map(function (ver) {
			if(ver==='browserGlobals'){
				return 'http://localhost:<%= connect.server.options.port %>/test/fuelux-browser-globals.html';
			}
			return 'http://localhost:<%= connect.server.options.port %>/test/fuelux.html?jquery=' + ver;
		}),

		//Tasks configuration
		clean: {
			dist: ['dist/build.txt', 'dist/fuelux.zip'],
			zipsrc: ['dist/fuelux']
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
						'js/util.js',
						'js/checkbox.js',
						'js/combobox.js',
						'js/datagrid.js', /* Remove */
						'js/datepicker.js',
						'js/loader.js',
						'js/pillbox.js',
						'js/radio.js',
						'js/search.js',
						'js/select.js',
						'js/spinbox.js',
						'js/tree.js',
						'js/wizard.js',
						'js/intelligent-dropdown.js',
						'js/scheduler.js'
					]
				},
				options: {
					banner: '<%= banner %>' + '\n\n' +
						'// For more information on UMD visit: https://github.com/umdjs/umd/' + '\n' +
						'(function (factory) {' + '\n' +
							'\tif (typeof define === \'function\' && define.amd) {' + '\n' +
								'\t\tdefine([\'jquery\'], factory);' + '\n' +
							'\t} else {' + '\n' +
								'\t\tfactory(jQuery);' + '\n' +
							'\t}' + '\n' +
						'}(function (jQuery) {\n\n',
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
					port: 8000
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
				unused: false	// changed
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
					urls: '<%= testUrls %>'
				}
			},
			simple: ['test/**/*.html']
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
			all: {
				options: {
					username: 'fuelux',
					key: '<%= sauceKey %>',
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
					testname: 'grunt-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
					urls: '<%= testUrls %>'
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
		watch: {
			files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'lib/**', 'test/**', 'index.html', 'dev.html'],
			options: { livereload: true },
			tasks: ['devtest', 'quickcss', 'copy:fonts', 'concat', 'jshint', 'jsbeautifier']
		}
	});

	// Look ma! Load all grunt plugins in one line from package.json
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	//The default task
	grunt.registerTask('default', ['releasetest', 'fullcss', 'copy:fonts', 'clean:dist', 'concat', 'uglify', 'jsbeautifier', 'copy:zipsrc', 'compress', 'clean:zipsrc']);

	//Testing tasks
	grunt.registerTask('devtest', ['jshint', 'qunit:simple']);
	grunt.registerTask('releasetest', ['connect', 'jshint', 'qunit:full']);
	grunt.registerTask('saucelabs', ['connect', 'jshint', 'saucelabs-qunit']);

	//Style tasks
	grunt.registerTask('quickcss', ['less', 'usebanner']);
	grunt.registerTask('fullcss', ['quickcss']); /* Remove */

	//Serve task
	grunt.registerTask('serve', ['devtest', 'quickcss', 'copy:fonts', 'concat', 'uglify', 'jsbeautifier', 'connect', 'watch']);

	//Travis CI task
	grunt.registerTask('travisci', 'Run appropriate test strategy for Travis CI', function () {
		(process.env['TRAVIS_SECURE_ENV_VARS'] === 'true') ? grunt.task.run('saucelabs') : grunt.task.run('releasetest');
	});

};
