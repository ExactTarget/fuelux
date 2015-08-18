module.exports = function (grunt) {
	var semver = require('semver');

	function getPackage() {
		return grunt.file.readJSON('./package.json');
	}

	return {
		// Compile release notes while waiting for tests to pass. Needs Ruby gem and ONLY LOOKS AT THE REMOTE NAMED ORIGIN.
		// Install with: gem install github_changelog_generator
		notes: {
			command: 'github_changelog_generator --no-author --unreleased-only --compare-link'
		},
		checkoutRemoteReleaseBranch: {
			// this makes a local branch based on the prior prompt, such as release_{TIMESTAMP}
			// then update tags from remote in order to prevent duplicate tags
			command: function() {
				grunt.config('release.localBranch', 'release_' + new Date().getTime() );
				var command = [
					'git checkout -b ' + grunt.config('release.localBranch') + ' ' + 
						grunt.config('release.remoteRepository') + '/' + grunt.config('release.remoteBaseBranch'),
						'git fetch ' + grunt.config('release.remoteRepository') + ' --tag'
				].join(' && ');
				grunt.log.write('Checking out new local branch based on ' + grunt.config('release.remoteBaseBranch') + ': ' + command);
				return command;
			}
		},
		addReleaseFiles: {
			command: function() {
				var command = 'git add ' + grunt.config('release.files').join(' ');
				grunt.log.write('Staging: ' + command);
				return command;
			}
		},
		commit: {
			command: function() {
				var command = 'git commit -m "release ' + getPackage().version + '"';
				grunt.log.write('Committing: ' + command);
				return command;
			}
		},
		tag: {
			command: function() {
				var command = 'git tag -a "' + getPackage().version + '" -m "' + getPackage().version + '"';
				grunt.log.write('Tagging: ' + command);
				return command;
			}
		},
		pushLocalBranchToUpstream: {
			command: function() {
				var command = 'git push ' + grunt.config('release.remoteRepository') + ' ' +  
						grunt.config('release.localBranch') + ':' + grunt.config('release.remoteDestinationBranch');
				grunt.log.write('Pushing: ' + command);
				return command;
			}
		},
		pushTagToUpstream: {
			command: function() {
				var command = 'git push ' + grunt.config('release.remoteRepository') + ' ' + packageVersion;
				grunt.log.write('Publishing tag: ' + command);
				return command;
			}
		},
		pushLocalBranchToUpstreamMaster: {
			command: function() {
				var command = 'git push ' + grunt.config('release.remoteRepository')  + ' ' + 
					grunt.config('release.localBranch') + ':master';
				grunt.log.write(command);
				return command;
			}
		},
		uploadToCDN: {
			command: function() {

				function createUploadCommand(version) {
					return ['mv dist ' + version,
					'scp -i ~/.ssh/fuelcdn -r "' + version + '"/ ' +
					'<%= cdnLoginFile.user %>' + '@' + '<%= cdnLoginFile.server %>' + ':' + '<%= cdnLoginFile.folder %>',
					'mv "' + version + '" dist',
					'echo "Done uploading files."'].join(' && ');
				}
				var command = [
						packageVersion, 
						semver.major(packageVersion) + '.' + semver.minor(packageVersion), 
						semver.major(packageVersion)
					].map(createUploadCommand).join(' && ');
				grunt.log.write('Uploading: ' + command);
				grunt.log.writeln('');
				return command;
			}
		}
	}

}