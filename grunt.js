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
		concat: {
			dist: {
				src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
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
			tasks: 'lint recess qunit'
		},
		jshint: {
			options: {
				curly: true,
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
						bootstrap: '../lib/bootstrap/js',
						jquery: '../lib/jquery'
					},
					modules: [
						{
							name: 'fuelux',
							exclude: ['jquery']
						}
					]
				}
			}
		},
		recess: {
			compile: {
				src: ['src/css/less/fuelux.less'],
				dest: 'src/css/fuelux.css',
				options: {
					compile: true
				}
			},
			compile_responsive: {
				src: ['src/css/less/fuelux-responsive.less'],
				dest: 'src/css/fuelux-responsive.css',
				options: {
					compile: true
				}
			},
			compress: {
				src: ['src/css/less/fuelux.less'],
				dest: 'src/css/fuelux.min.css',
				options: {
					compile: true,
					compress: true
				}
			},
			compress_responsive: {
				src: ['src/css/less/fuelux-responsive.less'],
				dest: 'src/css/fuelux-responsive.min.css',
				options: {
					compile: true,
					compress: true
				}
			}
		},
		clean: {
			dist: ['dist/build.txt', 'dist/css/less', 'dist/fuelux.zip']
		},
		copy: {
			images: {
				options: {
					basePath: 'lib/bootstrap/img'
				},
				files: {
					'dist/img': 'lib/bootstrap/img/**'
				}
			}
		},
		compress: {
			zip: {
				files: {
					'dist/fuelux.zip': 'dist/**'
				},
				options: {
					mode: 'zip',
					basePath: 'dist'
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint recess qunit requirejs copy clean min compress');

};
