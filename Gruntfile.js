/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-saucelabs');
	grunt.loadNpmTasks('grunt-jsbeautifier');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
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
						source = source.replace(/\/\/ -- BEGIN UMD WRAPPER AFTERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') +
							'\n})(jQuery);\n\n';
						return source;
						}
					},
				files: {
					'dist/fuelux.js': ['src/*.js', '!src/all.js']
				}
			}
		},
		jsbeautifier: {
			files: ['dist/fuelux.js'],
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
		uglify: {
			fuelux: {
				files: {
					'dist/fuelux.min.js': ['dist/fuelux.js']
				}
			}
		},
		testUrls: ['1.9.1', '1.8.3', '1.7.2'].map(function (ver) {
			return 'http://localhost:<%= connect.server.options.port %>/test/fuelux.html?jquery=' + ver;
		}),
		qunit: {
			simple: ['test/**/*.html'],
			full: {
				options: {
					urls: '<%= testUrls %>'
				}
			}
		},
		'saucelabs-qunit': {
			all: {
				options: {
					urls: '<%= testUrls %>',
					concurrency: '3',
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
					]
				}
			}
		},
		watch: {
			options: { livereload: true },
			files: ['Gruntfile.js', 'lib/**', 'src/**', 'test/**', 'index.html'],
			tasks: ['quicktest', 'quickcss', 'concat', 'jshint', 'jsbeautifier'] 
		},
		connect: {
			server: {
				options: {
					port: 8000
				}
			}
		},
		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: false, // changed
				boss: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true,
					define: true,
					require: true
				}
			},
			source: ['Gruntfile.js', 'src/**/*.js', 'dist/fuelux.js'],
			tests: {
				options: {
					undef: false,
					unused: false,
					latedef: false
				},
				files: {
					src: ['test/**/*.js']
				}
			}
		},
		/* requirejs: {
			combine: {
				options: {
					appDir: 'src',
					baseUrl: '.',
					dir: 'dist',
					optimize: 'none',
					optimizeCss: 'none',
					normalizeDirDefines: 'all',
					wrap: true,
					paths: {
						almond: '../lib/almond',
						bootstrap: '../lib/bootstrap/js',
						jquery: '../lib/jquery-1.9.1.min',
						fuelux: '../dist'
					},
					modules: [
						{
							name: 'fuelux/all',
							exclude: ['jquery']
						},
						{
							name: 'fuelux/loader',
							include: ['almond', 'fuelux/all'],
							exclude: ['jquery']
						}
					]
				}
			}
		}, */
		recess: {
			compile: {
				src: ['src/less/fuelux.less'],
				dest: 'dist/css/fuelux.css',
				options: {
					compile: true
				}
			},
			compile_responsive: {
				src: ['src/less/fuelux-responsive.less'],
				dest: 'dist/css/fuelux-responsive.css',
				options: {
					compile: true
				}
			},
			compress: {
				src: ['src/less/fuelux.less'],
				dest: 'dist/css/fuelux.min.css',
				options: {
					compile: true,
					compress: true
				}
			},
			compress_responsive: {
				src: ['src/less/fuelux-responsive.less'],
				dest: 'dist/css/fuelux-responsive.min.css',
				options: {
					compile: true,
					compress: true
				}
			}
		},
		clean: {
			dist: ['dist/build.txt', 'dist/fuelux.zip'],
			zipsrc: ['dist/fuelux']
		},
		copy: {
			images: {
				expand: true,
				cwd: 'lib/bootstrap/img/',
				src: ['**'],
				dest: 'dist/img/'
			},
			zipsrc: {
				expand: true,
				cwd: 'dist/',
				src: ['**'],
				dest: 'dist/fuelux/'
			}
		},
		compress: {
			zip: {
				options: {
					mode: 'zip',
					archive: 'dist/fuelux.zip'
				},
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: ['fuelux/**']
					}
				]
			}
		}
	});

	grunt.registerTask('quicktest', ['jshint', 'qunit:simple']);
	grunt.registerTask('fulltest', ['connect', 'jshint', 'qunit:full']);
	grunt.registerTask('saucelabs', ['connect', 'jshint', 'saucelabs-qunit']);

	grunt.registerTask('quickcss', ['recess:compile', 'recess:compile_responsive']);
	grunt.registerTask('fullcss', ['quickcss', 'recess:compress', 'recess:compress_responsive']);


	//grunt.registerTask('build', ['urequire:UMD']);

	grunt.registerTask('default', ['fulltest', 'fullcss', 'copy:images', 'clean:dist', 'concat', 'uglify', 'jsbeautifier', 'copy:zipsrc', 'compress', 'clean:zipsrc']);

	grunt.registerTask('serve', ['quicktest', 'quickcss', 'connect', 'concat', 'uglify', 'jsbeautifier', 'watch']);
	grunt.registerTask('devserver', function () {
		grunt.log.warn('The `devserver` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});
	grunt.registerTask('server', function () {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('travisci', 'Run appropriate test strategy for Travis CI', function () {
		(process.env['TRAVIS_SECURE_ENV_VARS'] === 'true') ? grunt.task.run('saucelabs') : grunt.task.run('fulltest');
	});

};
