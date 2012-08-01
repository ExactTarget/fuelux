/**
 * Task: coffee
 * Description: Compile CoffeeScript files into JavaScript
 * Dependencies: coffee-script
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  "use strict";

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;

  grunt.registerMultiTask("coffee", "Compile CoffeeScript files into JavaScript", function() {
    var options = grunt.helper("options", this);

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var srcFiles;
    var taskOutput;
    var sourceCode;
    var sourceCompiled;
    var helperOptions;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      taskOutput = [];

      srcFiles.forEach(function(srcFile) {
        helperOptions = _.extend({filename: srcFile}, options);
        sourceCode = grunt.file.read(srcFile);

        sourceCompiled = grunt.helper("coffee", sourceCode, helperOptions);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("coffee", function(coffeescript, options) {
    try {
      return require("coffee-script").compile(coffeescript, options);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("CoffeeScript failed to compile.");
    }
  });
};