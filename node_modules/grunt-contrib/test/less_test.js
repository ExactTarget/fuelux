var grunt = require("grunt");

exports.less = {
  main: function(test) {
    test.expect(2);

    var expectA = "body {\n  color: #ffffff;\n}\n";
    var resultA = grunt.file.read("fixtures/output/less_a.css");
    test.equal(expectA, resultA, "should compile less, with the ability to handle imported files from alternate include paths");

    var expectB = "body {\n  color: #ffffff;\n}\n";
    var resultB = grunt.file.read("fixtures/output/less_b.css");
    test.equal(expectB, resultB, "should support multiple destination:source sets");

    test.done();
  }
};