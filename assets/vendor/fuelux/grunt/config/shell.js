module.exports = function (grunt) {
	var semver = require('semver');
	var originalVersion = grunt.file.readJSON('./package.json').version;

	function getPackage () {
		return grunt.file.readJSON('./package.json');
	}

	function getGithubToken () {
		return grunt.file.exists('./GITHUB_TOKEN.json') ? grunt.file.readJSON('./GITHUB_TOKEN.json').token : '';
	}

	return {
		// Install with: gem install github_changelog_generator
		// 'github_changelog_generator --no-author --between-tags 3.11.4,3.11.5 --compare-link -t '
		notes: {
			command: 'github_changelog_generator --no-author --between-tags ' + originalVersion + ',' + getPackage().version + ' --compare-link -t ' + getGithubToken()
		},
		manualnotes: {
			command: 'github_changelog_generator --no-author --between-tags ' + grunt.config('release.generatelogsmanuallystart') + ',' + grunt.config('release.generatelogsmanuallyend') + ' --compare-link -t ' + getGithubToken()
		},
		checkoutRemoteReleaseBranch: {
			// this makes a local branch based on the prior prompt, such as release_{TIMESTAMP}
			// then update tags from remote in order to prevent duplicate tags
			command: function () {
				grunt.config('release.localBranch', 'release_' + new Date().getTime());
				var command = [
					'git fetch --tags ' + grunt.config('release.remoteRepository'),
					'git fetch ' + grunt.config('release.remoteRepository'),
					'git checkout -b ' + grunt.config('release.localBranch') + ' ' +
						grunt.config('release.remoteRepository') + '/' + grunt.config('release.remoteBaseBranch')
				].join(' && ');
				grunt.log.write('Checking out new local branch based on ' + grunt.config('release.remoteBaseBranch') + ': ' + command);
				return command;
			}
		},
		addReleaseFiles: {
			command: function () {
				var command = 'git add ' + grunt.config('release.files').join(' ');
				grunt.log.write('Staging: ' + command);
				return command;
			}
		},
		commit: {
			command: function () {
				var command = 'git commit -m "release ' + getPackage().version + '"';
				grunt.log.write('Committing: ' + command);
				return command;
			}
		},
		tag: {
			command: function () {
				var command = 'git tag -a "' + getPackage().version + '" -m "' + getPackage().version + '"';
				grunt.log.write('Tagging: ' + command);
				return command;
			}
		},
		pushLocalBranchToUpstream: {
			command: function () {
				var command = 'git push ' + grunt.config('release.remoteRepository') + ' ' +
						grunt.config('release.localBranch') + ':' + grunt.config('release.remoteDestinationBranch');
				grunt.log.write('Pushing: ' + command);
				return command;
			}
		},
		pushTagToUpstream: {
			command: function () {
				var command = 'git push ' + grunt.config('release.remoteRepository') + ' ' + getPackage().version;
				grunt.log.write('Publishing tag: ' + command);
				return command;
			}
		},
		pushLocalBranchToUpstreamMaster: {
			command: function () {
				var command = 'git push ' + grunt.config('release.remoteRepository') + ' ' +
						grunt.config('release.localBranch') + ':master';
				grunt.log.write(command);
				return command;
			}
		},
		uploadToCDN: {
			command: function () {
				function createUploadCommand (version) {
					return ['mv dist ' + version,
						'scp -i ~/.ssh/fuelcdn -r "' + version + '"/ ' +
							'<%= cdnLoginFile.user %>' + '@' + '<%= cdnLoginFile.server %>' + ':' + '<%= cdnLoginFile.folder %>',
						'mv "' + version + '" dist',
						'echo "Done uploading files."'].join(' && ');
				}
				var command = [
					getPackage().version,
					semver.major(getPackage().version) + '.' + semver.minor(getPackage().version),
					semver.major(getPackage().version)
				].map(createUploadCommand).join(' && ');
				grunt.log.write('Uploading: ' + command);
				grunt.log.writeln('');
				return command;
			}
		},
		publishToNPM: {
			command: function () {
				var command = 'npm publish';
				grunt.log.write(command);
				return command;
			}
		}
	};
};

