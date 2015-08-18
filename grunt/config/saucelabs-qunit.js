module.exports = function (grunt) {
	var packageVersion = require('../../package.json').version;
	
	return {
		trickyBrowsers: {
			options: {
				username: '<%= sauceUser %>',
				key: '<%= sauceKey %>',
				tunnelTimeout: 45,
				testInterval: 3000,
				tags: ['<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>' + '@local'],
				browsers: grunt.file.readYAML('sauce_browsers_tricky.yml'),
				build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
				testname: process.env.TRAVIS_JOB_ID || Math.floor((new Date()).getTime() / 1000 - 1230768000).toString(),
				urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true']
			}
		},
		defaultBrowsers: {
			options: {
				username: '<%= sauceUser %>',
				key: '<%= sauceKey %>',
				tunnelTimeout: 45,
				testInterval: 3000,
				tags: [packageVersion, '<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>@local'],
				browsers: grunt.file.readYAML('sauce_browsers.yml'),
				build: process.env.TRAVIS_BUILD_NUMBER || packageVersion,
				testname: process.env.TRAVIS_JOB_ID || packageVersion + '-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
				urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true'],
				maxPollRetries: 4,
				throttled: 3,
				maxRetries: 3
			}
		},
		all: {
			options: {
				username: '<%= sauceUser %>',
				key: '<%= sauceKey %>',
				browsers: grunt.file.readYAML('sauce_browsers.yml'),
				build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
				testname: 'grunt-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
				urls: '<%= allTestUrls %>'
			}
		}
	}

};