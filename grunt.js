/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-recess');

	// Project configuration.
	grunt.initConfig({
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
				src: ['<banner:meta.banner>', 'dist/all.js'],
				dest: 'dist/all.min.js'
			},
			loader: {
				src: ['<banner:meta.banner>', 'dist/loader.js'],
				dest: 'dist/loader.min.js'
			}
		},
		qunit: {
			tests: ['test/**/*.html']
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
		},
		watch: {
			files: ['grunt.js', 'lib/**', 'src/**', 'test/**'],
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
					appDir: 'src',
					baseUrl: '.',
					dir: 'dist',
					optimize: 'none',
					optimizeCss: 'none',
					paths: {
						almond: '../lib/almond',
						bootstrap: '../lib/bootstrap/js',
						jquery: '../lib/jquery',
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
							insertRequire: ['fuelux/loader'],
							exclude: ['jquery']
						}
					]
				}
			}
		},
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
				options: {
					basePath: 'lib/bootstrap/img'
				},
				files: {
					'dist/img': 'lib/bootstrap/img/**'
				}
			},
			zipsrc: {
				options: {
					basePath: 'dist'
				},
				files: {
					'dist/fuelux': 'dist/**'
				}
			}
		},
		compress: {
			zip: {
				files: {
					'dist/fuelux.zip': 'dist/fuelux/**'
				},
				options: {
					mode: 'zip',
					basePath: 'dist/'
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint qunit requirejs recess copy:images clean:dist min copy:zipsrc compress clean:zipsrc');
	grunt.registerTask('devserver', 'lint qunit recess server watch'); // development server

};
