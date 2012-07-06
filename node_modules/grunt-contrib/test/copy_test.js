var grunt = require("grunt");

grunt.loadTasks("../tasks");

exports.copy = {
  main: function(test) {
    var fs = require("fs");

    test.expect(5);

    var expectA = ["test.css", "test.js"];
    var resultA = fs.readdirSync("fixtures/output/copy_test_files");
    test.deepEqual(expectA, resultA, "should copy several files (including prefixed file)");

    var expectB = ["folder_one", "folder_two", "test.css", "test.js"];
    var resultB = fs.readdirSync("fixtures/output/copy_test_folders");
    test.deepEqual(expectB, resultB, "should copy several folders and files");

    var expectC = ["folder_one", "test.css", "test.js"];
    var resultC = fs.readdirSync("fixtures/output/copy_test_array");
    test.deepEqual(expectC, resultC, "should copy several folders and files (based on array)");

    var expectD = ["folder_one", "folder_two", "test.css", "test.js"];
    var resultD = fs.readdirSync("fixtures/output/copy_test_v0.3.9");
    test.deepEqual(expectD, resultD, "should copy several folders and files (dest variable)");

    var expectE = ["copy_test.js"];
    var resultE = fs.readdirSync("fixtures/output/copy_test_root");
    test.deepEqual(expectE, resultE, "should copy a file from root working dir");

    test.done();
  }
};