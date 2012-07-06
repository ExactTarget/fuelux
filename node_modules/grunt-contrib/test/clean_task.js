var grunt = require("grunt");

exports.clean = {
  main: function(test) {
    test.expect(1);

    var expectA = false;
    var resultA = require("path").existsSync("fixtures/output");
    test.equal(resultA, expectA, "should rm -rf a directory");

    test.done();
  }
};