/*
 * grunt-contrib-compress
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 Chris Talkington, contributors
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var prettySize = require('prettysize');
var zlib = require('zlib');
var archiver = require('archiver');

module.exports = function(grunt) {

  var exports = {
    options: {}
  };

  // 1 to 1 gziping of files
  exports.gzip = function(files, done) {
    grunt.util.async.forEachSeries(files, function(file, next) {
      var src = file.src.filter(grunt.file.isFile).map(grunt.file.read).join('');
      if (src.length < 1) { return; }

      // Append ext if the specified one isnt there
      var ext = file.orig.ext || '.gz';
      if (String(file.dest).slice(-ext.length) !== ext) {
        file.dest += ext;
      }

      // Ensure the dest folder exists
      grunt.file.mkdir(path.dirname(file.dest));

      var gz = zlib.createGzip();
      gz.pipe(fs.createWriteStream(file.dest));
      gz.write(src);
      gz.end();
      gz.on('end', function() {
        grunt.log.writeln('File ' + String(file.dest).cyan + ' created (' + exports.getSize(file.dest) + ').');
        next();
      });
    }, done);
  };

  // Compress with tar, tgz and zip
  exports.tar = function(files, done) {
    if (typeof exports.options.archive !== 'string' || exports.options.archive.length === 0) {
      grunt.fail.warn('Unable to compress; no valid archive file was specified.');
    }

    var mode = exports.options.mode;
    var shouldGzip = false;
    if (mode === 'tgz') {
      shouldGzip = true;
      mode = 'tar';
    }

    var archive = archiver.create(mode, exports.options);
    var dest = exports.options.archive;

    // Ensure dest folder exists
    grunt.file.mkdir(path.dirname(dest));

    archive.on('error', function(err) {
      grunt.log.error(err);
      grunt.fail.warn('Archiving failed.');
    });

    // Whether to gzip the tar before writing the file
    if (shouldGzip) {
      archive.pipe(zlib.createGzip()).pipe(fs.createWriteStream(dest));
    } else {
      archive.pipe(fs.createWriteStream(dest));
    }

    grunt.util.async.forEachSeries(files, function(file, next) {
      var isExpandedPair = file.orig.expand || false;
      var src = file.src.filter(grunt.file.isFile);

      grunt.util.async.forEachSeries(src, function(srcFile, nextFile) {
        var internalFileName = (isExpandedPair) ? file.dest : exports.unixifyPath(path.join(file.dest || '', srcFile));

        archive.addFile(fs.createReadStream(srcFile), { name: internalFileName }, function(err) {
          grunt.verbose.writeln('Archiving ' + srcFile.cyan + ' -> ' + String(dest).cyan + '/'.cyan + internalFileName.cyan);
          nextFile(err);
        });
      }, next);
    }, function(err) {
      if (err) { grunt.fail.warn(err); }

      archive.finalize(function(err, written) {
        if (shouldGzip) {
          grunt.log.writeln('Created ' + String(dest).cyan + ' (' + exports.getSize(dest) + ')');
        } else {
          grunt.log.writeln('Created ' + String(dest).cyan + ' (' + exports.getSize(Number(written)) + ')');
        }
        done();
      });
    });
  };

  exports.getSize = function(filename, pretty) {
    var size = 0;
    if (typeof filename === 'string') {
      try {
        size = fs.statSync(filename).size;
      } catch (e) {}
    } else {
      size = filename;
    }
    if (pretty !== false) {
      if (!exports.options.pretty) {
        return size + ' bytes';
      }
      return prettySize(size);
    }
    return Number(size);
  };

  exports.autoDetectMode = function(dest) {
    if (exports.options.mode) {
      return exports.options.mode;
    }
    if (!dest) {
      return 'gzip';
    }
    if (grunt.util._.endsWith(dest, '.tar.gz')) {
      return 'tgz';
    }
    var ext = path.extname(dest).replace('.', '');
    if (ext === 'gz') {
      return 'gzip';
    } else {
      return ext;
    }
  };

  exports.unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  return exports;
};