/*jshint expr:true*/
/*global module:false, process:false*/
module.exports = function (grunt) {
	'use strict';

	// use --no-livereload to disable livereload. Helpful to 'serve' multiple projects
	var isLivereloadEnabled = (typeof grunt.option('livereload') !== 'undefined') ? grunt.option('livereload') : true;

	var semver = require('semver');
	var packageVersion = require('./package.json').version;

	// Project configuration.
	grunt.initConfig({
		// Metadata
		bannerRelease: '/*!\n' +
		' * Fuel UX v<%= pkg.version %> \n' +
		' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
		' */\n',
		banner: '/*!\n' +
		' * Fuel UX EDGE - Built <%= grunt.template.today("yyyy/mm/dd, h:MM:ss TT") %> \n' +
		' * Previous release: v<%= pkg.version %> \n' +
		' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		' * Licensed under the <%= pkg.license.type %> license (<%= pkg.license.url %>)\n' +
		' */\n',
		bump: {
			options: {
				files: ['package.json'],
				updateConfigs: ['pkg'],
				commit: false,
				createTag: false,
				tagName: '%VERSION%',
				tagMessage: '%VERSION%',
				push: false,
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
			}
		},
		// default variables for release task
		release: {
			files: ['dist', 'README.md', 'DETAILS.md', 'bower.json', 'package.json'],
			localBranch: 'release',
			remoteBaseBranch: 'master',
			remoteDestinationBranch: '3.x',
			remoteRepository: 'upstream',
		},
		jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Fuel UX\\\'s JavaScript requires jQuery\') }\n\n',
		bootstrapCheck: 'if (typeof jQuery.fn.dropdown === \'undefined\' || typeof jQuery.fn.collapse === \'undefined\') ' +
		'{ throw new Error(\'Fuel UX\\\'s JavaScript requires Bootstrap\') }\n\n',
		pkg: grunt.file.readJSON('package.json'),
		// Try ENV variables (export SAUCE_ACCESS_KEY=XXXX), if key doesn't exist, try key file
		sauceLoginFile: grunt.file.exists('SAUCE_API_KEY.yml') ? grunt.file.readYAML('SAUCE_API_KEY.yml') : undefined,
		cdnLoginFile: grunt.file.exists('FUEL_CDN.yml') ? grunt.file.readYAML('FUEL_CDN.yml') : undefined,
		sauceUser: process.env.SAUCE_USERNAME || 'fuelux',
		sauceKey: process.env.SAUCE_ACCESS_KEY ? process.env.SAUCE_ACCESS_KEY : '<%= sauceLoginFile.key %>',
		// TEST URLS
		allTestUrls: ['2.1.0', '1.11.0', '1.9.1', 'browserGlobals', 'noMoment', 'codeCoverage' ].map(function (type) {
			if (type === 'browserGlobals') {
				return 'http://localhost:<%= connect.testServer.options.port %>/test/browser-globals.html';
			}
			else if (type === 'codeCoverage') {
				return 'http://localhost:<%= connect.testServer.options.port %>/test/?coverage=true';
			}
			else if (type === 'noMoment') {
				return 'http://localhost:<%= connect.testServer.options.port %>/test/?no-moment=true';
			}
			else {
				// test dist with multiple jQuery versions
				return 'http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true';
			}
		}),

		//Tasks configuration
		blanket_qunit: {
			source: {
				options: {
					urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?coverage=true&gruntReport'],
					threshold: 1,
					globalThreshold: 1
				}
			}
		},
		clean: {
			dist: ['dist'],
			zipsrc: ['dist/fuelux'],// temp folder
			screenshots: ['page-at-timeout-*.jpg']
		},
		compress: {
			zip: {
				files: [
					{
						cwd: 'dist/',
						expand: true,
						src: ['fuelux/**']
					}
				],
				options: {
					archive: 'dist/fuelux.zip',
					mode: 'zip'
				}
			}
		},
		concat: {
			dist: {
				files: {
					// manually concatenate JS files (due to dependency management)
					'dist/js/fuelux.js': [
						'js/checkbox.js',
						'js/combobox.js',
						'js/datepicker.js',
						'js/dropdown-autoflip.js',
						'js/loader.js',
						'js/placard.js',
						'js/radio.js',
						'js/search.js',
						'js/selectlist.js',
						'js/spinbox.js',
						'js/tree.js',
						'js/wizard.js',

						//items with dependencies on other controls
						'js/infinite-scroll.js',
						'js/pillbox.js',
						'js/repeater.js',
						'js/repeater-list.js',
						'js/repeater-thumbnail.js',
						'js/scheduler.js'
					]
				},
				options: {
					banner: '<%= banner %>' + '\n\n' +
					'// For more information on UMD visit: https://github.com/umdjs/umd/' + '\n' +
					'(function (factory) {' + '\n' +
					'\tif (typeof define === \'function\' && define.amd) {' + '\n' +
					'\t\tdefine([\'jquery\', \'bootstrap\'], factory);' + '\n' +
					'\t} else {' + '\n' +
					'\t\tfactory(jQuery);' + '\n' +
					'\t}' + '\n' +
					'}(function (jQuery) {\n\n' +
					'<%= jqueryCheck %>' +
					'<%= bootstrapCheck %>',
					footer: '\n}));',
					process: function (source) {
						source = '(function ($) {\n\n' +
							source.replace(/\/\/ -- BEGIN UMD WRAPPER PREFACE --(\n|.)*\/\/ -- END UMD WRAPPER PREFACE --/g, '');
						source = source.replace(/\/\/ -- BEGIN UMD WRAPPER AFTERWORD --(\n|.)*\/\/ -- END UMD WRAPPER AFTERWORD --/g, '') + '\n})(jQuery);\n\n';
						return source;
					}
				}
			}
		},
		connect: {
			server: {
				options: {
					hostname: '*',
					base: {
						path: '.',
						options: {
							index: ['index.html', 'tests.html'],
						}
					},
					port: process.env.PORT || 8000,
					useAvailablePort: true // increment port number, if unavailable...
				}
			},
			testServer: {
				options: {
					base: {
						path: '.',
						options: {
							index: ['index.html', 'tests.html'],
						}
					},
					hostname: '*',
					port: 9000, // allows main server to be run simultaneously
					useAvailablePort: true// increment port number, if unavailable...
				}
			}
		},
		copy: {
			fonts: {
				cwd: 'fonts/',
				dest: 'dist/fonts/',
				expand: true,
				filter: 'isFile',
				src: ['*']
			},
			zipsrc: {
				cwd: 'dist/',
				dest: 'dist/fuelux/',
				expand: true,
				src: ['**']
			}
		},
		jsbeautifier: {
			files: ['dist/js/fuelux.js'],
			options: {
				js: {
					braceStyle: 'collapse',
					breakChainedMethods: false,
					e4x: false,
					evalCode: false,
					indentLevel: 0,
					indentSize: 4,
					indentWithTabs: true,
					jslintHappy: false,
					keepArrayIndentation: false,
					keepFunctionIndentation: false,
					maxPreserveNewlines: 10,
					preserveNewlines: true,
					spaceBeforeConditional: true,
					spaceInParen: true,
					unescapeStrings: false,
					wrapLineLength: 0
				}
			}
		},
		jshint: {
			options: {
				boss: true,
				browser: true,
				curly: false,
				eqeqeq: true,
				eqnull: true,
				globals: {
					jQuery: true,
					define: true,
					require: true
				},
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: false// changed
			},
			sourceAndDist: ['Gruntfile.js', 'js/*.js', 'dist/fuelux.js'],
			tests: {
				options: {
					latedef: false,
					undef: false,
					unused: false
				},
				files: {
					src: ['test/**/*.js']
				}
			}
		},
		qunit: {
			//run with `grunt releasetest` or `grunt travisci`. Requires connect server to be running.
			release: {
				options: {
					urls: '<%= allTestUrls %>',
					screenshot: true,
					page: {
						viewportSize: {
							width: 1280,
							height: 1024
						}
					}
				}
			},
			globals: {
				options: {
					urls: ['http://localhost:<%= connect.testServer.options.port %>/test/browser-globals.html']
				}
			},
			noMoment: {
				options: {
					urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?no-moment=true']
				}
			},
			// `grunt qunit:source` will test the source files directly.
			source: {
				options: {
					urls: ['http://localhost:<%= connect.testServer.options.port %>/test/']
				}
			},
			dist: {
				options: {
					urls: ['http://localhost:<%= connect.testServer.options.port %>/test/?testdist=true']
				}
			}
		},
		less: {
			dev: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>-dev.css.map',
					sourceMapFilename: 'dist/css/<%= pkg.name %>-dev.css.map'
				},
				files: {
					'dist/css/fuelux-dev.css': 'less/fuelux.less'
				}
			},
			dist: {
				options: {
					strictMath: true,
					sourceMap: true,
					outputSourceFiles: true,
					sourceMapURL: '<%= pkg.name %>.css.map',
					sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
				},
				files: {
					'dist/css/fuelux.css': 'less/fuelux.less'
				}
			},
			minify: {
				options: {
					cleancss: true,
					compress: true,
					report: 'min'
				},
				files: {
					'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
				}
			}

		},
		prompt: {
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
						},
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
								' would like to build your release based upon?';
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
							message: 'Would you like to tag as ' + '<%= pkg.version %>' + '?'
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
							message: 'Would you like to push tag ' + '<%= pkg.version %>' + ' to upstream?'
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
		},
		replace: {
			readme: {
				src: ['DETAILS.md', 'README.md'],
				overwrite: true,// overwrite matched source files
				replacements: [{
					from: /fuelux\/\d\.\d\.\d/g,
					to: "fuelux/<%= pkg.version %>"
				}]
			}
		},
		'saucelabs-qunit': {
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
					tags: ['<%= pkg.version %>', '<%= sauceUser %>' + '@' + process.env.TRAVIS_BRANCH || '<%= sauceUser %>@local'],
					browsers: grunt.file.readYAML('sauce_browsers.yml'),
					build: process.env.TRAVIS_BUILD_NUMBER || '<%= pkg.version %>',
					testname: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>-<%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>',
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
		},
		shell: {
			// Compile release notes while waiting for tests to pass. Needs Ruby gem and ONLY LOOKS AT THE REMOTE NAMED ORIGIN.
			// Install with: gem install github_changelog_generator
			notes: {
				command: 'github_changelog_generator --no-author --unreleased-only --compare-link'
			},
			checkoutRemoteReleaseBranch: {
				// this makes a local branch based on the prior prompt, such as release_{BUILD_VERSION}_{HOURSMINUTES}
				command: function() {
					grunt.config('release.localBranch', 'release_' + semver.inc(packageVersion, grunt.config('release.buildSemVerType')) + 
							'_' + new Date().getTime() );
					var command = [
						'git checkout -b ' + grunt.config('release.localBranch') + ' ' + 
							grunt.config('release.remoteRepository') + '/' + grunt.config('release.remoteBaseBranch')
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
					var command = 'git commit -m "release ' + grunt.config('pkg.version') + '"';
					grunt.log.write('Committing: ' + command);
					return command;
				}
			},
			tag: {
				command: function() {
					var command = 'git tag -a "' + grunt.config('pkg.version') + '" -m "' + grunt.config('pkg.version') + '"';
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
					var command = [
						'mv dist ' + '<%= pkg.version %>',
						'scp -i ~/.ssh/fuelcdn -r "' + '<%= pkg.version %>' + '"/ ' +
						'<%= cdnLoginFile.user %>' + '@' + '<%= cdnLoginFile.server %>' + ':' + '<%= cdnLoginFile.folder %>',
						'mv "' + '<%= pkg.version %>' + '" dist',
						'echo "Done uploading files."'
					].join(' && ');
					grunt.log.write('Uploading: ' + command);
					grunt.log.writeln('');
					return command;
				}
			}
		},
		uglify: {
			options: {
				report: 'min'
			},
			fuelux: {
				options: {
					banner: '<%= banner %>'
				},
				src: 'dist/js/<%= pkg.name %>.js',
				dest: 'dist/js/<%= pkg.name %>.min.js'
			}
		},
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: [
						'dist/css/<%= pkg.name %>.css',
						'dist/css/<%= pkg.name %>.min.css'
					]
				}
			}
		},
		validation: {
			// if many errors are found, this may log to console while other tasks are running
			options: {
				reset: function () {
					grunt.option('reset') || false ;
				},
				stoponerror: true,
				relaxerror: [//ignores these errors
					'Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections.',
					'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
					'Element head is missing a required instance of child element title.'
				],
				doctype: 'HTML5',
				reportpath: false
			},
			files: {
				src: ['index.html', 'test/markup/*.html']
			}
		},
		watch: {
			//watch everything and test everything (test dist)
			full: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['jshint', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'dist', 'qunit:dist', 'validation']
			},
			//watch everything but only perform source qunit tests (don't test dist)
			source: {
				files: ['Gruntfile.js', 'fonts/**', 'js/**', 'less/**', 'test/**', 'index.html', 'dev.html'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['jshint', 'connect:testServer', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'validation']
			},
			//only watch and dist less, useful when doing LESS/CSS work
			less: {
				files: ['fonts/**', 'less/**'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['distcss']
			},
			cssdev: {
				files: ['Gruntfile.js', 'less/**', 'index.html', 'index-dev.html', 'dev.html', '!less/fuelux-no-namespace.less'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['distcssdev']
			},
			//watch things that need compiled, useful for debugging/developing against dist
			dist: {
				files: ['fonts/**', 'js/**', 'less/**'],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: ['dist']
			},
			//just keep the server running, best for when you are just in the zone slinging code and don't want to be interrupted with tests
			lite: {
				files: [],
				options: {
					livereload: isLivereloadEnabled
				},
				tasks: []
			}
		}
	});

	// Look ma! Load all grunt plugins in one line from package.json
	require('load-grunt-tasks')(grunt, {
		scope: 'devDependencies'
	});

	/* -------------
		BUILD
	------------- */
	// JS distribution task
	grunt.registerTask('distjs', 'concat, uglify', ['concat', 'uglify', 'jsbeautifier']);

	// CSS distribution task
	grunt.registerTask('distcss', 'Compile LESS into CSS', ['less:dist', 'less:minify', 'usebanner']);

	// CSS distribution task (dev)
	grunt.registerTask('distcssdev', 'Compile LESS into the dev CSS', [ 'less:dev', 'delete-temp-less-file']);

	// Temporary LESS file deletion task
	grunt.registerTask('delete-temp-less-file', 'Delete the temporary LESS file created during the build process', function () {
		var options = {
			force: true
		};
		grunt.file.delete('less/fuelux-no-namespace.less', options);
	});

	// ZIP distribution task
	grunt.registerTask('distzip', 'Compress and zip "dist"', ['copy:zipsrc', 'compress', 'clean:zipsrc']);

	// Full distribution task
	grunt.registerTask('dist', 'Build "dist." Contributors: do not commit "dist."', ['clean:dist', 'distcss', 'copy:fonts', 'distjs', 'distzip']);


	/* -------------
		TESTS
	------------- */
	// The default build task
	grunt.registerTask('default', 'Run source file tests. Pass --no-resetdist to keep "dist" changes from being wiped out',
		['test', 'clean:screenshots', 'resetdist']);

	// to be run prior to submitting a PR
	grunt.registerTask('test', 'run jshint, qunit source w/ coverage, and validate HTML',
		['jshint', 'connect:testServer', 'blanket_qunit:source', 'qunit:noMoment', 'qunit:globals', 'validation']);

	//If qunit:source is working but qunit:full is breaking, check to see if the dist broke the code. This would be especially useful if we start mangling our code, but, is 99.99% unlikely right now
	grunt.registerTask('validate-dist', 'run qunit:source, dist, and then qunit:full',
		['connect:testServer', 'qunit:source', 'dist', 'qunit:dist']);

	// multiple jQuery versions, then run SauceLabs VMs
	grunt.registerTask('releasetest', 'run jshint, build dist, all source tests, validation, and qunit on SauceLabs',
		['test', 'dist', 'qunit:dist', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the Fuel UX Saucelabs API key file which is not public at this time.
	grunt.registerTask('saucelabs', 'run jshint, and qunit on saucelabs',
		['connect:testServer', 'jshint', 'saucelabs-qunit:defaultBrowsers']);

	// can be run locally instead of through TravisCI, but requires the FuelUX Saucelabs API key file which is not public at this time.
	grunt.registerTask('trickysauce', 'run tests, jshint, and qunit for "tricky browsers" (IE8-11)',
		['connect:testServer', 'jshint', 'saucelabs-qunit:trickyBrowsers']);

	// Travis CI task. This task no longer uses SauceLabs. Please run 'grunt saucelabs' manually.
	grunt.registerTask('travisci', 'Tests to run when in Travis CI environment',
		['test', 'dist', 'qunit:dist']);

	//if you've already accidentally added your files for commit, this will at least unstage them. If you haven't, this will wipe them out.
	grunt.registerTask('resetdist', 'resets changes to dist to keep them from being checked in', function () {
		//default resetdist to true... basically.
		if (typeof grunt.option('resetdist') === "undefined" || grunt.option('resetdist')) {
			var exec = require('child_process').exec;
			exec('git reset HEAD dist/*');
			exec('git checkout -- dist/*');
		}
	});

	/* -------------
		RELEASE
	------------- */
	grunt.registerTask('notes', 'Run a ruby gem that will request from Github unreleased pull requests', ['shell:notes']);

	// Maintainers: Run prior to a release. Includes SauceLabs VM tests.
	grunt.registerTask('release', 'Release a new version, push it and publish it', function() {
		if ( typeof grunt.config('sauceLoginFile') === 'undefined' ) {
			grunt.log.write('The file SAUCE_API_KEY.yml is needed in order to run tests in SauceLabs.' +
				' Please contact another maintainer to obtain this file.');
		}

		if ( typeof grunt.config('cdnLoginFile') === 'undefined' ) {
			grunt.log.write('The file FUEL_CDN.yml is needed in order to upload the release files to the CDN.' +
				' Please contact another maintainer to obtain this file.');
		}

		grunt.task.run(['prompt:build', 'dorelease']);
		});

	// formerally dorelease task
	grunt.registerTask('dorelease', '', function () {
		if (typeof grunt.config('release.buildSemVerType') === 'undefined') {
			grunt.fail.fatal('you must choose a version to bump to');
		}

		grunt.task.run(['shell:checkoutRemoteReleaseBranch']);
		grunt.log.writeln('');
		grunt.log.oklns('releasing: ', grunt.config('release.buildSemVerType'));

		if (!grunt.option('no-tests')) {
			grunt.task.run(['releasetest']); //If phantom timeouts happening because of long-running qunit tests, look into setting `resourceTimeout` in phantom: http://phantomjs.org/api/webpage/property/settings.html
			// Delete any screenshots that may have happened if it got this far. This isn't foolproof
			// because it relies on the phantomjs server/page timeout, which can take longer than this
			// grunt task depending on how long saucelabs takes to run...
			grunt.task.run('clean:screenshots');
		}

		grunt.config('banner', '<%= bannerRelease %>');

		// Run dist again to grab the latest version numbers. Yeah, we're running it twice... ¯\_(ツ)_/¯
		grunt.task.run(['bump-only:' + grunt.config('release.buildSemVerType'), 'replace:readme', 'dist', 
			'shell:addReleaseFiles', 'prompt:commit', 'prompt:tag', 'prompt:pushLocalBranchToUpstream', 
			'prompt:pushTagToUpstream', 'prompt:uploadToCDN', 'prompt:pushLocalBranchToUpstreamMaster']);
	});


	/* -------------
		SERVE
	------------- */
	// default serve task that runs tests and builds and tests dist by default.
	grunt.registerTask('serve', 'Test, build, serve files. (~20s)', function () {
		var tasks = ['test', 'servedist'];
		grunt.task.run(tasks);
	});

	// serve task that runs tests and builds and tests dist by default (~20s).
	grunt.registerTask('serveslow', 'Serve files. Run all tests. Does not build. (~20s)', function () {
		var tasks = ['connect:server', 'test', 'watch:source'];
		grunt.task.run(tasks);
	});

	//Fastest serve command for freely slinging code (no tests will run by default).
	grunt.registerTask('servefast', 'Serve the files (no watch), --test to run minimal tests. (~0s)', function () {
		grunt.task.run(['connect:server']);

		if (grunt.option('test')) {
			grunt.task.run(['connect:testServer', 'qunit:source', 'watch:source']);
		} else {
			grunt.task.run(['watch:lite']);
		}
	});

	// Fastest serve command when you're working on LESS
	grunt.registerTask('serveless', 'Compile LESS and serve the files. pass --tests to run test. (~3s)', function () {
		grunt.task.run(['distcss']);

		if (grunt.option('test')) {
			// add qunit:source as a watch task for watch:less since they want tests
			grunt.config.merge({
				watch: {
					less: {
						tasks: ['qunit:source']
					}
				}
			});
			grunt.task.run(['qunit:source']);
		}

		grunt.task.run(['connect:server', 'watch:less']);
	});

	// Complies the less files into the -dev versions, does not overwrite the main css files.
	grunt.registerTask('servedev', 'Serve the files with no "dist" build or tests. Optional --no-less to also disable compiling less into css.', function() {
		if (! grunt.option('no-less') ) {
			grunt.task.run(['distcssdev']);
		}
		grunt.task.run(['connect:server', 'watch:cssdev']);
	});

	// same as `grunt serve` but tests default to being off
	grunt.registerTask('servedist', 'Compile and serve everything, pass --test to run tests. (~7s)', function () {
		grunt.task.run(['dist']);

		//start up the servers here so we can run tests if appropriate
		grunt.task.run(['connect:server']);
		grunt.task.run(['connect:testServer']);

		if (grunt.option('test')) {
			grunt.task.run(['qunit:dist', 'watch:full']);
		} else {
			grunt.task.run(['watch:dist']);
		}
	});
};
