/*global module:false*/
var config = require('./config');
var distDir = config.dist;
var srcDir = config.src;

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-recess');

	// Project configuration.
	var gruntConfig = {
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		min: {
			all: {
				src: ['<banner:meta.banner>', distDir+'/all.js'],
				dest: distDir+'/all.min.js'
			},
			loader: {
				src: ['<banner:meta.banner>', distDir+'/loader.js'],
				dest: distDir+'/loader.min.js'
			}
		},
		qunit: {
			tests: ['test/**/*.html']
		},
		lint: {
			files: ['grunt.js', srcDir+'/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: ['grunt.js', 'lib/**', srcDir+'/**', 'test/**'],
			tasks: 'lint qunit recess'
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
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true,
				define: true,
				require: true
			}
		},
		uglify: {},
		requirejs: {
			combine: {
				options: {
					appDir: srcDir,
					baseUrl: '.',
					dir: distDir,
					optimize: 'none',
					optimizeCss: 'none',
					paths: {
						almond: '../lib/almond',
						bootstrap: '../lib/bootstrap/js',
						jquery: '../lib/jquery',
						fuelux: '../'+distDir
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
		},
		recess: {
			compile: {
				src: [srcDir+'/less/fuelux.less'],
				dest: distDir+'/css/fuelux.css',
				options: {
					compile: true
				}
			},
			compile_responsive: {
				src: [srcDir+'/less/fuelux-responsive.less'],
				dest: distDir+'/css/fuelux-responsive.css',
				options: {
					compile: true
				}
			},
			compress: {
				src: [srcDir+'/less/fuelux.less'],
				dest: distDir+'/css/fuelux.min.css',
				options: {
					compile: true,
					compress: true
				}
			},
			compress_responsive: {
				src: [srcDir+'/less/fuelux-responsive.less'],
				dest: distDir+'/css/fuelux-responsive.min.css',
				options: {
					compile: true,
					compress: true
				}
			}
		},
		clean: {
			dist: [distDir+'/build.txt', 'dist/fuelux.zip'],
			zipsrc: [distDir+'/fuelux']
		},
		copy: {
			images: {
				options: {
					basePath: 'lib/bootstrap/img'
				},
				files: {}
			},
			zipsrc: {
				options: {
					basePath: distDir
				},
				files: {}
			}
		},
		compress: {
			zip: {
				files: {},
				options: {
					mode: 'zip',
					basePath: distDir+'/'
				}
			}
		}
	};
	gruntConfig.copy.images.files[distDir+'/img'] = 'lib/bootstrap/img/**';
	gruntConfig.copy.zipsrc.files[distDir+'/fuelux'] = distDir+'/**';
	gruntConfig.compress.zip.files[distDir+'/fuelux.zip'] = distDir+'/fuelux/**';

	grunt.initConfig(gruntConfig);

	// Default task.
	grunt.registerTask('default', 'lint qunit requirejs recess copy:images clean:dist min copy:zipsrc compress clean:zipsrc');
	grunt.registerTask('devserver', 'lint qunit recess server watch'); // development server

};
