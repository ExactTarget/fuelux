/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib');

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
			tasks: 'lint less qunit'
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
		less: {
			compile: {
				options: {
					paths: ['lib/bootstrap/less']
				},
				files: {
					'src/css/fuelux.css': 'src/css/less/fuelux.less',
					'src/css/fuelux-responsive.css': 'src/css/less/fuelux-responsive.less'
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
	grunt.registerTask('default', 'lint less qunit requirejs copy:images clean min compress');

};
