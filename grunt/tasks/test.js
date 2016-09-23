module.exports = function test (grunt) {
	// to be run prior to submitting a PR
	grunt.registerTask('test', 'run jshint, qunit source w/ coverage, and validate HTML',
		['jshint', 'connect:testServer', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'htmllint']);

	// If qunit:source is working but qunit:full is breaking, check to see if the dist broke the code. This would be especially useful if we start mangling our code, but, is 99.99% unlikely right now
	grunt.registerTask('validate-dist', 'run qunit:source, dist, and then qunit:full',
		['connect:testServer', 'qunit:source', 'dist', 'browserify:commonjs', 'qunit:dist']);

	// multiple jQuery versions, then run SauceLabs VMs
	grunt.registerTask('releasetest', 'run jshint, build dist, all source tests, validation, and qunit on SauceLabs',
		['test', 'dist', 'browserify:commonjs', 'qunit:dist', 'saucelabs-qunit:defaultBrowsers']);

	// Due to TravisCI security concerns, Saucelabs can not be run for PRs from forks. Therefore, it can not become part of our PR process.
	// https://docs.travis-ci.com/user/pull-requests/#Pull-Requests-and-Security-Restrictions
	// can be run locally instead. Requires the Fuel UX Saucelabs API key file.
	grunt.registerTask('saucelabs', 'run jshint, and qunit on saucelabs',
		['connect:testServer', 'jshint', 'saucelabs-qunit:defaultBrowsers']);

	grunt.registerTask('travisci', 'Tests to run when in Travis CI environment',
		['test', 'dist', 'browserify:commonjs', 'qunit:dist']);

	// if you've already accidentally added your files for commit, this will at least unstage them. If you haven't, this will wipe them out.
	grunt.registerTask('resetdist', 'resets changes to dist to keep them from being checked in', function resetdist () {
		// default resetdist to true... basically.
		if (typeof grunt.option('resetdist') === 'undefined' || grunt.option('resetdist')) {
			var exec = require('child_process').exec;
			exec('git reset HEAD dist/*');
			exec('git checkout -- dist/*');
		}
	});
};
