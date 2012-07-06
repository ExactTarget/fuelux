var grunt = require("grunt");

exports.jade = {
  main: function(test) {
    test.expect(4);

    var expectA = '<div id="test" class="test"><span id="data">data</span><div>testing</div></div>';
    var resultA = grunt.file.read("fixtures/output/jade.html");
    test.equal(expectA, resultA, "should compile jade templates to html");

    var expectB = '<div id="test" class="test"><span id="data">data</span><div>testing 2</div></div>';
    var resultB = grunt.file.read("fixtures/output/jade2.html");
    test.equal(expectB, resultB, "should compile jade templates to html (multiple files support)");

    var expectC = "<html><head><title>TEST</title></head><body></body></html><p>hello jade test</p>";
    var resultC = grunt.file.read("fixtures/output/jadeInclude.html");
    test.equal(expectC, resultC, "should compile jade templates to html with an include");

    var expectD = "<div>" + grunt.template.today("yyyy") + "</div>";
    var resultD = grunt.file.read("fixtures/output/jadeTemplate.html");
    test.equal(expectD, resultD, "should compile jade templates to html with grunt template support");

    test.done();
  }
};