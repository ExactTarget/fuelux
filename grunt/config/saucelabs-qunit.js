module.exports = function (grunt) {
	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	// https://github.com/axemclion/grunt-saucelabs/issues/215
	var getSaucekey = function getSaucekey () {
		return grunt.file.readYAML('SAUCE_API_KEY.yml').key;
	};

	return {
		defaultBrowsers: {
			options: {
				username: '<%= sauceUser %>',
				key: getSaucekey,
				tunnelTimeout: 45,
				testInterval: 3000,
				tags: [getPackage().version, '<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>@local'],
				browsers: grunt.file.readYAML('sauce_browsers.yml'),
				build: process.env.TRAVIS_BUILD_NUMBER || getPackage().version,
				testname: process.env.TRAVIS_JOB_ID || getPackage().version + '-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
				urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true&hidepassed'],
				maxPollRetries: 4,
				throttled: 3,
				maxRetries: 3
			}
		},
		all: {
			options: {
				username: '<%= sauceUser %>',
				key: getSaucekey,
				browsers: grunt.file.readYAML('sauce_browsers.yml'),
				build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
				testname: 'grunt-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
				urls: '<%= allTestUrls %>'
			}
		}
	};
};
