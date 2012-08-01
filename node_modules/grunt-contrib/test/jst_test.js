var grunt = require("grunt");

exports.jade = {
  main: function(test) {
    test.expect(1);

    var expectA = "this['JST'] = this['JST'] || {};\n\nthis['JST']['fixtures/jst/template.html'] = function(obj){\nvar __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\nwith(obj||{}){\n__p+='<head><title>'+\n( title )+\n'</title></head>';\n}\nreturn __p;\n};";
    var resultA = grunt.file.read("fixtures/output/jst.js");
    test.equal(expectA, resultA, "should compile underscore templates into JST");

    test.done();
  }
};