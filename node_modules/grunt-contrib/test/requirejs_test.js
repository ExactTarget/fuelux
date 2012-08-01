var grunt = require("grunt");

exports.requirejs = {
  main: function(test) {
    test.expect(1);

    var expectA = 'define("hello",[],function(){return"hello"}),define("world",[],function(){return"world"}),require(["hello","world"],function(e,t){console.log(e,t)}),define("project",function(){})';
    var resultA = grunt.file.read("fixtures/output/requirejs.js");
    test.equal(expectA, resultA, "should optimize javascript modules with requireJS");

    test.done();
  },
  template: function(test) {
    test.expect(1);

    var expectA = 'define("hello",[],function(){return"hello"}),define("world",[],function(){return"world"}),require(["hello","world"],function(e,t){console.log(e,t)}),define("project",function(){})';
    var resultA = grunt.file.read("fixtures/output/requirejs-template.js");
    test.equal(expectA, resultA, "should process options with template variables.");

    test.done();
  }
};