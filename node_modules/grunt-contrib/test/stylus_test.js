var grunt = require("grunt");

exports.stylus = {
  main: function(test) {
    test.expect(1);

    var expectA = "body{font:Helvetica;font-size:10px}\n";
    var resultA = grunt.file.read("fixtures/output/stylus.css");
    test.equal(expectA, resultA, "should compile stylus to css, handling includes and compression");

    test.done();
  }
};