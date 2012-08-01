/**
 * Task: jade
 * Description: Compile Jade templates to HTML
 * Dependencies: jade
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  "use strict";

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var kindOf = grunt.util.kindOf;

  grunt.registerMultiTask("jade", "Compile Jade templates into HTML.", function() {
    var options = grunt.helper("options", this, {data: {}});

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var helperData = options.data;

    _.each(helperData, function(value, key) {
      if (kindOf(value) === "string") {
        helperData[key] = grunt.template.process(value);
      }
    });

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

        sourceCompiled = grunt.helper("jade", sourceCode, helperOptions, helperData);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("jade", function(src, options, data) {
    try {
      return require("jade").compile(src, options)(data);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Jade failed to compile.");
    }
  });
};