var grunt = require("grunt");

exports.jade = {
  main: function(test) {
    test.expect(1);

    var expectA = "this['JST'] = this['JST'] || {};\n\nthis['JST']['fixtures/jst/template.html'] = function(obj){\nvar __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'')};\nwith(obj||{}){\n__p+='<head><title>'+\n((__t=( title ))==null?'':__t)+\n'</title></head>';\n}\nreturn __p;\n}";
    var resultA = grunt.file.read("./fixtures/output/jst.js");
    test.equal(expectA, resultA, "should compile underscore templates into JST");

    test.done();
  }
};