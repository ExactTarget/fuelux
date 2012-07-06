var grunt = require("grunt");

exports.coffee = {
  main: function(test) {
    test.expect(2);

    var expectA = "var HelloWorld;\n\nHelloWorld = (function() {\n\n  function HelloWorld() {}\n\n  HelloWorld.test = 'test';\n\n  return HelloWorld;\n\n})();\n";
    var resultA = grunt.file.read("fixtures/output/coffee_basic.js");
    test.equal(expectA, resultA, "should compile coffeescript to javascript");

    var expectB = "var HelloWorld;\n\nHelloWorld = (function() {\n\n  function HelloWorld() {}\n\n  HelloWorld.test = 'test';\n\n  return HelloWorld;\n\n})();\n\n\nconsole.log('hi');\n";
    var resultB = grunt.file.read("fixtures/output/coffee_combined.js");
    test.equal(expectB, resultB, "should compile multiple coffeescript files to a single javascript file");

    test.done();
  }
};