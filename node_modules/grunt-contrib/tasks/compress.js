/**
 * Task: compress
 * Description: Compress files
 * Dependencies: zipstream / tar / fstream
 * Contributor: @ctalkington
 */

module.exports = function(grunt) {
  "use strict";

  var fs = require("fs");
  var path = require("path");

  // TODO: ditch this when grunt v0.4 is released
  grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var async = grunt.util.async;

  var getSize = function(filename) {
    try {
      return fs.statSync(filename).size;
    } catch (e) {
      return 0;
    }
  };

  var findBasePath = function(srcFiles) {
    var basePaths = [];
    var dirName;

    srcFiles.forEach(function(srcFile) {
      dirName = path.dirname(srcFile);
      dirName = path.normalize(dirName);

      basePaths.push(dirName.split(path.sep));
    });

    basePaths = _.intersection.apply([], basePaths);

    return path.join.apply(path, basePaths);
  };

  var tempCopy = function(srcFiles, tempDir, options) {
    var newFiles = [];
    var newMeta = {};

    var filename;
    var relative;
    var destPath;

    var basePath = options.basePath || findBasePath(srcFiles);

    srcFiles.forEach(function(srcFile) {
      filename = path.basename(srcFile);
      relative = path.dirname(srcFile);
      relative = path.normalize(relative);

      if (options.flatten) {
        relative = "";
      } else if (basePath && basePath.length > 1) {
        relative = _(relative).chain().strRight(basePath).trim(path.sep).value();
      }

      // make paths outside grunts working dir relative
      relative = relative.replace(/\.\.(\/|\\)/g, "");

      destPath = path.join(tempDir, relative, filename);

      newFiles.push(destPath);
      newMeta[destPath] = {name: path.join(relative, filename)};

      grunt.verbose.writeln("Adding " + srcFile + " to temporary structure.");
      grunt.file.copy(srcFile, destPath);
    });

    return [newFiles, newMeta];
  };

  grunt.registerMultiTask("compress", "Compress files.", function() {
    var options = grunt.helper("options", this, {
      mode: null,
      basePath: false,
      flatten: false,
      level: 1
    });

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var supported = ["zip", "tar", "tgz", "gzip"];
    var helper = options.mode + "Helper";
    var done = this.async();


    if (options.basePath) {
      options.basePath = path.normalize(options.basePath);
      options.basePath = _(options.basePath).trim(path.sep);
    }

    grunt.verbose.writeflags(options, "Options");

    if (options.mode === "tgz") {
      helper = "tarHelper";
    }

    if (_.include(supported, options.mode) === false) {
      grunt.log.error("Mode " + options.mode + " not supported.");
      done();
      return;
    }

    var srcFiles;
    var destDir;

    async.forEachSeries(this.files, function(file, next) {
      srcFiles = grunt.file.expandFiles(file.src);
      destDir = path.dirname(file.dest);

      if (options.mode === "gzip" && srcFiles.length > 1) {
        grunt.fail.warn("Cannot specify multiple input files for gzip compression.");
        srcFiles = srcFiles[0];
      }

      if (grunt.file.exists(destDir) === false) {
        grunt.file.mkdir(destDir);
      }

      grunt.helper(helper, srcFiles, file.dest, options, function(written) {
        grunt.log.writeln('File "' + file.dest + '" created (' + written + ' bytes written).');
        next();
      });

    }, function() {
      done();
    });
  });

  grunt.registerHelper("zipHelper", function(srcFiles, dest, options, callback) {
    var zip = require("zipstream").createZip(options);

    var destDir = path.dirname(dest);
    var tempDir = path.join(destDir, "zip_" + (new Date()).getTime());

    var copyResult = tempCopy(srcFiles, tempDir, options);

    var zipFiles = _.uniq(copyResult[0]);
    var zipMeta = copyResult[1];

    zip.pipe(fs.createWriteStream(dest));

    var srcFile;

    function addFile() {
      if (!zipFiles.length) {
        zip.finalize(function(written) {
          grunt.helper("clean", tempDir);
          callback(written);
        });
        return;
      }

      srcFile = zipFiles.shift();

      zip.addFile(fs.createReadStream(srcFile), zipMeta[srcFile], addFile);
    }

    addFile();

    // TODO: node-zipstream v0.2.1 has issues that prevents this from working atm!
    zip.on("error", function(e) {
      grunt.log.error(e);
      grunt.fail.warn("zipHelper failed.");
    });
  });

  grunt.registerHelper("tarHelper", function(srcFiles, dest, options, callback) {
    var fstream = require("fstream");
    var tar = require("tar");
    var zlib = require("zlib");

    var destDir = path.dirname(dest);
    var destFile = path.basename(dest);
    var destFileExt = path.extname(destFile);
    var tempDir = path.join(destDir, "tar_" + (new Date()).getTime());
    var tarDir = _(destFile).strLeftBack(destFileExt);

    var tarProcess;

    tarDir = path.join(tempDir, tarDir);

    tempCopy(srcFiles, tarDir, options);

    var reader = fstream.Reader({path: tarDir, type: "Directory"});
    var packer = tar.Pack();
    var gzipper = zlib.createGzip();
    var writer = fstream.Writer(dest);

    if (options.mode === "tgz") {
      tarProcess = reader.pipe(packer).pipe(gzipper).pipe(writer);
    } else {
      tarProcess = reader.pipe(packer).pipe(writer);
    }

    tarProcess.on("error", function(e) {
      grunt.log.error(e);
      grunt.fail.warn("tarHelper failed.");
    });

    tarProcess.on("close", function() {
      grunt.helper("clean", tempDir);
      callback(getSize(dest));
    });
  });

  grunt.registerHelper("gzipHelper", function(file, dest, options, callback) {
    var zlib = require("zlib");

    zlib.gzip(grunt.file.read(file), function(e, result) {
      if (!e) {
        grunt.file.write(dest, result);
        callback(result.length);
      } else {
        grunt.log.error(e);
        grunt.fail.warn("tarHelper failed.");
      }
    });
  });
};