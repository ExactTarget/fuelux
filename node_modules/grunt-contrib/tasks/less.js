/**
 * Task: less
 * Description: Compile LESS files to CSS
 * Dependencies: less
 * Contributor: @tkellen
 */

module.exports = function(grunt) {
  var _ = grunt.utils._;
  var async = grunt.utils.async;

  var lessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    grunt.log.error(e.filename + ': ' + pos + ' ' + e.message);
    grunt.fail.warn("Error compiling LESS.", 1);
  };

  grunt.registerMultiTask("less", "Compile LESS files to CSS", function() {
    var options = grunt.helper("options", this);
    var data = this.data;
    var done = this.async();

    async.forEachSeries(Object.keys(data.files), function(dest, next) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      async.concatSeries(srcFiles, function(srcFile, nextConcat) {
        var lessOptions = _.extend({filename: srcFile}, options);
        var lessSource = grunt.file.read(srcFile);

        grunt.helper("less", lessSource, lessOptions, function(css) {
          nextConcat(css);
        });
      }, function(css) {
          grunt.file.write(dest, css);
          grunt.log.writeln("File '" + dest + "' created.");

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