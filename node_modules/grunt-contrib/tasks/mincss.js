/**
 * Task: mincss
 * Description: Minify CSS files
 * Dependencies: clean-css
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask("mincss", "Minify CSS files", function() {
    var options = grunt.helper("options", this);

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var srcFiles;
    var taskOutput;
    var sourceCode;

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);
      sourceCode = grunt.helper("concat", srcFiles);
      taskOutput = grunt.helper("mincss", sourceCode);

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput);
        grunt.log.writeln("File '" + file.dest + "' created.");
        grunt.helper('min_max_info', taskOutput, sourceCode);
      }
    });
  });

  grunt.registerHelper("mincss", function(source) {
    try {
      return require("clean-css").process(source);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("css minification failed.");
    }
  });
};