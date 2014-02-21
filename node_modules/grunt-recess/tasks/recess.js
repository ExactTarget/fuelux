'use strict';
var async = require('async');
var _ = require('lodash');
var recess = require('recess');
var chalk = require('chalk');

function padLine(line) {
	var num = line + '. ';
	var space = '';

	_.times(10 - num.length, function () {
		space += ' ';
	});

	return chalk.gray(space + num);
}

module.exports = function (grunt) {
	function logError(err) {
		// RECESS doesn't log errors when `compile: true`
		// Duplicate its error logging style
		if (err.type === 'Parse') {
			// parse error
			grunt.log.error(chalk.red('Parser error') + (err.filename ? ' in ' + chalk.yellow(err.filename) : '') + '\n');
		} else {
			// other exception
			grunt.log.error((err.name ? chalk.red(err.name) + ': ' : '') + err.message +
				(err.filename ? ' in ' + chalk.yellow(err.filename) : '') + '\n');
		}

		// if extract - then log it
		if (err.extract) {
			err.extract.forEach(function (line, index) {
				grunt.log.error(padLine(err.line + index) + line);
			});
		}

		grunt.warn('');
	}

	grunt.registerMultiTask('recess', 'Lint and minify CSS and LESS', function () {
		var helpers = require('grunt-lib-contrib').init(grunt);
		var lf = grunt.util.linefeed;
		var cb = this.async();
		var files = this.files;
		var options = this.options({
			banner: '',
			compress: false,
			footer: '',
			report: null
		});
		var separator = options.compress ? '' : lf + lf;
		var banner = grunt.template.process(options.banner);
		var footer = grunt.template.process(options.footer);
		var reporter = false;

		if (!files.length) {
			grunt.log.writeln('No existing files in this target.');
			return cb();
		}

		// hook the reporting in...
		if (options.report && options.report.reporter) {
			reporter = {};
			reporter.proto = require('./lib/reporters/' + options.report.reporter + '.js');
			reporter.mapping = options.report.mapping ? grunt.file.readJSON(options.report.mapping) : {};
			reporter.inst = new reporter.proto(reporter.mapping);
			options.compress = false;
			options.compile = true;
		}

		async.eachSeries(files, function (el, cb2) {
			var dest = el.dest;

			recess(el.src, options, function (err, data) {
				var min = [];
				var max = [];

				if (err) {
					err.forEach(logError);
				}

				if (reporter) {
					reporter.inst.startReport();
				}

				data.forEach(function (item) {
					if (item.options.compile || reporter) {
						min.push(item.output);
						max.push(item.data);
					// Extract status and check
					} else if (item.output[1] && item.output[1].indexOf('Perfect!') !== -1) {
						grunt.log.writeln(item.output.join(lf));
					} else {
						grunt.warn(item.output.join(lf));
					}

					if (reporter) {
						reporter.inst.startFile(dest);

						if (item.definitions && item.definitions.length) {
							// loop over definitions to get errors
							item.definitions.forEach(function (definition) {
								if (definition.errors && definition.errors.length) {
									definition.errors.forEach(function (definitionErr) {
										// report that error
										reporter.inst.logError(definitionErr);
									});
								}
							});
						}
						reporter.inst.endFile();
					}
				});

				if (min.length) {
					if (dest) {
						// Concat files
						grunt.file.write(dest, banner + min.join(separator) + footer);
						grunt.log.writeln('File "' + dest + '" created.');

						if (options.compress) {
							helpers.minMaxInfo(min.join(separator), max.join(separator), 'min');
						}
					} else {
						grunt.fail.fatal('No destination specified. Required when options.compile is enabled.');
					}
				}

				if (reporter) {
					// Write report to the report file, if wanted
					reporter.inst.endReport();
					if (options.report.output) {
						options.report.outputFile = grunt.template.process(options.report.output);
						options.report.outputDir = require('path').dirname(options.report.outputFile);
						if (!grunt.file.exists(options.report.outputDir)) {
							grunt.file.mkdir(options.report.outputDir);
						}
						grunt.file.write(options.report.outputFile, reporter.inst.report);
						grunt.log.ok('Report "' + options.report.outputFile + '" created.');
					}
				}

				cb2();
			});
		}, function (err) {
			cb(!err);
		});
	});
};
