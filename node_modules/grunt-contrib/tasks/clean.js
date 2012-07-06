/**
 * Task: clean
 * Description: Clear files and folders.
 * Dependencies: rimraf
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  var _ = grunt.utils._;

  grunt.registerMultiTask("clean", "Clear files and folders", function() {
    var badPaths = ["*", "/", "\\"];
    var config = grunt.config.get("clean");
    var paths = this.data;
    var validPaths = [];

    // check if we have a valid config & an invalid target specific config
    if (_.isArray(config) === true && _.isArray(paths) === false) {
      paths = config;
    } else if (_.isArray(paths) === false){
      paths = [];
    }

    paths.forEach(function(path) {
      if (_.isString(path)) {
        path = grunt.template.process(path);

        if (_.isEmpty(path) === false && _.include(badPaths, path) === false) {
          validPaths.push(path);
        }
      }
    });

    if (_.isEmpty(validPaths)) {
      grunt.fatal("Clean should have an array of paths by now. Too dangerous to continue.");
    }

    validPaths.forEach(function(path) {
      grunt.helper("clean", path);
    });
  });

  grunt.registerHelper("clean", function(path) {
    grunt.verbose.writeln('Cleaning "' + path + '"');

    try {
      require("rimraf").sync(path);
      grunt.log.writeln('Cleaned "' + path + '"');
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Clean operation failed.");
    }
  });
};