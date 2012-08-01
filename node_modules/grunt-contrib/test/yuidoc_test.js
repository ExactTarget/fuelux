var grunt = require("grunt");

// TODO: ditch this when grunt v0.4 is released
var fs = require("fs");
var path = require("path");
grunt.file.exists = grunt.file.exists || fs.existsSync || path.existsSync;

exports.yuidoc = {
  main: function(test) {
    test.expect(4);

    var expectA = true;
    var resultA = grunt.file.exists("fixtures/output/yuidoca/data.json");
    test.equal(resultA, expectA, "If provided with a string path, Should generate JSON from source code");

    var expectB = true;
    var resultB = grunt.file.exists("fixtures/output/yuidoca/index.html");
    test.equal(resultB, expectB, "If provided with a string path, Should create template files for viewing data.json");

    var expectC = true;
    var resultC = grunt.file.exists("fixtures/output/yuidocb/data.json");
    test.equal(resultC, expectC, "If provided with an array of paths, should generate JSON from source code");

    var expectD = true;
    var resultD = grunt.file.exists("fixtures/output/yuidocb/index.html");
    test.equal(resultD, expectD, "If provided with an array of paths, should create template files for viewing data.json");

    test.done();
  }
};