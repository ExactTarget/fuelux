/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-saucelabs');

	// Project configuration.
	grunt.initConfig({
		banner: '/*!\n' +
			' * FuelUX v<%= pkg.version %> \n' +
			' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
			' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
			' */\n',
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
						'js/datagrid.js',
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
					banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
						'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
						'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
						' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n' +
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
		pkg: grunt.file.readJSON('package.json'),
		qunit: {
			full: {
				options: {
					urls: '<%= testUrls %>'
				}
			},
			simple: ['test/**/*.html']
		},
		less: {
			compile: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>.css.map',
					sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
				}
			},
			files: {
				'dist/css/fuelux.css': 'less/fuelux.less'
			},
			compress: {
				dest: 'dist/css/fuelux.min.css',
				options: {
					compile: true,
					compress: true
				},
				src: ['less/fuelux.less']
			}
		},
		recess: {
			compile: {
				dest: 'dist/css/fuelux.css',
				options: {
					compile: true
				},
				src: ['less/fuelux.less']
			},
			compress: {
				dest: 'dist/css/fuelux.min.css',
				options: {
					compile: true,
					compress: true
				},
				src: ['less/fuelux.less']
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					browsers: [
						{ browserName: 'internet explorer', platform: 'Windows 2012', version: '10' },
						{ browserName: 'internet explorer', platform: 'Windows 2008', version: '9' },
						{ browserName: 'internet explorer', platform: 'Windows 2008', version: '8' },
						{ browserName: 'firefox', platform: 'Windows 2008', version: '19' },
						{ browserName: 'firefox', platform: 'Mac 10.6', version: '19' },
						{ browserName: 'safari', platform: 'Mac 10.8', version: '6' },
						{ browserName: 'chrome', platform: 'Windows 2008' },
						{ browserName: 'chrome', platform: 'Mac 10.8' },
						{ browserName: 'iphone', platform: 'Mac 10.8', version: '6' },
						{ browserName: 'ipad', platform: 'Mac 10.8', version: '6' }
					],
					concurrency: '3',
					urls: '<%= testUrls %>'
				}
			}
		},
		testUrls: ['BG', '1.9.1', '1.8.3', '1.7.2'].map(function (ver) {
			if(ver==='BG'){
				return 'http://localhost:<%= connect.server.options.port %>/test/fuelux-browser-globals.html';
			}
			return 'http://localhost:<%= connect.server.options.port %>/test/fuelux.html?jquery=' + ver;
		}),
		uglify: {
			fuelux: {
				files: {
					'dist/js/fuelux.min.js': ['dist/js/fuelux.js']
				}
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
			tasks: ['quicktest', 'quickcss', 'copy:fonts', 'concat', 'jshint', 'jsbeautifier']
		}
	});

	//The default task
	grunt.registerTask('default', ['fulltest', 'fullcss', 'copy:fonts', 'clean:dist', 'concat', 'uglify', 'jsbeautifier', 'copy:zipsrc', 'compress', 'clean:zipsrc']);

	//Testing tasks
	grunt.registerTask('quicktest', ['jshint', 'qunit:simple']);
	grunt.registerTask('fulltest', ['connect', 'jshint', 'qunit:full']);
	grunt.registerTask('saucelabs', ['connect', 'jshint', 'saucelabs-qunit']);

	//Style tasks
	grunt.registerTask('quickcss', ['less:compile', 'usebanner']);
	grunt.registerTask('fullcss', ['quickcss', 'less:compress']);

	//Serve task
	grunt.registerTask('serve', ['quicktest', 'quickcss', 'copy:fonts', 'concat', 'uglify', 'jsbeautifier', 'connect', 'watch']);

	//Travis CI task
	grunt.registerTask('travisci', 'Run appropriate test strategy for Travis CI', function () {
		(process.env['TRAVIS_SECURE_ENV_VARS'] === 'true') ? grunt.task.run('saucelabs') : grunt.task.run('fulltest');
	});

};
