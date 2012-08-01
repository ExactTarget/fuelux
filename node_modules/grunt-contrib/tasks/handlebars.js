/**
 * Task: handlebars
 * Description: Compile handlebars templates to JST file
 * Dependencies: handlebars
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask("handlebars", "Compile handlebars templates to JST file", function() {
    var options = grunt.helper("options", this, {namespace: "JST"});

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

        sourceCompiled = grunt.helper("handlebars", sourceCode, srcFile, helperNamespace);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("handlebars", function(source, filepath, namespace) {
    try {
      var output = "Handlebars.template(" + require("handlebars").precompile(source) + ");";
      return namespace + "['" + filepath + "'] = " + output;
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Handlebars failed to compile.");
    }
  });
};
