/**
 * Task: jst
 * Description: Compile underscore templates to JST file
 * Dependencies: underscore
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  "use strict";

  var _ = require("underscore");

  grunt.registerMultiTask("jst", "Compile underscore templates to JST file", function() {
    var options = grunt.helper("options", this, {namespace: "JST", templateSettings: {}});

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var srcFiles;
    var taskOutput;
    var sourceCode;
    var sourceCompiled;

    var helperNamespace = "this['" + options.namespace + "']";

    this.files.forEach(function(file) {
      srcFiles = grunt.file.expandFiles(file.src);

      taskOutput = [];
      taskOutput.push(helperNamespace + " = " + helperNamespace + " || {};");

      srcFiles.forEach(function(srcFile) {
        sourceCode = grunt.file.read(srcFile);

        sourceCompiled = grunt.helper("jst", sourceCode, srcFile, helperNamespace, options.templateSettings);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("jst", function(source, filepath, namespace, templateSettings) {
    try {
      return namespace + "['" + filepath + "'] = " + _.template(source, false, templateSettings).source + ";";
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("JST failed to compile.");
    }
  });
};