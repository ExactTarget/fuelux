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
			files: '<config:lint.files>',
			tasks: 'lint qunit'
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
						bootstrap: '../lib/bootstrap',
						jquery: '../lib/jquery'
						
					},
					shim: {
						'bootstrap/js/bootstrap-transition': ['jquery'],
						'bootstrap/js/bootstrap-alert': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-button': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-carousel': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-collapse': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-dropdown': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-modal': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-popover': ['bootstrap/js/bootstrap-transition', 'bootstrap/js/bootstrap-tooltip'],
						'bootstrap/js/bootstrap-scrollspy': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-tab': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-tooltip': ['bootstrap/js/bootstrap-transition'],
						'bootstrap/js/bootstrap-typeahead': ['bootstrap/js/bootstrap-transition']
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
			dist: ['dist/build.txt', 'dist/css/less']
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
		}
	});

	// Default task.
	grunt.registerTask('default', 'lint less qunit requirejs copy:images clean min');

};
