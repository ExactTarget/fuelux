/**
 * Task: less
 * Description: Compile LESS files to CSS
 * Dependencies: less
 * Contributor: @tkellen
 */

module.exports = function(grunt) {
  "use strict";

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var async = grunt.util.async;

  var lessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    grunt.log.error(e.filename + ': ' + pos + ' ' + e.message);
    grunt.fail.warn("Error compiling LESS.", 1);
  };

  grunt.registerMultiTask("less", "Compile LESS files to CSS", function() {
    var options = grunt.helper("options", this);

    grunt.verbose.writeflags(options, "Options");

    // TODO: ditch this when grunt v0.4 is released
    this.files = this.files || grunt.helper("normalizeMultiTaskFiles", this.data, this.target);

    var done = this.async();

    var srcFiles;
    var sourceCode;
    var helperOptions;

    async.forEachSeries(this.files, function(file, next) {
     srcFiles = grunt.file.expandFiles(file.src);

      async.concatSeries(srcFiles, function(srcFile, nextConcat) {
        helperOptions = _.extend({filename: srcFile}, options);
        sourceCode = grunt.file.read(srcFile);

        grunt.helper("less", sourceCode, helperOptions, function(css) {
          nextConcat(css);
        });
      }, function(css) {
        grunt.file.write(file.dest, css || "");
        grunt.log.writeln("File '" + file.dest + "' created.");

        next();
      });

    }, function() {
      done();
    });
  });

  grunt.registerHelper("less", function(source, options, callback) {
    require("less").Parser(options).parse(source, function(parse_error, tree) {
      if (parse_error) {
        lessError(parse_error);
      }

      try {
        var css = tree.toCSS();
        callback(css);
      } catch (e) {
        lessError(e);
      }
    });
  });
};