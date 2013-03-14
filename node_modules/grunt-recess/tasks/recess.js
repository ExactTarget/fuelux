'use strict';
module.exports = function (grunt) {
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

				// RECESS returns an object when passed a single file,
				// and a array of objects when passed multiple files.
				// ^ Bug: https://github.com/twitter/recess/issues/44
				//
				// .reverse() the array because of bug:
				// https://github.com/twitter/recess/issues/42
				data = Array.isArray(data) ? data.reverse() : [data];

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
							helpers.minMaxInfo(min.join(separator), max.join(separator));
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
