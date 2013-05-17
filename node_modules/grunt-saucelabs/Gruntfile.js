module.exports = function(grunt) {
	var browsers = [{
		browserName: 'firefox',
		version: '19',
		platform: 'XP'
	}, {
		browserName: 'chrome',
		platform: 'XP'
	}, {
		browserName: 'chrome',
		platform: 'linux'
	}, {
		browserName: 'internet explorer',
		platform: 'WIN8',
		version: '10'
	}, {
		browserName: 'internet explorer',
		platform: 'VISTA',
		version: '9'
	}, {
		browserName: 'internet explorer',
		platform: 'XP',
		version: '8'
	}, {
		browserName: 'opera',
		platform: 'Windows 2008',
		version: '12'
	}];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: __dirname + '/.jshintrc'
			},
			files: ['bin/grunt-saucelabs-qunit',
				'tasks/**/*.js',
				'test/qunit/grunt-saucelabs-inject.js',
				'Gruntfile.js']
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
				//username: '',
				//key: '',
				options: {
					urls: ['http://127.0.0.1:9999/qunit/index.html', 'http://127.0.0.1:9999/qunit/logs.html'],
					tunnelTimeout: 5,
					build: process.env.TRAVIS_JOB_ID,
					concurrency: 3,
					browsers: browsers
				}
			}
		},
		'saucelabs-jasmine': {
			all: {
				//username: 'parashu',
				//key: '',
				options: {
					urls: ['http://127.0.0.1:9999/jasmine/SpecRunner.html', 'http://127.0.0.1:9999/jasmine/SpecRunnerDos.html'],
					tunnelTimeout: 5,
					build: process.env.TRAVIS_JOB_ID,
					concurrency: 3,
					browsers: browsers
				}
			}
		},
		publish: {
			npm: {
				username: process.env.NPM_USERNAME,
				password: process.env.NPM_PASSWORD,
				email: process.env.NPM_EMAIL
			}
		},
		watch: {}
	});

	grunt.registerMultiTask('publish', 'Publish the latest version of this plugin', function() {
		var done = this.async(),
			me = this,
			npm = require('npm');
		npm.load({}, function() {
			npm.registry.adduser(me.data.username, me.data.password, me.data.email, function(err) {
				if (err) {
					console.log(err);
					done(true);
				} else {
					npm.config.set("email", me.data.email, "user");
					npm.commands.publish([], function(err) {
						console.log(err || "Published to registry");
						done(true);
					});
				}
			});
		});
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('test', ['connect', 'saucelabs-qunit', 'saucelabs-jasmine']);
	grunt.registerTask('default', ['jshint', 'test', 'publish']);
};