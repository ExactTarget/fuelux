'use strict';
module.exports = function (grunt) {
	var _ = grunt.util._;

	function padLine(line) {
		var num = line + '. ';
		var space = '';

		_.times(10 - num.length, function () {
			space += ' ';
		});

		return (space + num).grey;
	}

	function logError(err) {
		// RECESS doesn't log errors when `compile: true`
		// Duplicate its error logging style
		if (err.type === 'Parse') {
			// parse error
			grunt.log.error('Parser error'.red + (err.filename ? ' in ' + err.filename.yellow : '') + '\n');
		} else {
			// other exception
			grunt.log.error((err.name ? err.name.red + ': ' : '') + err.message +
				(err.filename ? ' in ' + err.filename.yellow : '') + '\n');
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
		var recess = require('recess');
		var lf = grunt.util.linefeed;
		var cb = this.async();
		var files = this.files;
		var options = this.options();
		var separator = options.compress ? '' : lf + lf;

		if (!files.length) {
			grunt.log.writeln('No existing files in this target.');
			return cb();
		}

		grunt.util.async.forEachSeries(files, function (el, cb2) {
			var dest = el.dest;

			recess(el.src, options, function (err, data) {
				var min = [];
				var max = [];

				if (err) {
					err.forEach(logError);
				}

				data.forEach(function (item) {
					if (item.options.compile) {
						min.push(item.output);
						max.push(item.data);
					// Extract status and check
					} else if (item.output[1] && item.output[1].indexOf('Perfect!') !== -1) {
						grunt.log.writeln(item.output.join(lf));
					} else {
						grunt.fail.warn(item.output.join(lf));
					}
				});

				if (min.length) {
					if (dest) {
						// Concat files
						grunt.file.write(dest, min.join(separator));
						grunt.log.writeln('File "' + dest + '" created.');

						if (options.compress) {
							helpers.minMaxInfo(min.join(separator), max.join(separator), 'min');
						}
					} else {
						grunt.fail.fatal('No destination specified. Required when options.compile is enabled.');
					}
				}

				cb2();
			});
		}, function (err) {
			cb(!err);
		});
	});
};
