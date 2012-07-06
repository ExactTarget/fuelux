/**
 * Task: mincss
 * Description: Minify CSS files
 * Dependencies: clean-css
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  grunt.registerMultiTask("mincss", "Minify CSS files", function() {
    var options = grunt.helper("options", this);
    var data = this.data;

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);
      var source = grunt.helper("concat", srcFiles);

      dest = grunt.template.process(dest);

      var min = grunt.helper("mincss", source);

      if (min.length > 0) {
        grunt.file.write(dest, min);
        grunt.log.writeln("File '" + dest + "' created.");
        grunt.helper('min_max_info', min, source);
      }
    });
  });

  grunt.registerHelper("mincss", function(source, callback) {
    try {
      return require("clean-css").process(source);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("css minification failed.");
    }
  });
};