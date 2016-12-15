module.exports = function (grunt) {
	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	// Try ENV variables (export SAUCE_ACCESS_KEY=XXXX), if key doesn't exist, try key file
	var sauceKey = process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : grunt.file.exists('SAUCE_API_KEY.yml') ? grunt.file.readYAML('SAUCE_API_KEY.yml').key : undefined;

	// https://github.com/axemclion/grunt-saucelabs/issues/215
	var getSaucekey = function getSaucekey () {
		return sauceKey;
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
				urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true&hidepassed=true'],
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
