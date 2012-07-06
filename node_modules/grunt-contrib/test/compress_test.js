var grunt = require("grunt"),
    _ = grunt.utils._;

grunt.loadTasks("../tasks");

exports.zip = {
  main: function(test) {
    function getSize(filename) {
      try {
        return require("fs").statSync(filename).size;
      } catch (e) {
        return 0;
      }
    }

    test.expect(17);

    // Zip Tests
    var expectA = 314;
    var resultA = getSize("fixtures/output/compress_test_files.zip");
    test.equal(expectA, resultA, "should compress files into zip");

    var expectB = 1346;
    var resultB = getSize("fixtures/output/compress_test_folders.zip");
    test.equal(expectB, resultB, "should compress folders and their files into zip");

    var expectC = 642;
    var resultC = getSize("fixtures/output/compress_test_array.zip");
    test.equal(expectC, resultC, "should compress array of files and folders into zip");

    var expectD = 394;
    var resultD = getSize("fixtures/output/compress_test_files_template.zip");
    test.equal(expectD, resultD, "should compress files and folders into zip (grunt template in source)");

    var expectE = 1346;
    var resultE = getSize("fixtures/output/compress_test_v0.3.9.zip");
    test.equal(expectE, resultE, "should compress files and folders into zip (grunt template in dest)");

    // Tar Tests
    var expectF = 3072;
    var resultF = getSize("fixtures/output/compress_test_files.tar");
    test.equal(expectF, resultF, "should add files into tar");

    var expectG = 10752;
    var resultG = getSize("fixtures/output/compress_test_folders.tar");
    test.equal(expectG, resultG, "should add folders and their files into tar");

    var expectH = 5632;
    var resultH = getSize("fixtures/output/compress_test_array.tar");
    test.equal(expectH, resultH, "should add array of files and folders into tar");

    var expectI = 3584;
    var resultI = getSize("fixtures/output/compress_test_files_template.tar");
    test.equal(expectI, resultI, "should add files and folders into tar (grunt template in source)");

    var expectJ = 10752;
    var resultJ = getSize("fixtures/output/compress_test_v0.3.9.tar");
    test.equal(expectJ, resultJ, "should add files and folders into tar (grunt template in dest)");

    // Tar Gzip Tests
    var expectK = true;
    var resultK = getSize("fixtures/output/compress_test_files.tgz") >= 200;
    test.equal(expectK, resultK, "should compress files into tar");

    var expectL = true;
    var resultL = getSize("fixtures/output/compress_test_folders.tgz") >= 350;
    test.equal(expectL, resultL, "should compress folders and their files into tgz");

    var expectM = true;
    var resultM = getSize("fixtures/output/compress_test_array.tgz") >= 300;
    test.equal(expectM, resultM, "should compress array of files and folders into tgz");

    var expectN = true;
    var resultN = getSize("fixtures/output/compress_test_files_template.tgz") >= 225;
    test.equal(expectN, resultN, "should compress files and folders into tgz (grunt template in source)");

    var expectO = true;
    var resultO = getSize("fixtures/output/compress_test_v0.3.9.tgz") >= 300;
    test.equal(expectO, resultO, "should compress files and folders into tgz (grunt template in dest)");

    // Gzip Tests
    var expectP = 52;
    var resultP = getSize("fixtures/output/compress_test_file.gz");
    test.equal(expectP, resultP, "should gzip file");

    var expectQ = 67;
    var resultQ = getSize("fixtures/output/compress_test_file2.gz");
    test.equal(expectQ, resultQ, "should gzip another file (multiple dest:source pairs)");

    test.done();
  }
};