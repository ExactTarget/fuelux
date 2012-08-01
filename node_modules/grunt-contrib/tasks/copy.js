/**
 * Task: copy
 * Description: Copy files into another directory
 * Contributor: @ctalkington
 */

module.exports = function(grunt) {
  "use strict";

  var path = require("path");

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var kindOf = grunt.util.kindOf;

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

  grunt.registerMultiTask("copy", "Copy files into another directory.", function() {
    var options = grunt.helper("options", this, {
      basePath: false,
      flatten: false,
      processName: false,
      processContent: false,
      processContentExclude: []
    });

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    if (options.basePath) {
      options.basePath = path.normalize(options.basePath);
      options.basePath = _(options.basePath).trim(path.sep);
    }

    grunt.verbose.writeflags(options, "Options");

    var srcFiles;

    var basePath;
    var filename;
    var relative;
    var destFile;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      basePath = options.basePath || findBasePath(srcFiles);

      grunt.log.write("Copying file(s)" + ' to "' + file.dest + '"...');

      srcFiles.forEach(function(srcFile) {
        filename = path.basename(srcFile);
        relative = path.dirname(srcFile);
        relative = path.normalize(relative);

        if (options.flatten) {
          relative = "";
        } else if (basePath && basePath.length > 1) {
          relative = _(relative).chain().strRight(basePath).trim(path.sep).value();
        }

        if (options.processName && kindOf(options.processName) === "function") {
          filename = options.processName(filename);
        }

        // make paths outside grunts working dir relative
        relative = relative.replace(/\.\.(\/|\\)/g, "");

        destFile = path.join(file.dest, relative, filename);

        grunt.file.copy(srcFile, destFile, copyOptions);
      });

      grunt.log.ok();
    });
  });
};