/**
 * Task: stylus
 * Description: Compile Stylus files into CSS
 * Dependencies: stylus
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  "use strict";

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;
  var async = grunt.util.async;

  grunt.registerMultiTask("stylus", "Compile Stylus files into CSS", function() {
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

        grunt.helper("stylus", sourceCode, helperOptions, function(css) {
          nextConcat(css);
        });
      }, function(css) {
        grunt.file.write(file.dest, css);
        grunt.log.writeln("File '" + file.dest + "' created.");

        next();
      });
    }, function() {
      done();
    });
  });

  grunt.registerHelper("stylus", function(source, options, callback) {
    var s = require("stylus")(source);
    
    // load nib if available
    try {
      s.use(require("nib")());
    } catch (e) {}

    _.each(options, function(value, key) {
      s.set(key, value);
    });

    s.render(function(err, css) {
      if (err) {
        grunt.log.error(err);
        grunt.fail.warn("Stylus failed to compile.");
      } else {
        callback(css);
      }
    });
  });
};