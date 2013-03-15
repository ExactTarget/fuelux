module.exports = function(grunt) {
	var _browsers = [{
		browserName: 'firefox'
	}, {
		browserName: 'chrome',
		platform: 'linux'
	}, {
		browserName: 'firefox',
		platform: 'Windows 2003',
		version: '12'
	}, {
		browserName: 'firefox',
		platform: 'Windows 2003',
		version: '13'
	}, {
		browserName: 'firefox',
		platform: 'Windows 2003',
		version: '14'
	}, {
		browserName: 'firefox',
		platform: 'Windows 2003',
		version: '15'
	}, {
		browserName: 'internet explorer',
		platform: 'Windows 2012',
		version: '10'
	}, {
		browserName: 'opera',
		version: '11'
	}, {
		browserName: 'opera',
		version: '12'
	}];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				// Restrict
				noarg: true,
				noempty: true,
				latedef: true,
				undef: true,
				unused: true,
				strict: false,
				trailing: true,
				// Lax
				// Environment
				node: true
			},
			files: ['Gruntfile.js', 'tasks/**/*.js']
		},
		connect: {
			server: {
				options: {
					base: 'test',
					port: 9999
				}
			}
		},

		'saucelabs-qunit': {
			all: {
				//username: 'parashu',
				//key: '',
				urls: ['http://127.0.0.1:9999/qunit/lists-plugin.html', 'http://127.0.0.1:9999/qunit/twitter-plugin.html'],
				tunnelTimeout: 5,
				build: process.env.TRAVIS_JOB_ID,
				concurrency: 3,
				browsers: _browsers
			}
		},
		'saucelabs-jasmine': {
			all: {
				//username: 'parashu',
				//key: '',
				urls: ['http://127.0.0.1:9999/jasmine/SpecRunner.html', 'http://127.0.0.1:9999/jasmine/SpecRunnerDos.html'],
				tunnelTimeout: 5,
				build: process.env.TRAVIS_JOB_ID,
				concurrency: 3,
				browsers: _browsers
			}
		},
		publish: {
			npm: {
				username: process.env.NPM_USERNAME,
				password: process.env.NPM_PASSWORD,
				email: process.env.NPM_EMAIL
			}
		}
	});

	grunt.registerMultiTask('publish', 'Publish the latest version of this plugin', function() {
		var done = this.async(),
			me = this,
			npm = require('npm');
		npm.load({}, function() {
			npm.registry.adduser(me.data.username, me.data.password, me.data.email, function(err) {
				if (err) {
					console.log(err);
					done(false);
				} else {
					npm.config.set("email", me.data.email, "user");
					npm.commands.publish([], function(err) {
						console.log(err || "Published to registry");
						done(!err);
					});
				}
			});
		});
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['connect', 'saucelabs-qunit', 'saucelabs-jasmine', 'publish']);
	grunt.registerTask('default', ['jshint', 'test', 'publish']);
};
