module.exports = function (grunt) {
	var semver = require('semver');
	function getPackageVersion () {
		return grunt.file.readJSON('./package.json').version;
	}

	return {
		// asks for what version you want to build
		'tempbranch': {
			options: {
				questions: [
					{
						config: 'release.remoteRepository',
						default: '<%= release.remoteRepository %>',
						type: 'input',
						message: function () {
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
						default: '<%= release.remoteBaseBranch %>',
						message: function () {
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
								name: 'Patch:  ' + semver.inc(getPackageVersion(), 'patch') + ' Backwards-compatible bug fixes.'
							},
							{
								value: 'minor',
								name: 'Minor:  ' + semver.inc(getPackageVersion(), 'minor') + ' Add functionality in a backwards-compatible manner.'
							},
							{
								value: 'major',
								name: 'Major:  ' + semver.inc(getPackageVersion(), 'major') + ' Incompatible API changes.'
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
						message: 'Please review your files.\n Check dist files visually to make sure comment banners have correct release version listed, and that *.min files are minified as expected.\n Also confirm that version number is updated in package.json.\n\n Would you like to commit?'
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
						message: 'Would you like to tag?'
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
						message: function () {
							return 'What upstream branch would you like to push ' + grunt.config('release.localBranch') +
									' to (probably ' + grunt.config('release.remoteDestinationBranch') + ')? (leave blank to skip)';
						}
					}
				],
				then: function (answers, done) {
					if (answers['release.remoteDestinationBranch'] !== '' && answers['release.remoteDestinationBranch'] !== 'n') {
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
						message: 'Would you like to push tag to upstream?'
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
						message: 'Would you like to upload the `dist` folder to fuelcdn.com?'
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
						message: "Would you like to push your local release branch to upstream's master branch?"
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
						message: function () {
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
		},
		'publishToNPM': {
			options: {
				questions: [
					{
						config: 'release.publishToNPM',
						type: 'confirm',
						message: 'Would you like to publish to NPM?'
					}
				],
				then: function (answers, done) {
					if (answers['release.publishToNPM'] === true) {
						grunt.task.run(['shell:publishToNPM']);
					}
					return false;
				}
			}
		},
		'logoffvpn': {
			options: {
				questions: [
					{
						config: 'release.logoffvpn',
						type: 'confirm',
						message: 'Have you logged off of VPN?'
					}
				],
				then: function (answers, done) {
					if (answers['release.logoffvpn'] === false) {
						grunt.fail.fatal('Please log off of VPN and try again', 1);
					}
				}
			}
		},
		'rannpminstall': {
			options: {
				questions: [
					{
						config: 'release.rannpminstall',
						type: 'confirm',
						message: 'Have you run `npm install && bower install`?'
					}
				],
				then: function (answers, done) {
					if (answers['release.rannpminstall'] === false) {
						grunt.fail.fatal('Please run `npm install && bower install`', 1);
					}
				}
			}
		},
		'rangrunttest': {
			options: {
				questions: [
					{
						config: 'release.rangrunttest',
						type: 'confirm',
						message: 'Have you run grunt test, and have all tests passed?'
					}
				],
				then: function (answers, done) {
					if (answers['release.rangrunttest'] === false) {
						grunt.fail.fatal('Please run `grunt test`, and make sure all tests pass', 1);
					}
				}
			}
		},
		'ransauce': {
			options: {
				questions: [
					{
						config: 'release.ransauce',
						type: 'confirm',
						message: 'Have you run `grunt saucelabs`, and have all tests passed?'
					}
				],
				then: function (answers, done) {
					if (answers['release.ransauce'] === false) {
						grunt.fail.fatal('Please run `grunt saucelabs`, and make sure all tests pass', 1);
					}
				}
			}
		},
		'createmilestone': {
			options: {
				questions: [
					{
						config: 'release.createmilestone',
						type: 'confirm',
						message: 'Have you created a milestone in GitHub for the next version?'
					}
				],
				then: function (answers, done) {
					if (answers['release.createmilestone'] === false) {
						grunt.fail.fatal('Please follow the wiki https://github.com/ExactTarget/fuelux/wiki/How-to-release-a-new-version#how-to-release', 1);
					}
				}
			}
		},
		'bumpmilestones': {
			options: {
				questions: [
					{
						config: 'release.bumpmilestones',
						type: 'confirm',
						message: 'Have you bumped all open tickets to the next version?'
					}
				],
				then: function (answers, done) {
					if (answers['release.bumpmilestones'] === false) {
						grunt.fail.fatal('Please follow the wiki https://github.com/ExactTarget/fuelux/wiki/How-to-release-a-new-version#how-to-release', 1);
					}
				}
			}
		},
		'closemilestone': {
			options: {
				questions: [
					{
						config: 'release.closemilestone',
						type: 'confirm',
						message: 'Have you marked the current release milestone as closed?'
					}
				],
				then: function (answers, done) {
					if (answers['release.closemilestone'] === false) {
						grunt.fail.fatal('Please follow the wiki https://github.com/ExactTarget/fuelux/wiki/How-to-release-a-new-version#how-to-release', 1);
					}
				}
			}
		},
		'startrelease': {
			options: {
				questions: [
					{
						config: 'release.startrelease',
						type: 'confirm',
						message: 'Would you like to start the release?'
					}
				],
				then: function (answers, done) {
					if (answers['release.startrelease'] === false) {
						grunt.fail.fatal('Please follow the wiki https://github.com/ExactTarget/fuelux/wiki/How-to-release-a-new-version#how-to-release', 1);
					}
				}
			}
		},
		'generatelogs': {
			options: {
				questions: [
					{
						config: 'release.generatelogs',
						type: 'confirm',
						message: 'Would you like to generate change logs?'
					}
				],
				then: function (answers, done) {
					if (answers['release.generatelogs'] === true) {
						grunt.task.run(['shell:notes']);
					}
					return false;
				}
			}
		},
		'generatelogsmanually': {
			options: {
				questions: [
					{
						config: 'release.generatelogsmanuallystart',
						type: 'input',
						message: 'Which releases would you like to start diff for changelogs from? (current: ' + getPackageVersion() + ')'
					},
					{
						config: 'release.generatelogsmanuallyend',
						type: 'input',
						message: 'Which releases would you like to end diff for changelogs from? (current: ' + getPackageVersion() + ')'
					},
					{
						config: 'release.generatelogsmanually',
						type: 'confirm',
						message: 'Would you like to generate change logs now?'
					}
				],
				then: function (answers, done) {
					grunt.config('release.generatelogsmanuallystart', answers['release.generatelogsmanuallystart']);
					grunt.config('release.generatelogsmanuallystart', answers['release.generatelogsmanuallystart']);
					if (answers['release.generatelogsmanually'] === true && grunt.config('release.generatelogsmanuallystart') !== '' && grunt.config('release.generatelogsmanuallyend') !== '') {
						grunt.log.writeln('About to generate changelogs between ' + grunt.config('release.generatelogsmanuallystart') + ' and ' + grunt.config('release.generatelogsmanuallyend') + '.');
						grunt.log.writeln('There will be no more output for possibly several minutes.');
						grunt.log.writeln('Thank you for your patience, have an ohana mahalo kilikilikiwana day.');
						grunt.log.writeln('//TODO: Insert tiki dancing nyan cat here. --jschmidt');
						grunt.task.run(['shell:manualnotes']);
					} else {
						grunt.log.writeln('You have failed us all. You are no longer ohana.');
					}
					return false;
				}
			}
		}
	};
};

