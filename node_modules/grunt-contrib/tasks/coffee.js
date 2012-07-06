/**
 * Task: coffee
 * Description: Compile CoffeeScript files into JavaScript
 * Dependencies: coffee-script
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  var _ = grunt.utils._;

  grunt.registerMultiTask("coffee", "Compile CoffeeScript files into JavaScript", function() {
    var options = grunt.helper("options", this);
    var data = this.data;

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      var coffeeOutput = [];

      srcFiles.forEach(function(srcFile) {
        var coffeeOptions = _.extend({filename: srcFile}, options);
        var coffeeSource = grunt.file.read(srcFile);

        coffeeOutput.push(grunt.helper("coffee", coffeeSource, coffeeOptions));
      });

      if (coffeeOutput.length > 0) {
        grunt.file.write(dest, coffeeOutput.join("\n"));
        grunt.log.writeln("File '" + dest + "' created.");
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