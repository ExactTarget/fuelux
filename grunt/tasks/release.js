module.exports = function (grunt) {
	var packageVersion = require('../../package.json').version;

	/* -------------
		RELEASE
	------------- */
	grunt.registerTask('notes', 'Run a ruby gem that will request from Github unreleased pull requests', ['prompt:generatelogsmanually']);

	grunt.registerTask('updateRelease', '', function () {
		packageVersion = require('../../package.json').version;
	});

	// Maintainers: Run prior to a release. Includes SauceLabs VM tests.
	grunt.registerTask('release', 'Release a new version, push it and publish it', function () {
		// default variables for release task
		var releaseDefaults = {
			release: {
				files: ['dist', 'README.md', 'CONTRIBUTING.md', 'bower.json', 'package.json'],
				localBranch: 'release',
				remoteBaseBranch: 'master',
				remoteDestinationBranch: '3.x',
				remoteRepository: 'upstream'
			}
		};

		// add releaseDefaults
		grunt.config.merge(releaseDefaults);

		if (typeof grunt.config('sauceLoginFile') === 'undefined') {
			grunt.log.write('The file SAUCE_API_KEY.yml is needed in order to run tests in SauceLabs.'.red.bold +
					' Please contact another maintainer to obtain this file.');
		}

		if (typeof grunt.config('cdnLoginFile') === 'undefined') {
			grunt.log.write('The file FUEL_CDN.yml is needed in order to upload the release files to the CDN.'.red.bold +
					' Please contact another maintainer to obtain this file.');
		}

		// update local variable to make sure build prompt is using temp branch's package version
		grunt.task.run(
			[
				'prompt:createmilestone',
				'prompt:bumpmilestones',
				'prompt:closemilestone',
				'prompt:startrelease',
				'prompt:tempbranch',
				'shell:checkoutRemoteReleaseBranch',
				'updateRelease',
				'prompt:build',
				'dorelease'
			]
		);
	});

	grunt.registerTask('dorelease', '', function () {
		grunt.log.writeln('');

		if (!grunt.option('no-tests')) {
			grunt.task.run(['releasetest']); // If phantom timeouts happening because of long-running qunit tests, look into setting `resourceTimeout` in phantom: http://phantomjs.org/api/webpage/property/settings.html
			// Delete any screenshots that may have happened if it got this far. This isn't foolproof
			// because it relies on the phantomjs server/page timeout, which can take longer than this
			// grunt task depending on how long saucelabs takes to run...
			grunt.task.run('clean:screenshots');
		}

		grunt.config('banner', '<%= bannerRelease %>');

		// Run dist again to grab the latest version numbers. Yeah, we're running it twice... ¯\_(ツ)_/¯
		grunt.task.run(['bump-only:' + grunt.config('release.buildSemVerType'), 'replace:readme', 'replace:packageJs', 'dist',
			'shell:addReleaseFiles', 'prompt:commit', 'prompt:tag', 'prompt:pushLocalBranchToUpstream',
			'prompt:pushTagToUpstream', 'prompt:uploadToCDN', 'prompt:pushLocalBranchToUpstreamMaster', 'shell:publishToNPM', 'prompt:generatelogs']);
	});
};

