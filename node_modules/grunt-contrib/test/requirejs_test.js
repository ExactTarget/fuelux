var grunt = require("grunt");

exports.stylus = {
  main: function(test) {
    test.expect(1);

    var expectA = 'define("hello",[],function(){return"hello"}),define("world",[],function(){return"world"}),require(["hello","world"],function(hello,world){console.log(hello,world)}),define("project",function(){})';
    var resultA = grunt.file.read("fixtures/output/requirejs.js");
    test.equal(expectA, resultA, "should optimize javascript modules with requireJS");

    test.done();
  }
};