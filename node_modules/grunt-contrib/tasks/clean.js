/**
 * Task: clean
 * Description: Clear files and folders.
 * Dependencies: rimraf
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  "use strict";

  grunt.registerMultiTask("clean", "Clear files and folders", function() {
    var options = grunt.helper("options", this);

    grunt.verbose.writeflags(options, "Options");

    var paths = grunt.file.expand(this.file.src);

    paths.forEach(function(path) {
      grunt.helper("clean", path);
    });
  });

  grunt.registerHelper("clean", function(path) {
    grunt.log.write('Cleaning "' + path + '"...');

    try {
      require("rimraf").sync(path);
      grunt.log.ok();
    } catch (e) {
      grunt.log.error();
      grunt.verbose.error(e);
      grunt.fail.warn("Clean operation failed.");
    }
  });
};