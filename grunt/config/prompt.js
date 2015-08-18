module.exports = function (grunt) {
	var semver = require('semver');
	var packageVersion = require('../../package.json').version;

	return {
		// asks for what version you want to build
		'tempbranch': {
			options: {
				questions: [
					{
						config: 'release.remoteRepository',
						default : '<%= release.remoteRepository %>',
						type: 'input',
						message: function() {
							return 'What repository would like to base your local release branch from?';
						}
					},
					{
						// Assumption is made that you are releasing the code within a "release branch" currently 
						// on the upstream remote repo. This branch will be tracked locally and be used to run 
						// the build process in. It will be named release_{BUILD_VERSION}_{MMSS} (that is, it will
						// use the version specified earlier and a "mini-timestamp" of the current hour and minute).
						config: 'release.remoteBaseBranch',
						type: 'input',
						default : '<%= release.remoteBaseBranch %>',
						message: function() {
							return 'What remote branch from ' + grunt.config('release.remoteRepository') + 
							' would like to build your release based on?';
						}
					}
				]
			}
		},
		// asks for what version you want to build
		'build': {
			options: {
				questions: [
					{
						config: 'release.buildSemVerType',
						type: 'list',
						message: 'What would you like to do?',
						choices: [
							{
								value: 'patch',
								name: 'Patch:  ' + semver.inc(packageVersion, 'patch') + ' Backwards-compatible bug fixes.'
							},
							{
								value: 'minor',
								name: 'Minor:  ' + semver.inc(packageVersion, 'minor') + ' Add functionality in a backwards-compatible manner.'
							},
							{
								value: 'major',
								name: 'Major:  ' + semver.inc(packageVersion, 'major') + ' Incompatible API changes.'
							},
							{
								value: 'custom',
								name: 'Custom: ?.?.? Specify version...'
							}
						]
					},
					{
						// if custom bump is used with a specific version, see dorelease task
						config: 'release.buildSemVerType',
						type: 'input',
						message: 'What specific version would you like',
						when: function (answers) {
							return answers['release.buildSemVerType'] === 'custom';
						},
						validate: function (value) {
							var valid = semver.valid(value);
							return valid || 'Must be a valid semver, such as 1.2.3-rc1. See http://semver.org/ for more details.';
						}
					}
				]
			}
		},
		'commit': {
			options: {
				questions: [
					{
						config: 'release.commit',
						type: 'confirm',
						message: 'Please review your files. Would you like to commit?'
					}
				],
				then: function (answers, done) {
					if (answers['release.commit'] === true) {
						grunt.task.run(['shell:commit']);
					}
					return false;
				}
			}
		},
		'tag': {
			options: {
				questions: [
					{
						config: 'release.tag',
						type: 'confirm',
						message: 'Would you like to tag as ' + packageVersion + '?'
					}
				],
				then: function (answers, done) {
					if (answers['release.tag'] === true) {
						grunt.task.run(['shell:tag']);
					}
					return false;
				}
			}
		},
		'pushLocalBranchToUpstream': {
			options: {
				questions: [
					{
						config: 'release.remoteDestinationBranch',
						type: 'input',
						message: function() {
							return 'What upstream branch would you like to push ' + grunt.config('release.localBranch') + 
								' to (probably ' + grunt.config('release.remoteDestinationBranch') + ')? (leave blank to skip)';
						}
					}
				],
				then: function (answers, done) {
					if (answers['release.remoteDestinationBranch'] !== '' && answers['release.remoteDestinationBranch'] !== 'n' ) {
						grunt.task.run(['shell:pushLocalBranchToUpstream']);
					}
					return false;
				}
			}
		},
		'pushTagToUpstream': {
			options: {
				questions: [
					{
						config: 'release.upstreamTag',
						type: 'confirm',
						message: 'Would you like to push tag ' + packageVersion + ' to upstream?'
					}
				],
				then: function (answers, done) {
					if (answers['release.upstreamTag'] === true) {
						grunt.task.run(['shell:pushTagToUpstream']);
					}
					return false;
				}
			}
		},
		'uploadToCDN': {
			options: {
				questions: [
					{
						config: 'release.uploadToCDN',
						type: 'confirm',
						message: 'Would you like to upload the `dist folder to fuelcdn.com?'
					}
				],
				then: function (answers, done) {
					if (answers['release.uploadToCDN'] === true) {
						grunt.task.run(['shell:uploadToCDN']);
					}
					return false;
				}
			}
		},
		'pushLocalBranchToUpstreamMaster': {
			options: {
				questions: [
					{
						config: 'release.pushToUpstreamMaster',
						type: 'confirm',
						message: 'Would you like to push your local release branch to upstream\'s master branch?'
					}
				],
				then: function (answers, done) {
					if (answers['release.pushToUpstreamMaster'] === true) {
						grunt.task.run(['shell:pushLocalBranchToUpstreamMaster']);
					}
					return false;
				}
			}
		},
		'deleteLocalReleaseBranch': {
			options: {
				questions: [
					{
						config: 'release.deleteLocalReleaseBranch',
						type: 'confirm',
						message: function() {
							return 'Would you like to delete your local release branch' + '?';
						}
					}
				],
				then: function (answers, done) {
					if (answers['release.deleteLocalReleaseBranch'] === true) {
						grunt.task.run(['shell:deleteLocalReleaseBranch']);
					}
					return false;
				}
			}
		}
	}
}