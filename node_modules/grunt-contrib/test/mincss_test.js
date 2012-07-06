var grunt = require("grunt");

exports.mincss = {
  main: function(test) {
    test.expect(1);

    var expectA = "body{margin:0;font-size:18px}a{color:#00f}h1{font-size:48px;font-weight:700}";
    var resultA = grunt.file.read("fixtures/output/style.css");
    test.equal(expectA, resultA, "should concat and minify an array of css files in order using clean-css");

    test.done();
  }
};